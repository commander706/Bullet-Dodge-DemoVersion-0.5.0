import { WIDTH, HEIGHT, CENTER_X, BULLET_Y, DODGE_Y, EXPLODE_Y } from './config.js';
import { createPixelText, getFitScale } from './ui_utils.js';
import { sounds } from './sounds.js';
import { initLevelSelect } from './scene_level_select.js';
import { Storage } from './storage.js';

export async function startGameSequence(app, rootContainer, layers, resizeFunc) {
    const { bgLayer, bltLayer, flashLayer, uiLayer } = layers;

    // 【修正】起動時に音量を適用
    const savedConfig = Storage.loadConfig();
    sounds.setBGMVolume(savedConfig.bgmVolume);
    sounds.setSEVolume(savedConfig.seVolume);

    sounds.playBGM('title_bgm');

    const flashRect = new PIXI.Graphics().beginFill(0xAA0000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
    flashRect.alpha = 0;
    flashLayer.addChild(flashRect);

    const titleGroup = new PIXI.Container();
    uiLayer.addChild(titleGroup);

    const t1 = PIXI.Assets.get('title_bullet');
    const s1 = new PIXI.Sprite(t1);
    s1.anchor.set(0.5);
    s1.scale.set(getFitScale(t1, 0.8));
    s1.x = CENTER_X; s1.y = BULLET_Y;
    titleGroup.addChild(s1);

    const t2 = PIXI.Assets.get('title_dodge');
    const s2 = new PIXI.Sprite(t2);
    s2.anchor.set(0.5);
    s2.scale.set(getFitScale(t2, 0.6));
    s2.x = CENTER_X; s2.y = DODGE_Y;
    titleGroup.addChild(s2);

    const whiteCircle = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, 150).endFill();
    whiteCircle.beginFill(0xFFFFFF, 0.3).drawCircle(0, 0, 220).endFill();
    whiteCircle.x = -300; whiteCircle.y = BULLET_Y;
    uiLayer.addChild(whiteCircle);

    const mask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 250).endFill();
    mask.x = whiteCircle.x; mask.y = whiteCircle.y;
    uiLayer.addChild(mask);
    titleGroup.mask = mask;

    const exp = new PIXI.Graphics().beginFill(0xFF8800).drawCircle(0, 0, 150).endFill();
    exp.x = CENTER_X; exp.y = EXPLODE_Y;
    exp.scale.set(0); exp.alpha = 0;
    uiLayer.addChild(exp);

    const bgTex = PIXI.Assets.get('bg');
    const scrollingBG = new PIXI.TilingSprite(bgTex, WIDTH, HEIGHT);
    scrollingBG.alpha = 0;
    scrollingBG.tileScale.set(1.5);
    bgLayer.addChild(scrollingBG);

    const bltTex = PIXI.Assets.get('blt');

    const pressKeyText = createPixelText("Press any key!", CENTER_X, DODGE_Y + 200, 40);
    pressKeyText.alpha = 0;
    uiLayer.addChild(pressKeyText);

    const versionText = createPixelText("v0.1.0 α - remixed by 駒金", CENTER_X, HEIGHT - 50, 24);
    versionText.alpha = 0;
    uiLayer.addChild(versionText);

    gsap.to(whiteCircle, { alpha: 0, duration: 0.02, yoyo: true, repeat: -1, ease: "steps(1)" });

    const tl = gsap.timeline();
    tl.to([whiteCircle, mask], { x: WIDTH - 250, duration: 1.5, ease: "power3.out" })
        .to([whiteCircle, mask], { x: CENTER_X, duration: 1.0, ease: "power3.out" })
        .to([whiteCircle, mask], { y: EXPLODE_Y, duration: 0.8, ease: "power3.out" })
        .to([whiteCircle.scale, mask.scale], { x: 1.3, y: 1.3, duration: 0.3, ease: "power2.in" })
        .call(() => {
            gsap.to(rootContainer, { y: rootContainer.y + 40, yoyo: true, repeat: 9, duration: 0.04, onComplete: () => resizeFunc() });

            flashRect.alpha = 0.7;
            gsap.to(flashRect, { alpha: 0, duration: 1.5 });

            exp.alpha = 1;
            gsap.to(exp.scale, { x: 5, y: 5, duration: 3.0, ease: "power2.out" });
            gsap.to(exp, { alpha: 0, duration: 3.0, ease: "power2.out" });

            titleGroup.mask = null;
            whiteCircle.visible = false;
            mask.visible = false;

            const count = 45;
            for (let i = 0; i < count; i++) {
                const b = new PIXI.Sprite(bltTex);
                b.anchor.set(0.5);
                b.x = CENTER_X; b.y = EXPLODE_Y;
                b.scale.set(1.5);
                bltLayer.addChild(b);
                const angle = (i / count) * Math.PI * 2;
                const distance = 2000;
                gsap.to(b, {
                    x: CENTER_X + Math.cos(angle) * distance,
                    y: EXPLODE_Y + Math.sin(angle) * distance,
                    duration: 5.0,
                    ease: "none",
                    onComplete: () => b.destroy()
                });
            }

            gsap.to(scrollingBG, { alpha: 1, duration: 2.0 });
            gsap.to(versionText, { alpha: 1, duration: 1.5 });
            gsap.to(pressKeyText, {
                alpha: 1, duration: 1.0, onComplete: () => {
                    gsap.to(pressKeyText, { alpha: 0.2, duration: 0.8, yoyo: true, repeat: -1 });
                    setupInputListener();
                }
            });
        });

    const scrollTask = (delta) => {
        scrollingBG.tilePosition.x -= 2.5 * delta;
    };
    app.ticker.add(scrollTask);

    function setupInputListener() {
        const onStartAction = () => {
            window.removeEventListener('keydown', onStartAction);
            window.removeEventListener('pointerdown', onStartAction);
            sounds.playSE('enter');

            // 現在のアニメーション停止 & 完全不透明化
            gsap.killTweensOf(pressKeyText);
            pressKeyText.alpha = 1;

            // 【修正】さらに高速化 (0.04秒間隔)
            gsap.to(pressKeyText, {
                alpha: 0,
                duration: 0.04, // 0.1 -> 0.04 (高速)
                repeat: 19,    // 回数を増やしてトータル時間を確保 (0.04 * 20 ≒ 0.8秒)
                yoyo: true,
                ease: "steps(1)", // 0か100かでパチパチさせる
                onComplete: () => {
                    pressKeyText.alpha = 0;
                    startTransition();
                }
            });
        };
        window.addEventListener('keydown', onStartAction);
        window.addEventListener('pointerdown', onStartAction);
    }

    function startTransition() {
        const blackOverlay = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, WIDTH, HEIGHT).endFill();
        blackOverlay.alpha = 0;
        rootContainer.addChild(blackOverlay);

        gsap.to(blackOverlay, {
            alpha: 1,
            duration: 0.5,
            onComplete: () => {
                uiLayer.removeChildren();
                // 【修正】app を引数に追加して渡す
                initLevelSelect(app, layers, rootContainer);

                gsap.to(blackOverlay, {
                    alpha: 0,
                    duration: 0.5,
                    onComplete: () => blackOverlay.destroy()
                });
            }
        });
    }
}