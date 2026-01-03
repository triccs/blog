# DevLog - Personal Blog

A fast, SEO-optimized personal blog built with vanilla HTML, CSS, and JavaScript.

## Features

- **Fast Loading** - Under 50KB total page weight, no frameworks
- **SEO Optimized** - Open Graph, Twitter Cards, JSON-LD structured data
- **Link Previews** - Share links on social media with image previews and titles
- **Browser Tab Titles** - Each article shows its title in the browser tab
- **Dark Theme** - Developer-focused aesthetic with cyan accents
- **Responsive** - Works on all screen sizes
- **Tag Filtering** - Filter posts by topic

## Quick Start

1. Open `index.html` in your browser, or
2. Serve with any static server:

```bash
# Python
python -m http.server 8000

# Node.js (install serve globally first)
npx serve

# PHP
php -S localhost:8000
```

## Adding a New Post

Edit `posts/posts.json` and add a new entry to the `posts` array:

```json
{
    "id": "your-post-slug",
    "title": "Your Post Title",
    "excerpt": "A brief description that appears in previews and meta tags.",
    "content": "<p>Your HTML content here...</p>",
    "coverImage": "https://example.com/image.jpg",
    "date": "2026-01-15",
    "tags": ["tag1", "tag2"],
    "readingTime": 5
}
```

### Post Fields

| Field | Description |
|-------|-------------|
| `id` | URL-friendly slug (used in `?id=your-post-slug`) |
| `title` | Post title (appears in browser tab & link previews) |
| `excerpt` | Short description for cards and meta tags |
| `content` | Full HTML content of the post |
| `coverImage` | URL to cover image (appears in link previews) |
| `date` | Publication date (YYYY-MM-DD format) |
| `tags` | Array of topic tags for filtering |
| `readingTime` | Estimated reading time in minutes |

### Content HTML

The `content` field supports HTML tags:

- `<p>` - Paragraphs
- `<h2>`, `<h3>` - Headings
- `<ul>`, `<ol>`, `<li>` - Lists
- `<blockquote>` - Block quotes
- `<code>` - Inline code
- `<pre><code>` - Code blocks
- `<a>` - Links
- `<strong>`, `<em>` - Bold & italic
- `<img>` - Images

## Customization

### Site Info

Edit `posts/posts.json`:

```json
"siteInfo": {
    "name": "Your Blog Name",
    "tagline": "Your Tagline",
    "author": "Your Name"
}
```

### Theme Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --bg-primary: #0d1117;
    --accent: #00d9ff;
    /* ... */
}
```

### About Page

Edit `about.html` to add your personal info and social links.

## File Structure

```
blog/
├── index.html          # Homepage
├── post.html           # Single post template
├── about.html          # About page
├── css/
│   └── style.css       # All styles
├── js/
│   ├── posts.js        # Post loading & rendering
│   └── seo.js          # Meta tag management
├── posts/
│   └── posts.json      # All posts data
└── images/
    └── og-default.svg  # Default social share image
```

## SEO Features

- **Open Graph** - Image + title previews on Facebook, LinkedIn, Discord, Slack
- **Twitter Cards** - Large image card format for X/Twitter
- **JSON-LD** - Structured data for rich Google search results
- **Semantic HTML** - Proper use of `<article>`, `<nav>`, `<main>`, etc.
- **Dynamic Titles** - Browser tabs show "Post Title | DevLog"

## License

MIT - Use freely for your own blog!


