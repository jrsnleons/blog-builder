// src/components/editor/Sidebar.tsx
"use client";

import { Card } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const palette = [
    { type: "header", label: "Header", icon: "📝" },
    { type: "heading", label: "Heading", icon: "📌" },
    { type: "subheading", label: "Subheading", icon: "📍" },
    { type: "text", label: "Text Block", icon: "📄" },
    { type: "image", label: "Image", icon: "🖼️" },
    { type: "divider", label: "Divider", icon: "➖" },
    { type: "card", label: "Card", icon: "🎴" },
    { type: "callout", label: "Callout", icon: "💡" },
    { type: "product-card", label: "Product Card", icon: "🛍️" },
    { type: "two-column", label: "Two Column", icon: "⬜⬜" },
];

export function Sidebar() {
    return (
        <aside className="w-80 border-r bg-background p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">Components</h3>
            <p className="text-xs text-muted-foreground mb-4">
                Drag components to the canvas
            </p>
            <div className="grid grid-cols-2 gap-2">
                {palette.map((item) => (
                    <DraggablePaletteItem
                        key={item.type}
                        type={item.type}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </aside>
    );
}

function DraggablePaletteItem({
    type,
    label,
    icon,
}: {
    type: string;
    label: string;
    icon: string;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: `palette-${type}`,
            data: { type, isNew: true },
        });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors min-h-[80px]"
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-medium text-center leading-tight">
                {label}
            </span>
        </Card>
    );
}
