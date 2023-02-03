import { ShortenedLink } from './interfaces/ShortenedLink';

export default class Storage {
  private storageKey: string;
  private shortenedLinks: ShortenedLink[] = [];

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.shortenedLinks = this.loadShortenedLinks();
  }

  getShortenedLinks(): ShortenedLink[] {
    return this.shortenedLinks.slice(0);
  }

  addShortenedLink(shortenedLink: ShortenedLink): ShortenedLink[] {
    this.shortenedLinks.unshift(shortenedLink);
    this.save();
    return this.getShortenedLinks();
  }

  removeShortenedLink(targetId: string): ShortenedLink[] {
    this.shortenedLinks = this.shortenedLinks.filter(
      ({ id }) => id !== targetId
    );
    this.save();
    return this.getShortenedLinks();
  }

  private loadShortenedLinks(): ShortenedLink[] {
    const savedItem = localStorage.getItem(this.storageKey);
    if (!savedItem) {
      return [];
    }
    return JSON.parse(savedItem) as ShortenedLink[];
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.shortenedLinks));
  }
}
