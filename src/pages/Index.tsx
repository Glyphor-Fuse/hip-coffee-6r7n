import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuShoppingBag, LuX, LuPlus, LuMinus, LuCheck } from 'react-icons/lu';
import { Reveal } from '@/components/motion/Reveal';
import { SignatureEffect } from '@/components/effects/SignatureEffect';
import { SignatureInteraction } from '@/components/effects/SignatureInteraction';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  description: string;
  isSignature?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Data ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nocturne Blend',
    price: 16.00,
    img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=2670&auto=format&fit=crop',
    description: 'Dark Chocolate, Molasses, Smoke',
    isSignature: true
  },
  {
    id: '2',
    name: 'Ethiopian Yirgacheffe',
    price: 19.00,
    img: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=2670&auto=format&fit=crop',
    description: 'Jasmine, Bergamot, Peach'
  },
  {
    id: '3',
    name: 'Colombia Huila',
    price: 17.50,
    img: 'https://images.unsplash.com/photo-1585644198539-75db25c04df4?q=80&w=2669&auto=format&fit=crop',
    description: 'Caramel, Red Apple, Citrus'
  }
];

export default function Index() {
  // --- State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- Styles ---
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-[#e5e5e5] font-sans overflow-x-hidden selection:bg-orange-900 selection:text-white min-h-screen">
      <style>{`
        :root {
          --bg-dark: #0a0a0a;
          --text-light: #e5e5e5;
          --accent-copper: #c88d65;
          --glass: rgba(255, 255, 255, 0.05);
        }
        .font-serif { font-family: 'Cinzel', serif; }
        .font-sans { font-family: 'Space Grotesk', sans-serif; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: var(--bg-dark);
        }
        ::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 3px;
        }

        @keyframes grain-shift {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -5%); }
            20% { transform: translate(-10%, 5%); }
            30% { transform: translate(5%, -10%); }
            40% { transform: translate(-5%, 15%); }
            50% { transform: translate(-10%, 5%); }
            60% { transform: translate(15%, 0); }
            70% { transform: translate(0, 10%); }
            80% { transform: translate(-15%, 0); }
            90% { transform: translate(10%, 5%); }
        }
        .animate-grain {
            animation: grain-shift 8s steps(10) infinite;
        }

        .hover-underline-animation {
            display: inline-block;
            position: relative;
        }
        .hover-underline-animation::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 1px;
            bottom: 0;
            left: 0;
            background-color: var(--accent-copper);
            transform-origin: bottom right;
            transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
        }
        .hover-underline-animation:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
        }
      `}</style>

      {/* Ambient Grain */}
      <SignatureEffect effect="grain" />

      {/* Navigation */}
      <nav className="fixed w-full z-40 top-0 left-0 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-xl tracking-widest font-bold uppercase font-serif cursor-pointer hover:text-orange-200 transition-colors duration-300">
          Nocturne.
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase">
            <a href="#shop" className="hover-underline-animation">Shop</a>
            <a href="#about" className="hover-underline-animation">Philosophy</a>
            <a href="#location" className="hover-underline-animation">Location</a>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative group"
          >
            <span className="text-xs uppercase tracking-widest group-hover:text-orange-200 transition-colors flex items-center gap-1">
              Cart ({cartCount})
            </span>
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.77, 0, 0.175, 1], duration: 0.5 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0f0f0f] z-50 border-l border-white/10 flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/10">
                <h2 className="text-2xl font-serif font-light text-white">Your Selection</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <LuX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/30">
                    <p className="uppercase tracking-widest text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 items-center bg-white/5 p-3 rounded border border-white/5"
                    >
                      <img src={item.img} className="w-16 h-16 object-cover rounded opacity-80" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="font-serif text-sm">{item.name}</h4>
                        <p className="text-xs text-white/50">£{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeItem(item.id)}
                          className="text-white/40 hover:text-white"
                        >
                          <LuMinus />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-white/40 hover:text-white"
                        >
                          <LuPlus />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-8 border-t border-white/10 bg-[#0f0f0f]">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-sm text-white/50 uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-serif">£{cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-white text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#c88d65] hover:text-white transition-colors duration-300">
                  Checkout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=3871&auto=format&fit=crop" 
            alt="Coffee texture" 
            className="w-full h-full object-cover opacity-40 scale-110 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
        </div>

        <SignatureInteraction type="parallax" className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[#c88d65] uppercase tracking-[0.4em] text-xs mb-6">Established in Shoreditch, 2018</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-8 text-white mix-blend-overlay font-serif">
              Darkness <br/> <span className="italic font-light text-white/80">Redefined</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/60 max-w-md mx-auto leading-relaxed text-sm md:text-base">
              Small-batch specialty coffee roasted in the heart of East London. 
              For those who find clarity in the depths of a cup.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12">
              <a href="#shop" className="inline-block border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
                Discover Blends
              </a>
            </div>
          </Reveal>
        </SignatureInteraction>
      </header>

      {/* Philosophy Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <Reveal variant="image" width="100%">
            <div className="w-full aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1511537632536-b7a48965ce4a?q=80&w=1548&auto=format&fit=crop" alt="Pour over coffee" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#c88d65] rounded-full blur-[80px] opacity-20"></div>
        </div>
        <div className="flex flex-col justify-center space-y-8">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              The Art of <br/><span className="text-[#c88d65]">Extraction.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-white/60 leading-relaxed">
              We believe coffee is more than a routine; it is a ritual. Sourcing beans from the highest altitude farms, we roast in small batches at our Shoreditch roastery to preserve the delicate, volatile aromatics that make each origin unique.
            </p>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <span className="block text-3xl font-serif mb-1">03</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Origins</span>
              </div>
              <div>
                <span className="block text-3xl font-serif mb-1">100%</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Arabica</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-32 bg-[#0f0f0f] relative">
        <div className="px-6 md:px-12 max-w-8xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-serif">Shop <span className="italic font-light text-white/40">Origins</span></h2>
            </Reveal>
            <div className="hidden md:block w-32 h-[1px] bg-white/20 mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.1}>
                <div 
                  className="group cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="relative aspect-[4/5] bg-[#1a1a1a] overflow-hidden mb-6">
                    <img 
                      src={product.img} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100 group-hover:scale-105" 
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                    <button className="absolute bottom-6 right-6 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#c88d65] hover:text-white">
                      <LuPlus className="w-5 h-5" />
                    </button>
                    {product.isSignature && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-white">Signature</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif">{product.name}</h3>
                      <p className="text-xs text-white/50 mt-1">{product.description}</p>
                    </div>
                    <span className="font-serif text-lg">£{product.price.toFixed(2)}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-32 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ 
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/London_street_map_1800.jpg/2048px-London_street_map_1800.jpg')",
            backgroundSize: 'cover',
            filter: 'grayscale(1) invert(1)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          <Reveal>
            <p className="uppercase tracking-[0.3em] text-[#c88d65] text-xs">Visit Us</p>
          </Reveal>
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-serif">142 Brick Lane</h2>
          </Reveal>
          <Reveal>
            <p className="text-xl md:text-2xl text-white/60 font-light">Shoreditch, London E1 6RU</p>
          </Reveal>
          <Reveal>
            <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-8 text-sm text-white/40">
              <div>
                <strong className="block text-white mb-2 uppercase tracking-widest">Mon - Fri</strong>
                07:00 — 18:00
              </div>
              <div>
                <strong className="block text-white mb-2 uppercase tracking-widest">Sat - Sun</strong>
                08:00 — 19:00
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h4 className="text-2xl font-serif mb-4">Nocturne.</h4>
            <p className="text-xs text-white/30 uppercase tracking-widest"> 2024 Nocturne Coffee London</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
}