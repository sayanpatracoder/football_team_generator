/*
==================================================
Football Team Builder Pro - PS5 Edition
Popup
==================================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById("openDashboard");
    
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            chrome.tabs.create({
                url: chrome.runtime.getURL("dashboard.html")
            });
        });
    }
    
    console.log('✅ Popup.js loaded');
});