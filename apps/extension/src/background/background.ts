// Track injected content scripts
const injectedTabs = new Set<number>();

// List of proxy servers
const proxyServers = [
  { 
    host: 'proxy.example.com',  // Replace with your proxy host
    port: 8080,                 // Replace with your proxy port
    username: 'YOUR_USERNAME',   // Replace with your proxy username
    password: 'YOUR_PASSWORD'    // Replace with your proxy password
  },
  {
    host: 'proxy.crawlera.com',
    port: 8010
  },
  {
    host: 'proxy.webshare.io',
    port: 80
  }
];

let currentProxyIndex = 0;
let proxyErrors = new Map<string, number>();

// Function to rotate proxy
async function rotateProxy() {
  const maxErrors = 3; // Maximum number of errors before switching proxy
  const proxy = proxyServers[currentProxyIndex];
  
  // Check if current proxy has too many errors
  const errors = proxyErrors.get(proxy.host) || 0;
  if (errors >= maxErrors) {
    console.log(`Proxy ${proxy.host} has too many errors, rotating...`);
    currentProxyIndex = (currentProxyIndex + 1) % proxyServers.length;
    proxyErrors.delete(proxy.host);
  }

  const config = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: 'http',
        host: proxy.host,
        port: proxy.port,
        proxyDns: true,
        proxyAuthorization: `Basic ${btoa(`${proxy.username}:${proxy.password}`)}`
      },
      bypassList: ['localhost', '127.0.0.1']
    }
  };

  try {
    await chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    });

    console.log('Proxy rotated to:', proxy.host);
  } catch (error) {
    console.error('Error setting proxy:', error);
    // Increment error count for this proxy
    proxyErrors.set(proxy.host, (proxyErrors.get(proxy.host) || 0) + 1);
    // Try next proxy
    currentProxyIndex = (currentProxyIndex + 1) % proxyServers.length;
    await rotateProxy();
  }
}

// Function to update the user agent rule
async function updateUserAgentRule() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
  ];
  
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  
  try {
    // Remove existing rules
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = rules.map(rule => rule.id);
    
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }

    // Add new rule with unique ID
    const newRuleId = Math.floor(Math.random() * 100000) + 1;
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: newRuleId,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [{
            header: 'User-Agent',
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            value: userAgent
          }]
        },
        condition: {
          urlFilter: '||amazon.com|walmart.com',
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
            chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
            chrome.declarativeNetRequest.ResourceType.STYLESHEET,
            chrome.declarativeNetRequest.ResourceType.SCRIPT,
            chrome.declarativeNetRequest.ResourceType.IMAGE,
            chrome.declarativeNetRequest.ResourceType.FONT,
            chrome.declarativeNetRequest.ResourceType.OBJECT,
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST
          ]
        }
      }]
    });

    console.log('Updated user agent to:', userAgent);
  } catch (error) {
    console.error('Error updating user agent rule:', error);
  }
}

// Function to check if a page is accessible
async function isPageAccessible(tabId: number): Promise<boolean> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.readyState
    });
    return true;
  } catch {
    return false;
  }
}

// Initial setup
updateUserAgentRule();
rotateProxy();

// Listen for alarm to update user agent and rotate proxy
chrome.alarms.create('updateUserAgent', { periodInMinutes: 5 });
chrome.alarms.create('rotateProxy', { periodInMinutes: 10 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateUserAgent') {
    updateUserAgentRule();
  } else if (alarm.name === 'rotateProxy') {
    rotateProxy();
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    (tab.url.includes('walmart.com') || tab.url.includes('amazon.com')) &&
    !injectedTabs.has(tabId)
  ) {
    // Wait for the page to be accessible
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      if (await isPageAccessible(tabId)) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js']
          });
          injectedTabs.add(tabId);
          break;
        } catch (error) {
          console.error('Failed to inject content script:', error);
          // If proxy error, rotate proxy
          if (error.message.includes('proxy')) {
            await rotateProxy();
          }
        }
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between retries
    }
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request, 'from:', sender);
  
  if (request.action === 'getProductData') {
    // If message is from popup, forward to content script
    if (!sender.tab) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
          console.error('No active tab found');
          sendResponse({ error: 'No active tab found' });
          return;
        }

        try {
          const response = await chrome.tabs.sendMessage(activeTab.id, { action: 'getProductData' });
          console.log('Background script received response from content:', response);
          sendResponse(response);
        } catch (error) {
          console.error('Error getting product data:', error);
          sendResponse({ error: 'Failed to get product data' });
        }
      });
      return true; // Keep the message channel open for async response
    }
    // If message is from content script, forward to popup
    else {
      sendResponse(request.data);
    }
  } else if (request.action === 'rotateProxy') {
    rotateProxy()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep the message channel open for async response
  }
});