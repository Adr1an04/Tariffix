import { load } from 'cheerio'

// Function to determine the type of Amazon page
const getAmazonPageType = (): string => {
  const url = window.location.href;
  
  // Check if it's a product page
  if (url.includes('/dp/') || 
      url.includes('/gp/product/') || 
      url.includes('/product/') || 
      url.includes('/gp/offer-listing/') ||
      url.includes('/gp/aw/d/')) {
    return 'product';
  } 
  // Check if it's a search page
  else if (url.includes('/s?') || 
           url.includes('/s/') || 
           url.includes('/search/') || 
           url.includes('/gp/search/')) {
    return 'search';
  } 
  // Check if it's a captcha page
  else if (url.includes('/hz/mobile/mission/') || 
           url.includes('/captcha') || 
           url.includes('/errors/validateCaptcha')) {
    return 'captcha';
  } 
  // Check if it's a cart page
  else if (url.includes('/gp/cart/') || 
           url.includes('/cart/') || 
           url.includes('/shoppingcart/')) {
    return 'cart';
  } 
  // Check if it's a wishlist page
  else if (url.includes('/wishlist/') || 
           url.includes('/gp/registry/wishlist/')) {
    return 'wishlist';
  } 
  // Check if it's an orders page
  else if (url.includes('/order-history/') || 
           url.includes('/gp/your-account/order-details/') || 
           url.includes('/gp/css/order-details/')) {
    return 'orders';
  } 
  // Check if it's a seller page
  else if (url.includes('/gp/seller/') || 
           url.includes('/sp?seller=')) {
    return 'seller';
  }
  // Check if it's a store page
  else if (url.includes('/gp/shop/') || 
           url.includes('/stores/')) {
    return 'store';
  }
  // Check if it's a category page
  else if (url.includes('/gp/browse.html') || 
           url.includes('/b?node=')) {
    return 'category';
  }
  // Check if it's a deals page
  else if (url.includes('/gp/goldbox') || 
           url.includes('/deals') || 
           url.includes('/gp/feature.html')) {
    return 'deals';
  }
  // Default to other
  else {
    return 'other';
  }
};

// Function to wait for an element to be present in the DOM
const waitForElement = (selector: string, timeout = 5000): Promise<Element | null> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector));
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout after specified duration
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
};

// Function to check if we're on a CAPTCHA page
const isCaptchaPage = (): boolean => {
  const url = window.location.href;
  const isRobotCheck = document.title.toLowerCase().includes('robot') ||
                      (document.body.textContent?.toLowerCase() || '').includes('robot check');
  return url.includes('/captcha') || 
         url.includes('/errors/validateCaptcha') || 
         isRobotCheck;
};

