'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const volumes = [
  {
    number: 1,
    roman: 'I',
    title: 'THE FALL OF SINDH',
    subtitle: 'Raja Dahir | Arab Invasion',
    description: 'The year is 712 CE. The mighty kingdom of Sindh faces its darkest hour as Arab forces cross the Indus. Raja Dahir, the last Hindu king of Sindh, must defend not just his kingdom, but the very soul of Dharma.',
    episodes: 12,
    status: 'complete',
    gradient: 'from-orange-600 via-red-600 to-red-800',
    image: '/images/volume-1-cover.jpg',
  },
  {
    number: 2,
    roman: 'II',
    title: 'THE RISE OF MEWAR',
    subtitle: 'Bappa Rawal | Naga Sadhus',
    description: 'From the ashes of defeat rises a new hope. Young Kalbhoj, under the guidance of the mysterious Naga Sadhus, transforms into Bappa Rawal - the founder of Mewar\'s legendary dynasty.',
    episodes: 14,
    status: 'ongoing',
    gradient: 'from-amber-500 via-orange-600 to-orange-800',
    image: '/images/volume-2-cover.jpg',
  },
  {
    number: 3,
    roman: 'III',
    title: 'FIRE & ICE',
    subtitle: 'Lalitaditya | Tang Conquest',
    description: 'In the frozen heights of Kashmir, Emperor Lalitaditya Muktapida wages a war that spans continents. From the deserts of Arabia to the steppes of Central Asia, fire meets ice.',
    episodes: 10,
    status: 'upcoming',
    gradient: 'from-blue-500 via-indigo-600 to-purple-800',
    image: '/images/volume-3-cover.jpg',
  },
];

const getStatusBadge = (status) => {
  const styles = {
    complete: 'bg-green-500/20 text-green-400 border-green-500/30',
    ongoing: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  const labels = {
    complete: 'Complete',
    ongoing: 'Ongoing',
    upcoming: 'Coming Soon',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function VolumesPage() {
  return (
    <div className="min-h-screen bg-dharma">
      <Header />

      <main className="relative pt-28 md:pt-32 pb-16 md:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">
              The Complete Collection
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-fire mb-4">
              The Saga
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Three volumes. Three eras. One eternal Dharma.
            </p>
          </div>

          {/* Volumes Grid */}
          <div className="space-y-8 md:space-y-10">
            {volumes.map((volume) => (
              <div 
                key={volume.number}
                className="glass rounded-3xl overflow-hidden hover:border-white/15 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Cover Image */}
                  <div className="lg:w-1/3 aspect-[3/4] lg:aspect-auto relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${volume.gradient} opacity-80`} />
                    <img
                      src={volume.image}
                      alt={volume.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl md:text-9xl font-black text-white/20">
                        {volume.roman}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-neutral-500 text-sm font-medium uppercase tracking-wider">
                          Volume {volume.roman}
                        </span>
                        {getStatusBadge(volume.status)}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                        {volume.title}
                      </h2>
                      <p className="text-orange-300/70 text-sm md:text-base mb-4">
                        {volume.subtitle}
                      </p>

                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6 hidden sm:block">
                        {volume.description}
                      </p>

                      <div className="flex items-center gap-4 text-neutral-500 text-sm mb-6">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                          {volume.episodes} Episodes
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {volume.status !== 'upcoming' ? (
                        <>
                          <Link
                            href={`/volumes/${volume.number}/episodes/1`}
                            className="btn-primary text-center"
                          >
                            Start Reading
                          </Link>
                          <Link
                            href={`/volumes/${volume.number}`}
                            className="btn-secondary text-center"
                          >
                            View Episodes
                          </Link>
                        </>
                      ) : (
                        <button
                          disabled
                          className="px-8 py-4 rounded-xl bg-white/5 text-neutral-500 font-semibold cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Section */}
          <section className="mt-20 md:mt-32">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">
                Journey Through Time
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Historical Timeline
              </h2>
            </div>
            
            <div className="relative max-w-3xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-orange-600 to-blue-500" />

              {/* Timeline Items */}
              <div className="space-y-8 md:space-y-12">
                {[
                  { year: '712 CE', event: 'Fall of Sindh', description: 'Arab conquest under Muhammad bin Qasim' },
                  { year: '734 CE', event: 'Rise of Mewar', description: 'Bappa Rawal establishes the dynasty' },
                  { year: '740 CE', event: 'Lalitaditya\'s Conquests', description: 'Kashmir\'s greatest emperor expands his realm' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-start gap-6 md:gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-neutral-900 z-10 flex-shrink-0 mt-1.5" />
                    <div className={`flex-1 glass rounded-xl p-5 md:p-6 ${idx % 2 === 1 ? 'md:text-right' : ''}`}>
                      <span className="text-orange-400 font-bold text-lg">{item.year}</span>
                      <h3 className="text-white font-semibold text-lg mt-1">{item.event}</h3>
                      <p className="text-neutral-500 text-sm mt-1">{item.description}</p>
                    </div>
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
