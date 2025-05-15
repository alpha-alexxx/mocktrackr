/* eslint-disable no-unused-vars */
import { create } from 'zustand';

const useDatePicker = create<{
    date: Date;
    setDate: (date: Date) => void;
}>((set) => ({
    date: new Date(),
    setDate: (date: Date) => {
        if (date === undefined) {
            set({ date });

            return;
        }
        const minDate = new Date(2020, 0, 1); // Jan 1, 2020
        const maxDate = new Date(); // today
        if (date < minDate) {
            set({ date: minDate });
        } else if (date > maxDate) {
            set({ date: maxDate });
        } else {
            set({ date });
        }
    }
}));

export default useDatePicker;
