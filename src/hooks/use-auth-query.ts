import { useQuery } from '@tanstack/react-query';

export function useSession() {
    return useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const res = await fetch('/api/auth/get-session');
            if (!res.ok) throw new Error('Failed to fetch session');

            return res.json();
        },
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000
    });
}

export function useSessions() {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await fetch('/api/auth/list-sessions');
            if (!res.ok) throw new Error('Failed to fetch sessions');

            return res.json();
        },
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000
    });
}
