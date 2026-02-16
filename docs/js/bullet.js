
import { WIDTH, HEIGHT, CENTER_X, PLAYER_HIT_RADIUS } from './config.js';
import { sounds } from './sounds.js';

// 全体的な弾のサイズ拡大率（デフォルト値）
const GLOBAL_SCALE = 1.5;

// --- Stage 1 (Rain Drops) Config ---
const S1_CONFIG = {
    spawn_early_min: 30, spawn_early_max: 60,
    spawn_late_min: 14, spawn_late_max: 54,
    transform_start_time: 20,
    check_interval: 0.03,
    target_chance: 0.01,
    blast_chance: 0.001,
    target_accel: 0.15,
    blast_count: 32,
    blast_speed: 5,
    bullet_speed: 4.5,
    afterimage_interval: 0.15,
    afterimage_life_step1: 0.15,
    afterimage_life_step2: 0.15,

    // サイズ設定
    bullet_scale: 1.5
};

// --- Stage 2 (Circle Splash) Config ---
const S2_CONFIG = {
    spawn_initial_delay: 2.0,
    spawn_interval_max: 1.5,
    safe_distance: 300,
    anim_scale_time: 0.5,
    anim_wait_time: 0.5,
    anim_white_time: 0.5,
    parent_scale_max: 2.25, // 親弾の最大サイズ
    child_scale: 2.25,      // 子弾のサイズ
    blast_count_start: 3,
    blast_count_end: 20,
    child_accel: 0.1,
    bounce_chance: 1 / 16,
    bounce_wait: 1.2
};

// --- Stage 3 (Targetted) Config ---
const S3_CONFIG = {
    spawn_initial_delay: 2.0,

    spawn_early_min: 48,
    spawn_early_max: 258,
    spawn_late_min: 48,
    spawn_late_max: 144,

    radius: 400,
    bullet_count: 8,
    bullet_scale: 2.25,

    rotate_speed_init: 5,
    rotate_time_min: 0.2,
    rotate_time_max: 0.8,

    decel_time: 0.65,
    converge_accel: 0.1,

    trap_check_interval: 0.03,
    trap_chance: 1 / 155,
    trap_duration: 1.4
};

// --- Stage 4 (Asteroid) Config ---
const S4_CONFIG = {
    spawn_initial_delay: 2.0,

    spawn_interval_min: 0.6,
    spawn_interval_max: 3.5,

    speed_stage1: 7.5,
    speed_stage2: 5,
    speed_stage3: 3,

    life_min: 1.1,
    life_max: 8.2,

    anim_interval: 0.16,

    // サイズ設定 (絶対値)
    scale_stage1: 2.75,  // 初期弾 (costume1~4)
    scale_stage2: 2.75,  // 3分裂後 (costume5)
    scale_stage3: 1.5  // 6分裂後 (costume5・小)
};
// --- Stage 5 (Side Exploding) Config ---
const S5_CONFIG = {
    spawn_initial_delay: 2.0,

    // スポーン間隔 (秒)
    // 2~47秒の間
    spawn_early_min: 0.0,
    spawn_early_max: 2.9,
    // 47~60秒の間
    spawn_late_min: 0.0,
    spawn_late_max: 1.3,

    // 親弾
    parent_accel: 0.2,   // 加速度 (フレーム毎に加算する速度)
    parent_initial_speed: 2.0, // 初速

    // 爆発後の弾幕
    blast_count: 32,
    blast_speed: 4,

    // サイズ設定
    parent_scale: 3.0,
    child_scale: 2.0,
    effect_scale: 2.0,

    // エフェクトアニメーション速度
    effect_interval: 0.1
};
const S6_CONFIG = {
    spawn_initial_delay: 2.0,

    spawn_interval: 7.525,    // 周期
    spawn_count: 2,         // 1回に出す数
    max_on_screen: 22,      // 画面内の最大数
    safe_distance: 200,     // プレイヤーからの安全距離

    // 挙動パラメータ
    blink_duration: 1.3,    // 点滅時間
    blink_rate: 0.02,       // 点滅間隔

    move_accel_time: 3.25,  // 加速時間
    move_decel_time: 3.25,  // 減速時間
    max_speed: 9.0,         // 最高速度

    shoot_wait_time: 0.81,  // 発射後待機時間

    child_speed: 8.0,       // 拡散弾速度

    // サイズ
    parent_scale: 1.75,
    child_scale: 1.75
};


// --- Stage 7 (Target Rush) Config ---
const S7_CONFIG = {
    spawn_initial_delay: 2.0,

    // スポーン間隔 (秒)
    spawn_interval_normal_min: 0.0325,
    spawn_interval_normal_max: 0.0975,
    spawn_interval_rush_min: 0.0,
    spawn_interval_rush_max: 0.065,

    base_speed: 14.0,      // 左への移動速度
    target_chance: 1 / 30,  // ターゲットモードになる確率

    lock_wait_time: 0.81, // ロック後の停止時間
    accel_y: 0.125,         // 上下加速の加速度

    anim_interval: 0.03,  // アニメーション切替速度

    bullet_scale: 1.75, // 弾のサイズ

    afterimage_interval: 0.05,
    afterimage_life: 0.4
};

const S8_CONFIG = {
    // スポーン間隔
    // 前半 (60s ~ 24s)
    spawn_early_min: 0.0325,
    spawn_early_max: 1.4625,
    // 後半 (24s ~ 0s)
    spawn_late_min: 0.0325,
    spawn_late_max: 0.81,

    strong_chance_early: 1 / 8,
    strong_chance_late: 1 / 4,

    safe_distance: 250,

    // 通常弾 (Small Burst)
    small_guide_count: 6,
    small_guide_radius: 150,
    small_anim_time: 0.81,
    small_bullet_count: 3,
    small_bullet_speed: 7.0,
    small_bullet_scale: 1.75,
    small_guide_scale: 1.75,

    // 強化弾 (Large Burst)
    large_guide_count: 8,
    large_guide_radius: 200,
    large_anim_time: 1.62, // ★回転速度アップ (1.62 -> 0.6)
    large_bullet_count: 4, // 4方向
    large_layer_count: 11, // 11層
    large_bullet_speed_base: 6.5, // ★速度アップ (4.0 -> 6.5)
    large_bullet_speed_step: 1.6, // ★速度差アップ (1.2 -> 1.6)
    large_bullet_scale: 1.8,
    large_guide_scale: 1.8,

    // ★追加: 強化弾の消滅設定
    large_life_time: 2.2,
    large_blink_time: 0.8
};


// ステージ設定リスト
const STAGE_CONFIGS = [S1_CONFIG, S2_CONFIG, S3_CONFIG, S4_CONFIG, S5_CONFIG, S6_CONFIG, S7_CONFIG, S8_CONFIG];

