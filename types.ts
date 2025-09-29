
export enum TrendCategory {
  ART = 'Art',
  CHARACTERS = 'Characters',
  POSTER = 'Poster',
  BACKGROUNDS = 'Backgrounds',
  FASHION = 'Fashion'
}

export interface Trend {
  id: string;
  name: string;
  description: string;
  prompt: string;
  exampleImage: string;
  category: TrendCategory;
}

export interface GeneratedImage {
  id: string;
  sourceImage: string; // base64
  generatedImage: string; // base64
  trendId: string;
  prompt: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
