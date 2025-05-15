'use client';

import { memo, useMemo } from 'react';

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

export interface EditorProps {
    /** Current editor content as HTML */
    value: string;
    /** Placeholder text when empty */
    placeholder?: string;
    /** Change handler */
    // eslint-disable-next-line no-unused-vars
    onChange: (content: string) => void;
    /** Minimum height in px (or any CSS unit) */
    minHeight?: string | number;
}

// Using React.memo to prevent unnecessary re-renders
const Editor = memo(function Editor({
    value,
    onChange,
    placeholder = 'Share your thoughts…',
    minHeight = 150
}: EditorProps) {
    // Using useMemo for the editor configuration to avoid re-creating on each render
    const editorConfig = useMemo(
        () => ({
            initialContent: value,
            onChange,
            placeholder
        }),
        [value, onChange, placeholder]
    );

    return (
        <div
            className='bg-background rounded-2xl border-2 p-4 shadow-xs dark:border-white/20'
            style={{
                minHeight,
                maxHeight: '400px',
                overflow: 'auto',
                // Adding hardware acceleration for smoother scrolling
                transform: 'translateZ(0)',
                willChange: 'transform'
            }}>
            <SimpleEditor {...editorConfig} />
        </div>
    );
});

export default Editor;
