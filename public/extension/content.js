// Content Script for DOM Ad Removal
class AdBlocker {
  constructor() {
    this.removedAds = 0;
    this.observer = null;
    this.init();
  }

  init() {
    this.loadFilterLists();
    this.startBlocking();
    this.observeDOM();
  }

  loadFilterLists() {
    // Common ad selectors (EasyList subset)
    this.adSelectors = [
      // Generic ad classes
      '[class*="ad-"]', '[id*="ad-"]', '[class*="ads-"]', '[id*="ads-"]',
      '.advertisement', '.ad-banner', '.popup-ad', '.sponsored',
      '.ad-container', '.ad-wrapper', '.ad-content', '.ad-block',
      
      // Google Ads
      '[class*="google-ad"]', '.adsbygoogle', 'ins.adsbygoogle',
      
      // Common ad networks
      '[class*="doubleclick"]', '.adsystem', '[data-ad-client]',
      
      // Social media ads
      '[data-testid*="ad"]', '[aria-label*="Sponsored"]',
      
      // Banner positions
      '.top-banner', '.side-banner', '.bottom-banner',
      '.header-ad', '.footer-ad', '.sidebar-ad'
    ];

    // Video-specific ad selectors (more targeted)
    this.videoAdSelectors = [
      // Video ad overlays and companions
      '.video-ads', '.preroll-ads', '.midroll-ads', '.postroll-ads',
      '.ad-overlay', '.video-ad-overlay', '.player-ad-overlay',
      '.companion-ad', '.video-companion-ad', '.player-companion',
      
      // Skip ad buttons and containers
      '.skip-ad', '.video-skip-ad', '.ad-skip-button',
      '.ad-countdown', '.ad-timer', '.ad-progress',
      
      // Video ad banners and notices
      '.video-ad-banner', '.ad-notice', '.advertisement-notice',
      '.sponsored-content-overlay', '.promoted-video-overlay',
      
      // Platform-specific video ads
      '.ytp-ad-overlay-container', '.ytp-ad-text-overlay',
      '.html5-video-ad-overlay', '.jwplayer-ad-overlay'
    ];

    // Attribute-based selectors
    this.adAttributes = [
      'data-ad-slot', 'data-ad-client', 'data-ad-format',
      'data-google-ad-client', 'data-amazon-ad-tag'
    ];
  }

  startBlocking() {
    this.removeAds();
    
    // Run periodically to catch dynamically loaded ads
    setInterval(() => this.removeAds(), 1000);
  }

