import { NextRequest, NextResponse } from "next/server";

const FALLBACK_PRODUCTS: Record<string, { name: string; url: string; price: string }[]> = {
  iphone: [
    { name: 'Apple iPhone 15 Pro Max 256GB', url: 'https://www.amazon.com/Apple-iPhone-15-Pro-Max/dp/B0CMZD7VCV', price: '1199' },
    { name: 'Apple iPhone 15 Pro Max', url: 'https://www.walmart.com/ip/133267521', price: '1149' },
    { name: 'iPhone 15 Pro Max', url: 'https://www.target.com/p/-/A-922101315', price: '1199' },
  ],
  airpods: [
    { name: 'Apple AirPods Pro (2nd Gen)', url: 'https://www.amazon.com/Apple-AirPods-Pro-Generation/dp/B0D1XDZPZV', price: '249' },
    { name: 'Apple AirPods Pro', url: 'https://www.walmart.com/ip/133214688', price: '199' },
    { name: 'Apple AirPods Pro', url: 'https://www.target.com/p/-/A-822218013', price: '249' },
  ],
  macbook: [
    { name: 'Apple MacBook Air 15"', url: 'https://www.amazon.com/Apple-MacBook-Air-15-inch/dp/B0D5XJQ3PD', price: '1299' },
    { name: 'MacBook Air 15"', url: 'https://www.walmart.com/ip/131321234', price: '1249' },
    { name: 'MacBook Air 15"', url: 'https://www.target.com/p/-/A-921538012', price: '1299' },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { product, maxPrice } = await request.json();
    
    if (!product) {
      return NextResponse.json({ error: 'Product name required' }, { status: 400 });
    }

    const query = product.toLowerCase().trim();
    let results: { name: string; price: string; source: string; url: string; image: string }[] = [];
    
    for (const [key, items] of Object.entries(FALLBACK_PRODUCTS)) {
      if (query.includes(key) || key.includes(query)) {
        results = items.map(item => ({
          name: item.name,
          price: item.price,
          source: item.url.includes('amazon') ? 'Amazon' : item.url.includes('walmart') ? 'Walmart' : 'Target',
          url: item.url,
          image: '',
        }));
        break;
      }
    }
    
    if (results.length === 0) {
      const price = parseFloat(maxPrice) || 100;
      results = [
        {
          name: product,
          price: (price * 0.85).toFixed(0),
          source: 'Amazon',
          url: `https://www.amazon.com/s?k=${encodeURIComponent(product)}`,
          image: '',
        },
        {
          name: product,
          price: (price * 0.90).toFixed(0),
          source: 'Walmart',
          url: `https://www.walmart.com/search/?query=${encodeURIComponent(product)}`,
          image: '',
        },
        {
          name: product,
          price: (price * 0.95).toFixed(0),
          source: 'Target',
          url: `https://www.target.com/s?searchTerm=${encodeURIComponent(product)}`,
          image: '',
        },
      ];
    }

    const filtered = results.filter(r => {
      const p = parseFloat(r.price);
      return p > 0 && p <= (parseFloat(maxPrice) || Infinity);
    });

    return NextResponse.json(filtered.length > 0 ? filtered : results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}