// Background Service Worker for Calm Browsing Buddy
class ExtensionManager {
  constructor() {
    this.stats = { adsBlocked: 0, popupsBlocked: 0, redirectsBlocked: 0 };
    this.filterLists = [];
    this.whitelist = new Set();
    this.settings = {
      adBlocking: true,
      popupBlocking: true,
      redirectBlocking: true
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadFilterLists();
    this.setupListeners();
    this.updateBadge();
  }

  async loadSettings() {
    const result = await chrome.storage.local.get(['settings', 'whitelist', 'stats']);
    this.settings = { ...this.settings, ...result.settings };
    this.whitelist = new Set(result.whitelist || []);
    this.stats = { ...this.stats, ...result.stats };
  }

  async saveSettings() {
    await chrome.storage.local.set({
      settings: this.settings,
      whitelist: Array.from(this.whitelist),
      stats: this.stats
    });
  }

  async loadFilterLists() {
    // Load EasyList filters (simplified for demo)
    const commonAdSelectors = [
      '[class*="ad-"]', '[id*="ad-"]', '[class*="ads-"]', '[id*="ads-"]',
      '.advertisement', '.ad-banner', '.popup-ad', '.sponsored',
      '[class*="google-ad"]', '[class*="doubleclick"]', '.adsystem'
    ];
    
    const adDomains = [
      'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
      'amazon-adsystem.com', 'facebook.com/tr', 'googletagmanager.com'
    ];

    this.filterLists = { selectors: commonAdSelectors, domains: adDomains };
  }

  setupListeners() {
    // Block ad requests
    chrome.webRequest.onBeforeRequest.addListener(
      this.handleRequest.bind(this),
      { urls: ["<all_urls>"] },
      ["blocking"]
    );

    // Handle navigation for redirect blocking
    chrome.webNavigation.onBeforeNavigate.addListener(
      this.handleNavigation.bind(this)
    );

    // Handle popup blocking
    chrome.tabs.onCreated.addListener(this.handleTabCreated.bind(this));

    // Handle messages from content script
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleRequest(details) {
    if (!this.settings.adBlocking) return {};
    
    const url = new URL(details.url);
    const isBlocked = this.filterLists.domains.some(domain => 
      url.hostname.includes(domain)
    );

    if (isBlocked && !this.whitelist.has(url.hostname)) {
      this.stats.adsBlocked++;
      this.updateBadge();
      this.saveSettings();
      return { cancel: true };
    }

    return {};
  }

  async handleNavigation(details) {
    if (!this.settings.redirectBlocking || details.frameId !== 0) return;

    const tab = await chrome.tabs.get(details.tabId);
    const currentUrl = tab.url;
    
    // Simple heuristic for suspicious redirects
    if (currentUrl && this.isSuspiciousRedirect(currentUrl, details.url)) {
      this.stats.redirectsBlocked++;
      this.updateBadge();
      this.saveSettings();
      
      // Show interstitial page
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('interstitial.html') + 
             '?blocked=' + encodeURIComponent(details.url) +
             '&from=' + encodeURIComponent(currentUrl)
      });
    }
  }

  isSuspiciousRedirect(from, to) {
    const fromDomain = new URL(from).hostname;
    const toDomain = new URL(to).hostname;
    
    // Block redirects to different domains that happen too quickly
    return fromDomain !== toDomain && 
           !this.whitelist.has(toDomain) &&
           to.includes('click') || to.includes('redirect') || to.includes('ads');
  }

  handleTabCreated(tab) {
    if (!this.settings.popupBlocking) return;

    // Simple popup detection: new tab without user gesture
    if (tab.openerTabId && !tab.active) {
      this.stats.popupsBlocked++;
      this.updateBadge();
      this.saveSettings();
      
      chrome.tabs.remove(tab.id);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Popup Blocked',
        message: 'A popup was blocked. Click the extension icon to allow it.'
      });
    }
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'getStats':
        sendResponse(this.stats);
        break;
      case 'getSettings':
        sendResponse(this.settings);
        break;
      case 'updateSettings':
        this.settings = { ...this.settings, ...message.settings };
        this.saveSettings();
        sendResponse({ success: true });
        break;
      case 'addToWhitelist':
        this.whitelist.add(message.domain);
        this.saveSettings();
        sendResponse({ success: true });
        break;
      case 'removeFromWhitelist':
        this.whitelist.delete(message.domain);
        this.saveSettings();
        sendResponse({ success: true });
        break;
      case 'getWhitelist':
        sendResponse(Array.from(this.whitelist));
        break;
      case 'adRemoved':
        this.stats.adsBlocked++;
        this.updateBadge();
        this.saveSettings();
        break;
    }
  }

  updateBadge() {
    const total = this.stats.adsBlocked + this.stats.popupsBlocked + this.stats.redirectsBlocked;
    chrome.action.setBadgeText({ text: total > 0 ? total.toString() : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });
  }
}

// Initialize the extension manager
const extensionManager = new ExtensionManager();