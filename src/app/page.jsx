'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const characters = [
  { name: 'Raja Dahir', title: 'Last King of Sindh', image: '/images/raja-dahir.jpg' },
  { name: 'Bappa Rawal', title: 'Founder of Mewar', image: '/images/bappa-rawal.jpg' },
  { name: 'Lalitaditya', title: 'Emperor of Kashmir', image: '/images/lalitaditya.jpg' },
  { name: 'Naga Sadhu', title: 'Guardian Warrior', image: '/images/naga-sadhu.jpg' },
];

const volumes = [
  { 
    number: 'I', 
    title: 'THE FALL OF SINDH', 
    subtitle: 'Raja Dahir vs Arab Invasion',
    description: 'The untold story of the last Hindu king who stood against the tide of invasion.',
    episodes: 12,
    status: 'Complete',
    gradient: 'from-orange-600 via-red-600 to-red-800'
  },
  { 
    number: 'II', 
    title: 'THE RISE OF MEWAR', 
    subtitle: 'Bappa Rawal & The Naga Sadhus',
    description: 'How warrior monks and a young prince forged an unbreakable kingdom.',
    episodes: 15,
    status: 'In Progress',
    gradient: 'from-amber-500 via-orange-600 to-red-700'
  },
  { 
    number: 'III', 
    title: 'FIRE & ICE', 
    subtitle: 'Lalitaditya vs Tang Empire',
    description: 'The greatest military campaign of medieval Asia.',
    episodes: 18,
    status: 'Coming Soon',
    gradient: 'from-blue-500 via-indigo-600 to-purple-800'
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dharma">
      <Header />

      <main className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />

        {/* Hero Section */}
        <section className="relative z-10 pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center">
              {/* Title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none mb-6">
                <span className="block text-gradient-fire text-shadow-fire">THE</span>
                <span className="block text-gradient-fire text-shadow-fire">DHARMA</span>
                <span className="block text-gradient-fire text-shadow-fire">SAGA</span>
              </h1>

              {/* Tagline */}
              <p className="text-lg md:text-xl lg:text-2xl text-orange-200/80 mb-4 tracking-wide font-light">
                Forgotten Heroes. Eternal Dharma.
              </p>
              <p className="text-sm md:text-base text-neutral-500 mb-12 max-w-lg mx-auto">
                An epic journey through India's untold history, where warriors rise and empires fall.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/volumes/1/episodes/1" className="btn-primary">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Reading
                  </span>
                </Link>
                <Link href="/volumes" className="btn-secondary">
                  Explore All Volumes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Story Intro Section */}
        <section className="relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="space-y-6 text-xl md:text-2xl lg:text-3xl text-orange-200/70 font-light leading-relaxed">
              <p>A saga of forgotten guardians.</p>
              <p>Stories erased, not defeated.</p>
              <p className="text-orange-300 font-medium">Dharma survives.</p>
            </div>
          </div>
        </section>

        {/* Volumes Section */}
        <section className="relative z-10 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-4">
                The Epic Unfolds
              </h2>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-100">
                Explore the <span className="text-gradient-fire">Volumes</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {volumes.map((volume, idx) => (
                <Link 
                  key={idx} 
                  href={`/volumes/${idx + 1}`}
                  className="volume-card group"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${volume.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative p-6 md:p-8">
                    {/* Volume Number */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-orange-400/70">
                        Volume {volume.number}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        volume.status === 'Complete' 
                          ? 'bg-green-500/20 text-green-400' 
                          : volume.status === 'In Progress'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {volume.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-200 transition-colors">
                      {volume.title}
                    </h3>
                    <p className="text-sm text-orange-300/70 mb-4">{volume.subtitle}</p>
                    <p className="text-sm text-neutral-400 mb-6 line-clamp-2">{volume.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-neutral-500">{volume.episodes} Episodes</span>
                      <span className="text-orange-400 group-hover:translate-x-1 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Characters Section */}
        <section className="relative z-10 py-20 md:py-32 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-4">
                Heroes of Dharma
              </h2>
              <p className="text-3xl md:text-4xl font-bold text-neutral-100">
                Meet the <span className="text-gradient-fire">Legends</span>
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {characters.map((character, idx) => (
                <div key={idx} className="character-portrait group">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Placeholder gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 to-neutral-900 -z-10" />
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-lg font-bold text-white mb-1">{character.name}</h3>
                    <p className="text-xs text-orange-300/80">{character.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="glass-fire rounded-3xl p-8 md:p-12 lg:p-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Support the Saga
              </h2>
              <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                Help us bring more forgotten heroes to life. Your contribution keeps Dharma alive for future generations.
              </p>
              <Link href="/donate" className="btn-primary inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Become a Patron
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}