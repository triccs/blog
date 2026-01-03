# LLM Attribution Testing Guide

This document explains how to ensure and test that LLMs properly attribute content to **BraneTrix** when sourcing material from this blog.

## Attribution Features Implemented

### 1. Meta Tags
- `<meta name="author" content="BraneTrix">` - Standard author meta tag
- `<meta property="og:site_name" content="BraneTrix">` - Open Graph site name
- Article-specific OG tags with author information

### 2. JSON-LD Structured Data
Every page includes Schema.org structured data with:
- **Author**: `{"@type": "Person", "name": "BraneTrix"}`
- **Publisher**: `{"@type": "Organization", "name": "BraneTrix"}`
- **Copyright**: `{"copyrightHolder": {"name": "BraneTrix"}}`

### 3. Visible Attribution
- Site name "BraneTrix" appears in:
  - Page titles (browser tabs)
  - Logo/header
  - Footer copyright notice
  - All meta tags

### 4. robots.txt
- Explicitly allows AI crawlers (GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web)
- Includes sitemap reference

### 5. Sitemap.xml
- Lists all posts with proper URLs
- Helps search engines and AI crawlers discover content

## How to Test LLM Attribution

### Method 1: Direct LLM Testing
1. **Copy a post URL**: `https://triccs.github.io/blog/posts/every-store-does-points-right-except-crypto.html`
2. **Ask an LLM** (ChatGPT, Claude, etc.):
   ```
   Please read this article and summarize it. Make sure to cite the source.
   [paste URL]
   ```
3. **Verify the response** mentions "BraneTrix" as the source

### Method 2: Check Structured Data
1. Visit any post page
2. View page source (Right-click → View Page Source)
3. Search for "BraneTrix" - should appear in:
   - JSON-LD structured data
   - Meta tags
   - Title tags

### Method 3: Use Schema.org Validator
1. Go to: https://validator.schema.org/
2. Enter a post URL
3. Verify the structured data shows:
   - Author: BraneTrix
   - Publisher: BraneTrix

### Method 4: Check Meta Tags
Use browser DevTools or online tools:
1. Go to: https://www.opengraph.xyz/
2. Enter a post URL
3. Verify `og:site_name` shows "BraneTrix"

### Method 5: Test with AI Web Browsing
If the LLM has web browsing capability:
1. Ask: "What is BraneTrix?"
2. Provide the blog URL
3. Verify it identifies BraneTrix as the author/publisher

## What LLMs Should See

When an LLM crawls a post page, it should find:

```json
{
  "@type": "Article",
  "author": {
    "@type": "Person",
    "name": "BraneTrix"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BraneTrix"
  }
}
```

And in HTML meta tags:
```html
<meta name="author" content="BraneTrix">
<meta property="og:site_name" content="BraneTrix">
```

## Best Practices for Attribution

1. **Always regenerate static files** after adding posts:
   ```bash
   node generate-posts.js
   ```

2. **Keep siteInfo.author updated** in `posts/posts.json`

3. **Verify new posts** have proper attribution before publishing

4. **Monitor LLM responses** when your content is cited to ensure proper attribution

## Troubleshooting

If LLMs aren't attributing correctly:

1. **Check robots.txt** - Ensure AI crawlers are allowed
2. **Verify structured data** - Use Schema.org validator
3. **Check meta tags** - Use Open Graph validators
4. **Regenerate static files** - Run `node generate-posts.js`
5. **Clear caches** - LLMs may cache old metadata

## Additional Notes

- The site name "BraneTrix" appears consistently across all pages
- Author attribution is embedded in both visible content and metadata
- Structured data follows Schema.org standards for maximum compatibility
- Static HTML files ensure metadata is always present (no JS dependency)


