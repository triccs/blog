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

posts.forEach(post => {
    // Resolve image path
    const imagePath = post.coverImage.startsWith('http') 
        ? post.coverImage 
        : baseUrl + (post.coverImage.startsWith('/') ? post.coverImage : '/' + post.coverImage);
    
    const postUrl = `${baseUrl}/post.html?id=${post.id}`;
    
    // Replace meta tags in template
    let html = template
        .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${post.title.replace(/"/g, '&quot;')}"`)
        .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${post.excerpt.replace(/"/g, '&quot;')}"`)
        .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${imagePath}"`)
        .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${baseUrl}/posts/${post.id}.html"`)
        .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${post.title.replace(/"/g, '&quot;')}"`)
        .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${post.excerpt.replace(/"/g, '&quot;')}"`)
        .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${imagePath}"`)
        .replace(/<title>[^<]*<\/title>/, `<title>${post.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')} | BraneTrix</title>`)
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${post.excerpt.replace(/"/g, '&quot;')}"`)
        .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${baseUrl}/posts/${post.id}.html"`)
        // Fix paths for files in posts/ subdirectory
        .replace(/href="index\.html"/g, 'href="../index.html"')
        .replace(/href="about\.html"/g, 'href="../about.html"')
        .replace(/href="css\//g, 'href="../css/')
        .replace(/src="js\//g, 'src="../js/')
        // Replace DevLog with BraneTrix
        .replace(/DevLog/g, 'BraneTrix')
        .replace(/Your Name/g, 'BraneTrix')
        // Add author meta tag if missing
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${post.excerpt.replace(/"/g, '&quot;')}"`)
        .replace(/(<meta name="description"[^>]*>)/, `$1\n    <meta name="author" content="BraneTrix">`);
    
    // Write the generated file
    const outputPath = `posts/${post.id}.html`;
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Generated: ${outputPath}`);
});

console.log(`\nGenerated ${posts.length} static post files!`);

