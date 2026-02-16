
const CONFIG_KEY = 'danmaku_config_v1';
const PROGRESS_KEY = 'danmaku_progress_v2'; 

const DEFAULT_CONFIG = {
    bgmVolume: 0.5,
    seVolume: 0.7,
    bg: true
};

const DEFAULT_PROGRESS = {
    points: 0,
    totalProgress: 0,
    // レベルごとの戦績: index -> { cleared: bool, attempts: int, deaths: int, firstClearAttempt: int|null }
    levelStats: {} 
};

export const Storage = {
    loadConfig: () => {
        try {
            const data = localStorage.getItem(CONFIG_KEY);
            return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : { ...DEFAULT_CONFIG };
        } catch (e) {
            console.error("Config Load Error", e);
            return { ...DEFAULT_CONFIG };
        }
    },

    saveConfig: (config) => {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) { console.error("Config Save Error", e); }
    },

    loadProgress: () => {
        try {
            const data = localStorage.getItem(PROGRESS_KEY);
            const loaded = data ? JSON.parse(data) : {};
            
            // levelStatsの初期化を確実に行う
            const merged = { ...DEFAULT_PROGRESS, ...loaded };
            if (!merged.levelStats) merged.levelStats = {};
            
            return merged;
        } catch (e) {
            console.error("Progress Load Error", e);
            return { ...DEFAULT_PROGRESS };
        }
    },

    saveProgress: (progress) => {
        try {
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        } catch (e) { console.error("Progress Save Error", e); }
    },

    // 指定レベルの統計情報を取得（存在しなければ初期値を返す）
    getLevelStat: (progress, index) => {
        if (!progress.levelStats) progress.levelStats = {};
        return progress.levelStats[index] || { cleared: false, attempts: 0, deaths: 0, firstClearAttempt: null };
    },

    // 統計情報を更新して保存
    updateLevelStat: (progress, index, newStats) => {
        if (!progress.levelStats) progress.levelStats = {};
        
        // 既存のデータを取得してマージ
        const current = progress.levelStats[index] || { cleared: false, attempts: 0, deaths: 0, firstClearAttempt: null };
        progress.levelStats[index] = { ...current, ...newStats };
        
        // 進行度の再計算 (全8ステージに対するクリア率)
        let clearedCount = 0;
        const TOTAL_STAGES = 8;
        for (let i = 0; i < TOTAL_STAGES; i++) {
            const stat = progress.levelStats[i];
            if (stat && stat.cleared) {
                clearedCount++;
            }
        }
        progress.totalProgress = Math.floor((clearedCount / TOTAL_STAGES) * 100);

        // 保存
        Storage.saveProgress(progress);
    },

    clearAllData: () => {
        localStorage.removeItem(CONFIG_KEY);
        localStorage.removeItem(PROGRESS_KEY);
        window.location.reload();
    }
};