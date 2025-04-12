import { Scraper } from '../types';
import { AmazonScraper } from './amazon';
import { WalmartScraper } from './walmart';

export class ScraperFactory {
  private static scrapers: Scraper[] = [
    new AmazonScraper(),
    new WalmartScraper(),
  ];

  static getScraper(url: string): Scraper | null {
    return this.scrapers.find(scraper => scraper.canHandle(url)) || null;
  }

  static registerScraper(scraper: Scraper) {
    this.scrapers.push(scraper);
  }
} 