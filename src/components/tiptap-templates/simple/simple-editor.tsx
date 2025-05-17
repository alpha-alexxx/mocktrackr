'use client';

import * as React from 'react';

// --- Custom Extensions ---
import { Link } from '@/components/tiptap-extension/link-extension';
import { Selection } from '@/components/tiptap-extension/selection-extension';
import { TrailingNode } from '@/components/tiptap-extension/trailing-node-extension';
// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/components/tiptap-icons/link-icon';
// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button';
import { Spacer } from '@/components/tiptap-ui-primitive/spacer';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar';
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu';
import { HighlightContent, HighlightPopover, HighlighterButton } from '@/components/tiptap-ui/highlight-popover';
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover';
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu';
import { MarkButton } from '@/components/tiptap-ui/mark-button';
import { NodeButton } from '@/components/tiptap-ui/node-button';
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button';
// --- Hooks ---
import { useMobile } from '@/hooks/use-mobile';
import { useWindowSize } from '@/hooks/use-window-size';
// --- Lib ---
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
// Table Extensions
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';

/* eslint-disable no-unused-vars */

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    isMobile
}: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
}) => {
    return (
        <>
            <Spacer />

            <ToolbarGroup>
                <UndoRedoButton action='undo' />
                <UndoRedoButton action='redo' />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4, 5, 6]} />
                <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
                <NodeButton type='blockquote' />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type='bold' />
                <MarkButton type='italic' />
                <MarkButton type='strike' />
                <MarkButton type='code' />
                <MarkButton type='underline' />
                {!isMobile ? <HighlightPopover /> : <HighlighterButton onClick={onHighlighterClick} />}
                {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type='superscript' />
                <MarkButton type='subscript' />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align='left' />
                <TextAlignButton align='center' />
                <TextAlignButton align='right' />
                <TextAlignButton align='justify' />
            </ToolbarGroup>

            <ToolbarSeparator />
            <Spacer />
            {isMobile && <ToolbarSeparator />}
        </>
    );
};

const MobileToolbarContent = ({ type, onBack }: { type: 'highlighter' | 'link'; onBack: () => void }) => (
    <>
        <ToolbarGroup>
            <Button data-style='ghost' onClick={onBack}>
                <ArrowLeftIcon className='tiptap-button-icon' />
                {type === 'highlighter' ? (
                    <HighlighterIcon className='tiptap-button-icon' />
                ) : (
                    <LinkIcon className='tiptap-button-icon' />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === 'highlighter' ? <HighlightContent /> : <LinkContent />}
    </>
);

export interface SimpleEditorProps {
    /**
     * Initial content for the editor
     */
    initialContent: string;
    /**
     * Callback when content changes
     */
    onChange?: (content: string) => void;
    /**
     * Placeholder text when empty
     */
    placeholder?: string;
}

export function SimpleEditor({ initialContent, onChange, placeholder }: SimpleEditorProps) {
    const isMobile = useMobile();
    const windowSize = useWindowSize();
    const [mobileView, setMobileView] = React.useState<'main' | 'highlighter' | 'link'>('main');
    const [rect, setRect] = React.useState<Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>>({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });
    const toolbarRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const updateRect = () => {
            setRect(document.body.getBoundingClientRect());
        };

        updateRect();

        const resizeObserver = new ResizeObserver(updateRect);
        resizeObserver.observe(document.body);

        window.addEventListener('scroll', updateRect);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('scroll', updateRect);
        };
    }, [initialContent]);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                'aria-label': 'Main content area, start typing to enter text.',
                placeholder: placeholder || 'Start typing...'
            },
            // Add performance optimizations
            handleDOMEvents: {
                keydown: () => {
                    // Return false to prevent TipTap from re-rendering on every keydown
                    // This improves typing performance significantly
                    return false;
                }
            }
        },
        extensions: [
            StarterKit.configure({
                codeBlock: false
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            TaskList,
            Table.configure({
                resizable: true
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Typography,
            Superscript,
            Subscript,
            Selection,
            TrailingNode,
            Link.configure({ openOnClick: false })
        ],
        content: initialContent ? JSON.parse(initialContent) : { type: 'doc', content: [] }
    });

    // Add effect to emit content changes with debouncing
    React.useEffect(() => {
        if (editor && onChange) {
            // Create a debounced version of the update handler
            let timeoutId: NodeJS.Timeout | null = null;

            const handleUpdate = () => {
                // Clear any existing timeout
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // Set a new timeout to delay the update
                timeoutId = setTimeout(() => {
                    const json = editor.getJSON();
                    onChange(JSON.stringify(json));
                }, 250); // 250ms debounce delay - adjust as needed for balance between responsiveness and performance
            };

            // Listen for content changes
            editor.on('update', handleUpdate);

            return () => {
                // Clean up: remove event listener and clear any pending timeout
                editor.off('update', handleUpdate);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
    }, [editor, onChange]);

    React.useEffect(() => {
        const checkCursorVisibility = () => {
            if (!editor || !toolbarRef.current) return;

            const { state, view } = editor;
            if (!view.hasFocus()) return;

            const { from } = state.selection;
            const cursorCoords = view.coordsAtPos(from);

            if (windowSize.height < rect.height) {
                if (cursorCoords && toolbarRef.current) {
                    const toolbarHeight = toolbarRef.current.getBoundingClientRect().height;
                    const isEnoughSpace = windowSize.height - cursorCoords.top - toolbarHeight > 0;

                    // If not enough space, scroll until the cursor is the middle of the screen
                    if (!isEnoughSpace) {
                        const scrollY = cursorCoords.top - windowSize.height / 2 + toolbarHeight;
                        window.scrollTo({
                            top: scrollY,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        };

        checkCursorVisibility();
    }, [editor, rect.height, windowSize.height]);

    React.useEffect(() => {
        if (!isMobile && mobileView !== 'main') {
            setMobileView('main');
        }
    }, [isMobile, mobileView]);

    return (
        <EditorContext.Provider value={{ editor }}>
            <div style={{ position: 'relative', maxHeight: '100%' }}>
                <Toolbar
                    ref={toolbarRef}
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        ...(isMobile
                            ? {
                                  bottom: `calc(100% - ${windowSize.height - rect.y}px)`
                              }
                            : {})
                    }}>
                    {mobileView === 'main' ? (
                        <MainToolbarContent
                            onHighlighterClick={() => setMobileView('highlighter')}
                            onLinkClick={() => setMobileView('link')}
                            isMobile={isMobile}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
                            onBack={() => setMobileView('main')}
                        />
                    )}
                </Toolbar>

                <div className='content-wrapper' style={{ maxHeight: '100%', overflow: 'visible' }}>
                    <EditorContent
                        editor={editor}
                        role='presentation'
                        className='simple-editor-content control-showcase'
                    />
                </div>
            </div>
        </EditorContext.Provider>
    );
}
