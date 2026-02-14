'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { volumesApi, episodesApi, donationsApi, authApi, progressApi } from '@/lib/api';
import { useAuthStore, useNotificationsStore } from '@/lib/store';

// ============================================
// VOLUMES HOOKS
// ============================================
export function useVolumes() {
  return useQuery({
    queryKey: ['volumes'],
    queryFn: async () => {
      const response = await volumesApi.getAll();
      return response.data.data;
    },
  });
}

export function useVolume(volumeNumber) {
  return useQuery({
    queryKey: ['volumes', volumeNumber],
    queryFn: async () => {
      const response = await volumesApi.getById(volumeNumber);
      return response.data.data;
    },
    enabled: !!volumeNumber,
  });
}

// ============================================
// EPISODES HOOKS
// ============================================
export function useEpisodes(volumeNumber) {
  return useQuery({
    queryKey: ['episodes', volumeNumber],
    queryFn: async () => {
      const response = await volumesApi.getEpisodes(volumeNumber);
      return response.data.data;
    },
    enabled: !!volumeNumber,
  });
}

export function useEpisode(volumeNumber, episodeNumber) {
  return useQuery({
    queryKey: ['episode', volumeNumber, episodeNumber],
    queryFn: async () => {
      const response = await episodesApi.getContent(volumeNumber, episodeNumber);
      return response.data.data;
    },
    enabled: !!volumeNumber && !!episodeNumber,
  });
}

// ============================================
// AUTH HOOKS
// ============================================
export function useLogin() {
  const { login } = useAuthStore();
  const { addNotification } = useNotificationsStore();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      addNotification({ type: 'success', message: 'Welcome back!' });
    },
    onError: (error) => {
      addNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Login failed' 
      });
    },
  });
}

export function useRegister() {
  const { login } = useAuthStore();
  const { addNotification } = useNotificationsStore();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await authApi.register(userData);
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      addNotification({ type: 'success', message: 'Account created successfully!' });
    },
    onError: (error) => {
      addNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Registration failed' 
      });
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    queryClient.clear();
  };
}

// ============================================
// DONATION HOOKS
// ============================================
export function useDonationStats() {
  return useQuery({
    queryKey: ['donation-stats'],
    queryFn: async () => {
      const response = await donationsApi.getStats();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useCreateDonation() {
  const { addNotification } = useNotificationsStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donationData) => {
      const response = await donationsApi.create(donationData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['donation-stats']);
      addNotification({ type: 'success', message: 'Thank you for your support!' });
    },
    onError: (error) => {
      addNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Donation failed' 
      });
    },
  });
}

// ============================================
// READING PROGRESS HOOKS
// ============================================
export function useReadingProgress(volumeId, episodeId) {
  return useQuery({
    queryKey: ['progress', volumeId, episodeId],
    queryFn: async () => {
      const response = await progressApi.get(volumeId, episodeId);
      return response.data.data;
    },
    enabled: !!volumeId && !!episodeId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ volumeId, episodeId, data }) => {
      const response = await progressApi.update(volumeId, episodeId, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['progress', variables.volumeId, variables.episodeId]);
    },
  });
}
