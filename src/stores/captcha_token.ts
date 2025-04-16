import { create } from 'zustand';

const useCaptchaToken = create<{ captchaToken: string; setToken: (captchaToken: string) => void }>((set) => ({
    captchaToken: '',
    setToken: (captchaToken: string) => set({ captchaToken })
}));
export default useCaptchaToken;
