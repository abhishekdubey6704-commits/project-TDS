'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock episode content - replace with API
const episodeContent = {
  '1-1': {
    volumeId: 1,
    episodeId: 1,
    title: 'The Storm Approaches',
    volumeTitle: 'THE FALL OF SINDH',
    content: `
      <h2>Chapter One: The Storm Approaches</h2>
      
      <p>The year was 712 CE. The monsoon winds carried more than rain that summer—they carried whispers of war.</p>

      <p>Raja Dahir stood atop the watchtower of Aror, his eyes fixed on the western horizon where dust clouds rose like spectral armies. At fifty-three, his hair had turned silver, but his gaze remained sharp as a newly forged blade. Behind him, the great city of Aror bustled with life, its citizens unaware that their world would soon crumble.</p>

      <p>"My lord," a voice called from below. It was Jaisiha, his most trusted general. "The scouts have returned."</p>

      <p>Dahir descended the stone steps, each footfall echoing with the weight of responsibility. The scouts knelt before him, their horses still heaving from the hard ride.</p>

      <p>"Speak," Dahir commanded.</p>

      <p>"Sire, the Arab fleet... it is larger than we feared. Thousands of ships sail up the Indus. Muhammad bin Qasim leads them."</p>

      <p>A murmur rippled through the gathered courtiers. Muhammad bin Qasim—the teenage general who had never tasted defeat. The one whom Hajjaj ibn Yusuf had raised like a blade, forged specifically to pierce the heart of Sindh.</p>

      <p>"How many?" Dahir asked, his voice steady.</p>

      <p>"Fifteen thousand soldiers, my lord. Perhaps more. And siege engines unlike any we have seen."</p>

      <p>Dahir turned to face the sunset. The sky burned orange and red—colors of fire, colors of blood. He thought of his daughters, Surya Devi and Parimal Devi, still innocent of the horrors that approached. He thought of his kingdom, which had stood for centuries as a beacon of learning and tolerance.</p>

      <p>"Summon the war council," he said finally. "And send word to all allied kingdoms. The time has come to stand against the storm."</p>

      <p>As the messengers departed, Dahir remained on the walls, watching the last light fade. He knew, with the clarity that comes to kings in their darkest hours, that this would be a fight not just for territory, but for Dharma itself.</p>

      <p>The storm was coming. And Sindh would not bow without a fight.</p>

      <blockquote>
        <p>"न दैन्यं न पलायनम्"</p>
        <p><em>"Neither servitude, nor retreat"</em></p>
        <p>— House words of Raja Dahir</p>
      </blockquote>
    `,
    prevEpisode: null,
    nextEpisode: { id: 2, title: 'Shadows of Debal' },
  },
};

export default function EpisodeReaderPage() {
  const params = useParams();
  const router = useRouter();
  const volumeId = parseInt(params.volumeId);
  const episodeId = parseInt(params.episodeId);
  
  const [fontSize, setFontSize] = useState('base');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const episode = episodeContent[`${volumeId}-${episodeId}`] || episodeContent['1-1'];

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fontSizes = {
    sm: 'text-sm md:text-base',
    base: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
  };

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Navigation */}
      <header className="fixed top-1 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Back Button */}
          <Link 
            href={`/volumes/${volumeId}`}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Volume</span>
          </Link>

          {/* Title - Center */}
          <div className="text-center flex-1 mx-4">
            <p className="text-orange-400 text-xs font-medium hidden sm:block">{episode.volumeTitle}</p>
            <h1 className="text-white font-semibold text-sm md:text-base truncate">{episode.title}</h1>
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-stone-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>

        {/* Settings Menu */}
        {isMenuOpen && (
          <div className="border-t border-stone-800 p-4 bg-stone-900">
            <div className="max-w-md mx-auto">
              <p className="text-stone-400 text-sm mb-3">Font Size</p>
              <div className="flex gap-2">
                {['sm', 'base', 'lg', 'xl'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                      fontSize === size
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="pt-20 pb-24 px-4 md:px-6">
        <article className={`max-w-3xl mx-auto episode-content ${fontSizes[fontSize]}`}>
          <div 
            className="text-stone-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: episode.content }}
          />
        </article>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-stone-950/95 backdrop-blur-sm border-t border-stone-800 z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-3xl mx-auto">
          {/* Previous */}
          {episode.prevEpisode ? (
            <Link
              href={`/volumes/${volumeId}/episodes/${episode.prevEpisode.id}`}
              className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline text-sm">Previous</span>
            </Link>
          ) : (
            <div />
          )}

          {/* Episode Indicator */}
          <span className="text-stone-500 text-sm">
            Episode {episodeId}
          </span>

          {/* Next */}
          {episode.nextEpisode ? (
            <Link
              href={`/volumes/${volumeId}/episodes/${episode.nextEpisode.id}`}
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span className="hidden sm:inline text-sm">Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/volumes/${volumeId}`}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <span className="text-sm">Complete</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Link>
          )}
        </div>
      </nav>

      {/* Styles for episode content */}
      <style jsx global>{`
        .episode-content h2 {
          font-size: 1.75em;
          font-weight: 700;
          color: #fb923c;
          margin-bottom: 1.5rem;
          margin-top: 2rem;
        }
        
        .episode-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }
        
        .episode-content blockquote {
          border-left: 3px solid #ea580c;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #fdba74;
        }
        
        .episode-content blockquote p {
          margin-bottom: 0.5rem;
        }
        
        .episode-content em {
          color: #d6d3d1;
        }
      `}</style>
    </div>
  );
}
