# CSP-Compliant docx-preview Implementation

This directory contains a Content Security Policy (CSP) compliant version of the docx-preview library that works without `unsafe-inline` styles.

## Files

### Core Files (located in `dist/` directory)
- `dist/docx-preview.min.js` - Original docx-preview library (copied from node_modules)
- `dist/docx-preview-csp.css` - CSP-compliant CSS classes for all previously inline styles
- `dist/docx-csp-utils.js` - Utility functions for converting inline styles to CSS classes and custom properties
- `dist/docx-preview-csp-wrapper.js` - JavaScript wrapper that patches the original library

### Problem Solved

The original docx-preview library sets inline styles directly on DOM elements using patterns like:
```javascript
element.style.width = '100pt';
element.style.textDecoration = 'underline';
```

This violates CSP policies that don't allow `unsafe-inline` in the `style-src` directive.

## Solution Overview

### 1. CSS Classes and Custom Properties
Instead of inline styles, we use:
- **Predefined CSS classes** for common patterns (e.g., `.docx-tab-stop-underline`)
- **CSS custom properties** for dynamic values (e.g., `--docx-width`)
- **Utility classes** that read from custom properties (e.g., `.docx-width-custom`)

### 2. Style Interception
The wrapper intercepts all `element.style.property = value` assignments and converts them to:
- CSS class additions
- CSS custom property settings

### 3. Dynamic Style Generation
For complex styles, we dynamically create CSS rules in a `<style>` element, which is CSP-compliant as long as it doesn't use `eval()` or inline event handlers.

## Usage

Replace the original docx-preview script tags:
```html
<!-- OLD -->
<script src="/js/docx-preview.min.js"></script>

<!-- NEW -->
<script src="/js/docx-csp-utils.js"></script>
<script src="/js/docx-preview-csp.min.js"></script>
<script src="/js/docx-preview-csp-wrapper.js"></script>
```

Also include the CSS:
```html
<link rel="stylesheet" href="/js/docx-preview-csp.css">
```

## How It Works

1. **Load Order**: 
   - CSP utilities load first
   - Original docx-preview loads second
   - Wrapper patches the library third

2. **Style Interception**: 
   - Wrapper creates a Proxy around `element.style`
   - All style assignments are intercepted
   - Converted to CSS classes and custom properties

3. **CSS Custom Properties**:
   ```javascript
   // Instead of: element.style.width = '100pt'
   element.style.setProperty('--docx-width', '100pt');
   element.classList.add('docx-width-custom');
   ```

4. **CSS Classes**:
   ```css
   .docx-width-custom {
     width: var(--docx-width);
   }
   ```

## Benefits

- ✅ **CSP Compliant**: No `unsafe-inline` required
- ✅ **Drop-in Replacement**: Same API as original library
- ✅ **Performance**: CSS classes are faster than inline styles
- ✅ **Maintainable**: Styles are centralized in CSS files
- ✅ **Debuggable**: CSS classes are easier to inspect

## Server Routes

The following routes serve the CSP-compliant files from the `dist/` directory:
- `/js/docx-preview-csp.min.js` - Main library (serves `dist/docx-preview.min.js`)
- `/js/docx-csp-utils.js` - Utility functions (serves `dist/docx-csp-utils.js`)
- `/js/docx-preview-csp-wrapper.js` - Wrapper script (serves `dist/docx-preview-csp-wrapper.js`)
- `/js/docx-preview-csp.css` - CSS styles (serves `dist/docx-preview-csp.css`)

## Browser Support

Compatible with all modern browsers that support:
- CSS Custom Properties (CSS Variables)
- Proxy objects
- ES6 features

## Notes

- The original `docx-preview.min.js` file is used as-is
- All modifications are applied via the wrapper
- Fallback behavior maintains original functionality
- No changes to the docx-preview API