// ステージごとの弾幕ロジック定義
const STAGE_BEHAVIORS = {
    0: { // Stage 1 Logic
        spawn: (manager, delta, elapsedTime) => {
            const config = STAGE_CONFIGS[0];
            let minInt, maxInt;
            if (elapsedTime < 50) {
                minInt = config.spawn_early_min;
                maxInt = config.spawn_early_max;
            } else {
                minInt = config.spawn_late_min;
                maxInt = config.spawn_late_max;
            }

            manager.spawnTimer -= delta;
            if (manager.spawnTimer <= 0) {
                manager.spawnTimer = Math.random() * (maxInt - minInt) + minInt;
                const x = Math.random() * WIDTH;
                const y = -50;
                const b = manager.spawnBullet('s1_c1', x, y, 0, config.bullet_speed);

                // サイズ適用
                if (config.bullet_scale) {
                    b.sprite.scale.set(config.bullet_scale);
                    b.hitRadius = 8 * config.bullet_scale;
                }
            }
        },
        updateBullet: (bullet, delta, player, manager) => {
            const config = STAGE_CONFIGS[0];
            bullet.customData.afterImageTimer = (bullet.customData.afterImageTimer || 0) + (delta / 60);

            if (bullet.state === 'normal' || bullet.state === 'target') {
                if (bullet.customData.afterImageTimer >= config.afterimage_interval) {
                    bullet.customData.afterImageTimer = 0;
                    manager.spawnAfterImage(bullet.sprite.x, bullet.sprite.y);
                }
            }

            if (bullet.state === 'normal' && manager.canTransform) {
                bullet.customData.checkTimer = (bullet.customData.checkTimer || 0) + (delta / 60);

                if (bullet.customData.checkTimer >= config.check_interval) {
                    bullet.customData.checkTimer = 0;
                    const rand = Math.random();
                    if (rand < config.target_chance) {
                        bullet.state = 'target';
                        sounds.playSE('s1_target');
                        bullet.vx = 0;
                        bullet.vy = 0;
                        const dx = player.x - bullet.sprite.x;
                        const dy = player.y - bullet.sprite.y;
                        const angle = Math.atan2(dy, dx);
                        bullet.customData.ax = Math.cos(angle) * config.target_accel;
                        bullet.customData.ay = Math.sin(angle) * config.target_accel;
                    } else if (rand < config.target_chance + config.blast_chance) {
                        bullet.state = 'stop';
                        sounds.playSE('s1_stop');
                        bullet.vx = 0;
                        bullet.vy = 0;
                        bullet.customData.stopTimer = 0;
                        bullet.sprite.texture = PIXI.Assets.get('s1_c4');
                    }
                }
            }

            if (bullet.state === 'target') {
                bullet.vx += bullet.customData.ax * delta;
                bullet.vy += bullet.customData.ay * delta;
            }

            if (bullet.state === 'stop') {
                bullet.customData.stopTimer += delta;
                const blinkFrame = 6;
                if (Math.floor(bullet.customData.stopTimer / blinkFrame) % 2 === 0) {
                    bullet.sprite.texture = PIXI.Assets.get('s1_c4');
                } else {
                    bullet.sprite.texture = PIXI.Assets.get('s1_c1');
                }

                if (bullet.customData.stopTimer >= 72) {
                    sounds.playSE('s1_blast');
                    bullet.isDead = true;
                    const count = config.blast_count;
                    const speed = config.blast_speed;
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        const vx = Math.cos(angle) * speed;
                        const vy = Math.sin(angle) * speed;
                        const b = manager.spawnBullet('s1_c5', bullet.sprite.x, bullet.sprite.y, vx, vy);
                        b.state = 'blast_child';
                        // 分裂弾にもスケール適用
                        if (config.bullet_scale) {
                            b.sprite.scale.set(config.bullet_scale);
                            b.hitRadius = 8 * config.bullet_scale;
                        }
                    }
                }
            }
        }
    },

    1: { // Stage 2 Logic
        spawn: (manager, delta, elapsedTime) => {
            const config = S2_CONFIG;
            manager.spawnTimer -= (delta / 60);

            if (manager.spawnTimer <= 0) {
                manager.spawnTimer = Math.random() * config.spawn_interval_max;

                let x, y, dist;
                let retry = 0;
                do {
                    x = Math.random() * (WIDTH - 100) + 50;
                    y = Math.random() * (HEIGHT * 0.6) + 50;
                    const dx = x - manager.player.x;
                    const dy = y - manager.player.y;
                    dist = Math.sqrt(dx * dx + dy * dy);
                    retry++;
                } while (dist < config.safe_distance && retry < 10);

                const b = manager.spawnBullet('s2_c1', x, y, 0, 0);
                b.state = 's2_parent';
                b.sprite.scale.set(0);
                b.customData.animTime = 0;
                b.customData.colorFilter = new PIXI.ColorMatrixFilter();
                b.sprite.filters = [b.customData.colorFilter];

                sounds.playSE('s2_emerge');
            }
        },

        updateBullet: (bullet, delta, player, manager) => {
            const config = S2_CONFIG;

            if (bullet.state === 's2_parent') {
                bullet.customData.animTime += (delta / 60);
                const t = bullet.customData.animTime;

                if (t < config.anim_scale_time) {
                    const progress = t / config.anim_scale_time;
                    bullet.sprite.scale.set(config.parent_scale_max * progress);
                    bullet.hitRadius = 8 * bullet.sprite.scale.x;
                }
                else if (t < config.anim_scale_time + config.anim_wait_time) {
                    bullet.sprite.scale.set(config.parent_scale_max);
                    bullet.hitRadius = 8 * config.parent_scale_max;
                }
                else if (t < config.anim_scale_time + config.anim_wait_time + config.anim_white_time) {
                    const whitePhaseDuration = config.anim_white_time;
                    const currentWhiteTime = t - (config.anim_scale_time + config.anim_wait_time);
                    const progress = Math.min(1.0, currentWhiteTime / whitePhaseDuration);
                    const offset = progress;
                    bullet.customData.colorFilter.matrix = [
                        1, 0, 0, 0, offset,
                        0, 1, 0, 0, offset,
                        0, 0, 1, 0, offset,
                        0, 0, 0, 1, 0
                    ];
                }
                else {
                    bullet.isDead = true;
                    sounds.playSE('s2_splash');

                    const elapsed = bullet.customData.spawnedTime ? (60 - bullet.customData.spawnedTime) : 0;
                    let maxLimit = config.blast_count_start + ((config.blast_count_end - config.blast_count_start) * (Math.min(elapsed, 50) / 50));
                    maxLimit = Math.floor(maxLimit);

                    const count = Math.floor(Math.random() * (maxLimit - 3 + 1)) + 3;
                    const baseAngle = Math.random() * Math.PI * 2;

                    for (let i = 0; i < count; i++) {
                        const angle = baseAngle + (i / count) * Math.PI * 2;
                        const child = manager.spawnBullet('s2_c1', bullet.sprite.x, bullet.sprite.y, 0, 0);
                        child.state = 's2_child';
                        child.sprite.scale.set(config.child_scale);
                        child.hitRadius = 8 * config.child_scale;

                        const whiteFilter = new PIXI.ColorMatrixFilter();
                        whiteFilter.matrix = [
                            1, 0, 0, 0, 1,
                            0, 1, 0, 0, 1,
                            0, 0, 1, 0, 1,
                            0, 0, 0, 1, 0
                        ];
                        child.sprite.filters = [whiteFilter];

                        child.customData.ax = Math.cos(angle) * config.child_accel;
                        child.customData.ay = Math.sin(angle) * config.child_accel;

                        if (Math.random() < config.bounce_chance) {
                            child.customData.canBounce = true;
                        }
                    }
                }
            }

            if (bullet.state === 's2_child') {
                bullet.vx += bullet.customData.ax * delta;
                bullet.vy += bullet.customData.ay * delta;

                if (bullet.customData.canBounce) {
                    const margin = bullet.hitRadius;
                    let hitEdge = false;
                    if (bullet.sprite.x < margin || bullet.sprite.x > WIDTH - margin ||
                        bullet.sprite.y < margin || bullet.sprite.y > HEIGHT - margin) {
                        hitEdge = true;
                    }
                    if (hitEdge) {
                        bullet.sprite.x = Math.max(margin, Math.min(WIDTH - margin, bullet.sprite.x));
                        bullet.sprite.y = Math.max(margin, Math.min(HEIGHT - margin, bullet.sprite.y));
                        bullet.state = 's2_bounce_wait';
                        bullet.vx = 0;
                        bullet.vy = 0;
                        bullet.customData.waitTimer = 0;
                        bullet.customData.canBounce = false;
                        sounds.playSE('s2_stop');
                    }
                }
            }

            if (bullet.state === 's2_bounce_wait') {
                bullet.customData.waitTimer += (delta / 60);
                if (bullet.customData.waitTimer >= config.bounce_wait) {
                    const originalAngle = Math.atan2(bullet.customData.ay, bullet.customData.ax);
                    const reverseAngle = originalAngle + Math.PI + (Math.random() * 0.5 - 0.25);
                    bullet.customData.ax = Math.cos(reverseAngle) * config.child_accel;
                    bullet.customData.ay = Math.sin(reverseAngle) * config.child_accel;
                    bullet.state = 's2_child';
                }
            }
        }
    },

    2: { // Stage 3 Logic
        spawn: (manager, delta, elapsedTime) => {
            const config = S3_CONFIG;

            // 召喚間隔決定
            let minInt, maxInt;
            if (elapsedTime < 45) { // 最初の45秒
                minInt = config.spawn_early_min;
                maxInt = config.spawn_early_max;
            } else { // 残り15秒
                minInt = config.spawn_late_min;
                maxInt = config.spawn_late_max;
            }

            manager.spawnTimer -= delta;
            if (manager.spawnTimer <= 0) {
                manager.spawnTimer = Math.random() * (maxInt - minInt) + minInt;

                const cx = manager.player.x;
                const cy = manager.player.y;
                const radius = config.radius;
                const baseAngle = Math.random() * Math.PI * 2;
                const rotateTime = Math.random() * (config.rotate_time_max - config.rotate_time_min) + config.rotate_time_min;

                sounds.playSE('s3_engulf');

                for (let i = 0; i < config.bullet_count; i++) {
                    const angleOffset = (i / config.bullet_count) * Math.PI * 2;
                    const initialAngle = baseAngle + angleOffset;

                    const x = cx + Math.cos(initialAngle) * radius;
                    const y = cy + Math.sin(initialAngle) * radius;

                    const b = manager.spawnBullet('s3_c1', x, y, 0, 0);

                    if (config.bullet_scale) {
                        b.sprite.scale.set(config.bullet_scale);
                        b.hitRadius = 8 * config.bullet_scale;
                    }

                    b.state = 's3_rotate';
                    b.customData = {
                        centerX: cx,
                        centerY: cy,
                        radius: radius,
                        currentAngle: initialAngle,
                        rotateSpeed: config.rotate_speed_init,
                        rotateTimer: 0,
                        rotateDuration: rotateTime,
                        decelTimer: 0,
                        trapTimer: 0,
                        trapCheckTimer: 0
                    };
                }
            }
        },

        updateBullet: (bullet, delta, player, manager) => {
            const config = S3_CONFIG;
            const data = bullet.customData;

            if (bullet.state === 's3_rotate') {
                data.rotateTimer += (delta / 60);
                data.currentAngle += (data.rotateSpeed * (delta / 60));
                bullet.sprite.x = data.centerX + Math.cos(data.currentAngle) * data.radius;
                bullet.sprite.y = data.centerY + Math.sin(data.currentAngle) * data.radius;

                if (data.rotateTimer >= data.rotateDuration) {
                    bullet.state = 's3_decel';
                }
            }
            else if (bullet.state === 's3_decel') {
                data.decelTimer += (delta / 60);
                const progress = data.decelTimer / config.decel_time;
                const currentSpeed = data.rotateSpeed * (1.0 - progress);

                if (progress >= 1.0) {
                    bullet.state = 's3_converge';
                    const dx = data.centerX - bullet.sprite.x;
                    const dy = data.centerY - bullet.sprite.y;
                    const angle = Math.atan2(dy, dx);
                    data.ax = Math.cos(angle) * config.converge_accel;
                    data.ay = Math.sin(angle) * config.converge_accel;
                    bullet.vx = 0;
                    bullet.vy = 0;
                } else {
                    data.currentAngle += (currentSpeed * (delta / 60));
                    bullet.sprite.x = data.centerX + Math.cos(data.currentAngle) * data.radius;
                    bullet.sprite.y = data.centerY + Math.sin(data.currentAngle) * data.radius;
                }
            }
            else if (bullet.state === 's3_converge') {
                bullet.vx += data.ax * delta;
                bullet.vy += data.ay * delta;

                data.trapCheckTimer += (delta / 60);
                if (data.trapCheckTimer >= config.trap_check_interval) {
                    data.trapCheckTimer = 0;
                    if (Math.random() < config.trap_chance) {
                        bullet.state = 's3_trap';
                        data.trapTimer = 0;
                        bullet.vx = 0;
                        bullet.vy = 0;
                    }
                }
            }
            else if (bullet.state === 's3_trap') {
                data.trapTimer += (delta / 60);
                if (data.trapTimer >= config.trap_duration) {
                    bullet.state = 's3_converge';
                }
            }
        }
    },

    3: { // Stage 4 Logic
        spawn: (manager, delta, elapsedTime) => {
            const config = S4_CONFIG;

            manager.spawnTimer -= (delta / 60);

            if (manager.spawnTimer <= 0) {
                manager.spawnTimer = Math.random() * (config.spawn_interval_max - config.spawn_interval_min) + config.spawn_interval_min;

                const y = Math.random() * HEIGHT;
                const x = WIDTH;

                const angle = Math.PI + (Math.random() * 0.8 - 0.2);  // 真横～やや下向きのランダムな角度 広げるなら 0.4を0.8に変更
                const vx = Math.cos(angle) * config.speed_stage1;
                const vy = Math.sin(angle) * config.speed_stage1;

                const b = manager.spawnBullet('s4_c1', x, y, vx, vy);
                b.state = 's4_stage1';

                // 初期サイズ適用
                b.sprite.scale.set(config.scale_stage1);
                b.hitRadius = 8 * config.scale_stage1;

                const life = Math.random() * (config.life_max - config.life_min) + config.life_min;

                b.customData = {
                    lifeTimer: life,
                    animTimer: 0,
                    texIndex: 0
                };
            }
        },
        updateBullet: (bullet, delta, player, manager) => {
            const config = S4_CONFIG;

            if (bullet.state === 's4_stage1' || bullet.state === 's4_stage2') {
                const margin = bullet.hitRadius;

                let bounced = false;
                if (bullet.sprite.x < margin && bullet.vx < 0) {
                    bullet.vx *= -1; bounced = true;
                } else if (bullet.sprite.x > WIDTH - margin && bullet.vx > 0) {
                    bullet.vx *= -1; bounced = true;
                }

                if (bullet.sprite.y < margin && bullet.vy < 0) {
                    bullet.vy *= -1; bounced = true;
                } else if (bullet.sprite.y > HEIGHT - margin && bullet.vy > 0) {
                    bullet.vy *= -1; bounced = true;
                }
            }

            if (bullet.state === 's4_stage1') {
                bullet.customData.animTimer += (delta / 60);
                if (bullet.customData.animTimer >= config.anim_interval) {
                    bullet.customData.animTimer = 0;
                    bullet.customData.texIndex = (bullet.customData.texIndex + 1) % 4;
                    bullet.sprite.texture = PIXI.Assets.get(`s4_c${bullet.customData.texIndex + 1}`);
                }

                bullet.customData.lifeTimer -= (delta / 60);
                if (bullet.customData.lifeTimer <= 0) {
                    sounds.playSE('bang1');
                    bullet.isDead = true;

                    const baseAngle = Math.random() * Math.PI * 2;
                    for (let i = 0; i < 3; i++) {
                        const theta = baseAngle + (i * Math.PI * 2 / 3);
                        const vx = Math.cos(theta) * config.speed_stage2;
                        const vy = Math.sin(theta) * config.speed_stage2;

                        const child = manager.spawnBullet('s4_c5', bullet.sprite.x, bullet.sprite.y, vx, vy);
                        child.state = 's4_stage2';

                        // Stage 2 サイズ適用
                        child.sprite.scale.set(config.scale_stage2);
                        child.hitRadius = 8 * config.scale_stage2;

                        const life = Math.random() * (config.life_max - config.life_min) + config.life_min;
                        child.customData = { lifeTimer: life };
                    }
                }
            } else if (bullet.state === 's4_stage2') {
                bullet.customData.lifeTimer -= (delta / 60);
                if (bullet.customData.lifeTimer <= 0) {
                    sounds.playSE('bang2');
                    bullet.isDead = true;

                    const baseAngle = Math.random() * Math.PI * 2;
                    for (let i = 0; i < 6; i++) {
                        const theta = baseAngle + (i * Math.PI * 2 / 6);
                        const vx = Math.cos(theta) * config.speed_stage3;
                        const vy = Math.sin(theta) * config.speed_stage3;

                        const child = manager.spawnBullet('s4_c5', bullet.sprite.x, bullet.sprite.y, vx, vy);
                        child.state = 's4_stage3';

                        // Stage 3 サイズ適用
                        child.sprite.scale.set(config.scale_stage3);
                        child.hitRadius = 8 * config.scale_stage3;
                    }
                }
            }
        }
    },

    4: { // Stage 5 Logic (Side Exploding)
        spawn: (manager, delta, elapsedTime) => {
            const config = S5_CONFIG;
            manager.spawnTimer -= (delta / 60);

            if (manager.spawnTimer <= 0) {
                // スポーン間隔の決定
                let minInt, maxInt;
                if (elapsedTime < 47) { // 2~47秒 (残り 58~13秒)
                    minInt = config.spawn_early_min;
                    maxInt = config.spawn_early_max;
                } else { // 47~60秒 (残り 13~0秒)
                    minInt = config.spawn_late_min;
                    maxInt = config.spawn_late_max;
                }
                manager.spawnTimer = Math.random() * (maxInt - minInt) + minInt;

                // 位置と方向の決定
                const isLeftStart = Math.random() < 0.5;
                const x = isLeftStart ? 0 : WIDTH;
                const y = Math.random() * HEIGHT;

                // 親弾生成
                const b = manager.spawnBullet('s5_c1', x, y, 0, 0);
                b.state = 's5_parent';
                b.sprite.scale.set(config.parent_scale);
                b.hitRadius = 8 * config.parent_scale;

                // 初速と加速度設定
                const speed = config.parent_initial_speed;
                const accel = config.parent_accel;

                if (isLeftStart) {
                    // 左から右へ加速
                    b.vx = speed;
                    b.customData = { ax: accel, direction: 1 };
                    // 画像を右向きにするなら scale.x を反転させてもいいが、今回は回転で制御しない
                } else {
                    // 右から左へ加速
                    b.vx = -speed;
                    b.customData = { ax: -accel, direction: -1 };
                }
            }
        },

        updateBullet: (bullet, delta, player, manager) => {
            const config = S5_CONFIG;

            if (bullet.state === 's5_parent') {
                // 加速移動
                bullet.vx += bullet.customData.ax * delta;

                // 端到達判定
                const margin = -50; // 少し余裕を持って判定
                let exploded = false;

                // 左開始(direction=1) -> 右端到達で爆発
                if (bullet.customData.direction === 1 && bullet.sprite.x > WIDTH) {
                    exploded = true;
                }
                // 右開始(direction=-1) -> 左端到達で爆発
                else if (bullet.customData.direction === -1 && bullet.sprite.x < 0) {
                    exploded = true;
                }

                if (exploded) {
                    bullet.isDead = true;
                    sounds.playSE('side_explode');

                    // 爆発位置調整（画面端ぴったり）
                    const explodeX = (bullet.customData.direction === 1) ? WIDTH : 0;

                    // エフェクト生成
                    manager.spawnEffect('s5_bomb', explodeX, bullet.sprite.y, 5, config.effect_interval, config.effect_scale);

                    // 子弾拡散 (32個)
                    const count = config.blast_count;
                    const speed = config.blast_speed;
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        const vx = Math.cos(angle) * speed;
                        const vy = Math.sin(angle) * speed;

                        const child = manager.spawnBullet('s5_c2', explodeX, bullet.sprite.y, vx, vy);
                        child.state = 's5_child';
                        child.sprite.scale.set(config.child_scale);
                        child.hitRadius = 8 * config.child_scale;
                    }
                }
            }

            // s5_child は単純な直進弾なので、共通処理で移動し、画面外へ出たら消える
            // ただし、生成位置が画面端なので、即座に消えないようにBulletManager側でマージンを取っている必要がある
        }
    },

    5: { // Stage 6 Logic (Bouncy)
        spawn: (manager, delta, elapsedTime) => {
            const config = S6_CONFIG;
            manager.spawnTimer -= (delta / 60);

            if (manager.spawnTimer <= 0) {
                manager.spawnTimer = config.spawn_interval;

                const currentCount = manager.bullets.filter(b => b.state === 's6_parent').length;

                if (currentCount < config.max_on_screen) {
                    for (let i = 0; i < config.spawn_count; i++) {
                        let x, y, dist;
                        let retry = 0;
                        do {
                            x = Math.random() * (WIDTH - 100) + 50;
                            y = Math.random() * (HEIGHT - 100) + 50;
                            const dx = x - manager.player.x;
                            const dy = y - manager.player.y;
                            dist = Math.sqrt(dx * dx + dy * dy);
                            retry++;
                        } while (dist < config.safe_distance && retry < 15);

                        const b = manager.spawnBullet('s6_c1', x, y, 0, 0);
                        b.state = 's6_parent';

                        // 画像サイズに合わせて当たり判定を設定
                        b.setScale(config.parent_scale);

                        b.customData = {
                            internalState: 'blink',
                            timer: 0,
                            blinkTimer: 0,
                            stopCount: 0,
                            moveTimer: 0,
                            angle: 0,
                            currentSpeed: 0
                        };
                        b.sprite.alpha = 0;
                    }
                }
            }
        },

        updateBullet: (bullet, delta, player, manager) => {
            const config = S6_CONFIG;
            const data = bullet.customData;

            if (bullet.state === 's6_parent') {
                if (data.internalState === 'blink') {
                    data.timer += (delta / 60);
                    data.blinkTimer += (delta / 60);

                    if (data.blinkTimer >= config.blink_rate) {
                        data.blinkTimer = 0;
                        bullet.sprite.alpha = (bullet.sprite.alpha === 0) ? 1 : 0;
                    }

                    if (data.timer >= config.blink_duration) {
                        bullet.sprite.alpha = 1;
                        data.internalState = 'move';
                        data.timer = 0;
                        data.moveTimer = 0;
                        data.currentSpeed = 0;
                        data.angle = Math.random() * Math.PI * 2;
                    }
                }
                else if (data.internalState === 'move') {
                    data.moveTimer += (delta / 60);
                    const totalMoveTime = config.move_accel_time + config.move_decel_time;

                    // 速度計算 (加速 -> 減速)
                    if (data.moveTimer <= config.move_accel_time) {
                        const progress = data.moveTimer / config.move_accel_time;
                        data.currentSpeed = config.max_speed * progress;
                    } else {
                        const progress = (data.moveTimer - config.move_accel_time) / config.move_decel_time;
                        data.currentSpeed = config.max_speed * (1.0 - progress);
                    }

                    // 速度成分算出
                    bullet.vx = Math.cos(data.angle) * data.currentSpeed;
                    bullet.vy = Math.sin(data.angle) * data.currentSpeed;

                    // 移動
                    bullet.sprite.x += bullet.vx * delta;
                    bullet.sprite.y += bullet.vy * delta;

                    // --- 壁反射処理 (修正版: 押し戻しと角度更新) ---
                    const margin = bullet.hitRadius;
                    let bounced = false;

                    // 左壁
                    if (bullet.sprite.x < margin) {
                        bullet.sprite.x = margin; // 座標補正
                        // 壁に向かって進んでいる場合のみ反射（スタック防止）
                        if (Math.cos(data.angle) < 0) {
                            data.angle = Math.PI - data.angle;
                            bounced = true;
                        }
                    }
                    // 右壁
                    else if (bullet.sprite.x > WIDTH - margin) {
                        bullet.sprite.x = WIDTH - margin; // 座標補正
                        if (Math.cos(data.angle) > 0) {
                            data.angle = Math.PI - data.angle;
                            bounced = true;
                        }
                    }

                    // 上壁
                    if (bullet.sprite.y < margin) {
                        bullet.sprite.y = margin; // 座標補正
                        if (Math.sin(data.angle) < 0) {
                            data.angle = -data.angle;
                            bounced = true;
                        }
                    }
                    // 下壁
                    else if (bullet.sprite.y > HEIGHT - margin) {
                        bullet.sprite.y = HEIGHT - margin; // 座標補正
                        if (Math.sin(data.angle) > 0) {
                            data.angle = -data.angle;
                            bounced = true;
                        }
                    }

                    if (bounced) {
                        sounds.playSE('bounce');
                        // 反射後の角度に合わせて即座にvx, vyも更新しておくと安全
                        bullet.vx = Math.cos(data.angle) * data.currentSpeed;
                        bullet.vy = Math.sin(data.angle) * data.currentSpeed;
                    }

                    // 移動終了判定
                    if (data.moveTimer >= totalMoveTime) {
                        data.currentSpeed = 0;
                        bullet.vx = 0;
                        bullet.vy = 0;

                        sounds.playSE('shoot');
                        data.stopCount++;

                        const isOdd = (data.stopCount % 2 !== 0);
                        const baseAngles = isOdd
                            ? [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]
                            : [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];

                        baseAngles.forEach(theta => {
                            const vx = Math.cos(theta) * config.child_speed;
                            const vy = Math.sin(theta) * config.child_speed;
                            const child = manager.spawnBullet('s6_c2', bullet.sprite.x, bullet.sprite.y, vx, vy);
                            child.state = 's6_child';

                            // 画像サイズに合わせて設定
                            child.setScale(config.child_scale);

                            child.sprite.rotation = theta;
                        });

                        data.internalState = 'wait';
                        data.timer = 0;
                    }
                }
                else if (data.internalState === 'wait') {
                    data.timer += (delta / 60);
                    if (data.timer >= config.shoot_wait_time) {
                        data.internalState = 'move';
                        data.timer = 0;
                        data.moveTimer = 0;
                        data.angle = Math.random() * Math.PI * 2;
                    }
                }
            }
        }
    },
    6: { // Stage 7 Logic (Target Rush)
        spawn: (manager, delta, elapsedTime) => {
            const config = S7_CONFIG;
            manager.spawnTimer -= (delta / 60);

            if (manager.spawnTimer <= 0) {
                // 残り時間による間隔調整
                let minInt, maxInt;
                if (elapsedTime < 46) {
                    minInt = config.spawn_interval_normal_min;
                    maxInt = config.spawn_interval_normal_max;
                } else {
                    minInt = config.spawn_interval_rush_min;
                    maxInt = config.spawn_interval_rush_max;
                }
                manager.spawnTimer = Math.random() * (maxInt - minInt) + minInt;

                const y = Math.random() * HEIGHT;
                const x = WIDTH + 100; // 画面外（右側）から

                // 等速で左へ
                const vx = -config.base_speed;
                const vy = 0;

                const b = manager.spawnBullet('s7_c1', x, y, vx, vy);

                // サイズ適用
                b.setScale(config.bullet_scale);

                // ターゲットモード判定
                const isTarget = Math.random() < config.target_chance;

                b.state = 's7_move';
                b.customData = {
                    isTarget: isTarget,
                    lockTimer: 0,
                    animTimer: 0,
                    afterImageTimer: 0,
                    texIndex: 1,
                    ay: 0
                };
            }
        },

        updateBullet: (bullet, delta, player, manager) => {
            const config = S7_CONFIG;
            const data = bullet.customData;

            if (bullet.state === 's7_move') {
                // 左へ移動中 (vxは共通updateで加算)
                if (data.isTarget) {
                    // プレイヤーのX座標と一致（通過）したか判定
                    if (bullet.sprite.x <= player.x) {
                        bullet.state = 's7_lock';
                        bullet.vx = 0; // 停止
                        data.lockTimer = 0;
                        sounds.playSE('s1_target');
                    }
                }
            }
            else if (bullet.state === 's7_lock') {
                // 停止＆アニメーション中
                data.lockTimer += (delta / 60);

                data.animTimer += (delta / 60);
                if (data.animTimer >= config.anim_interval) {
                    data.animTimer = 0;
                    data.texIndex = (data.texIndex % 5) + 1;
                    bullet.sprite.texture = PIXI.Assets.get(`s7_c${data.texIndex}`);
                }

                if (data.lockTimer >= config.lock_wait_time) {
                    bullet.state = 's7_attack';
                    // 上下加速方向を決定
                    if (player.y < bullet.sprite.y) {
                        data.ay = -config.accel_y; // 上へ
                    } else {
                        data.ay = config.accel_y;  // 下へ
                    }
                    sounds.playSE('s2_emerge');
                }
            }
            else if (bullet.state === 's7_attack') {
                // 上下に加速
                bullet.vy += data.ay * delta;

                // アニメーション継続
                data.animTimer += (delta / 60);
                if (data.animTimer >= config.anim_interval) {
                    data.animTimer = 0;
                    data.texIndex = (data.texIndex % 5) + 1;
                    bullet.sprite.texture = PIXI.Assets.get(`s7_c${data.texIndex}`);
                }

                // 残像生成
                data.afterImageTimer += (delta / 60);
                if (data.afterImageTimer >= config.afterimage_interval) {
                    data.afterImageTimer = 0;
                    manager.spawnFadeAfterImage(
                        bullet.sprite.texture,
                        bullet.sprite.x,
                        bullet.sprite.y,
                        bullet.sprite.scale.x,
                        config.afterimage_life
                    );
                }
            }
        }
    },
    7: { // Stage 8 Logic (Burst Burst Burst)
        spawn: (manager, delta, elapsedTime) => {
            const config = S8_CONFIG;

            // Warning演出はシーン遷移前に完了している前提のため、即座にスポーンロジックを開始
            // 必要に応じて spawn_initial_delay を調整する

            manager.spawnTimer -= (delta / 60);

            if (manager.spawnTimer <= 0) {
                // スポーン間隔の決定
                const remaining = 60 - elapsedTime;
                let minInt, maxInt, strongChance;

                if (remaining > 24) { // 前半
                    minInt = config.spawn_early_min;
                    maxInt = config.spawn_early_max;
                    strongChance = config.strong_chance_early;
                } else { // 後半 (残り24秒以下)
                    minInt = config.spawn_late_min;
                    maxInt = config.spawn_late_max;
                    strongChance = config.strong_chance_late;
                }
                manager.spawnTimer = Math.random() * (maxInt - minInt) + minInt;

                // スポーン位置 (プレイヤーに近すぎない場所)
                let x, y, dist;
                let retry = 0;
                do {
                    x = Math.random() * (WIDTH - 100) + 50;
                    y = Math.random() * (HEIGHT - 100) + 50;
                    const dx = x - manager.player.x;
                    const dy = y - manager.player.y;
                    dist = Math.sqrt(dx * dx + dy * dy);
                    retry++;
                } while (dist < config.safe_distance && retry < 10);

                // 種類決定
                const isStrong = Math.random() < strongChance;

                if (isStrong) {
                    // 強化弾 (Large Burst) 予兆生成
                    sounds.playSE('s8_emerge_l');
                    const count = config.large_guide_count;
                    const radius = config.large_guide_radius;
                    const animTime = config.large_anim_time;

                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        const b = manager.spawnBullet('s8_c3', x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 0, 0);
                        b.state = 's8_guide_l';
                        b.setScale(config.large_guide_scale);
                        b.isDummy = true;

                        b.customData = {
                            centerX: x,
                            centerY: y,
                            baseAngle: angle,
                            radius: radius,
                            animTimer: 0,
                            animDuration: animTime,
                            isLeader: (i === 0)
                        };
                    }
                } else {
                    // 通常弾 (Small Burst) 予兆生成
                    sounds.playSE('s8_emerge_s');
                    const count = config.small_guide_count;
                    const radius = config.small_guide_radius;
                    const animTime = config.small_anim_time;

                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        const b = manager.spawnBullet('s8_c1', x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 0, 0);
                        b.state = 's8_guide_s';
                        b.setScale(config.small_guide_scale);
                        b.isDummy = true;

                        b.customData = {
                            centerX: x,
                            centerY: y,
                            baseAngle: angle,
                            radius: radius,
                            animTimer: 0,
                            animDuration: animTime,
                            isLeader: (i === 0)
                        };
                    }
                }
            }
        },

        updateBullet: (bullet, delta, player, manager) => {
            const config = S8_CONFIG;
            const data = bullet.customData;

            // --- 通常弾 ガイド挙動 ---
            if (bullet.state === 's8_guide_s') {
                data.animTimer += (delta / 60);
                const progress = data.animTimer / data.animDuration;

                if (progress >= 1.0) {
                    // アニメーション終了
                    if (data.isLeader) {
                        sounds.playSE('s8_blast_s');

                        // プレイヤーへの角度
                        const dx = player.x - data.centerX;
                        const dy = player.y - data.centerY;
                        const targetAngle = Math.atan2(dy, dx);

                        const count = config.small_bullet_count;
                        const spread = Math.PI / 6;
                        const startAngle = targetAngle - spread / 2;
                        const step = spread / (count - 1);

                        for (let i = 0; i < count; i++) {
                            const theta = startAngle + step * i;
                            const vx = Math.cos(theta) * config.small_bullet_speed;
                            const vy = Math.sin(theta) * config.small_bullet_speed;

                            const b = manager.spawnBullet('s8_c2', data.centerX, data.centerY, vx, vy);
                            b.state = 's8_bullet';
                            b.setScale(config.small_bullet_scale);
                            // 回転なし
                        }
                    }
                    bullet.isDead = true;
                } else {
                    const currentRadius = data.radius * (1.0 - progress);
                    const currentAngle = data.baseAngle + (progress * Math.PI);

                    bullet.sprite.x = data.centerX + Math.cos(currentAngle) * currentRadius;
                    bullet.sprite.y = data.centerY + Math.sin(currentAngle) * currentRadius;
                }
            }

            // --- 強化弾 ガイド挙動 ---
            else if (bullet.state === 's8_guide_l') {
                data.animTimer += (delta / 60);
                const progress = data.animTimer / data.animDuration;

                if (progress >= 1.0) {
                    if (data.isLeader) {
                        sounds.playSE('s8_blast_l');

                        const dx = player.x - data.centerX;
                        const dy = player.y - data.centerY;
                        const targetAngle = Math.atan2(dy, dx);

                        const wayCount = config.large_bullet_count;
                        const layerCount = config.large_layer_count;
                        const spread = Math.PI / 6;

                        const startAngle = targetAngle - spread / 2;
                        const angleStep = spread / (wayCount > 1 ? wayCount - 1 : 1);

                        for (let i = 0; i < wayCount; i++) {
                            const theta = startAngle + angleStep * i;
                            for (let j = 0; j < layerCount; j++) {
                                const spd = config.large_bullet_speed_base + config.large_bullet_speed_step * j;
                                const vx = Math.cos(theta) * spd;
                                const vy = Math.sin(theta) * spd;

                                const b = manager.spawnBullet('s8_c4', data.centerX, data.centerY, vx, vy);
                                b.state = 's8_bullet';
                                b.setScale(config.large_bullet_scale);
                                // 回転なし

                                // ★追加: 強化弾識別フラグと寿命タイマーを設定
                                b.customData = {
                                    isLarge: true,
                                    lifeTimer: 0
                                };
                            }
                        }
                    }
                    bullet.isDead = true;
                } else {
 const currentRadius = data.radius * (1.0 - progress);
                    // ★修正: 時間は1.62秒のままで、回転量を4倍に増やして高速回転に見せる
                    const currentAngle = data.baseAngle - (progress * Math.PI * 4);
                    
                    bullet.sprite.x = data.centerX + Math.cos(currentAngle) * currentRadius;
                    bullet.sprite.y = data.centerY + Math.sin(currentAngle) * currentRadius;
                }
            }

            // --- 実弾 ---
            else if (bullet.state === 's8_bullet') {
                // ★追加: 強化弾の場合の時限消滅処理
                if (data.isLarge) {
                    data.lifeTimer += (delta / 60);

                    // 2.2秒経過したら点滅モードへ
                    if (data.lifeTimer >= config.large_life_time) {
                        // 点滅開始時点で当たり判定を無効化
                        bullet.isDummy = true;

                        const blinkElapsed = data.lifeTimer - config.large_life_time;

                        // 点滅期間(0.8秒)終了で消滅
                        if (blinkElapsed >= config.large_blink_time) {
                            bullet.isDead = true;
                        } else {
                            // 高速点滅処理 (透明度0, 1を交互に)
                            // 0.03秒間隔くらいで切り替え
                            const blinkFrame = Math.floor(blinkElapsed / 0.03);
                            bullet.sprite.alpha = (blinkFrame % 2 === 0) ? 0 : 1;
                        }
                    }
                }
            }

        }
    }
};