  removeAds() {
    let removed = 0;

    // Remove regular ads (excluding video players)
    this.adSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (this.isValidAdElement(element) && !this.isVideoPlayer(element)) {
            this.hideElement(element);
            removed++;
          }
        });
      } catch (e) {
        // Ignore invalid selectors
      }
    });

    // Handle video ads separately with targeted approach
    removed += this.removeVideoAds();

    // Remove by attributes (but protect video players)
    this.adAttributes.forEach(attr => {
      const elements = document.querySelectorAll(`[${attr}]`);
      elements.forEach(element => {
        if (this.isValidAdElement(element) && !this.isVideoPlayer(element)) {
          this.hideElement(element);
          removed++;
        }
      });
    });

    // Remove by content analysis
    this.removeByContent();

    if (removed > 0) {
      this.removedAds += removed;
      chrome.runtime.sendMessage({ 
        action: 'adRemoved', 
        count: removed 
      });
    }
  }

  removeVideoAds() {
    let removed = 0;

    // Target video ad overlays and companions specifically
    this.videoAdSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (this.isValidVideoAdElement(element)) {
            this.hideElement(element);
            removed++;
          }
        });
      } catch (e) {
        // Ignore invalid selectors
      }
    });

    // Remove video ad iframes and embeds
    const videoAdIframes = document.querySelectorAll('iframe[src*="ads"], iframe[src*="doubleclick"], iframe[src*="googlesyndication"]');
    videoAdIframes.forEach(iframe => {
      // Only remove if it's clearly an ad, not the main video
      if (iframe.offsetWidth < 728 || iframe.offsetHeight < 300) {
        this.hideElement(iframe);
        removed++;
      }
    });

    // Skip video ads by fast-forwarding (YouTube specific)
    this.skipVideoAds();

    return removed;
  }

  skipVideoAds() {
    // YouTube specific ad skipping
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button');
    if (skipButton && skipButton.offsetParent !== null) {
      skipButton.click();
    }

    // Auto-skip after countdown
    const adCountdown = document.querySelector('.ytp-ad-duration-remaining');
    if (adCountdown) {
      const video = document.querySelector('video');
      if (video && !video.paused) {
        // Fast forward through the ad
        const adDuration = video.duration;
        if (adDuration < 30) { // Only skip short ads automatically
          video.currentTime = adDuration - 0.1;
        }
      }
    }
  }

  isVideoPlayer(element) {
    // Check if element is a video player
    const videoSelectors = [
      'video', '.video-player', '.player', '.video-container',
      '.html5-video-player', '.jwplayer', '.flowplayer',
      '[id*="player"]', '[class*="player"]'
    ];

    return videoSelectors.some(selector => {
      return element.matches(selector) || element.querySelector(selector);
    });
  }

  isValidVideoAdElement(element) {
    // More specific validation for video ad elements
    
    // Don't remove actual video players
    if (this.isVideoPlayer(element)) {
      return false;
    }

    // Don't remove if it's the main video content
    if (element.closest('video, .video-player, .player')) {
      // But allow removal if it's clearly an overlay
      return element.matches('.overlay, .ad-overlay, [class*="ad-"]');
    }

    // Don't remove if already hidden
    if (element.style.display === 'none' || element.hidden) {
      return false;
    }

    return true;
  }

  removeByContent() {
    // Find elements with ad-related text content
    const adKeywords = [
      'advertisement', 'sponsored by', 'promoted by',
      'ads by', 'click here', 'buy now', 'limited time'
    ];

    const textElements = document.querySelectorAll('div, span, p, article');
    textElements.forEach(element => {
      const text = element.textContent.toLowerCase();
      const isSmallElement = element.offsetWidth < 500 && element.offsetHeight < 300;
      
      if (isSmallElement && adKeywords.some(keyword => text.includes(keyword))) {
        if (this.isValidAdElement(element)) {
          this.hideElement(element);
        }
      }
    });
  }

  isValidAdElement(element) {
    // Don't remove if it's part of the main content
    if (element.closest('article, main, .content, .post')) {
      return false;
    }

    // Don't remove if it's too large (might be main content)
    if (element.offsetWidth > window.innerWidth * 0.8) {
      return false;
    }

    // Don't remove if already hidden
    if (element.style.display === 'none' || element.hidden) {
      return false;
    }

    return true;
  }

  hideElement(element) {
    // Use multiple methods to ensure hiding
    element.style.display = 'none !important';
    element.style.visibility = 'hidden !important';
    element.style.opacity = '0 !important';
    element.style.height = '0px !important';
    element.style.width = '0px !important';
    element.setAttribute('aria-hidden', 'true');
    element.hidden = true;

    // Add a class for tracking
    element.classList.add('calm-buddy-blocked');
  }

  observeDOM() {
    // Watch for new ads being added dynamically
    this.observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          hasNewContent = true;
        }
      });

      if (hasNewContent) {
        // Debounce to avoid excessive processing
        clearTimeout(this.observerTimeout);
        this.observerTimeout = setTimeout(() => this.removeAds(), 500);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Public method to get stats
  getStats() {
    return { adsRemoved: this.removedAds };
  }
}

// Initialize ad blocker when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AdBlocker());
} else {
  new AdBlocker();
}

// Handle popup blocking
let popupAttempts = 0;

// Override window.open to detect popup attempts
const originalOpen = window.open;
window.open = function(...args) {
  popupAttempts++;
  
  // Simple heuristic: block if opened without user interaction
  if (!document.hasFocus() || popupAttempts > 2) {
    chrome.runtime.sendMessage({ 
      action: 'popupBlocked',
      url: args[0] 
    });
    return null;
  }
  
  return originalOpen.apply(this, args);
};

// Reset popup counter on user interaction
document.addEventListener('click', () => {
  popupAttempts = 0;
});

// Block meta refresh redirects
const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
if (metaRefresh) {
  const content = metaRefresh.getAttribute('content');
  if (content && content.includes('url=')) {
    chrome.runtime.sendMessage({ 
      action: 'suspiciousRedirect',
      type: 'meta-refresh',
      content: content
    });
    metaRefresh.remove();
  }
}