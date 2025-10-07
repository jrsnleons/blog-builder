// src/components/editor/Toolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    copyHTMLToClipboard,
    downloadHTMLFile,
    generateHTML,
} from "@/lib/htmlExport";
import { useBlogBuilderStore } from "@/stores/builder/blogBuilderStore";
import { ChevronDown, Clipboard, Download, Edit3, Eye } from "lucide-react";
import { toast } from "sonner";

export function Toolbar() {
    const setEmpty = useBlogBuilderStore((s) => s.deleteComponent);
    const components = useBlogBuilderStore((s) => s.components);
    const isPreviewMode = useBlogBuilderStore((s) => s.isPreviewMode);
    const setPreviewMode = useBlogBuilderStore((s) => s.setPreviewMode);

    function handleClear() {
        for (const c of components) setEmpty(c.id);
    }

    async function handleCopyToClipboard() {
        if (components.length === 0) {
            toast.error("No components to export");
            return;
        }

        const html = generateHTML(components);
        const success = await copyHTMLToClipboard(html);

        if (success) {
            toast.success("HTML copied to clipboard!");
        } else {
            toast.error("Failed to copy to clipboard");
        }
    }

    function handleDownloadFile() {
        if (components.length === 0) {
            toast.error("No components to export");
            return;
        }

        const html = generateHTML(components);
        downloadHTMLFile(html);
        toast.success("HTML file downloaded!");
    }

    return (
        <header className="border-b bg-background">
            <div className="mx-auto max-w-7xl p-3 flex items-center gap-2">
                <h2 className="font-semibold mr-auto">
                    {isPreviewMode ? "Preview" : "Editor"}
                </h2>
                <Button
                    variant={isPreviewMode ? "default" : "secondary"}
                    onClick={() => setPreviewMode(!isPreviewMode)}
                    className="gap-2"
                >
                    {isPreviewMode ? (
                        <>
                            <Edit3 className="w-4 h-4" />
                            Edit
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4" />
                            Preview
                        </>
                    )}
                </Button>
                {!isPreviewMode && (
                    <>
                        <Button variant="secondary" onClick={handleClear}>
                            Clear
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="gap-2">
                                    Export HTML
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={handleCopyToClipboard}
                                    className="gap-2 cursor-pointer"
                                >
                                    <Clipboard className="w-4 h-4" />
                                    Copy to Clipboard
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDownloadFile}
                                    className="gap-2 cursor-pointer"
                                >
                                    <Download className="w-4 h-4" />
                                    Download as File
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>
        </header>
    );
}