class Bullet {
    constructor(textureName, x, y, vx, vy, manager) {
        this.manager = manager;
        const tex = PIXI.Assets.get(textureName);
        this.sprite = new PIXI.Sprite(tex);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isDead = false;
        this.isDummy = false; // 演出用弾フラグ

        // 初期化時にセット
        this.setScale(GLOBAL_SCALE);

        this.state = 'normal';
        this.timer = 0;
        this.customData = {};
    }

    // スケール変更と当たり判定の自動計算を行うメソッド
    setScale(scale) {
        this.sprite.scale.set(scale);

        // 画像の半径の50%を当たり判定とする（余白を考慮）
        // widthはスケール適用前の元のサイズ * scale になるため
        // (this.sprite.texture.width * scale) / 2 * 0.5
        const baseRadius = (this.sprite.texture.width + this.sprite.texture.height) / 4;
        this.hitRadius = baseRadius * scale * 0.5;
    }

    update(delta, player, gameTime) {
        if (this.isDead) return;

        this.sprite.x += this.vx * delta;
        this.sprite.y += this.vy * delta;

        if (this.customData.spawnedTime === undefined) {
            this.customData.spawnedTime = gameTime;
        }

        const behavior = STAGE_BEHAVIORS[this.manager.levelIndex];
        if (behavior && behavior.updateBullet) {
            behavior.updateBullet(this, delta, player, this.manager);
        }
    }

