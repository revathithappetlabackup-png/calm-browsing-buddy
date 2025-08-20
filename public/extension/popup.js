// Popup script for Calm Browsing Buddy
document.addEventListener('DOMContentLoaded', async () => {
  // Load and display stats
  const stats = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getStats' }, resolve);
  });
  
  document.getElementById('ads-blocked').textContent = stats.adsBlocked || 0;
  document.getElementById('popups-blocked').textContent = stats.popupsBlocked || 0;
  document.getElementById('redirects-blocked').textContent = stats.redirectsBlocked || 0;
  
  // Load settings
  const settings = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, resolve);
  });
  
  // Set toggle states
  document.getElementById('ad-toggle').classList.toggle('active', settings.adBlocking);
  document.getElementById('popup-toggle').classList.toggle('active', settings.popupBlocking);
  document.getElementById('redirect-toggle').classList.toggle('active', settings.redirectBlocking);
  
  // Handle toggle clicks
  document.getElementById('ad-toggle').addEventListener('click', () => {
    toggleSetting('adBlocking', 'ad-toggle');
  });
  
  document.getElementById('popup-toggle').addEventListener('click', () => {
    toggleSetting('popupBlocking', 'popup-toggle');
  });
  
  document.getElementById('redirect-toggle').addEventListener('click', () => {
    toggleSetting('redirectBlocking', 'redirect-toggle');
  });
  
  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  async function toggleSetting(setting, toggleId) {
    const toggle = document.getElementById(toggleId);
    const isActive = toggle.classList.contains('active');
    
    // Update UI
    toggle.classList.toggle('active');
    
    // Update settings
    const newSettings = { [setting]: !isActive };
    await new Promise(resolve => {
      chrome.runtime.sendMessage({ 
        action: 'updateSettings', 
        settings: newSettings 
      }, resolve);
    });
  }
  
  // Auto-refresh stats every 5 seconds
  setInterval(async () => {
    const stats = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'getStats' }, resolve);
    });
    
    document.getElementById('ads-blocked').textContent = stats.adsBlocked || 0;
    document.getElementById('popups-blocked').textContent = stats.popupsBlocked || 0;
    document.getElementById('redirects-blocked').textContent = stats.redirectsBlocked || 0;
  }, 5000);
});