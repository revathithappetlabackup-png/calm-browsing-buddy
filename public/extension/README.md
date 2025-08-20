# Calm Browsing Buddy - Browser Extension

A production-ready browser extension that blocks ads, popups, and malicious redirects for a safer, cleaner browsing experience.

## 🌟 Features

### Core Functionality
- **Ad Blocking**: Blocks banner ads, video ads, and script-based ads using EasyList filter rules
- **Popup Blocking**: Detects and blocks popups triggered without user interaction
- **Redirect Blocking**: Intercepts malicious redirections and shows confirmation pages
- **Real-time Statistics**: Track blocked content in real-time
- **Whitelist Management**: Per-site control for trusted domains

### Technical Features
- ✅ Manifest V3 compliant (Chrome/Edge/Firefox compatible)
- ✅ Background service worker for efficient processing
- ✅ Content scripts for DOM manipulation
- ✅ Minimal performance overhead (<5% slowdown)
- ✅ No data collection or transmission
- ✅ Automatic filter list updates

## 📦 Installation

### Chrome/Edge/Brave
1. Download all extension files to a folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

### Firefox
1. Download all extension files to a folder
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file
5. The extension will be temporarily installed

## 🚀 Usage

### Toolbar Popup
Click the extension icon to see:
- Real-time blocking statistics
- Quick toggle controls for each feature
- Access to advanced settings

### Settings Page
Right-click the extension icon → Options to access:
- Detailed statistics
- Whitelist management
- Filter list updates
- Advanced configuration options

### Blocking Features

#### Ad Blocking
- Automatically removes banner ads, video ads, and sponsored content
- Uses EasyList filter rules for comprehensive coverage
- Updates filter lists automatically

#### Popup Blocking
- Prevents unwanted popup windows
- Shows non-intrusive notifications when popups are blocked
- Option to allow specific popups when needed

#### Redirect Blocking
- Detects suspicious redirections
- Shows interstitial warning page for malicious redirects
- Allows whitelisting of trusted redirect destinations

## ⚙️ Configuration

### Whitelist Management
- Add trusted domains to disable blocking
- Per-domain control for granular management
- Easy removal of whitelisted sites

### Filter Lists
- EasyList: Primary ad-blocking filters
- EasyPrivacy: Privacy and tracking protection
- Automatic updates every 24 hours
- Manual update option available

## 🔧 Development

### File Structure
```
extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker for request interception
├── content.js            # DOM manipulation and ad removal
├── popup.html/js         # Extension popup interface
├── options.html/js       # Settings page
├── interstitial.html     # Redirect warning page
└── icons/               # Extension icons (16, 32, 48, 128px)
```

### Key Components

#### Background Service Worker (`background.js`)
- Handles network request interception
- Manages filter list updates
- Processes popup and redirect blocking
- Maintains statistics and settings

#### Content Script (`content.js`)
- Removes ads from DOM using CSS selectors
- Monitors for dynamically loaded content
- Handles popup attempt detection
- Blocks meta-refresh redirects

#### Popup Interface (`popup.html/js`)
- Real-time statistics display
- Quick toggle controls
- Settings access
- Clean, responsive design

## 📊 Statistics Tracking

The extension tracks and displays:
- **Ads Blocked**: Count of removed advertisements
- **Popups Prevented**: Number of blocked popup attempts  
- **Redirects Stopped**: Malicious redirections intercepted

All statistics are stored locally and never transmitted.

## 🛡️ Privacy & Security

- **No Data Collection**: Extension doesn't collect browsing data
- **Local Storage Only**: All settings stored locally
- **No External Requests**: Except for filter list updates
- **Open Source Logic**: All blocking logic is transparent

## 🔄 Filter List Integration

### EasyList Integration
- Downloads and parses EasyList filter rules
- Converts rules to CSS selectors and domain patterns
- Updates automatically with fallback to manual update
- Processes both hiding rules and network blocking rules

### Custom Filters
- Support for custom filter addition
- Domain-based blocking patterns
- CSS selector-based element hiding
- Regular expression matching for URLs

## ⚡ Performance

- **Minimal CPU Usage**: Efficient DOM scanning algorithms
- **Low Memory Footprint**: Optimized filter rule storage
- **Fast Page Loading**: Non-blocking request processing
- **Smooth Browsing**: <5% performance impact

## 🐛 Troubleshooting

### Extension Not Working
1. Check if extension is enabled in browser settings
2. Refresh the page after installation
3. Verify permissions are granted
4. Check developer console for errors

### Some Ads Still Showing
1. Update filter lists in settings
2. Add specific domains to custom filters
3. Report missed ads for filter improvements
4. Check if site is whitelisted

### Website Functionality Issues
1. Add site to whitelist temporarily
2. Disable specific blocking features for testing
3. Check browser developer tools for blocked resources
4. Report compatibility issues

## 📄 License

This extension is provided as-is for educational and personal use. Filter lists are provided by EasyList maintainers under their respective licenses.

## 🤝 Contributing

To contribute to this extension:
1. Report bugs and issues
2. Suggest new features
3. Improve filter rules
4. Submit code improvements

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review browser extension documentation
- Test in incognito/private mode
- Disable other extensions for conflict testing