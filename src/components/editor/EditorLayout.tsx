// src/components/editor/EditorLayout.tsx
"use client";

import { Canvas } from "@/components/editor/Canvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Sidebar } from "@/components/editor/Sidebar";
import { Card } from "@/components/ui/card";
import { getDefaultContent } from "@/lib/defaultContent";
import { useBlogBuilderStore } from "@/stores/builder/blogBuilderStore";
import {
    closestCenter,
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type DropAnimation,
} from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { useState } from "react";

export function EditorLayout() {
    const addComponent = useBlogBuilderStore((s) => s.addComponent);
    const addChildComponent = useBlogBuilderStore((s) => s.addChildComponent);
    const addCardChild = useBlogBuilderStore((s) => s.addCardChild);
    const addNestedCardChild = useBlogBuilderStore((s) => s.addNestedCardChild);
    const components = useBlogBuilderStore((s) => s.components);
    const reorderComponents = useBlogBuilderStore((s) => s.reorderComponents);
    const reorderCardChildren = useBlogBuilderStore(
        (s) => s.reorderCardChildren
    );
    const reorderNestedCardChildren = useBlogBuilderStore(
        (s) => s.reorderNestedCardChildren
    );
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    function handleDragStart(event: DragStartEvent) {
        setActiveId(String(event.active.id));
        if (event.active.data.current?.type) {
            setActiveType(event.active.data.current.type);
        }
    }

    function handleDragOver(event: DragEndEvent) {
        setOverId(event.over?.id ? String(event.over.id) : null);
    }

    function handleDragCancel() {
        setActiveId(null);
        setActiveType(null);
        setOverId(null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        console.log("Drag ended:", { active, over });

        // Check if this is a new component from the palette
        if (active.data.current?.isNew) {
            if (over) {
                const type = active.data.current.type;
                const id = nanoid();
                const newComponent = {
                    id,
                    type,
                    content: getDefaultContent(type),
                    order: components.length,
                };

                console.log("Adding new component:", newComponent);

                // Check if dropped into a two-column zone
                const overId = String(over.id);
                if (overId.includes("-left") || overId.includes("-right")) {
                    // Prevent two-column from being added to two-column
                    if (type === "two-column") {
                        console.log("Cannot nest two-column inside two-column");
                        setTimeout(() => {
                            setActiveId(null);
                            setActiveType(null);
                            setOverId(null);
                        }, 200);
                        return;
                    }

                    // Extract parent ID and column
                    const column = overId.endsWith("-left") ? "left" : "right";
                    const parentId = overId.replace(/-left|-right$/, "");

                    console.log("Adding to nested column:", {
                        parentId,
                        column,
                    });
                    addChildComponent(parentId, column, newComponent);
                }
                // Check if dropped into a nested card zone (card inside two-column)
                else if (overId.includes("-nested-card")) {
                    // Prevent two-column and card from being added to nested card
                    if (type === "two-column" || type === "card") {
                        console.log(`Cannot add ${type} inside nested card`);
                        setTimeout(() => {
                            setActiveId(null);
                            setActiveType(null);
                            setOverId(null);
                        }, 200);
                        return;
                    }

                    // Get the droppable data which contains parent info
                    const dropData = over.data.current as {
                        twoColumnParentId: string;
                        twoColumnColumn: "left" | "right";
                    };

                    const cardId = overId.replace(/-nested-card$/, "");
                    console.log("Adding to nested card:", {
                        twoColumnParentId: dropData.twoColumnParentId,
                        column: dropData.twoColumnColumn,
                        cardId,
                    });

                    addNestedCardChild(
                        dropData.twoColumnParentId,
                        dropData.twoColumnColumn,
                        cardId,
                        newComponent
                    );
                }
                // Check if dropped into a card zone (top-level card)
                else if (overId.includes("-card")) {
                    // Prevent two-column and card from being added to card
                    if (type === "two-column" || type === "card") {
                        console.log(`Cannot add ${type} inside card`);
                        setTimeout(() => {
                            setActiveId(null);
                            setActiveType(null);
                            setOverId(null);
                        }, 200);
                        return;
                    }

                    const parentId = overId.replace(/-card$/, "");
                    console.log("Adding to card:", { parentId });
                    addCardChild(parentId, newComponent);
                }
                // If dropped over an existing component, insert at that position
                else if (over.id !== "canvas-droppable") {
                    const overIndex = components.findIndex(
                        (c) => c.id === over.id
                    );
                    addComponent(newComponent);
                    // Reorder to place at the correct position
                    setTimeout(() => {
                        reorderComponents(components.length, overIndex);
                    }, 0);
                } else {
                    // Just add to the end
                    addComponent(newComponent);
                }
            }

            // Clear active state after drop animation completes
            setTimeout(() => {
                setActiveId(null);
                setActiveType(null);
                setOverId(null);
            }, 200);
            return;
        }

        // Handle reordering existing components
        if (over && active.id !== over.id) {
            // Check if we're reordering within a card or nested card
            const activeData = active.data.current;
            const overData = over.data.current;

            // Reordering within a nested card (card inside two-column)
            if (
                activeData?.parentCardId &&
                overData?.parentCardId &&
                activeData.parentCardId === overData.parentCardId &&
                activeData.twoColumnParentId &&
                activeData.column
            ) {
                const twoColumnParent = components.find(
                    (c) => c.id === activeData.twoColumnParentId
                );
                const cardChildren =
                    activeData.column === "left"
                        ? twoColumnParent?.children?.left?.find(
                              (c) => c.id === activeData.parentCardId
                          )?.cardChildren
                        : twoColumnParent?.children?.right?.find(
                              (c) => c.id === activeData.parentCardId
                          )?.cardChildren;

                if (cardChildren) {
                    const oldIndex = cardChildren.findIndex(
                        (c) => c.id === active.id
                    );
                    const newIndex = cardChildren.findIndex(
                        (c) => c.id === over.id
                    );
                    if (oldIndex !== -1 && newIndex !== -1) {
                        reorderNestedCardChildren(
                            activeData.twoColumnParentId,
                            activeData.column,
                            activeData.parentCardId,
                            oldIndex,
                            newIndex
                        );
                    }
                }
            }
            // Reordering within a top-level card
            else if (
                activeData?.parentCardId &&
                overData?.parentCardId &&
                activeData.parentCardId === overData.parentCardId
            ) {
                const parentCard = components.find(
                    (c) => c.id === activeData.parentCardId
                );
                if (parentCard?.cardChildren) {
                    const oldIndex = parentCard.cardChildren.findIndex(
                        (c) => c.id === active.id
                    );
                    const newIndex = parentCard.cardChildren.findIndex(
                        (c) => c.id === over.id
                    );
                    if (oldIndex !== -1 && newIndex !== -1) {
                        reorderCardChildren(
                            activeData.parentCardId,
                            oldIndex,
                            newIndex
                        );
                    }
                }
            }
            // Reordering top-level components
            else {
                const oldIndex = components.findIndex(
                    (c) => c.id === active.id
                );
                const newIndex = components.findIndex((c) => c.id === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    reorderComponents(oldIndex, newIndex);
                }
            }
        }

        // Clear active state after drop animation completes
        setTimeout(() => {
            setActiveId(null);
            setActiveType(null);
            setOverId(null);
        }, 200);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragCancel={handleDragCancel}
        >
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <Canvas activeId={activeId} overId={overId} />
                <PropertiesPanel />
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
                {activeId && activeType ? (
                    <Card className="p-3 shadow-lg border-2 border-blue-500 bg-background opacity-90">
                        <span className="text-sm font-medium">
                            {activeType}
                        </span>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
