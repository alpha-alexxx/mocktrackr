import { Section } from '@/stores/form-store';
import type { JsonValue } from '@prisma/client/runtime/library';

export const purifySections = (sectionWise: JsonValue) => {
    const sections = isSectionArray(sectionWise) ? (sectionWise as Section[]) : [];

    return sections;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSectionArray(value: any): value is Section[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                item &&
                typeof item === 'object' &&
                typeof item.name === 'string' &&
                typeof item.totalQuestions === 'number' &&
                typeof item.attemptedQuestions === 'number' &&
                typeof item.correctAnswers === 'number' &&
                typeof item.wrongAnswers === 'number' &&
                typeof item.skippedQuestions === 'number' &&
                typeof item.timeTaken === 'string' &&
                typeof item.obtainedMarks === 'number' &&
                typeof item.correctMarks === 'number' &&
                typeof item.wrongMarks === 'number' &&
                (typeof item.keyPoints === 'string' || typeof item.keyPoints === 'undefined') &&
                (typeof item.sectionLearnings === 'string' || typeof item.sectionLearnings === 'undefined')
        )
    );
}
