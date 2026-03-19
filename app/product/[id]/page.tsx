'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, ChevronLeft, Share2, Minus, Plus, ShoppingBag, ChevronRight, Star, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useEffect } from 'react';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Product[]>([]);

  const [selSize, setSelSize] = useState('');
  const [selColor, setSelColor] = useState('');
  const [activeImg, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('Description');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      if (!selSize) setSelSize(product.sizes[0] || '');
      if (!selColor) setSelColor(product.colors[0]?.name || '');

      fetch(`/api/products?category=${encodeURIComponent(product.category)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setRelated(data.products?.filter((p: Product) => p.id !== product.id).slice(0, 4) || []);
        });
    }
  }, [product]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 rounded-full border-4 border-royal-purple/20 border-t-royal-purple animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-text">Product not found.</p>
    </div>
  );

  const wishlisted = isWishlisted(product.id);

  const handleWhatsAppOrder = async () => {
    if (product) {
      await addToCart(product, selSize, selColor, qty);
      router.push('/checkout');
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, selSize, selColor, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="pb-40 bg-white min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 pointer-events-none">
        <button onClick={() => router.back()} className="p-3 rounded-full glass pointer-events-auto">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="p-3 rounded-full glass"><Share2 size={20} /></button>
          <button onClick={() => toggleWishlist(product.id)} className="p-3 rounded-full glass">
            <Heart size={20} fill={wishlisted ? '#5A2D82' : 'none'} className={wishlisted ? 'text-royal-purple' : ''} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:pt-12 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

          {/* Gallery */}
          <section className="w-full md:w-1/2">
            <div className="relative aspect-[3/4] overflow-hidden md:rounded-[40px] shadow-2xl">
              <Image src={product.images?.[activeImg] || product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'} alt={product.name}
                fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
              {product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-royal-purple text-white text-xs px-3 py-1.5 rounded-full font-bold z-10">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4 px-4 md:px-0">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImg(i)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-royal-purple' : 'border-transparent'}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Info */}
          <section className="p-6 md:p-0 md:w-1/2 flex flex-col gap-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-royal-purple text-sm font-bold uppercase tracking-[0.2em]">{product.category}</span>
                <div className="hidden md:flex gap-3">
                  <button className="p-3 rounded-full bg-lavender-bg hover:text-royal-purple transition-colors"><Share2 size={20} /></button>
                  <button onClick={() => toggleWishlist(product.id)} className="p-3 rounded-full bg-lavender-bg">
                    <Heart size={20} fill={wishlisted ? '#5A2D82' : 'none'} className={wishlisted ? 'text-royal-purple' : ''} />
                  </button>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">{product.name}</h1>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                  ))}</div>
                  <span className="text-sm text-muted-text">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-royal-purple">₹{product.price.toLocaleString()}</p>
                {product.originalPrice > product.price && (
                  <p className="text-xl text-muted-text line-through">₹{product.originalPrice.toLocaleString()}</p>
                )}
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${product.stock <= 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Color */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-text mb-4">
                  Color — <span className="text-primary-text">{selColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map(c => (
                    <button key={c.name} onClick={() => setSelColor(c.name)} title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${selColor === c.name ? 'border-royal-purple scale-110' : 'border-transparent'}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-text">Select Size</h3>
                <button className="text-xs text-royal-purple underline font-bold">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelSize(size)}
                    className={`min-w-[60px] h-14 rounded-2xl border-2 transition-all font-bold text-sm ${selSize === size ? 'bg-royal-purple border-royal-purple text-white shadow-xl shadow-royal-purple/20' : 'border-luxury-border hover:border-royal-purple/30'
                      }`}>{size}</button>
                ))}
              </div>
            </div>

            {/* Qty + Actions (Desktop) */}
            <div className="hidden md:flex flex-col gap-6">
              <div className="flex items-center gap-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-text">Quantity</h3>
                <div className="flex items-center gap-6 bg-lavender-bg px-6 py-3 rounded-2xl">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 text-royal-purple hover:scale-125 transition-transform"><Minus size={20} /></button>
                  <span className="font-bold text-xl min-w-[28px] text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="p-2 text-royal-purple hover:scale-125 transition-transform"><Plus size={20} /></button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleAddToCart}
                  className={`flex-1 h-16 rounded-2xl font-bold text-lg shadow-xl hover:bg-deep-purple transition-all active:scale-95 ${added ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-royal-purple text-white shadow-royal-purple/20'}`}>
                  {added ? 'Added to Bag!' : 'Add to Bag'}
                </button>
                <button onClick={handleWhatsAppOrder}
                  className="flex-1 h-16 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all active:scale-95 flex items-center justify-center shadow-xl shadow-[#25D366]/20">
                  <MessageCircle size={22} className="mr-2" /> Buy on WhatsApp
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-luxury-border pt-6">
              {['Description', 'Fabric & Care', 'Delivery'].map(t => (
                <div key={t} className="border-b border-luxury-border py-5">
                  <button onClick={() => setTab(tab === t ? '' : t)}
                    className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-widest">
                    {t}<ChevronRight size={20} className={`transition-transform duration-300 ${tab === t ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {tab === t && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="text-base text-muted-text leading-relaxed pt-4">
                          {t === 'Description' ? product.description
                            : t === 'Fabric & Care' ? 'Premium quality fabric. Hand-crafted with care. Dry clean recommended.'
                              : 'Standard delivery 5–7 business days. Enjoy free shipping on all orders.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Related */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12">Style With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {related.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass p-4 pb-6 border-t border-luxury-border flex flex-col gap-3">
        <div className="flex gap-3">
          <button onClick={handleAddToCart}
            className={`w-full h-12 rounded-2xl border-2 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm ${added ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'border-royal-purple text-royal-purple'}`}>
            <ShoppingBag size={18} /> {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
        <button onClick={handleWhatsAppOrder}
          className="w-full h-12 rounded-2xl bg-[#25D366] text-white font-bold shadow-lg shadow-[#25D366]/20 active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm">
          <MessageCircle size={18} /> Buy on WhatsApp
        </button>
      </div>
    </div>
  );
}
