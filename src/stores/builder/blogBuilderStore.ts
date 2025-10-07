import { create } from "zustand";

// Types
export type BlogComponentType =
    | "header"
    | "heading"
    | "subheading"
    | "text"
    | "image"
    | "divider"
    | "card"
    | "product-card"
    | "highlight-box"
    | "callout"
    | "faq"
    | "social-share"
    | "two-column";

export interface BlogComponent {
    id: string;
    type: BlogComponentType;
    content: unknown; // Replace 'unknown' with a more specific type/interface as needed
    order: number;
    children?: {
        left?: BlogComponent[];
        right?: BlogComponent[];
    };
    cardChildren?: BlogComponent[]; // For card components
}

export interface SiteSettings {
    siteName: string;
    author: string;
    baseUrl: string;
}

interface BlogBuilderState {
    components: BlogComponent[];
    selectedComponent: string | null;
    siteSettings: SiteSettings;
    isPreviewMode: boolean;

    addComponent: (component: BlogComponent) => void;
    updateComponent: (id: string, updates: Partial<BlogComponent>) => void;
    deleteComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;
    reorderComponents: (startIndex: number, endIndex: number) => void;
    addChildComponent: (
        parentId: string,
        column: "left" | "right",
        component: BlogComponent
    ) => void;
    deleteChildComponent: (
        parentId: string,
        column: "left" | "right",
        childId: string
    ) => void;
    updateChildComponent: (
        parentId: string,
        column: "left" | "right",
        childId: string,
        updates: Partial<BlogComponent>
    ) => void;
    addCardChild: (parentId: string, component: BlogComponent) => void;
    deleteCardChild: (parentId: string, childId: string) => void;
    updateCardChild: (
        parentId: string,
        childId: string,
        updates: Partial<BlogComponent>
    ) => void;
    // Nested card operations (for cards inside two-column layouts)
    addNestedCardChild: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        component: BlogComponent
    ) => void;
    deleteNestedCardChild: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        childId: string
    ) => void;
    updateNestedCardChild: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        childId: string,
        updates: Partial<BlogComponent>
    ) => void;
    // Reordering operations
    reorderCardChildren: (
        parentId: string,
        startIndex: number,
        endIndex: number
    ) => void;
    reorderNestedCardChildren: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        startIndex: number,
        endIndex: number
    ) => void;
    setPreviewMode: (isPreview: boolean) => void;
    updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

