// Blog Dashboard Application
class BlogDashboard {
    constructor() {
        this.blogs = [];
        this.filteredBlogs = [];
        this.currentCategory = 'All';
        this.searchTerm = '';
        this.categories = ['All', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education'];
        
        this.init();
    }

    init() {
        this.loadBlogs();
        this.setupEventListeners();
        this.renderCategoryChips();
        this.renderBlogs();
    }

    // Data Management
    loadBlogs() {
        const storedBlogs = localStorage.getItem('blogDashboard_blogs');
        if (storedBlogs) {
            this.blogs = JSON.parse(storedBlogs);
        } else {
            // Initialize with sample data
            this.blogs = [
                {
                    id: "1",
                    title: "Getting Started with React Hooks",
                    content: "React Hooks revolutionized how we write React components. In this comprehensive guide, we'll explore useState, useEffect, useContext, and custom hooks. Learn how to manage state, handle side effects, and create reusable logic in your React applications. We'll cover best practices, common pitfalls, and advanced patterns that will make you a more effective React developer.",
                    category: "Technology",
                    createdAt: "2025-09-15T10:30:00Z"
                },
                {
                    id: "2", 
                    title: "The Future of Remote Work",
                    content: "Remote work has transformed from a perk to a necessity. This article explores the evolution of remote work culture, the tools that make it possible, and predictions for the future. We'll discuss productivity strategies, maintaining work-life balance, and how companies are adapting their policies. Learn about the challenges and opportunities that lie ahead in the remote work landscape.",
                    category: "Business",
                    createdAt: "2025-09-14T14:20:00Z"
                },
                {
                    id: "3",
                    title: "Healthy Morning Routines That Actually Work", 
                    content: "Starting your day right can transform your entire life. This guide presents evidence-based morning routines that boost energy, productivity, and mental well-being. From meditation and exercise to nutrition and planning, discover the habits that successful people swear by. We'll provide practical tips for building sustainable routines that fit your lifestyle and schedule.",
                    category: "Health",
                    createdAt: "2025-09-13T09:15:00Z"
                },
                {
                    id: "4",
                    title: "Minimalist Living: Less is More",
                    content: "Minimalism isn't just about having fewer possessions—it's about intentional living. This article explores the philosophy behind minimalism, practical steps to declutter your life, and the psychological benefits of living with less. Learn how to identify what truly matters, create peaceful living spaces, and find freedom through simplicity. Discover how minimalism can lead to greater happiness and fulfillment.",
                    category: "Lifestyle", 
                    createdAt: "2025-09-12T16:45:00Z"
                },
                {
                    id: "5",
                    title: "Machine Learning Fundamentals",
                    content: "Machine learning is reshaping industries and creating new possibilities. This beginner-friendly guide covers the core concepts of supervised, unsupervised, and reinforcement learning. We'll explore popular algorithms, real-world applications, and the tools you need to get started. Whether you're a developer looking to expand your skills or simply curious about AI, this article provides a solid foundation for understanding machine learning.",
                    category: "Technology",
                    createdAt: "2025-09-11T11:30:00Z"
                }
            ];
            this.saveBlogs();
        }
        this.filterBlogs();
    }

    saveBlogs() {
        localStorage.setItem('blogDashboard_blogs', JSON.stringify(this.blogs));
    }

    // Event Listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', this.debounce((e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.filterBlogs();
            this.renderBlogs();
        }, 300));

        // Add blog modal
        const addBlogBtn = document.getElementById('add-blog-btn');
        const addBlogModal = document.getElementById('add-blog-modal');
        const modalClose = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-btn');
        const modalBackdrop = addBlogModal.querySelector('.modal-backdrop');

        addBlogBtn.addEventListener('click', () => this.openModal('add-blog-modal'));
        modalClose.addEventListener('click', () => this.closeModal('add-blog-modal'));
        cancelBtn.addEventListener('click', () => this.closeModal('add-blog-modal'));
        modalBackdrop.addEventListener('click', () => this.closeModal('add-blog-modal'));

        // Blog detail modal
        const detailModalClose = document.getElementById('detail-modal-close');
        const detailModal = document.getElementById('blog-detail-modal');
        const detailBackdrop = detailModal.querySelector('.modal-backdrop');

        detailModalClose.addEventListener('click', () => this.closeModal('blog-detail-modal'));
        detailBackdrop.addEventListener('click', () => this.closeModal('blog-detail-modal'));

        // Form submission
        const addBlogForm = document.getElementById('add-blog-form');
        addBlogForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBlog();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('add-blog-modal');
                this.closeModal('blog-detail-modal');
            }
        });
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        if (modalId === 'add-blog-modal') {
            setTimeout(() => {
                document.getElementById('blog-title').focus();
            }, 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form if it's the add blog modal
        if (modalId === 'add-blog-modal') {
            document.getElementById('add-blog-form').reset();
        }
    }

    // Blog Management
    addBlog() {
        const title = document.getElementById('blog-title').value.trim();
        const category = document.getElementById('blog-category').value;
        const content = document.getElementById('blog-content').value.trim();

        if (!title || !category || !content) {
            alert('Please fill in all fields');
            return;
        }

        const newBlog = {
            id: this.generateId(),
            title,
            content,
            category,
            createdAt: new Date().toISOString()
        };

        this.blogs.unshift(newBlog);
        this.saveBlogs();
        this.filterBlogs();
        this.renderBlogs();
        this.closeModal('add-blog-modal');

        // Show success feedback
        this.showToast('Blog added successfully!');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Filtering and Search
    filterBlogs() {
        let filtered = this.blogs;

        // Apply category filter
        if (this.currentCategory !== 'All') {
            filtered = filtered.filter(blog => blog.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchTerm && this.searchTerm.length > 0) {
            filtered = filtered.filter(blog => 
                blog.title.toLowerCase().includes(this.searchTerm) ||
                blog.content.toLowerCase().includes(this.searchTerm)
            );
        }

        this.filteredBlogs = filtered;
    }

    // Rendering Functions
    renderCategoryChips() {
        const container = document.getElementById('category-chips');
        container.innerHTML = '';

        this.categories.forEach(category => {
            const chip = document.createElement('button');
            chip.className = `category-chip ${category === this.currentCategory ? 'active' : ''}`;
            chip.textContent = category;
            chip.setAttribute('aria-pressed', category === this.currentCategory);
            
            chip.addEventListener('click', () => {
                this.currentCategory = category;
                this.filterBlogs();
                this.renderBlogs();
                this.renderCategoryChips();
            });

            container.appendChild(chip);
        });
    }

    renderBlogs() {
        const blogGrid = document.getElementById('blog-grid');
        const emptyState = document.getElementById('empty-state');

        // Always hide empty state first to prevent flickering
        emptyState.classList.add('hidden');

        if (this.filteredBlogs.length === 0) {
            blogGrid.innerHTML = '';
            // Small delay to ensure grid is cleared first
            setTimeout(() => {
                emptyState.classList.remove('hidden');
            }, 50);
            return;
        }
        
        // Clear existing blogs with animation
        const existingCards = blogGrid.querySelectorAll('.blog-card');
        if (existingCards.length > 0) {
            existingCards.forEach(card => {
                card.classList.add('removing');
            });

            setTimeout(() => {
                this.displayFilteredBlogs(blogGrid);
            }, 150);
        } else {
            this.displayFilteredBlogs(blogGrid);
        }
    }

    displayFilteredBlogs(blogGrid) {
        blogGrid.innerHTML = '';
        
        this.filteredBlogs.forEach((blog, index) => {
            const blogCard = this.createBlogCard(blog);
            blogCard.style.animationDelay = `${index * 50}ms`;
            blogGrid.appendChild(blogCard);
        });
    }

    createBlogCard(blog) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('role', 'article');
        
        const formattedDate = this.formatDate(blog.createdAt);
        const truncatedContent = this.truncateText(blog.content, 120);
        const categoryClass = blog.category.toLowerCase();

        card.innerHTML = `
            <div class="blog-card-header">
                <h3 class="blog-title">${this.escapeHtml(blog.title)}</h3>
                <span class="category-badge category-badge--${categoryClass}">${blog.category}</span>
            </div>
            <p class="blog-content-preview">${this.escapeHtml(truncatedContent)}</p>
            <div class="blog-card-footer">
                <span class="blog-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${formattedDate}
                </span>
                <span class="read-more">Read more</span>
            </div>
        `;

        // Add click handler to open blog detail modal
        card.addEventListener('click', () => {
            this.openBlogDetail(blog);
        });

        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openBlogDetail(blog);
            }
        });

        return card;
    }

    openBlogDetail(blog) {
        const modal = document.getElementById('blog-detail-modal');
        const title = document.getElementById('detail-title');
        const category = document.getElementById('detail-category');
        const date = document.getElementById('detail-date');
        const content = document.getElementById('detail-content');

        title.textContent = blog.title;
        category.textContent = blog.category;
        category.className = `category-badge category-badge--${blog.category.toLowerCase()}`;
        date.textContent = this.formatDate(blog.createdAt);
        content.innerHTML = this.formatContent(blog.content);

        this.openModal('blog-detail-modal');
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatContent(content) {
        // Simple paragraph formatting
        return content.split('\n\n').map(paragraph => 
            `<p>${this.escapeHtml(paragraph.trim())}</p>`
        ).join('');
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 32px;
            background-color: var(--color-success);
            color: var(--color-btn-primary-text);
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 300);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogDashboard();
});

// Service Worker Registration (for better performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Progressive Web App functionality
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button if needed
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline');
});
