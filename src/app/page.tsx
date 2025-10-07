"use client";

import { EditorLayout } from "@/components/editor/EditorLayout";
import { Toolbar } from "@/components/editor/Toolbar";
import { BlogPreview } from "@/components/preview/BlogPreview";
import { useBlogBuilderStore } from "@/stores/builder/blogBuilderStore";

export default function Home() {
    const isPreviewMode = useBlogBuilderStore((s) => s.isPreviewMode);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Toolbar />
            {isPreviewMode ? <BlogPreview /> : <EditorLayout />}
        </div>
    );
}
