// ==========================================
// Football Team Builder Pro - PS5 Edition
// Main Application Entry Point
// ==========================================

// Global state
window.players = [];
window.generatedTeams = [];
window.currentPreset = 'THREE_TEAM_7';

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏆 Football Team Builder Pro initialized');
    initNavigation();
    loadInitialData();
    initEventListeners();
    updateConfigFields();
});

/**
 * Sidebar navigation
 */
function initNavigation() {
    var menuButtons = document.querySelectorAll('.menu');
    menuButtons.forEach(function(button) {
        button.removeEventListener('click', handleMenuClick);
        button.addEventListener('click', handleMenuClick);
    });
}

function handleMenuClick() {
    document.querySelectorAll('.menu').forEach(function(b) { b.classList.remove('active'); });
    this.classList.add('active');
    
    var pageId = this.dataset.page;
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        if (pageId === 'players' && typeof renderPlayers === 'function') {
            renderPlayers();
        }
        if (pageId === 'generate') {
            updatePositionCounts();
            if (window.generatedTeams && window.generatedTeams.length > 0) {
                displayTeams(window.generatedTeams);
            }
        }
        updateTeamCounts();
    }
}

/**
 * Update team counts
 */
function updateTeamCounts() {
    var availablePlayers = window.players ? window.players.filter(function(p) { return p.available; }).length : 0;
    var totalPlayers = window.players ? window.players.length : 0;
    
    var availableCount = document.getElementById('availableCount');
    var totalCount = document.getElementById('totalCount');
    var availableCountMini = document.getElementById('availableCountMini');
    var totalCountMini = document.getElementById('totalCountMini');
    var playerBadge = document.getElementById('playerBadge');
    var teamBadge = document.getElementById('teamBadge');
    
    if (availableCount) availableCount.textContent = availablePlayers;
    if (totalCount) totalCount.textContent = totalPlayers;
    if (availableCountMini) availableCountMini.textContent = availablePlayers;
    if (totalCountMini) totalCountMini.textContent = totalPlayers;
    if (playerBadge) playerBadge.textContent = totalPlayers;
    if (teamBadge) teamBadge.textContent = window.generatedTeams ? window.generatedTeams.length : 0;
    
    autoSelectTeams(availablePlayers);
    updatePositionCounts();
}

/**
 * Update position counts on Generate page
 */
function updatePositionCounts() {
    var availablePlayers = [];
    if (window.players) {
        availablePlayers = window.players.filter(function(p) { return p.available; });
    }
    
    var gkCount = availablePlayers.filter(function(p) { return p.primaryPosition === 'GK'; }).length;
    var defCount = availablePlayers.filter(function(p) { return p.primaryPosition === 'DEF'; }).length;
    var midCount = availablePlayers.filter(function(p) { return p.primaryPosition === 'MID'; }).length;
    var stCount = availablePlayers.filter(function(p) { return p.primaryPosition === 'ST'; }).length;
    
    // Get the ACTUAL preset from dropdown, not the stored one
    var presetSelect = document.getElementById('preset');
    var selectedPresetName = presetSelect ? presetSelect.value : 'THREE_TEAM_7';
    
    var preset = null;
    if (typeof getPreset === 'function') {
        preset = getPreset(selectedPresetName);
    }
    if (!preset && typeof getCurrentPreset === 'function') {
        preset = getCurrentPreset();
    }
    if (!preset) {
        preset = {
            teams: 3,
            formation: { GK: 1, DEF: 2, MID: 2, ST: 2 }
        };
    }
    
    var formation = preset.formation || { GK: 1, DEF: 2, MID: 2, ST: 2 };
    var teams = preset.teams || 3;
    
    var gkNeed = formation.GK * teams;
    var defNeed = formation.DEF * teams;
    var midNeed = formation.MID * teams;
    var stNeed = formation.ST * teams;
    
    var gkEl = document.getElementById('gkCountGen');
    var defEl = document.getElementById('defCountGen');
    var midEl = document.getElementById('midCountGen');
    var stEl = document.getElementById('stCountGen');
    
    if (gkEl) gkEl.textContent = gkCount;
    if (defEl) defEl.textContent = defCount;
    if (midEl) midEl.textContent = midCount;
    if (stEl) stEl.textContent = stCount;
    
    var gkNeedEl = document.getElementById('gkNeed');
    var defNeedEl = document.getElementById('defNeed');
    var midNeedEl = document.getElementById('midNeed');
    var stNeedEl = document.getElementById('stNeed');
    
    if (gkNeedEl) {
        gkNeedEl.textContent = '(Need: ' + gkNeed + ')';
        gkNeedEl.style.color = gkCount >= gkNeed ? '#22c55e' : '#ef4444';
    }
    if (defNeedEl) {
        defNeedEl.textContent = '(Need: ' + defNeed + ')';
        defNeedEl.style.color = defCount >= defNeed ? '#22c55e' : '#ef4444';
    }
    if (midNeedEl) {
        midNeedEl.textContent = '(Need: ' + midNeed + ')';
        midNeedEl.style.color = midCount >= midNeed ? '#22c55e' : '#ef4444';
    }
    if (stNeedEl) {
        stNeedEl.textContent = '(Need: ' + stNeed + ')';
        stNeedEl.style.color = stCount >= stNeed ? '#22c55e' : '#ef4444';
    }
}

