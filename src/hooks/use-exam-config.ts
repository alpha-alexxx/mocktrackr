/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { getExamConfig } from '@/lib/utils';
import { useFormStore } from '@/stores/form-store';

import { useIsClient } from './use-is-client';

export const useExamConfig = (passedExamCode?: string, passedExamTier?: string) => {
    const [selectedExam, setSelectedExam] = useState<any>();
    const { formData } = useFormStore();
    const isClient = useIsClient();

    const examCode = passedExamCode || formData.examCode;
    const examTier = passedExamTier || formData.examTier;

    useEffect(() => {
        if (isClient && examCode && examTier) {
            const exam = getExamConfig(examCode, examTier);
            setSelectedExam(exam);
        }
    }, [examCode, examTier, isClient]);

    return selectedExam;
};
