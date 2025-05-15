import axios from 'axios';

let isRequestInProgress = false;

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const axiosClient = axios.create({
    timeout: 20000, // 20 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        if (isRequestInProgress) {
            return Promise.reject(new Error('Too many requests. Please wait.'));
        }
        isRequestInProgress = true;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor

axiosClient.interceptors.response.use(
    async (response) => {
        await delay(2000); // 2-second wait
        isRequestInProgress = false;

        return response;
    },
    async (error) => {
        await delay(2000);
        isRequestInProgress = false;

        return Promise.reject(error);
    }
);
export default axiosClient;
