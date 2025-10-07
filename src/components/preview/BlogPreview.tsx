// src/components/preview/BlogPreview.tsx
"use client";

import { useBlogBuilderStore } from "@/stores/builder/blogBuilderStore";
import Image from "next/image";

export function BlogPreview() {
    const components = useBlogBuilderStore((s) => s.components);

    return (
        <div className="flex-1 overflow-y-auto bg-white">
            {/* Blog Container */}
            <article className="max-w-3xl mx-auto px-6 py-12">
                {components.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                        <p className="text-lg">No components yet</p>
                        <p className="text-sm mt-2">
                            Add components to see your blog preview
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {components.map((comp) => (
                            <PreviewComponent
                                key={comp.id}
                                type={comp.type}
                                content={comp.content}
                                nestedChildren={comp.children}
                                cardChildren={comp.cardChildren}
                            />
                        ))}
                    </div>
                )}
            </article>
        </div>
    );
}

type PreviewChild = {
    id: string;
    type: string;
    content: unknown;
    children?: {
        left?: PreviewChild[];
        right?: PreviewChild[];
    };
    cardChildren?: PreviewChild[];
};

function PreviewComponent({
    type,
    content,
    nestedChildren,
    cardChildren,
    isNested = false,
}: {
    type: string;
    content: unknown;
    nestedChildren?: {
        left?: PreviewChild[];
        right?: PreviewChild[];
    };
    cardChildren?: PreviewChild[];
    isNested?: boolean;
}) {
    const contentObj = content as Record<string, string>;

    switch (type) {
        case "header":
            return (
                <header className="space-y-4">
                    {contentObj.eyebrow && (
                        <div className="uppercase text-sm font-semibold text-gray-600 tracking-wide">
                            {contentObj.eyebrow}
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        {contentObj.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{contentObj.author}</span>
                        <span>•</span>
                        <span>{contentObj.readingTime}</span>
                        <span>•</span>
                        <span>{contentObj.publishDate}</span>
                    </div>
                    {contentObj.lede && (
                        <p className="text-xl text-gray-700 leading-relaxed">
                            {contentObj.lede}
                        </p>
                    )}
                </header>
            );

        case "heading":
            const level = Number(contentObj.level) || 2;
            const headingClass = `font-bold text-gray-900 ${
                isNested ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`;
            if (level === 3) {
                return (
                    <h3 className={headingClass}>
                        {contentObj.text || "Heading"}
                    </h3>
                );
            } else if (level === 4) {
                return (
                    <h4 className={headingClass}>
                        {contentObj.text || "Heading"}
                    </h4>
                );
            }
            return (
                <h2 className={headingClass}>{contentObj.text || "Heading"}</h2>
            );

        case "subheading":
            return (
                <div
                    className={`font-semibold text-gray-600 uppercase tracking-wide ${
                        isNested ? "text-xs" : "text-sm"
                    }`}
                >
                    {contentObj.text || "Subheading"}
                </div>
            );

        case "divider":
            return (
                <hr
                    className={`my-6 border-gray-300 ${
                        contentObj.style === "dashed"
                            ? "border-dashed"
                            : contentObj.style === "dotted"
                            ? "border-dotted"
                            : contentObj.style === "thick"
                            ? "border-t-4"
                            : ""
                    }`}
                />
            );

        case "callout":
            const colorStyles = {
                blue: "bg-blue-50 border-blue-300 text-blue-900",
                green: "bg-green-50 border-green-300 text-green-900",
                yellow: "bg-yellow-50 border-yellow-300 text-yellow-900",
                red: "bg-red-50 border-red-300 text-red-900",
                gray: "bg-gray-50 border-gray-300 text-gray-900",
            };
            const calloutColor =
                colorStyles[
                    (contentObj.color || "blue") as keyof typeof colorStyles
                ] || colorStyles.blue;
            const iconMap = {
                info: "ℹ️",
                warning: "⚠️",
                success: "✅",
                error: "❌",
                note: "📝",
            };
            const calloutIcon =
                iconMap[(contentObj.icon || "info") as keyof typeof iconMap] ||
                iconMap.info;
            return (
                <div
                    className={`border-l-4 p-4 md:p-6 rounded-r-lg ${calloutColor}`}
                >
                    <div
                        className={`font-medium ${
                            isNested ? "text-sm" : "text-base"
                        }`}
                    >
                        <span className="mr-2">{calloutIcon}</span>
                        {contentObj.text || "Important information"}
                    </div>
                </div>
            );

        case "text":
            return (
                <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: contentObj.html || "" }}
                />
            );

        case "image":
            return (
                <figure className="space-y-3">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <Image
                            src={contentObj.src || ""}
                            alt={contentObj.alt || ""}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {contentObj.caption && (
                        <figcaption className="text-sm text-gray-600 text-center italic">
                            {contentObj.caption}
                        </figcaption>
                    )}
                </figure>
            );

        case "product-card":
            return (
                <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                    <div
                        className={`flex gap-4 md:gap-6 items-stretch ${
                            isNested ? "flex-col" : "flex-col md:flex-row"
                        }`}
                    >
                        <div
                            className={`relative w-full aspect-square rounded-lg overflow-hidden bg-white flex-shrink-0 ${
                                isNested ? "" : "md:w-[200px]"
                            }`}
                        >
                            <Image
                                src={contentObj.image || ""}
                                alt={contentObj.title || "Product"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center space-y-2 md:space-y-3 flex-1">
                            <h3
                                className={`font-bold text-gray-900 ${
                                    isNested
                                        ? "text-lg md:text-xl"
                                        : "text-xl md:text-2xl"
                                }`}
                            >
                                {contentObj.title}
                            </h3>
                            <p
                                className={`text-gray-700 ${
                                    isNested ? "text-sm" : "text-base"
                                }`}
                            >
                                {contentObj.description}
                            </p>
                            <a
                                href={contentObj.buttonLink || "#"}
                                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors w-fit text-sm md:text-base"
                            >
                                {contentObj.buttonText || "Learn More"}
                            </a>
                        </div>
                    </div>
                </div>
            );

        case "card":
            const cardContent = content as {
                title?: string;
                backgroundColor?: string;
            };
            return (
                <div
                    className="border border-gray-200 rounded-xl p-6 shadow-sm"
                    style={{
                        backgroundColor: cardContent.backgroundColor || "white",
                    }}
                >
                    {cardContent.title && (
                        <h3 className="text-xl font-bold mb-4">
                            {cardContent.title}
                        </h3>
                    )}
                    <div className="space-y-4">
                        {cardChildren?.map((child) => (
                            <PreviewComponent
                                key={child.id}
                                type={child.type}
                                content={child.content}
                                nestedChildren={child.children}
                                cardChildren={child.cardChildren}
                                isNested={true}
                            />
                        ))}
                    </div>
                </div>
            );

        case "two-column":
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="space-y-4 md:space-y-6">
                        {nestedChildren?.left?.map((child) => (
                            <PreviewComponent
                                key={child.id}
                                type={child.type}
                                content={child.content}
                                nestedChildren={child.children}
                                cardChildren={child.cardChildren}
                                isNested={true}
                            />
                        ))}
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4 md:space-y-6">
                        {nestedChildren?.right?.map((child) => (
                            <PreviewComponent
                                key={child.id}
                                type={child.type}
                                content={child.content}
                                nestedChildren={child.children}
                                cardChildren={child.cardChildren}
                                isNested={true}
                            />
                        ))}
                    </div>
                </div>
            );

        default:
            return (
                <div className="text-gray-400 text-center py-4">
                    Unknown component: {type}
                </div>
            );
    }
}
