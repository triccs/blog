/**
 * Generate static HTML files for each post
 * This ensures meta tags are in the HTML for Twitter/iMessage crawlers
 */

const fs = require('fs');
const path = require('path');

// Read posts data
const postsData = JSON.parse(fs.readFileSync('posts/posts.json', 'utf8'));
const posts = postsData.posts;

// Read the post template
const template = fs.readFileSync('post.html', 'utf8');

// Base URL for GitHub Pages
const baseUrl = 'https://triccs.github.io/blog';

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

posts.forEach(post => {
    // Resolve image path
    const imagePath = post.coverImage.startsWith('http') 
        ? post.coverImage 
        : baseUrl + (post.coverImage.startsWith('/') ? post.coverImage : '/' + post.coverImage);
    
    const staticPostUrl = `${baseUrl}/posts/${post.id}.html`;
    
    // Format date
    const formattedDate = formatDate(post.date);
    
    // Build tags HTML
    const tagsHtml = post.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    // Build post meta HTML
    const postMetaHtml = `
                <div class="post-date">${escapeHtml(formattedDate)}</div>
                <div class="post-reading-time">${post.readingTime || 5} min read</div>
                <div class="post-tags">${tagsHtml}</div>
    `;
    
    // Build cover image HTML
    const coverImageHtml = `<img src="${imagePath}" alt="${escapeHtml(post.title)}" />`;
    
    // Build JSON-LD schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": imagePath,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": "BraneTrix",
            "url": `${baseUrl}/`
        },
        "publisher": {
            "@type": "Organization",
            "name": "BraneTrix",
            "url": `${baseUrl}/`
        }
    };
    
    // Fix image paths in post content (change /images/ to ../images/ for files in posts/ subdirectory)
    let postContent = post.content.replace(/src="\/images\//g, 'src="../images/');
    
    // Replace meta tags in template
    let html = template
        .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeHtml(post.title)}"`)
        .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeHtml(post.excerpt)}"`)
        .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${imagePath}"`)
        .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${staticPostUrl}"`)
        .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapeHtml(post.title)}"`)
        .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapeHtml(post.excerpt)}"`)
        .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${imagePath}"`)
        .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(post.title)} | BraneTrix</title>`)
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeHtml(post.excerpt)}"`)
        .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${staticPostUrl}"`)
        // Replace JSON-LD schema
        .replace(/<script type="application\/ld\+json" id="article-schema">[\s\S]*?<\/script>/, 
            `<script type="application/ld+json" id="article-schema">\n    ${JSON.stringify(jsonLd, null, 4)}\n    </script>`)
        // Inject post content
        .replace(/<h1 class="post-title" id="postTitle">[^<]*<\/h1>/, `<h1 class="post-title" id="postTitle">${escapeHtml(post.title)}</h1>`)
        .replace(/<div class="post-meta" id="postMeta">[\s\S]*?<\/div>/, `<div class="post-meta" id="postMeta">${postMetaHtml}</div>`)
        .replace(/<figure class="post-cover" id="postCover">[\s\S]*?<\/figure>/, `<figure class="post-cover" id="postCover">${coverImageHtml}</figure>`)
        .replace(/<div class="post-content" id="postContent">[\s\S]*?<\/div>/, `<div class="post-content" id="postContent">${postContent}</div>`)
        // Fix paths for files in posts/ subdirectory
        .replace(/href="index\.html"/g, 'href="../index.html"')
        .replace(/href="about\.html"/g, 'href="../about.html"')
        .replace(/href="css\//g, 'href="../css/')
        .replace(/src="js\//g, 'src="../js/')
        // Replace DevLog with BraneTrix
        .replace(/DevLog/g, 'BraneTrix')
        .replace(/Your Name/g, 'BraneTrix')
        // Add author meta tag if missing
        .replace(/(<meta name="description"[^>]*>)/, `$1\n    <meta name="author" content="BraneTrix">`);
    
    // Write the generated file
    const outputPath = `posts/${post.id}.html`;
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Generated: ${outputPath}`);
});

console.log(`\nGenerated ${posts.length} static post files!`);

