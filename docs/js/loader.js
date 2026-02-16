import { ASSETS, WIDTH, HEIGHT, CENTER_X } from './config.js';
import { createPixelText } from './ui_utils.js';

export async function loadAssets(container) {
    const loaderGroup = new PIXI.Container();
    container.addChild(loaderGroup);

    const loadingText = createPixelText("LOADING...", CENTER_X, HEIGHT / 2 - 60, 50);
    const percentText = createPixelText("0%", CENTER_X, HEIGHT / 2 + 80, 40);
    
    const barWidth = 600;
    const barHeight = 24;
    const border = new PIXI.Graphics().lineStyle(4, 0xFFFFFF).drawRect(CENTER_X - barWidth/2, HEIGHT/2, barWidth, barHeight);
    const progressBar = new PIXI.Graphics();
    
    loaderGroup.addChild(loadingText, percentText, border, progressBar);

    // アセット登録
    ASSETS.fonts.forEach(f => PIXI.Assets.add(f));
    for (const [key, path] of Object.entries(ASSETS.textures)) {
        PIXI.Assets.add({ alias: key, src: path });
    }

    const assetKeys = [...ASSETS.fonts.map(f => f.alias), ...Object.keys(ASSETS.textures)];

    await PIXI.Assets.load(assetKeys, (progress) => {
        const p = Math.floor(progress * 100);
        percentText.text = `${p}%`;
        progressBar.clear().beginFill(0x00FF00).drawRect(CENTER_X - barWidth/2, HEIGHT/2, barWidth * progress, barHeight).endFill();
    });

    await new Promise(r => setTimeout(r, 300));
    gsap.to(loaderGroup, { alpha: 0, duration: 0.4, onComplete: () => loaderGroup.destroy() });
}