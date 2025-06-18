// CSP Utilities for docx-preview
// Helper functions to replace inline styles with CSS classes and custom properties

window.docxCSPUtils = {
    // Counter for generating unique IDs
    counter: 0,
    
    // Map to store dynamic style sheets
    styleSheets: new Map(),
    
    // Generate a unique class name
    generateUniqueClass() {
        return `docx-dynamic-${++this.counter}`;
    },
    
    // Set CSS custom properties on an element
    setCSSProperty(element, property, value) {
        element.style.setProperty(`--docx-${property}`, value);
    },
    
    // Add a CSS rule to a dynamic stylesheet
    addRule(selector, rules) {
        if (!this.dynamicStyleSheet) {
            const style = document.createElement('style');
            style.id = 'docx-dynamic-styles';
            document.head.appendChild(style);
            this.dynamicStyleSheet = style.sheet;
        }
        
        const ruleText = `${selector} { ${rules} }`;
        try {
            this.dynamicStyleSheet.insertRule(ruleText, this.dynamicStyleSheet.cssRules.length);
        } catch (e) {
            console.warn('Failed to insert CSS rule:', ruleText, e);
        }
    },
    
    // Replace element.style.property = value with CSS classes/properties
    setElementStyle(element, property, value) {
        switch (property) {
            case 'width':
                this.setCSSProperty(element, 'width', value);
                element.classList.add('docx-width-custom');
                break;
                
            case 'textDecoration':
                if (value === 'inherit') {
                    element.classList.add('docx-tab-stop-inherit');
                } else if (value === 'underline') {
                    element.classList.add('docx-tab-stop-underline');
                }
                break;
                
            case 'wordSpacing':
                this.setCSSProperty(element, 'word-spacing', value);
                element.classList.add('docx-word-spacing-custom');
                break;
                
            case 'textDecorationStyle':
                if (value === 'dotted') {
                    element.classList.add('docx-tab-stop-dotted');
                }
                break;
                
            case 'paddingLeft':
            case 'paddingRight':
            case 'paddingTop':
            case 'paddingBottom':
                const paddingProp = property.replace('padding', '').toLowerCase();
                this.setCSSProperty(element, `padding-${paddingProp}`, value);
                element.classList.add('docx-padding-custom');
                break;
                
            case 'minHeight':
                this.setCSSProperty(element, 'min-height', value);
                element.classList.add('docx-min-height-custom');
                break;
                
            case 'columnCount':
                this.setCSSProperty(element, 'column-count', value);
                element.classList.add('docx-columns-custom');
                break;
                
            case 'columnGap':
                this.setCSSProperty(element, 'column-gap', value);
                element.classList.add('docx-columns-custom');
                break;
                
            case 'columnRule':
                this.setCSSProperty(element, 'column-rule', value);
                element.classList.add('docx-columns-custom');
                break;
                
            case 'marginTop':
            case 'marginBottom':
                const marginProp = property.replace('margin', '').toLowerCase();
                this.setCSSProperty(element, `margin-${marginProp}`, value);
                element.classList.add('docx-margin-custom');
                break;
                
            case 'display':
                this.setCSSProperty(element, 'display', value);
                element.classList.add('docx-display-custom');
                break;
                
            case 'position':
                this.setCSSProperty(element, 'position', value);
                element.classList.add('docx-position-custom');
                break;
                
            case 'textIndent':
                this.setCSSProperty(element, 'text-indent', value);
                element.classList.add('docx-text-indent-custom');
                break;
                
            default:
                // For any other properties, use CSS custom properties
                const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
                this.setCSSProperty(element, cssProperty, value);
                element.classList.add('docx-custom-property');
                break;
        }
    },
      // Initialize the CSP utilities
    init() {
        console.log('CSP utilities initializing...');
        
        // Add base CSS classes
        if (!document.getElementById('docx-csp-base-styles')) {
            console.log('Loading CSP base CSS...');
            const link = document.createElement('link');
            link.id = 'docx-csp-base-styles';
            link.rel = 'stylesheet';
            link.href = '/js/docx-preview-csp.css';
            document.head.appendChild(link);
        } else {
            console.log('CSP base CSS already loaded');
        }
        
        // Add dynamic CSS rules
        this.addRule('.docx-width-custom', 'width: var(--docx-width);');
        this.addRule('.docx-word-spacing-custom', 'word-spacing: var(--docx-word-spacing);');
        this.addRule('.docx-padding-custom', `
            padding-left: var(--docx-padding-left, inherit);
            padding-right: var(--docx-padding-right, inherit);
            padding-top: var(--docx-padding-top, inherit);
            padding-bottom: var(--docx-padding-bottom, inherit);
        `);
        this.addRule('.docx-min-height-custom', 'min-height: var(--docx-min-height);');
        this.addRule('.docx-columns-custom', `
            column-count: var(--docx-column-count, inherit);
            column-gap: var(--docx-column-gap, inherit);
            column-rule: var(--docx-column-rule, inherit);
        `);
        this.addRule('.docx-margin-custom', `
            margin-top: var(--docx-margin-top, inherit);
            margin-bottom: var(--docx-margin-bottom, inherit);
        `);
        this.addRule('.docx-display-custom', 'display: var(--docx-display);');
        this.addRule('.docx-position-custom', 'position: var(--docx-position);');
        this.addRule('.docx-text-indent-custom', 'text-indent: var(--docx-text-indent);');        this.addRule('.docx-tab-stop-underline', 'text-decoration: underline;');
        this.addRule('.docx-tab-stop-dotted', 'text-decoration-style: dotted;');
        
        console.log('CSP utilities initialization complete');
    }
};

// Initialize when DOM is ready
console.log('CSP utils script loaded');
if (document.readyState === 'loading') {
    console.log('Waiting for DOM ready...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM ready, initializing CSP utils...');
        window.docxCSPUtils.init();
    });
} else {
    console.log('DOM already ready, initializing CSP utils immediately...');
    window.docxCSPUtils.init();
}
