declare global {
  interface Window {
    SimpleJekyllSearch: SimpleJekyllSearch;
    hljs_config: HljsConfig;
    useClipboard: boolean;
  }
}

export interface SearchResult {
  title: string;
  category: string;
  url: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export interface SimpleJekyllSearchOptions {
  searchInput: HTMLInputElement;
  resultsContainer: HTMLElement;
  json: string;
  searchResultTemplate: string;
  noResultsText?: string;
  limit?: number;
  fuzzy?: boolean;
  exclude?: string[];
}

export type SimpleJekyllSearch = (options: SimpleJekyllSearchOptions) => void;

// Config interface for highlight.js
interface HljsConfig {
  theme: string;
  lineNumbers: boolean;
  copyButton: boolean;
}
