/*
==================================================
Football Team Builder Pro - PS5 Edition
Player Manager (with Image Upload)
==================================================
*/

var players = [];

/*
==================================================
Initialization
==================================================
*/

async function loadPlayers() {
    try {
        if (typeof Storage !== 'undefined') {
            players = await Storage.getPlayersMigrated();
            console.log('✅ Loaded ' + players.length + ' players');
        } else {
            console.warn('⚠️ Storage not available, using empty player list');
            players = [];
        }
        renderPlayers();
        // Update counts in sidebar
        if (typeof updateTeamCounts === 'function') {
            updateTeamCounts();
        }
    } catch (error) {
        console.error('Failed to load players:', error);
        players = [];
        renderPlayers();
    }
}

document.addEventListener("DOMContentLoaded", loadPlayers);

/*
==================================================
Add Player
==================================================
*/

document.addEventListener('DOMContentLoaded', function() {
    var addBtn = document.getElementById('addPlayer');
    if (addBtn) {
        addBtn.addEventListener('click', addPlayer);
    }
    
    var nameInput = document.getElementById('playerName');
    if (nameInput) {
        nameInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                addPlayer();
            }
        });
    }
});

async function addPlayer() {
    var nameInput = document.getElementById('playerName');
    var positionSelect = document.getElementById('position');
    var secondarySelect = document.getElementById('secondaryPosition');
    var fileInput = document.getElementById('playerImageFile');
    
    if (!nameInput || !positionSelect || !secondarySelect) {
        if (typeof showToast === 'function') {
            showToast('Form elements not found', 'error');
        }
        return;
    }
    
    var name = nameInput.value.trim();
    var primaryPosition = positionSelect.value;
    var secondaryPosition = secondarySelect.value;
    var imageFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    if (name === "") {
        if (typeof showToast === 'function') {
            showToast("Please enter player name.", "warning");
        }
        nameInput.focus();
        return;
    }

    // Check for duplicate
    var duplicate = players.find(function(p) {
        return p.name.toLowerCase() === name.toLowerCase();
    });

    if (duplicate) {
        if (typeof showToast === 'function') {
            showToast('Player "' + name + '" already exists.', 'error');
        }
        nameInput.value = "";
        nameInput.focus();
        return;
    }

    // Process image if uploaded
    var imageUrl = null;
    if (imageFile) {
        try {
            imageUrl = await readFileAsBase64(imageFile);
        } catch (error) {
            console.error('Failed to read image:', error);
            if (typeof showToast === 'function') {
                showToast('Failed to read image file', 'error');
            }
            return;
        }
    }

    // Add player
    var newPlayer = {
        id: Date.now(),
        name: name,
        primaryPosition: primaryPosition,
        secondaryPosition: secondaryPosition === 'None' ? null : secondaryPosition,
        rating: 5,
        available: true,
        imageUrl: imageUrl
    };
    
    players.push(newPlayer);

    if (typeof Storage !== 'undefined') {
        await Storage.savePlayers(players);
    }
    
    nameInput.value = "";
    if (fileInput) {
        fileInput.value = "";
    }
    
    var preview = document.getElementById('imagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
    
    var fileName = document.getElementById('fileName');
    if (fileName) {
        fileName.style.display = 'none';
        fileName.textContent = '';
    }
    
    nameInput.focus();
    renderPlayers();
    
    // Update counts
    if (typeof updateTeamCounts === 'function') {
        updateTeamCounts();
    }
    
    if (typeof showToast === 'function') {
        showToast('✅ Player "' + name + '" added successfully!', 'success');
    }
}

function readFileAsBase64(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(event) { resolve(event.target.result); };
        reader.onerror = function(error) { reject(error); };
        reader.readAsDataURL(file);
    });
}

/*
==================================================
Render Players - FIXED with proper CSS classes
==================================================
*/

