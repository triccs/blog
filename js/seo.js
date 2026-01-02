/**
 * SEO Management
 * Handles dynamic meta tag updates for Open Graph, Twitter Cards, and JSON-LD
 * This enables proper link previews when sharing on social media
 */

const SITE_NAME = 'DevLog';
const AUTHOR_NAME = 'Your Name';

/**
 * Update all SEO meta tags for a specific post
 * Called from posts.js when rendering a single post
 * @param {Object} post - The post object with title, excerpt, coverImage, date, tags
 */
// Get base path for GitHub Pages subdirectory
function getBasePath() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // If we're on GitHub Pages, always use /blog as base path
    if (hostname.includes('github.io')) {
        // Check if pathname already includes /blog
        if (pathname.startsWith('/blog')) {
            return '/blog';
        }
        // For triccs.github.io, the repo name is "blog"
        return '/blog';
    }
    
    // Local development - no base path
    return '';
}

// Resolve image path - handles both absolute and relative paths
function resolveImagePath(imagePath) {
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Get base path for GitHub Pages
    const basePath = getBasePath();
    const baseUrl = window.location.origin + basePath;
    
    // If it starts with /, it's an absolute path - add base path for GitHub Pages
    if (imagePath.startsWith('/')) {
        const fullUrl = baseUrl + imagePath;
        console.log('Resolved image path:', imagePath, '->', fullUrl);
        return fullUrl;
    }
    
    // Relative path - resolve from current page location
    const currentPath = window.location.pathname;
    let dir = currentPath;
    if (currentPath.includes('.html')) {
        dir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    } else if (!currentPath.endsWith('/')) {
        dir = currentPath + '/';
    }
    const fullUrl = window.location.origin + dir + imagePath;
    console.log('Resolved relative image path:', imagePath, '->', fullUrl);
    return fullUrl;
}

function updateSEO(post) {
    // Get base URL - handle GitHub Pages subdirectory
    const basePath = getBasePath();
    const baseUrl = window.location.origin + basePath;
    const postUrl = `${baseUrl}/post.html?id=${post.id}`;
    const imageUrl = resolveImagePath(post.coverImage);
    
    console.log('Updating SEO for post:', post.title);
    console.log('Base URL:', baseUrl);
    console.log('Post URL:', postUrl);
    console.log('Image URL:', imageUrl);
    
    // Update page title (browser tab)
    document.title = `${post.title} | ${SITE_NAME}`;
    
    // Update meta description
    updateMetaTag('description', post.excerpt);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', post.title);
    updateMetaProperty('og:description', post.excerpt);
    updateMetaProperty('og:image', imageUrl);
    updateMetaProperty('og:url', postUrl);
    updateMetaProperty('og:type', 'article');
    updateMetaProperty('og:site_name', SITE_NAME);
    
    // Add article-specific OG tags
    updateMetaProperty('article:published_time', post.date);
    updateMetaProperty('article:author', AUTHOR_NAME);
    post.tags.forEach((tag, index) => {
        updateMetaProperty(`article:tag`, tag, index === 0);
    });
    
    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', post.title);
    updateMetaName('twitter:description', post.excerpt);
    updateMetaName('twitter:image', imageUrl);
    
    // Update canonical URL
    updateCanonical(postUrl);
    
    // Update JSON-LD structured data
    updateJsonLd(post, postUrl, imageUrl);
}

/**
 * Update a meta tag by name attribute
 */
function updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

/**
 * Update a meta tag by property attribute (for Open Graph)
 */
function updateMetaProperty(property, content, replace = true) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    
    if (!meta || !replace) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.content = content;
}

/**
 * Update a meta tag by name attribute (for Twitter)
 */
function updateMetaName(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

/**
 * Update canonical URL
 */
function updateCanonical(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.href = url;
}

/**
 * Update JSON-LD structured data for articles
 */
function updateJsonLd(post, postUrl, imageUrl) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.title,
        'description': post.excerpt,
        'image': imageUrl,
        'datePublished': post.date,
        'dateModified': post.date,
        'author': {
            '@type': 'Person',
            'name': AUTHOR_NAME
        },
        'publisher': {
            '@type': 'Organization',
            'name': SITE_NAME,
            'logo': {
                '@type': 'ImageObject',
                'url': `${window.location.origin}/images/logo.png`
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': postUrl
        },
        'keywords': post.tags.join(', '),
        'wordCount': estimateWordCount(post.content),
        'timeRequired': `PT${post.readingTime}M`
    };
    
    // Update the existing script tag or create a new one
    let scriptTag = document.getElementById('article-schema');
    if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'article-schema';
        document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Estimate word count from HTML content
 */
function estimateWordCount(htmlContent) {
    const text = htmlContent.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.length;
}

/**
 * Generate breadcrumb structured data
 */
function generateBreadcrumbSchema(postTitle) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': window.location.origin
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Posts',
                'item': `${window.location.origin}/index.html`
            },
            {
                '@type': 'ListItem',
                'position': 3,
                'name': postTitle,
                'item': window.location.href
            }
        ]
    };
}

// Export for use in posts.js
window.updateSEO = updateSEO;

