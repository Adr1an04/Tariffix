import { ProductData, Scraper, PageType } from '../types';

export class AmazonScraper implements Scraper {
  private getPageType(): PageType {
    const url = window.location.href;
    console.log('Checking page type for URL:', url);
    if (url.includes('/dp/') || url.includes('/gp/product/')) return 'product';
    if (url.includes('/s?')) return 'search';
    if (url.includes('/cart/')) return 'cart';
    if (url.includes('/wishlist/')) return 'wishlist';
    if (url.includes('/captcha/')) return 'captcha';
    if (url.includes('/stores/')) return 'category';
    return 'other';
  }

  private async waitForElement(selector: string, timeout = 15000): Promise<Element | null> {
    console.log(`Waiting for element: ${selector}`);
    const start = Date.now();
    
    return new Promise((resolve) => {
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          console.log(`Found element: ${selector}`);
          resolve(element);
          return;
        }
        
        if (Date.now() - start >= timeout) {
          console.log(`Timeout waiting for element: ${selector}`);
          resolve(null);
          return;
        }
        
        requestAnimationFrame(checkElement);
      };
      
      checkElement();
    });
  }

  private isCaptchaPage(): boolean {
    const isCaptcha = window.location.href.includes('/captcha/') || 
           document.title.toLowerCase().includes('robot check');
    console.log('Captcha check:', isCaptcha);
    return isCaptcha;
  }

  canHandle(url: string): boolean {
    return url.includes('amazon.com') || 
           url.includes('amazon.co');
  }

  private async findTitle(): Promise<string> {
    console.log('Looking for product title');
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
        console.log('Found title:', title);
        return title;
      }
    }

    throw new Error('Could not find product title');
  }

  private cleanManufacturerText(text: string): string {
    // Remove common prefixes and clean up the text
    const cleanText = text.replace(/^visit the|^by|^brand:|^manufacturer:/i, '').trim();
    // Remove "Store" suffix if present
    return cleanText.replace(/\s+store$/i, '').trim();
  }

  private async findManufacturer(): Promise<string> {
    console.log('Looking for manufacturer');
    
    // Try to find manufacturer from various sources
    const sources = [
      // Brand/Manufacturer specific elements
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
        process: (text) => this.cleanManufacturerText(text)
      },
      
      // Product details table
      {
        selectors: [
          '#productDetails_detailBullets_sections1 tr',
          '#detailBulletsWrapper_feature_div li',
          '#prodDetails .content li',
          '#detailBullets_feature_div li'
        ],
        process: (text) => {
          const lower = text.toLowerCase();
          if (lower.includes('brand') || lower.includes('manufacturer')) {
            const parts = text.split(':');
            return parts.length > 1 ? this.cleanManufacturerText(parts[1]) : '';
          }
          return '';
        }
      },
      
      // Technical details section
      {
        selectors: [
          '#technicalSpecifications_section_1 tr',
          '#technical-details tr',
          '#productDetails_techSpec_section_1 tr'
        ],
        process: (text) => {
          const lower = text.toLowerCase();
          if (lower.includes('brand') || lower.includes('manufacturer')) {
            const parts = text.split(/\s{2,}|\t/);
            return parts.length > 1 ? this.cleanManufacturerText(parts[parts.length - 1]) : '';
          }
          return '';
        }
      }
    ];

    // Try each source in order
    for (const source of sources) {
      for (const selector of source.selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          if (element?.textContent) {
            const processed = source.process(element.textContent);
            if (processed) {
              console.log('Found manufacturer:', processed, 'from selector:', selector);
              return processed;
            }
          }
        }
      }
    }

    // Try to extract from title as last resort
    const title = await this.findTitle();
    const commonBrands = ['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'];
    for (const brand of commonBrands) {
      if (title.includes(brand)) {
        console.log('Found manufacturer from title:', brand);
        return brand;
      }
    }

    console.log('No manufacturer found');
    return '';
  }

  private async findPrice(): Promise<{ price: string; currency: string }> {
    console.log('Looking for price');
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
        const currency = priceText.match(/[^0-9,.]/)?.[0] || 'USD';
        console.log('Found price:', priceText, 'currency:', currency);
        return { price: priceText, currency };
      }
    }

    console.log('No price found');
    return { price: '', currency: 'USD' };
  }

  async scrapeProduct(): Promise<ProductData> {
    console.log('Starting Amazon product scrape');
    
    if (this.isCaptchaPage()) {
      throw new Error('CAPTCHA page detected');
    }

    const pageType = this.getPageType();
    console.log('Page type:', pageType);
    
    if (pageType !== 'product') {
      throw new Error('Not a product page');
    }

    // Wait for product details to load
    console.log('Waiting for initial page load');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const manufacturer = await this.findManufacturer();
    const title = await this.findTitle();
    let countryOfOrigin = '';

    // Try to find country of origin
    console.log('Looking for country of origin');
    const detailsSelectors = [
      '#productDetails_detailBullets_sections1 tr',
      '#detailBulletsWrapper_feature_div li',
      '.product-facts-detail',
      '#prodDetails .content li',
      '.detail-bullet-list span',
      '#detailBullets_feature_div li',
      '#productDetails_db_sections tr',
      '.a-expander-content table tr'
    ];

    for (const selector of detailsSelectors) {
      const elements = document.querySelectorAll(selector);
      console.log(`Checking ${elements.length} elements for country of origin in ${selector}`);
      for (const element of elements) {
        const text = element.textContent?.toLowerCase() || '';
        if (text.includes('country of origin') || text.includes('country/region of origin')) {
          countryOfOrigin = text.split(':')[1]?.trim() || '';
          console.log('Found country of origin:', countryOfOrigin);
          break;
        }
      }
      if (countryOfOrigin) break;
    }

    const { price, currency } = await this.findPrice();

    const productData = {
      title,
      manufacturer,
      countryOfOrigin,
      price,
      currency,
      url: window.location.href,
      website: 'Amazon'
    };

    console.log('Scraped product data:', productData);
    return productData;
  }
} 