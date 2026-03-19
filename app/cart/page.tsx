'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getImage } from '@/types';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const router = useRouter();

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;



  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <div className="w-24 h-24 bg-lavender-bg rounded-full flex items-center justify-center mb-6">
        <ShoppingBag size={40} className="text-royal-purple/30" />
      </div>
      <h2 className="text-2xl font-serif font-bold mb-2">Your bag is empty</h2>
      <p className="text-muted-text text-sm mb-8">Looks like you haven't added any royal pieces yet.</p>
      <Link href="/shop" className="bg-royal-purple text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-royal-purple/20">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="pb-40 bg-lavender-bg min-h-screen">
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Shopping Bag</h1>

        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={`${item.id}-${item.selectedSize}`}
                layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm border border-luxury-border">
                <div className="relative w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={getImage(item)} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-bold text-sm pr-2">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-muted-text hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-text mt-1">
                      Size: <span className="text-royal-purple font-bold">{item.selectedSize}</span>
                      {item.selectedColor && <> · <span className="text-royal-purple font-bold">{item.selectedColor}</span></>}
                    </p>
                    <p className="text-royal-purple font-bold mt-2">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-lavender-bg px-3 py-1.5 rounded-xl">
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="text-royal-purple"><Minus size={16} /></button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="text-royal-purple"><Plus size={16} /></button>
                    </div>
                    <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-10 bg-white rounded-3xl p-6 shadow-sm border border-luxury-border">
          <h3 className="text-lg font-serif font-bold mb-6">Order Summary</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-text">Subtotal</span>
              <span className="font-bold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="h-px bg-luxury-border my-1" />
            <div className="flex justify-between text-lg">
              <span className="font-serif font-bold">Total</span>
              <span className="font-bold text-royal-purple">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 glass p-4 pb-8 border-t border-luxury-border flex flex-col gap-3">
        <button onClick={() => router.push('/checkout')}
          className="w-full bg-[#25D366] text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-3 active:scale-95 transition-transform">
          <MessageCircle size={22} /> Buy on WhatsApp <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
