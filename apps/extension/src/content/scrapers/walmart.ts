import { ProductData, Scraper, PageType } from '../types';

export class WalmartScraper implements Scraper {
  private getPageType(): PageType {
    const url = window.location.href;
    if (url.includes('/ip/')) return 'product';
    if (url.includes('/search/')) return 'search';
    if (url.includes('/cart/')) return 'cart';
    if (url.includes('/lists/')) return 'wishlist';
    if (url.includes('/browse/')) return 'category';
    return 'other';
  }

  private async waitForElement(selector: string, timeout = 15000): Promise<Element | null> {
    return new Promise((resolve) => {
      // First check if element already exists
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      // Set up mutation observer to watch for element
      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      // Set timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }, timeout);
    });
  }

  private async waitForBot(): Promise<void> {
    // Wait for bot check to complete
    return new Promise((resolve) => {
      const checkForBot = () => {
        const botCheck = document.querySelector('form[action*="challenge"]');
        const content = document.querySelector('[data-testid="product-title"]') || 
                       document.querySelector('.prod-ProductTitle') ||
                       document.querySelector('h1.f3');
        
        if (!botCheck && content) {
          resolve();
        } else {
          setTimeout(checkForBot, 500);
        }
      };
      
      checkForBot();
    });
  }

  canHandle(url: string): boolean {
    return url.includes('walmart.com');
  }

  private async findTitle(): Promise<string> {
    const selectors = [
      'h1.f3',
      'h1[itemprop="name"]',
      '[data-testid="product-title"]',
      '.prod-ProductTitle',
      '[data-automation-id="product-title"]',
      'h1.w_Y_nW'
    ];

    for (const selector of selectors) {
      const element = await this.waitForElement(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }

    throw new Error('Could not find product title');
  }

  private async findManufacturer(): Promise<string> {
    const selectors = [
      '[data-testid="product-brand"]',
      '.prod-brandName',
      '[itemprop="brand"]',
      '.b-product_brand',
      '.w_DuWw'
    ];

    for (const selector of selectors) {
      const element = await this.waitForElement(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }

    return '';
  }

  private async findPrice(): Promise<{ price: string; currency: string }> {
    const selectors = [
      '[data-testid="price-wrap"] [itemprop="price"]',
      '.price-characteristic',
      '.prod-PriceHero',
      '[data-automation-id="product-price"]',
      '.price-group',
      'span[itemprop="price"]',
      '.w_PaWw'
    ];

    for (const selector of selectors) {
      const element = await this.waitForElement(selector);
      if (element?.textContent) {
        const priceText = element.textContent.trim();
        return { price: priceText, currency: 'USD' };
      }
    }

    return { price: '', currency: 'USD' };
  }

  private async findCountryOfOrigin(): Promise<string> {
    const selectors = [
      '#product-overview',
      '#specifications',
      '.about-product',
      '.product-specifications',
      '[data-testid="product-description"]'
    ];

    for (const selector of selectors) {
      const container = await this.waitForElement(selector);
      if (container) {
        const text = container.textContent?.toLowerCase() || '';
        const match = text.match(/(?:country of origin|made in)[:\s]+([^,\n.]+)/i);
        if (match?.[1]) {
          return match[1].trim();
        }
      }
    }

    return '';
  }

  async scrapeProduct(): Promise<ProductData> {
    if (this.getPageType() !== 'product') {
      throw new Error('Not a product page');
    }

    try {
      // Wait for bot check to complete
      await this.waitForBot();

      // Wait for initial page load
      await new Promise(resolve => setTimeout(resolve, 2000));

      const title = await this.findTitle();
      const manufacturer = await this.findManufacturer();
      const { price, currency } = await this.findPrice();
      const countryOfOrigin = await this.findCountryOfOrigin();

      return {
        title,
        manufacturer,
        countryOfOrigin,
        price,
        currency,
        url: window.location.href,
        website: 'Walmart'
      };
    } catch (error) {
      console.error('Error scraping Walmart product:', error);
      throw error;
    }
  }
} 