// ==========================================
// Football Team Builder Pro
// Image Export
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', exportAsImage);
    }
});

/**
 * Export team display as image using html2canvas
 */
async function exportAsImage() {
    const container = document.getElementById('teamContainer');
    
    if (!container || container.children.length === 0) {
        showToast('Please generate teams first before exporting.', 'warning');
        return;
    }
    
    try {
        // Check if html2canvas is loaded
        if (typeof html2canvas === 'undefined') {
            showToast('html2canvas library not loaded. Please check your internet connection.', 'error');
            return;
        }
        
        // Show loading state
        const btn = document.getElementById('downloadBtn');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Exporting...';
        btn.disabled = true;
        
        // Capture the container
        const canvas = await html2canvas(container, {
            scale: 1.5,
            backgroundColor: '#0b1220',
            allowTaint: true,
            useCORS: true,
            logging: false
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `football-teams-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore button
        btn.textContent = originalText;
        btn.disabled = false;
        showToast('✅ Image exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export failed:', error);
        showToast('Failed to export image. Please try again.', 'error');
        
        const btn = document.getElementById('downloadBtn');
        if (btn) {
            btn.textContent = '📷 Download';
            btn.disabled = false;
        }
    }
}

/**
 * Alternative export using simple DOM to canvas
 */
function simpleExport() {
    const container = document.getElementById('teamContainer');
    if (!container || container.children.length === 0) {
        showToast('Please generate teams first.', 'warning');
        return;
    }
    
    // Create a new window for printing
    const win = window.open('', '_blank');
    if (!win) {
        showToast('Please allow popups for this feature.', 'warning');
        return;
    }
    
    const style = document.querySelector('link[href*="dashboard.css"]');
    const css = style ? `<link rel="stylesheet" href="${style.href}">` : '';
    
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Football Teams</title>
            ${css}
            <style>
                body { background: white; padding: 20px; }
                .teamCard { page-break-inside: avoid; }
            </style>
        </head>
        <body>
            ${container.innerHTML}
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 1000);
                }
            <\/script>
        </body>
        </html>
    `);
    win.document.close();
}

/**
 * Export to CSV format
 */
function exportAsCSV() {
    const container = document.getElementById('teamContainer');
    if (!container || container.children.length === 0) {
        showToast('Please generate teams first.', 'warning');
        return;
    }
    
    const teamCards = container.querySelectorAll('.teamCard');
    let csv = 'Team,Player,Position,Rating\n';
    
    teamCards.forEach(card => {
        const teamName = card.querySelector('.teamTitle')?.textContent?.trim() || 'Unknown';
        const players = card.querySelectorAll('.pitchPlayer');
        
        players.forEach(player => {
            const name = player.textContent.trim();
            csv += `"${teamName}","${name}",, \n`;
        });
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `teams-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    showToast('✅ CSV exported successfully!', 'success');
}

// Export for use
window.exportAsImage = exportAsImage;
window.simpleExport = simpleExport;
window.exportAsCSV = exportAsCSV;

console.log('✅ ExportImage.js loaded');