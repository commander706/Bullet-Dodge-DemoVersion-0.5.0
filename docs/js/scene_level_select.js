
import { WIDTH, HEIGHT, CENTER_X, LEVELS } from './config.js';
import { createPixelText } from './ui_utils.js';
import { sounds } from './sounds.js';
import { Storage } from './storage.js';
import { GameScene } from './play.js';

let state = {
    index: 0,
    lang: 'JP',
    mode: 'list', // 'list', 'detail', 'settings'
    detailCursor: 0, // 0: PLAY, 1: BACK
    isAnimating: false,
    config: Storage.loadConfig(),
    progress: Storage.loadProgress()
};

// 画面要素
let appRef;
let rootRef;
let layersRef;
let container;
let listContainer;
let listItems = []; // ここを初期化する必要がある
let arrowSprite;
let settingsContainer;
let bgLayerRef;
let progressContainer;
let helpText;
let langText;

let detailContainer;
let detailButtons = [];
export function initLevelSelect(app, layers, rootContainer) {
    appRef = app;
    layersRef = layers;
    rootRef = rootContainer;
    
    listItems = [];
    detailButtons = [];
    state.isAnimating = false;
    state.mode = 'list';
    
    window.removeEventListener('keydown', onKeyDown);

    const { uiLayer, bgLayer } = layers;
    bgLayerRef = bgLayer;

    // ★毎回最新のデータをロードする
    state.config = Storage.loadConfig();
    state.progress = Storage.loadProgress();
    
    sounds.setBGMVolume(state.config.bgmVolume);
    sounds.setSEVolume(state.config.seVolume);
    bgLayerRef.visible = state.config.bg;

    // 背景のセットアップ
    bgLayer.removeChildren();
    if (state.config.bg) {
        const bgTex = PIXI.Assets.get('bg');
        const scrollingBG = new PIXI.TilingSprite(bgTex, WIDTH, HEIGHT);
        scrollingBG.tileScale.set(1.5);
        bgLayer.addChild(scrollingBG);
        
        if (app._bgScrollTask) app.ticker.remove(app._bgScrollTask);
        const bgScrollTask = (delta) => {
            scrollingBG.tilePosition.x -= 2.5 * delta;
        };
        app.ticker.add(bgScrollTask);
        app._bgScrollTask = bgScrollTask;
    }

    container = new PIXI.Container();
    uiLayer.addChild(container);

    const titleText = createPixelText("Level Select", CENTER_X, 60, 70);
    container.addChild(titleText);

    // --- 右上情報エリア ---
    const infoGroup = new PIXI.Container();
    infoGroup.x = WIDTH - 350;
    infoGroup.y = 50;
    container.addChild(infoGroup);

    // ★進行度を計算済みの値から表示
    const progressLabel = createPixelText("ゲーム進行度", 150, 0, 32);
    const progressVal = createPixelText(`${state.progress.totalProgress}%`, 300, 0, 32);
    progressVal.style.fill = "#00FF00";

    const barBg = new PIXI.Graphics();
    barBg.beginFill(0x333333).drawRect(0, 25, 300, 15).endFill();

    const barFill = new PIXI.Graphics();
    barFill.beginFill(0x00FF00).drawRect(0, 25, 300 * (state.progress.totalProgress / 100), 15).endFill();

    const pointsText = createPixelText(`獲得ポイント: ${state.progress.points}`, 150, 70, 32);

    infoGroup.addChild(progressLabel, progressVal, barBg, barFill, pointsText);
    progressContainer = { label: progressLabel, val: progressVal, bar: barFill, pt: pointsText, group: infoGroup };

    // --- レベルリスト ---
    listContainer = new PIXI.Container();
    container.addChild(listContainer);

    const startY = 220;
    const rowHeight = 100;

    LEVELS.forEach((level, i) => {
        const y = startY + i * rowHeight;

        const rowGroup = new PIXI.Container();
        rowGroup.y = y;
        listContainer.addChild(rowGroup);

        const rowGfx = new PIXI.Graphics();
        rowGroup.addChild(rowGfx);

        const sep = new PIXI.Graphics();
        rowGroup.addChild(sep);

        const labelText = createPixelText("Level", CENTER_X - 450, 0, 36);
        const nameText = createPixelText("", CENTER_X + 50, 0, 42);
        nameText.style.fill = level.color;

        const statusText = createPixelText("", CENTER_X + 580, 0, 32);
        statusText.anchor.set(1, 0.5); 

        rowGroup.addChild(labelText, nameText, statusText);

        listItems.push({
            gfx: rowGfx,
            sep: sep,
            nameText: nameText,
            statusText: statusText,
            levelData: level,
            baseY: y,
            rowGroup: rowGroup
        });
    });

    arrowSprite = createPixelText(">", CENTER_X - 680, startY, 60);
    arrowSprite.style.fill = "#FFFF00";
    container.addChild(arrowSprite);

    detailContainer = new PIXI.Container();
    detailContainer.visible = false;
    detailContainer.alpha = 0;
    container.addChild(detailContainer);

    // (設定ボタン等のUI生成は省略、元のコードを維持)
    const settingBox = new PIXI.Graphics().lineStyle(4, 0xFFFFFF).beginFill(0x000000).drawRect(50, HEIGHT - 130, 90, 90).endFill();
    settingBox.eventMode = 'static'; settingBox.cursor = 'pointer';
    settingBox.on('pointerdown', toggleSettings);
    container.addChild(settingBox);

    const settingTex = PIXI.Assets.get('setting');
    const settingSprite = new PIXI.Sprite(settingTex);
    settingSprite.anchor.set(0.5); settingSprite.x = 95; settingSprite.y = HEIGHT - 85; settingSprite.width = 70; settingSprite.height = 70;
    container.addChild(settingSprite);

    const langBox = new PIXI.Graphics().lineStyle(4, 0xFFFFFF).beginFill(0x000000).drawRect(160, HEIGHT - 130, 90, 90).endFill();
    langBox.eventMode = 'static'; langBox.cursor = 'pointer';
    langBox.on('pointerdown', toggleLanguage);
    container.addChild(langBox);

    langText = createPixelText("JP", 205, HEIGHT - 85, 45);
    container.addChild(langText);

    helpText = createPixelText("上下キー: 選択 / Enter, Z: 決定", WIDTH - 350, HEIGHT - 70, 45);
    container.addChild(helpText);

    createSettingsModal(uiLayer);
    updateDisplay(false);
    window.addEventListener('keydown', onKeyDown);
}
function updateDisplay(animated = false) {
    if (langText) langText.text = state.lang;

    if (state.lang === 'JP') {
        progressContainer.label.text = "ゲーム進行度";
        progressContainer.pt.text = `獲得ポイント: ${state.progress.points}`;
        if (state.mode === 'list') helpText.text = "上下キー(WASD): 選ぶ / Enter: 決定";
        else helpText.text = "上下キー(WASD): 選ぶ / Enter: 決定";
    } else {
        progressContainer.label.text = "Progress";
        progressContainer.pt.text = `Points: ${state.progress.points}`;
        if (state.mode === 'list') helpText.text = "Up/Down(WASD): Choose / Enter: Decide";
        else helpText.text = "Up/Down(WASD): Choose / Enter: Decide";
    }

    if (state.mode === 'list') {
        listItems.forEach((item, i) => {
            const isSelected = (i === state.index);
            const baseName = (state.lang === 'JP') ? item.levelData.name_jp : item.levelData.name_en;
            item.nameText.text = baseName;

            const stats = Storage.getLevelStat(state.progress, i);
            gsap.killTweensOf(item.statusText);
            item.statusText.alpha = 1;

            if (stats.cleared) {
                item.statusText.text = (state.lang === 'JP') ? "クリア済" : "Cleared";
                item.statusText.style.fill = "#55FF55";
                item.statusText.style.dropShadow = true;
                item.statusText.style.dropShadowBlur = 10;
                item.statusText.style.dropShadowColor = "#00FF00";
                gsap.to(item.statusText, { alpha: 0.6, duration: 0.8, yoyo: true, repeat: -1 });
            } else {
                item.statusText.text = (state.lang === 'JP') ? "未クリア" : "Not Cleared";
                item.statusText.style.fill = "#888888";
                item.statusText.style.dropShadow = false;
            }

            gsap.killTweensOf(item.gfx);
            item.gfx.clear();
            item.sep.clear();

            if (isSelected) {
                item.gfx.lineStyle(8, 0xFFFF00, 1);
                item.gfx.beginFill(0xFFFF00, 0.2);
                item.sep.lineStyle(6, 0xFFFF00);
                item.gfx.alpha = 1.0;
                gsap.to(item.gfx, { alpha: 0.5, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
            } else {
                item.gfx.lineStyle(4, 0xFFFFFF, 1);
                item.gfx.beginFill(0x000000, 0.9);
                item.gfx.alpha = 1.0;
                item.sep.lineStyle(6, 0xFFFFFF);
            }

            item.gfx.drawRect(CENTER_X - 620, -45, 1240, 90);
            item.gfx.endFill();
            item.sep.moveTo(CENTER_X - 300, -45);
            item.sep.lineTo(CENTER_X - 300, 45);
        });

        if (arrowSprite && arrowSprite.visible) {
            const targetY = listItems[state.index].baseY;
            if (animated) {
                gsap.to(arrowSprite, { y: targetY, duration: 0.2, ease: "power2.out" });
            } else {
                arrowSprite.y = targetY;
            }
        }
    }
}

function onKeyDown(e) {
    if (state.settingsOpen || state.isAnimating) return;

    const isUp = (e.code === 'ArrowUp' || e.code === 'KeyW');
    const isDown = (e.code === 'ArrowDown' || e.code === 'KeyS');
    const isEnter = (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyZ');
    const isBack = (e.code === 'Backspace' || e.code === 'KeyX' || e.code === 'Escape');

    if (state.mode === 'list') {
        if (isUp) {
            state.index = (state.index - 1 + LEVELS.length) % LEVELS.length;
            sounds.playSE('select');
            updateDisplay(true);
        } else if (isDown) {
            state.index = (state.index + 1) % LEVELS.length;
            sounds.playSE('select');
            updateDisplay(true);
        } else if (isEnter) {
            sounds.playSE('enter');
            transitionToDetail(state.index);
        }

    } else if (state.mode === 'detail') {
        if (isUp || isDown) {
            state.detailCursor = (state.detailCursor === 0) ? 1 : 0;
            sounds.playSE('select');
            updateDetailCursor();
        } else if (isEnter) {
            if (state.detailCursor === 0) {
                // PLAY THIS LEVEL
                sounds.playSE('enter'); // 修正: 効果音を鳴らす
                const stats = Storage.getLevelStat(state.progress, state.index);
                Storage.updateLevelStat(state.progress, state.index, { attempts: stats.attempts + 1 });
                playStartSequence();
            } else {
                // BACK
                sounds.playSE('select');
                transitionToList();
            }
        } else if (isBack) {
            sounds.playSE('select');
            transitionToList();
        }
    }
}

function updateDetailCursor() {
    detailButtons.forEach((btn, i) => {
        const isSelected = (i === state.detailCursor);
        const color = (i === 0) ? 0x00FF00 : 0xAAAAAA; 

        btn.gfx.clear();
        const lineColor = isSelected ? 0xFFFF00 : color;
        const lineWidth = isSelected ? 6 : 4;

        btn.gfx.lineStyle(lineWidth, lineColor);
        btn.gfx.beginFill(0x000000, isSelected ? 0.8 : 1.0);
        btn.gfx.drawRect(-150, -40, 300, 80);
        btn.gfx.endFill();

        btn.text.style.fill = isSelected ? 0xFFFF00 : color;
    });
}

function toggleLanguage() {
    if (state.isAnimating) return;
    state.lang = (state.lang === 'JP') ? 'EN' : 'JP';
    sounds.playSE('enter');
    updateDisplay(false);
    if (state.mode === 'detail') showDetailContent(state.index);
}

function toggleSettings() {
    if (state.isAnimating) return;
    state.settingsOpen = !state.settingsOpen;
    settingsContainer.visible = state.settingsOpen;
    sounds.playSE('enter');
}

function transitionToDetail(index) {
    if (state.isAnimating) return;
    state.isAnimating = true;

    state.mode = 'detail';
    state.detailCursor = 0;
    arrowSprite.visible = false;

    listItems.forEach((item, i) => {
        if (i !== index) {
            gsap.to(item.rowGroup, { alpha: 0, duration: 0.3 });
        }
    });

    const targetRow = listItems[index].rowGroup;
    const targetY = 220;

    gsap.to(targetRow, {
        y: targetY,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            showDetailContent(index);
            state.isAnimating = false;
        }
    });
}

function transitionToList() {
    if (state.isAnimating) return;
    state.isAnimating = true;

    gsap.to(detailContainer, {
        alpha: 0,
        duration: 0.3,
        onComplete: () => {
            detailContainer.visible = false;

            const targetRow = listItems[state.index].rowGroup;
            const originalY = listItems[state.index].baseY;

            gsap.to(targetRow, {
                y: originalY,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    listItems.forEach(item => {
                        gsap.to(item.rowGroup, { alpha: 1, duration: 0.3 });
                    });
                    state.mode = 'list';
                    arrowSprite.visible = true;
                    updateDisplay(false);
                    state.isAnimating = false;
                }
            });
        }
    });
}
function playStartSequence() {
    // ゲーム開始シーケンスに入ったら、レベル選択画面の操作を受け付けないようにイベントを解除する
    window.removeEventListener('keydown', onKeyDown);

    state.isAnimating = true; 
    
    // 暗転用黒画面
    const blackScreen = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
    blackScreen.alpha = 0;
    rootRef.addChild(blackScreen); 

    sounds.setBGMVolume(0);
    
    // 通常の開始シーケンス
    const startGame = () => {
        // メニューを消す
        container.visible = false; 

        // ゲームシーンを暗転中に開始させる
        new GameScene(appRef, layersRef, state.index);

        // 黒画面をフェードアウトさせてゲーム画面を表示する
        gsap.to(blackScreen, {
            alpha: 0, 
            duration: 1.0, 
            onComplete: () => {
                blackScreen.destroy();
                state.isAnimating = false;
            }
        });
    };

    const tl = gsap.timeline();

    // 共通: 暗転 -> Game Start表示 -> 点滅
    tl.to(blackScreen, { alpha: 1, duration: 0.5 })
      .call(() => {
          sounds.playSE('stage_enter');
          
          const startText = createPixelText("Game Start !", CENTER_X, HEIGHT / 2, 80);
          startText.style.dropShadow = true;
          startText.style.dropShadowBlur = 10;
          startText.style.dropShadowColor = '#FF0000';
          rootRef.addChild(startText);
          
          // 点滅アニメーション
          gsap.to(startText, {
              alpha: 0,
              duration: 0.5,
              yoyo: true,
              repeat: 6, // 3秒かけて点滅くらいに見えるが、duration 0.5 * 2 * (6+1)/2 = 3.5秒？ 実際は repeat: 6 だと (0.5+0.5)*3.5 = 3.5s ではない。
                         // 0.5秒で消え、0.5秒で現れ...を繰り返す。
                         // ここでは元コードの挙動を維持。
              ease: "steps(1)", 
              onComplete: () => {
                  rootRef.removeChild(startText);
                  
                  // ★修正: Stage 8の場合はWarning演出へ、それ以外は即ゲーム開始
                  if (state.index === 7) { // Stage 8 Index
                      // Warning演出開始 (文字が消えた後、少し間を置く)
                      setTimeout(() => {
                          playWarningSequence(blackScreen);
                      }, 1300); // GAME START表示開始(t=0.5)から1.8秒後にWarning開始したい
                                // ここは tl.call の時点で t=0.5。アニメーション完了(onComplete)までは時間が経っている。
                                // 文字点滅が duration 0.5 で repeat 6 なら合計 0.5 * 7 = 3.5秒かかる。
                                // ユーザー指定は「GAME START!の演出中から1.8秒後」。
                                // つまり文字が出ている最中にWarningが出る必要がある。
                                // GSAPのアニメーションを待たずに並行してWarningを予約する。
                  } else {
                      startGame();
                  }
              }
          });

          // ★Stage 8の場合: 途中からWarningを割り込ませる
          if (state.index === 7) {
              // GAME START表示開始から1.8秒後にWarning開始
              // ※tl.callの時点が「表示開始」
              setTimeout(() => {
                  // Game Start文字を強制消去
                  if (startText.parent) startText.parent.removeChild(startText);
                  gsap.killTweensOf(startText); // 点滅アニメーション停止
                  
                  // Warning演出開始
                  playWarningSequence(blackScreen);
              }, 1800); 
          }
      });
      
    // Warning演出関数
    const playWarningSequence = (blackBg) => {
        // Warning音再生
        sounds.playSE('warning');

        // UIコンテナ作成 (黒画面の上に表示)
        const warningUI = new PIXI.Container();
        rootRef.addChild(warningUI);

        // 赤フラッシュ背景
        const redBg = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
        redBg.alpha = 0;
        warningUI.addChild(redBg);
        
        // 激しい点滅
        gsap.to(redBg, { alpha: 0.3, duration: 0.1, yoyo: true, repeat: -1 });

        // テキスト表示
        const warningText = createPixelText("WARNING!", CENTER_X, HEIGHT / 2 - 100, 120);
        warningText.style.fill = 0xFF0000;
        warningText.style.fontWeight = 'bold';
        warningUI.addChild(warningText);
        gsap.to(warningText.scale, { x: 1.2, y: 1.2, duration: 0.2, yoyo: true, repeat: -1 });

        const subText = createPixelText("This level is ...", CENTER_X, HEIGHT / 2 + 50, 60);
        subText.style.fill = 0xFF0000;
        warningUI.addChild(subText);

        const readyText = createPixelText("Get READY!", CENTER_X, HEIGHT / 2 + 150, 80);
        readyText.style.fill = 0xFF0000;
        readyText.alpha = 0;
        warningUI.addChild(readyText);

        // テキストの高速点滅
        gsap.to([subText, readyText], { alpha: 0, duration: 0.05, yoyo: true, repeat: -1, ease: "steps(1)" });

        // 5秒後にゲーム開始
        setTimeout(() => {
            // Warning UI 消去
            gsap.killTweensOf(redBg);
            gsap.killTweensOf(warningText);
            gsap.killTweensOf(warningText.scale);
            gsap.killTweensOf([subText, readyText]);
            warningUI.destroy();

            // ゲーム開始
            startGame();
        }, 5000);
    };
}
function getDifficultyStars(diffStr) {
    const map = {
        'Easy': { stars: '★☆☆☆☆', color: 0x00FF00 },
        'Normal': { stars: '★★☆☆☆', color: 0x00FFFF },
        'Hard': { stars: '★★★☆☆', color: 0xFFA500 },
        'Lunatic': { stars: '★★★★☆', color: 0xFF0000 },
        'Extra': { stars: '★★★★★', color: 0xFF00FF }
    };
    return map[diffStr] || { stars: '?????', color: 0xFFFFFF };
}

async function showDetailContent(index) {
    detailContainer.removeChildren();
    detailContainer.visible = true;
    detailContainer.alpha = 0;
    detailButtons = [];

    const level = LEVELS[index];
    const stats = Storage.getLevelStat(state.progress, index);

    let previewSprite;
    const previewName = level.preview || 'default.png';
    const previewPath = `assets/textures/level_preview/${previewName}`;

    try {
        const texture = await PIXI.Assets.load(previewPath);
        previewSprite = new PIXI.Sprite(texture);
    } catch (e) {
        const gfx = new PIXI.Graphics().beginFill(0x222222).drawRect(0, 0, 700, 500).endFill();
        const noImgText = createPixelText("NO IMAGE", 350, 250, 40);
        gfx.addChild(noImgText);
        previewSprite = gfx;
    }

    previewSprite.width = 700;
    previewSprite.height = 500;
    previewSprite.x = CENTER_X - 700;
    previewSprite.y = 350;

    const previewBorder = new PIXI.Graphics();
    previewBorder.lineStyle(4, 0xFFFFFF).drawRect(CENTER_X - 700, 350, 700, 500);

    detailContainer.addChild(previewSprite, previewBorder);

    const infoX = CENTER_X + 50;
    let currentY = 350;

    const diffLabelStr = (state.lang === 'JP') ? "難易度" : "DIFFICULTY";
    const diffLabel = createPixelText(diffLabelStr, infoX, currentY, 36);
    diffLabel.anchor.set(0, 0.5);

    const diffInfo = getDifficultyStars(level.difficulty || "Normal");
    const diffVal = createPixelText(diffInfo.stars, infoX, currentY + 40, 50);
    diffVal.anchor.set(0, 0.5);
    diffVal.style.fill = diffInfo.color;

    detailContainer.addChild(diffLabel, diffVal);

    currentY += 120;

    const createStatText = (jpLabel, enLabel, value, y) => {
        const label = (state.lang === 'JP') ? jpLabel : enLabel;
        const txt = createPixelText(`${label}: ${value}`, infoX, y, 32);
        txt.anchor.set(0, 0.5);
        return txt;
    };

    const attemptTxt = createStatText("挑戦回数", "Attempts", stats.attempts, currentY);
    const deathTxt = createStatText("死亡回数", "Deaths", stats.deaths, currentY + 50);

    let clearTxtStr = (state.lang === 'JP') ? "初クリア: -" : "First Clear: -";
    if (stats.cleared) {
        const suffix = (state.lang === 'JP') ? "回目の挑戦" : "th try";
        clearTxtStr = (state.lang === 'JP')
            ? `初クリア: ${stats.firstClearAttempt}${suffix}`
            : `First Clear: ${stats.firstClearAttempt}${suffix}`;
    }
    const clearTxt = createPixelText(clearTxtStr, infoX, currentY + 100, 32);
    clearTxt.anchor.set(0, 0.5);
    if (stats.cleared) clearTxt.style.fill = 0x00FF00;

    detailContainer.addChild(attemptTxt, deathTxt, clearTxt);

    const playStr = (state.lang === 'JP') ? "遊ぶ" : "Play this Level";

    const startBtn = createButton(playStr, CENTER_X + 350, 700, 0x00FF00, () => {
        if (!state.isAnimating) {
            sounds.playSE('enter');
            const stats = Storage.getLevelStat(state.progress, state.index);
            Storage.updateLevelStat(state.progress, state.index, { attempts: stats.attempts + 1 });
            playStartSequence();
        }
    });

    const backBtn = createButton("BACK", CENTER_X + 350, 820, 0xAAAAAA, () => {
        if (!state.isAnimating) {
            sounds.playSE('select');
            transitionToList();
        }
    });

    detailButtons = [startBtn, backBtn];
    updateDetailCursor();

    detailContainer.addChild(startBtn.container, backBtn.container);

    gsap.to(detailContainer, { alpha: 1, duration: 0.5 });

    const enterKey = (state.lang === 'JP') ? "決定" : "Decide";
    helpText.text = `上下キー(WASD): 選ぶ / Enter: ${enterKey}`;
}

function createButton(text, x, y, color, callback) {
    const container = new PIXI.Container();
    container.x = x; container.y = y;

    const bg = new PIXI.Graphics();
    bg.lineStyle(4, color).beginFill(0x000000).drawRect(-150, -40, 300, 80).endFill();

    const txt = createPixelText(text, 0, 0, 40);
    txt.style.fill = color;

    container.addChild(bg, txt);
    container.eventMode = 'static';
    container.cursor = 'pointer';

    container.on('pointerdown', callback);

    return { container: container, gfx: bg, text: txt };
}

function createSettingsModal(parent) {
    settingsContainer = new PIXI.Container();
    settingsContainer.visible = false;
    parent.addChild(settingsContainer);

    const bg = new PIXI.Graphics().beginFill(0x000000, 0.85).drawRect(0, 0, WIDTH, HEIGHT).endFill();
    bg.eventMode = 'static';
    settingsContainer.addChild(bg);

    const win = new PIXI.Graphics().lineStyle(6, 0xFFFFFF).beginFill(0x222222).drawRect(CENTER_X - 400, HEIGHT / 2 - 350, 800, 700).endFill();
    settingsContainer.addChild(win);

    const title = createPixelText("SETTINGS", CENTER_X, HEIGHT / 2 - 300, 60);
    settingsContainer.addChild(title);

    const createVolumeControl = (label, y, key, setFunc) => {
        const txt = createPixelText(label, CENTER_X - 320, y, 36); txt.anchor.set(0, 0.5);
        settingsContainer.addChild(txt);
        const valTxt = createPixelText("50%", CENTER_X + 320, y, 36); valTxt.anchor.set(1, 0.5);
        settingsContainer.addChild(valTxt);
        const barContainer = new PIXI.Container();
        barContainer.x = CENTER_X - 50; barContainer.y = y - 15;
        settingsContainer.addChild(barContainer);
        const bgBar = new PIXI.Graphics().beginFill(0x555555).drawRect(0, 0, 250, 30).endFill();
        bgBar.eventMode = 'static'; bgBar.cursor = 'pointer';
        barContainer.addChild(bgBar);
        const fillBar = new PIXI.Graphics();
        barContainer.addChild(fillBar);
        const updateBar = () => {
            const vol = state.config[key];
            fillBar.clear().beginFill(0x00FF00).drawRect(0, 0, 250 * vol, 30).endFill();
            valTxt.text = Math.round(vol * 100) + "%";
        };
        const updateVol = (newVol) => {
            state.config[key] = newVol; setFunc(newVol); Storage.saveConfig(state.config); updateBar();
        };
        bgBar.on('pointerdown', (e) => {
            const localPos = e.getLocalPosition(bgBar);
            let v = Math.max(0, Math.min(1, localPos.x / 250));
            updateVol(Math.round(v * 10) / 10);
            if (key === 'seVolume') sounds.playSE('select');
        });
        bgBar.on('wheel', (e) => {
            let v = state.config[key] - Math.sign(e.deltaY) * 0.1;
            updateVol(Math.round(Math.max(0, Math.min(1, v)) * 10) / 10);
        });
        updateBar();
    };

    createVolumeControl("BGM Volume", HEIGHT / 2 - 160, 'bgmVolume', (v) => sounds.setBGMVolume(v));
    createVolumeControl("SE Volume", HEIGHT / 2 - 60, 'seVolume', (v) => sounds.setSEVolume(v));

    const bgY = HEIGHT / 2 + 40;
    const bgTxt = createPixelText("Background", CENTER_X - 320, bgY, 36); bgTxt.anchor.set(0, 0.5);
    const bgVal = createPixelText(state.config.bg ? "ON" : "OFF", CENTER_X + 320, bgY, 36);
    bgVal.anchor.set(1, 0.5); bgVal.style.fill = state.config.bg ? 0x00FF00 : 0xFF0000;
    const bgHit = new PIXI.Graphics().beginFill(0xFFFFFF, 0.001).drawRect(CENTER_X - 350, bgY - 25, 700, 50).endFill();
    bgHit.eventMode = 'static'; bgHit.cursor = 'pointer';
    bgHit.on('pointerdown', () => {
        state.config.bg = !state.config.bg;
        bgVal.text = state.config.bg ? "ON" : "OFF";
        bgVal.style.fill = state.config.bg ? 0x00FF00 : 0xFF0000;
        if (bgLayerRef) bgLayerRef.visible = state.config.bg;
        Storage.saveConfig(state.config); sounds.playSE('enter');
    });
    settingsContainer.addChild(bgTxt, bgVal, bgHit);

    const delY = HEIGHT / 2 + 140;
    const delBtn = new PIXI.Graphics().lineStyle(4, 0xFF0000).beginFill(0x330000).drawRect(CENTER_X - 200, delY - 30, 400, 60).endFill();
    delBtn.eventMode = 'static'; delBtn.cursor = 'pointer';
    const delTxt = createPixelText("DELETE DATA", CENTER_X, delY, 40);
    delTxt.style.fill = 0xFF0000;
    delBtn.addChild(delTxt);
    delBtn.on('pointerdown', () => {
        if (confirm("全てのデータを削除して初期化しますか？")) Storage.clearAllData();
    });
    settingsContainer.addChild(delBtn);

    const closeBtn = createPixelText("[ CLOSE ]", CENTER_X, HEIGHT / 2 + 250, 45);
    closeBtn.eventMode = 'static'; closeBtn.cursor = 'pointer';
    closeBtn.on('pointerdown', () => {
        state.settingsOpen = false; settingsContainer.visible = false; sounds.playSE('enter');
    });
    settingsContainer.addChild(closeBtn);
}