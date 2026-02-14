import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================
// VOLUME CARD COMPONENT
// ============================================
export function VolumeCard({ volume, className }) {
  const statusStyles = {
    complete: 'bg-green-600/80 text-green-100',
    ongoing: 'bg-orange-600/80 text-orange-100',
    upcoming: 'bg-blue-600/80 text-blue-100',
  };

  const statusLabels = {
    complete: 'Complete',
    ongoing: 'Ongoing',
    upcoming: 'Coming Soon',
  };

  return (
    <Link
      href={volume.status !== 'upcoming' ? `/volumes/${volume.number}` : '#'}
      className={cn(
        `block bg-gradient-to-r ${volume.gradient} rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]`,
        volume.status === 'upcoming' && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-medium">
            Volume {volume.roman}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[volume.status]}`}>
            {statusLabels[volume.status]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          {volume.title}
        </h3>
        <p className="text-white/70 text-sm mb-4">{volume.subtitle}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-white/60 text-sm">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            {volume.episodes} Episodes
          </span>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// EPISODE CARD COMPONENT
// ============================================
export function EpisodeCard({ episode, volumeId, index, className }) {
  const isAccessible = episode.status !== 'upcoming';

  return (
    <Link
      href={isAccessible ? `/volumes/${volumeId}/episodes/${episode.id}` : '#'}
      className={cn(
        'flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all',
        isAccessible
          ? 'bg-stone-800/50 hover:bg-stone-800/70 hover:scale-[1.01]'
          : 'bg-stone-800/30 cursor-not-allowed opacity-60',
        className
      )}
    >
      {/* Episode Number */}
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-600/20 flex items-center justify-center flex-shrink-0">
        <span className="text-orange-400 font-bold text-lg md:text-xl">{index + 1}</span>
      </div>

      {/* Episode Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-base md:text-lg truncate">
          {episode.title}
        </h3>
        <p className="text-stone-400 text-sm">{episode.duration} read</p>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        {episode.status === 'free' && (
          <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
            Free
          </span>
        )}
        {episode.status === 'premium' && (
          <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium">
            Premium
          </span>
        )}
        {episode.status === 'upcoming' && (
          <span className="bg-stone-600/20 text-stone-400 px-3 py-1 rounded-full text-xs font-medium">
            Coming Soon
          </span>
        )}
      </div>

      {/* Arrow */}
      {isAccessible && (
        <svg className="w-5 h-5 text-stone-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}

// ============================================
// CHARACTER PORTRAIT COMPONENT
// ============================================
export function CharacterPortrait({ character, size = 'md', className }) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={cn('text-center group cursor-pointer', className)}>
      <div className={cn(
        'relative overflow-hidden rounded-full bg-gradient-to-br from-orange-800 to-stone-900 mx-auto mb-2',
        sizes[size]
      )}>
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-orange-200/50 text-xs">
          {character.name.charAt(0)}
        </div>
      </div>
      <h3 className="text-orange-200 font-medium text-sm group-hover:text-orange-300 transition-colors">
        {character.name}
      </h3>
      {character.role && (
        <p className="text-stone-500 text-xs">{character.role}</p>
      )}
    </div>
  );
}

// ============================================
// READING PROGRESS BAR COMPONENT
// ============================================
export function ReadingProgressBar({ progress, className }) {
  return (
    <div className={cn('w-full bg-stone-700 rounded-full h-1.5', className)}>
      <div
        className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

// ============================================
// LOADING SPINNER COMPONENT
// ============================================
export function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={cn('animate-spin text-orange-500', sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ============================================
// NOTIFICATION TOAST COMPONENT
// ============================================
export function Toast({ notification, onClose }) {
  const typeStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
    info: 'bg-blue-600 border-blue-500',
  };

  const typeIcons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg text-white animate-slide-in',
        typeStyles[notification.type || 'info']
      )}
    >
      {typeIcons[notification.type || 'info']}
      <span className="flex-1 text-sm">{notification.message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ============================================
// TRIDENT ICON COMPONENT
// ============================================
export function TridentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 32" fill="currentColor">
      <path d="M12 0L14 8H16L18 4L17 12H14V28H16L12 32L8 28H10V12H7L6 4L8 8H10L12 0Z" />
    </svg>
  );
}
