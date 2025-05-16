import axiosClient from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

import { isAxiosError } from 'axios';

export function useSession() {
    return useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            try {
                const res = await axiosClient.get('/api/auth/get-session');

                return res.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    const message = error?.response?.data?.message || 'Failed to fetch sessions';
                    throw new Error(message);
                } else {
                    throw new Error('Failed to fetch');
                }
            }
        },
        retry: 3, // Retry 2 times on failure
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000
    });
}

export function useSessions() {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            try {
                const res = await axiosClient.get('/api/auth/list-sessions');

                return res.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    const message = error?.response?.data?.message || 'Failed to fetch sessions';
                    throw new Error(message);
                } else {
                    throw new Error('Failed to fetch');
                }
            }
        },
        retry: 3,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000
    });
}
