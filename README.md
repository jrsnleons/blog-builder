# Blog Builder

A modern drag-and-drop blog editor designed to create beautiful, Shopify-optimized blog posts with ease. Build professional blog layouts with headers, images, cards, callouts, and more.

## ✨ Features

-   🎨 **Drag & Drop Interface** - Intuitive component-based builder
-   📦 **10+ Component Types** - Headers, headings, text, images, cards, callouts, dividers, and more
-   🎭 **Nested Layouts** - Two-column layouts and cards with nested components
-   🔄 **Reordering** - Easy component reordering with visual feedback
-   📱 **Responsive Preview** - Real-time preview mode
-   💾 **HTML Export** - Export to HTML with two options:
    -   Copy to clipboard for quick paste
    -   Download as standalone HTML file
-   🎯 **Shopify-Ready** - Optimized HTML output for Shopify blogs
-   🌈 **Visual Highlights** - Clear drop zones and selected states

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ or Bun
-   npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/jrsnleons/blog-builder.git
cd blog-builder

# Install dependencies
npm install
# or
bun install

# Run the development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Building a Blog Post

1. **Add Components** - Drag components from the left sidebar onto the canvas
2. **Edit Properties** - Click on any component to edit its properties in the right panel
3. **Arrange Layout** - Drag components to reorder them
4. **Use Nested Layouts** - Add two-column layouts or cards, then drag components inside them
5. **Preview** - Click the "Preview" button to see your blog post without the editor UI
6. **Export** - Click "Export HTML" and choose to copy or download your HTML

### Available Components

-   **Header** - Blog post header with title, author, date, and lede
-   **Heading** - H2, H3, or H4 headings
-   **Subheading** - Styled subheadings for sections
-   **Text** - Rich text content
-   **Image** - Images with captions
-   **Divider** - Horizontal dividers (solid, dashed, dotted, thick)
-   **Card** - Container for nested components
-   **Callout** - Highlighted callouts with icons (info, warning, success, error, note)
-   **Product Card** - Product showcase with image, title, description, and CTA
-   **Two Column** - Two-column layout for side-by-side content

## 🏗️ Building for Production

```bash
# Create production build
npm run build
# or
bun run build

# Start production server
npm start
# or
bun start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jrsnleons/blog-builder)

### Other Platforms

The project is a standard Next.js application and can be deployed to:

-   Netlify
-   AWS Amplify
-   Railway
-   Render
-   Any platform supporting Next.js

## 🛠️ Tech Stack

-   **Framework** - Next.js 15.5 with Turbopack
-   **Language** - TypeScript
-   **Styling** - Tailwind CSS 4
-   **State Management** - Zustand
-   **Drag & Drop** - @dnd-kit/core
-   **UI Components** - shadcn/ui
-   **Notifications** - Sonner (toast)

## 📁 Project Structure

```
blog-builder/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── blog-components/  # Component previews
│   │   ├── drag-drop/        # Drag-drop components
│   │   ├── editor/           # Editor UI components
│   │   ├── preview/          # Blog preview
│   │   └── ui/               # shadcn/ui components
│   ├── lib/              # Utilities (HTML export, etc.)
│   ├── stores/           # Zustand stores
│   └── types/            # TypeScript types
├── public/               # Static assets
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**jrsnleons**

-   GitHub: [@jrsnleons](https://github.com/jrsnleons)

## 🙏 Acknowledgments

-   Built with [Next.js](https://nextjs.org/)
-   UI components from [shadcn/ui](https://ui.shadcn.com/)
-   Drag & drop by [@dnd-kit](https://dndkit.com/)
