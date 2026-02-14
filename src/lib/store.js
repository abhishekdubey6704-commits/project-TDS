import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// AUTH STORE
// ============================================
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// ============================================
// READING PROGRESS STORE
// ============================================
export const useReadingStore = create(
  persist(
    (set, get) => ({
      currentVolume: null,
      currentEpisode: null,
      readingProgress: {}, // { 'volumeId-episodeId': { position, percentage, lastRead } }
      completedEpisodes: [], // ['volumeId-episodeId', ...]

      setCurrentReading: (volumeId, episodeId) => set({
        currentVolume: volumeId,
        currentEpisode: episodeId,
      }),

      updateProgress: (volumeId, episodeId, position, percentage) => {
        const key = `${volumeId}-${episodeId}`;
        set((state) => ({
          readingProgress: {
            ...state.readingProgress,
            [key]: {
              position,
              percentage,
              lastRead: new Date().toISOString(),
            },
          },
        }));
      },

      markEpisodeComplete: (volumeId, episodeId) => {
        const key = `${volumeId}-${episodeId}`;
        set((state) => ({
          completedEpisodes: state.completedEpisodes.includes(key)
            ? state.completedEpisodes
            : [...state.completedEpisodes, key],
        }));
      },

      getProgress: (volumeId, episodeId) => {
        const key = `${volumeId}-${episodeId}`;
        return get().readingProgress[key] || null;
      },

      isEpisodeComplete: (volumeId, episodeId) => {
        const key = `${volumeId}-${episodeId}`;
        return get().completedEpisodes.includes(key);
      },

      clearProgress: () => set({
        currentVolume: null,
        currentEpisode: null,
        readingProgress: {},
        completedEpisodes: [],
      }),
    }),
    {
      name: 'reading-storage',
    }
  )
);

// ============================================
// UI PREFERENCES STORE
// ============================================
export const useUIStore = create(
  persist(
    (set) => ({
      // Reader settings
      fontSize: 'base', // 'sm' | 'base' | 'lg' | 'xl'
      theme: 'dark', // 'dark' | 'sepia' | 'light'
      lineHeight: 'relaxed', // 'normal' | 'relaxed' | 'loose'
      
      // UI state
      sidebarOpen: false,
      mobileMenuOpen: false,

      // Reader settings
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      
      // UI toggles
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        fontSize: state.fontSize,
        theme: state.theme,
        lineHeight: state.lineHeight,
      }),
    }
  )
);

// ============================================
// BOOKMARKS STORE
// ============================================
export const useBookmarksStore = create(
  persist(
    (set, get) => ({
      bookmarks: [], // [{ id, volumeId, episodeId, position, title, createdAt }]

      addBookmark: (bookmark) => {
        const newBookmark = {
          ...bookmark,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          bookmarks: [...state.bookmarks, newBookmark],
        }));
        return newBookmark;
      },

      removeBookmark: (bookmarkId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
        }));
      },

      getBookmarksForEpisode: (volumeId, episodeId) => {
        return get().bookmarks.filter(
          (b) => b.volumeId === volumeId && b.episodeId === episodeId
        );
      },

      clearAllBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'bookmarks-storage',
    }
  )
);

// ============================================
// NOTIFICATIONS STORE
// ============================================
export const useNotificationsStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      ...notification,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration (default 5 seconds)
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, notification.duration || 5000);

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),
}));
