'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCreateDonation, useDonationStats } from '@/lib/hooks';

const donationTiers = [
  { amount: 100, label: '₹100', description: 'Support a chapter', icon: '📖' },
  { amount: 500, label: '₹500', description: 'Support an episode', icon: '📚' },
  { amount: 1000, label: '₹1,000', description: 'Patron of Dharma', icon: '🛡️' },
  { amount: 5000, label: '₹5,000', description: 'Guardian of the Saga', icon: '⚔️' },
];

const impactItems = [
  { icon: '✍️', title: 'Research & Writing', description: 'Fund historical research and quality writing' },
  { icon: '🎨', title: 'Illustrations', description: 'Commission artwork and character designs' },
  { icon: '🌐', title: 'Platform', description: 'Keep the platform free and accessible' },
  { icon: '📢', title: 'Outreach', description: 'Spread awareness of forgotten heroes' },
];

// Helper function to format currency in lakhs/crores
const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};

// Helper function to format numbers with + suffix
const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K+`;
  }
  return `${count}+`;
};

// Stats Section Component with dynamic data
function StatsSection() {
  const { data: stats, isLoading, isError } = useDonationStats();

  // Fallback values while loading or on error
  const defaultStats = {
    totalDonors: 500,
    totalAmount: 250000,
    episodesFunded: 36,
    totalReaders: 10000,
  };

  const displayStats = stats || defaultStats;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-16 mb-1"></div>
            <div className="h-4 bg-white/5 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-3xl font-bold text-white">{formatCount(displayStats.totalDonors)}</p>
        <p className="text-neutral-500 text-sm">Supporters</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{formatCurrency(displayStats.totalAmount)}</p>
        <p className="text-neutral-500 text-sm">Raised</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{displayStats.episodesFunded}</p>
        <p className="text-neutral-500 text-sm">Episodes Funded</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{formatCount(displayStats.totalReaders)}</p>
        <p className="text-neutral-500 text-sm">Readers</p>
      </div>
    </div>
  );
}

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    message: '',
    isAnonymous: false,
  });
  const createDonation = useCreateDonation();
  const isProcessing = createDonation.isPending;

  const handleTierSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setIsCustom(true);
    setSelectedAmount(parseInt(value) || 0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const donationData = {
      amount: finalAmount,
      currency: 'INR',
      donorName: formData.isAnonymous ? null : formData.donorName,
      donorEmail: formData.donorEmail,
      message: formData.message || null,
      isAnonymous: formData.isAnonymous,
    };

    createDonation.mutate(donationData, {
      onSuccess: (data) => {
        // Redirect to payment URL if provided
        if (data?.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          // Reset form on success
          setFormData({
            donorName: '',
            donorEmail: '',
            message: '',
            isAnonymous: false,
          });
          setSelectedAmount(500);
          setCustomAmount('');
          setIsCustom(false);
        }
      },
    });
  };

  const finalAmount = isCustom ? (parseInt(customAmount) || 0) : selectedAmount;

  return (
    <div className="min-h-screen bg-dharma">
      <Header />

      <main className="relative pt-28 md:pt-32 pb-16 md:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">
              Support the Mission
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-fire mb-4">
              Fuel the Saga
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Help us bring forgotten heroes back to life. Every contribution keeps Dharma alive.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Donation Form */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                Choose Your Contribution
              </h2>

              {/* Preset Tiers */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => handleTierSelect(tier.amount)}
                    className={`tier-card text-left ${
                      selectedAmount === tier.amount && !isCustom ? 'selected' : ''
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{tier.icon}</span>
                    <span className="text-xl font-bold text-white block">{tier.label}</span>
                    <span className="text-neutral-500 text-sm">{tier.description}</span>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-neutral-400 text-sm font-medium mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="input-field pl-8"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
              </div>

              {/* Donor Info */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Your name"
                      required={!formData.isAnonymous}
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="donorEmail"
                      value={formData.donorEmail}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 text-sm font-medium mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Leave a message of support..."
                  />
                </div>

                <label className="flex items-center gap-3 text-neutral-500 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="rounded border-white/10 bg-black/30 text-orange-500 focus:ring-orange-500/30"
                  />
                  <span className="text-sm">Make my donation anonymous</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={finalAmount < 1 || isProcessing}
                  className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Donate ₹{finalAmount.toLocaleString()}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5">
                  <span className="text-neutral-600 text-xs">Secure payments via</span>
                  <div className="flex gap-2">
                    <span className="text-neutral-500 text-xs px-2 py-1 bg-white/5 rounded">UPI</span>
                    <span className="text-neutral-500 text-xs px-2 py-1 bg-white/5 rounded">Cards</span>
                    <span className="text-neutral-500 text-xs px-2 py-1 bg-white/5 rounded">Net Banking</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Impact Info */}
            <div className="space-y-6">
              {/* Your Impact */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">Your Impact</h2>
                <div className="space-y-5">
                  {impactItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-neutral-500 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="glass-fire rounded-2xl p-6 md:p-8">
                <h3 className="text-orange-300 font-semibold mb-6">Community Impact</h3>
                <StatsSection />
              </div>

              {/* Quote */}
              <div className="text-center p-6 glass rounded-xl">
                <blockquote className="text-orange-200 italic text-xl mb-3">
                  "धर्मो रक्षति रक्षितः"
                </blockquote>
                <p className="text-neutral-500 text-sm">
                  "Dharma protects those who protect it"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
