
import { WIDTH, HEIGHT, CENTER_X, LEVELS, PLAYER_SCALE, PLAYER_HIT_RADIUS } from './config.js';
import { createPixelText } from './ui_utils.js';
import { sounds } from './sounds.js';
import { Storage } from './storage.js';
import { initLevelSelect } from './scene_level_select.js';
import { BulletManager } from './bullet.js';

// ★追加: 背景の状態を保持する変数 (モジュールスコープ)
let savedMapState = null;

export class GameScene {
    constructor(app, layers, levelIndex) {
        this.app = app;
        this.layers = layers;
        this.levelIndex = levelIndex;
        this.level = LEVELS[levelIndex];
        this.isPaused = false;
        this.isGameOver = false;

        this.playerSpeed = 8;
        this.keys = {};

        this.gameTime = 60.0;
        this.movementTime = 0;
        this.scoreQueues = [];
        
        // グレイズ用パラメータ
        this.grazeTime = 0;
        this.grazeRadius = 40; 

        this.bulletManager = null;
        
        // Stage 8 Warning 演出用変数
        this.elapsedForWarning = 0;
        this.inWarningSequence = false;
        this.warningPhase = 0; 
        this.warningUI = null;

        this.init();
    }

    init() {
        const config = Storage.loadConfig();
        sounds.setBGMVolume(config.bgmVolume);

        if (this.app._bgScrollTask) {
            this.app.ticker.remove(this.app._bgScrollTask);
            this.app._bgScrollTask = null;
        }

        // --- 1. 背景 ---
        this.layers.bgLayer.removeChildren();
        this.bgContainer = new PIXI.Container();
        this.layers.bgLayer.addChild(this.bgContainer);

        this.mapSprites = [];
        for (let i = 0; i <= 17; i++) {
            const tex = PIXI.Assets.get(`map_${i}`);
            if (!tex) continue;
            const spr = new PIXI.Sprite(tex);
            spr.width = WIDTH;
            spr.height = HEIGHT;
            
            // ★変更: 保存された位置があれば復元、なければ初期位置
            if (savedMapState && savedMapState.sprites[i] !== undefined) {
                spr.y = savedMapState.sprites[i];
            } else {
                spr.y = -HEIGHT * i;
            }

            // 色と明るさの設定
            const baseColor = this.level.bgTint;
            const brightness = this.level.bgBrightness;
            const r = (baseColor >> 16) & 0xFF;
            const g = (baseColor >> 8) & 0xFF;
            const b = baseColor & 0xFF;
            const newR = Math.floor(Math.min(255, r * brightness));
            const newG = Math.floor(Math.min(255, g * brightness));
            const newB = Math.floor(Math.min(255, b * brightness));
            spr.tint = (newR << 16) | (newG << 8) | newB;
            spr.alpha = 1.0;

            this.bgContainer.addChild(spr);
            this.mapSprites.push(spr);
        }

        // ★追加: コンテナのY座標も復元
        if (savedMapState) {
            this.bgContainer.y = savedMapState.containerY;
        }

        // --- 2. プレイヤー ---
        this.player = new PIXI.Sprite(PIXI.Assets.get('player'));
        this.player.anchor.set(0.5);
        this.player.x = CENTER_X;
        this.player.y = HEIGHT - 200;
        this.player.scale.set(PLAYER_SCALE);

        this.hitArea = new PIXI.Graphics();
        this.hitArea.beginFill(0xFFFFFF);
        this.hitArea.drawCircle(0, 0, PLAYER_HIT_RADIUS);
        this.hitArea.endFill();
        this.player.addChild(this.hitArea);

        this.hitColors = [0xFFFF00, 0x00FF00, 0xFFFFFF, 0xFF00FF];
        this.colorIndex = 0;
        this.frameCount = 0;

        this.layers.uiLayer.addChild(this.player);

        // --- 3. 弾幕マネージャ ---
        this.bulletManager = new BulletManager(this.app, this.layers.bltLayer, this.player, this.levelIndex);

        // --- 4. タイマー表示 ---
        this.timerText = createPixelText("60", CENTER_X, 80, 80);
        this.timerText.style.fontFamily = "Courier New";
        this.timerText.style.fontWeight = "bold";
        this.layers.uiLayer.addChild(this.timerText);

        // --- 5. BGM再生 ---
        sounds.playBGM(this.level.bgm);

        // --- 6. 操作イベント ---
        this.onKeyDown = (e) => this.keys[e.code] = true;
        this.onKeyUp = (e) => this.keys[e.code] = false;
        this.onPause = (e) => {
            if (this.isGameOver) return;
            if (this.inWarningSequence) return;
            if (e.code === 'Escape' || e.code === 'KeyP') {
                this.togglePause();
            }
        };

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keydown', this.onPause);
        
        // --- 7. Stage 8 Warning初期化 ---
        if (this.levelIndex === 7) { 
            this.warningPhase = 1; 
            this.elapsedForWarning = 0;
            this.inWarningSequence = true; 
        }

        // --- 8. ループ開始 ---
        this.tickerTask = (delta) => this.update(delta);
        this.app.ticker.add(this.tickerTask);
    }

