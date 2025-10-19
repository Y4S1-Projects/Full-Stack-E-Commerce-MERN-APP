// helpers/sanitize.js
const validator = require('validator');
const xss = require('xss');

// Simple HTML tag removal
const removeHTMLTags = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>/g, '');
};

// XSS protection using xss library
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove HTML tags and XSS attempts
    let sanitized = xss(input, {
        whiteList: {}, // No HTML tags allowed
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    });
    
    // Additional cleanup
    sanitized = removeHTMLTags(sanitized);
    
    // Remove potential script injections
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+=/gi, '');
    
    return sanitized.trim();
};

// Sanitize object properties
const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item => 
                typeof item === 'string' ? sanitizeInput(item) : item
            );
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};

// Validate email
const isValidEmail = (email) => {
    return validator.isEmail(email);
};

// Validate and sanitize search query
const sanitizeSearchQuery = (query) => {
    if (!query || typeof query !== 'string') return '';
    
    // Limit length
    if (query.length > 100) return '';
    
    // Sanitize
    let sanitized = sanitizeInput(query);
    
    // Remove regex special characters for safety
    sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    return sanitized;
};

module.exports = { 
    sanitizeInput, 
    sanitizeObject, 
    isValidEmail,
    sanitizeSearchQuery
};