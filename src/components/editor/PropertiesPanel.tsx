"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBlogBuilderStore } from "@/stores/builder/blogBuilderStore";

export function PropertiesPanel() {
    const components = useBlogBuilderStore((s) => s.components);
    const selectedId = useBlogBuilderStore((s) => s.selectedComponent);
    const updateComponent = useBlogBuilderStore((s) => s.updateComponent);
    const updateChildComponent = useBlogBuilderStore(
        (s) => s.updateChildComponent
    );
    const updateCardChild = useBlogBuilderStore((s) => s.updateCardChild);
    const updateNestedCardChild = useBlogBuilderStore(
        (s) => s.updateNestedCardChild
    );

    // Find selected component - check top level and nested
    let selected = components.find((c) => c.id === selectedId);
    let parentId: string | null = null;
    let column: "left" | "right" | null = null;
    let isCardChild = false;
    let isNestedCardChild = false;
    let nestedCardParentId: string | null = null;

    // If not found at top level, search in children
    if (!selected) {
        for (const comp of components) {
            if (comp.children?.left) {
                const found = comp.children.left.find(
                    (c) => c.id === selectedId
                );
                if (found) {
                    selected = found;
                    parentId = comp.id;
                    column = "left";
                    break;
                }

                // Search in cardChildren of left column cards
                for (const child of comp.children.left) {
                    if (child.type === "card" && child.cardChildren) {
                        const nestedFound = child.cardChildren.find(
                            (c) => c.id === selectedId
                        );
                        if (nestedFound) {
                            selected = nestedFound;
                            parentId = comp.id;
                            column = "left";
                            nestedCardParentId = child.id;
                            isNestedCardChild = true;
                            break;
                        }
                    }
                }
                if (selected) break;
            }
            if (comp.children?.right) {
                const found = comp.children.right.find(
                    (c) => c.id === selectedId
                );
                if (found) {
                    selected = found;
                    parentId = comp.id;
                    column = "right";
                    break;
                }

                // Search in cardChildren of right column cards
                for (const child of comp.children.right) {
                    if (child.type === "card" && child.cardChildren) {
                        const nestedFound = child.cardChildren.find(
                            (c) => c.id === selectedId
                        );
                        if (nestedFound) {
                            selected = nestedFound;
                            parentId = comp.id;
                            column = "right";
                            nestedCardParentId = child.id;
                            isNestedCardChild = true;
                            break;
                        }
                    }
                }
                if (selected) break;
            }
            // Also search in cardChildren
            if (comp.cardChildren) {
                const found = comp.cardChildren.find(
                    (c) => c.id === selectedId
                );
                if (found) {
                    selected = found;
                    parentId = comp.id;
                    isCardChild = true;
                    break;
                }
            }
        }
    }

    if (!selected) {
        return (
            <aside className="w-80 border-l bg-background p-4 overflow-y-auto">
                <h3 className="text-sm font-semibold mb-2">Properties</h3>
                <p className="text-sm text-muted-foreground">
                    Select a component to edit its properties.
                </p>
            </aside>
        );
    }

    function updateContent(patch: Record<string, unknown>) {
        if (!selected) return;

        const updatedContent = {
            ...(typeof selected.content === "object" &&
            selected.content !== null
                ? selected.content
                : {}),
            ...patch,
        };

        // If it's a nested card child (inside card, inside two-column)
        if (parentId && column && nestedCardParentId && isNestedCardChild) {
            updateNestedCardChild(
                parentId,
                column,
                nestedCardParentId,
                selected.id,
                {
                    content: updatedContent,
                }
            );
        }
        // If it's a card child (top-level card)
        else if (parentId && isCardChild) {
            updateCardChild(parentId, selected.id, {
                content: updatedContent,
            });
        }
        // If it's a nested component in two-column
        else if (parentId && column) {
            updateChildComponent(parentId, column, selected.id, {
                content: updatedContent,
            });
        }
        // Otherwise use regular updateComponent
        else {
            updateComponent(selected.id, {
                content: updatedContent,
            });
        }
    }
    return (
        <aside className="w-80 border-l bg-background p-4 space-y-4 overflow-y-auto">
            <h3 className="text-sm font-semibold">Properties</h3>
            <p className="text-xs text-muted-foreground mb-2">
                Editing: {selected.type}
            </p>

            {selected.type === "header" &&
                (() => {
                    const content = selected.content as {
                        eyebrow?: string;
                        title?: string;
                        author?: string;
                        readingTime?: string;
                        publishDate?: string;
                        lede?: string;
                    };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="eyebrow">Eyebrow</Label>
                                <Input
                                    id="eyebrow"
                                    value={content.eyebrow || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            eyebrow: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={content.title || ""}
                                    onChange={(e) =>
                                        updateContent({ title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={content.author || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            author: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="readingTime">
                                    Reading time
                                </Label>
                                <Input
                                    id="readingTime"
                                    value={content.readingTime || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            readingTime: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="publishDate">
                                    Publish date
                                </Label>
                                <Input
                                    id="publishDate"
                                    value={content.publishDate || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            publishDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lede">Lede</Label>
                                <Textarea
                                    id="lede"
                                    value={content.lede || ""}
                                    onChange={(e) =>
                                        updateContent({ lede: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "text" &&
                (() => {
                    const content = selected.content as { html?: string };
                    return (
                        <div className="space-y-1">
                            <Label htmlFor="html">HTML</Label>
                            <Textarea
                                id="html"
                                rows={8}
                                value={content.html || ""}
                                onChange={(e) =>
                                    updateContent({ html: e.target.value })
                                }
                            />
                        </div>
                    );
                })()}

            {selected.type === "image" &&
                (() => {
                    const content = selected.content as {
                        src?: string;
                        alt?: string;
                        caption?: string;
                    };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="src">Image URL</Label>
                                <Input
                                    id="src"
                                    value={content.src || ""}
                                    onChange={(e) =>
                                        updateContent({ src: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="alt">Alt text</Label>
                                <Input
                                    id="alt"
                                    value={content.alt || ""}
                                    onChange={(e) =>
                                        updateContent({ alt: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="caption">Caption</Label>
                                <Input
                                    id="caption"
                                    value={content.caption || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            caption: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "heading" &&
                (() => {
                    const content = selected.content as {
                        text?: string;
                        level?: number;
                    };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="text">Heading Text</Label>
                                <Input
                                    id="text"
                                    value={content.text || ""}
                                    onChange={(e) =>
                                        updateContent({ text: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="level">Heading Level</Label>
                                <select
                                    id="level"
                                    value={content.level || 2}
                                    onChange={(e) =>
                                        updateContent({
                                            level: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value={2}>H2</option>
                                    <option value={3}>H3</option>
                                    <option value={4}>H4</option>
                                </select>
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "subheading" &&
                (() => {
                    const content = selected.content as { text?: string };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="text">Subheading Text</Label>
                                <Input
                                    id="text"
                                    value={content.text || ""}
                                    onChange={(e) =>
                                        updateContent({ text: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "divider" &&
                (() => {
                    const content = selected.content as { style?: string };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="style">Divider Style</Label>
                                <select
                                    id="style"
                                    value={content.style || "line"}
                                    onChange={(e) =>
                                        updateContent({ style: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="line">Line</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="thick">Thick</option>
                                </select>
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "card" &&
                (() => {
                    const content = selected.content as {
                        title?: string;
                        backgroundColor?: string;
                    };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="title">Card Title</Label>
                                <Input
                                    id="title"
                                    value={content.title || ""}
                                    onChange={(e) =>
                                        updateContent({ title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="backgroundColor">
                                    Background Color
                                </Label>
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={content.backgroundColor || "#ffffff"}
                                    onChange={(e) =>
                                        updateContent({
                                            backgroundColor: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "callout" &&
                (() => {
                    const content = selected.content as {
                        text?: string;
                        color?: string;
                        icon?: string;
                    };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="text">Callout Text</Label>
                                <Textarea
                                    id="text"
                                    value={content.text || ""}
                                    onChange={(e) =>
                                        updateContent({ text: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="color">Color</Label>
                                <select
                                    id="color"
                                    value={content.color || "blue"}
                                    onChange={(e) =>
                                        updateContent({ color: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="blue">Blue (Info)</option>
                                    <option value="green">
                                        Green (Success)
                                    </option>
                                    <option value="yellow">
                                        Yellow (Warning)
                                    </option>
                                    <option value="red">Red (Error)</option>
                                    <option value="gray">Gray (Note)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="icon">Icon</Label>
                                <select
                                    id="icon"
                                    value={content.icon || "info"}
                                    onChange={(e) =>
                                        updateContent({ icon: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="info">ℹ️ Info</option>
                                    <option value="warning">⚠️ Warning</option>
                                    <option value="success">✅ Success</option>
                                    <option value="error">❌ Error</option>
                                    <option value="note">📝 Note</option>
                                </select>
                            </div>
                        </div>
                    );
                })()}

            {selected.type === "product-card" &&
                (() => {
                    const content = selected.content as {
                        image?: string;
                        title?: string;
                        description?: string;
                        buttonText?: string;
                        buttonLink?: string;
                    };
                    return (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={content.image || ""}
                                    onChange={(e) =>
                                        updateContent({ image: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={content.title || ""}
                                    onChange={(e) =>
                                        updateContent({ title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={content.description || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="buttonText">Button text</Label>
                                <Input
                                    id="buttonText"
                                    value={content.buttonText || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            buttonText: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="buttonLink">Button link</Label>
                                <Input
                                    id="buttonLink"
                                    value={content.buttonLink || ""}
                                    onChange={(e) =>
                                        updateContent({
                                            buttonLink: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    );
                })()}
        </aside>
    );
}
