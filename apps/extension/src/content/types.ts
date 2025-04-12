export interface ProductData {
  title: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  price?: string;
  currency?: string;
  url: string;
  website: string;
}

export interface Scraper {
  canHandle(url: string): boolean;
  scrapeProduct(): Promise<ProductData>;
}

export type PageType = 
  | 'product'
  | 'search'
  | 'captcha'
  | 'cart'
  | 'wishlist'
  | 'category'
  | 'other'; 