/**
 * Auto-select teams based on available players
 */
function autoSelectTeams(availablePlayers) {
    var presetSelect = document.getElementById('preset');
    var teamsInput = document.getElementById('teams');
    var playersPerTeamInput = document.getElementById('playersPerTeam');
    var gkInput = document.getElementById('gk');
    var defInput = document.getElementById('def');
    var midInput = document.getElementById('mid');
    var stInput = document.getElementById('st');
    var subInput = document.getElementById('sub');
    var generateBtn = document.getElementById('generateBtn');
    
    var exactMatches = {
        21: { preset: 'THREE_TEAM_7', teams: 3, playersPerTeam: 7, formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 0 } },
        24: { preset: 'THREE_TEAM_8', teams: 3, playersPerTeam: 8, formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 1 } },
        28: { preset: 'FOUR_TEAM_7', teams: 4, playersPerTeam: 7, formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 0 } },
        32: { preset: 'FOUR_TEAM_8', teams: 4, playersPerTeam: 8, formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 1 } },
        42: { preset: 'SIX_TEAM_7', teams: 6, playersPerTeam: 7, formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 0 } },
        48: { preset: 'SIX_TEAM_8', teams: 6, playersPerTeam: 8, formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 1 } }
    };
    
    var config = exactMatches[availablePlayers];
    
    var allFields = ['teams', 'playersPerTeam', 'gk', 'def', 'mid', 'st', 'sub'];
    allFields.forEach(function(id) {
        var field = document.getElementById(id);
        if (field) {
            field.disabled = true;
            field.style.opacity = '0.4';
            field.style.cursor = 'not-allowed';
        }
    });
    
    if (config) {
        if (presetSelect) {
            presetSelect.value = config.preset;
            // Update the active preset in BUSINESS_RULES
            if (typeof changePreset === 'function') {
                changePreset(config.preset);
            }
        }
        if (teamsInput) teamsInput.value = config.teams;
        if (playersPerTeamInput) playersPerTeamInput.value = config.playersPerTeam;
        if (gkInput) gkInput.value = config.formation.GK;
        if (defInput) defInput.value = config.formation.DEF;
        if (midInput) midInput.value = config.formation.MID;
        if (stInput) stInput.value = config.formation.ST;
        if (subInput) subInput.value = config.formation.SUB;
        
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.style.opacity = '1';
            generateBtn.style.cursor = 'pointer';
        }
        
        updatePositionCounts();
    } else {
        if (presetSelect) presetSelect.value = 'THREE_TEAM_7';
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.style.opacity = '0.4';
            generateBtn.style.cursor = 'not-allowed';
        }
    }
}

