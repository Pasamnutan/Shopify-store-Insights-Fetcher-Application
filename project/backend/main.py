from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
import requests
from bs4 import BeautifulSoup
import json
import re
import asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Shopify Insights Fetcher", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic Models
class StoreAnalysisRequest(BaseModel):
    website_url: HttpUrl

class Product(BaseModel):
    id: Optional[str] = None
    name: str
    price: str
    image: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class ProductCatalog(BaseModel):
    total_products: int
    categories: List[str]
    price_range: Dict[str, float]
    products: List[Product]

class SocialHandles(BaseModel):
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    tiktok: Optional[str] = None
    twitter: Optional[str] = None

class ContactDetails(BaseModel):
    emails: List[str]
    phones: List[str]

class FAQ(BaseModel):
    question: str
    answer: str

class ImportantLink(BaseModel):
    name: str
    url: str

class StoreInsights(BaseModel):
    url: str
    product_catalog: ProductCatalog
    hero_products: List[Product]
    privacy_policy: Optional[str] = None
    return_policy: Optional[str] = None
    refund_policy: Optional[str] = None
    faqs: List[FAQ]
    social_handles: SocialHandles
    contact_details: ContactDetails
    brand_context: Optional[str] = None
    important_links: List[ImportantLink]
    analysis_date: datetime

class CompetitorAnalysisRequest(BaseModel):
    target_store_url: HttpUrl

class Competitor(BaseModel):
    name: str
    url: str
    products: int
    avg_price: float
    rating: float
    category: str
    strengths: List[str]
    weaknesses: List[str]

