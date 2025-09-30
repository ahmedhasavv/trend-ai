export enum TrendCategory {
  FASHION = 'Fashion',
  ART = 'Art',
  NATURE = 'Nature',
  FUTURISTIC = 'Futuristic',
  VINTAGE = 'Vintage',
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
  sourceImage: string;
  generatedImage: string;
  trendId: string;
  prompt: string;
  timestamp: number;
}

export interface User {
  id: string;
  email: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
}
