/**
 * Posts Management
 * Handles loading, rendering, and filtering blog posts
 */

// Get posts URL - use relative path that works everywhere
function getPostsUrl() {
    let currentPath = window.location.pathname;
    
    // Ensure path ends with / for directory resolution
    if (!currentPath.endsWith('/') && !currentPath.includes('.')) {
        currentPath += '/';
    }
    
    // Remove filename to get directory (if it's an HTML file)
    let dir = currentPath;
    if (currentPath.includes('.html')) {
        dir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    } else if (!currentPath.endsWith('/')) {
        dir = currentPath + '/';
    }
    
    // Build relative path to posts.json
    const url = dir + 'posts/posts.json';
    console.log('Current pathname:', window.location.pathname);
    console.log('Calculated directory:', dir);
    console.log('Posts URL:', url);
    return url;
}

// State
let allPosts = [];
let allTags = new Set();
let currentFilter = 'all';

/**
 * Initialize the blog
 */
async function init() {
    try {
        const data = await fetchPosts();
        allPosts = data.posts;
        
        // Extract all unique tags
        allPosts.forEach(post => {
            post.tags.forEach(tag => allTags.add(tag));
        });
        
        // Determine which page we're on
        const isHomepage = document.getElementById('postsGrid');
        const isPostPage = document.getElementById('postArticle');
        
        if (isHomepage) {
            renderTagFilters();
            renderPosts(allPosts);
            setupFilterListeners();
        }
        
        if (isPostPage) {
            const postId = getPostIdFromUrl();
            if (postId) {
                renderSinglePost(postId);
            } else {
                showError('Post not found');
            }
        }
    } catch (error) {
        console.error('Failed to load posts:', error);
        showError('Failed to load posts. Please try again later.');
    }
}

/**
 * Fetch posts from JSON file
 */
async function fetchPosts() {
    const url = getPostsUrl();
    console.log('Fetching posts from:', url);
    console.log('Full URL:', window.location.origin + url);
    
    try {
        const response = await fetch(url);
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            // Try to get more details
            const text = await response.text();
            console.error('Response body:', text);
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}. URL attempted: ${url}`);
        }
        
        const data = await response.json();
        console.log('Successfully loaded posts:', data.posts?.length || 0, 'posts');
        return data;
    } catch (error) {
        console.error('Fetch error details:', error);
        throw error;
    }
}

/**
 * Get post ID from URL query parameter
 */
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Render tag filter buttons
 */
function renderTagFilters() {
    const container = document.getElementById('tagFilters');
    if (!container) return;
    
    // Add tag buttons
    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.dataset.tag = tag;
        btn.textContent = tag;
        container.appendChild(btn);
    });
}

/**
 * Setup filter button click listeners
 */
function setupFilterListeners() {
    const container = document.getElementById('tagFilters');
    if (!container) return;
    
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-btn')) {
            // Update active state
            container.querySelectorAll('.tag-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filter posts
            currentFilter = e.target.dataset.tag;
            const filtered = currentFilter === 'all' 
                ? allPosts 
                : allPosts.filter(post => post.tags.includes(currentFilter));
            
            renderPosts(filtered);
        }
    });
}

/**
 * Render posts grid
 */
function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;
    
    if (posts.length === 0) {
        grid.innerHTML = '<p class="no-posts">No posts found.</p>';
        return;
    }
    
    grid.innerHTML = posts.map(post => `
        <article class="post-card">
            <a href="post.html?id=${post.id}" class="post-card-link">
                <div class="post-card-image">
                    <img 
                        src="${post.coverImage}" 
                        alt="${post.title}"
                        loading="lazy"
                    >
                </div>
            </a>
            <div class="post-card-body">
                <div class="post-card-meta">
                    <span class="post-card-date">${formatDate(post.date)}</span>
                    <span class="post-card-reading-time">${post.readingTime} min read</span>
                </div>
                <h2 class="post-card-title">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h2>
                <p class="post-card-excerpt">${post.excerpt}</p>
                <div class="post-card-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

/**
 * Render single post page
 */
function renderSinglePost(postId) {
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) {
        showError('Post not found');
        return;
    }
    
    // Update page title
    document.title = `${post.title} | DevLog`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = post.excerpt;
    
    // Render post meta
    const metaContainer = document.getElementById('postMeta');
    if (metaContainer) {
        metaContainer.innerHTML = `
            <span class="post-date">${formatDate(post.date)}</span>
            <span class="post-reading-time">• ${post.readingTime} min read</span>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
        `;
    }
    
    // Render title
    const titleEl = document.getElementById('postTitle');
    if (titleEl) titleEl.textContent = post.title;
    
    // Render cover image
    const coverEl = document.getElementById('postCover');
    if (coverEl) {
        coverEl.innerHTML = `
            <img 
                src="${post.coverImage}" 
                alt="${post.title}"
            >
        `;
    }
    
    // Render content
    const contentEl = document.getElementById('postContent');
    if (contentEl) contentEl.innerHTML = post.content;
    
    // Render share buttons
    const shareEl = document.getElementById('shareButtons');
    if (shareEl) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        
        shareEl.innerHTML = `
            <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="share-btn">
                Twitter
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="share-btn">
                LinkedIn
            </a>
            <button class="share-btn" onclick="copyToClipboard()">
                Copy Link
            </button>
        `;
    }
    
    // Update SEO meta tags (calls seo.js function if available)
    if (typeof updateSEO === 'function') {
        updateSEO(post);
    }
}

/**
 * Copy current URL to clipboard
 */
function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.querySelector('.share-btn:last-child');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    });
}

/**
 * Show error message
 */
function showError(message) {
    const main = document.querySelector('.main-content');
    if (main) {
        main.innerHTML = `
            <div class="error-message">
                <h1>Oops!</h1>
                <p>${message}</p>
                <a href="index.html" class="back-link">&larr; Back to posts</a>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

