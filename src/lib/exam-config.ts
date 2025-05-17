export type SubjectConfig = {
    name: string;
    totalQuestions: number;
    totalMarks: number;
};

export type SectionConfig = {
    name: string;
    durationMinutes: number;
    totalMarks: number;
    totalQuestions: number;
    isQualifying: boolean;
    subjects: SubjectConfig[];
};

export type TierConfig = {
    durationMinutes: number;
    totalQuestions: number;
    totalMarks: number;
    negativeMarking: boolean;
    correctMark: number;
    negativeMark: number;
    subjects?: SubjectConfig[];
    sections?: SectionConfig[];
};

export type ExamConfig = {
    examName: string;
    examCode: string;
    hasTier: boolean;
    durationMinutes?: number;
    totalMarks?: number;
    totalQuestions?: number;
    negativeMarking?: boolean;
    correctMark?: number;
    negativeMark?: number;
    sections?: SectionConfig[];
    tier1?: TierConfig;
    tier2?: TierConfig;
};

export const exam_config = [
    {
        examName: 'Multi Tasking Staff (MTS)',
        examCode: 'ssc_mts',
        hasTier: false,
        durationMinutes: 90,
        totalMarks: 150,
        totalQuestions: 75,
        negativeMarking: true,
        correctMark: 3,
        negativeMark: 1,
        sections: [
            {
                name: 'Section 1',
                durationMinutes: 45,
                totalMarks: 120,
                totalQuestions: 40,
                isQualifying: true,
                subjects: [
                    {
                        name: 'Quantitative Aptitude',
                        totalQuestions: 20,
                        totalMarks: 60
                    },
                    {
                        name: 'Reasoning',
                        totalQuestions: 20,
                        totalMarks: 60
                    }
                ]
            },
            {
                name: 'Section 2',
                durationMinutes: 45,
                totalMarks: 150,
                totalQuestions: 50,
                isQualifying: false,
                subjects: [
                    {
                        name: 'General Awareness',
                        totalQuestions: 25,
                        totalMarks: 75
                    },
                    {
                        name: 'English Comprehension',
                        totalQuestions: 25,
                        totalMarks: 75
                    }
                ]
            }
        ]
    },
    {
        examName: 'SSC Combined Graduate Level Examination(CGL)',
        examCode: 'ssc_cgl',
        hasTier: true,
        tier1: {
            durationMinutes: 60,
            totalQuestions: 100,
            totalMarks: 200,
            negativeMarking: true,
            correctMark: 2,
            negativeMark: 0.5,
            subjects: [
                { name: 'Quantitative Aptitude	', totalQuestions: 25, totalMarks: 50 },
                { name: 'Reasoning', totalQuestions: 25, totalMarks: 50 },
                { name: 'General Awareness', totalQuestions: 25, totalMarks: 50 },
                { name: 'English Comprehension', totalQuestions: 25, totalMarks: 50 }
            ]
        },
        tier2: {
            durationMinutes: 135,
            totalMarks: 390,
            totalQuestions: 130,
            negativeMarking: true,
            correctMark: 3,
            negativeMark: 1,
            sections: [
                {
                    name: 'Section I',
                    durationMinutes: 60,
                    totalMarks: 180,
                    totalQuestions: 60,
                    isQualifying: false,
                    subjects: [
                        {
                            name: 'Quantitative Aptitude',
                            totalQuestions: 30,
                            totalMarks: 90
                        },
                        {
                            name: 'Reasoning',
                            totalQuestions: 30,
                            totalMarks: 90
                        }
                    ]
                },
                {
                    name: 'Section II',
                    durationMinutes: 60,
                    totalMarks: 210,
                    totalQuestions: 70,
                    isQualifying: false,
                    subjects: [
                        {
                            name: 'English Comprehension',
                            totalQuestions: 45,
                            totalMarks: 135
                        },
                        {
                            name: 'General Awareness',
                            totalQuestions: 25,
                            totalMarks: 75
                        }
                    ]
                },
                {
                    name: 'Section III',
                    durationMinutes: 15,
                    totalMarks: 60,
                    totalQuestions: 20,
                    isQualifying: true,
                    subjects: [
                        {
                            name: 'Computer Knowledge',
                            totalQuestions: 20,
                            totalMarks: 60
                        }
                    ]
                }
            ]
        }
    },
    {
        examName: 'SSC Combined Higher Secondary Level Examination(CHSL)',
        examCode: 'ssc_chsl',
        hasTier: true,
        tier1: {
            durationMinutes: 60,
            totalQuestions: 100,
            totalMarks: 200,
            negativeMarking: true,
            correctMark: 2,
            negativeMark: 0.5,
            subjects: [
                {
                    name: 'Quantitative Aptitude',
                    totalQuestions: 25,
                    totalMarks: 50
                },
                {
                    name: 'Reasoning',
                    totalQuestions: 25,
                    totalMarks: 50
                },
                {
                    name: 'General Awareness',
                    totalQuestions: 25,
                    totalMarks: 50
                },
                {
                    name: 'English Comprehension',
                    totalQuestions: 25,
                    totalMarks: 50
                }
            ]
        },
        tier2: {
            durationMinutes: 135,
            totalMarks: 360,
            totalQuestions: 120,
            negativeMarking: true,
            correctMark: 3,
            negativeMark: 1,
            sections: [
                {
                    name: 'Section I',
                    durationMinutes: 60,
                    totalMarks: 180,
                    totalQuestions: 60,
                    isQualifying: false,
                    subjects: [
                        {
                            name: 'Quantitative Aptitude',
                            totalQuestions: 30,
                            totalMarks: 90
                        },
                        {
                            name: 'Reasoning',
                            totalQuestions: 30,
                            totalMarks: 90
                        }
                    ]
                },
                {
                    name: 'Section II',
                    durationMinutes: 60,
                    totalMarks: 180,
                    totalQuestions: 60,
                    isQualifying: false,
                    subjects: [
                        {
                            name: 'English Comprehension',
                            totalQuestions: 40,
                            totalMarks: 120
                        },
                        {
                            name: 'General Awareness',
                            totalQuestions: 20,
                            totalMarks: 60
                        }
                    ]
                },
                {
                    name: 'Section III',
                    durationMinutes: 15,
                    totalMarks: 45,
                    totalQuestions: 15,
                    isQualifying: true,
                    subjects: [
                        {
                            name: 'Computer Knowledge',
                            totalQuestions: 15,
                            totalMarks: 45
                        }
                    ]
                }
            ]
        }
    },
    {
        examName: 'SSC Central Police Organization Examination(CPO)',
        examCode: 'ssc_cpo',
        hasTier: true,
        tier1: {
            durationMinutes: 120,
            totalQuestions: 200,
            totalMarks: 200,
            negativeMarking: true,
            correctMark: 1,
            negativeMark: 0.25,
            subjects: [
                { name: 'Quantitative Aptitude', totalQuestions: 50, totalMarks: 50 },
                { name: 'Reasoning', totalQuestions: 50, totalMarks: 50 },
                { name: 'General Awareness', totalQuestions: 50, totalMarks: 50 },
                { name: 'English Comprehension', totalQuestions: 50, totalMarks: 50 }
            ]
        },
        tier2: {
            durationMinutes: 120,
            totalQuestions: 200,
            totalMarks: 200,
            isQualifying: false,
            negativeMarking: true,
            correctMark: 1,
            negativeMark: 0.25,

            subjects: [
                {
                    name: 'English Comprehension',
                    totalQuestions: 200,
                    totalMarks: 200
                }
            ]
        }
    }
];
