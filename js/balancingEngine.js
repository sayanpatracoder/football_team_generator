// ==========================================
// Football Team Builder Pro
// Balancing Engine - FIXED (Includes SUB)
// ==========================================

/**
 * Main balancing function that distributes players across teams
 */
function balanceTeams(players, preset) {
    // Filter available players
    var availablePlayers = players.filter(function(p) { return p.available; });
    
    if (availablePlayers.length === 0) {
        return { error: "No available players found." };
    }
    
    // Get formation requirements
    var formation = preset.formation || { GK: 1, DEF: 2, MID: 2, ST: 2, SUB: 0 };
    var numTeams = preset.teams || 3;
    
    // Calculate required players per position (INCLUDING SUB)
    var need = {
        GK: formation.GK * numTeams,
        DEF: formation.DEF * numTeams,
        MID: formation.MID * numTeams,
        ST: formation.ST * numTeams,
        SUB: formation.SUB * numTeams
    };
    
    console.log('📊 Need - GK:', need.GK, 'DEF:', need.DEF, 'MID:', need.MID, 'ST:', need.ST, 'SUB:', need.SUB);
    
    // ==========================================
    // STEP 1: Build player pools for each position
    // ==========================================
    
    // Primary position players
    var primary = {
        GK: availablePlayers.filter(function(p) { return p.primaryPosition === 'GK'; }),
        DEF: availablePlayers.filter(function(p) { return p.primaryPosition === 'DEF'; }),
        MID: availablePlayers.filter(function(p) { return p.primaryPosition === 'MID'; }),
        ST: availablePlayers.filter(function(p) { return p.primaryPosition === 'ST'; })
    };
    
    // Secondary position players (excluding those who already have primary)
    var secondary = {
        GK: availablePlayers.filter(function(p) { return p.secondaryPosition === 'GK' && p.primaryPosition !== 'GK'; }),
        DEF: availablePlayers.filter(function(p) { return p.secondaryPosition === 'DEF' && p.primaryPosition !== 'DEF'; }),
        MID: availablePlayers.filter(function(p) { return p.secondaryPosition === 'MID' && p.primaryPosition !== 'MID'; }),
        ST: availablePlayers.filter(function(p) { return p.secondaryPosition === 'ST' && p.primaryPosition !== 'ST'; })
    };
    
    console.log('📊 Primary - GK:', primary.GK.length, 'DEF:', primary.DEF.length, 'MID:', primary.MID.length, 'ST:', primary.ST.length);
    console.log('📊 Secondary - GK:', secondary.GK.length, 'DEF:', secondary.DEF.length, 'MID:', secondary.MID.length, 'ST:', secondary.ST.length);
    
    // ==========================================
    // STEP 2: Count total available per position
    // ==========================================
    
    var totalAvailable = {
        GK: primary.GK.length + secondary.GK.length,
        DEF: primary.DEF.length + secondary.DEF.length,
        MID: primary.MID.length + secondary.MID.length,
        ST: primary.ST.length + secondary.ST.length
    };
    
    console.log('📊 Total Available - GK:', totalAvailable.GK, 'DEF:', totalAvailable.DEF, 'MID:', totalAvailable.MID, 'ST:', totalAvailable.ST);
    
    // Check if we have enough players
    var errors = [];
    if (totalAvailable.GK < need.GK) errors.push('GK: Need ' + need.GK + ', have ' + totalAvailable.GK);
    if (totalAvailable.DEF < need.DEF) errors.push('DEF: Need ' + need.DEF + ', have ' + totalAvailable.DEF);
    if (totalAvailable.MID < need.MID) errors.push('MID: Need ' + need.MID + ', have ' + totalAvailable.MID);
    if (totalAvailable.ST < need.ST) errors.push('ST: Need ' + need.ST + ', have ' + totalAvailable.ST);
    
    if (errors.length > 0) {
        return { error: 'Not enough players:\n' + errors.join('\n') };
    }
    
    // ==========================================
    // STEP 3: Select players for each position
    // ==========================================
    
    // Helper: Get players for a position (primary first, then secondary)
    function getPlayersForPosition(pos, count) {
        var selected = [];
        var usedIds = new Set();
        
        // First, take primary players
        var shuffledPrimary = shuffle(primary[pos]);
        for (var i = 0; i < shuffledPrimary.length && selected.length < count; i++) {
            selected.push(shuffledPrimary[i]);
            usedIds.add(shuffledPrimary[i].id);
        }
        
        // Then, take secondary players (only if not already used)
        var shuffledSecondary = shuffle(secondary[pos]);
        for (var i = 0; i < shuffledSecondary.length && selected.length < count; i++) {
            if (!usedIds.has(shuffledSecondary[i].id)) {
                selected.push(shuffledSecondary[i]);
                usedIds.add(shuffledSecondary[i].id);
            }
        }
        
        return selected;
    }
    
    // Select players for each position
    var selectedST = getPlayersForPosition('ST', need.ST);
    var selectedGK = getPlayersForPosition('GK', need.GK);
    var selectedDEF = getPlayersForPosition('DEF', need.DEF);
    var selectedMID = getPlayersForPosition('MID', need.MID);
    
    console.log('📊 Selected - GK:', selectedGK.length, 'DEF:', selectedDEF.length, 'MID:', selectedMID.length, 'ST:', selectedST.length);
    
    // Check if we got enough players
    if (selectedST.length < need.ST) {
        return { error: 'Not enough Strikers available. Need ' + need.ST + ', got ' + selectedST.length };
    }
    if (selectedGK.length < need.GK) {
        return { error: 'Not enough Goalkeepers available. Need ' + need.GK + ', got ' + selectedGK.length };
    }
    if (selectedDEF.length < need.DEF) {
        return { error: 'Not enough Defenders available. Need ' + need.DEF + ', got ' + selectedDEF.length };
    }
    if (selectedMID.length < need.MID) {
        return { error: 'Not enough Midfielders available. Need ' + need.MID + ', got ' + selectedMID.length };
    }
    
    // ==========================================
    // STEP 4: Collect remaining players for SUB
    // ==========================================
    
    var allSelected = selectedST.concat(selectedGK, selectedDEF, selectedMID);
    var usedIds = new Set();
    allSelected.forEach(function(p) { usedIds.add(p.id); });
    
    var remainingForSub = availablePlayers.filter(function(p) {
        return !usedIds.has(p.id);
    });
    
    console.log('📊 Remaining for SUB:', remainingForSub.length);
    
    // Select SUB players from remaining
    var shuffledRemaining = shuffle(remainingForSub);
    var selectedSUB = [];
    for (var i = 0; i < shuffledRemaining.length && selectedSUB.length < need.SUB; i++) {
        selectedSUB.push(shuffledRemaining[i]);
    }
    
    console.log('📊 Selected SUB:', selectedSUB.length);
    
    if (selectedSUB.length < need.SUB) {
        console.warn('⚠️ Not enough SUB players. Need ' + need.SUB + ', got ' + selectedSUB.length);
        // Continue anyway - we'll use what we have
    }
    
    // ==========================================
    // STEP 5: Distribute players to teams
    // ==========================================
    
    // Initialize teams
    var teams = [];
    var teamNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (var i = 0; i < numTeams; i++) {
        teams.push({
            name: 'Team ' + teamNames[i],
            players: [],
            rating: 0
        });
    }
    
    // Track used player IDs
    var usedPlayerIds = new Set();
    
    function assignPlayer(player, teamIndex) {
        if (!player) return false;
        if (usedPlayerIds.has(player.id)) return false;
        
        usedPlayerIds.add(player.id);
        teams[teamIndex].players.push(player);
        return true;
    }
    
    // Shuffle selected players
    var shuffledST = shuffle(selectedST);
    var shuffledGK = shuffle(selectedGK);
    var shuffledDEF = shuffle(selectedDEF);
    var shuffledMID = shuffle(selectedMID);
    var shuffledSUB = shuffle(selectedSUB);
    
    // Distribute: ST first (most critical)
    var stIdx = 0;
    for (var t = 0; t < numTeams; t++) {
        for (var pos = 0; pos < formation.ST; pos++) {
            if (stIdx < shuffledST.length) {
                assignPlayer(shuffledST[stIdx], t);
                stIdx++;
            }
        }
    }
    
    // Distribute GK
    var gkIdx = 0;
    for (var t = 0; t < numTeams; t++) {
        for (var pos = 0; pos < formation.GK; pos++) {
            if (gkIdx < shuffledGK.length) {
                assignPlayer(shuffledGK[gkIdx], t);
                gkIdx++;
            }
        }
    }
    
    // Distribute DEF
    var defIdx = 0;
    for (var t = 0; t < numTeams; t++) {
        for (var pos = 0; pos < formation.DEF; pos++) {
            if (defIdx < shuffledDEF.length) {
                assignPlayer(shuffledDEF[defIdx], t);
                defIdx++;
            }
        }
    }
    
    // Distribute MID
    var midIdx = 0;
    for (var t = 0; t < numTeams; t++) {
        for (var pos = 0; pos < formation.MID; pos++) {
            if (midIdx < shuffledMID.length) {
                assignPlayer(shuffledMID[midIdx], t);
                midIdx++;
            }
        }
    }
    
    // Distribute SUB
    var subIdx = 0;
    for (var t = 0; t < numTeams; t++) {
        for (var pos = 0; pos < formation.SUB; pos++) {
            if (subIdx < shuffledSUB.length) {
                assignPlayer(shuffledSUB[subIdx], t);
                subIdx++;
            }
        }
    }
    
    // ==========================================
    // STEP 6: Calculate ratings
    // ==========================================
    
    teams.forEach(function(team) {
        var total = 0;
        team.players.forEach(function(p) {
            total += (p.rating || 0);
        });
        team.rating = Math.round((total / team.players.length) * 10) / 10;
    });
    
    console.log('✅ Teams generated:', teams.length);
    teams.forEach(function(team, idx) {
        console.log('📊 Team', idx + 1, 'players:', team.players.length, 'rating:', team.rating);
    });
    
    return { teams: teams };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// Export for use
window.balanceTeams = balanceTeams;

console.log('✅ BalancingEngine.js loaded');