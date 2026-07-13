/*
==================================================
Football Team Builder Pro
Image Handler (No inline scripts)
==================================================
*/

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('playerImageFile');
    const preview = document.getElementById('imagePreview');
    const fileName = document.getElementById('fileName');
    const chooseLabel = document.getElementById('chooseImageLabel');
    
    if (fileInput) {
        // Remove any existing listeners
        fileInput.removeEventListener('change', handleFileChange);
        fileInput.addEventListener('change', handleFileChange);
    }
    
    // Hover effects using event listeners
    if (chooseLabel) {
        chooseLabel.removeEventListener('mouseenter', handleMouseEnter);
        chooseLabel.removeEventListener('mouseleave', handleMouseLeave);
        chooseLabel.addEventListener('mouseenter', handleMouseEnter);
        chooseLabel.addEventListener('mouseleave', handleMouseLeave);
    }
});

function handleFileChange(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    const fileName = document.getElementById('fileName');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            if (preview) {
                preview.style.display = 'block';
                preview.src = event.target.result;
            }
            if (fileName) {
                fileName.textContent = file.name;
                fileName.style.display = 'inline';
            }
        };
        reader.readAsDataURL(file);
    } else {
        if (preview) {
            preview.style.display = 'none';
            preview.src = '';
        }
        if (fileName) {
            fileName.style.display = 'none';
            fileName.textContent = '';
        }
    }
}

function handleMouseEnter(e) {
    e.target.style.background = '#2d3748';
}

function handleMouseLeave(e) {
    e.target.style.background = '#1f2937';
}

console.log('✅ ImageHandler.js loaded');