// src/lib/htmlExport.ts
import { BlogComponent } from "@/stores/builder/blogBuilderStore";

export function generateHTML(components: BlogComponent[]): string {
    const componentsHTML = components
        .map((comp) => generateComponentHTML(comp))
        .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
        }
        .blog-container {
            max-width: 48rem;
            margin: 0 auto;
            padding: 3rem 1.5rem;
        }
        .component {
            margin-bottom: 2rem;
        }
        h1 {
            font-size: 2.5rem;
            font-weight: bold;
            line-height: 1.2;
            margin-bottom: 1rem;
        }
        h2 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        h3 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        h4 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .header {
            margin-bottom: 2rem;
        }
        .header-eyebrow {
            text-transform: uppercase;
            font-size: 0.875rem;
            font-weight: 600;
            color: #6b7280;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
        .header-meta {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 1rem;
        }
        .header-lede {
            font-size: 1.25rem;
            color: #374151;
            line-height: 1.75;
            margin-top: 1rem;
        }
        .subheading {
            font-size: 0.875rem;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .divider {
            border: 0;
            border-top: 1px solid #e5e7eb;
            margin: 1.5rem 0;
        }
        .divider-dashed {
            border-top-style: dashed;
        }
        .divider-dotted {
            border-top-style: dotted;
        }
        .divider-thick {
            border-top-width: 3px;
        }
        .callout {
            border-left: 4px solid;
            padding: 1.5rem;
            border-radius: 0 0.5rem 0.5rem 0;
            margin: 1.5rem 0;
        }
        .callout-blue {
            background-color: #eff6ff;
            border-color: #93c5fd;
            color: #1e3a8a;
        }
        .callout-green {
            background-color: #f0fdf4;
            border-color: #86efac;
            color: #14532d;
        }
        .callout-yellow {
            background-color: #fefce8;
            border-color: #fde047;
            color: #713f12;
        }
        .callout-red {
            background-color: #fef2f2;
            border-color: #fca5a5;
            color: #7f1d1d;
        }
        .callout-gray {
            background-color: #f9fafb;
            border-color: #d1d5db;
            color: #1f2937;
        }
        .card {
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin: 1.5rem 0;
        }
        .card-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .card-content > * {
            margin-bottom: 1rem;
        }
        .card-content > *:last-child {
            margin-bottom: 0;
        }
        .two-column {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            margin: 1.5rem 0;
        }
        @media (min-width: 768px) {
            .two-column {
                grid-template-columns: 1fr 1fr;
            }
        }
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s;
        }
        .product-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .product-card img {
            width: 100%;
            height: auto;
            display: block;
        }
        .product-card-content {
            padding: 1.5rem;
        }
        .product-card-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .product-card-description {
            color: #6b7280;
            margin-bottom: 1rem;
        }
        .product-card-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .product-card-button:hover {
            background-color: #1d4ed8;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
        }
        figure {
            margin: 1.5rem 0;
        }
        figcaption {
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
            font-style: italic;
            margin-top: 0.75rem;
        }
    </style>
</head>
<body>
    <article class="blog-container">
        ${componentsHTML}
    </article>
</body>
</html>`;
}

function generateComponentHTML(component: BlogComponent): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = component.content as Record<string, any>;

    switch (component.type) {
        case "header":
            return `<header class="header component">
    ${
        content.eyebrow
            ? `<div class="header-eyebrow">${escapeHTML(content.eyebrow)}</div>`
            : ""
    }
    <h1>${escapeHTML(content.title || "Untitled")}</h1>
    <div class="header-meta">
        ${content.author ? `<span>By ${escapeHTML(content.author)}</span>` : ""}
        ${
            content.publishDate
                ? `<span>${escapeHTML(content.publishDate)}</span>`
                : ""
        }
        ${
            content.readingTime
                ? `<span>${escapeHTML(content.readingTime)}</span>`
                : ""
        }
    </div>
    ${
        content.lede
            ? `<p class="header-lede">${escapeHTML(content.lede)}</p>`
            : ""
    }
</header>`;

        case "heading":
            const level = Number(content.level) || 2;
            return `<h${level} class="component">${escapeHTML(
                content.text || "Heading"
            )}</h${level}>`;

        case "subheading":
            return `<div class="subheading component">${escapeHTML(
                content.text || "Subheading"
            )}</div>`;

        case "text":
            return `<div class="component">${content.html || ""}</div>`;

        case "divider":
            const style = content.style || "line";
            const dividerClass =
                style === "line" ? "divider" : `divider divider-${style}`;
            return `<hr class="${dividerClass} component">`;

        case "callout":
            const color = content.color || "blue";
            const iconMap: Record<string, string> = {
                info: "ℹ️",
                warning: "⚠️",
                success: "✅",
                error: "❌",
                note: "📝",
            };
            const icon = iconMap[content.icon as string] || iconMap.info;
            return `<div class="callout callout-${color} component">
    <span>${icon}</span> ${escapeHTML(content.text || "Important information")}
</div>`;

        case "image":
            return `<figure class="component">
    <img src="${escapeHTML(content.src || "")}" alt="${escapeHTML(
                content.alt || ""
            )}" />
    ${
        content.caption
            ? `<figcaption>${escapeHTML(content.caption)}</figcaption>`
            : ""
    }
</figure>`;

        case "card":
            const cardChildren = component.cardChildren || [];
            const cardChildrenHTML = cardChildren
                .map((child) => generateComponentHTML(child))
                .join("\n");
            return `<div class="card component" style="${
                content.backgroundColor
                    ? `background-color: ${content.backgroundColor};`
                    : ""
            }">
    ${
        content.title
            ? `<div class="card-title">${escapeHTML(content.title)}</div>`
            : ""
    }
    <div class="card-content">
        ${cardChildrenHTML}
    </div>
</div>`;

        case "product-card":
            return `<div class="product-card component">
    ${
        content.image
            ? `<img src="${escapeHTML(content.image)}" alt="${escapeHTML(
                  content.title || "Product"
              )}" />`
            : ""
    }
    <div class="product-card-content">
        ${
            content.title
                ? `<h3 class="product-card-title">${escapeHTML(
                      content.title
                  )}</h3>`
                : ""
        }
        ${
            content.description
                ? `<p class="product-card-description">${escapeHTML(
                      content.description
                  )}</p>`
                : ""
        }
        ${
            content.buttonText && content.buttonLink
                ? `<a href="${escapeHTML(
                      content.buttonLink
                  )}" class="product-card-button">${escapeHTML(
                      content.buttonText
                  )}</a>`
                : ""
        }
    </div>
</div>`;

        case "two-column":
            const leftChildren = component.children?.left || [];
            const rightChildren = component.children?.right || [];
            const leftHTML = leftChildren
                .map((child) => generateComponentHTML(child))
                .join("\n");
            const rightHTML = rightChildren
                .map((child) => generateComponentHTML(child))
                .join("\n");
            return `<div class="two-column component">
    <div>${leftHTML}</div>
    <div>${rightHTML}</div>
</div>`;

        default:
            return "";
    }
}

function escapeHTML(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

export async function copyHTMLToClipboard(html: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(html);
        return true;
    } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        return false;
    }
}

export function downloadHTMLFile(
    html: string,
    filename: string = "blog-post.html"
): void {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
