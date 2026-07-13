/*
==================================================
Football Team Builder Pro
Utility Functions
==================================================
*/

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle(array) {
    if (!array || !Array.isArray(array)) return [];
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit execution rate
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get position emoji
 */
function getPositionEmoji(position) {
    const emojis = {
        GK: '🧤',
        DEF: '🛡️',
        MID: '⚡',
        ST: '⚽'
    };
    return emojis[position] || '👤';
}

/**
 * Get full position name
 */
function getPositionName(position) {
    const names = {
        GK: 'Goalkeeper',
        DEF: 'Defender',
        MID: 'Midfielder',
        ST: 'Striker'
    };
    return names[position] || position;
}

/**
 * Get position color
 */
function getPositionColor(position) {
    const colors = {
        GK: '#facc15',
        DEF: '#3b82f6',
        MID: '#10b981',
        ST: '#f97316'
    };
    return colors[position] || '#94a3b8';
}

/**
 * Format date for display
 */
function formatDate(date, format = 'short') {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const formats = {
        short: d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }),
        long: d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        time: d.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        full: d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    return formats[format] || formats.short;
}

/**
 * Generate a unique ID
 */
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Group array by key
 */
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

/**
 * Calculate average from array
 */
function average(array) {
    if (!array || array.length === 0) return 0;
    const sum = array.reduce((a, b) => a + b, 0);
    return sum / array.length;
}

/**
 * Get rating stars HTML
 */
function getRatingStars(rating, interactive = false, playerId = null) {
    let html = '';
    const maxStars = 5;
    
    for (let i = 1; i <= maxStars; i++) {
        if (i <= rating) {
            html += `<span class="star filled" 
                        ${interactive ? `data-rating="${i}" data-player-id="${playerId}"` : ''}
                        style="${interactive ? 'cursor:pointer;' : ''}color:#FFD54F;font-size:20px;">
                        ★
                    </span>`;
        } else {
            html += `<span class="star empty" 
                        ${interactive ? `data-rating="${i}" data-player-id="${playerId}"` : ''}
                        style="${interactive ? 'cursor:pointer;' : ''}color:#4a5568;font-size:20px;">
                        ★
                    </span>`;
        }
    }
    
    return html;
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text, maxLength = 20) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Check if string is empty or whitespace
 */
function isEmpty(str) {
    return !str || str.trim() === '';
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Download data as file
 */
function downloadFile(data, filename, mimeType = 'text/plain') {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with fallback
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    } catch (error) {
        console.error('Copy failed:', error);
        return false;
    }
}

/**
 * Parse CSV string to array
 */
function parseCSV(csv) {
    const lines = csv.split('\n');
    return lines.map(line => line.split(','));
}

/**
 * Array to CSV string
 */
function toCSV(data) {
    return data.map(row => row.join(',')).join('\n');
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Generate random color
 */
function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Lighten or darken a color
 */
function adjustColor(color, percent) {
    const hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.min(255, Math.max(0, r + (r * percent / 100)));
    g = Math.min(255, Math.max(0, g + (g * percent / 100)));
    b = Math.min(255, Math.max(0, b + (b * percent / 100)));
    
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Get contrast color (black or white)
 */
function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Sleep/delay function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse with fallback
 */
function safeJSONParse(json, fallback = null) {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

/**
 * Get query parameter from URL
 */
function getQueryParam(name, url = window.location.href) {
    const params = new URLSearchParams(new URL(url).search);
    return params.get(name);
}

/**
 * Build URL with query parameters
 */
function buildURL(base, params) {
    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
}

// Export for use
window.shuffle = shuffle;
window.debounce = debounce;
window.throttle = throttle;
window.getPositionEmoji = getPositionEmoji;
window.getPositionName = getPositionName;
window.getPositionColor = getPositionColor;
window.formatDate = formatDate;
window.generateId = generateId;
window.deepClone = deepClone;
window.groupBy = groupBy;
window.average = average;
window.getRatingStars = getRatingStars;
window.truncateText = truncateText;
window.isEmpty = isEmpty;
window.capitalize = capitalize;
window.downloadFile = downloadFile;
window.copyToClipboard = copyToClipboard;
window.parseCSV = parseCSV;
window.toCSV = toCSV;
window.getFileExtension = getFileExtension;
window.isValidEmail = isValidEmail;
window.randomColor = randomColor;
window.adjustColor = adjustColor;
window.getContrastColor = getContrastColor;
window.sleep = sleep;
window.safeJSONParse = safeJSONParse;
window.getQueryParam = getQueryParam;
window.buildURL = buildURL;

console.log('✅ Utils.js loaded');