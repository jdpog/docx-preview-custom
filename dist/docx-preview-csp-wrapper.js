// CSP-Compliant Wrapper for docx-preview
// This script patches the original docx-preview library to work without inline styles

(function() {
    'use strict';
    
    // Wait for docx-preview to load
    function waitForDocx() {
        return new Promise((resolve) => {
            if (window.docx) {
                resolve();
                return;
            }
            
            const checkInterval = setInterval(() => {
                if (window.docx) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
        });
    }
    
    // Patch function to intercept style assignments
    function patchStyleAssignments() {
        // Store original Element.prototype methods
        const originalSetAttribute = Element.prototype.setAttribute;
        const originalCreateElement = document.createElement;
        
        // Override createElement to patch style property on new elements
        document.createElement = function(tagName, options) {
            const element = originalCreateElement.call(this, tagName, options);
            
            // Patch the style property
            const originalStyle = element.style;
            const patchedStyle = new Proxy(originalStyle, {
                set(target, property, value) {
                    // If we're setting a style property, use our CSP-compliant method
                    if (typeof property === 'string' && property !== 'length' && property !== 'cssText') {
                        if (window.docxCSPUtils) {
                            window.docxCSPUtils.setElementStyle(element, property, value);
                            return true;
                        }
                    }
                    // Fall back to original behavior for non-style properties
                    return Reflect.set(target, property, value);
                }
            });
            
            // Replace the style property with our proxy
            Object.defineProperty(element, 'style', {
                get() {
                    return patchedStyle;
                },
                configurable: true
            });
            
            return element;
        };
        
        console.log('CSP style patching enabled for docx-preview');
    }
      // Initialize the CSP wrapper
    async function init() {
        console.log('CSP wrapper starting initialization...');
        
        // Wait for CSP utils to be available with timeout
        let attempts = 0;
        const maxAttempts = 100; // 1 second timeout (100 * 10ms)
        
        while (!window.docxCSPUtils && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10));
            attempts++;
        }
        
        if (!window.docxCSPUtils) {
            console.error('CSP utils failed to load within timeout - proceeding without style interception');
            return;
        }
        
        console.log('CSP utils loaded, applying patches...');
        
        // Apply patches before docx-preview initializes
        patchStyleAssignments();
        
        // Wait for docx to load with timeout
        attempts = 0;
        while (!window.docx && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10));
            attempts++;
        }
        
        if (!window.docx) {
            console.error('docx-preview failed to load within timeout');
            return;
        }
        
        console.log('docx-preview CSP wrapper initialized successfully');
    }
    
    // Start initialization
    init().catch(console.error);
    
})();
