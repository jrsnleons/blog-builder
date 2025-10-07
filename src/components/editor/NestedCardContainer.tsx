// src/components/editor/NestedCardContainer.tsx
"use client";

import { ComponentPreview } from "@/components/blog-components/ComponentPreview";
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

interface NestedCardContainerProps {
    id: string;
    content: unknown;
    selected: boolean;
    onClick: () => void;
    onDelete: () => void;
    parentId: string;
    column: "left" | "right";
}

export function NestedCardContainer({
    id,
    content,
    selected,
    onClick,
    onDelete,
    parentId,
    column,
}: NestedCardContainerProps) {
    const components = useBlogBuilderStore((s) => s.components);
    const deleteNestedCardChild = useBlogBuilderStore(
        (s) => s.deleteNestedCardChild
    );
    const selectComponent = useBlogBuilderStore((s) => s.selectComponent);
    const selectedComponent = useBlogBuilderStore((s) => s.selectedComponent);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    // Find the parent two-column component
    const parentComponent = components.find((c) => c.id === parentId);

    // Find this card in the appropriate column
    const cardChildren =
        column === "left"
            ? parentComponent?.children?.left?.find((c) => c.id === id)
                  ?.cardChildren || []
            : parentComponent?.children?.right?.find((c) => c.id === id)
                  ?.cardChildren || [];

    const contentObj = content as Record<string, string>;

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `${id}-nested-card`,
        data: {
            parentId: id,
            type: "nested-card",
            twoColumnParentId: parentId,
            twoColumnColumn: column,
        },
    });

    return (
        <Card
            ref={setNodeRef}
            style={{
                transform: CSS.Translate.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`p-3 cursor-pointer relative group transition-all ${
                selected ? "ring-2 ring-purple-500 bg-purple-50" : ""
            }`}
        >
            <div {...listeners} className="touch-none mb-2">
                <div className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                    🎴 {contentObj.title || "Card"}
                </div>
            </div>

            <div
                ref={setDropRef}
                className={`border-2 border-dashed rounded-lg p-2 min-h-[80px] transition-colors ${
                    isOver
                        ? "border-purple-500 bg-purple-100 shadow-lg"
                        : "border-purple-300"
                }`}
                style={{
                    backgroundColor: isOver
                        ? undefined
                        : contentObj.backgroundColor || "white",
                }}
            >
                {cardChildren.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                        Drop here
                    </div>
                ) : (
                    <SortableContext
                        items={cardChildren.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {cardChildren.map((child) => (
                                <DeepNestedCard
                                    key={child.id}
                                    id={child.id}
                                    type={child.type}
                                    content={child.content}
                                    selected={selectedComponent === child.id}
                                    onClick={() => selectComponent(child.id)}
                                    onDelete={() =>
                                        deleteNestedCardChild(
                                            parentId,
                                            column,
                                            id,
                                            child.id
                                        )
                                    }
                                    parentCardId={id}
                                    twoColumnParentId={parentId}
                                    column={column}
                                />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute top-1 right-1 p-1 rounded-md bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 z-10"
                aria-label="Delete component"
            >
                <Trash2 className="w-3 h-3 text-red-600" />
            </button>
        </Card>
    );
}

// Simple card for deeply nested components (inside card, inside two-column)
function DeepNestedCard({
    id,
    type,
    content,
    selected,
    onClick,
    onDelete,
    parentCardId,
    twoColumnParentId,
    column,
}: {
    id: string;
    type: string;
    content: unknown;
    selected: boolean;
    onClick: () => void;
    onDelete: () => void;
    parentCardId: string;
    twoColumnParentId: string;
    column: "left" | "right";
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        data: {
            parentCardId,
            twoColumnParentId,
            column,
        },
    });

    return (
        <Card
            ref={setNodeRef}
            style={{
                transform: CSS.Translate.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`p-2 cursor-pointer relative group transition-all text-xs ${
                selected ? "ring-2 ring-blue-500" : ""
            }`}
        >
            <div {...listeners} className="touch-none">
                <ComponentPreview type={type} content={content} />
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute top-1 right-1 p-0.5 rounded-md bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                aria-label="Delete component"
            >
                <Trash2 className="w-3 h-3 text-red-600" />
            </button>
        </Card>
    );
}
