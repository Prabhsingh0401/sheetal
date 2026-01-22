// app/product/[id]/page.tsx
import { Metadata } from 'next';
import ProductDetailClient from '../components/ProductDetailClient';
import { fetchProductBySlug } from '../../services/productService';
import { getApiImageUrl } from '../../services/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  try {
    const res = await fetchProductBySlug(slug);
    
    if (!res.success || !res.data) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const product = res.data;

    const title = product.metaTitle || `${product.name} | Your Store Name`;
    const description = product.metaDescription || product.shortDescription || product.description?.substring(0, 160);
    const keywords = product.metaKeywords || `${product.name}, ${product.category?.name}, buy ${product.name}`;
    
    const imageUrl = product.ogImage 
      ? getApiImageUrl(product.ogImage)
      : getApiImageUrl(product.mainImage?.url);

    const canonicalUrl = product.canonicalUrl || `https://yourdomain.com/product/${slug}`;

    const price = product.discountPrice && product.discountPrice > 0 
      ? product.discountPrice 
      : product.price;

    return {
      title,
      description,
      keywords,
      
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.mainImage?.alt || product.name,
          },
        ],
        type: 'website',
        url: canonicalUrl,
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },

      alternates: {
        canonical: canonicalUrl,
      },

      robots: {
        index: product.status === 'Active' && product.isActive,
        follow: true,
      },

      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': 'INR',
        'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': product.brandInfo || 'Your Brand',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Your Store Name',
      description: 'Shop our latest products',
    };
  }
}

// Main page component (Server Component)
export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Fetch product data for structured data
  let product = null;
  try {
    const res = await fetchProductBySlug(slug);
    if (res.success && res.data) {
      product = res.data;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  // Calculate price for schema
  const price = product?.discountPrice && product.discountPrice > 0 
    ? product.discountPrice 
    : product?.price;

  // Generate JSON-LD structured data for Google
  const structuredData = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: getApiImageUrl(product.mainImage?.url),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brandInfo || 'Your Brand Name',
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'INR',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `https://yourdomain.com/product/${slug}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    },
    aggregateRating: product.totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.totalReviews,
    } : undefined,
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      <ProductDetailClient slug={slug} />
    </>
  );
}