    destroy() {
        this.isDead = true;
        if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        this.sprite.destroy();
    }
}

class AfterImage {
    constructor(x, y, config) {
        this.sprite = new PIXI.Sprite(PIXI.Assets.get('s1_c2'));
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(GLOBAL_SCALE);
        this.lifeTime = 0;
        this.isDead = false;
        this.step = 0;
        this.step1Duration = config ? config.afterimage_life_step1 : 0.25;
        this.step2Duration = config ? config.afterimage_life_step2 : 0.25;
    }

    update(delta) {
        this.lifeTime += delta / 60;
        if (this.step === 0 && this.lifeTime >= this.step1Duration) {
            this.step = 1;
            this.sprite.texture = PIXI.Assets.get('s1_c3');
            this.lifeTime = 0;
        }
        if (this.step === 1 && this.lifeTime >= this.step2Duration) {
            this.isDead = true;
        }
    }

    destroy() {
        this.isDead = true;
        if (this.sprite.parent) this.sprite.parent.removeChild(this.sprite);
        this.sprite.destroy();
    }
}
class FadeAfterImage {
    constructor(texture, x, y, scale, lifeTime) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(scale);
        this.sprite.alpha = 0.6; // 初期透明度
        this.lifeTime = lifeTime;
        this.initialLife = lifeTime;
        this.isDead = false;
    }

    update(delta) {
        this.lifeTime -= delta / 60;
        this.sprite.alpha = 0.6 * (this.lifeTime / this.initialLife);
        if (this.lifeTime <= 0) {
            this.isDead = true;
        }
    }

    destroy() {
        this.isDead = true;
        if (this.sprite.parent) this.sprite.parent.removeChild(this.sprite);
        this.sprite.destroy();
    }
}
// 連番アニメーションエフェクト用クラス
class BombEffect {
    constructor(baseName, x, y, totalFrames, interval, scale) {
        this.baseName = baseName;
        this.totalFrames = totalFrames;
        this.interval = interval;

        this.currentFrame = 1;
        this.timer = 0;
        this.isDead = false;

        const tex = PIXI.Assets.get(`${baseName}1`);
        this.sprite = new PIXI.Sprite(tex);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.set(scale);
    }