function renderPlayers() {
    var grid = document.getElementById("playerGrid");
    if (!grid) {
        console.warn('Player grid not found');
        return;
    }

    var searchInput = document.getElementById('search');
    var searchText = searchInput ? searchInput.value.toLowerCase() : '';

    grid.innerHTML = "";

    if (players.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#94a3b8;">
                <div style="font-size:64px;margin-bottom:20px;">👥</div>
                <p style="font-size:24px;font-weight:700;color:#ffffff;">No players yet</p>
                <p style="font-size:16px;margin-top:8px;">Add your first player above!</p>
            </div>
        `;
        updatePlayerCounts();
        return;
    }

    // Filter players
    var filtered = players.filter(function(player) {
        if (!player || !player.name) return false;
        return player.name.toLowerCase().includes(searchText);
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#94a3b8;">
                <div style="font-size:48px;margin-bottom:20px;">🔍</div>
                <p style="font-size:20px;font-weight:700;color:#ffffff;">No players found</p>
                <p style="font-size:16px;margin-top:8px;">Try a different search term.</p>
            </div>
        `;
        updatePlayerCounts();
        return;
    }

    // Render each player
    filtered.forEach(function(player) {
        var card = document.createElement("div");
        card.className = "playerCard";
        card.dataset.playerId = player.id;
        
        // Position colors
        var positionColors = {
            GK: '#facc15',
            DEF: '#3b82f6',
            MID: '#10b981',
            ST: '#f97316'
        };
        var posColor = positionColors[player.primaryPosition] || '#94a3b8';
        
        // Position emojis
        var posEmojis = {
            GK: '🧤',
            DEF: '🛡️',
            MID: '⚡',
            ST: '⚽'
        };
        var posEmoji = posEmojis[player.primaryPosition] || '👤';

        // Player image
        var imageHTML;
        if (player.imageUrl && player.imageUrl !== 'null' && player.imageUrl !== 'undefined') {
            imageHTML = '<img src="' + player.imageUrl + '" alt="' + player.name + '" class="player-avatar" onerror="this.style.display=\'none\';this.parentElement.querySelector(\'.player-initial\').style.display=\'flex\';">';
        } else {
            imageHTML = '<div class="player-initial" style="background:' + posColor + ';">' + (player.name ? player.name.charAt(0).toUpperCase() : '?') + '</div>';
        }

        // Build stars
        var starsHTML = '';
        for (var i = 1; i <= 5; i++) {
            var filled = i <= player.rating;
            starsHTML += '<span class="star ' + (filled ? 'filled' : 'empty') + '" data-rating="' + i + '" style="cursor:pointer;color:' + (filled ? '#FFD54F' : '#4a5568') + ';font-size:20px;transition:0.2s;">★</span>';
        }

        // Secondary position badge
        var secondaryBadge = '';
        if (player.secondaryPosition && player.secondaryPosition !== 'None') {
            var secColor = positionColors[player.secondaryPosition] || '#4a5568';
            secondaryBadge = '<span class="position-badge secondary" style="background:' + secColor + ';color:#08111d;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;">' + player.secondaryPosition + '</span>';
        }

        // Build the card
        card.innerHTML = `
            <div class="player-card-content">
                <div class="player-avatar-wrapper">
                    ${imageHTML}
                    <div class="player-status-dot ${player.available ? 'available' : 'unavailable'}"></div>
                </div>
                <div class="player-info">
                    <div class="player-name-row">
                        <span class="player-name">${player.name || 'Unknown'}</span>
                        <span class="player-id">#${player.id ? player.id.toString().slice(-4) : '0000'}</span>
                    </div>
                    <div class="player-positions">
                        <span class="position-badge primary" style="background:${posColor};color:#08111d;font-size:12px;padding:2px 12px;border-radius:12px;font-weight:700;">${posEmoji} ${player.primaryPosition || 'N/A'}</span>
                        ${secondaryBadge}
                    </div>
                    <div class="player-stars-row">
                        ${starsHTML}
                        <span class="player-rating-text">${player.rating || 0}.0</span>
                    </div>
                    <div class="player-actions">
                        <label class="availability-toggle">
                            <input type="checkbox" class="availability-check" ${player.available ? "checked" : ""} data-player-id="${player.id}">
                            <span class="toggle-label">${player.available ? 'Available' : 'Unavailable'}</span>
                        </label>
                        <div class="action-buttons">
                            <button class="edit-btn" data-player-id="${player.id}" title="Edit Player">✏️</button>
                            <button class="delete-btn" data-player-id="${player.id}" title="Delete Player">🗑️</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    // Attach event listeners
    attachPlayerEventListeners();

    // Update player counts
    updatePlayerCounts();
}

function updatePlayerCounts() {
    var countEl = document.getElementById('playerCount');
    if (countEl) {
        countEl.innerHTML = 'Players : ' + players.length;
    }
    
    var availableCountMini = document.getElementById('availableCountMini');
    var totalCountMini = document.getElementById('totalCountMini');
    var available = players.filter(function(p) { return p.available; }).length;
    
    if (availableCountMini) availableCountMini.textContent = available;
    if (totalCountMini) totalCountMini.textContent = players.length;
    
    var playerBadge = document.getElementById('playerBadge');
    if (playerBadge) {
        playerBadge.textContent = players.length;
    }
}

/*
==================================================
Attach Event Listeners to Player Cards
==================================================
*/

function attachPlayerEventListeners() {
    // Star rating click events
    document.querySelectorAll('.player-stars-row .star').forEach(function(star) {
        star.removeEventListener('click', handleStarClick);
        star.addEventListener('click', handleStarClick);
    });

    // Availability checkbox events
    document.querySelectorAll('.availability-check').forEach(function(checkbox) {
        checkbox.removeEventListener('change', handleAvailabilityChange);
        checkbox.addEventListener('change', handleAvailabilityChange);
    });

    // Edit button events
    document.querySelectorAll('.edit-btn').forEach(function(btn) {
        btn.removeEventListener('click', handleEditClick);
        btn.addEventListener('click', handleEditClick);
    });

    // Delete button events
    document.querySelectorAll('.delete-btn').forEach(function(btn) {
        btn.removeEventListener('click', handleDeleteClick);
        btn.addEventListener('click', handleDeleteClick);
    });
}

/*
==================================================
Event Handlers
==================================================
*/

function handleStarClick(event) {
    var star = event.currentTarget;
    var rating = parseInt(star.dataset.rating);
    var card = star.closest('.playerCard');
    if (!card) return;
    var playerId = parseInt(card.dataset.playerId);
    changeRating(playerId, rating);
}

function handleAvailabilityChange(event) {
    var checkbox = event.currentTarget;
    var playerId = parseInt(checkbox.dataset.playerId);
    toggleAvailability(playerId);
}

function handleEditClick(event) {
    var btn = event.currentTarget;
    var playerId = parseInt(btn.dataset.playerId);
    editPlayer(playerId);
}

function handleDeleteClick(event) {
    var btn = event.currentTarget;
    var playerId = parseInt(btn.dataset.playerId);
    deletePlayer(playerId);
}

/*
==================================================
Change Rating
==================================================
*/

async function changeRating(id, rating) {
    try {
        var player = players.find(function(p) { return p.id === id; });
        if (!player) {
            if (typeof showToast === 'function') {
                showToast("Player not found", "error");
            }
            return;
        }
        player.rating = rating;
        if (typeof Storage !== 'undefined') {
            await Storage.savePlayers(players);
        }
        renderPlayers();
    } catch (error) {
        console.error('Failed to change rating:', error);
        if (typeof showToast === 'function') {
            showToast("Failed to update rating", "error");
        }
    }
}

/*
==================================================
Toggle Availability
==================================================
*/

async function toggleAvailability(id) {
    try {
        var player = players.find(function(p) { return p.id === id; });
        if (!player) {
            if (typeof showToast === 'function') {
                showToast("Player not found", "error");
            }
            return;
        }
        player.available = !player.available;
        if (typeof Storage !== 'undefined') {
            await Storage.savePlayers(players);
        }
        renderPlayers();
        
        var status = player.available ? 'available' : 'unavailable';
        if (typeof showToast === 'function') {
            showToast('Player is now ' + status, 'info');
        }
    } catch (error) {
        console.error('Failed to toggle availability:', error);
        if (typeof showToast === 'function') {
            showToast("Failed to update availability", "error");
        }
    }
}

/*
==================================================
Delete Player
==================================================
*/

async function deletePlayer(id) {
    try {
        var player = players.find(function(p) { return p.id === id; });
        if (!player) {
            if (typeof showToast === 'function') {
                showToast("Player not found", "error");
            }
            return;
        }

        if (!confirm('⚠️ Are you sure you want to delete "' + player.name + '"?\n\nThis action cannot be undone!')) {
            return;
        }

        players = players.filter(function(p) { return p.id !== id; });
        if (typeof Storage !== 'undefined') {
            await Storage.savePlayers(players);
        }
        renderPlayers();
        if (typeof showToast === 'function') {
            showToast('✅ Player "' + player.name + '" deleted successfully!', 'success');
        }
    } catch (error) {
        console.error('Failed to delete player:', error);
        if (typeof showToast === 'function') {
            showToast("Failed to delete player", "error");
        }
    }
}

/*
==================================================
Edit Player
==================================================
*/

async function editPlayer(id) {
    try {
        var player = players.find(function(p) { return p.id === id; });
        if (!player) {
            if (typeof showToast === 'function') {
                showToast("Player not found", "error");
            }
            return;
        }

        // Create a modal-like overlay for editing
        var editContainer = document.createElement('div');
        editContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Rajdhani', sans-serif;
        `;
        
        editContainer.innerHTML = `
            <div style="background: #1a1f3a; border-radius: 20px; padding: 30px; max-width: 500px; width: 90%; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
                <h2 style="color: #ffffff; margin-bottom: 20px; font-family: 'Orbitron', sans-serif; font-size: 24px;">✏️ Edit Player</h2>
                
                <div style="margin-bottom: 15px;">
                    <label style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Player Name</label>
                    <input id="editName" value="${player.name}" class="ps-input" style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Primary Position</label>
                    <select id="editPrimary" class="ps-select" style="width: 100%;">
                        <option value="GK" ${player.primaryPosition === 'GK' ? 'selected' : ''}>🧤 Goalkeeper</option>
                        <option value="DEF" ${player.primaryPosition === 'DEF' ? 'selected' : ''}>🛡️ Defender</option>
                        <option value="MID" ${player.primaryPosition === 'MID' ? 'selected' : ''}>⚡ Midfielder</option>
                        <option value="ST" ${player.primaryPosition === 'ST' ? 'selected' : ''}>⚽ Striker</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Secondary Position</label>
                    <select id="editSecondary" class="ps-select" style="width: 100%;">
                        <option value="None" ${!player.secondaryPosition ? 'selected' : ''}>None</option>
                        <option value="GK" ${player.secondaryPosition === 'GK' ? 'selected' : ''}>🧤 Goalkeeper</option>
                        <option value="DEF" ${player.secondaryPosition === 'DEF' ? 'selected' : ''}>🛡️ Defender</option>
                        <option value="MID" ${player.secondaryPosition === 'MID' ? 'selected' : ''}>⚡ Midfielder</option>
                        <option value="ST" ${player.secondaryPosition === 'ST' ? 'selected' : ''}>⚽ Striker</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Player Image</label>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <button id="editImageBtn" class="ps-btn ps-btn-primary" style="padding: 8px 16px; font-size: 14px;">
                            📁 Choose Image
                        </button>
                        <button id="editRemoveImageBtn" class="ps-btn ps-btn-danger" style="padding: 8px 16px; font-size: 14px; background: rgba(244,67,54,0.15); color: #ef5350; border: 1px solid rgba(244,67,54,0.2);">
                            🗑️ Remove
                        </button>
                        <span id="editImageName" style="color: #94a3b8; font-size: 13px;">${player.imageUrl ? 'Image set' : 'No image'}</span>
                        <input type="file" id="editImageFile" accept="image/*" style="display:none;">
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button id="editCancelBtn" class="ps-btn ps-btn-secondary" style="padding: 10px 24px;">Cancel</button>
                    <button id="editSaveBtn" class="ps-btn ps-btn-primary" style="padding: 10px 24px;">💾 Save Changes</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(editContainer);
        
        // Variables for image
        var newImageUrl = player.imageUrl;
        var imageChanged = false;
        
        // Handle image selection
        var editImageBtn = document.getElementById('editImageBtn');
        var editImageFile = document.getElementById('editImageFile');
        var editImageName = document.getElementById('editImageName');
        
        editImageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editImageFile.click();
        });
        
        editImageFile.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    newImageUrl = event.target.result;
                    imageChanged = true;
                    editImageName.textContent = file.name;
                    editImageName.style.color = '#22c55e';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Remove image
        document.getElementById('editRemoveImageBtn').addEventListener('click', function() {
            newImageUrl = null;
            imageChanged = true;
            editImageName.textContent = 'Image removed';
            editImageName.style.color = '#ef4444';
            editImageFile.value = '';
        });
        
        // Cancel button
        document.getElementById('editCancelBtn').addEventListener('click', function() {
            document.body.removeChild(editContainer);
        });
        
        // Save button
        document.getElementById('editSaveBtn').addEventListener('click', function() {
            var newName = document.getElementById('editName').value.trim();
            var newPrimary = document.getElementById('editPrimary').value;
            var newSecondary = document.getElementById('editSecondary').value;
            
            if (newName === "") {
                if (typeof showToast === 'function') {
                    showToast("Player name cannot be empty", "warning");
                }
                return;
            }
            
            // Check for duplicate
            var duplicate = players.find(function(p) {
                return p.name.toLowerCase() === newName.toLowerCase() && p.id !== id;
            });
            
            if (duplicate) {
                if (typeof showToast === 'function') {
                    showToast('Player "' + newName + '" already exists.', 'error');
                }
                return;
            }
            
            // Update player
            player.name = newName;
            player.primaryPosition = newPrimary;
            player.secondaryPosition = newSecondary === 'None' ? null : newSecondary;
            
            if (imageChanged) {
                player.imageUrl = newImageUrl;
            }
            
            // Save and close
            (async function() {
                if (typeof Storage !== 'undefined') {
                    await Storage.savePlayers(players);
                }
                renderPlayers();
                if (typeof showToast === 'function') {
                    showToast('✅ Player "' + player.name + '" updated successfully!', 'success');
                }
            })();
            
            document.body.removeChild(editContainer);
        });
        
        // Close on click outside
        editContainer.addEventListener('click', function(e) {
            if (e.target === editContainer) {
                document.body.removeChild(editContainer);
            }
        });
        
    } catch (error) {
        console.error('Failed to edit player:', error);
        if (typeof showToast === 'function') {
            showToast("Failed to edit player", "error");
        }
    }
}

function getPositionIndex(position) {
    var positions = ['GK', 'DEF', 'MID', 'ST', 'None'];
    var index = positions.indexOf(position);
    return index === -1 ? 4 : index;
}

/*
==================================================
Search
==================================================
*/

document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keyup', renderPlayers);
    }
});

/*
==================================================
Get Players by Position
==================================================
*/

function getPlayersByPosition(players, position) {
    return players.filter(function(p) {
        return p.primaryPosition === position || p.secondaryPosition === position;
    });
}

function getPrimaryPlayers(players, position) {
    return players.filter(function(p) { return p.primaryPosition === position; });
}

function getSecondaryPlayers(players, position) {
    return players.filter(function(p) { return p.secondaryPosition === position; });
}

// Expose functions globally
window.players = players;
window.addPlayer = addPlayer;
window.renderPlayers = renderPlayers;
window.changeRating = changeRating;
window.toggleAvailability = toggleAvailability;
window.deletePlayer = deletePlayer;
window.editPlayer = editPlayer;
window.getPlayersByPosition = getPlayersByPosition;
window.getPrimaryPlayers = getPrimaryPlayers;
window.getSecondaryPlayers = getSecondaryPlayers;
window.readFileAsBase64 = readFileAsBase64;

console.log('✅ PlayerManager.js loaded');