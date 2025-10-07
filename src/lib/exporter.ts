import type { BlogComponent, SiteSettings } from "@/types";

// Minimal base CSS (you can replace with your full template later)
const BASE_CSS = `
:root { --max: 900px; }
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.7; color: #0b0d10; margin: 0; }
header, main, footer { padding: 24px; }
.container { max-width: var(--max); margin: 0 auto; }
h1 { font-size: clamp(28px, 4vw, 42px); margin: 8px 0 12px; }
`;

function renderComponent(comp: BlogComponent): string {
    const c = comp.content || {};
    switch (comp.type) {
        case "header":
            return `
<header class="container">
  <div class="eyebrow">${c.eyebrow ?? ""}</div>
  <h1>${c.title ?? ""}</h1>
  <div class="article-meta">
    <span class="author">${c.author ?? ""}</span>
    <span class="reading-time">• ${c.readingTime ?? ""}</span>
    <span class="publish-date">• ${c.publishDate ?? ""}</span>
  </div>
  <p class="lede">${c.lede ?? ""}</p>
</header>`;
        case "text":
            return `<section class="container">${c.html ?? ""}</section>`;
        case "image":
            return `
<section class="container">
  <figure>
    <img src="${c.src ?? ""}" alt="${
                c.alt ?? ""
            }" style="width:100%;border-radius:10px;" />
    ${c.caption ? `<figcaption>${c.caption}</figcaption>` : ""}
  </figure>
</section>`;
        case "product-card":
            return `
<section class="container">
  <div class="product-card" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:16px;text-align:center;">
    <img src="${c.image ?? ""}" alt="${
                c.title ?? "Product"
            }" style="width:100%;border-radius:10px;" />
    <h4>${c.title ?? ""}</h4>
    <p>${c.description ?? ""}</p>
    <a href="${
        c.buttonLink ?? "#"
    }" class="cta primary" style="display:inline-block;margin-top:12px;padding:10px 16px;border-radius:999px;background:#0b0d10;color:#fff;text-decoration:none;">${
                c.buttonText ?? "Shop Now"
            }</a>
  </div>
</section>`;
        default:
            return `<section class="container"><!-- Unknown component ${comp.type} --></section>`;
    }
}

export function generateHtml(
    components: BlogComponent[],
    settings: SiteSettings
) {
    const body = components.map(renderComponent).join("\n");

    const title = settings?.siteName ? `${settings.siteName} Blog` : "Blog";
    const description = "Generated with Blog Builder";

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<style>${BASE_CSS}</style>
</head>
<body>
${body}
<footer class="container"><p>© ${new Date().getFullYear()} ${
        settings?.siteName ?? ""
    }</p></footer>
</body>
</html>`;
}