function enableConfigFields(enabled) {
    // Kept for compatibility
}

/**
 * Load initial data
 */
async function loadInitialData() {
    try {
        if (typeof Storage !== 'undefined') {
            window.players = await Storage.getPlayersMigrated();
            console.log('✅ Loaded ' + window.players.length + ' players');
        }
        
        if (typeof renderPlayers === 'function') renderPlayers();
        updateTeamCounts();
        updatePositionCounts();
        
        if (typeof Storage !== 'undefined') {
            var settings = await Storage.getSettings();
            if (settings && settings.preset && typeof changePreset === 'function') {
                changePreset(settings.preset);
            }
        }
        
        if (typeof Storage !== 'undefined') {
            window.generatedTeams = await Storage.getGeneratedTeams();
            if (window.generatedTeams && window.generatedTeams.length > 0) {
                if (typeof displayTeams === 'function') {
                    displayTeams(window.generatedTeams);
                }
                updateTeamActions();
            }
        }
    } catch (error) {
        console.error('Failed to load data:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to load data', 'error');
        }
    }
}

/**
 * Setup event listeners
 */
function initEventListeners() {
    console.log('Setting up event listeners...');
    
    var generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.removeEventListener('click', handleGenerateTeams);
        generateBtn.addEventListener('click', handleGenerateTeams);
        console.log('✅ Generate button listener attached');
    }
    
    var shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) {
        shuffleBtn.removeEventListener('click', handleGenerateTeams);
        shuffleBtn.addEventListener('click', handleGenerateTeams);
        console.log('✅ Shuffle button listener attached');
    }
    
    var presetSelect = document.getElementById('preset');
    if (presetSelect) {
        presetSelect.removeEventListener('change', function() {
            var presetName = this.value;
            console.log('📌 Preset changed to:', presetName);
            if (typeof changePreset === 'function') {
                changePreset(presetName);
            }
            updateConfigFields();
            updatePositionCounts();
            if (typeof Storage !== 'undefined') {
                Storage.saveSettings({ preset: presetName });
            }
        });
        presetSelect.addEventListener('change', function() {
            var presetName = this.value;
            console.log('📌 Preset changed to:', presetName);
            if (typeof changePreset === 'function') {
                changePreset(presetName);
            }
            updateConfigFields();
            updatePositionCounts();
            if (typeof Storage !== 'undefined') {
                Storage.saveSettings({ preset: presetName });
            }
        });
    }
    
    var saveDefaultsBtn = document.getElementById('saveDefaults');
    if (saveDefaultsBtn) {
        saveDefaultsBtn.addEventListener('click', saveDefaultSettings);
    }
    
    var clearAllBtn = document.getElementById('clearAllData');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllData);
    }
    
    var resetPlayersBtn = document.getElementById('resetPlayers');
    if (resetPlayersBtn) {
        resetPlayersBtn.addEventListener('click', resetPlayersOnly);
    }
    
    var resetTeamsBtn = document.getElementById('resetTeams');
    if (resetTeamsBtn) {
        resetTeamsBtn.addEventListener('click', resetTeamsOnly);
    }
    
    var resetSettingsBtn = document.getElementById('resetSettings');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', resetSettingsOnly);
    }
    
    var exportDataBtn = document.getElementById('exportData');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportAllData);
    }
    
    var importDataBtn = document.getElementById('importData');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', importAllData);
    }
}

/**
 * Handle team generation - FIXED
 */
