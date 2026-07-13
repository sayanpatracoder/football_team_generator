// ==========================================
// Football Team Builder Pro
// UI Utilities & Helpers
// ==========================================

/**
 * Toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    console.log('Toast:', message, type);
    
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    // Style
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        maxWidth: '400px'
    });
    
    // Color based on type
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    toast.style.background = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show/hide loading spinner
 */
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = '<div class="spinner"></div>';
        el.classList.add('loading');
    }
}

function hideLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.remove('loading');
    }
}

/**
 * Update player count display
 */
function updatePlayerCount() {
    const countEl = document.getElementById('playerCount');
    if (countEl && window.players) {
        countEl.textContent = `Players : ${window.players.length}`;
    }
}

/**
 * Validate formation settings
 */
function validateFormation(settings) {
    const { GK, DEF, MID, ST, SUB } = settings;
    
    if (GK < 0 || DEF < 0 || MID < 0 || ST < 0 || SUB < 0) {
        return { valid: false, error: 'All positions must be 0 or greater.' };
    }
    
    const total = GK + DEF + MID + ST + SUB;
    if (total < 1) {
        return { valid: false, error: 'Team must have at least 1 player.' };
    }
    
    return { valid: true };
}

/**
 * Get position options for dropdown
 */
function getPositionOptions(selected = null) {
    const positions = ['GK', 'DEF', 'MID', 'ST'];
    const names = {
        GK: 'Goalkeeper',
        DEF: 'Defender',
        MID: 'Midfielder',
        ST: 'Striker'
    };
    
    let html = '';
    positions.forEach(pos => {
        html += `<option value="${pos}" ${selected === pos ? 'selected' : ''}>${pos} (${names[pos]})</option>`;
    });
    html += `<option value="None" ${selected === 'None' ? 'selected' : ''}>None</option>`;
    
    return html;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top: 3px solid #22c55e;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
    .pitch-row {
        display: flex;
        align-items: center;
        margin: 5px 0;
        gap: 10px;
    }
    .pitch-label {
        font-size: 12px;
        font-weight: bold;
        color: rgba(255,255,255,0.7);
        min-width: 50px;
    }
    .pitch-players {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        flex: 1;
    }
    .pitchPlayer {
        background: rgba(255,255,255,0.9);
        color: #1f2937;
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: bold;
        border: 2px solid #22c55e;
        transition: 0.2s;
        text-align: center;
        min-width: 60px;
    }
    .pitchPlayer:hover {
        transform: scale(1.05);
    }
`;

document.head.appendChild(style);

// Make showToast globally available
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.updatePlayerCount = updatePlayerCount;
window.validateFormation = validateFormation;
window.getPositionOptions = getPositionOptions;

console.log('✅ UI.js loaded');