
export const WIDTH = 1600;
export const HEIGHT = 1200;
export const CENTER_X = WIDTH / 2;

export const BULLET_Y = 320;
export const DODGE_Y = 720;
export const EXPLODE_Y = 600;

// プレイヤー設定
export const PLAYER_SCALE = 1.8;
export const PLAYER_HIT_RADIUS = 4;

// マップチップの連番アセット定義
const mapTextures = {};
for (let i = 0; i <= 17; i++) {
    mapTextures[`map_${i}`] = `assets/textures/tiled_map/map_${i}.png`;
}

export const ASSETS = {
    fonts: [{ alias: 'Yomogi', src: 'assets/fonts/yomogi.otf' }],
    textures: {
        title_bullet: 'assets/textures/ui/Title_Bullet.png',
        title_dodge: 'assets/textures/ui/the_dodge.png',
        bg: 'assets/textures/ui/menu_background.png',
        blt: 'assets/textures/ui/blt.png',
        setting: 'assets/textures/ui/setting.png',
        player: 'assets/textures/player.png',

        // --- Stage 1 (Rain Drops) ---
        's1_c1': 'assets/textures/bullets/stage1/costume1.png',
        's1_c2': 'assets/textures/bullets/stage1/costume2.png',
        's1_c3': 'assets/textures/bullets/stage1/costume3.png',
        's1_c4': 'assets/textures/bullets/stage1/costume4.png',
        's1_c5': 'assets/textures/bullets/stage1/costume5.png',

        // --- Stage 2 (Circle Splash) ---
        's2_c1': 'assets/textures/bullets/stage2/costume1.png',

        // --- Stage 3 (Targetted) ---
        's3_c1': 'assets/textures/bullets/stage3/costume1.png',

        // --- Stage 4 (Asteroid) ---
        's4_c1': 'assets/textures/bullets/stage4/costume1.png',
        's4_c2': 'assets/textures/bullets/stage4/costume2.png',
        's4_c3': 'assets/textures/bullets/stage4/costume3.png',
        's4_c4': 'assets/textures/bullets/stage4/costume4.png',
        's4_c5': 'assets/textures/bullets/stage4/costume5.png',

        // --- Stage 5 (Side Exploding) ---
        's5_c1': 'assets/textures/bullets/stage5/costume1.png',
        's5_c2': 'assets/textures/bullets/stage5/costume2.png',
        's5_bomb1': 'assets/textures/bullets/stage5/bombsleigh1.png',
        's5_bomb2': 'assets/textures/bullets/stage5/bombsleigh2.png',
        's5_bomb3': 'assets/textures/bullets/stage5/bombsleigh3.png',
        's5_bomb4': 'assets/textures/bullets/stage5/bombsleigh4.png',
        's5_bomb5': 'assets/textures/bullets/stage5/bombsleigh5.png',

        // --- Stage 6 (Bouncy) ---
        's6_c1': 'assets/textures/bullets/stage6/costume1.png',
        's6_c2': 'assets/textures/bullets/stage6/costume2.png',

        // --- Stage 7 (Target Rush) ---
        's7_c1': 'assets/textures/bullets/stage7/costume1.png',
        's7_c2': 'assets/textures/bullets/stage7/costume2.png',
        's7_c3': 'assets/textures/bullets/stage7/costume3.png',
        's7_c4': 'assets/textures/bullets/stage7/costume4.png',
        's7_c5': 'assets/textures/bullets/stage7/costume5.png',

        // --- Stage 8 (Burst Burst Burst) ---
        's8_c1': 'assets/textures/bullets/stage8/costume1.png',
        's8_c2': 'assets/textures/bullets/stage8/costume2.png',
        's8_c3': 'assets/textures/bullets/stage8/costume3.png',
        's8_c4': 'assets/textures/bullets/stage8/costume4.png',

        ...mapTextures
    },
    sounds: {
        title_bgm: 'assets/sounds/Title Screen.ogg',
        enter: 'assets/sounds/Enter.ogg',
        select: 'assets/sounds/Select.ogg',
        stage_enter: 'assets/sounds/StageEnter.ogg',
        pause: 'assets/sounds/Pause.ogg',
        stage_0: 'assets/sounds/Stage_0.ogg',

        // --- Stage 1 BGM (Intro + Loop) ---
        stage_1: 'assets/sounds/stage_1.ogg',
        stage_1_intro: 'assets/sounds/stage_1_intro.ogg',

        stage_2: 'assets/sounds/Stage_2.ogg',

        countdown: 'assets/sounds/Countdown.ogg',
        erase: 'assets/sounds/Erase.ogg',
        stage_clear: 'assets/sounds/StageClear.ogg',
        died: 'assets/sounds/Died.ogg',
        gameover: 'assets/sounds/GameOver.ogg',
        warning: 'assets/sounds/Warning.ogg',

        // --- Stage 1 Sounds ---
        s1_target: 'assets/sounds/bullets/RaindropTarget.ogg',
        s1_stop: 'assets/sounds/bullets/RaindropStop.ogg',
        s1_blast: 'assets/sounds/bullets/RaindropBlast.ogg',

        // --- Stage 2 Sounds ---
        s2_emerge: 'assets/sounds/bullets/CircleSplashEmerge.ogg',
        s2_splash: 'assets/sounds/bullets/Splash.ogg',
        s2_stop: 'assets/sounds/bullets/CircleSplashStop.ogg',

        // --- Stage 3 Sounds ---
        s3_engulf: 'assets/sounds/bullets/Engulf.ogg',

        // --- Stage 4 Sounds ---
        bang1: 'assets/sounds/bullets/Bang.ogg',
        bang2: 'assets/sounds/bullets/Bang2.ogg',

        // --- Stage 5 Sounds ---
        side_explode: 'assets/sounds/bullets/SideExplode.ogg',

        // --- Stage 6 Sounds ---
        shoot: 'assets/sounds/bullets/Shoot.ogg',
        bounce: 'assets/sounds/bullets/Bounce.ogg',

        // --- Stage 8 Sounds ---
        s8_emerge_s: 'assets/sounds/bullets/BurstSmallEmerge.ogg',
        s8_blast_s: 'assets/sounds/bullets/SmallBlast.ogg',
        s8_emerge_l: 'assets/sounds/bullets/BurstLargeEmerge.ogg',
        s8_blast_l: 'assets/sounds/bullets/LargeBlast.ogg'
    }
};

