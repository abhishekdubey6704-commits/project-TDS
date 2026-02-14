'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { volumesApi, productsApi, purchasesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// Content Type Cards
const contentTypeInfo = {
  COMIC: {
    name: 'Kid Comics',
    description: 'Colorful illustrated story experience for young readers',
    icon: '🎨',
    color: 'from-pink-500 to-purple-600',
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
  },
  ANIME: {
    name: 'Anime Video',
    description: 'Animated episodes with full voice acting and music',
    icon: '🎬',
    color: 'from-purple-500 to-blue-600',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
  },
  EBOOK: {
    name: 'Complete Ebook',
    description: 'Full novel experience with detailed narrative',
    icon: '📚',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
  },
};

const PurchaseCard = ({ product, onPurchase, userAccess, loading }) => {
  const info = contentTypeInfo[product.contentType] || contentTypeInfo.EBOOK;
  const hasAccess = userAccess?.includes(product.contentType);
  const discount = product.originalPrice > product.price 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className={`relative rounded-2xl border border-stone-700 overflow-hidden bg-gradient-to-br ${info.color} p-[1px]`}>
      <div className="bg-stone-900/95 rounded-2xl p-6 h-full">
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        
        <div className="text-4xl mb-4">{info.icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{info.name}</h3>
        <p className="text-stone-400 text-sm mb-4">{info.description}</p>
        
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-2xl font-bold text-white">
            {product.currency === 'INR' ? '₹' : '$'}{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-stone-500 line-through">
              {product.currency === 'INR' ? '₹' : '$'}{product.originalPrice}
            </span>
          )}
        </div>
        
        {hasAccess ? (
          <Link
            href={`/volumes/${product.volumeId}/read/${product.contentType.toLowerCase()}`}
            className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition"
          >
            ✓ Access Content
          </Link>
        ) : (
          <button
            onClick={() => onPurchase(product)}
            disabled={loading}
            className={`w-full bg-gradient-to-r ${info.color} hover:opacity-90 text-white py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50`}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        )}
      </div>
    </div>
  );
};

// Mock data fallback
const mockVolumeData = {
  1: {
    volumeNumber: 1,
    roman: 'I',
    title: 'THE FALL OF SINDH',
    subtitle: 'Raja Dahir | Arab Invasion | 712 CE',
    description: 'The year is 712 CE. The mighty kingdom of Sindh faces its darkest hour as Arab forces under Muhammad bin Qasim cross the Indus.',
    gradient: 'from-orange-600 to-red-800',
    episodes: [
      { id: 1, title: 'The Storm Approaches', duration: '15', status: 'free' },
      { id: 2, title: 'Shadows of Debal', duration: '18', status: 'free' },
      { id: 3, title: 'The Siege Begins', duration: '20', status: 'premium' },
    ],
  },
};

