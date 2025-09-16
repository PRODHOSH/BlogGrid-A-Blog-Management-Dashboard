// Enhanced Blog Dashboard with 3D Effects and Dark Mode - Fully Functional Version
class BlogDashboard {
    constructor() {
        this.blogs = [];
        this.filteredBlogs = [];
        this.currentCategory = 'All';
        this.searchTerm = '';
        this.categories = ['All', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education'];
        this.isDarkMode = false;
        this.currentSort = 'newest';
        this.currentDateRange = 'all';
        this.filterCount = 0;
        
        console.log('BlogDashboard constructor called');
        this.init();
    }

    async init() {
        console.log('Initializing BlogDashboard...');
        try {
            this.initTheme();
            this.loadBlogs();
            this.setupEventListeners();
            this.renderCategoryChips();
            await this.renderBlogs();
            this.setup3DEffects();
            console.log('BlogDashboard initialization complete');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // Theme Management
    initTheme() {
        console.log('Initializing theme...');
        this.isDarkMode = false;
        this.applyTheme();
    }

    toggleTheme() {
        console.log('Toggling theme...');
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        
        // Add transition effect
        const app = document.getElementById('app');
        if (app) {
            app.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                app.style.transition = '';
            }, 300);
        }

        this.showToast(`Switched to ${this.isDarkMode ? 'dark' : 'light'} mode`);
    }

    applyTheme() {
        const app = document.getElementById('app');
        if (app) {
            if (this.isDarkMode) {
                app.setAttribute('data-color-scheme', 'dark');
                console.log('Applied dark theme');
            } else {
                app.setAttribute('data-color-scheme', 'light');
                console.log('Applied light theme');
            }
        }
    }

    // 3D Effects Setup
    setup3DEffects() {
        console.log('Setting up 3D effects...');
        this.setupCardTiltEffects();
        this.setupParallaxEffects();
        this.setupFloatingAnimation();
    }

    setupCardTiltEffects() {
        let isMouseTracking = false;
        
        document.addEventListener('mousemove', (e) => {
            if (isMouseTracking) return;
            isMouseTracking = true;
            
            requestAnimationFrame(() => {
                const cards = document.querySelectorAll('.blog-card');
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const isHovered = (
                        e.clientX >= rect.left &&
                        e.clientX <= rect.right &&
                        e.clientY >= rect.top &&
                        e.clientY <= rect.bottom
                    );

                    if (isHovered) {
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        
                        const deltaX = (e.clientX - centerX) / (rect.width / 2);
                        const deltaY = (e.clientY - centerY) / (rect.height / 2);
                        
                        const rotateY = deltaX * 10;
                        const rotateX = deltaY * -10;
                        
                        card.style.transform = `
                            translateY(-8px) 
                            translateZ(20px) 
                            rotateX(${5 + rotateX}deg) 
                            rotateY(${2 + rotateY}deg)
                            scale(1.02)
                        `;
                        card.classList.add('card-hovered');
                    }
                });
                isMouseTracking = false;
            });
        });