    update(delta) {
        if (this.isPaused) return;

        this.frameCount++;
        if (this.frameCount % 2 === 0) {
            this.colorIndex = (this.colorIndex + 1) % this.hitColors.length;
            this.hitArea.tint = this.hitColors[this.colorIndex];
        }

        if (!this.isGameOver) {
            // 背景スクロール処理
            const scrollSpeed = (HEIGHT / (22 * 60)) * delta;
            this.bgContainer.y += scrollSpeed;
            this.mapSprites.forEach(spr => {
                const globalY = spr.y + this.bgContainer.y;
                if (globalY >= HEIGHT) {
                    // 一番下まで行ったら一番上に戻すロジック
                    // 既存のSpriteの中で一番小さいY座標を探す
                    let minY = 0;
                    this.mapSprites.forEach(s => { if (s.y < minY) minY = s.y; });
                    spr.y = minY - HEIGHT;
                }
            });
            
            // ★追加: 現在の背景状態を保存 (毎フレーム更新)
            savedMapState = {
                containerY: this.bgContainer.y,
                sprites: this.mapSprites.map(s => s.y)
            };

            // Warning演出制御
            if (this.levelIndex === 7 && this.warningPhase !== 3) {
                this.elapsedForWarning += (delta / 60);

                if (this.warningPhase === 1 && this.elapsedForWarning >= 1.7) {
                    this.warningPhase = 2; 
                    this.startWarningEffect();
                }

                if (this.warningPhase === 2 && this.elapsedForWarning >= (1.7 + 5.0)) {
                    this.warningPhase = 3; 
                    this.endWarningEffect();
                    this.inWarningSequence = false;
                }
            }

            if (!this.inWarningSequence) {
                const oldTimeInt = Math.ceil(this.gameTime);
                this.gameTime -= (delta / 60);
                if (this.gameTime < 0) this.gameTime = 0;

                const newTimeInt = Math.ceil(this.gameTime);
                this.timerText.text = newTimeInt.toString();

                if (newTimeInt <= 10 && newTimeInt > 0) {
                    if (newTimeInt < oldTimeInt) {
                        sounds.playSE('countdown');
                        this.timerText.style.fontSize = 120;
                        this.timerText.style.fill = 0xFF0000;
                        gsap.to(this.timerText.style, { fontSize: 80, duration: 0.5 });
                    }
                } else {
                    this.timerText.style.fill = 0xFFFFFF;
                }
            }

            const distX = this.player.x - this.timerText.x;
            const distY = this.player.y - this.timerText.y;
            const dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < 300) {
                this.timerText.alpha = Math.max(0.2, dist / 300);
            } else {
                this.timerText.alpha = 1.0;
            }

            if (this.bulletManager) {
                this.bulletManager.update(delta, this.gameTime);
                if (this.bulletManager.checkCollision(PLAYER_HIT_RADIUS)) {
                    this.finishGame(false);
                    return;
                }
                
                const isGrazing = this.bulletManager.checkGraze(this.grazeRadius);
                if (isGrazing) {
                    this.grazeTime += (delta / 60);
                }
            }

            // ★修正: 0秒になったらクリア判定
            if (this.gameTime <= 0) {
                this.finishGame(true);
            }
        }
        