    update(delta) {
        this.timer += (delta / 60);
        if (this.timer >= this.interval) {
            this.timer = 0;
            this.currentFrame++;
            if (this.currentFrame > this.totalFrames) {
                this.isDead = true;
            } else {
                this.sprite.texture = PIXI.Assets.get(`${this.baseName}${this.currentFrame}`);
            }
        }
    }

    destroy() {
        this.isDead = true;
        if (this.sprite.parent) this.sprite.parent.removeChild(this.sprite);
        this.sprite.destroy();
    }
}

export class BulletManager {
    constructor(app, layer, player, levelIndex) {
        this.app = app;
        this.layer = layer;
        this.player = player;
        this.levelIndex = levelIndex;
        this.bullets = [];
        this.effects = [];

        // ステージごとの初期タイマー設定
        // すべてのステージで2.0秒の待機を入れる
        const INITIAL_WAIT_SEC = 2.0;

        if (this.levelIndex === 0) { // Stage 1 (Frame based logic)
            // Stage 1 ロジックは spawnTimer をフレームとして扱うため 2.0 * 60
            this.spawnTimer = INITIAL_WAIT_SEC * 60;
        } else if (this.levelIndex === 1) { // Stage 2 (Second based logic)
            this.spawnTimer = INITIAL_WAIT_SEC;
        } else if (this.levelIndex === 2) { // Stage 3 (Frame based logic)
            // Stage 3 ロジックはフレームとして扱う
            this.spawnTimer = INITIAL_WAIT_SEC * 60;
        } else if (this.levelIndex === 3) { // Stage 4 (Second based logic)
            this.spawnTimer = INITIAL_WAIT_SEC;
        } else if (this.levelIndex === 4) { // Stage 5 (Second based logic)
            this.spawnTimer = INITIAL_WAIT_SEC;
        } else if (this.levelIndex === 5) { // Stage 6 (Second based logic)
            this.spawnTimer = INITIAL_WAIT_SEC;
        } else if (this.levelIndex === 6) { // Stage 7
            this.spawnTimer = INITIAL_WAIT_SEC;
        } else if (this.levelIndex === 7) { // Stage 8 (Burst Burst Burst)
            // Warning演出があるため、BulletManager側の待機は0でよい（ロジック側で制御）
            this.spawnTimer = 0.5;
        } else {
            this.spawnTimer = 0;
        }

        this.canTransform = false;
    }

