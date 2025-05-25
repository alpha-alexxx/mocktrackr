import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

type Resolver = () => void;

// Configuration
const MAX_CONCURRENT_REQUESTS = 5;
const REQUEST_DELAY = 150; // Optional delay between requests (in ms)
const RETRY_COUNT = 3;
const RETRY_STATUS_CODES = [429, 503, 504];

let activeRequests = 0;
const queue: Resolver[] = [];

// Helper: Wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Concurrency Controller
async function enqueue(): Promise<void> {
    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
        activeRequests++;

        return;
    }

    await new Promise<void>((resolve) => queue.push(resolve));
    activeRequests++;
}

function dequeue(): void {
    activeRequests--;
    if (queue.length > 0) {
        const next = queue.shift();
        if (next) next();
    }
}

// Retry Logic with Backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = RETRY_COUNT, delayMs = 500): Promise<T> {
    try {
        return await fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const status = error?.response?.status;
        if (retries > 0 && RETRY_STATUS_CODES.includes(status)) {
            console.warn(`[Axios Retry]: Retrying request... [${RETRY_COUNT - retries + 1}]`);
            await delay(delayMs * 2); // Exponential backoff

            return retryWithBackoff(fn, retries - 1, delayMs * 2);
        }
        throw error;
    }
}

// Axios Client
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '', // Safe for SSR and CSR
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        await enqueue();

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    async (response: AxiosResponse) => {
        await delay(REQUEST_DELAY);
        dequeue();

        return response;
    },
    async (error) => {
        dequeue();

        const originalRequest = error.config;

        // If eligible for retry
        if (RETRY_STATUS_CODES.includes(error?.response?.status) && !originalRequest.__isRetryRequest) {
            originalRequest.__isRetryRequest = true;

            return retryWithBackoff(() => axiosClient(originalRequest));
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
