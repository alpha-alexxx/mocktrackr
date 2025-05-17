import { exam_config } from './exam-config';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getExamConfig(examCode: string, examTier?: string) {
    const exam = exam_config.find((e) => e.examCode === examCode);
    if (!exam) {
        return null;
    }
    if (!exam.hasTier) {
        return { ...exam, examName: exam.examName, hasTier: false, examCode, examTier };
    }

    if (examTier === 'TIER_1') {
        return { ...exam.tier1, examName: exam.examName, examCode, examTier };
    } else if (examTier === 'TIER_2') {
        return { ...exam.tier2, examName: exam.examName, examCode, examTier };
    }

    return null;
}

export function getSectionSubjects(examCode: string, examTier?: string) {
    const exam = exam_config.find((e) => e.examCode === examCode);

    if (!exam) {
        return [];
    }

    if (!exam.hasTier) {
        // For exams without tiers, check if they have sections
        if (exam.sections) {
            // Flatten all subjects from all sections
            return exam.sections.flatMap((section) =>
                section.subjects.map((subject) => ({
                    ...subject,
                    isQualifying: section.isQualifying
                }))
            );
        }

        return [];
    }

    if (examTier === 'TIER_1' && exam.tier1) {
        // For Tier 1, check if it has subjects directly
        if (exam.tier1.subjects) {
            return exam.tier1.subjects;
        }

        return [];
    } else if (examTier === 'TIER_2' && exam.tier2) {
        // For Tier 2, check if it has sections or subjects
        if (exam.tier2.sections) {
            // Flatten all subjects from all sections
            return exam.tier2.sections.flatMap((section) =>
                section.subjects.map((subject) => ({
                    ...subject,
                    isQualifying: section.isQualifying
                }))
            );
        } else if (exam.tier2.subjects) {
            return exam.tier2.subjects.map((subject) => ({
                ...subject,
                isQualifying: true
            }));
        }

        return [];
    }

    return [];
}

export function formatTime(time: number | string): string {
    let totalMinutes: number;

    // If the input is a string in hh:mm:ss format, parse it
    if (typeof time === 'string') {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        totalMinutes = hours * 60 + minutes + seconds / 60;
    } else {
        totalMinutes = time;
    }

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.floor(totalMinutes % 60);
    const remainingSeconds = Math.round((totalMinutes - Math.floor(totalMinutes)) * 60);

    // Format the parts
    const hourPart = hours > 0 ? `${hours} Hr${hours > 1 ? 's' : ''}. ` : '';
    const minutePart = remainingMinutes > 0 ? `${remainingMinutes} Min${remainingMinutes > 1 ? 's' : ''}. ` : '';
    const secondPart = remainingSeconds > 0 ? `${remainingSeconds} Sec${remainingSeconds > 1 ? 's' : ''}.` : '';

    // Combine all the parts, if they exist
    return hourPart + minutePart + secondPart || '0 Mins.';
}

export function parseTimeFromMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes - Math.floor(totalMinutes)) * 60);

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}
