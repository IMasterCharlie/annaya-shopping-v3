import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 px-4 md:px-12 bg-lavender-bg border-t border-luxury-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="text-3xl font-serif font-bold text-royal-purple mb-6">ANNAYA</div>
          <p className="text-muted-text text-sm leading-relaxed mb-6">Redefining royal elegance for the modern woman.</p>
          <div className="flex flex-col gap-2">
            <a href="tel:+918309664356" className="text-sm text-primary-text hover:text-royal-purple transition-colors flex items-center gap-2">
              <span className="font-bold">Phone:</span> +91 98765 43210
            </a>
            <a href="https://wa.me/918309664356" target="_blank" rel="noreferrer" className="text-sm text-primary-text hover:text-royal-purple transition-colors flex items-center gap-2">
              <span className="font-bold">WhatsApp:</span> +91 98765 43210
            </a>
            <a href="mailto:contact@annayaboutique.com" className="text-sm text-primary-text hover:text-royal-purple transition-colors flex items-center gap-2">
              <span className="font-bold">Email:</span> contact@annayaboutique.com
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-text">Shop</span>
          <Link href="/shop" className="text-sm hover:text-royal-purple transition-colors">New Arrivals</Link>
          <Link href="/shop" className="text-sm hover:text-royal-purple transition-colors">Best Sellers</Link>
          <Link href="/shop" className="text-sm hover:text-royal-purple transition-colors">Collections</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-text">Help</span>
          <Link href="/about" className="text-sm hover:text-royal-purple transition-colors">Our Story</Link>
          <Link href="/contact" className="text-sm hover:text-royal-purple transition-colors">Contact Us</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-text">Follow</span>
          <a href="https://instagram.com/annayaboutique" target="_blank" rel="noreferrer" className="text-sm hover:text-royal-purple transition-colors">Instagram</a>
          <a href="https://facebook.com/annayaboutique" target="_blank" rel="noreferrer" className="text-sm hover:text-royal-purple transition-colors">Facebook</a>
          <a href="https://pinterest.com/annayaboutique" target="_blank" rel="noreferrer" className="text-sm hover:text-royal-purple transition-colors">Pinterest</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-luxury-border">
        <p className="text-xs text-muted-text text-center">© {new Date().getFullYear()} Annaya Boutique. All Rights Reserved.</p>
        <p className="text-xs text-muted-text text-center">Developed by <a href="https://github.com/IMasterCharlie" target="_blank" rel="noreferrer" className="text-sm hover:text-royal-purple transition-colors">Mohammed Mehraj</a></p>
      </div>
    </footer>
  );
}