async function handleGenerateTeams() {
    console.log('🎯 Generate button clicked!');
    
    try {
        if (!window.players || window.players.length === 0) {
            showToast('Please add players first', 'error');
            return;
        }
        
        var available = window.players.filter(function(p) { return p.available; });
        if (available.length === 0) {
            showToast('No available players. Check player availability.', 'error');
            return;
        }
        
        // Get the selected preset from dropdown
        var presetSelect = document.getElementById('preset');
        var selectedPresetName = presetSelect ? presetSelect.value : 'THREE_TEAM_7';
        
        console.log('📌 Selected preset from dropdown:', selectedPresetName);
        
        // Get the preset object directly from BUSINESS_RULES
        var preset = null;
        if (typeof BUSINESS_RULES !== 'undefined' && BUSINESS_RULES.presets) {
            preset = BUSINESS_RULES.presets[selectedPresetName];
        }
        
        // If not found, try getPreset function
        if (!preset && typeof getPreset === 'function') {
            preset = getPreset(selectedPresetName);
        }
        
        // If still not found, try getCurrentPreset
        if (!preset && typeof getCurrentPreset === 'function') {
            preset = getCurrentPreset();
        }
        
        // If still no preset, create a default one based on the selection
        if (!preset) {
            console.warn('⚠️ No preset found for:', selectedPresetName, 'creating default');
            // Create preset based on the name
            if (selectedPresetName === 'THREE_TEAM_8' || selectedPresetName === 'FOUR_TEAM_8' || selectedPresetName === 'SIX_TEAM_8') {
                preset = {
                    teams: selectedPresetName === 'THREE_TEAM_8' ? 3 : selectedPresetName === 'FOUR_TEAM_8' ? 4 : 6,
                    playersPerTeam: 8,
                    colors: ['Red', 'Blue', 'Black'],
                    formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 1 }
                };
            } else {
                preset = {
                    teams: selectedPresetName === 'THREE_TEAM_7' ? 3 : selectedPresetName === 'FOUR_TEAM_7' ? 4 : 6,
                    playersPerTeam: 7,
                    colors: ['Red', 'Blue', 'Black'],
                    formation: { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 0 }
                };
            }
        }
        
        console.log('📌 Using preset:', preset);
        console.log('📌 Formation:', preset.formation);
        console.log('📌 Players per team:', preset.playersPerTeam);
        console.log('📌 Teams:', preset.teams);
        
        // Check if we have enough players
        var totalNeeded = preset.teams * preset.playersPerTeam;
        if (available.length < totalNeeded) {
            showToast('Need ' + totalNeeded + ' players for ' + preset.teams + ' teams. Have ' + available.length + '.', 'error');
            return;
        }
        
        var generateBtn = document.getElementById('generateBtn');
        var originalText = generateBtn ? generateBtn.textContent : 'Generate';
        if (generateBtn) {
            generateBtn.textContent = '⏳ Generating...';
            generateBtn.disabled = true;
        }
        
        // Call balanceTeams with the preset
        var result = null;
        if (typeof balanceTeams === 'function') {
            result = balanceTeams(window.players, preset);
        }
        
        if (generateBtn) {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }
        
        if (!result || result.error) {
            showToast(result ? result.error : 'Failed to generate teams', 'error');
            return;
        }
        
        window.generatedTeams = result.teams;
        if (typeof Storage !== 'undefined') {
            await Storage.saveGeneratedTeams(window.generatedTeams);
        }
        
        if (typeof displayTeams === 'function') {
            displayTeams(window.generatedTeams);
        }
        updateTeamCounts();
        updateTeamActions();
        updatePositionCounts();
        
        showToast('✅ ' + preset.teams + ' teams generated successfully with ' + preset.playersPerTeam + ' players each!', 'success');
        
    } catch (error) {
        console.error('Generation failed:', error);
        showToast('Failed to generate teams', 'error');
        var generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.textContent = '⚽ Generate';
            generateBtn.disabled = false;
        }
    }
}

/**
 * Display teams
 */
