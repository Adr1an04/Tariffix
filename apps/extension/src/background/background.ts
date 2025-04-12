// Keep track of tabs where we've injected the script
const injectedTabs = new Set<number>();

chrome.runtime.onInstalled.addListener(() => {
    console.log('Shopping Product Scraper installed')
    // Clear the injected tabs set on install
    injectedTabs.clear();
  })
  
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      // Check if it's a Walmart or Amazon URL
      const isAmazonUrl = tab.url.match(/amazon\.(com|co\.uk|de|fr|it|es|co\.jp|in|ca|com\.mx|com\.br|com\.au|nl|pl|eg|sa|ae|se|sg|tr)/);
      const isWalmartUrl = tab.url.includes('walmart.com');
      
      if ((isAmazonUrl || isWalmartUrl) && !injectedTabs.has(tabId)) {
        console.log('Injecting content script into:', tab.url);
        
        try {
          // Mark this tab as injected before we try to inject
          injectedTabs.add(tabId);
          
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          });
          
          console.log('Content script injected successfully');
        } catch (err) {
          console.error('Failed to inject content script:', err);
          // Remove from injected tabs if injection failed
          injectedTabs.delete(tabId);
        }
      }
    }
  });

  // Clean up injectedTabs when a tab is closed
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
    }
  })