    update(delta, gameTime) {
        const elapsedTime = 60 - gameTime;

        if (this.levelIndex === 0) {
            this.canTransform = (elapsedTime >= STAGE_CONFIGS[0].transform_start_time);
        }

        const behavior = STAGE_BEHAVIORS[this.levelIndex];
        if (behavior && behavior.spawn) {
            behavior.spawn(this, delta, elapsedTime);
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.update(delta, this.player, gameTime);

            // 画面外削除判定
            // Stage 3, 5, 8 はマージンを大きく取る
            const bigMarginStages = [2, 4, 5, 7];
            const margin = bigMarginStages.includes(this.levelIndex) ? 600 : 100;

            if (b.isDead || b.sprite.y > HEIGHT + margin || b.sprite.x < -margin || b.sprite.x > WIDTH + margin || b.sprite.y < -margin) {
                b.destroy();
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const e = this.effects[i];
            e.update(delta);
            if (e.isDead) {
                e.destroy();
                this.effects.splice(i, 1);
            }
        }
    }

    spawnBullet(texName, x, y, vx, vy) {
        const b = new Bullet(texName, x, y, vx, vy, this);
        this.layer.addChild(b.sprite);
        this.bullets.push(b);
        return b;
    }

    spawnAfterImage(x, y) {
        const config = STAGE_CONFIGS[this.levelIndex];
        const e = new AfterImage(x, y, config);
        this.layer.addChildAt(e.sprite, 0);
        this.effects.push(e);
    }
    // 追加: 汎用フェード残像生成
    spawnFadeAfterImage(texture, x, y, scale, lifeTime) {
        const e = new FadeAfterImage(texture, x, y, scale, lifeTime);
        this.layer.addChildAt(e.sprite, 0);
        this.effects.push(e);
    }

    spawnEffect(baseName, x, y, totalFrames, interval, scale) {
        const e = new BombEffect(baseName, x, y, totalFrames, interval, scale);
        // エフェクトは弾より手前に表示
        this.layer.addChild(e.sprite);
        this.effects.push(e);
    }

    checkCollision(playerHitRadius) {
        const px = this.player.x;
        const py = this.player.y;

        for (const b of this.bullets) {
            if (b.isDead) continue;
            // 演出用弾（ダミー）は当たり判定を行わない
            if (b.isDummy) continue;

            // テクスチャ未ロード等の場合はスキップ
            if (!b.sprite.texture) continue;

            // 1. 弾の画像サイズを取得 (スケール考慮)
            const tex = b.sprite.texture;
            const realW = tex.width * Math.abs(b.sprite.scale.x);
            const realH = tex.height * Math.abs(b.sprite.scale.y);

            // 2. 足切り判定（包容円による高速化）
            const dx = px - b.sprite.x;
            const dy = py - b.sprite.y;
            const distSq = dx * dx + dy * dy;

            const boundingRadius = Math.sqrt(realW * realW + realH * realH) / 2;
            if (distSq > (boundingRadius + playerHitRadius) ** 2) {
                continue;
            }

            // 3. OBB(有向境界箱) vs 円 の厳密判定
            const rotation = b.sprite.rotation;
            const cos = Math.cos(-rotation);
            const sin = Math.sin(-rotation);

            // ローカル座標でのプレイヤー位置 (弾の中心が原点)
            const localX = dx * cos - dy * sin;
            const localY = dx * sin + dy * cos;

            // 弾丸の矩形範囲（中心原点）
            const halfW = realW / 2;
            const halfH = realH / 2;

            // 矩形上で最もプレイヤーに近い点(Closest Point)を求める
            const closestX = Math.max(-halfW, Math.min(halfW, localX));
            const closestY = Math.max(-halfH, Math.min(halfH, localY));

            // その点とプレイヤー中心（ローカル座標）との距離を計算
            const distanceX = localX - closestX;
            const distanceY = localY - closestY;
            const distanceSq = distanceX * distanceX + distanceY * distanceY;

            // 距離がプレイヤーのヒット半径以内なら衝突
            if (distanceSq < playerHitRadius * playerHitRadius) {
                return true;
            }
        }
        return false;
    }

    // グレイズ判定メソッド
    // 静止している弾は除外 (速度成分が小さい場合)
    checkGraze(grazeRadius) {
        const px = this.player.x;
        const py = this.player.y;

        for (const b of this.bullets) {
            if (b.isDead) continue;
            if (b.isDummy) continue; // ダミー弾はグレイズもしない

            // 速度判定: 静止している弾はカウントしない
            const speedSq = b.vx * b.vx + b.vy * b.vy;
            if (speedSq < 0.1) continue;

            const dx = px - b.sprite.x;
            const dy = py - b.sprite.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // プレイヤーのヒット半径 + 弾の半径 + グレイズ用拡張半径
            if (dist < (PLAYER_HIT_RADIUS + b.hitRadius + grazeRadius)) {
                return true;
            }
        }
        return false;
    }

    clearAll() {
        this.bullets.forEach(b => b.destroy());
        this.bullets = [];
        this.effects.forEach(e => e.destroy());
        this.effects = [];
    }
}