        // Reset transforms when mouse leaves cards
        document.addEventListener('mouseleave', () => {
            const cards = document.querySelectorAll('.blog-card');
            cards.forEach(card => {
                card.style.transform = '';
                card.classList.remove('card-hovered');
            });
        });
    }

    setupParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            
            const title = document.querySelector('.app-title');
            if (title) {
                title.style.transform = `translateY(${rate}px) translateZ(10px)`;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    setupFloatingAnimation() {
        const fab = document.getElementById('add-blog-btn');
        if (fab && !fab.style.animationName) {
            fab.style.animation = 'fabFloat 3s ease-in-out infinite';
        }
    }

    // Data Management
    loadBlogs() {
        console.log('Loading blogs...');
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
            },
            {
                id: "6",
                title: "The Art of Digital Photography",
                content: "Digital photography has democratized image creation, but mastering it requires understanding both technical and artistic principles. This comprehensive guide covers camera settings, composition rules, lighting techniques, and post-processing workflows. Learn how to capture stunning images in various conditions, from portrait photography to landscape shots. We'll also explore the latest trends in digital photography and editing software.",
                category: "Lifestyle",
                createdAt: "2025-09-10T08:45:00Z"
            }
        ];
        
        this.filterBlogs();
        console.log(`Loaded ${this.blogs.length} blogs`);
    }

    // Event Listeners Setup
    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            console.log('Search input found, attaching listener');
            searchInput.addEventListener('input', this.debounce((e) => {
                console.log('Search input changed:', e.target.value);
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.filterBlogs();
                this.renderBlogsWithAnimation();
            }, 300));
        } else {
            console.error('Search input not found');
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            console.log('Theme toggle found, attaching listener');
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Theme toggle clicked');
                this.toggleTheme();
            });
        } else {
            console.error('Theme toggle not found');
        }

        // Filter functionality
        this.setupFilterEventListeners();

        // Add blog modal
        this.setupModalEventListeners();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('add-blog-modal');
                this.closeModal('blog-detail-modal');
                this.closeFilterDropdown();
            }
        });

        // Close filter dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const filterContainer = document.querySelector('.filter-container');
            if (filterContainer && !filterContainer.contains(e.target)) {
                this.closeFilterDropdown();
            }
        });

        console.log('Event listeners setup complete');
    }

    setupFilterEventListeners() {
        const filterBtn = document.getElementById('filter-btn');
        if (filterBtn) {
            console.log('Filter button found, attaching listener');
            filterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter button clicked');
                this.toggleFilterDropdown();
            });
        } else {
            console.error('Filter button not found');
        }

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                console.log('Sort changed to:', e.target.value);
                this.currentSort = e.target.value;
                this.updateFilterCount();
                this.filterBlogs();
                this.renderBlogsWithAnimation();
            });
        }

        const dateRangeSelect = document.getElementById('date-range-select');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                console.log('Date range changed to:', e.target.value);
                this.currentDateRange = e.target.value;
                this.updateFilterCount();
                this.filterBlogs();
                this.renderBlogsWithAnimation();
            });
        }

        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                console.log('Clear filters clicked');
                this.clearAllFilters();
            });
        }
    }

    setupModalEventListeners() {
        const addBlogBtn = document.getElementById('add-blog-btn');
        if (addBlogBtn) {
            console.log('Add blog button found, attaching listener');
            addBlogBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add blog button clicked');
                this.openModal('add-blog-modal');
            });
        } else {
            console.error('Add blog button not found');
        }

        // Add blog modal controls
        const modalClose = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-btn');
        const addBlogModal = document.getElementById('add-blog-modal');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal('add-blog-modal'));
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal('add-blog-modal'));
        }
        if (addBlogModal) {
            const backdrop = addBlogModal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeModal('add-blog-modal'));
            }
        }

        // Blog detail modal controls
        const detailModalClose = document.getElementById('detail-modal-close');
        const detailModal = document.getElementById('blog-detail-modal');
        
        if (detailModalClose) {
            detailModalClose.addEventListener('click', () => this.closeModal('blog-detail-modal'));
        }
        if (detailModal) {
            const backdrop = detailModal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeModal('blog-detail-modal'));
            }
        }

        // Form submission
        const addBlogForm = document.getElementById('add-blog-form');
        if (addBlogForm) {
            addBlogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Add blog form submitted');
                this.addBlog();
            });
        }
    }

    toggleFilterDropdown() {
        const filterDropdown = document.getElementById('filter-dropdown');
        const filterBtn = document.getElementById('filter-btn');
        
        if (filterDropdown && filterBtn) {
            const isHidden = filterDropdown.classList.contains('hidden');
            console.log('Filter dropdown is currently hidden:', isHidden);
            
            if (isHidden) {
                filterDropdown.classList.remove('hidden');
                filterBtn.classList.add('active');
                console.log('Filter dropdown opened');
            } else {
                filterDropdown.classList.add('hidden');
                filterBtn.classList.remove('active');
                console.log('Filter dropdown closed');
            }
        } else {
            console.error('Filter dropdown or button not found');
        }
    }

    closeFilterDropdown() {
        const filterDropdown = document.getElementById('filter-dropdown');
        const filterBtn = document.getElementById('filter-btn');
        
        if (filterDropdown && filterBtn) {
            filterDropdown.classList.add('hidden');
            filterBtn.classList.remove('active');
        }
    }

    updateFilterCount() {
        let count = 0;
        
        if (this.currentSort !== 'newest') count++;
        if (this.currentDateRange !== 'all') count++;
        if (this.currentCategory !== 'All') count++;
        if (this.searchTerm) count++;
        
        this.filterCount = count;
        const filterCountEl = document.getElementById('filter-count');
        
        if (filterCountEl) {
            if (count > 0) {
                filterCountEl.textContent = count;
                filterCountEl.classList.remove('hidden');
            } else {
                filterCountEl.classList.add('hidden');
            }
        }
        
        console.log('Filter count updated to:', count);
    }

    clearAllFilters() {
        this.currentSort = 'newest';
        this.currentDateRange = 'all';
        this.currentCategory = 'All';
        this.searchTerm = '';
        
        // Update UI
        const sortSelect = document.getElementById('sort-select');
        const dateRangeSelect = document.getElementById('date-range-select');
        const searchInput = document.getElementById('search-input');
        
        if (sortSelect) sortSelect.value = 'newest';
        if (dateRangeSelect) dateRangeSelect.value = 'all';
        if (searchInput) searchInput.value = '';
        
        this.updateFilterCount();
        this.filterBlogs();
        this.renderBlogsWithAnimation();
        this.renderCategoryChips();
        this.closeFilterDropdown();
        
        this.showToast('All filters cleared');
    }

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
        console.log('Opening modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            if (modalId === 'add-blog-modal') {
                setTimeout(() => {
                    const titleInput = document.getElementById('blog-title');
                    if (titleInput) titleInput.focus();
                }, 100);
            }
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            if (modalId === 'add-blog-modal') {
                const form = document.getElementById('add-blog-form');
                if (form) form.reset();
            }
        }
    }

    // Blog Management
    addBlog() {
        const titleInput = document.getElementById('blog-title');
        const categorySelect = document.getElementById('blog-category');
        const contentTextarea = document.getElementById('blog-content');

        if (!titleInput || !categorySelect || !contentTextarea) {
            this.showToast('Form elements not found', 'error');
            return;
        }

        const title = titleInput.value.trim();
        const category = categorySelect.value;
        const content = contentTextarea.value.trim();

        if (!title || !category || !content) {
            this.showToast('Please fill in all fields', 'error');
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
        this.filterBlogs();
        this.renderBlogsWithAnimation();
        this.closeModal('add-blog-modal');

        this.showToast('Blog added successfully!', 'success');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Filtering and Search
    filterBlogs() {
        console.log('Filtering blogs...');
        let filtered = [...this.blogs];

        // Apply category filter
        if (this.currentCategory !== 'All') {
            filtered = filtered.filter(blog => blog.category === this.currentCategory);
            console.log(`Filtered by category ${this.currentCategory}:`, filtered.length);
        }

        // Apply date range filter
        if (this.currentDateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date(now);
            
            switch (this.currentDateRange) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case '3months':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filtered = filtered.filter(blog => new Date(blog.createdAt) >= filterDate);
            console.log(`Filtered by date range ${this.currentDateRange}:`, filtered.length);
        }

        // Apply search filter
        if (this.searchTerm && this.searchTerm.length > 0) {
            filtered = filtered.filter(blog => 
                blog.title.toLowerCase().includes(this.searchTerm) ||
                blog.content.toLowerCase().includes(this.searchTerm)
            );
            console.log(`Filtered by search "${this.searchTerm}":`, filtered.length);
        }

        // Apply sorting
        switch (this.currentSort) {
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        this.filteredBlogs = filtered;
        this.updateFilterCount();
        console.log('Final filtered blogs:', this.filteredBlogs.length);
    }

    // Rendering Functions
    renderCategoryChips() {
        console.log('Rendering category chips...');
        const container = document.getElementById('category-chips');
        if (!container) {
            console.error('Category chips container not found');
            return;
        }
        
        container.innerHTML = '';

        this.categories.forEach(category => {
            const chip = document.createElement('button');
            chip.className = `category-chip ${category === this.currentCategory ? 'active' : ''}`;
            chip.textContent = category;
            chip.setAttribute('aria-pressed', category === this.currentCategory);
            
            chip.addEventListener('click', () => {
                console.log('Category chip clicked:', category);
                this.currentCategory = category;
                this.filterBlogs();
                this.renderBlogsWithAnimation();
                this.renderCategoryChips();
                this.showToast(`Filtered by ${category}`);
            });

            container.appendChild(chip);
        });
        
        console.log('Category chips rendered');
    }

    async renderBlogs() {
        console.log('Rendering blogs...');
        const blogGrid = document.getElementById('blog-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!blogGrid || !emptyState) {
            console.error('Blog grid or empty state not found');
            return;
        }

        emptyState.classList.add('hidden');

        if (this.filteredBlogs.length === 0) {
            blogGrid.innerHTML = '';
            setTimeout(() => {
                emptyState.classList.remove('hidden');
            }, 50);
            return;
        }
        
        await this.displayFilteredBlogs(blogGrid);
    }

    renderBlogsWithAnimation() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;
        
        const existingCards = blogGrid.querySelectorAll('.blog-card');
        
        if (existingCards.length > 0) {
            existingCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 50}ms`;
                card.classList.add('removing');
            });

            setTimeout(() => {
                this.renderBlogs();
            }, 300);
        } else {
            this.renderBlogs();
        }
    }

    async displayFilteredBlogs(blogGrid) {
        blogGrid.innerHTML = '';
        
        // Create cards with staggered animation
        this.filteredBlogs.forEach((blog, index) => {
            setTimeout(() => {
                const blogCard = this.createBlogCard(blog);
                blogCard.style.animationDelay = `${index * 150}ms`;
                blogGrid.appendChild(blogCard);
                console.log(`Blog card ${index + 1} added to grid`);
            }, index * 50);
        });
    }

    createBlogCard(blog) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        
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

        // Add click handler
        card.addEventListener('click', () => {
            this.openBlogDetail(blog);
        });

        // Add keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openBlogDetail(blog);
            }
        });

        return card;
    }

    openBlogDetail(blog) {
        console.log('Opening blog detail for:', blog.title);
        const modal = document.getElementById('blog-detail-modal');
        const title = document.getElementById('detail-title');
        const category = document.getElementById('detail-category');
        const date = document.getElementById('detail-date');
        const content = document.getElementById('detail-content');

        if (modal && title && category && date && content) {
            title.textContent = blog.title;
            category.textContent = blog.category;
            category.className = `category-badge category-badge--${blog.category.toLowerCase()}`;
            date.textContent = this.formatDate(blog.createdAt);
            content.innerHTML = this.formatContent(blog.content);

            this.openModal('blog-detail-modal');
        } else {
            console.error('Blog detail modal elements not found');
        }
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
        return content.split('\n\n').map(paragraph => 
            `<p>${this.escapeHtml(paragraph.trim())}</p>`
        ).join('');
    }

    showToast(message, type = 'success') {
        console.log('Showing toast:', message, type);
        
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let bgColor = 'var(--color-success)';
        if (type === 'error') bgColor = 'var(--color-error)';
        if (type === 'warning') bgColor = 'var(--color-warning)';
        
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 32px;
            background-color: ${bgColor};
            color: var(--color-btn-primary-text);
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            max-width: 300px;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application
console.log('Script loaded, waiting for DOM...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    try {
        window.blogDashboard = new BlogDashboard();
        console.log('Blog Dashboard initialization started');
    } catch (error) {
        console.error('Failed to initialize Blog Dashboard:', error);
    }
});

// Ensure the app works even if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing immediately');
    setTimeout(() => {
        if (!window.blogDashboard) {
            try {
                window.blogDashboard = new BlogDashboard();
                console.log('Blog Dashboard initialized after timeout');
            } catch (error) {
                console.error('Failed to initialize Blog Dashboard after timeout:', error);
            }
        }
    }, 100);
}