function displayTeams(teams) {
    var container = document.getElementById('teamContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!teams || teams.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:60px 20px;"><div style="font-size:64px;margin-bottom:20px;">⚽</div><p style="font-size:20px;font-weight:700;color:#ffffff;">No teams generated yet</p><p style="font-size:16px;margin-top:8px;">Add players and click Generate!</p></div>';
        updateTeamActions();
        return;
    }
    
    var colors = ['#00d4ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff'];
    var positionColors = { GK: '#facc15', DEF: '#3b82f6', MID: '#10b981', ST: '#f97316' };
    var positionEmojis = { GK: '🧤', DEF: '🛡️', MID: '⚡', ST: '⚽' };
    var positionNames = { GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', ST: 'Striker' };
    
    teams.forEach(function(team, index) {
        var teamCard = document.createElement('div');
        teamCard.className = 'teamCard ps5-team-card';
        var teamColor = colors[index % colors.length];
        
        var positions = { GK: [], DEF: [], MID: [], ST: [], SUB: [] };
        team.players.forEach(function(player) {
            var pos = player.primaryPosition || player.position || 'SUB';
            if (positions[pos]) positions[pos].push(player);
            else positions.SUB.push(player);
        });
        
        var pitchHTML = '';
        var positionOrder = ['GK', 'DEF', 'MID', 'ST'];
        var positionLabels = { GK: 'GK', DEF: 'DEF', MID: 'MID', ST: 'ST' };
        
        positionOrder.forEach(function(pos) {
            var playersInPos = positions[pos] || [];
            if (playersInPos.length > 0) {
                pitchHTML += '<div class="ps5-pitch-row">';
                pitchHTML += '<div class="ps5-pitch-label" style="color:' + positionColors[pos] + '">' + positionEmojis[pos] + ' ' + positionLabels[pos] + '</div>';
                pitchHTML += '<div class="ps5-pitch-players">';
                playersInPos.forEach(function(p) {
                    var playerImage = p.imageUrl ? 
                        '<img src="' + p.imageUrl + '" alt="' + p.name + '" class="ps5-player-avatar-mini" onerror="this.style.display=\'none\';">' :
                        '<div class="ps5-player-initial-mini" style="background:' + (positionColors[p.primaryPosition || p.position] || '#4a5568') + ';">' + (p.name ? p.name.charAt(0).toUpperCase() : '?') + '</div>';
                    
                    var starsCount = p.rating || 0;
                    var starDots = '';
                    for (var s = 0; s < starsCount; s++) starDots += '⭐';
                    
                    var secondaryInfo = p.secondaryPosition ? ' (' + p.secondaryPosition + ')' : '';
                    
                    pitchHTML += '<div class="ps5-player-card-mini"><div class="ps5-player-avatar-mini-wrapper">' + playerImage + '<div class="ps5-player-status-dot ' + (p.available ? 'available' : 'unavailable') + '"></div></div><div class="ps5-player-info-mini"><div class="ps5-player-name-mini">' + (p.name || 'Unknown') + '</div><div class="ps5-player-position-mini">' + (positionNames[p.primaryPosition || p.position] || p.primaryPosition || p.position) + secondaryInfo + '</div><div class="ps5-player-stars-mini">' + starDots + '</div></div></div>';
                });
                pitchHTML += '</div></div>';
            }
        });
        
        if (positions.SUB && positions.SUB.length > 0) {
            pitchHTML += '<div class="ps5-pitch-row" style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:8px;">';
            pitchHTML += '<div class="ps5-pitch-label" style="color:#94a3b8;">🔄 SUB</div>';
            pitchHTML += '<div class="ps5-pitch-players">';
            positions.SUB.forEach(function(p) {
                var playerImage = p.imageUrl ? 
                    '<img src="' + p.imageUrl + '" alt="' + p.name + '" class="ps5-player-avatar-mini" style="width:24px;height:24px;" onerror="this.style.display=\'none\';">' :
                    '<div class="ps5-player-initial-mini" style="width:24px;height:24px;font-size:9px;background:#4a5568;">' + (p.name ? p.name.charAt(0).toUpperCase() : '?') + '</div>';
                
                pitchHTML += '<div class="ps5-player-card-mini" style="opacity:0.6;"><div class="ps5-player-avatar-mini-wrapper">' + playerImage + '</div><div class="ps5-player-info-mini"><div class="ps5-player-name-mini" style="font-size:10px;">' + (p.name || 'Unknown') + '</div><div class="ps5-player-position-mini" style="font-size:8px;">' + (p.primaryPosition || p.position) + '</div></div></div>';
            });
            pitchHTML += '</div></div>';
        }
        
        var avgRating = team.rating || 0;
        
        teamCard.innerHTML = '<div class="ps5-team-header" style="border-color:' + teamColor + ';"><div class="ps5-team-name" style="background:' + teamColor + ';">Team ' + String.fromCharCode(65 + index) + '</div><div class="ps5-team-stats"><span class="ps5-team-rating">⭐ ' + avgRating.toFixed(1) + '</span><span class="ps5-team-count">' + team.players.length + ' players</span></div></div><div class="ps5-pitch" style="border-color:' + teamColor + ';">' + pitchHTML + '</div>';
        
        container.appendChild(teamCard);
    });
    
    updateTeamActions();
    updateTeamCounts();
    updatePositionCounts();
}

function updateTeamActions() {
    var container = document.getElementById('teamContainer');
    var hasTeams = container && container.children.length > 0;
    var actions = ['shuffleBtn', 'downloadBtn', 'copyBtn'];
    actions.forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !hasTeams;
            btn.style.opacity = hasTeams ? '1' : '0.4';
            btn.style.cursor = hasTeams ? 'pointer' : 'not-allowed';
        }
    });
    
    var teamBadge = document.getElementById('teamBadge');
    if (teamBadge) {
        teamBadge.textContent = hasTeams ? container.children.length : 0;
    }
}