export const useBlogBuilderStore = create<BlogBuilderState>((set) => ({
    components: [],
    isPreviewMode: false,
    selectedComponent: null,
    siteSettings: {
        siteName: "My Blog",
        author: "Your Name",
        baseUrl: "https://yourdomain.com",
    },

    addComponent: (component) =>
        set((state) => ({
            components: [...state.components, component],
        })),

    updateComponent: (id, updates) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === id ? { ...comp, ...updates } : comp
            ),
        })),

    deleteComponent: (id) =>
        set((state) => ({
            components: state.components.filter((comp) => comp.id !== id),
            selectedComponent:
                state.selectedComponent === id ? null : state.selectedComponent,
        })),

    selectComponent: (id) => set({ selectedComponent: id }),

    reorderComponents: (startIndex, endIndex) =>
        set((state) => {
            const result = Array.from(state.components);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { components: result };
        }),

    addChildComponent: (
        parentId: string,
        column: "left" | "right",
        component: BlogComponent
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === parentId
                    ? {
                          ...comp,
                          children: {
                              left:
                                  column === "left"
                                      ? [
                                            ...(comp.children?.left || []),
                                            component,
                                        ]
                                      : comp.children?.left || [],
                              right:
                                  column === "right"
                                      ? [
                                            ...(comp.children?.right || []),
                                            component,
                                        ]
                                      : comp.children?.right || [],
                          },
                      }
                    : comp
            ),
        })),

    deleteChildComponent: (
        parentId: string,
        column: "left" | "right",
        childId: string
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === parentId
                    ? {
                          ...comp,
                          children: {
                              left:
                                  column === "left"
                                      ? (comp.children?.left || []).filter(
                                            (c) => c.id !== childId
                                        )
                                      : comp.children?.left || [],
                              right:
                                  column === "right"
                                      ? (comp.children?.right || []).filter(
                                            (c) => c.id !== childId
                                        )
                                      : comp.children?.right || [],
                          },
                      }
                    : comp
            ),
            selectedComponent:
                state.selectedComponent === childId
                    ? null
                    : state.selectedComponent,
        })),

    updateChildComponent: (
        parentId: string,
        column: "left" | "right",
        childId: string,
        updates: Partial<BlogComponent>
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === parentId
                    ? {
                          ...comp,
                          children: {
                              left:
                                  column === "left"
                                      ? (comp.children?.left || []).map((c) =>
                                            c.id === childId
                                                ? { ...c, ...updates }
                                                : c
                                        )
                                      : comp.children?.left || [],
                              right:
                                  column === "right"
                                      ? (comp.children?.right || []).map((c) =>
                                            c.id === childId
                                                ? { ...c, ...updates }
                                                : c
                                        )
                                      : comp.children?.right || [],
                          },
                      }
                    : comp
            ),
        })),

    addCardChild: (parentId: string, component: BlogComponent) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === parentId
                    ? {
                          ...comp,
                          cardChildren: [
                              ...(comp.cardChildren || []),
                              component,
                          ],
                      }
                    : comp
            ),
        })),

    deleteCardChild: (parentId: string, childId: string) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === parentId
                    ? {
                          ...comp,
                          cardChildren: (comp.cardChildren || []).filter(
                              (c) => c.id !== childId
                          ),
                      }
                    : comp
            ),
            selectedComponent:
                state.selectedComponent === childId
                    ? null
                    : state.selectedComponent,
        })),

    updateCardChild: (
        parentId: string,
        childId: string,
        updates: Partial<BlogComponent>
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === parentId
                    ? {
                          ...comp,
                          cardChildren: (comp.cardChildren || []).map((c) =>
                              c.id === childId ? { ...c, ...updates } : c
                          ),
                      }
                    : comp
            ),
        })),

    // Nested card operations (for cards inside two-column layouts)
    addNestedCardChild: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        component: BlogComponent
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === twoColumnParentId
                    ? {
                          ...comp,
                          children: {
                              left:
                                  column === "left"
                                      ? (comp.children?.left || []).map((c) =>
                                            c.id === cardId
                                                ? {
                                                      ...c,
                                                      cardChildren: [
                                                          ...(c.cardChildren ||
                                                              []),
                                                          component,
                                                      ],
                                                  }
                                                : c
                                        )
                                      : comp.children?.left || [],
                              right:
                                  column === "right"
                                      ? (comp.children?.right || []).map((c) =>
                                            c.id === cardId
                                                ? {
                                                      ...c,
                                                      cardChildren: [
                                                          ...(c.cardChildren ||
                                                              []),
                                                          component,
                                                      ],
                                                  }
                                                : c
                                        )
                                      : comp.children?.right || [],
                          },
                      }
                    : comp
            ),
        })),

    deleteNestedCardChild: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        childId: string
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === twoColumnParentId
                    ? {
                          ...comp,
                          children: {
                              left:
                                  column === "left"
                                      ? (comp.children?.left || []).map((c) =>
                                            c.id === cardId
                                                ? {
                                                      ...c,
                                                      cardChildren: (
                                                          c.cardChildren || []
                                                      ).filter(
                                                          (child) =>
                                                              child.id !==
                                                              childId
                                                      ),
                                                  }
                                                : c
                                        )
                                      : comp.children?.left || [],
                              right:
                                  column === "right"
                                      ? (comp.children?.right || []).map((c) =>
                                            c.id === cardId
                                                ? {
                                                      ...c,
                                                      cardChildren: (
                                                          c.cardChildren || []
                                                      ).filter(
                                                          (child) =>
                                                              child.id !==
                                                              childId
                                                      ),
                                                  }
                                                : c
                                        )
                                      : comp.children?.right || [],
                          },
                      }
                    : comp
            ),
            selectedComponent:
                state.selectedComponent === childId
                    ? null
                    : state.selectedComponent,
        })),

    updateNestedCardChild: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        childId: string,
        updates: Partial<BlogComponent>
    ) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === twoColumnParentId
                    ? {
                          ...comp,
                          children: {
                              left:
                                  column === "left"
                                      ? (comp.children?.left || []).map((c) =>
                                            c.id === cardId
                                                ? {
                                                      ...c,
                                                      cardChildren: (
                                                          c.cardChildren || []
                                                      ).map((child) =>
                                                          child.id === childId
                                                              ? {
                                                                    ...child,
                                                                    ...updates,
                                                                }
                                                              : child
                                                      ),
                                                  }
                                                : c
                                        )
                                      : comp.children?.left || [],
                              right:
                                  column === "right"
                                      ? (comp.children?.right || []).map((c) =>
                                            c.id === cardId
                                                ? {
                                                      ...c,
                                                      cardChildren: (
                                                          c.cardChildren || []
                                                      ).map((child) =>
                                                          child.id === childId
                                                              ? {
                                                                    ...child,
                                                                    ...updates,
                                                                }
                                                              : child
                                                      ),
                                                  }
                                                : c
                                        )
                                      : comp.children?.right || [],
                          },
                      }
                    : comp
            ),
        })),

    // Reordering operations
    reorderCardChildren: (
        parentId: string,
        startIndex: number,
        endIndex: number
    ) =>
        set((state) => ({
            components: state.components.map((comp) => {
                if (comp.id === parentId && comp.cardChildren) {
                    const result = Array.from(comp.cardChildren);
                    const [removed] = result.splice(startIndex, 1);
                    result.splice(endIndex, 0, removed);
                    return { ...comp, cardChildren: result };
                }
                return comp;
            }),
        })),

    reorderNestedCardChildren: (
        twoColumnParentId: string,
        column: "left" | "right",
        cardId: string,
        startIndex: number,
        endIndex: number
    ) =>
        set((state) => ({
            components: state.components.map((comp) => {
                if (comp.id === twoColumnParentId) {
                    return {
                        ...comp,
                        children: {
                            left:
                                column === "left"
                                    ? (comp.children?.left || []).map((c) => {
                                          if (
                                              c.id === cardId &&
                                              c.cardChildren
                                          ) {
                                              const result = Array.from(
                                                  c.cardChildren
                                              );
                                              const [removed] = result.splice(
                                                  startIndex,
                                                  1
                                              );
                                              result.splice(
                                                  endIndex,
                                                  0,
                                                  removed
                                              );
                                              return {
                                                  ...c,
                                                  cardChildren: result,
                                              };
                                          }
                                          return c;
                                      })
                                    : comp.children?.left || [],
                            right:
                                column === "right"
                                    ? (comp.children?.right || []).map((c) => {
                                          if (
                                              c.id === cardId &&
                                              c.cardChildren
                                          ) {
                                              const result = Array.from(
                                                  c.cardChildren
                                              );
                                              const [removed] = result.splice(
                                                  startIndex,
                                                  1
                                              );
                                              result.splice(
                                                  endIndex,
                                                  0,
                                                  removed
                                              );
                                              return {
                                                  ...c,
                                                  cardChildren: result,
                                              };
                                          }
                                          return c;
                                      })
                                    : comp.children?.right || [],
                        },
                    };
                }
                return comp;
            }),
        })),

    setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),

    updateSiteSettings: (settings) =>
        set((state) => ({
            siteSettings: { ...state.siteSettings, ...settings },
        })),
}));
