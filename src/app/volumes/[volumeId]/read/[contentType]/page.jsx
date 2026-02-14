'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { contentApi, volumesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// Watermark overlay component
const Watermark = ({ text }) => (
  <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden opacity-10">
    <div className="absolute inset-0" style={{ 
      backgroundImage: `repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 100px,
        rgba(255,255,255,0.03) 100px,
        rgba(255,255,255,0.03) 200px
      )`
    }}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white/20 text-sm font-light whitespace-nowrap transform -rotate-45 select-none"
          style={{
            left: `${(i % 5) * 25}%`,
            top: `${Math.floor(i / 5) * 30}%`,
          }}
        >
          {text}
        </div>
      ))}
    </div>
  </div>
);

// OTP Input component
const OtpInput = ({ length = 6, value, onChange }) => {
  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (val.length > 1) return;
    
    const newValue = value.split('');
    newValue[idx] = val;
    onChange(newValue.join(''));
    
    // Auto-focus next input
    if (val && idx < length - 1) {
      const next = e.target.nextElementSibling;
      if (next) next.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      const prev = e.target.previousElementSibling;
      if (prev) prev.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {[...Array(length)].map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-14 text-center text-2xl font-bold bg-stone-800 border-2 border-stone-600 rounded-lg text-white focus:border-amber-500 focus:outline-none transition"
        />
      ))}
    </div>
  );
};

// Content type configs
const contentTypeConfig = {
  comic: { name: 'Kid Comics', icon: '🎨', contentType: 'COMIC' },
  anime: { name: 'Anime Video', icon: '🎬', contentType: 'ANIME' },
  ebook: { name: 'Ebook', icon: '📚', contentType: 'EBOOK' },
};

export default function ProtectedContentReader() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  
  const volumeId = params.volumeId;
  const contentType = params.contentType?.toLowerCase() || 'ebook';
  const config = contentTypeConfig[contentType] || contentTypeConfig.ebook;
  
  const [step, setStep] = useState('verify'); // 'verify' | 'otp' | 'reading'
  const [volume, setVolume] = useState(null);
  const [otp, setOtp] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [content, setContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);

  // Disable screenshot (best effort)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are not allowed for protected content.');
      }
      // Block Ctrl+Shift+S (Windows Snipping Tool shortcut)
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
      }
    };

    // Block right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const savedToken = sessionStorage.getItem(`access_${volumeId}_${contentType}`);
    const savedExpiry = sessionStorage.getItem(`access_expiry_${volumeId}_${contentType}`);
    
    if (savedToken && savedExpiry && new Date(savedExpiry) > new Date()) {
      setAccessToken(savedToken);
      setStep('reading');
      loadContent(savedToken, 1);
    }

    loadVolumeInfo();
  }, [volumeId, contentType, token]);

  const loadVolumeInfo = async () => {
    try {
      const res = await volumesApi.getById(volumeId);
      setVolume(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to load volume:', err);
    }
  };

  const requestOtp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await contentApi.requestOtp(volumeId, config.contentType);
      const data = res.data.data;
      setOtpEmail(data.email);
      setExpiresIn(data.expiresInMinutes);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP. Do you own this content?');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await contentApi.verifyOtp(volumeId, config.contentType, otp);
      const data = res.data.data;
      
      // Store access token in session
      setAccessToken(data.accessToken);
      sessionStorage.setItem(`access_${volumeId}_${contentType}`, data.accessToken);
      sessionStorage.setItem(`access_expiry_${volumeId}_${contentType}`, data.expiresAt);
      
      setStep('reading');
      loadContent(data.accessToken, 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (token, page) => {
    setLoading(true);
    try {
      const res = await contentApi.getContent(volumeId, config.contentType, page, token);
      const data = res.data.data;
      setContent(data);
      setCurrentPage(page);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token expired
        sessionStorage.removeItem(`access_${volumeId}_${contentType}`);
        sessionStorage.removeItem(`access_expiry_${volumeId}_${contentType}`);
        setAccessToken(null);
        setStep('verify');
        setError('Session expired. Please verify again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load content');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (content?.totalPages || 1)) {
      loadContent(accessToken, newPage);
    }
  };

  // Render verification step
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800/50 backdrop-blur border border-stone-700 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">{config.icon}</div>
          <h1 className="text-2xl font-bold text-white mb-2">Protected Content</h1>
          <p className="text-stone-400 mb-6">
            {volume?.title || 'This volume'} - {config.name}
          </p>
          
          <p className="text-stone-300 text-sm mb-6">
            For your security, we need to verify your identity before accessing this content. 
            An OTP will be sent to your registered email.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={requestOtp}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP to Email'}
          </button>

          <Link href={`/volumes/${volumeId}`} className="block mt-4 text-stone-400 hover:text-white text-sm">
            ← Back to Volume
          </Link>
        </div>
      </div>
    );
  }

  // Render OTP input step
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800/50 backdrop-blur border border-stone-700 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Enter OTP</h1>
          <p className="text-stone-400 mb-6">
            We've sent a 6-digit code to <span className="text-amber-400">{otpEmail}</span>
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Code expires in {expiresIn} minutes
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <OtpInput length={6} value={otp} onChange={setOtp} />
          </div>

          <button
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Access Content'}
          </button>

          <button
            onClick={() => { setStep('verify'); setOtp(''); setError(''); }}
            className="block mt-4 text-stone-400 hover:text-white text-sm mx-auto"
          >
            Resend OTP
          </button>
        </div>
      </div>
    );
  }

  // Render content reading step
  return (
    <div className="min-h-screen bg-stone-900 relative select-none" style={{ userSelect: 'none' }}>
      {/* Watermark */}
      <Watermark text={`${user?.email?.substring(0, 4)}*** | TDS`} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-stone-900/90 backdrop-blur border-b border-stone-800 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/volumes/${volumeId}`} className="text-stone-400 hover:text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Exit
          </Link>
          
          <div className="text-center">
            <p className="text-white font-medium">{volume?.title}</p>
            <p className="text-stone-400 text-sm">{config.name}</p>
          </div>

          <div className="text-stone-400 text-sm">
            Page {currentPage} of {content?.totalPages || 1}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full" />
          </div>
        ) : content ? (
          <div className="bg-stone-800/30 rounded-2xl p-6 md:p-10">
            {contentType === 'comic' ? (
              // Comic viewer - images
              <div className="space-y-4">
                {JSON.parse(content.content || '{"pages":[]}').pages?.map((url, idx) => (
                  <img 
                    key={idx} 
                    src={url} 
                    alt={`Page ${idx + 1}`} 
                    className="w-full rounded-lg"
                    draggable={false}
                  />
                ))}
              </div>
            ) : contentType === 'anime' ? (
              // Video player
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full h-full"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src={JSON.parse(content.content || '{}').videoUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              // Ebook reader - text
              <div className="prose prose-invert prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-amber-400 mb-6">
                  Chapter {currentPage}: {content.volumeTitle}
                </h2>
                <div 
                  className="text-stone-200 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p>No content available</p>
          </div>
        )}
      </main>

      {/* Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-stone-900/90 backdrop-blur border-t border-stone-800 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={content?.totalPages || 1}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= (content?.totalPages || 1)) {
                  handlePageChange(page);
                }
              }}
              className="w-16 px-2 py-1 bg-stone-800 border border-stone-700 rounded text-white text-center"
            />
            <span className="text-stone-400">/ {content?.totalPages || 1}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (content?.totalPages || 1) || loading}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      </footer>
    </div>
  );
}