function updateConfigFields() {
    var presetSelect = document.getElementById('preset');
    var selectedPresetName = presetSelect ? presetSelect.value : 'THREE_TEAM_7';
    
    var preset = null;
    if (typeof BUSINESS_RULES !== 'undefined' && BUSINESS_RULES.presets) {
        preset = BUSINESS_RULES.presets[selectedPresetName];
    }
    if (!preset && typeof getPreset === 'function') {
        preset = getPreset(selectedPresetName);
    }
    if (!preset && typeof getCurrentPreset === 'function') {
        preset = getCurrentPreset();
    }
    
    if (!preset) return;
    
    var mapping = {
        'teams': preset.teams,
        'playersPerTeam': preset.playersPerTeam,
        'gk': preset.formation.GK,
        'def': preset.formation.DEF,
        'mid': preset.formation.MID,
        'st': preset.formation.ST,
        'sub': preset.formation.SUB || 0
    };
    
    Object.keys(mapping).forEach(function(id) {
        var field = document.getElementById(id);
        if (field) field.value = mapping[id];
    });
}

async function saveDefaultSettings() {
    try {
        var settings = {
            preset: document.getElementById('preset').value || 'THREE_TEAM_7',
            teams: parseInt(document.getElementById('teams').value) || 3,
            playersPerTeam: parseInt(document.getElementById('playersPerTeam').value) || 7,
            formation: {
                GK: parseInt(document.getElementById('gk').value) || 1,
                DEF: parseInt(document.getElementById('def').value) || 2,
                MID: parseInt(document.getElementById('mid').value) || 2,
                ST: parseInt(document.getElementById('st').value) || 2,
                SUB: parseInt(document.getElementById('sub').value) || 0
            }
        };
        if (typeof Storage !== 'undefined') await Storage.saveSettings(settings);
        showToast('✅ Settings saved as default!', 'success');
    } catch (error) {
        console.error('Failed to save settings:', error);
        showToast('Failed to save settings', 'error');
    }
}

// Data Management Functions
async function clearAllData() {
    if (!confirm('⚠️ Are you sure you want to delete ALL data?')) return;
    try {
        if (typeof Storage !== 'undefined') await Storage.clear();
        window.players = [];
        window.generatedTeams = [];
        if (typeof renderPlayers === 'function') renderPlayers();
        var container = document.getElementById('teamContainer');
        if (container) container.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:40px 0;">No teams generated yet.</p>';
        updateTeamActions();
        updateTeamCounts();
        updatePositionCounts();
        showToast('✅ All data cleared successfully!', 'success');
    } catch (error) {
        console.error('Failed to clear data:', error);
        showToast('Failed to clear data', 'error');
    }
}

