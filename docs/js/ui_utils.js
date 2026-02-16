import { WIDTH } from './config.js';

export function createPixelText(content, x, y, size = 32) {
    const style = new PIXI.TextStyle({ 
        fontFamily: 'Yomogi', 
        fontSize: size, 
        fill: '#ffffff',
        align: 'center',
        padding: 8 // 【修正】文字の端が見切れるのを防ぐための余白
    });
    const text = new PIXI.Text(content, style);
    text.resolution = 2; 
    text.anchor.set(0.5);
    text.x = x; 
    text.y = y;
    return text;
}

export function getFitScale(texture, targetWidthRatio = 0.8) {
    return Math.min((WIDTH * targetWidthRatio) / texture.width, 6.0);
}