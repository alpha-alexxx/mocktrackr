import axiosClient from '@/lib/axios-client';
import { Record } from '@/prisma';
import { FormData } from '@/stores/form-store';

import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';

export interface RecordItem extends Record {
    user: {
        name: string;
    };
}

export const fetchRecords = async (userId: string, date: Date, recordId?: string): Promise<RecordItem[]> => {
    const isoDate = formatInTimeZone(
        new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
        'UTC',
        'yyyy-MM-dd'
    );
    try {
        const response = await axiosClient.get<{ success: boolean; records: RecordItem[]; message: string }>(
            '/api/record',
            {
                params: { userId, date: isoDate, recordId }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch records');
        }

        return response.data.records;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message, error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to fetch records');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

export const fetchRecord = async (userId: string, date: Date, recordId: string): Promise<RecordItem | null> => {
    const isoDate = formatInTimeZone(
        new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
        'UTC',
        'yyyy-MM-dd'
    );

    try {
        const response = await axiosClient.get<{ success: boolean; records: RecordItem; message: string }>(
            '/api/record',
            {
                params: { userId, date: isoDate, recordId }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch records');
        }

        return response.data.records;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message, error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to fetch records');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

export const createRecord = async (formData: FormData) => {
    const res = await axiosClient.post('/api/record', formData);

    return res.data;
};

export const updateRecord = async ({ recordId, formData }: { recordId: string; formData: FormData }) => {
    const res = await axiosClient.put(`/api/record?recordId=${recordId}`, formData);

    return res.data;
};

export const fetchMarkedDates = async (): Promise<string[]> => {
    try {
        const res = await axios.get<{ dates: string[] }>('/api/record/only-date');

        return res.data.dates || [];
    } catch (error) {
        console.error('Axios fetch failed:', error);
        throw new Error('Failed to fetch available records');
    }
};