async function resetPlayersOnly() {
    if (!confirm('⚠️ Are you sure you want to delete ALL players?')) return;
    try {
        window.players = [];
        if (typeof Storage !== 'undefined') await Storage.savePlayers([]);
        if (typeof renderPlayers === 'function') renderPlayers();
        updateTeamCounts();
        updatePositionCounts();
        showToast('✅ All players removed!', 'success');
    } catch (error) {
        console.error('Failed to reset players:', error);
        showToast('Failed to reset players', 'error');
    }
}

async function resetTeamsOnly() {
    if (!confirm('⚠️ Are you sure you want to delete ALL generated teams?')) return;
    try {
        window.generatedTeams = [];
        if (typeof Storage !== 'undefined') await Storage.saveGeneratedTeams([]);
        var container = document.getElementById('teamContainer');
        if (container) container.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:40px 0;">No teams generated yet.</p>';
        updateTeamActions();
        updateTeamCounts();
        updatePositionCounts();
        showToast('✅ Generated teams cleared!', 'success');
    } catch (error) {
        console.error('Failed to reset teams:', error);
        showToast('Failed to reset teams', 'error');
    }
}

async function resetSettingsOnly() {
    if (!confirm('⚠️ Are you sure you want to reset settings to default?')) return;
    try {
        var defaultPreset = 'THREE_TEAM_7';
        if (typeof changePreset === 'function') changePreset(defaultPreset);
        if (typeof Storage !== 'undefined') await Storage.saveSettings({ preset: defaultPreset });
        updateConfigFields();
        updatePositionCounts();
        showToast('✅ Settings reset to default!', 'success');
    } catch (error) {
        console.error('Failed to reset settings:', error);
        showToast('Failed to reset settings', 'error');
    }
}

async function exportAllData() {
    try {
        var data = await new Promise(function(resolve) {
            chrome.storage.local.get(null, function(items) { resolve(items); });
        });
        var exportData = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            app: 'Football Team Builder Pro - PS5 Edition',
            data: data
        };
        var json = JSON.stringify(exportData, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'football-team-builder-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('✅ Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export failed:', error);
        showToast('Failed to export data', 'error');
    }
}

async function importAllData() {
    try {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = async function(event) {
                try {
                    var importData = JSON.parse(event.target.result);
                    if (!importData.data) {
                        showToast('Invalid backup file format', 'error');
                        return;
                    }
                    if (!confirm('⚠️ Import will overwrite ALL current data!\n\nContinue?')) return;
                    await new Promise(function(resolve) {
                        chrome.storage.local.set(importData.data, resolve);
                    });
                    await loadInitialData();
                    showToast('✅ Data imported successfully!', 'success');
                } catch (error) {
                    console.error('Import failed:', error);
                    showToast('Failed to import data: Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    } catch (error) {
        console.error('Import failed:', error);
        showToast('Failed to import data', 'error');
    }
}

// Expose functions globally
window.displayTeams = displayTeams;
window.handleGenerateTeams = handleGenerateTeams;
window.updateConfigFields = updateConfigFields;
window.clearAllData = clearAllData;
window.resetPlayersOnly = resetPlayersOnly;
window.resetTeamsOnly = resetTeamsOnly;
window.resetSettingsOnly = resetSettingsOnly;
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.loadInitialData = loadInitialData;
window.updateTeamCounts = updateTeamCounts;
window.autoSelectTeams = autoSelectTeams;
window.updateTeamActions = updateTeamActions;
window.saveDefaultSettings = saveDefaultSettings;
window.updatePositionCounts = updatePositionCounts;

console.log('✅ App.js loaded successfully');