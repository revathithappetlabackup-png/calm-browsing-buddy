// Options page script for Calm Browsing Buddy
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadStats();
  await loadWhitelist();
  setupEventListeners();
});

async function loadSettings() {
  const settings = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, resolve);
  });
  
  document.getElementById('ad-toggle').classList.toggle('active', settings.adBlocking);
  document.getElementById('popup-toggle').classList.toggle('active', settings.popupBlocking);
  document.getElementById('redirect-toggle').classList.toggle('active', settings.redirectBlocking);
}

async function loadStats() {
  const stats = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getStats' }, resolve);
  });
  
  document.getElementById('stat-ads').textContent = (stats.adsBlocked || 0).toLocaleString();
  document.getElementById('stat-popups').textContent = (stats.popupsBlocked || 0).toLocaleString();
  document.getElementById('stat-redirects').textContent = (stats.redirectsBlocked || 0).toLocaleString();
}

async function loadWhitelist() {
  const whitelist = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getWhitelist' }, resolve);
  });
  
  const container = document.getElementById('whitelist-items');
  container.innerHTML = '';
  
  if (whitelist.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No whitelisted domains</p>';
    return;
  }
  
  whitelist.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'whitelist-item';
    item.innerHTML = `
      <span>${domain}</span>
      <button class="btn btn-danger" onclick="removeDomain('${domain}')">Remove</button>
    `;
    container.appendChild(item);
  });
}

function setupEventListeners() {
  // Toggle settings
  document.getElementById('ad-toggle').addEventListener('click', () => {
    toggleSetting('adBlocking', 'ad-toggle');
  });
  
  document.getElementById('popup-toggle').addEventListener('click', () => {
    toggleSetting('popupBlocking', 'popup-toggle');
  });
  
  document.getElementById('redirect-toggle').addEventListener('click', () => {
    toggleSetting('redirectBlocking', 'redirect-toggle');
  });
  
  // Add whitelist domain
  document.getElementById('add-whitelist').addEventListener('click', addDomain);
  document.getElementById('whitelist-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addDomain();
  });
}

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

async function addDomain() {
  const input = document.getElementById('whitelist-input');
  const domain = input.value.trim();
  
  if (!domain) return;
  
  // Simple domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;
  if (!domainRegex.test(domain)) {
    alert('Please enter a valid domain name');
    return;
  }
  
  await new Promise(resolve => {
    chrome.runtime.sendMessage({ 
      action: 'addToWhitelist', 
      domain: domain 
    }, resolve);
  });
  
  input.value = '';
  await loadWhitelist();
}

async function removeDomain(domain) {
  if (confirm(`Remove ${domain} from whitelist?`)) {
    await new Promise(resolve => {
      chrome.runtime.sendMessage({ 
        action: 'removeFromWhitelist', 
        domain: domain 
      }, resolve);
    });
    
    await loadWhitelist();
  }
}

// Auto-refresh stats every 10 seconds
setInterval(loadStats, 10000);