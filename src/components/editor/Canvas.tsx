// src/components/editor/Canvas.tsx
"use client";

import { ComponentPreview } from "@/components/blog-components/ComponentPreview";
import { CardContainer } from "@/components/editor/CardContainer";
import { TwoColumnContainer } from "@/components/editor/TwoColumnContainer";
import { Card } from "@/components/ui/card";
import { useBlogBuilderStore } from "@/stores/builder/blogBuilderStore";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";

export function Canvas({
    activeId,
    overId,
}: {
    activeId: string | null;
    overId: string | null;
}) {
    const components = useBlogBuilderStore((s) => s.components);
    const selected = useBlogBuilderStore((s) => s.selectedComponent);
    const selectComponent = useBlogBuilderStore((s) => s.selectComponent);
    const deleteComponent = useBlogBuilderStore((s) => s.deleteComponent);

    const { setNodeRef, isOver } = useDroppable({
        id: "canvas-droppable",
    });

    return (
        <main ref={setNodeRef} className="flex-1 p-6 overflow-y-auto">
            {components.length === 0 ? (
                <div
                    className={`rounded-lg border-2 border-dashed p-12 text-center text-muted-foreground transition-colors ${
                        isOver ? "border-blue-500 bg-blue-50" : ""
                    }`}
                >
                    <p className="text-lg font-medium">Drop components here</p>
                    <p className="text-sm mt-1">
                        Drag components from the sidebar to get started
                    </p>
                </div>
            ) : (
                <SortableContext
                    items={components.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {components.map((comp) => (
                            <div key={comp.id}>
                                {overId === comp.id && activeId !== comp.id && (
                                    <div className="h-1 mb-3 flex items-center animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="w-full h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    </div>
                                )}
                                {comp.type === "two-column" ? (
                                    <TwoColumnContainer
                                        id={comp.id}
                                        content={comp.content}
                                        selected={selected === comp.id}
                                        onClick={() => selectComponent(comp.id)}
                                        onDelete={() =>
                                            deleteComponent(comp.id)
                                        }
                                        overId={overId}
                                        activeId={activeId}
                                    />
                                ) : comp.type === "card" ? (
                                    <CardContainer
                                        id={comp.id}
                                        content={comp.content}
                                        selected={selected === comp.id}
                                        onClick={() => selectComponent(comp.id)}
                                        onDelete={() =>
                                            deleteComponent(comp.id)
                                        }
                                    />
                                ) : (
                                    <SortableComponentCard
                                        id={comp.id}
                                        selected={selected === comp.id}
                                        onClick={() => selectComponent(comp.id)}
                                        onDelete={() =>
                                            deleteComponent(comp.id)
                                        }
                                        type={comp.type}
                                        content={comp.content}
                                        isOver={
                                            overId === comp.id &&
                                            activeId !== comp.id
                                        }
                                    />
                                )}
                            </div>
                        ))}
                        {/* If dropping at end of list */}
                        {overId === "canvas-droppable" &&
                            components.length > 0 && (
                                <div className="h-1 mt-3 flex items-center animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="w-full h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                </div>
                            )}
                    </div>
                </SortableContext>
            )}
        </main>
    );
}

function SortableComponentCard({
    id,
    selected,
    onClick,
    onDelete,
    type,
    content,
    isOver,
}: {
    id: string;
    selected: boolean;
    onClick: () => void;
    onDelete: () => void;
    type: string;
    content: unknown;
    isOver?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    return (
        <Card
            ref={setNodeRef}
            style={{
                transform: CSS.Translate.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...attributes}
            onClick={onClick}
            className={`p-4 cursor-pointer relative group transition-all ${
                selected ? "ring-2 ring-blue-500" : ""
            } ${isOver ? "scale-[0.98] opacity-90" : ""}`}
        >
            <div {...listeners} className="touch-none">
                <ComponentPreview type={type} content={content} />
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute top-2 right-2 p-2 rounded-md bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                aria-label="Delete component"
            >
                <Trash2 className="w-4 h-4 text-red-600" />
            </button>
        </Card>
    );
}
