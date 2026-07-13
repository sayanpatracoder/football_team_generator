/*
==================================================
Football Team Builder Pro
Business Rules
==================================================
*/

const BUSINESS_RULES = {
    activePreset: "THREE_TEAM_7",
    
    presets: {
        THREE_TEAM_7: {
            name: "3 Teams (7 players)",
            teams: 3,
            playersPerTeam: 7,
            colors: ["Red", "Blue", "Black"],
            formation: {
                GK: 1,
                DEF: 2,
                MID: 2,
                ST: 2,
                SUB: 0
            }
        },
        
        THREE_TEAM_8: {
            name: "3 Teams (8 players)",
            teams: 3,
            playersPerTeam: 8,
            colors: ["Red", "Blue", "Black"],
            formation: {
                GK: 1,
                DEF: 2,
                MID: 2,
                ST: 2,
                SUB: 1
            }
        },
        
        FOUR_TEAM_7: {
            name: "4 Teams (7 players)",
            teams: 4,
            playersPerTeam: 7,
            colors: ["Red", "Blue", "Black", "White"],
            formation: {
                GK: 1,
                DEF: 2,
                MID: 2,
                ST: 2,
                SUB: 0
            }
        },
        
        FOUR_TEAM_8: {
            name: "4 Teams (8 players)",
            teams: 4,
            playersPerTeam: 8,
            colors: ["Red", "Blue", "Black", "White"],
            formation: {
                GK: 1,
                DEF: 2,
                MID: 2,
                ST: 2,
                SUB: 1
            }
        },
        
        SIX_TEAM_7: {
            name: "6 Teams (7 players)",
            teams: 6,
            playersPerTeam: 7,
            colors: ["Red", "Blue", "Black", "White", "Green", "Orange"],
            formation: {
                GK: 1,
                DEF: 2,
                MID: 2,
                ST: 2,
                SUB: 0
            }
        },
        
        SIX_TEAM_8: {
            name: "6 Teams (8 players)",
            teams: 6,
            playersPerTeam: 8,
            colors: ["Red", "Blue", "Black", "White", "Green", "Orange"],
            formation: {
                GK: 1,
                DEF: 2,
                MID: 2,
                ST: 2,
                SUB: 1
            }
        }
    }
};

// Returns selected preset
function getCurrentPreset() {
    return BUSINESS_RULES.presets[BUSINESS_RULES.activePreset];
}

// Change preset
function changePreset(name) {
    if (BUSINESS_RULES.presets[name]) {
        BUSINESS_RULES.activePreset = name;
        return true;
    }
    return false;
}

// Get preset by name
function getPreset(name) {
    return BUSINESS_RULES.presets[name] || null;
}

// Get all preset names
function getPresetNames() {
    return Object.keys(BUSINESS_RULES.presets);
}

// Check if player count is valid
function isValidPlayerCount(playerCount) {
    var validCounts = [21, 24, 28, 32, 42, 48];
    return validCounts.includes(playerCount);
}

// Get team config for a given count
function getTeamConfig(playerCount) {
    var configs = {
        21: { preset: 'THREE_TEAM_7', teams: 3, playersPerTeam: 7 },
        24: { preset: 'THREE_TEAM_8', teams: 3, playersPerTeam: 8 },
        28: { preset: 'FOUR_TEAM_7', teams: 4, playersPerTeam: 7 },
        32: { preset: 'FOUR_TEAM_8', teams: 4, playersPerTeam: 8 },
        42: { preset: 'SIX_TEAM_7', teams: 6, playersPerTeam: 7 },
        48: { preset: 'SIX_TEAM_8', teams: 6, playersPerTeam: 8 }
    };
    return configs[playerCount] || null;
}

// Export for use
window.BUSINESS_RULES = BUSINESS_RULES;
window.getCurrentPreset = getCurrentPreset;
window.changePreset = changePreset;
window.getPreset = getPreset;
window.getPresetNames = getPresetNames;
window.isValidPlayerCount = isValidPlayerCount;
window.getTeamConfig = getTeamConfig;

console.log('✅ BusinessRules.js loaded');