/*
==================================================
Football Team Builder Pro
Storage Manager
==================================================
*/

const Storage = {
    // Storage Keys
    KEYS: {
        PLAYERS: "football_players",
        SETTINGS: "football_settings",
        GENERATED_TEAMS: "generated_teams",
        HISTORY: "match_history"
    },

    /*
    ==========================================
    Generic Methods
    ==========================================
    */

    save(key, value) {
        return new Promise((resolve) => {
            chrome.storage.local.set({
                [key]: value
            }, () => {
                resolve();
            });
        });
    },

    load(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key]);
            });
        });
    },

    remove(key) {
        return new Promise((resolve) => {
            chrome.storage.local.remove(key, () => {
                resolve();
            });
        });
    },

    clear() {
        return new Promise((resolve) => {
            chrome.storage.local.clear(() => {
                resolve();
            });
        });
    },

    /*
    ==========================================
    Players
    ==========================================
    */

    async getPlayers() {
        const players = await this.load(this.KEYS.PLAYERS);
        return players || [];
    },

    async savePlayers(players) {
        await this.save(this.KEYS.PLAYERS, players);
    },

    /*
    ==========================================
    Migration - Convert old player format to new
    ==========================================
    */

 async migratePlayers() {
    var players = await this.getPlayers();
    if (players.length === 0) return players;
    
    var needsMigration = players.some(function(p) { return p.position !== undefined && p.primaryPosition === undefined; });
    
    if (needsMigration) {
        var migrated = players.map(function(p) {
            return {
                id: p.id || Date.now() + Math.random() * 1000,
                name: p.name || 'Unnamed',
                primaryPosition: p.position || 'MID',
                secondaryPosition: null,
                rating: p.rating || 5,
                available: p.available !== undefined ? p.available : true,
                imageUrl: p.imageUrl || null
            };
        });
        
        await this.savePlayers(migrated);
        console.log('✅ Players migrated to new format with secondary positions and images');
        return migrated;
    }
    
    return players;
},

    async getPlayersMigrated() {
        const players = await this.getPlayers();
        // Check and migrate if needed
        if (players.length > 0 && players[0].position !== undefined && players[0].primaryPosition === undefined) {
            return await this.migratePlayers();
        }
        return players;
    },

    /*
    ==========================================
    Settings
    ==========================================
    */

    async getSettings() {
        const settings = await this.load(this.KEYS.SETTINGS);
        return settings || {};
    },

    async saveSettings(settings) {
        await this.save(this.KEYS.SETTINGS, settings);
    },

    /*
    ==========================================
    Generated Teams
    ==========================================
    */

    async getGeneratedTeams() {
        const teams = await this.load(this.KEYS.GENERATED_TEAMS);
        return teams || [];
    },

    async saveGeneratedTeams(teams) {
        await this.save(this.KEYS.GENERATED_TEAMS, teams);
    },

    /*
    ==========================================
    Match History
    ==========================================
    */

    async getHistory() {
        const history = await this.load(this.KEYS.HISTORY);
        return history || [];
    },

    async saveHistory(history) {
        await this.save(this.KEYS.HISTORY, history);
    },

    async addHistory(match) {
        let history = await this.getHistory();
        history.unshift(match);
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        await this.saveHistory(history);
    }
};

// Export for use
window.Storage = Storage;

console.log('✅ Storage.js loaded');