export default function VolumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  
  const volumeId = params.volumeId;
  
  const [volume, setVolume] = useState(null);
  const [products, setProducts] = useState([]);
  const [userAccess, setUserAccess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadVolumeData();
  }, [volumeId]);

  const loadVolumeData = async () => {
    try {
      setLoading(true);
      const [volumeRes, productsRes] = await Promise.all([
        volumesApi.getById(volumeId).catch(() => null),
        productsApi.getByVolume(volumeId).catch(() => ({ data: { data: [] } })),
      ]);

      // Use API data or fallback to mock
      const apiVolume = volumeRes?.data?.data || volumeRes?.data;
      setVolume(apiVolume || mockVolumeData[volumeId] || mockVolumeData[1]);
      setProducts(productsRes.data.data || []);

      // Check user access for each content type
      if (token) {
        const accessChecks = await Promise.all(
          ['COMIC', 'ANIME', 'EBOOK'].map(async (type) => {
            try {
              const res = await purchasesApi.checkAccess(volumeId, type);
              return res.data.data ? type : null;
            } catch {
              return null;
            }
          })
        );
        setUserAccess(accessChecks.filter(Boolean));
      }
    } catch (err) {
      console.error('Failed to load volume:', err);
      setVolume(mockVolumeData[volumeId] || mockVolumeData[1]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product) => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setPurchasing(true);
    try {
      const orderRes = await purchasesApi.create(product.id, user?.email, user?.name);
      const orderData = orderRes.data.data;

      // Load Razorpay script if needed
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      const options = {
        key: orderData.razorpayKey,
        amount: parseFloat(orderData.amount) * 100,
        currency: orderData.currency,
        name: 'The Dharma Saga',
        description: orderData.productName,
        order_id: orderData.razorpayOrderId,
        prefill: { email: orderData.customerEmail, name: orderData.customerName },
        handler: async function (response) {
          try {
            await purchasesApi.verify(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            setUserAccess(prev => [...prev, product.contentType]);
            alert('Purchase successful! You now have access to this content.');
          } catch {
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: { color: '#f59e0b' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert('Failed to create order: ' + (err.response?.data?.message || err.message));
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dharma flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!volume) {
    return (
      <div className="min-h-screen bg-dharma flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-400 mb-4">Volume Not Found</h1>
          <Link href="/volumes" className="btn-primary">
            Back to Volumes
          </Link>
        </div>
      </div>
    );
  }

  const episodes = volume.episodes || [];

  return (
    <div className="min-h-screen bg-dharma">
      <Header />

      <main>
        {/* Hero Banner */}
        <div className={`bg-gradient-to-r ${volume.gradient || 'from-orange-600 to-red-800'} py-12 md:py-20 px-4 md:px-6 lg:px-8`}>
          <div className="max-w-7xl mx-auto">
            <Link href="/volumes" className="text-white/60 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Volumes
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-white/60 text-sm md:text-base mb-2">Volume {volume.roman || volume.volumeNumber || 'I'}</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {volume.title}
                </h1>
                <p className="text-white/80 text-sm md:text-base mb-4">{volume.subtitle}</p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl hidden sm:block">
                  {volume.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link
                    href={`/volumes/${volumeId}/episodes/1`}
                    className="bg-white text-stone-900 hover:bg-white/90 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    Start Reading
                  </Link>
                  <button className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Add to Library
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              {volume.coverImageUrl && (
                <div className="hidden lg:block">
                  <img src={volume.coverImageUrl} alt={volume.title} className="w-48 h-64 object-cover rounded-xl shadow-2xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Options */}
        {products.length > 0 && (
          <div className="px-4 md:px-6 lg:px-8 py-10 md:py-16 bg-stone-900/50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Choose Your Experience</h2>
              <p className="text-stone-400 mb-8">Select how you want to experience this saga</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <PurchaseCard
                    key={product.id}
                    product={{...product, volumeId}}
                    onPurchase={handlePurchase}
                    userAccess={userAccess}
                    loading={purchasing}
                  />
                ))}
              </div>
              {userAccess.length > 0 && (
                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 text-center">
                    ✓ You have access to {userAccess.length} content type(s). Click "Access Content" to start.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Episodes List */}
        <div className="px-4 md:px-6 lg:px-8 py-10 md:py-16 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-300 mb-6 md:mb-8">
            Episodes ({episodes.length || volume.totalEpisodes || 0})
          </h2>

          <div className="space-y-3 md:space-y-4">
            {episodes.map((episode, idx) => (
              <Link
                key={episode.id}
                href={episode.status !== 'upcoming' ? `/volumes/${volumeId}/episodes/${episode.id}` : '#'}
                className={`flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all ${
                  episode.status === 'upcoming'
                    ? 'bg-stone-800/30 cursor-not-allowed opacity-60'
                    : 'bg-stone-800/50 hover:bg-stone-800/70 hover:scale-[1.01]'
                }`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-lg md:text-xl">{episode.episodeNumber || idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base md:text-lg truncate">{episode.title}</h3>
                  <p className="text-stone-400 text-sm">{episode.duration || '10'} min read</p>
                </div>
                <div className="flex-shrink-0">
                  {(episode.status === 'free' || episode.isFree) && (
                    <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">Free</span>
                  )}
                  {episode.status === 'premium' && (
                    <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium">Premium</span>
                  )}
                  {episode.status === 'upcoming' && (
                    <span className="bg-stone-600/20 text-stone-400 px-3 py-1 rounded-full text-xs font-medium">Coming Soon</span>
                  )}
                </div>
                {episode.status !== 'upcoming' && (
                  <svg className="w-5 h-5 text-stone-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>

          {episodes.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <p>Episodes coming soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