export const LEVELS = [
    {
        name_en: "Rain Drops", name_jp: "降り注ぐ雨粒", color: 0xADD8E6, difficulty: "Easy", preview: "rain_drops.png",
        bgm: "stage_0", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Circle Splash", name_jp: "広がる円環", color: 0xFFD700, difficulty: "Normal", preview: "circle_splash.png",
        bgm: "stage_0", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Targetted", name_jp: "狙われた標的", color: 0xFF4500, difficulty: "Normal", preview: "targetted.png",
        bgm: "stage_0", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Asteroid", name_jp: "漂う小惑星", color: 0xAAAAAA, difficulty: "Hard", preview: "asteroid.png",
        bgm: "stage_1", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Side Exploding", name_jp: "側面からの爆風", color: 0xFF00FF, difficulty: "Hard", preview: "side_exploding.png",
        bgm: "stage_0", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Bouncy", name_jp: "反射する光弾", color: 0xFF0000, difficulty: "Lunatic", preview: "bouncy.png",
        bgm: "stage_0", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Laser Maniac", name_jp: "荒ぶるレーザー", color: 0x00FFFF, difficulty: "Lunatic", preview: "laser_maniac.png",
        bgm: "stage_0", bgTint: 0xffffff, bgBrightness: 0.4
    },
    {
        name_en: "Burst Burst Burst", name_jp: "連鎖する炸裂", color: 0xFFA500, difficulty: "Extra", preview: "burst.png",
        bgm: "stage_2", bgTint: 0xEE82EE, bgBrightness: 0.2
    }
];
