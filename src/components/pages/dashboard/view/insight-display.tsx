import TiptapViewer from '@/components/app-ui/tiptap-viewer';
import { cn } from '@/lib/utils';

export default function InsightDisplay({ content, className }: { className?: string; content: string }) {
    return (
        <div
            className={cn(
                'border-foreground/20 max-h-[400px] w-full overflow-y-auto rounded-md border-2 p-4',
                className
            )}>
            <TiptapViewer content={content} />
        </div>
    );
}
