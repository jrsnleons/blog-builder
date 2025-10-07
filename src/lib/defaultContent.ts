// src/lib/defaultContent.ts

export function getDefaultContent(type: string) {
    switch (type) {
        case "header":
            return {
                eyebrow: "Health • Mental Training",
                title: "The Power of Positive Self-Talk During Workouts",
                author: "Your Name",
                readingTime: "8 min read",
                publishDate: "October 6, 2025",
                lede: "Mental strategies for motivation and performance – discover how the voice in your head can make you stronger, faster, and more confident in every workout.",
            };
        case "text":
            return {
                html: "<p>Have you ever noticed the voice in your head during a tough workout? That internal conversation is called <strong>self-talk</strong>.</p>",
            };
        case "image":
            return {
                src: "https://placehold.co/800x400/png",
                alt: "Placeholder image",
                caption: "",
            };
        case "product-card":
            return {
                image: "https://placehold.co/300/png",
                title: "Your Product Name",
                description: "Describe benefits and features here.",
                buttonText: "Shop Now",
                buttonLink: "#",
            };
        case "heading":
            return {
                text: "Heading Text",
                level: "h2", // h2, h3, h4
            };
        case "subheading":
            return {
                text: "Subheading Text",
            };
        case "divider":
            return {
                style: "line", // line, dashed, dotted, thick
            };
        case "card":
            return {
                title: "Card Title",
                backgroundColor: "white",
            };
        case "callout":
            return {
                text: "Important information goes here",
                color: "blue", // blue, green, yellow, red, gray
                icon: "info", // info, warning, success, error
            };
        case "two-column":
            return {
                leftColumnRatio: 50, // percentage
                rightColumnRatio: 50,
                gap: "md", // sm, md, lg
            };
        default:
            return {};
    }
}
