'use client';

import DOMPurify from 'dompurify';

export default function RenderHTML({ html, className }: { html: string; className?: string }) {
    const cleanHtml = DOMPurify.sanitize(html);

    return (
        <div className={className}>
            <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
        </div>
    );
}
