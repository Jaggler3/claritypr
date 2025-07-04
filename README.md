# ClarityPR Chrome Extension

A Chrome extension built with TypeScript that adds helpful functionality to GitHub.com pages.

## Features

- 🚀 Adds a floating button to GitHub pages
- 📱 Responsive popup interface
- 🎨 Modern UI with smooth animations
- 🔄 Works with GitHub's single-page application navigation
- ⚡ Built with TypeScript for better development experience

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome browser

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Building the Extension

1. Build the TypeScript files:
   ```bash
   npm run build
   ```

2. For development with auto-rebuild:
   ```bash
   npm run dev
   ```

### Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the root folder of this project
5. The extension should now appear in your extensions list

### Usage

1. Navigate to any GitHub.com page
2. You'll see a green "🚀 ClarityPR" button in the top-right corner
3. Click the button to activate the helper functionality
4. You can also click the extension icon in the toolbar to open the popup

## Project Structure

```
├── manifest.json          # Extension manifest
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── popup.html             # Extension popup interface
├── src/
│   ├── content.ts         # Content script (runs on GitHub pages)
│   └── popup.ts           # Popup script
├── dist/                  # Compiled JavaScript (generated)
└── icons/                 # Extension icons
```

## Customization

### Adding New Features

The main functionality is in `src/content.ts`. You can:

- Add new UI elements to GitHub pages
- Interact with GitHub's API
- Modify page content
- Add keyboard shortcuts
- Create custom notifications

### Styling

The extension uses inline styles for the button and notifications. You can modify the CSS in the `createButton()` and `showNotification()` methods in `content.ts`.

## Icons

Replace the placeholder files in the `icons/` folder with actual PNG icons:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

## Development Tips

- Use `npm run dev` for automatic rebuilding during development
- Check the browser console for any errors
- The extension automatically handles GitHub's client-side navigation
- Use Chrome DevTools to debug the content script

## Troubleshooting

- If the extension doesn't load, check that all files are in the correct locations
- Make sure the `dist/` folder contains the compiled JavaScript files
- Verify that the manifest.json points to the correct file paths
- Check the Chrome extensions page for any error messages

## License

MIT License - feel free to use and modify as needed! 