        // プレイヤー移動
        let vx = 0;
        let vy = 0;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) vy -= 1;
        if (this.keys['ArrowDown'] || this.keys['KeyS']) vy += 1;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) vx -= 1;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) vx += 1;

        if (vx !== 0 || vy !== 0) {
            if (!this.isGameOver && !this.inWarningSequence) {
                this.movementTime += (delta / 60);
            }
            let currentSpeed = this.playerSpeed;
            if (this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['KeyX']) {
                currentSpeed *= 0.5;
            }
            this.player.x += vx * currentSpeed * delta;
            this.player.y += vy * currentSpeed * delta;
        }

        const margin = 20;
        this.player.x = Math.max(margin, Math.min(WIDTH - margin, this.player.x));
        this.player.y = Math.max(margin, Math.min(HEIGHT - margin, this.player.y));
    }

    startWarningEffect() {
        if (sounds.currentBGM) sounds.currentBGM.pause();
        sounds.playSE('warning'); 

        this.warningUI = new PIXI.Container();
        this.layers.uiLayer.addChild(this.warningUI);

        const redBg = new PIXI.Graphics();
        redBg.beginFill(0xFF0000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
        redBg.alpha = 0;
        this.warningUI.addChild(redBg);
        gsap.to(redBg, { alpha: 0.3, duration: 0.1, yoyo: true, repeat: -1 });

        const warningText = createPixelText("WARNING!", CENTER_X, HEIGHT / 2 - 100, 120);
        warningText.style.fill = 0xFF0000;
        warningText.style.fontWeight = 'bold';
        this.warningUI.addChild(warningText);
        gsap.to(warningText.scale, { x: 1.2, y: 1.2, duration: 0.2, yoyo: true, repeat: -1 });

        const subText = createPixelText("This level is ...", CENTER_X, HEIGHT / 2 + 50, 60);
        subText.style.fill = 0xFF0000;
        this.warningUI.addChild(subText);

        const readyText = createPixelText("Get READY!", CENTER_X, HEIGHT / 2 + 150, 80);
        readyText.style.fill = 0xFF0000;
        readyText.alpha = 0;
        this.warningUI.addChild(readyText);

        gsap.to([subText, readyText], { alpha: 0, duration: 0.05, yoyo: true, repeat: -1, ease: "steps(1)" });
    }

    endWarningEffect() {
        if (this.warningUI) {
            gsap.killTweensOf(this.warningUI);
            this.warningUI.children.forEach(c => gsap.killTweensOf(c));
            this.warningUI.destroy();
            this.warningUI = null;
        }
        if (sounds.currentBGM) sounds.currentBGM.play();
    }

    finishGame(isClear) {
        this.isGameOver = true;
        this.isLevelClear = isClear; 
        this.timerText.text = "0";
        
        if (sounds.currentBGM) sounds.currentBGM.pause();

        if (isClear) {
            this.layers.bltLayer.removeChildren();
            if (this.bulletManager) this.bulletManager.clearAll();

            sounds.playSE('erase');
            sounds.playSE('stage_clear');
            this.showClearUI();
        } else {
            sounds.playSE('died');
            this.player.visible = false;

            const redCircle = new PIXI.Graphics();
            redCircle.beginFill(0xFF0000, 0.6);
            redCircle.drawCircle(0, 0, 10);
            redCircle.endFill();
            redCircle.x = this.player.x;
            redCircle.y = this.player.y;
            this.layers.uiLayer.addChild(redCircle);

            gsap.to(redCircle.scale, { x: 50, y: 50, duration: 2.0 });
            gsap.to(redCircle, { alpha: 0, duration: 2.0 });

            setTimeout(() => {
                this.showGameOverUI();
            }, 2000);
        }
    }

    showClearUI() {
        const ui = new PIXI.Container();
        this.layers.uiLayer.addChild(ui);

        const congText = createPixelText("Congratulations!", CENTER_X, HEIGHT / 2 - 200, 60);
        congText.style.fontWeight = 'bold';
        ui.addChild(congText);

        const clearText = createPixelText("Stage Clear !!", CENTER_X, HEIGHT / 2 - 100, 100);
        clearText.style.fill = 0xFFFF00;
        clearText.style.fontWeight = 'bold';
        ui.addChild(clearText);
        gsap.to(clearText.scale, { x: 1.1, y: 1.1, duration: 0.5, yoyo: true, repeat: -1 });

        this.calculateScores(true);
        this.setupScoreDisplay(ui);
    }

    showGameOverUI() {
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
        bg.alpha = 0;
        this.layers.uiLayer.addChild(bg);
        gsap.to(bg, { alpha: 1, duration: 1.0 });

        sounds.playSE('gameover');

        const goText = createPixelText("Game Over !", CENTER_X, HEIGHT / 2 - 200, 100);
        goText.style.fill = 0xFF0000;
        goText.style.fontWeight = 'bold';
        goText.alpha = 0;
        this.layers.uiLayer.addChild(goText);

        gsap.to(goText, { alpha: 1, duration: 1.0, delay: 0.5 });
        gsap.to(goText, { y: goText.y + 20, duration: 1.0, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.5 });

        this.calculateScores(false);
        this.setupScoreDisplay(this.layers.uiLayer);
    }

    setupScoreDisplay(parentContainer) {
        const firstLabel = this.scoreQueues.length > 0 ? this.scoreQueues[0].label : "";

        this.earnedLabelText = createPixelText(firstLabel, CENTER_X + 180, HEIGHT / 2 + 50, 50);
        this.earnedLabelText.anchor.set(1, 0.5);
        this.earnedLabelText.style.fontWeight = 'bold';

        const firstScore = this.scoreQueues.length > 0 ? this.scoreQueues[0].points : 0;
        const earnedVal = createPixelText(`${firstScore}`, CENTER_X + 300, HEIGHT / 2 + 50, 50);
        earnedVal.anchor.set(1, 0.5);
        earnedVal.style.fontWeight = 'bold';

        const progress = Storage.loadProgress();
        let currentTotal = progress.points;

        const yourLabel = createPixelText("Your rank pts", CENTER_X + 180, HEIGHT / 2 + 150, 50);
        yourLabel.anchor.set(1, 0.5);
        yourLabel.style.fontWeight = 'bold';

        const yourVal = createPixelText(`${currentTotal}`, CENTER_X + 300, HEIGHT / 2 + 150, 50);
        yourVal.anchor.set(1, 0.5);
        yourVal.style.fill = 0x00FF00;
        yourVal.style.fontWeight = 'bold';

        this.earnedLabelText.alpha = 0;
        earnedVal.alpha = 0;
        yourLabel.alpha = 0;
        yourVal.alpha = 0;

        parentContainer.addChild(this.earnedLabelText, earnedVal, yourLabel, yourVal);

        const fadeInDelay = this.isLevelClear ? 0 : 1.0;

        gsap.to([this.earnedLabelText, earnedVal, yourLabel, yourVal], {
            alpha: 1,
            duration: 0.5,
            delay: fadeInDelay
        });

        const waitTime = this.isLevelClear ? 8000 : 4000;

        setTimeout(() => {
            this.runScoreAnimation(earnedVal, yourVal, currentTotal);
        }, waitTime + (fadeInDelay * 1000));
    }

    calculateScores(isClear) {
        this.scoreQueues = [];
        const stats = Storage.getLevelStat(Storage.loadProgress(), this.levelIndex);
        const survivedTime = Math.floor(60 - this.gameTime);
        const remainingTime = Math.ceil(this.gameTime);

        if (isClear) {
            this.scoreQueues.push({ label: "Stage Clear", points: 100 });
            // 初クリア判定: まだクリアフラグが立っていない かつ 今回が1回目の挑戦なら
            // ただし、attemptsは開始時に+1されているので、1回目ならattempts=1
            const isFirstClear = !stats.cleared;
            if (isFirstClear && stats.attempts === 1) {
                this.scoreQueues.push({ label: "First Attempt Clear", points: 150 });
            }
            if (this.movementTime <= 6.0) {
                this.scoreQueues.push({ label: "Minimal Movement Bonus", points: 200 });
            }
        } else {
            this.scoreQueues.push({ label: "Survived Time", points: survivedTime });
            if (remainingTime <= 15) {
                this.scoreQueues.push({ label: "Last stand 15s bonus", points: 10 });
            }
            if (remainingTime <= 5) {
                this.scoreQueues.push({ label: "Final 5s bonus", points: 20 });
            }
            if (remainingTime <= 1) {
                this.scoreQueues.push({ label: "Epic game over", points: 50 });
            }
        }
        
        if (this.grazeTime > 0) {
            const grazePoints = Math.floor(this.grazeTime * 2);
            if (grazePoints > 0) {
                this.scoreQueues.push({ label: "Graze Bonus", points: grazePoints });
            }
        }

        let tempTotal = Storage.loadProgress().points;
        let totalEarned = 0;
        this.scoreQueues.forEach(q => totalEarned += q.points);

        const oldK = Math.floor(tempTotal / 1000);
        const newK = Math.floor((tempTotal + totalEarned) / 1000);

        if (newK > oldK) {
            this.scoreQueues.push({ label: "1K Increments Bonus", points: 100 });
        }
    }

async runScoreAnimation(earnedText, yourText, startTotal) {
        let currentTotal = startTotal;

        for (let i = 0; i < this.scoreQueues.length; i++) {
            const item = this.scoreQueues[i];

            if (i > 0) {
                await gsap.to([this.earnedLabelText, earnedText], { alpha: 0, duration: 0.3 });
                this.earnedLabelText.text = item.label;
                earnedText.text = `${item.points}`;
                await gsap.to([this.earnedLabelText, earnedText], { alpha: 1, duration: 0.3 });
            } else {
                this.earnedLabelText.text = item.label;
                earnedText.text = `${item.points}`;
            }

            let remaining = item.points;
            const step = remaining > 200 ? 6 : 1;

            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (remaining <= 0) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }

                    const sub = Math.min(step, remaining);
                    remaining -= sub;
                    currentTotal += sub;

                    earnedText.text = `${remaining}`;
                    yourText.text = `${currentTotal}`;

                    sounds.playSE('enter', 0, false);

                }, 16);
            });

            await new Promise(r => setTimeout(r, 500));
        }

        // ★修正箇所: 正しいクリアフラグ (this.isLevelClear) を渡す
        this.saveAndExit(currentTotal, this.isLevelClear);
    }

    saveAndExit(newTotalPoints, isClear) {
        // 1. 最新の進捗データをロード
        const progress = Storage.loadProgress();
        progress.points = newTotalPoints;

        // 2. levelStats配列/オブジェクトの初期化確認
        if (!progress.levelStats) progress.levelStats = {};

        // 3. 現在のレベルのデータを取得
        // データが存在しない場合（万が一の保存漏れ対策）は、attemptsを1（今回のプレイ分）として初期化
        let currentLevelStat = progress.levelStats[this.levelIndex];
        if (!currentLevelStat) {
            currentLevelStat = { cleared: false, attempts: 1, deaths: 0, firstClearAttempt: null };
        }

        // ★修正: attempts が 0 または未定義の場合、最低でも1にする（今回のプレイをカウント）
        if (!currentLevelStat.attempts || currentLevelStat.attempts < 1) {
            currentLevelStat.attempts = 1;
        }

        // 4. クリア判定・死亡判定の更新
        if (isClear) {
            // まだクリアしていない、もしくはクリア済みだが初回記録がバグで欠落している場合
            if (!currentLevelStat.cleared || !currentLevelStat.firstClearAttempt) {
                currentLevelStat.cleared = true;
                // 今回の挑戦回数を初回クリア回数として記録
                currentLevelStat.firstClearAttempt = currentLevelStat.attempts;
            }
        } else {
            currentLevelStat.deaths = (currentLevelStat.deaths || 0) + 1;
        }

        // 5. 更新した統計情報を progress オブジェクトに確実に書き戻す
        progress.levelStats[this.levelIndex] = currentLevelStat;

        // 6. 進行度(Total Progress)の再計算
        let clearedCount = 0;
        const TOTAL_STAGES = 8;
        for (let i = 0; i < TOTAL_STAGES; i++) {
            const stat = progress.levelStats[i];
            if (stat && stat.cleared) {
                clearedCount++;
            }
        }
        progress.totalProgress = Math.floor((clearedCount / TOTAL_STAGES) * 100);

        // 7. localStorageへ保存
        Storage.saveProgress(progress);

        // --- シーン遷移 ---
        const black = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
        black.alpha = 0;
        this.layers.uiLayer.addChild(black);

        gsap.to(black, {
            alpha: 1,
            duration: 1.0,
            onComplete: () => {
                const root = this.layers.uiLayer.parent;
                root.addChild(black);
                this.destroy();
                sounds.playBGM('title_bgm');
                this.layers.bltLayer.removeChildren();
                this.layers.uiLayer.removeChildren();
                this.layers.flashLayer.removeChildren();
                initLevelSelect(this.app, this.layers, root);
                gsap.to(black, { alpha: 0, duration: 1.0, onComplete: () => { black.destroy(); } });
            }
        });
    }
    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            sounds.playSE('pause');
            if (sounds.currentBGM) sounds.currentBGM.pause();
            this.showPauseMenu();
        } else {
            if (sounds.currentBGM) sounds.currentBGM.play();
            this.hidePauseMenu();
        }
    }

    showPauseMenu() {
        this.pauseContainer = new PIXI.Container();
        this.layers.uiLayer.addChild(this.pauseContainer);

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.6);
        bg.drawRect(0, 0, WIDTH, HEIGHT);
        bg.endFill();
        this.pauseContainer.addChild(bg);

        const txt = createPixelText("PAUSE", CENTER_X, HEIGHT / 2 - 80, 80);
        this.pauseContainer.addChild(txt);

        const resumeBtn = this.createMenuButton("Resume", HEIGHT / 2 + 40, () => this.togglePause());
        this.pauseContainer.addChild(resumeBtn);

        const quitBtn = this.createMenuButton("Quit to Title", HEIGHT / 2 + 120, () => {
            window.location.reload();
        });
        this.pauseContainer.addChild(quitBtn);
    }

    hidePauseMenu() {
        if (this.pauseContainer) {
            this.pauseContainer.destroy();
            this.pauseContainer = null;
        }
    }

    createMenuButton(text, y, onClick) {
        const btn = createPixelText(text, CENTER_X, y, 40);
        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        btn.on('pointerover', () => btn.style.fill = 0xFFFF00);
        btn.on('pointerout', () => btn.style.fill = 0xFFFFFF);
        btn.on('pointerdown', onClick);

        return btn;
    }

    destroy() {
        this.app.ticker.remove(this.tickerTask);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('keydown', this.onPause);

        this.layers.uiLayer.removeChild(this.player);
        if (this.pauseContainer) this.pauseContainer.destroy();
        if (this.warningUI) {
            gsap.killTweensOf(this.warningUI);
            this.warningUI.destroy();
        }
    }
}