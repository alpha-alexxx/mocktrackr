'use client';

// __ Styles ends here
import { useEffect } from 'react';

import TrailingNode from '@/components/tiptap-extension/trailing-node-extension';
import { useIsClient } from '@/hooks/use-is-client';
import { Highlight } from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
// Table Extensions
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import Selection from '../tiptap-extension/selection-extension';

const TiptapViewer = ({ content }: { content: string }) => {
    const isClient = useIsClient();
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Table.configure({
                resizable: true
            }),
            TableRow,
            TableHeader,
            TableCell,
            Typography,
            Superscript,
            Subscript,
            Selection,
            TrailingNode,
            Link.configure({ openOnClick: false })
        ],
        editable: false,
        immediatelyRender: false
    });

    // Load content *after* editor initialized
    useEffect(() => {
        if (editor) {
            editor.commands.setContent(JSON.parse(content));
        }
    }, [editor, content]);

    if (!isClient) return null;

    return (
        <div>
            <EditorContent editor={editor} content={JSON.parse(content)} />
        </div>
    );
};

export default TiptapViewer;
