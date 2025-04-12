chrome.runtime.onInstalled.addListener(() => {
    console.log('Amazon Product Scraper installed')
  })
  
  // Handle messages from content script or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    
    if (request.action === 'getProductData') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'getProductData' }, (response) => {
            console.log('Background script received response from content script:', response);
            sendResponse(response);
          });
        } else {
          sendResponse({ error: 'No active tab found' });
        }
      });
      return true; // Required for async response
    }
  })