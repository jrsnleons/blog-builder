// src/components/editor/TwoColumnContainer.tsx
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
import { NestedCardContainer } from "./NestedCardContainer";

interface TwoColumnContainerProps {
    id: string;
    content: unknown;
    selected: boolean;
    onClick: () => void;
    onDelete: () => void;
    overId: string | null;
    activeId: string | null;
}

export function TwoColumnContainer({
    id,
    selected,
    onClick,
    onDelete,
}: TwoColumnContainerProps) {
    const components = useBlogBuilderStore((s) => s.components);
    const deleteChildComponent = useBlogBuilderStore(
        (s) => s.deleteChildComponent
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

    // Find this component in the store to get its children
    const component = components.find((c) => c.id === id);
    const leftChildren = component?.children?.left || [];
    const rightChildren = component?.children?.right || [];

    const { setNodeRef: setLeftDropRef, isOver: isOverLeft } = useDroppable({
        id: `${id}-left`,
        data: { parentId: id, column: "left" },
    });

    const { setNodeRef: setRightDropRef, isOver: isOverRight } = useDroppable({
        id: `${id}-right`,
        data: { parentId: id, column: "right" },
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
            onClick={onClick}
            className={`p-4 cursor-pointer relative group transition-all ${
                selected ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
        >
            <div {...listeners} className="touch-none mb-3">
                <div className="text-xs font-semibold text-blue-600 flex items-center gap-2">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-18v18m0-18h6m-6 0v18m6-18h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m-6 0h6"
                        />
                    </svg>
                    Two Column Layout
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div
                    ref={setLeftDropRef}
                    className={`border-2 border-dashed rounded-lg p-3 min-h-[150px] transition-colors ${
                        isOverLeft
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                    }`}
                >
                    {leftChildren.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400">
                            Drop here
                        </div>
                    ) : (
                        <SortableContext
                            items={leftChildren.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {leftChildren.map((child) =>
                                    child.type === "card" ? (
                                        <NestedCardContainer
                                            key={child.id}
                                            id={child.id}
                                            content={child.content}
                                            selected={
                                                selectedComponent === child.id
                                            }
                                            onClick={() =>
                                                selectComponent(child.id)
                                            }
                                            onDelete={() =>
                                                deleteChildComponent(
                                                    id,
                                                    "left",
                                                    child.id
                                                )
                                            }
                                            parentId={id}
                                            column="left"
                                        />
                                    ) : (
                                        <NestedComponentCard
                                            key={child.id}
                                            id={child.id}
                                            type={child.type}
                                            content={child.content}
                                            selected={
                                                selectedComponent === child.id
                                            }
                                            onClick={() =>
                                                selectComponent(child.id)
                                            }
                                            onDelete={() =>
                                                deleteChildComponent(
                                                    id,
                                                    "left",
                                                    child.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </SortableContext>
                    )}
                </div>

                {/* Right Column */}
                <div
                    ref={setRightDropRef}
                    className={`border-2 border-dashed rounded-lg p-3 min-h-[150px] transition-colors ${
                        isOverRight
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                    }`}
                >
                    {rightChildren.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400">
                            Drop here
                        </div>
                    ) : (
                        <SortableContext
                            items={rightChildren.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {rightChildren.map((child) =>
                                    child.type === "card" ? (
                                        <NestedCardContainer
                                            key={child.id}
                                            id={child.id}
                                            content={child.content}
                                            selected={
                                                selectedComponent === child.id
                                            }
                                            onClick={() =>
                                                selectComponent(child.id)
                                            }
                                            onDelete={() =>
                                                deleteChildComponent(
                                                    id,
                                                    "right",
                                                    child.id
                                                )
                                            }
                                            parentId={id}
                                            column="right"
                                        />
                                    ) : (
                                        <NestedComponentCard
                                            key={child.id}
                                            id={child.id}
                                            type={child.type}
                                            content={child.content}
                                            selected={
                                                selectedComponent === child.id
                                            }
                                            onClick={() =>
                                                selectComponent(child.id)
                                            }
                                            onDelete={() =>
                                                deleteChildComponent(
                                                    id,
                                                    "right",
                                                    child.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </SortableContext>
                    )}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute top-2 right-2 p-2 rounded-md bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 z-10"
                aria-label="Delete component"
            >
                <Trash2 className="w-4 h-4 text-red-600" />
            </button>
        </Card>
    );
}

function NestedComponentCard({
    id,
    type,
    content,
    selected,
    onClick,
    onDelete,
}: {
    id: string;
    type: string;
    content: unknown;
    selected: boolean;
    onClick: () => void;
    onDelete: () => void;
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
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`p-2 cursor-pointer relative group transition-all text-sm ${
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
                className="absolute top-1 right-1 p-1 rounded-md bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                aria-label="Delete component"
            >
                <Trash2 className="w-3 h-3 text-red-600" />
            </button>
        </Card>
    );
}
