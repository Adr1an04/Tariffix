import { load } from 'cheerio'

// Function to determine the type of Amazon page
const getAmazonPageType = (): string => {
  const url = window.location.href;
  
  if (url.includes('/dp/') || url.includes('/gp/product/')) {
    return 'product';
  } else if (url.includes('/s?') || url.includes('/s/')) {
    return 'search';
  } else if (url.includes('/hz/mobile/mission/')) {
    return 'captcha';
  } else if (url.includes('/gp/cart/')) {
    return 'cart';
  } else if (url.includes('/wishlist/')) {
    return 'wishlist';
  } else if (url.includes('/order-history/')) {
    return 'orders';
  } else {
    return 'other';
  }
};

// Function to scrape product details quickly
const scrapeAmazonProduct = () => {
  const pageType = getAmazonPageType();
  
  if (pageType !== 'product') {
    return { 
      error: `This appears to be an Amazon ${pageType} page. The extension currently works on product pages only.`,
      pageType,
      url: window.location.href
    };
  }

  // Use native DOM methods for better performance
  const getTextContent = (selector: string): string => {
    const element = document.querySelector(selector);
    return element ? element.textContent?.trim() || '' : '';
  };

  const getAttribute = (selector: string, attribute: string): string => {
    const element = document.querySelector(selector);
    return element ? element.getAttribute(attribute) || '' : '';
  };

  // Product title
  const title = getTextContent('#productTitle');
  
  // Price - try multiple selectors for better accuracy
  let price = getTextContent('.a-price .a-offscreen');
  if (!price) {
    price = getTextContent('#priceblock_ourprice');
  }
  if (!price) {
    price = getTextContent('#priceblock_dealprice');
  }
  if (!price) {
    price = getTextContent('#priceblock_saleprice');
  }
  
  // Product details table (technical specifications)
  const details: Record<string, string> = {};
  
  // Method 1: Product Details Table
  const productDetailsRows = document.querySelectorAll('#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr');
  productDetailsRows.forEach(row => {
    const keyElement = row.querySelector('th');
    const valueElement = row.querySelector('td');
    if (keyElement && valueElement) {
      const key = keyElement.textContent?.trim().replace(/\s+/g, ' ') || '';
      const value = valueElement.textContent?.trim().replace(/\s+/g, ' ') || '';
      if (key && value) {
        details[key] = value;
      }
    }
  });
  
  // Method 2: Bullet Points
  const bulletPoints = document.querySelectorAll('#feature-bullets li');
  bulletPoints.forEach(bullet => {
    const text = bullet.textContent?.trim() || '';
    if (text && !text.includes('Click here') && !text.includes('See more')) {
      details[`Feature ${Object.keys(details).length + 1}`] = text;
    }
  });
  
  // Method 3: Product Description
  const descriptionElement = document.querySelector('#productDescription');
  if (descriptionElement) {
    const descriptionText = descriptionElement.textContent?.trim() || '';
    if (descriptionText) {
      details['Product Description'] = descriptionText;
    }
  }
  
  // Method 4: Additional Details from the bottom section
  const additionalDetailsRows = document.querySelectorAll('#productDetails_db_sections tr, #detailBullets_feature_div li');
  additionalDetailsRows.forEach(row => {
    if (row.tagName === 'TR') {
      const keyElement = row.querySelector('th');
      const valueElement = row.querySelector('td');
      if (keyElement && valueElement) {
        const key = keyElement.textContent?.trim().replace(/\s+/g, ' ') || '';
        const value = valueElement.textContent?.trim().replace(/\s+/g, ' ') || '';
        if (key && value) {
          details[key] = value;
        }
      }
    } else if (row.tagName === 'LI') {
      const text = row.textContent?.trim() || '';
      if (text && !text.includes('Click here') && !text.includes('See more')) {
        const parts = text.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          if (key && value) {
            details[key] = value;
          }
        }
      }
    }
  });
  
  // Ratings
  const rating = getAttribute('#acrPopover', 'title')?.replace(' out of 5 stars', '') || '';
  const reviewCount = getTextContent('#acrCustomerReviewText');
  
  // Product images
  const mainImage = getAttribute('#landingImage', 'src') || '';
  
  // Availability
  const availability = getTextContent('#availability');
  
  // Seller information
  const seller = getTextContent('#merchant-info');
  
  return {
    pageType,
    title,
    price,
    rating,
    reviewCount,
    availability,
    seller,
    mainImage,
    details,
    url: window.location.href
  };
};

// Run the scraper immediately when the page loads
let productData: any = null;

// Function to run the scraper
const runScraper = () => {
  productData = scrapeAmazonProduct();
  console.log('Amazon product data scraped:', productData);
};

// Run the scraper when the page is fully loaded
if (document.readyState === 'complete') {
  runScraper();
} else {
  window.addEventListener('load', runScraper);
}

// Also run the scraper when the URL changes (for single-page applications)
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    runScraper();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeProduct') {
    // If we already have the data, return it immediately
    if (productData) {
      sendResponse(productData);
    } else {
      // Otherwise, run the scraper now
      productData = scrapeAmazonProduct();
      sendResponse(productData);
    }
  }
  return true; // Required for async response
});