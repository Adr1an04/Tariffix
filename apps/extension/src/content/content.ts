import { ProductData } from './types';

(function initializeScraper() {
  // Prevent multiple initializations with a more specific flag
  const SCRAPER_INIT_KEY = '__TARRIF_FIX_SCRAPER_V1__';
  
  if ((window as any)[SCRAPER_INIT_KEY]) {
    console.log('Scraper already initialized');
    return;
  }

  // Mark as initialized immediately
  (window as any)[SCRAPER_INIT_KEY] = true;
  console.log('Initializing content script');

  interface ProductScraper {
    getPageType(): string;
    waitForElement(selector: string, timeout?: number): Promise<Element | null>;
    canHandle(url: string): boolean;
    scrapeProduct(): Promise<ProductData>;
  }

  class AmazonProductScraperV2 implements ProductScraper {
    async waitForElement(selector: string, timeout: number = 15000): Promise<Element | null> {
      console.log(`Waiting for element: ${selector}`);
      const startTime = Date.now();
      
      return new Promise((resolve) => {
        const check = () => {
          const element = document.querySelector(selector);
          if (element) {
            console.log(`Found element: ${selector}`);
            resolve(element);
            return;
          }
          
          if (Date.now() - startTime >= timeout) {
            console.log(`Timeout waiting for element: ${selector}`);
            resolve(null);
            return;
          }
          
          requestAnimationFrame(check);
        };
        
        check();
      });
    }

    getPageType() {
      const url = window.location.href;
      console.log("Checking page type for URL:", url);
      if (url.includes("/dp/") || url.includes("/gp/product/")) return "product";
      if (url.includes("/s?")) return "search";
      if (url.includes("/cart/")) return "cart";
      if (url.includes("/wishlist/")) return "wishlist";
      if (url.includes("/captcha/")) return "captcha";
      if (url.includes("/stores/")) return "category";
      return "other";
    }

    isCaptchaPage() {
      const isCaptcha = window.location.href.includes('/captcha/') || 
                       document.title.toLowerCase().includes('robot check');
      console.log("Captcha check:", isCaptcha);
      return isCaptcha;
    }

    canHandle(url: string): boolean {
      return url.includes("amazon.com") || url.includes("amazon.co");
    }

    cleanManufacturerText(text: string): string {
      return text
        .replace(/^visit the|^by|^brand:|^manufacturer:/i, '')
        .trim()
        .replace(/\s+store$/i, '')
        .trim();
    }

    async findManufacturer(): Promise<string> {
      console.log("Looking for manufacturer");
      
      const selectors = [
        {
          selectors: [
            '#bylineInfo',
            '#brand',
            '#manufacturer',
            '[data-feature-name="brandLogo"]',
            '#product-byline',
            '#bylineInfo_feature_div',
            'a#bylineInfo',
            '.po-brand .a-span9',
            '[data-cel-widget="bylineInfo"]',
            '#productOverview_feature_div .po-brand .a-span9',
            '#brandByline_feature_div',
            '#brand_feature_div'
          ],
          process: (text: string) => this.cleanManufacturerText(text)
        },
        {
          selectors: [
            '#productDetails_detailBullets_sections1 tr',
            '#detailBulletsWrapper_feature_div li',
            '#prodDetails .content li',
            '#detailBullets_feature_div li'
          ],
          process: (text: string) => {
            const lowerText = text.toLowerCase();
            if (lowerText.includes('brand') || lowerText.includes('manufacturer')) {
              const parts = text.split(':');
              return parts.length > 1 ? this.cleanManufacturerText(parts[1]) : '';
            }
            return '';
          }
        },
        {
          selectors: [
            '#technicalSpecifications_section_1 tr',
            '#technical-details tr',
            '#productDetails_techSpec_section_1 tr'
          ],
          process: (text: string) => {
            const lowerText = text.toLowerCase();
            if (lowerText.includes('brand') || lowerText.includes('manufacturer')) {
              const parts = text.split(/\s{2,}|\t/);
              return parts.length > 1 ? this.cleanManufacturerText(parts[parts.length - 1]) : '';
            }
            return '';
          }
        }
      ];

      // Try each selector group
      for (const group of selectors) {
        for (const selector of group.selectors) {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            if (element?.textContent) {
              const manufacturer = group.process(element.textContent);
              if (manufacturer) {
                console.log("Found manufacturer:", manufacturer, "from selector:", selector);
                return manufacturer;
              }
            }
          }
        }
      }

      // Try to find manufacturer in title for known brands
      const title = await this.findTitle();
      const knownBrands = ['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'];
      for (const brand of knownBrands) {
        if (title.includes(brand)) {
          console.log("Found manufacturer from title:", brand);
          return brand;
        }
      }

      console.log("No manufacturer found");
      return "";
    }

    async findTitle(): Promise<string> {
      console.log("Looking for product title");
      const selectors = [
        '#productTitle',
        '#title',
        'h1.product-title-word-break',
        '[data-feature-name="title"]',
        'h1 span.a-text-normal',
        'h1[data-automation-id="title"]',
        'h1.a-spacing-none'
      ];

      for (const selector of selectors) {
        const element = await this.waitForElement(selector);
        if (element?.textContent) {
          const title = element.textContent.trim();
          console.log("Found title:", title);
          return title;
        }
      }

      throw new Error("Could not find product title");
    }

    async findPrice(): Promise<{ price: string; currency: string }> {
      console.log("Looking for price");
      const selectors = [
        '.a-price .a-offscreen',
        '#price_inside_buybox',
        '#priceblock_ourprice',
        '.a-price-whole',
        '[data-feature-name="priceBlock"]',
        '.a-price .a-price-whole',
        '#corePrice_feature_div .a-price-whole',
        '#priceblock_dealprice',
        '.priceToPay span.a-price-whole'
      ];

      for (const selector of selectors) {
        const element = await this.waitForElement(selector);
        if (element?.textContent) {
          const priceText = element.textContent.trim();
          // Remove any extra currency symbols and clean up the price
          const cleanPrice = priceText.replace(/[^0-9.,]/g, '');
          console.log("Found price:", cleanPrice);
          return { price: cleanPrice, currency: '$' };
        }
      }

      console.log("No price found");
      return { price: '', currency: '$' };
    }

    async scrapeProduct(): Promise<ProductData> {
      console.log("Starting Amazon product scrape");
      
      if (this.isCaptchaPage()) {
        throw new Error("CAPTCHA page detected");
      }

      const pageType = this.getPageType();
      console.log("Page type:", pageType);
      
      if (pageType !== "product") {
        throw new Error("Not a product page");
      }

      console.log("Waiting for initial page load");
      await new Promise(resolve => setTimeout(resolve, 2000));

      const manufacturer = await this.findManufacturer();
      const title = await this.findTitle();
      
      let countryOfOrigin = "";
      console.log("Looking for country of origin");
      
      const countrySelectors = [
        '#productDetails_detailBullets_sections1 tr',
        '#detailBulletsWrapper_feature_div li',
        '.product-facts-detail',
        '#prodDetails .content li',
        '.detail-bullet-list span',
        '#detailBullets_feature_div li',
        '#productDetails_db_sections tr',
        '.a-expander-content table tr'
      ];

      for (const selector of countrySelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Checking ${elements.length} elements for country of origin in ${selector}`);
        
        for (const element of elements) {
          const text = element.textContent?.toLowerCase() || '';
          if (text.includes('country of origin') || text.includes('country/region of origin')) {
            countryOfOrigin = text.split(':')[1]?.trim() || '';
            // Capitalize first letter of each word in country name
            countryOfOrigin = countryOfOrigin
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            console.log("Found country of origin:", countryOfOrigin);
            break;
          }
        }
        
        if (countryOfOrigin) break;
      }

      const { price, currency } = await this.findPrice();

      const productData: ProductData = {
    title,
        manufacturer,
        countryOfOrigin,
    price,
        currency,
        url: window.location.href,
        website: "Amazon"
      };

      console.log("Scraped product data:", productData);
      return productData;
    }
  }

  // Page state management
  class PageStateManager {
    private scrollPosition: { x: number; y: number } = { x: 0, y: 0 };
    private clickedElements: WeakMap<HTMLElement, boolean> = new WeakMap();

    saveState() {
      this.scrollPosition = {
        x: window.scrollX,
        y: window.scrollY
      };
      console.log('Saved scroll position:', this.scrollPosition);
    }

    restoreState() {
      // Restore scroll position
      window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
      console.log('Restored scroll position:', this.scrollPosition);

      // Close any modals or popups
      const modalSelectors = [
        '[data-testid="modal"]',
        '.modal',
        '.popup',
        '[role="dialog"]',
        '[aria-modal="true"]',
        // Add Walmart-specific selectors
        '[data-modal-root]',
        '.modal-overlay',
        '.overlay',
        '[data-automation-id="overlay"]'
      ];

      modalSelectors.forEach(selector => {
        const modals = document.querySelectorAll(selector);
        modals.forEach(modal => {
          // Try to find and click close button first
          const closeButton = modal.querySelector(
            'button[aria-label="close"], .close-button, .modal-close, [data-testid="modal-close-button"], button[aria-label="Close"], [data-automation-id="close-button"]'
          ) as HTMLElement;
          
          if (closeButton) {
            console.log('Closing modal via close button');
            closeButton.click();
          } else if (modal instanceof HTMLElement) {
            console.log('Removing modal element');
            modal.style.display = 'none';
            // Also try removing modal-specific classes
            modal.classList.remove('active', 'show', 'visible', 'open');
            // Set aria-hidden attribute
            modal.setAttribute('aria-hidden', 'true');
          }
        });
      });

      // Clean up any remaining overlay styles on body
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.paddingRight = '';
      
      // Remove any overlay backdrop elements
      const backdropSelectors = [
        '.modal-backdrop',
        '.overlay-backdrop',
        '[data-testid="modal-backdrop"]',
        '.backdrop'
      ];
      
      backdropSelectors.forEach(selector => {
        const backdrops = document.querySelectorAll(selector);
        backdrops.forEach(backdrop => {
          if (backdrop instanceof HTMLElement) {
            backdrop.style.display = 'none';
            backdrop.remove();
          }
        });
      });
    }

    trackClick(element: HTMLElement) {
      this.clickedElements.set(element, true);
    }
  }

  const pageStateManager = new PageStateManager();

  class WalmartProductScraperV2 implements ProductScraper {
    async waitForElement(selector: string, timeout: number = 5000): Promise<Element | null> {
      console.log(`Waiting for element: ${selector}`);
      // First check if element exists immediately
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Found element immediately: ${selector}`);
        return element;
      }

      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            console.log(`Found element through observer: ${selector}`);
            observer.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        setTimeout(() => {
          observer.disconnect();
          const element = document.querySelector(selector);
          console.log(`Timeout reached for ${selector}, element found: ${!!element}`);
          resolve(element);
        }, timeout);
      });
    }

    getPageType(): string {
      const url = window.location.href;
      console.log("Checking Walmart page type for URL:", url);
      
      if (url.includes("/ip/")) return "product";
      if (url.includes("/search/")) return "search";
      if (url.includes("/cart/")) return "cart";
      if (url.includes("/lists/")) return "wishlist";
      if (url.includes("/browse/")) return "category";
      return "other";
    }

    isBotDetectionPage(): boolean {
      const hasChallenge = !!document.querySelector('form[action*="challenge"]');
      const hasRecaptcha = !!document.querySelector('.recaptcha-container');
      const hasVerification = !!document.querySelector('#px-captcha');
      const hasBlockedMessage = !!document.querySelector('.blocked-message');
      console.log("Bot detection check:", { hasChallenge, hasRecaptcha, hasVerification, hasBlockedMessage });
      return hasChallenge || hasRecaptcha || hasVerification || hasBlockedMessage;
    }

    canHandle(url: string): boolean {
      return url.includes("walmart.com");
    }

    async waitForBotDetection(maxAttempts: number = 10): Promise<void> {
      console.log("Waiting for bot detection to complete...");
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        if (!this.isBotDetectionPage()) {
          const productContent = document.querySelector('h1[itemprop="name"]') ||
                               document.querySelector('h1.w_iUH7') ||
                               document.querySelector('h1.f3') ||
                               document.querySelector('[data-testid="product-title"]') ||
                               document.querySelector('.prod-ProductTitle');
          
          if (productContent) {
            console.log("Bot detection passed, product content found");
            return;
          }
        }
        
        console.log(`Waiting for bot detection (attempt ${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 300));
        attempts++;
      }
      
      // Don't throw error, just proceed with scraping
      console.log("Bot detection check timed out, proceeding anyway");
    }

    async findTitle(): Promise<string> {
      console.log("Looking for Walmart product title");
      const selectors = [
        'h1[itemprop="name"]',
        'h1.w_iUH7',
        'h1.f3',
        '[data-testid="product-title"]',
        '.prod-ProductTitle',
        'h1.lh-copy'
      ];

      for (const selector of selectors) {
        const element = await this.waitForElement(selector);
        if (element?.textContent) {
          const title = element.textContent.trim();
          console.log("Found title:", title);
          return title;
        }
      }

      throw new Error("Could not find product title");
    }

    async findManufacturer(): Promise<string> {
      console.log("Looking for Walmart manufacturer/brand");
      
      // Save state before interactions
      pageStateManager.saveState();
      
      // Check for brand in the most common places first
      const quickSelectors = [
        '[data-testid="brand-name"]',
        '[data-testid="product-brand"]',
        '[itemprop="brand"]'
      ];

      for (const selector of quickSelectors) {
        const element = document.querySelector(selector);
        if (element?.textContent) {
          const brand = element.textContent.trim();
          console.log("Found brand:", brand);
          return brand;
        }
      }

      // Try to find "More details" button
      const moreDetailsButton = Array.from(document.querySelectorAll('button')).find(button => 
        button.textContent?.toLowerCase().includes('more details') ||
        button.textContent?.toLowerCase().includes('show more')
      );

      if (moreDetailsButton) {
        console.log("Found More details button, clicking...");
        if (moreDetailsButton instanceof HTMLElement) {
          pageStateManager.trackClick(moreDetailsButton);
          moreDetailsButton.click();
        }
        
        // Short wait for modal
        await new Promise(resolve => setTimeout(resolve, 500));

        // Quick check for brand in modal
        const modalBrand = document.querySelector('[data-testid="modal"] [data-testid="brand-name"]')?.textContent?.trim() ||
                         document.querySelector('[data-testid="modal"] [data-testid="product-brand"]')?.textContent?.trim();
        
        if (modalBrand) {
          console.log("Found brand in modal:", modalBrand);
          // Restore state before returning
          pageStateManager.restoreState();
          return modalBrand;
        }

        // Look in modal rows
        const rows = document.querySelectorAll('[data-testid="modal"] tr, [data-testid="specifications-table"] tr');
        for (const row of rows) {
          const text = row.textContent?.toLowerCase() || '';
          if (text.includes('brand') || text.includes('manufacturer')) {
            const matches = text.match(/(?:brand|manufacturer)[:\s]+([^,\n]+)/i);
            if (matches?.[1]) {
              const brand = matches[1].trim();
              console.log("Found brand in modal:", brand);
              // Restore state before returning
              pageStateManager.restoreState();
              return brand;
            }
          }
        }

        // Restore state if no brand found
        pageStateManager.restoreState();
      }

      // Use first word of title as last resort
      const title = await this.findTitle();
      const firstWord = title.split(' ')[0];
      if (firstWord && /^[A-Z]/.test(firstWord) && firstWord.length > 2) {
        console.log("Using first word of title as brand:", firstWord);
        return firstWord;
      }

      return "";
    }

    async findPrice(): Promise<{ price: string; currency: string }> {
      console.log("Looking for Walmart price");
      const selectors = [
        '[itemprop="price"]',
        '.price-characteristic',
        '[data-testid="price-wrap"]',
        '.prod-PriceHero',
        '[data-automation-id="product-price"]',
        'span[data-testid="price"]'
      ];

      for (const selector of selectors) {
        const element = await this.waitForElement(selector);
        if (element?.textContent) {
          const priceText = element.textContent.trim();
          const cleanPrice = priceText.replace(/[^0-9.,]/g, '');
          console.log("Found price:", cleanPrice);
          return { price: cleanPrice, currency: '$' };
        }
      }

      return { price: '', currency: '$' };
    }

    async findCountryOfOrigin(): Promise<string> {
      console.log("Looking for country of origin");
      const selectors = [
        '#product-overview',
        '#specifications',
        '.about-product',
        '.product-specifications',
        '[data-testid="product-description"]',
        '.product-description'
      ];

      for (const selector of selectors) {
        const element = await this.waitForElement(selector);
        if (element?.textContent) {
          const text = element.textContent.toLowerCase();
          const match = text.match(/(?:country of origin|made in|manufactured in)[:\s]+([^,\n.]+)/i);
          if (match?.[1]) {
            const country = match[1].trim();
            const formattedCountry = country
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            console.log("Found country of origin:", formattedCountry);
            return formattedCountry;
          }
        }
      }

      return "";
    }

    async scrapeProduct(): Promise<ProductData> {
      console.log("Starting Walmart product scrape");
      
      // Save initial page state
      pageStateManager.saveState();
      
      try {
        const pageType = this.getPageType();
        console.log("Page type:", pageType);
        
        if (pageType !== "product") {
          throw new Error("Not a product page");
        }

        // Quick bot detection check
        await this.waitForBotDetection(10);

        // Scrape all data in parallel
        const [title, manufacturer, { price, currency }, countryOfOrigin] = await Promise.all([
          this.findTitle(),
          this.findManufacturer(),
          this.findPrice(),
          this.findCountryOfOrigin()
        ]);

        const productData: ProductData = {
          title,
          manufacturer,
          countryOfOrigin,
          price,
          currency,
          url: window.location.href,
          website: "Walmart"
        };

        console.log("Scraped Walmart product data:", productData);
        return productData;
      } finally {
        // Always restore page state, even if scraping fails
        pageStateManager.restoreState();
      }
    }
  }

  // Initialize both scrapers
  const amazonScraper = new AmazonProductScraperV2();
  const walmartScraper = new WalmartProductScraperV2();

  // Get the appropriate scraper for the current URL
  function getScraperForUrl(url: string): ProductScraper {
    if (amazonScraper.canHandle(url)) {
      console.log('Using Amazon scraper');
      return amazonScraper;
    }
    if (walmartScraper.canHandle(url)) {
      console.log('Using Walmart scraper');
      return walmartScraper;
    }
    throw new Error('No suitable scraper found for URL');
  }

  // Run initial scrape for the current page
  async function runInitialScrape() {
    try {
      const currentUrl = window.location.href;
      console.log('Running initial scrape for URL:', currentUrl);
      
      // Check cache first
      const cachedData = await chrome.storage.local.get([currentUrl]);
      if (cachedData[currentUrl]) {
        console.log('Found cached data for initial load:', cachedData[currentUrl]);
        return;
      }

      const scraper = getScraperForUrl(currentUrl);
      const data = await scraper.scrapeProduct();
      
      // Cache the data
      await chrome.storage.local.set({ [currentUrl]: data });
      console.log('Initial scrape complete and cached:', data);
    } catch (error) {
      console.error('Error during initial scrape:', error);
    }
  }

  // Run initial scrape after a short delay to ensure page is loaded
  setTimeout(runInitialScrape, 2000);

  // Set up message listener
  console.log('Setting up message listener');
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);

    if (request.action === 'getProductData') {
      console.log('Checking cache for URL:', window.location.href);
      
      // Check cache first
      chrome.storage.local.get([window.location.href], async (result) => {
        try {
          if (result[window.location.href]) {
            console.log('Found cached data:', result[window.location.href]);
            sendResponse({ data: result[window.location.href] });
            return;
          }

          console.log('No cached data found, running scraper');
          const scraper = getScraperForUrl(window.location.href);
          const data = await scraper.scrapeProduct();
          console.log('Scraper returned data:', data);

          // Cache the data
          chrome.storage.local.set({ [window.location.href]: data }, () => {
            console.log('Data cached for URL:', window.location.href);
          });

          sendResponse({ data });
        } catch (error) {
          console.error('Error:', error);
          sendResponse({ error: error.message });
        }
      });

      return true; // Keep the message channel open for async response
    }
  });

  // Handle URL changes
  let lastUrl = window.location.href;

  // Watch for URL changes
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      console.log('URL changed from', lastUrl, 'to', window.location.href);
      lastUrl = window.location.href;
      
      // Check cache first on URL change
      chrome.storage.local.get([window.location.href], async (result) => {
        try {
          if (result[window.location.href]) {
            console.log('Found cached data for new URL:', result[window.location.href]);
            return;
          }

          console.log('No cached data found for new URL, running scraper');
          const scraper = getScraperForUrl(window.location.href);
          const data = await scraper.scrapeProduct();
          
          // Cache the data
          chrome.storage.local.set({ [window.location.href]: data }, () => {
            console.log('Data cached for new URL:', window.location.href);
          });
          
          console.log('New page scraped:', data);
        } catch (error) {
          console.error('Error scraping new page:', error);
        }
      });
    }
  });

  observer.observe(document, { subtree: true, childList: true });
  console.log('URL change observer setup complete');

})();