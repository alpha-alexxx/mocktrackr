import { useQueryClient } from '@tanstack/react-query';

export function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return {
        invalidateRecords: (userId: string, date: Date) =>
            queryClient.invalidateQueries({ queryKey: ['records', userId, date] }),
        invalidateUserProfile: (userId: string) => queryClient.invalidateQueries({ queryKey: ['userProfile', userId] }),
        invalidateSessions: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
        invalidateDashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        invalidateSettings: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
    };
}
