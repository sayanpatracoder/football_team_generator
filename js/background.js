/*
==================================================
Football Team Builder Pro - PS5 Edition
Background Image Loader
==================================================
*/

(function() {
    console.log('🎨 Loading background...');
    
    // Try to load local image
    function loadLocalImage() {
        var url = chrome.runtime.getURL('assets/stadium-bg.jpg');
        var img = new Image();
        
        img.onload = function() {
            document.body.style.backgroundImage = 'url(' + url + ')';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundColor = '#0a0e1a';
            console.log('✅ Local background loaded');
            return true;
        };
        
        img.onerror = function() {
            console.log('⚠️ Local image failed, using web fallback');
            useWebImage();
        };
        
        img.src = url;
    }
    
function useWebImage() {
    // Remove any existing overlay
    var overlay = document.querySelector('body::before');
    if (overlay) {
        overlay.remove();
    }
    
    // Set the background image directly
    var webUrl = 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1920&q=80';
    document.body.style.backgroundImage = 'url(' + webUrl + ')';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundColor = '#0a0e1a'; // Fallback color
    document.body.style.backgroundBlendMode = 'normal'; // No blending
    
    console.log('✅ Web background loaded (no opacity)');
}
    
    // Try local first
    loadLocalImage();
    
    // Pitch background
    function loadPitchBackground() {
        try {
            var pitchUrl = chrome.runtime.getURL('assets/pitch.png');
            var pitches = document.querySelectorAll('.ps5-pitch');
            if (pitches.length > 0) {
                pitches.forEach(function(el) {
                    if (!el.dataset.backgroundSet) {
                        el.style.backgroundImage = 'url(' + pitchUrl + ')';
                        el.style.backgroundSize = 'cover';
                        el.style.backgroundPosition = 'center';
                        el.style.backgroundBlendMode = 'overlay';
                        el.dataset.backgroundSet = 'true';
                    }
                });
                console.log('✅ Pitch background loaded');
            }
        } catch(e) {
            console.log('⚠️ Pitch error');
        }
    }
    
    setTimeout(loadPitchBackground, 500);
    var observer = new MutationObserver(loadPitchBackground);
    observer.observe(document.body, { childList: true, subtree: true });
})();