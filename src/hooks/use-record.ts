import { useMemo } from 'react';

import { fetchRecords } from '@/services/records/record.fetch';
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

export function useRecord(userId: string, date: Date, recordId: string) {
    const { data: records, isLoading, isError } = useRecords(userId, date);

    // Use useMemo to optimize re-computation of the record
    const record = useMemo(() => {
        return records?.find((r) => r.id === recordId) || null;
    }, [records, recordId]);

    return { record, isLoading, isError };
}
