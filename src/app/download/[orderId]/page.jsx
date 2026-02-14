'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default function DownloadPage() {
  const params = useParams();
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const generatePersonalizedContent = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setGeneratedContent({ userName: userName });
    setIsGenerating(false);
    setIsGenerated(true);
  };

  const downloadContent = async (type) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1920;

    if (type === 'whatsapp') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a0a0a');
      gradient.addColorStop(0.5, '#2d1810');
      gradient.addColorStop(1, '#0a1a1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(249, 115, 22, 0.1)';
      ctx.beginPath();
      ctx.arc(200, 400, 300, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.beginPath();
      ctx.arc(880, 1500, 300, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('THE DHARMA SAGA', canvas.width / 2, 600);

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('Official Supporter', canvas.width / 2, 700);

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(340, 800);
      ctx.lineTo(740, 800);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 84px Arial';
      ctx.fillText(userName, canvas.width / 2, 1000);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '36px Arial';
      ctx.fillText('Thank you for supporting', canvas.width / 2, 1200);
      ctx.fillText('the epic journey!', canvas.width / 2, 1260);

      ctx.fillStyle = '#6b7280';
      ctx.font = '28px Arial';
      ctx.fillText('thedharmasaga.com', canvas.width / 2, 1800);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0a1a');
      gradient.addColorStop(0.3, '#1a1025');
      gradient.addColorStop(0.7, '#251a10');
      gradient.addColorStop(1, '#1a0f0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
      ctx.beginPath();
      ctx.arc(540, 960, 400, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6b7280';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('I JUST SUPPORTED', canvas.width / 2, 500);

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 80px Arial';
      ctx.fillText('THE DHARMA', canvas.width / 2, 700);
      ctx.fillText('SAGA', canvas.width / 2, 800);

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(340, 900);
      ctx.lineTo(740, 900);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Arial';
      ctx.fillText(userName, canvas.width / 2, 1050);

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('✨ OFFICIAL SUPPORTER ✨', canvas.width / 2, 1200);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '28px Arial';
      ctx.fillText('Join the epic journey at', canvas.width / 2, 1500);
      
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('thedharmasaga.com', canvas.width / 2, 1560);

      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial';
      ctx.fillText('↑ Swipe up to explore ↑', canvas.width / 2, 1800);
    }

    const link = document.createElement('a');
    link.download = `dharma-saga-${type}-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl animate-fade-in">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
              <CheckIcon />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Thank You for Your Support! 🙏
            </h1>
            <p className="text-gray-400">
              Order #{params.orderId} confirmed. Now create your personalized content!
            </p>
          </div>

          {!isGenerated ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Enter Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name for personalized content"
                  className="input-field w-full text-lg"
                  maxLength={30}
                />
                <p className="text-gray-500 text-sm mt-2">
                  This name will appear on your WhatsApp status and Instagram story
                </p>
              </div>

              <button
                onClick={generatePersonalizedContent}
                disabled={isGenerating || !userName.trim()}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Your Content...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Generate Personalized Content
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                  <CheckIcon />
                  Content generated for "{generatedContent.userName}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-6 text-center border-green-500/20 hover:border-green-500/40 transition-colors">
                  <div className="text-5xl mb-4">📱</div>
                  <h3 className="text-white font-bold text-lg mb-2">WhatsApp Status</h3>
                  <p className="text-gray-400 text-sm mb-4">Perfect for sharing on your status</p>
                  <button
                    onClick={() => downloadContent('whatsapp')}
                    className="w-full py-3 px-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-semibold flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all"
                  >
                    <DownloadIcon />
                    Download
                  </button>
                </div>

                <div className="glass rounded-2xl p-6 text-center border-pink-500/20 hover:border-pink-500/40 transition-colors">
                  <div className="text-5xl mb-4">📸</div>
                  <h3 className="text-white font-bold text-lg mb-2">Instagram Story</h3>
                  <p className="text-gray-400 text-sm mb-4">Share on your Instagram story</p>
                  <button
                    onClick={() => downloadContent('instagram')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-pink-400 font-semibold flex items-center justify-center gap-2 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                  >
                    <DownloadIcon />
                    Download
                  </button>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setIsGenerated(false);
                    setGeneratedContent(null);
                    setUserName('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Want to use a different name? Click here
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Share your support with friends and spread the word about The Dharma Saga! 🔥
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}