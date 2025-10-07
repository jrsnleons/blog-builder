import React from "react";

export function ComponentPreview({
    type,
    content,
}: {
    type: string;
    content: any;
}) {
    switch (type) {
        case "header":
            return (
                <div>
                    <div className="uppercase text-xs font-semibold text-muted-foreground">
                        {content.eyebrow}
                    </div>
                    <h1 className="text-2xl font-bold">{content.title}</h1>
                    <div className="text-xs text-muted-foreground mt-1">
                        {content.author} • {content.readingTime} •{" "}
                        {content.publishDate}
                    </div>
                    <p className="mt-2 text-base">{content.lede}</p>
                </div>
            );
        case "heading":
            return (
                <div className="font-bold text-lg">
                    {content.text || "Heading"}
                </div>
            );
        case "subheading":
            return (
                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {content.text || "Subheading"}
                </div>
            );
        case "divider":
            return (
                <div className="w-full">
                    <hr
                        className={`border-gray-300 ${
                            content.style === "dashed"
                                ? "border-dashed"
                                : content.style === "dotted"
                                ? "border-dotted"
                                : content.style === "thick"
                                ? "border-t-2"
                                : ""
                        }`}
                    />
                </div>
            );
        case "card":
            return (
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-3 bg-purple-50/30">
                    <div className="text-xs font-semibold text-purple-600 mb-2">
                        🎴 {content.title || "Card"}
                    </div>
                    <div className="text-xs text-gray-500 italic">
                        Drop components here
                    </div>
                </div>
            );
        case "callout":
            const colors = {
                blue: "bg-blue-50 border-blue-200 text-blue-800",
                green: "bg-green-50 border-green-200 text-green-800",
                yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
                red: "bg-red-50 border-red-200 text-red-800",
                gray: "bg-gray-50 border-gray-200 text-gray-800",
            };
            const calloutIcons = {
                info: "ℹ️",
                warning: "⚠️",
                success: "✅",
                error: "❌",
                note: "📝",
            };
            const colorClass =
                colors[content.color as keyof typeof colors] || colors.blue;
            const iconDisplay =
                calloutIcons[content.icon as keyof typeof calloutIcons] ||
                calloutIcons.info;
            return (
                <div className={`border-l-4 p-3 rounded ${colorClass}`}>
                    <div className="text-sm font-medium">
                        {iconDisplay} {content.text || "Callout"}
                    </div>
                </div>
            );
        case "text":
            return (
                <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.html }}
                />
            );
        case "image":
            return (
                <figure>
                    <img
                        src={content.src}
                        alt={content.alt || ""}
                        className="rounded-md w-full object-cover"
                    />
                    {content.caption ? (
                        <figcaption className="text-sm text-muted-foreground mt-1">
                            {content.caption}
                        </figcaption>
                    ) : null}
                </figure>
            );
        case "product-card":
            return (
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-start">
                    <img
                        src={content.image}
                        alt={content.title || "Product"}
                        className="rounded-md w-full"
                    />
                    <div>
                        <h4 className="font-semibold">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">
                            {content.description}
                        </p>
                        <a
                            href={content.buttonLink}
                            className="inline-flex mt-2 text-sm text-primary underline"
                        >
                            {content.buttonText}
                        </a>
                    </div>
                </div>
            );
        case "two-column":
            return (
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50/30">
                    <div className="text-xs font-semibold text-blue-600 mb-3 flex items-center gap-2">
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-dashed border-gray-300 rounded p-3 min-h-[100px] flex items-center justify-center text-xs text-gray-500">
                            Left Column
                            <br />
                            <span className="text-[10px]">
                                (Drop components here)
                            </span>
                        </div>
                        <div className="border border-dashed border-gray-300 rounded p-3 min-h-[100px] flex items-center justify-center text-xs text-gray-500">
                            Right Column
                            <br />
                            <span className="text-[10px]">
                                (Drop components here)
                            </span>
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <div className="text-sm text-muted-foreground">
                    Unknown component
                </div>
            );
    }
}
