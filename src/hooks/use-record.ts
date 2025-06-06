import { useMemo } from 'react';

import { fetchRecord, fetchRecords } from '@/services/records/record.fetch';
import { useQuery } from '@tanstack/react-query';

export function useRecords(userId: string, date: Date) {
    return useQuery({
        queryKey: ['records', userId, date],
        queryFn: () => fetchRecords(userId, date),
        enabled: Boolean(userId),
        staleTime: Infinity, // treat as always fresh
        gcTime: 1000 * 60 * 60, // optional: 1 hour in cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true
    });
}

export function useSingleRecord(userId: string, recordId: string) {
    return useQuery({
        queryKey: ['record', userId, recordId],
        queryFn: () => fetchRecord(userId, recordId),
        enabled: Boolean(userId && recordId),
        staleTime: Infinity, // treat as always fresh
        gcTime: 1000 * 60 * 60, // optional: 1 hour in cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true
    });
}

export function useRecord(userId: string, date: Date, recordId: string) {
    const { data: records, isLoading: isLoadingRecords, isError: isErrorRecords } = useRecords(userId, date);

    const localRecord = useMemo(() => {
        return records?.find((r) => r.id === recordId) || null;
    }, [records, recordId]);

    const {
        data: fallbackRecord,
        isLoading: isLoadingSingle,
        isError: isErrorSingle
    } = useSingleRecord(userId, recordId);

    const shouldUseFallback = !localRecord && !isLoadingRecords && !isErrorRecords;

    const finalRecord = shouldUseFallback ? fallbackRecord : localRecord;
    const isLoading = isLoadingRecords || (shouldUseFallback && isLoadingSingle);
    const isError = isErrorRecords || (shouldUseFallback && isErrorSingle);

    return { record: finalRecord, isLoading, isError };
}
