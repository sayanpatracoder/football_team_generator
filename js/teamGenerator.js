// ==========================================
// Football Team Builder Pro
// Team Generator (Legacy compatibility)
// ==========================================

/**
 * Shuffle array
 */
function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Legacy generator for 3 teams (kept for compatibility)
 * Use balancingEngine.js instead for full features
 */
function generateTeams(players) {
    const preset = getCurrentPreset();
    const result = balanceTeams(players, preset);
    
    if (result.error) {
        return { error: result.error };
    }
    
    // Convert to legacy format (teamA, teamB, teamC)
    const teams = result.teams;
    if (teams.length >= 3) {
        return {
            teamA: teams[0].players,
            teamB: teams[1].players,
            teamC: teams[2].players
        };
    }
    
    return { error: "Need at least 3 teams" };
}

// Export for use
window.generateTeams = generateTeams;
window.shuffle = shuffle;

console.log('✅ TeamGenerator.js loaded');