'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Product Data
const volumes = [
  {
    id: 1,
    title: 'Volume 1: The Awakening',
    price: 199,
    originalPrice: 299,
    image: '/images/volumes/vol1.jpg',
    description: 'Begin the epic journey of dharma and destiny.',
    type: 'digital'
  },
  {
    id: 2,
    title: 'Volume 2: The Rising Storm',
    price: 249,
    originalPrice: 349,
    image: '/images/volumes/vol2.jpg',
    description: 'The conflict intensifies as heroes emerge.',
    type: 'digital'
  },
  {
    id: 3,
    title: 'Volume 3: The Divine War',
    price: 299,
    originalPrice: 399,
    image: '/images/volumes/vol3.jpg',
    description: 'Witness the ultimate battle between good and evil.',
    type: 'digital'
  },
  {
    id: 4,
    title: 'Complete Collection',
    price: 499,
    originalPrice: 899,
    image: '/images/volumes/collection.jpg',
    description: 'All volumes in one epic bundle. Best value!',
    type: 'digital',
    badge: 'Best Value'
  }
];

const merchandise = [
  {
    id: 101,
    title: 'Dharma Warrior T-Shirt',
    price: 599,
    originalPrice: 799,
    image: '/images/merch/tshirt1.jpg',
    description: 'Premium cotton t-shirt with epic warrior print.',
    type: 'physical',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 102,
    title: 'The Saga Logo T-Shirt',
    price: 549,
    originalPrice: 699,
    image: '/images/merch/tshirt2.jpg',
    description: 'Classic logo design on comfortable fabric.',
    type: 'physical',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 103,
    title: 'Divine Fire T-Shirt',
    price: 649,
    originalPrice: 849,
    image: '/images/merch/tshirt3.jpg',
    description: 'Limited edition fire-themed design.',
    type: 'physical',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Limited'
  },
  {
    id: 104,
    title: 'Ice & Fire Combo Pack',
    price: 999,
    originalPrice: 1499,
    image: '/images/merch/combo.jpg',
    description: '2 premium t-shirts at special price.',
    type: 'physical',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Combo'
  }
];

const freeDownloads = [
  {
    id: 201,
    title: 'Warrior Mobile Wallpaper',
    image: '/images/wallpapers/warrior.jpg',
    description: 'Epic warrior wallpaper for your phone.',
    downloadUrl: '/downloads/wallpaper-warrior.jpg'
  },
  {
    id: 202,
    title: 'Divine Light Wallpaper',
    image: '/images/wallpapers/divine.jpg',
    description: 'Stunning divine theme wallpaper.',
    downloadUrl: '/downloads/wallpaper-divine.jpg'
  },
  {
    id: 203,
    title: 'The Saga Logo Wallpaper',
    image: '/images/wallpapers/logo.jpg',
    description: 'Official logo wallpaper.',
    downloadUrl: '/downloads/wallpaper-logo.jpg'
  },
  {
    id: 204,
    title: 'Fire & Ice Wallpaper',
    image: '/images/wallpapers/fireice.jpg',
    description: 'Stunning dual-element design.',
    downloadUrl: '/downloads/wallpaper-fireice.jpg'
  }
];

// Icons
const ShoppingBagIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Product Card Component
function ProductCard({ product, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || null);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-all duration-300"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          <span className="text-4xl">{product.type === 'digital' ? '📖' : '👕'}</span>
        </div>
        {product.badge && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-green-500/90 text-white text-xs font-bold rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {product.sizes && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Select Size:</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                    selectedSize === size
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gradient-fire">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart({ ...product, selectedSize })}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <ShoppingBagIcon />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Free Download Card Component
function FreeDownloadCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
    >
      <div className="relative h-40 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-cyan-500/50">
          <span className="text-4xl">🖼️</span>
        </div>
        <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
          FREE
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {item.description}
        </p>
        <a
          href={item.downloadUrl}
          download
          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 font-semibold text-sm flex items-center justify-center gap-2 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
        >
          <DownloadIcon />
          Download Free
        </a>
      </div>
    </motion.div>
  );
}

// Cart Sidebar Component
function CartSidebar({ isOpen, onClose, items, onRemoveItem, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBagIcon />
                Your Cart ({items.length})
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🛒</span>
                  <p className="text-gray-400">Your cart is empty</p>
                  <button onClick={onClose} className="mt-4 text-orange-400 hover:text-orange-300 font-medium">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="glass rounded-xl p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl">
                        {item.type === 'digital' ? '📖' : '👕'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{item.title}</h3>
                        {item.selectedSize && (
                          <p className="text-gray-500 text-xs">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-orange-400 font-bold mt-1">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold text-gradient-fire">₹{total}</span>
                </div>
                <button onClick={onCheckout} className="w-full btn-primary py-3 text-lg">
                  Proceed to Checkout
                </button>
                <p className="text-center text-gray-500 text-xs mt-3">
                  Secure payment via Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Main Shop Page
export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('volumes');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Checkout: ₹${total}\n\nRazorpay integration coming soon!`);
  };

  const tabs = [
    { id: 'volumes', label: 'Volumes', icon: '📚' },
    { id: 'merch', label: 'Merchandise', icon: '👕' },
    { id: 'free', label: 'Free Downloads', icon: '🎁' }
  ];

  return (
    <main className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-fire">Shop</span>
              <span className="text-white"> The Saga</span>
            </h1>
            <p className="text-xl text-gray-400">
              Get exclusive volumes, merchandise, and free wallpapers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Button (Fixed) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 btn-primary p-4 rounded-full shadow-lg shadow-orange-500/25 flex items-center gap-2"
      >
        <ShoppingBagIcon />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
            {cart.length}
          </span>
        )}
      </button>

      {/* Tabs */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="flex justify-center">
          <div className="glass rounded-2xl p-2 inline-flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {activeTab === 'volumes' && (
            <motion.div
              key="volumes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {volumes.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </motion.div>
          )}

          {activeTab === 'merch' && (
            <motion.div
              key="merch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {merchandise.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </motion.div>
          )}

          {activeTab === 'free' && (
            <motion.div
              key="free"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Free Mobile Wallpapers</h2>
                <p className="text-gray-400">Download beautiful wallpapers for your phone - completely free!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {freeDownloads.map((item) => (
                  <FreeDownloadCard key={item.id} item={item} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Powered by Razorpay' },
            { icon: '💬', title: '24/7 Support', desc: 'We are here to help' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <span className="text-4xl mb-3 block">{feature.icon}</span>
              <h3 className="text-white font-bold mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </main>
  );
}
