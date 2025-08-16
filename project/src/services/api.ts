const API_BASE_URL = 'http://localhost:8000';

export interface StoreAnalysisRequest {
  website_url: string;
}

export interface Product {
  id?: string;
  name: string;
  price: string;
  image?: string;
  description?: string;
  category?: string;
}

export interface ProductCatalog {
  total_products: number;
  categories: string[];
  price_range: { min: number; max: number };
  products: Product[];
}

export interface SocialHandles {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
}

export interface ContactDetails {
  emails: string[];
  phones: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ImportantLink {
  name: string;
  url: string;
}

export interface StoreInsights {
  url: string;
  product_catalog: ProductCatalog;
  hero_products: Product[];
  privacy_policy?: string;
  return_policy?: string;
  refund_policy?: string;
  faqs: FAQ[];
  social_handles: SocialHandles;
  contact_details: ContactDetails;
  brand_context?: string;
  important_links: ImportantLink[];
  analysis_date: string;
}

export interface Competitor {
  name: string;
  url: string;
  products: number;
  avg_price: number;
  rating: number;
  category: string;
  strengths: string[];
  weaknesses: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async analyzeStore(websiteUrl: string): Promise<StoreInsights> {
    const response = await fetch(`${this.baseUrl}/analyze-store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ website_url: websiteUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to analyze store');
    }

    return response.json();
  }

  async analyzeCompetitors(targetStoreUrl: string): Promise<{ competitors: Competitor[]; total_found: number }> {
    const response = await fetch(`${this.baseUrl}/analyze-competitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_store_url: targetStoreUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to analyze competitors');
    }

    return response.json();
  }

  async exportData(format: string, dataTypes: string[] = ['all']): Promise<any> {
    const response = await fetch(`${this.baseUrl}/export-data/${format}?data_types=${dataTypes.join(',')}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to export data');
    }

    return response.json();
  }

  async downloadFile(downloadUrl: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${downloadUrl}`);
    
    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  }
}

export const apiService = new ApiService();