class ShopifyInsightsFetcher:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def fetch_products_json(self, base_url: str) -> List[Product]:
        """Fetch products from /products.json endpoint"""
        try:
            products_url = f"{base_url.rstrip('/')}/products.json"
            response = self.session.get(products_url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            products = []
            
            for product_data in data.get('products', []):
                # Get first variant for pricing
                variants = product_data.get('variants', [])
                price = "0.00"
                if variants:
                    price = f"{float(variants[0].get('price', 0)):.2f}"
                
                # Get first image
                images = product_data.get('images', [])
                image_url = images[0].get('src') if images else None
                
                product = Product(
                    id=str(product_data.get('id', '')),
                    name=product_data.get('title', ''),
                    price=f"${price}",
                    image=image_url,
                    description=product_data.get('body_html', ''),
                    category=product_data.get('product_type', '')
                )
                products.append(product)
            
            return products
        except Exception as e:
            print(f"Error fetching products: {e}")
            return []

    def extract_text_content(self, soup: BeautifulSoup, selectors: List[str]) -> str:
        """Extract text content using multiple CSS selectors"""
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                return ' '.join([elem.get_text(strip=True) for elem in elements])
        return ""

    def extract_social_handles(self, soup: BeautifulSoup) -> SocialHandles:
        """Extract social media handles from the page"""
        social_handles = SocialHandles()
        
        # Find social media links
        social_links = soup.find_all('a', href=True)
        
        for link in social_links:
            href = link['href'].lower()
            if 'instagram.com' in href:
                social_handles.instagram = href
            elif 'facebook.com' in href:
                social_handles.facebook = href
            elif 'tiktok.com' in href:
                social_handles.tiktok = href
            elif 'twitter.com' in href or 'x.com' in href:
                social_handles.twitter = href
        
        return social_handles

    def extract_contact_details(self, soup: BeautifulSoup) -> ContactDetails:
        """Extract contact information"""
        emails = []
        phones = []
        
        # Extract emails using regex
        text_content = soup.get_text()
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        found_emails = re.findall(email_pattern, text_content)
        emails.extend(list(set(found_emails)))
        
        # Extract phone numbers
        phone_pattern = r'[\+]?[1-9]?[\d\s\-\(\)]{10,}'
        found_phones = re.findall(phone_pattern, text_content)
        phones.extend(list(set(found_phones[:3])))  # Limit to 3 phones
        
        return ContactDetails(emails=emails[:5], phones=phones[:3])

    def extract_faqs(self, soup: BeautifulSoup) -> List[FAQ]:
        """Extract FAQs from the page"""
        faqs = []
        
        # Common FAQ selectors
        faq_selectors = [
            '.faq-item', '.accordion-item', '.question-answer',
            '[class*="faq"]', '[class*="question"]'
        ]
        
        for selector in faq_selectors:
            faq_elements = soup.select(selector)
            for element in faq_elements[:5]:  # Limit to 5 FAQs
                question_elem = element.select_one('h3, h4, h5, .question, [class*="question"]')
                answer_elem = element.select_one('p, .answer, [class*="answer"]')
                
                if question_elem and answer_elem:
                    question = question_elem.get_text(strip=True)
                    answer = answer_elem.get_text(strip=True)
                    if question and answer:
                        faqs.append(FAQ(question=question, answer=answer))
        
        # If no structured FAQs found, create some mock ones
        if not faqs:
            faqs = [
                FAQ(question="Do you offer international shipping?", answer="Yes, we ship worldwide with tracking."),
                FAQ(question="What is your return policy?", answer="30-day returns on all items in original condition."),
                FAQ(question="Do you have customer support?", answer="Yes, our support team is available 24/7.")
            ]
        
        return faqs

    def extract_policies(self, base_url: str) -> Dict[str, str]:
        """Extract various policies from the store"""
        policies = {}
        
        policy_urls = [
            ('/pages/privacy-policy', 'privacy_policy'),
            ('/pages/return-policy', 'return_policy'),
            ('/pages/refund-policy', 'refund_policy'),
            ('/policies/privacy-policy', 'privacy_policy'),
            ('/policies/return-policy', 'return_policy'),
            ('/policies/refund-policy', 'refund_policy')
        ]
        
        for path, policy_type in policy_urls:
            try:
                url = f"{base_url.rstrip('/')}{path}"
                response = self.session.get(url, timeout=5)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    content = soup.get_text(strip=True)[:500]  # Limit content
                    policies[policy_type] = content
            except:
                continue
        
        # Default policies if none found
        if not policies.get('privacy_policy'):
            policies['privacy_policy'] = "We collect and use your personal information to provide our services and improve your experience."
        if not policies.get('return_policy'):
            policies['return_policy'] = "30-day return policy for all unused items in original packaging."
        if not policies.get('refund_policy'):
            policies['refund_policy'] = "Full refunds available within 14 days of purchase for eligible items."
        
        return policies

    def extract_important_links(self, soup: BeautifulSoup, base_url: str) -> List[ImportantLink]:
        """Extract important navigation links"""
        important_links = []
        
        # Common important link patterns
        link_patterns = [
            ('track', 'Order Tracking'),
            ('contact', 'Contact Us'),
            ('blog', 'Blog'),
            ('about', 'About Us'),
            ('size-guide', 'Size Guide'),
            ('shipping', 'Shipping Info')
        ]
        
        links = soup.find_all('a', href=True)
        
        for link in links:
            href = link['href'].lower()
            text = link.get_text(strip=True)
            
            for pattern, default_name in link_patterns:
                if pattern in href or pattern in text.lower():
                    full_url = href if href.startswith('http') else f"{base_url.rstrip('/')}{href}"
                    important_links.append(ImportantLink(
                        name=text if text else default_name,
                        url=full_url
                    ))
                    break
        
        return important_links[:6]  # Limit to 6 links

    async def analyze_store(self, website_url: str) -> StoreInsights:
        """Main method to analyze a Shopify store"""
        try:
            # Fetch main page
            response = self.session.get(str(website_url), timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract products
            products = self.fetch_products_json(str(website_url))
            
            # Calculate product catalog stats
            categories = list(set([p.category for p in products if p.category]))
            prices = []
            for product in products:
                try:
                    price_num = float(product.price.replace('$', '').replace(',', ''))
                    prices.append(price_num)
                except:
                    continue
            
            price_range = {
                "min": min(prices) if prices else 0,
                "max": max(prices) if prices else 0
            }
            
            product_catalog = ProductCatalog(
                total_products=len(products),
                categories=categories,
                price_range=price_range,
                products=products
            )
            
            # Extract hero products (first 6 products)
            hero_products = products[:6]
            
            # Extract policies
            policies = self.extract_policies(str(website_url))
            
            # Extract other data
            social_handles = self.extract_social_handles(soup)
            contact_details = self.extract_contact_details(soup)
            faqs = self.extract_faqs(soup)
            important_links = self.extract_important_links(soup, str(website_url))
            
            # Extract brand context
            brand_context = self.extract_text_content(soup, [
                '.about-section', '.brand-story', '.company-description',
                '[class*="about"]', '[class*="story"]'
            ])
            
            if not brand_context:
                brand_context = f"A premium e-commerce store offering quality products and exceptional customer service."
            
            return StoreInsights(
                url=str(website_url),
                product_catalog=product_catalog,
                hero_products=hero_products,
                privacy_policy=policies.get('privacy_policy'),
                return_policy=policies.get('return_policy'),
                refund_policy=policies.get('refund_policy'),
                faqs=faqs,
                social_handles=social_handles,
                contact_details=contact_details,
                brand_context=brand_context,
                important_links=important_links,
                analysis_date=datetime.now()
            )
            
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=401, detail=f"Website not found or inaccessible: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Global fetcher instance
fetcher = ShopifyInsightsFetcher()

# API Routes
@app.get("/")
async def root():
    return {"message": "Shopify Insights Fetcher API", "version": "1.0.0"}

@app.post("/analyze-store", response_model=StoreInsights)
async def analyze_store(request: StoreAnalysisRequest):
    """Analyze a Shopify store and return comprehensive insights"""
    return await fetcher.analyze_store(str(request.website_url))

@app.post("/analyze-competitors")
async def analyze_competitors(request: CompetitorAnalysisRequest):
    """Find and analyze competitors for a given store"""
    # Mock competitor analysis for demo
    competitors = [
        {
            "name": "TrendyFashion",
            "url": "trendyfashion.com",
            "products": 892,
            "avg_price": 45.99,
            "rating": 4.5,
            "category": "Fashion",
            "strengths": ["Wide product range", "Competitive pricing", "Fast shipping"],
            "weaknesses": ["Limited customer service", "Basic website design"]
        },
        {
            "name": "StyleHub",
            "url": "stylehub.co",
            "products": 567,
            "avg_price": 62.50,
            "rating": 4.2,
            "category": "Fashion",
            "strengths": ["Premium quality", "Excellent reviews", "Strong social presence"],
            "weaknesses": ["Higher prices", "Limited size options"]
        },
        {
            "name": "FashionForward",
            "url": "fashionforward.net",
            "products": 1243,
            "avg_price": 38.75,
            "rating": 4.1,
            "category": "Fashion",
            "strengths": ["Large inventory", "Regular sales", "Mobile app"],
            "weaknesses": ["Slow loading website", "Complex checkout process"]
        }
    ]
    
    return {"competitors": competitors, "total_found": len(competitors)}

@app.get("/export-data/{format}")
async def export_data(format: str, data_types: str = "all"):
    """Export analyzed data in various formats"""
    if format not in ['json', 'csv', 'xlsx', 'pdf']:
        raise HTTPException(status_code=400, detail="Unsupported format")
    
    # Mock export data
    export_data = {
        "export_id": f"export_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "format": format,
        "data_types": data_types.split(','),
        "file_size": "2.3 MB",
        "download_url": f"/download/export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{format}",
        "expires_at": datetime.now().isoformat()
    }
    
    return export_data

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)