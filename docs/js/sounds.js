import { ASSETS } from './config.js';

class SoundManager {
    constructor() {
        this.bgmVolume = 0.5;
        this.seVolume = 0.7;
        this.currentBGM = null;
        this.lastPlayTime = {}; // 再生時間管理用
        this.seInstances = {};  // 重ねない再生用のインスタンス保持用
    }

    playBGM(key, loop = true) {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.onended = null; // 以前のリスナーを解除
        }

        const introKey = key + '_intro';
        const hasIntro = ASSETS.sounds[introKey] !== undefined;

        if (hasIntro) {
            // イントロがある場合：イントロ再生 -> 終了後にメインループ再生
            const intro = new Audio(ASSETS.sounds[introKey]);
            intro.loop = false;
            intro.volume = this.bgmVolume;
            
            intro.play().catch(e => console.log("BGM Intro Play Error:", e));
            this.currentBGM = intro;

            // イントロ終了時の処理
            intro.onended = () => {
                // 既に別の曲に切り替わっている場合は何もしない
                if (this.currentBGM !== intro) return;

                const main = new Audio(ASSETS.sounds[key]);
                main.loop = loop;
                main.volume = this.bgmVolume;
                main.play().catch(e => console.log("BGM Loop Play Error:", e));
                this.currentBGM = main;
            };
        } else {
            // 通常再生
            const audio = new Audio(ASSETS.sounds[key]);
            audio.loop = loop;
            audio.volume = this.bgmVolume;
            audio.play().catch(e => console.log("BGM Play Error:", e));
            this.currentBGM = audio;
        }
    }

    // throttleMs: 指定したミリ秒以内の再呼び出しを無視する
    // overlap: trueなら重ねて再生(new Audio)、falseなら既存を頭出し再生(restart)
    playSE(key, throttleMs = 0, overlap = true) {
        const now = Date.now();
        if (throttleMs > 0) {
            const last = this.lastPlayTime[key] || 0;
            if (now - last < throttleMs) return;
            this.lastPlayTime[key] = now;
        }

        if (overlap) {
            // 従来通り重ねて再生
            const audio = new Audio(ASSETS.sounds[key]);
            audio.volume = this.seVolume;
            audio.play().catch(e => console.log("SE Play Error:", e));
        } else {
            // 重ねずに再生（再生中なら最初から）
            let audio = this.seInstances[key];
            if (!audio) {
                audio = new Audio(ASSETS.sounds[key]);
                audio.volume = this.seVolume;
                this.seInstances[key] = audio;
            }
            // 音量更新（設定が変わっているかもしれないので）
            audio.volume = this.seVolume;
            audio.currentTime = 0;
            audio.play().catch(e => {});
        }
    }

    setBGMVolume(val) {
        this.bgmVolume = val;
        if (this.currentBGM) this.currentBGM.volume = val;
    }

    setSEVolume(val) {
        this.seVolume = val;
    }
}

export const sounds = new SoundManager();