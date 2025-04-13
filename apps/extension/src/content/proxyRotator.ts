export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export class ProxyRotator {
  private static instance: ProxyRotator;
  private currentIndex: number = 0;
  private proxies: ProxyConfig[] = [];

  private constructor() {
    // Initialize with some default proxies or load from storage
    this.loadProxies();
  }

  public static getInstance(): ProxyRotator {
    if (!ProxyRotator.instance) {
      ProxyRotator.instance = new ProxyRotator();
    }
    return ProxyRotator.instance;
  }

  private async loadProxies() {
    try {
      // Load proxies from chrome.storage.local
      const result = await chrome.storage.local.get('proxies');
      if (result.proxies) {
        this.proxies = result.proxies;
      }
    } catch (error) {
      console.error('Error loading proxies:', error);
    }
  }

  public async addProxy(proxy: ProxyConfig) {
    this.proxies.push(proxy);
    try {
      await chrome.storage.local.set({ proxies: this.proxies });
    } catch (error) {
      console.error('Error saving proxy:', error);
    }
  }

  public getNext(): ProxyConfig | null {
    if (this.proxies.length === 0) return null;
    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return proxy;
  }

  public getRandom(): ProxyConfig | null {
    if (this.proxies.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.proxies.length);
    return this.proxies[randomIndex];
  }
} 