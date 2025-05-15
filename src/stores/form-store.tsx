/* eslint-disable no-unused-vars */
import { ExamTier } from '@/prisma';

import Dexie from 'dexie';
import type { Table } from 'dexie';
import { v4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Represents a toast notification message.
 */
export interface ToastMessage {
    /** The type of toast message: 'error', 'success', or 'warning'. */
    type: 'error' | 'success' | 'warning';
    /** The message content to display. */
    message: string;
}

/**
 * Represents detailed information about a test section.
 */
export interface Section {
    /** The name of the section. */
    name: string;
    /** Total number of questions in the section. */
    totalQuestions: number;
    /** Number of questions attempted. */
    attemptedQuestions: number;
    /** Number of correctly answered questions. */
    correctAnswers: number;
    /** Number of incorrectly answered questions. */
    wrongAnswers: number;
    /** Number of questions skipped. */
    skippedQuestions: number;
    /** Time taken for the section (e.g., "HH:MM:SS"). */
    timeTaken: string;
    /** Marks obtained in this section. */
    obtainedMarks: number;
    /**Total Marks the student can get in one section */
    totalMarks: number;
    /** Marks awarded for correct answers. */
    correctMarks: number;
    /** Marks deducted for wrong answers.*/
    wrongMarks: number;
    /** Key points or highlights from the section. */
    keyPoints?: string;
    /** Learnings or insights from the section. */
    sectionLearnings?: string;
}

/**
 * Represents the form data for a test record.
 */
export interface FormData {
    /** Name of the test. */
    testName?: string;
    /** Date when the test was taken. */
    testDate?: Date | string;
    /** Name of the exam. */
    examName?: string;
    /** Code associated with the exam. */
    examCode?: string;
    /** Tier of the exam. */
    examTier?: ExamTier;
    /** Platform where the test was taken. */
    testPlatform?: string;
    /** Link to the test. */
    testLink?: string;
    /** Total number of questions. */
    totalQuestions?: number;
    /** Total number of correct answers. */
    totalCorrectQuestions?: number;
    /** Total number of wrong answers. */
    totalWrongQuestions?: number;
    /** Total number of skipped questions. */
    totalSkippedQuestions?: number;
    /** Maximum marks for the test. */
    totalMarks?: number;
    /** Marks obtained by the user. */
    obtainedMarks?: number;
    /** Marks awarded for correct answers. */
    totalCorrectMarks?: number;
    /** Marks deducted for wrong answers. */
    totalWrongMarks?: number;
    /** Total time allocated for the test (HH:MM:SS). */
    totalTime?: string;
    /** Total time taken by the user (HH:MM:SS). */
    totalTimeTaken?: string;
    /** Percentile achieved. */
    percentile?: number;
    /** Rank achieved. */
    rank?: string;
    /** Section-wise breakdown of results. */
    sectionWise?: Section[];
    /** Key points from the test. */
    keyPoints?: string;
    /** Overall learnings. */
    learnings?: string;
}

/**
 * Represents a draft record stored in IndexedDB.
 */
export interface DraftRecord extends FormData {
    /** Unique identifier for the draft. */
    id: string;
    /** Timestamp when the draft was saved. */
    savedAt: Date;
    /** Timestamp when the draft was last updated. */
    updatedAt?: Date;
    /** Indicates if the draft has been synced online. */
    isSavedOnline: boolean;
}

/**
 * Dexie.js database class for managing draft records.
 */
class DraftDatabase extends Dexie {
    /** Table storing DraftRecord entries. */
    drafts!: Table<DraftRecord, string>;

    /**
     * Initializes the IndexedDB database and schema.
     */
    constructor() {
        super('DraftDatabase');
        this.version(1).stores({ drafts: 'id, savedAt' });
    }
}

/** Singleton instance of the DraftDatabase. */
const db = new DraftDatabase();

/**
 * Cleans up old drafts by:
 * 1. Keeping only the latest 10 entries.
 * 2. Removing drafts older than 10 days.
 * @async
 * @returns {Promise<void>} Resolves when cleanup completes.
 */
async function cleanupOldDrafts(): Promise<void> {
    try {
        let drafts = await db.drafts.orderBy('savedAt').toArray();
        if (drafts.length > 10) {
            const toDelete = drafts.slice(0, drafts.length - 10);
            await Promise.all(toDelete.map((d) => db.drafts.delete(d.id)));
        }
        const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
        drafts = await db.drafts.toArray();
        const oldDrafts = drafts.filter((d) => d.savedAt < tenDaysAgo);
        await Promise.all(oldDrafts.map((d) => db.drafts.delete(d.id)));
    } catch (error) {
        console.error('Failed to clean up drafts:', error);
    }
}

/**
 * Zustand store state and actions for form and draft management.
 */
interface FormState {
    /**
     * Current step in the form (1-4).
     * @type {number}
     */
    currentStep: number;
    /**
     * Form data object containing user inputs.
     * @type {FormData}
     */
    formData: FormData;
    /**
     * Indicates if the draft is saved.
     * @type {boolean}
     */
    isDraftSaved: boolean;
    /**
     * State for showing drafts in UI. Related with @function setShowDrafts.
     * @function setShowDrafts
     * @param {boolean} value - True to show drafts, false to hide.
     * @type {boolean}
     */
    showDrafts: boolean;
    /**
     * Unique identifier for the current draft.
     * @type {string | undefined}
     */
    draftId?: string;
    /**
     * Toggles draft list visibility.
     * @param {boolean} value - True to show drafts, false to hide.
     */
    setShowDrafts: (value: boolean) => void;
    /**
     * Sets the current form step.
     * @param {number} step - Step index (1-4).
     */
    setCurrentStep: (step: number) => void;
    /**
     * Updates the form data with partial values.
     * @param {Partial<FormData>} data - Partial form fields to merge.
     */
    updateFormData: (data: Partial<FormData>) => void;
    /**
     * Resets form and draft state to initial values.
     */
    resetForm: () => void;
    /**
     * Saves current formData as a draft in IndexedDB.
     * @param {Date} [date] - Optional timestamp override for savedAt.
     * @returns {Promise<ToastMessage>} Success or warning/error message.
     */
    saveDraft: (date?: Date) => Promise<ToastMessage>;
    /**
     * Lists draft records, optionally filtered by a specific date.
     * @param {Date} [date] - If provided, returns drafts saved on this date only.
     * @returns {Promise<DraftRecord[]>} Array of matching drafts.
     */
    listDraftRecords: (date?: Date) => Promise<DraftRecord[]>;
    /**
     * Marks a draft as saved online and removes it locally.
     * @param {string} id - Identifier of the draft to mark.
     * @returns {Promise<void>}
     */
    markDraftAsSavedOnline: (id: string) => Promise<void>;
    /**
     * Deletes all drafts from IndexedDB.
     * @returns {Promise<void>}
     */
    deleteAllDrafts: () => Promise<void>;
    /**
     * Deletes a single draft by its ID.
     * @param {string} id - Identifier of the draft to delete.
     * @returns {Promise<ToastMessage>} Success or error message.
     */
    deleteDraft: (id: string) => Promise<ToastMessage>;
    /**
     * Loads a draft by ID into the form state.
     * @param {string} id - Identifier of the draft.
     * @returns {Promise<DraftRecord | undefined>} Loaded draft or undefined.
     */
    getDraftById: (id: string) => Promise<DraftRecord | undefined>;
    /**
     * Validates the current form step before proceeding.
     * @returns {boolean} True if fields for current step are valid.
     */
    validateCurrentStep: () => boolean;
}

/**
 * Zustand store for managing form state and draft records.
 * @module useFormStore
 */

export const useFormStore = create<FormState>()(
    persist(
        (set, get) => ({
            showDrafts: false,
            currentStep: 1,
            draftId: undefined,
            formData: {},
            isDraftSaved: false,

            setCurrentStep: (step) => set({ currentStep: step }),

            updateFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data },
                    isDraftSaved: false
                })),

            resetForm: () =>
                set({
                    currentStep: 1,
                    draftId: undefined,
                    formData: {},
                    isDraftSaved: false
                }),

            saveDraft: async (date?: Date) => {
                const data = get().formData;
                const id = get().draftId || v4();
                const savedAt = date || new Date();

                try {
                    if (!data.examName || !data.examCode) {
                        set({ isDraftSaved: false });

                        return { type: 'warning', message: 'Cannot save draft. Exam Name is required.' };
                    }

                    set({ isDraftSaved: true, draftId: id });

                    const updated = await db.drafts.update(id, {
                        ...data,
                        updatedAt: new Date(),
                        isSavedOnline: false
                    });

                    if (updated === 0) {
                        // If no existing draft was updated, add a new one
                        await db.drafts.add({
                            ...data,
                            id,
                            savedAt,
                            updatedAt: new Date(),
                            isSavedOnline: false
                        });
                    }

                    await cleanupOldDrafts();

                    return { type: 'success', message: 'Record Draft Saved Successfully.' };
                } catch (error) {
                    console.error('Failed to save draft:', error);
                    set({ isDraftSaved: false });

                    return { type: 'error', message: 'Failed to save draft due to an error.' };
                }
            },

            listDraftRecords: async (date?: Date) => {
                try {
                    let allDrafts = await db.drafts.orderBy('savedAt').reverse().toArray();
                    if (date) {
                        const targetDate = (date as Date).toDateString();
                        allDrafts = allDrafts.filter((d) => new Date(d.savedAt).toDateString() === targetDate);
                    }

                    return allDrafts;
                } catch (error) {
                    console.error('Failed to list drafts:', error);

                    return [];
                }
            },

            markDraftAsSavedOnline: async (id: string) => {
                try {
                    const draft = await db.drafts.get(id);
                    if (draft) {
                        draft.isSavedOnline = true;
                        await db.drafts.put(draft);
                        await db.drafts.delete(id);
                    }
                } catch (error) {
                    console.error('Failed to mark draft as saved online:', error);
                }
            },

            deleteAllDrafts: async () => {
                try {
                    await db.drafts.clear();
                } catch (error) {
                    console.error('Failed to delete all drafts:', error);
                }
            },

            deleteDraft: async (id: string): Promise<ToastMessage> => {
                try {
                    await db.drafts.delete(id);

                    return { type: 'success', message: 'Draft deleted successfully' };
                } catch (error) {
                    // Check if the error is an instance of Error to avoid potential undefined values
                    if (error instanceof Error) {
                        console.error('Failed to delete draft:', error.message);

                        return { type: 'error', message: error.message || 'Failed to delete draft' };
                    } else {
                        // For cases where the error might not be an instance of Error
                        console.error('Failed to delete draft:', error);

                        return { type: 'error', message: 'An unknown error occurred while deleting the draft' };
                    }
                }
            },
            getDraftById: async (id: string) => {
                try {
                    const draft = await db.drafts.get(id);
                    if (draft) {
                        // Remove meta fields like id, savedAt, isSavedOnline, updatedAt before loading into formData
                        const { id: _, savedAt, updatedAt, isSavedOnline, ...formData } = draft;
                        set({ formData, isDraftSaved: true, draftId: id });

                        return draft;
                    }

                    return undefined;
                } catch (error) {
                    console.error('Failed to get draft by ID:', error);

                    return undefined;
                }
            },
            setShowDrafts: (value) => {
                set({ showDrafts: value });
            },
            validateCurrentStep: () => {
                const { currentStep, formData } = get();
                switch (currentStep) {
                    case 1:
                        return !!(
                            formData.testName &&
                            formData.testDate &&
                            formData.examCode &&
                            formData.testPlatform &&
                            (formData.examCode === 'ssc_mts' || formData.examTier)
                        );

                    case 2:
                        return !!(
                            formData.totalQuestions &&
                            formData.totalCorrectQuestions !== undefined &&
                            formData.totalWrongQuestions !== undefined &&
                            formData.totalMarks &&
                            formData.totalTime &&
                            formData.totalTimeTaken
                        );

                    case 3:
                        if (!formData.sectionWise || formData.sectionWise.length === 0) {
                            return false;
                        }

                        return formData.sectionWise.every(
                            (section) =>
                                section.totalQuestions > 0 &&
                                section.attemptedQuestions !== undefined &&
                                section.correctAnswers !== undefined &&
                                section.wrongAnswers !== undefined &&
                                section.timeTaken
                        );

                    case 4:
                        return true;

                    default:
                        return false;
                }
            }
        }),
        {
            name: 'test-record-form',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