// Function to scrape product details
const scrapeAmazonProduct = async () => {
  // Check for CAPTCHA first
  if (isCaptchaPage()) {
    return {
      error: 'Amazon is showing a CAPTCHA page. Please solve the CAPTCHA and try again.',
      pageType: 'captcha',
      url: window.location.href
    };
  }

  const pageType = getAmazonPageType();
  
  if (pageType !== 'product') {
    return { 
      error: `This appears to be an Amazon ${pageType} page. The extension currently works on product pages only.`,
      pageType,
      url: window.location.href
    };
  }

  // Wait for key elements to be present
  await Promise.all([
    waitForElement('#productTitle'),
    waitForElement('#detailBullets_feature_div'),
    waitForElement('#productDetails_feature_div'),
    waitForElement('#productDescription')
  ]);

  // Product title
  const title = document.querySelector('#productTitle')?.textContent?.trim() || '';
  
  // Focus on manufacturer and country of origin
  let manufacturer = '';
  let countryOfOrigin = '';
  
  // Method 1: Detail Bullets
  const detailBullets = document.querySelectorAll('#detailBullets_feature_div .a-list-item');
  detailBullets.forEach(bullet => {
    const text = bullet.textContent?.trim() || '';
    if (text.includes('Manufacturer') || text.includes('Brand')) {
      const value = text.split(':')[1];
      if (value) manufacturer = value.trim();
    }
    if (text.includes('Country of Origin') || text.includes('Made in')) {
      const value = text.split(':')[1];
      if (value) countryOfOrigin = value.trim();
    }
  });

  // Method 2: Product Details Table
  if (!manufacturer || !countryOfOrigin) {
    const detailRows = document.querySelectorAll('#productDetails_feature_div tr');
    detailRows.forEach(row => {
      const label = row.querySelector('th')?.textContent?.trim().toLowerCase() || '';
      const value = row.querySelector('td')?.textContent?.trim() || '';
      
      if (label.includes('manufacturer') || label.includes('brand')) {
        manufacturer = value;
      }
      if (label.includes('country of origin') || label.includes('made in')) {
        countryOfOrigin = value;
      }
    });
  }

  // Method 3: Additional Details
  if (!manufacturer || !countryOfOrigin) {
    const additionalDetails = document.querySelectorAll('.detail-bullet-list .a-list-item');
    additionalDetails.forEach(detail => {
      const text = detail.textContent?.trim() || '';
      if (text.includes('Manufacturer') || text.includes('Brand')) {
        const value = text.split(':')[1];
        if (value) manufacturer = value.trim();
      }
      if (text.includes('Country of Origin') || text.includes('Made in')) {
        const value = text.split(':')[1];
        if (value) countryOfOrigin = value.trim();
      }
    });
  }

  // Method 4: Try to find in the product description
  if (!manufacturer || !countryOfOrigin) {
    const description = document.querySelector('#productDescription')?.textContent?.trim() || '';
    
    if (!manufacturer) {
      const manufacturerMatch = description.match(/manufactured by ([^.,]+)/i) || 
                               description.match(/brand:\s*([^.,]+)/i) ||
                               description.match(/manufacturer:\s*([^.,]+)/i);
      if (manufacturerMatch) {
        manufacturer = manufacturerMatch[1].trim();
      }
    }
    
    if (!countryOfOrigin) {
      const originMatch = description.match(/made in ([^.,]+)/i) || 
                         description.match(/country of origin:\s*([^.,]+)/i);
      if (originMatch) {
        countryOfOrigin = originMatch[1].trim();
      }
    }
  }

  // Method 5: Try to find in any text on the page
  if (!manufacturer || !countryOfOrigin) {
    const pageText = document.body.textContent || '';
    
    if (!manufacturer) {
      const manufacturerMatch = pageText.match(/Manufacturer\s*[:\u2236]\s*([^.,\n]+)/i) ||
                               pageText.match(/Brand\s*[:\u2236]\s*([^.,\n]+)/i);
      if (manufacturerMatch) {
        manufacturer = manufacturerMatch[1].trim();
      }
    }
    
    if (!countryOfOrigin) {
      const originMatch = pageText.match(/Country of Origin\s*[:\u2236]\s*([^.,\n]+)/i) ||
                         pageText.match(/Made in\s*[:\u2236]?\s*([^.,\n]+)/i);
      if (originMatch) {
        countryOfOrigin = originMatch[1].trim();
      }
    }
  }

  console.log('Scraped data:', { title, manufacturer, countryOfOrigin });
  
  return {
    pageType,
    title,
    manufacturer: manufacturer || 'Not found',
    countryOfOrigin: countryOfOrigin || 'Not found',
    url: window.location.href
  };
};

// Run the scraper when the page is ready
let productData: any = null;

// Function to run the scraper
const runScraper = async () => {
  try {
    productData = await scrapeAmazonProduct();
    console.log('Amazon product data scraped:', productData);
  } catch (error) {
    console.error('Error scraping product data:', error);
    productData = {
      error: 'Failed to scrape product data: ' + (error as Error).message,
      url: window.location.href
    };
  }
};

// Run the scraper when the page is loaded
if (document.readyState === 'complete') {
  runScraper();
} else {
  window.addEventListener('load', runScraper);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'getProductData') {
    if (productData) {
      console.log('Returning cached product data:', productData);
      sendResponse(productData);
    } else {
      console.log('Running scraper for fresh data');
      runScraper().then(() => {
        console.log('New product data:', productData);
        sendResponse(productData);
      });
    }
    return true; // Required for async response
  }
});