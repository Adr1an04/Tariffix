chrome.runtime.onInstalled.addListener(() => {
    console.log('Amazon Product Scraper installed')
  })
  
  // Handle messages from content script or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProductData') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeProduct' }, (response) => {
            sendResponse(response)
          })
        }
      })
      return true // Required for async response
    }
  })