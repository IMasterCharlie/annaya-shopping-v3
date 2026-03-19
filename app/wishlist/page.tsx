'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
  const { wishlist } = useApp();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    const ids = wishlist.join(',');
    fetch(`/api/products?ids=${ids}&limit=100`)
      .then(res => res.json())
      .then(data => {
        setItems(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="pb-32 bg-lavender-bg min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="py-20 text-center text-muted-text">Loading...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Heart size={32} className="text-royal-purple/20" />
            </div>
            <h2 className="text-xl font-serif font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-text text-sm mb-8">Save your favourite royal pieces to view them later.</p>
            <Link href="/shop" className="text-royal-purple font-bold underline underline-offset-4">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
