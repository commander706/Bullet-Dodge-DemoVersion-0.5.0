import { WIDTH, HEIGHT } from './config.js';
import { loadAssets } from './loader.js';
import { createPixelText } from './ui_utils.js';
import { startGameSequence } from './scene_title.js';

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: false,
    roundPixels: true
});

// FPSを60に固定
app.ticker.maxFPS = 160;

document.getElementById('game-container').appendChild(app.view);

const rootContainer = new PIXI.Container();
app.stage.addChild(rootContainer);

// ゲーム画面（1600x1200）の外側に描画されないようマスクを設定
const gameMask = new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawRect(0, 0, WIDTH, HEIGHT)
    .endFill();
rootContainer.addChild(gameMask);
rootContainer.mask = gameMask;

const layers = {
    bgLayer: new PIXI.Container(),
    bltLayer: new PIXI.Container(),
    flashLayer: new PIXI.Container(),
    uiLayer: new PIXI.Container()
};
rootContainer.addChild(layers.bgLayer, layers.bltLayer, layers.flashLayer, layers.uiLayer);

function resize() {
    const sw = app.screen.width;
    const sh = app.screen.height;
    const scale = Math.min(sw / WIDTH, sh / HEIGHT);
    rootContainer.scale.set(scale);
    rootContainer.x = Math.floor((sw - WIDTH * scale) / 2);
    rootContainer.y = Math.floor((sh - HEIGHT * scale) / 2);
}

window.addEventListener('resize', resize);
app.renderer.on('resize', resize);
resize();

async function init() {
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // 1. アセットロード
    await loadAssets(layers.uiLayer);

    // 2. 開始待機
    const startText = createPixelText("クリックして開始", WIDTH / 2, HEIGHT / 2, 60);
    layers.uiLayer.addChild(startText);
    
    const clickHandler = () => {
        window.removeEventListener('pointerdown', clickHandler);
        layers.uiLayer.removeChild(startText);
        // 3. タイトル演出を開始
        startGameSequence(app, rootContainer, layers, resize);
    };
    window.addEventListener('pointerdown', clickHandler);
}

init();