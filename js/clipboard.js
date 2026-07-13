// ==========================================
// Football Team Builder Pro
// Clipboard Operations
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }
});

/**
 * Copy team data to clipboard
 */
async function copyToClipboard() {
    const container = document.getElementById('teamContainer');
    
    if (!container || container.children.length === 0) {
        showToast('Please generate teams first before copying.', 'warning');
        return;
    }
    
    try {
        // Build text representation
        let text = '⚽ FOOTBALL TEAMS\n';
        text += `Generated: ${new Date().toLocaleString()}\n`;
        text += '='.repeat(50) + '\n\n';
        
        const teamCards = container.querySelectorAll('.teamCard');
        
        teamCards.forEach((card, index) => {
            const teamTitle = card.querySelector('.teamTitle')?.textContent?.trim() || `Team ${index + 1}`;
            const players = card.querySelectorAll('.pitchPlayer');
            
            text += `${teamTitle}\n`;
            text += '-'.repeat(30) + '\n';
            
            players.forEach((player, idx) => {
                const playerName = player.textContent.trim();
                text += `  ${idx + 1}. ${playerName}\n`;
            });
            
            text += '\n';
        });
        
        text += '='.repeat(50);
        
        // Use modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            const btn = document.getElementById('copyBtn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
            
            showToast('✅ Teams copied to clipboard!', 'success');
            
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            showToast('✅ Teams copied to clipboard!', 'success');
        }
        
    } catch (error) {
        console.error('Copy failed:', error);
        showToast('Failed to copy to clipboard. Please try again.', 'error');
    }
}

/**
 * Copy as HTML table
 */
async function copyAsHTML() {
    const container = document.getElementById('teamContainer');
    if (!container || container.children.length === 0) {
        showToast('Please generate teams first.', 'warning');
        return;
    }
    
    let html = '<h2>⚽ Football Teams</h2>';
    html += `<p>Generated: ${new Date().toLocaleString()}</p>`;
    
    const teamCards = container.querySelectorAll('.teamCard');
    
    teamCards.forEach((card, index) => {
        const teamTitle = card.querySelector('.teamTitle')?.textContent?.trim() || `Team ${index + 1}`;
        const players = card.querySelectorAll('.pitchPlayer');
        
        html += `<h3>${teamTitle}</h3><ul>`;
        players.forEach(player => {
            const name = player.textContent.trim();
            html += `<li>${name}</li>`;
        });
        html += '</ul>';
    });
    
    // Copy HTML content
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(html);
        showToast('✅ Teams copied as HTML!', 'success');
    }
}

/**
 * Copy as JSON
 */
async function copyAsJSON() {
    const container = document.getElementById('teamContainer');
    if (!container || container.children.length === 0) {
        showToast('Please generate teams first.', 'warning');
        return;
    }
    
    const teams = [];
    const teamCards = container.querySelectorAll('.teamCard');
    
    teamCards.forEach(card => {
        const teamName = card.querySelector('.teamTitle')?.textContent?.trim() || 'Unknown';
        const players = [];
        card.querySelectorAll('.pitchPlayer').forEach(player => {
            players.push(player.textContent.trim());
        });
        teams.push({ name: teamName, players });
    });
    
    const json = JSON.stringify({ teams, generated: new Date().toISOString() }, null, 2);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(json);
        showToast('✅ Teams copied as JSON!', 'success');
    }
}

// Export for use
window.copyToClipboard = copyToClipboard;
window.copyAsHTML = copyAsHTML;
window.copyAsJSON = copyAsJSON;

console.log('✅ Clipboard.js loaded');