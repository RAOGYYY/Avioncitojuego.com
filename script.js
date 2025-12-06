// Global function for theme toggle (for other pages)
function toggleTheme() {
    if (window.storyboardTool && typeof window.storyboardTool.toggleTheme === 'function') {
        // Use the main tool's toggleTheme method
        window.storyboardTool.toggleTheme();
    } else {
        // Fallback for standalone pages
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update toggle button icon
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize theme for standalone pages
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle button icon
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize theme on page load for standalone pages
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
    initializeTheme();
}

// Mobile Menu Toggle Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavDropdown = document.querySelector('.mobile-nav-dropdown');
    
    if (mobileMenuToggle && mobileNavDropdown) {
        console.log('Mobile menu initialized');
        
        // Toggle menu on button click/touch
        const toggleMenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = mobileNavDropdown.classList.toggle('active');
            console.log('Menu toggled:', isOpen);
            
            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        };
        
        // Use both click and touchend for better mobile support
        mobileMenuToggle.addEventListener('click', toggleMenu);
        mobileMenuToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMenu(e);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileNavDropdown.classList.contains('active')) {
                if (!mobileMenuToggle.contains(e.target) && !mobileNavDropdown.contains(e.target)) {
                    mobileNavDropdown.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            }
        });
        
        // Close menu when clicking a link
        mobileNavDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileNavDropdown.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
        
        // Close menu on window resize (if switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileNavDropdown.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    } else {
        console.log('Mobile menu elements not found');
    }
}

// Initialize mobile menu on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// Add event listeners for theme toggle buttons on all pages
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Replace placeholder prefixes like "?? " or "? " with appropriate icons
    try {
        const pickIconForHeading = (textLower) => {
            const map = [
                { k: ['warm color','warm colors'], i: 'fa-fire' },
                { k: ['cool color','cool colors'], i: 'fa-snowflake' },
                { k: ['neutral color','neutral colors'], i: 'fa-circle-half-stroke' },
                { k: ['complementary'], i: 'fa-arrows-left-right' },
                { k: ['analogous'], i: 'fa-palette' },
                { k: ['triadic'], i: 'fa-shapes' },
                { k: ['visual hierarchy','hierarchy'], i: 'fa-layer-group' },
                { k: ['color psychology','color theory'], i: 'fa-palette' },
                { k: ['visual balance','balance'], i: 'fa-scale-balanced' },
                { k: ['visual rhythm','rhythm'], i: 'fa-wave-square' },
                { k: ['foundation','principle'], i: 'fa-lightbulb' },
                { k: ['eye level'], i: 'fa-eye' },
                { k: ['low angle'], i: 'fa-arrow-down-long' },
                { k: ['high angle'], i: 'fa-arrow-up-long' },
                { k: ['close-up','close up'], i: 'fa-magnifying-glass-plus' },
                { k: ['wide shot','wide'], i: 'fa-arrows-left-right' },
                { k: ['dutch angle','tilt'], i: 'fa-rotate-right' },
                { k: ['hard lighting'], i: 'fa-sun' },
                { k: ['soft lighting'], i: 'fa-cloud-sun' },
                { k: ['key light'], i: 'fa-key' },
                { k: ['fill light'], i: 'fa-fill-drip' },
                { k: ['rim light'], i: 'fa-circle-dot' },
                { k: ['practical lighting'], i: 'fa-lightbulb' },
            ];
            for (const m of map) {
                if (m.k.some(k => textLower.includes(k))) return m.i;
            }
            return 'fa-circle';
        };

        const fixHeadings = () => {
            const headings = document.querySelectorAll('h2, h3, h4, h5');
            headings.forEach(h => {
                const raw = (h.textContent || '').trim();
                if (/^\?\??\s+/.test(raw)) {
                    const clean = raw.replace(/^\?\??\s+/, '');
                    const iconCls = pickIconForHeading(clean.toLowerCase());
                    h.innerHTML = `<i class="fas ${iconCls}"></i> ${clean}`;
                }
            });
        };

        fixHeadings();
    } catch (e) {
        console.warn('Heading icon fixer failed:', e);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Configuration - Uses secure Vercel serverless API route
    const CONFIG = (typeof window !== 'undefined' && window.APP_CONFIG) ? window.APP_CONFIG : {
        // Gemini 2.0 Flash Lite Configuration (Latest & Optimized)
        projectId: 'theta-arcana-468817-t3',
        locationId: 'global',
        modelId: 'gemini-2.0-flash-lite-001',
        
        // Secure API route (API key is stored on server via Vercel environment variables)
        apiRoute: '/api/gemini',
        
        // Application settings
        maxScriptLength: 15000,
        maxScenes: 38,
        dialogueCharLimit: 95,
    };

    // Vertical mode constants
    const VERTICAL_OBJECTS = {
        'phone': '{characterName} holds a smartphone, the screen\'s glow illuminating their face as they scroll through content',
        'laptop': '{characterName} sits at a laptop, fingers dancing across the keyboard, the screen casting a soft blue light',
        'book': '{characterName} reads a book, occasionally looking up with thoughtful expressions, the pages catching the light',
        'coffee': '{characterName} sips from a coffee cup, steam rising gently, their expression contemplative and relaxed',
        'glasses': '{characterName} adjusts reading glasses, squinting at text, the lenses catching reflections of light',
        'watch': '{characterName} checks a wristwatch, the gesture revealing a moment of time-conscious awareness',
        'bag': '{characterName} carries a shoulder bag, its weight suggesting purpose, their posture casual yet determined',
        'hat': '{characterName} wears a casual hat, casting soft shadows across their face, adding depth to their expression',
        'umbrella': '{characterName} holds an umbrella, its vibrant color a stark contrast to the surroundings, a beacon of personality',
        'jewelry': '{characterName} wears simple jewelry, elegant and understated, catching the light with subtle sparkles',
        'none': ''
    };

    class StoryboardGeneratorTool {
        constructor() {
            this.state = {
                theme: localStorage.getItem('theme') || 'light',
                isGenerating: false,
                currentStoryboard: null,
                aboutVisible: false,
                howToUseVisible: false,
                configVisible: false,
                unifiedSettingsVisible: false,
                activeTab: 'config',
                characterCount: 1,
                lastScrollPosition: 0,
                justOpened: false, // Flag to prevent immediate closing
                consistentEnvironment: false,
            };
            this.initialize();
        }

        initialize() {
            console.log('🚀 Initializing StoryboardGeneratorTool...');
            console.log('📋 CONFIG loaded:', CONFIG);
            console.log('🤖 Model ID:', CONFIG.modelId);
            console.log('🔗 Secure API Route:', CONFIG.apiRoute);

            // Initialize vertical mode functionality
            this.initializeVerticalMode();
            
            this.setupEventListeners();
            this.setupScrollBehavior();
            this.initializeTheme();
            this.loadSavedSettings();
            this.validateApiConnection();
            this.initializeCollaboration();
        }

        setupEventListeners() {
            // Theme toggle is now handled globally after tool initialization



            // Scroll to top button
            const scrollToTopBtn = document.getElementById('scrollToTopBtn');
            if (scrollToTopBtn) {
                scrollToTopBtn.addEventListener('click', () => this.scrollToTop());
            }

            // About, How to Use, and Config buttons - FIXED
            const aboutBtn = document.getElementById('aboutBtn');
            const howToUseBtn = document.getElementById('howToUseBtn');
            const configBtn = document.getElementById('configBtn');

            if (aboutBtn) {
                aboutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('About button clicked');
                    this.toggleAbout();
                });
            }

            if (howToUseBtn) {
                howToUseBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('How to Use button clicked');
                    this.toggleHowToUse();
                });
            }

            // Other event listeners
            document.getElementById('clearInput')?.addEventListener('click', () => this.clearInput());
            document.getElementById('generatePrompt')?.addEventListener('click', () => this.handleGeneration());
            const envToggle = document.getElementById('consistentEnvironmentToggle');
            if (envToggle) {
                envToggle.addEventListener('change', (e) => {
                    this.state.consistentEnvironment = !!e.target.checked;
                });
                this.state.consistentEnvironment = !!envToggle.checked;
            }

            // Vertical mode toggle
            const verticalModeToggle = document.getElementById('verticalMode');
            if (verticalModeToggle) {
                verticalModeToggle.addEventListener('change', (e) => {
                    const verticalSettings = document.getElementById('verticalSettings');
                    if (verticalSettings) {
                        verticalSettings.style.display = e.target.checked ? 'block' : 'none';
                    }
                });
            }


            document.getElementById('userInput')?.addEventListener('input', () => this.updateDialogueCount());

            

            

            // Unified Settings Dropdown with Mobile Tabs
            document.getElementById('unifiedSettingsToggle')?.addEventListener('click', () => this.toggleUnifiedSettingsDropdown());
            document.getElementById('saveSettingsBtn')?.addEventListener('click', () => this.saveSettings());
            document.getElementById('loadSavedBtn')?.addEventListener('click', () => this.loadSavedSettings());
            document.getElementById('clearAllBtn')?.addEventListener('click', () => this.clearAllSettings());

            // Mobile Tab System
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
            });

            // Config section buttons
            document.getElementById('resetConfigBtn')?.addEventListener('click', () => this.resetConfig());
            document.getElementById('saveConfigBtn')?.addEventListener('click', () => this.saveConfig());

            // Config field sync
            document.getElementById('configTransitionStyle')?.addEventListener('change', (e) => {
                const mainTransition = document.getElementById('transitionStyle');
                if (mainTransition) mainTransition.value = e.target.value;
            });

            document.getElementById('configVisualStyle')?.addEventListener('change', (e) => {
                const mainVisual = document.getElementById('visualStyle');
                if (mainVisual) mainVisual.value = e.target.value;
            });

            // Results controls
            document.getElementById('copyAllBtn')?.addEventListener('click', () => this.copyAllStoryboard());
            document.getElementById('copyDialoguesBtn')?.addEventListener('click', () => this.copyDialoguesOnly());
                    document.getElementById('downloadBtn')?.addEventListener('click', () => this.downloadStoryboard());
            document.getElementById('shareBtn')?.addEventListener('click', () => this.shareStoryboard());
            document.getElementById('copyConsistentAssetsBtn')?.addEventListener('click', () => this.copyConsistentAssets());
            document.getElementById('jsonPromptBtn')?.addEventListener('click', () => this.copyJsonPrompt());

            // Scroll to top button
            document.getElementById('scrollToTopBtn')?.addEventListener('click', () => this.scrollToTop());



            // Close dropdown when clicking outside (but prevent closing on character removal)
            document.addEventListener('click', (e) => {
                const dropdown = document.getElementById('unifiedSettingsToggle');
                const dropdownContent = document.getElementById('unifiedSettingsContent');

                // Don't close if clicking on character-related elements or tabs
                if (e.target.closest('.character-input-group') || 
                    e.target.closest('.mobile-add-btn') || 
                    e.target.closest('.mobile-remove-btn') ||
                    e.target.closest('.tab-btn') ||
                    e.target.closest('.mobile-control-btn')) {
                    return;
                }

                if (dropdown && dropdownContent && 
                    !dropdown.contains(e.target) && 
                    !dropdownContent.contains(e.target) && 
                    this.state.unifiedSettingsVisible) {
                    this.toggleUnifiedSettingsDropdown();
                }
            });
        }

        setupScrollBehavior() {
            // FIXED: Improved scroll behavior with debouncing and proper detection
            let scrollTimeout;

            window.addEventListener('scroll', () => {
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

                // Clear previous timeout
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }

                // Debounce scroll events
                scrollTimeout = setTimeout(() => {
                    // Only close sections if:
                    // 1. User has scrolled to very top (less than 50px)
                    // 2. User is scrolling UP (not down)
                    // 3. It's been at least 2 seconds since a section was opened
                    // 4. Section wasn't just opened (prevent immediate closing)

                    if (currentScrollPosition < 50 && 
                        currentScrollPosition < this.state.lastScrollPosition && 
                        !this.state.justOpened) {

                        if (this.state.aboutVisible) {
                            console.log('Auto-closing About section due to scroll to top');
                            this.toggleAbout();
                        }
                        if (this.state.howToUseVisible) {
                            console.log('Auto-closing How to Use section due to scroll to top');
                            this.toggleHowToUse();
                        }
                        if (this.state.configVisible) {
                            console.log('Auto-closing Config section due to scroll to top');
                            this.toggleConfig();
                        }
                    }

                    // Update last scroll position
                    this.state.lastScrollPosition = currentScrollPosition;

                    // Show/hide scroll to top button
                    const scrollBtn = document.getElementById('scrollToTopBtn');
                    if (scrollBtn) {
                        if (currentScrollPosition > 300) {
                            scrollBtn.style.display = 'flex';
                        } else {
                            scrollBtn.style.display = 'none';
                        }
                    }
                }, 100); // Debounce by 100ms
            });
        }

        initializeTheme() {
            document.documentElement.setAttribute('data-theme', this.state.theme);
            const themeToggle = document.querySelector('#themeToggle i');
            if (themeToggle) {
                themeToggle.className = this.state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        initializeVerticalMode() {
            const verticalModeCheckbox = document.getElementById('verticalMode');
            const verticalSettings = document.getElementById('verticalSettings');
            
            if (verticalModeCheckbox && verticalSettings) {
                // Show/hide vertical settings based on checkbox state
                verticalModeCheckbox.addEventListener('change', () => {
                    verticalSettings.style.display = verticalModeCheckbox.checked ? 'block' : 'none';
                });
                
                // Initialize state
                verticalSettings.style.display = verticalModeCheckbox.checked ? 'block' : 'none';
            }
        }

        toggleTheme() {
            this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', this.state.theme);
            document.documentElement.setAttribute('data-theme', this.state.theme);
            
            // Update toggle button icon
            const themeToggle = document.querySelector('#themeToggle i');
            if (themeToggle) {
                themeToggle.className = this.state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        // FIXED About toggle function
        toggleAbout() {
            const aboutSection = document.getElementById('aboutSection');
            const aboutBtn = document.getElementById('aboutBtn');

            if (!aboutSection || !aboutBtn) {
                console.error('About section or button not found');
                return;
            }

            // Close How to Use if open
            if (this.state.howToUseVisible) {
                console.log('Closing How to Use section first');
                this.state.howToUseVisible = false;
                const howToUseSection = document.getElementById('howToUseSection');
                const howToUseBtn = document.getElementById('howToUseBtn');

                if (howToUseSection && howToUseBtn) {
                    howToUseSection.style.display = 'none';
                    howToUseBtn.innerHTML = '<i class="fas fa-question-circle"></i> Guide';
                    howToUseBtn.classList.remove('active');
                }
            }

            // Toggle About section
            this.state.aboutVisible = !this.state.aboutVisible;

            console.log('About section visible state:', this.state.aboutVisible);

            if (this.state.aboutVisible) {
                // Set flag to prevent immediate closing
                this.state.justOpened = true;

                // Show About section
                aboutSection.style.display = 'block';
                aboutSection.style.opacity = '0';
                aboutSection.style.transform = 'translateY(-10px)';

                // Animate in
                setTimeout(() => {
                    aboutSection.style.transition = 'all 0.3s ease-out';
                    aboutSection.style.opacity = '1';
                    aboutSection.style.transform = 'translateY(0)';
                }, 10);

                aboutBtn.innerHTML = '<i class="fas fa-times"></i> Close';
                aboutBtn.classList.add('active');

                // Scroll to section
                setTimeout(() => {
                    aboutSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);

                // Clear the justOpened flag after 3 seconds
                setTimeout(() => {
                    this.state.justOpened = false;
                }, 3000);

                console.log('About section opened and displayed');
            } else {
                // Hide About section
                aboutSection.style.transition = 'all 0.3s ease-out';
                aboutSection.style.opacity = '0';
                aboutSection.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    aboutSection.style.display = 'none';
                }, 300);

                aboutBtn.innerHTML = '<i class="fas fa-info-circle"></i> About';
                aboutBtn.classList.remove('active');

                console.log('About section closed and hidden');
            }
        }

        // FIXED How to Use toggle function
        toggleHowToUse() {
            const howToUseSection = document.getElementById('howToUseSection');
            const howToUseBtn = document.getElementById('howToUseBtn');

            if (!howToUseSection || !howToUseBtn) {
                console.error('How to Use section or button not found');
                return;
            }

            // Close About if open
            if (this.state.aboutVisible) {
                console.log('Closing About section first');
                this.state.aboutVisible = false;
                const aboutSection = document.getElementById('aboutSection');
                const aboutBtn = document.getElementById('aboutBtn');

                if (aboutSection && aboutBtn) {
                    aboutSection.style.display = 'none';
                    aboutBtn.innerHTML = '<i class="fas fa-info-circle"></i> About';
                    aboutBtn.classList.remove('active');
                }
            }

            // Toggle How to Use section
            this.state.howToUseVisible = !this.state.howToUseVisible;

            console.log('How to Use section visible state:', this.state.howToUseVisible);

            if (this.state.howToUseVisible) {
                // Set flag to prevent immediate closing
                this.state.justOpened = true;

                // Show How to Use section
                howToUseSection.style.display = 'block';
                howToUseSection.style.opacity = '0';
                howToUseSection.style.transform = 'translateY(-10px)';

                // Animate in
                setTimeout(() => {
                    howToUseSection.style.transition = 'all 0.3s ease-out';
                    howToUseSection.style.opacity = '1';
                    howToUseSection.style.transform = 'translateY(0)';
                }, 10);

                howToUseBtn.innerHTML = '<i class="fas fa-times"></i> Close';
                howToUseBtn.classList.add('active');

                // Scroll to section
                setTimeout(() => {
                    howToUseSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);

                // Clear the justOpened flag after 3 seconds
                setTimeout(() => {
                    this.state.justOpened = false;
                }, 3000);

                console.log('How to Use section opened and displayed');
            } else {
                // Hide How to Use section
                howToUseSection.style.transition = 'all 0.3s ease-out';
                howToUseSection.style.opacity = '0';
                howToUseSection.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    howToUseSection.style.display = 'none';
                }, 300);

                howToUseBtn.innerHTML = '<i class="fas fa-question-circle"></i> Guide';
                howToUseBtn.classList.remove('active');

                console.log('How to Use section closed and hidden');
            }
        }

        // FIXED Config toggle function
        toggleConfig() {
            const configSection = document.getElementById('configSection');
            const configBtn = document.getElementById('configBtn');

            if (!configSection || !configBtn) {
                console.error('Config section or button not found');
                return;
            }

            // Close other sections if open
            if (this.state.aboutVisible) {
                console.log('Closing About section first');
                this.state.aboutVisible = false;
                const aboutSection = document.getElementById('aboutSection');
                const aboutBtn = document.getElementById('aboutBtn');

                if (aboutSection && aboutBtn) {
                    aboutSection.style.display = 'none';
                    aboutBtn.innerHTML = '<i class="fas fa-info-circle"></i> About';
                    aboutBtn.classList.remove('active');
                }
            }

            if (this.state.howToUseVisible) {
                console.log('Closing How to Use section first');
                this.state.howToUseVisible = false;
                const howToUseSection = document.getElementById('howToUseSection');
                const howToUseBtn = document.getElementById('howToUseBtn');

                if (howToUseSection && howToUseBtn) {
                    howToUseSection.style.display = 'none';
                    howToUseBtn.innerHTML = '<i class="fas fa-question-circle"></i> Guide';
                    howToUseBtn.classList.remove('active');
                }
            }

            // Toggle Config section
            this.state.configVisible = !this.state.configVisible;

            console.log('Config section visible state:', this.state.configVisible);

            if (this.state.configVisible) {
                // Set flag to prevent immediate closing
                this.state.justOpened = true;

                // Show Config section
                configSection.style.display = 'block';
                configSection.style.opacity = '0';
                configSection.style.transform = 'translateY(-10px)';

                // Animate in
                setTimeout(() => {
                    configSection.style.transition = 'all 0.3s ease-out';
                    configSection.style.opacity = '1';
                    configSection.style.transform = 'translateY(0)';
                }, 10);

                configBtn.innerHTML = '<i class="fas fa-times"></i> Close';
                configBtn.classList.add('active');

                // Sync config values with main form
                this.syncConfigValues();

                // Scroll to section
                setTimeout(() => {
                    configSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);

                // Clear the justOpened flag after 3 seconds
                setTimeout(() => {
                    this.state.justOpened = false;
                }, 3000);

                console.log('Config section opened and displayed');
            } else {
                // Hide Config section
                configSection.style.transition = 'all 0.3s ease-out';
                configSection.style.opacity = '0';
                configSection.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    configSection.style.display = 'none';
                }, 300);

                configBtn.innerHTML = '<i class="fas fa-cogs"></i> Config';
                configBtn.classList.remove('active');

                console.log('Config section closed and hidden');
            }
        }

        syncConfigValues() {
            // Sync transition style
            const mainTransition = document.getElementById('transitionStyle');
            const configTransition = document.getElementById('configTransitionStyle');
            if (mainTransition && configTransition) {
                configTransition.value = mainTransition.value;
            }

            // Sync visual style
            const mainVisual = document.getElementById('visualStyle');
            const configVisual = document.getElementById('configVisualStyle');
            if (mainVisual && configVisual) {
                configVisual.value = mainVisual.value;
            }
        }

        // Unified Settings Dropdown Functions
        toggleUnifiedSettingsDropdown() {
            const toggle = document.getElementById('unifiedSettingsToggle');
            const content = document.getElementById('unifiedSettingsContent');

            this.state.unifiedSettingsVisible = !this.state.unifiedSettingsVisible;

            if (this.state.unifiedSettingsVisible) {
                toggle.classList.add('active');
                content.classList.add('active');
                content.style.display = 'block';
            } else {
                toggle.classList.remove('active');
                content.classList.remove('active');
                // Add small delay before hiding to allow animation
                setTimeout(() => {
                    if (!content.classList.contains('active')) {
                        content.style.display = 'none';
                    }
                }, 200);
            }
        }

        // Mobile Tab System
        switchTab(tabName) {
            // Update active tab state
            this.state.activeTab = tabName;

            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tabName) {
                    btn.classList.add('active');
                }
            });

            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const activeContent = document.getElementById(`${tabName}-tab`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        }

        // Dynamic Character Management - Fixed to NOT close dropdown
        addCharacter() {
            this.state.characterCount++;
            const charactersContainer = document.getElementById('charactersContainer');

            const characterInputGroup = document.createElement('div');
            characterInputGroup.className = 'character-input-group';
            characterInputGroup.setAttribute('data-character-id', this.state.characterCount);

            characterInputGroup.innerHTML = `
                <textarea 
                    class="character-input mobile-textarea"
                    placeholder="Character ${this.state.characterCount}: Name, age, appearance...

Example: Sarah: 25-year-old journalist, blonde hair, casual"
                    rows="2"
                ></textarea>
                <button class="remove-character-btn mobile-remove-btn" onclick="window.storyboardTool.removeCharacter(${this.state.characterCount})">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            charactersContainer.appendChild(characterInputGroup);

            // Update visibility of remove buttons
            this.updateRemoveButtonsVisibility();

            // Focus on the new character input
            const newInput = characterInputGroup.querySelector('.character-input');
            newInput.focus();

            this.showToast(`Character ${this.state.characterCount} added successfully!`, 'success');
        }

        // Fixed removeCharacter to NOT close dropdown
        removeCharacter(characterId) {
            const characterGroup = document.querySelector(`[data-character-id="${characterId}"]`);
            if (characterGroup) {
                // Add fade out animation
                characterGroup.style.transition = 'all 0.3s ease-out';
                characterGroup.style.opacity = '0';
                characterGroup.style.transform = 'translateY(-20px)';

                setTimeout(() => {
                    characterGroup.remove();
                    this.updateRemoveButtonsVisibility();
                    this.showToast(`Character removed successfully!`, 'success');
                }, 300);
            }
        }

        updateRemoveButtonsVisibility() {
            const characterGroups = document.querySelectorAll('.character-input-group');
            characterGroups.forEach((group, index) => {
                const removeBtn = group.querySelector('.remove-character-btn');
                if (removeBtn) {
                    // Show remove button only if there's more than one character
                    removeBtn.style.display = characterGroups.length > 1 ? 'flex' : 'none';
                }
            });
        }

        getAllCharacters() {
            const characterInputs = document.querySelectorAll('.character-input');
            const characters = [];

            characterInputs.forEach((input, index) => {
                const value = input.value.trim();
                if (value) {
                    characters.push(value);
                }
            });

            return characters.join('\n\n');
        }

        setAllCharacters(charactersText) {
            // Clear existing characters except the first one
            const charactersContainer = document.getElementById('charactersContainer');
            const firstCharacterGroup = charactersContainer.querySelector('.character-input-group');

            // Remove all character groups except the first
            const allGroups = charactersContainer.querySelectorAll('.character-input-group');
            allGroups.forEach((group, index) => {
                if (index > 0) {
                    group.remove();
                }
            });

            // Reset character count
            this.state.characterCount = 1;

            if (charactersText) {
                const characterEntries = charactersText.split('\n\n').filter(entry => entry.trim());

                characterEntries.forEach((entry, index) => {
                    if (index === 0) {
                        // Set first character
                        const firstInput = firstCharacterGroup.querySelector('.character-input');
                        firstInput.value = entry.trim();
                    } else {
                        // Add additional characters
                        this.addCharacterWithValue(entry.trim());
                    }
                });
            } else {
                // Clear the first character input
                const firstInput = firstCharacterGroup.querySelector('.character-input');
                firstInput.value = '';
            }

            this.updateRemoveButtonsVisibility();
        }

        addCharacterWithValue(value) {
            this.state.characterCount++;
            const charactersContainer = document.getElementById('charactersContainer');

            const characterInputGroup = document.createElement('div');
            characterInputGroup.className = 'character-input-group';
            characterInputGroup.setAttribute('data-character-id', this.state.characterCount);

            characterInputGroup.innerHTML = `
                <textarea 
                    class="character-input mobile-textarea"
                    placeholder="Character ${this.state.characterCount}: Name, age, appearance..."
                    rows="2"
                >${value}</textarea>
                <button class="remove-character-btn mobile-remove-btn" onclick="window.storyboardTool.removeCharacter(${this.state.characterCount})">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            charactersContainer.appendChild(characterInputGroup);
        }

        saveSettings() {
            const settings = {
                characters: this.getAllCharacters(),
                primarySetting: document.getElementById('primarySetting').value,
                visualStyle: document.getElementById('visualStyle').value,
                sceneCount: document.getElementById('sceneCount')?.value || 'auto',
                verticalMode: document.getElementById('verticalMode')?.checked || false,
                bgColor: document.getElementById('bgColor')?.value || 'Green Screen',
                characterDetails: {
                    hairColor: document.getElementById('hairColor')?.value || '',
                    eyeColor: document.getElementById('eyeColor')?.value || '',
                    shirtColor: document.getElementById('shirtColor')?.value || '',
                    shoesColor: document.getElementById('shoesColor')?.value || '',
                    faceDetails: document.getElementById('faceDetails')?.value || '',
                    ageBuild: document.getElementById('ageBuild')?.value || ''
                },
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('storyboardSettings', JSON.stringify(settings));
            this.showToast('Settings saved successfully!', 'success');
        }

        loadSavedSettings() {
                const saved = localStorage.getItem('storyboardSettings');
                if (saved) {
                    try {
                        const settings = JSON.parse(saved);
                        this.setAllCharacters(settings.characters || '');
                        document.getElementById('primarySetting').value = settings.primarySetting || '';
                        document.getElementById('visualStyle').value = settings.visualStyle || '';
                        
                        // Load scene count setting
                        if (settings.sceneCount) {
                            const sceneCountSelect = document.getElementById('sceneCount');
                            if (sceneCountSelect) {
                                sceneCountSelect.value = settings.sceneCount;
                            }
                        }
                        
                        // Load vertical mode settings
                        if (settings.verticalMode !== undefined) {
                            const verticalModeCheckbox = document.getElementById('verticalMode');
                            if (verticalModeCheckbox) {
                                verticalModeCheckbox.checked = settings.verticalMode;
                                const verticalSettings = document.getElementById('verticalSettings');
                                if (verticalSettings) {
                                    verticalSettings.style.display = settings.verticalMode ? 'block' : 'none';
                                }
                                
                                // Close dropdown when loading settings
                                const verticalModeToggle = document.getElementById('verticalModeToggle');
                                const verticalModeContent = document.getElementById('verticalModeContent');
                                if (verticalModeToggle && verticalModeContent) {
                                    verticalModeToggle.classList.remove('active');
                                    verticalModeContent.classList.remove('active');
                                }
                            }
                        }
                        
                        // Load background color
                        if (settings.bgColor) {
                            const bgColorInput = document.getElementById('bgColor');
                            if (bgColorInput) {
                                bgColorInput.value = settings.bgColor;
                            }
                        }
                        
                        // Load character details
                        if (settings.characterDetails) {
                            const details = settings.characterDetails;
                            if (details.hairColor) document.getElementById('hairColor').value = details.hairColor;
                            if (details.eyeColor) document.getElementById('eyeColor').value = details.eyeColor;
                            if (details.shirtColor) document.getElementById('shirtColor').value = details.shirtColor;
                            if (details.shoesColor) document.getElementById('shoesColor').value = details.shoesColor;
                            if (details.faceDetails) document.getElementById('faceDetails').value = details.faceDetails;
                            if (details.ageBuild) document.getElementById('ageBuild').value = details.ageBuild;
                        }

                        if (settings.timestamp) {
                            const date = new Date(settings.timestamp);
                            this.showToast(`Settings loaded from ${date.toLocaleDateString()}`, 'success');
                        }
                    } catch (error) {
                        console.error('Error loading settings:', error);
                        this.showToast('Error loading saved settings', 'error');
                    }
                }
                // Removed the else block that showed "No saved settings found"
            }

        clearAllSettings() {
            this.setAllCharacters('');
            document.getElementById('primarySetting').value = '';
            document.getElementById('visualStyle').value = '';
            
            // Reset scene count to auto
            const sceneCountSelect = document.getElementById('sceneCount');
            if (sceneCountSelect) {
                sceneCountSelect.value = 'auto';
            }
            
            // Clear vertical mode settings
            const verticalModeCheckbox = document.getElementById('verticalMode');
            if (verticalModeCheckbox) {
                verticalModeCheckbox.checked = false;
                const verticalSettings = document.getElementById('verticalSettings');
                if (verticalSettings) {
                    verticalSettings.style.display = 'none';
                }
                
                // Close dropdown when clearing settings
                const verticalModeToggle = document.getElementById('verticalModeToggle');
                const verticalModeContent = document.getElementById('verticalModeContent');
                if (verticalModeToggle && verticalModeContent) {
                    verticalModeToggle.classList.remove('active');
                    verticalModeContent.classList.remove('active');
                }
            }
            
            // Clear background color
            const bgColorInput = document.getElementById('bgColor');
            if (bgColorInput) {
                bgColorInput.value = 'Green Screen';
            }
            
            // Clear character details
            const characterFields = ['hairColor', 'eyeColor', 'shirtColor', 'shoesColor', 'faceDetails', 'ageBuild'];
            characterFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = '';
                }
            });
            
            localStorage.removeItem('storyboardSettings');
            this.showToast('All settings cleared', 'success');
        }

        async validateApiConnection() {
            console.log('🔍 Starting API validation via secure route...');
            console.log('🌐 API Route:', CONFIG.apiRoute);

            try {
                this.updateApiStatus('connecting', 'Connecting');
                console.log('🔄 Attempting API connection via secure Vercel route...');
                
                // Test with a simple prompt to validate the API connection
                const testPrompt = 'Hello, respond with exactly: Connection successful.';
                console.log('📝 Test prompt:', testPrompt);
                
                const response = await this.generateGeminiContent(testPrompt, { maxOutputTokens: 50 });
                console.log('✅ API response received:', response);
                
                if (response) {
                    this.updateApiStatus('connected', 'Live');
                    console.log('✅ Secure API connection successful');
                } else {
                    throw new Error('Empty response received');
                }
            } catch (error) {
                this.updateApiStatus('error', 'Connection Failed');
                console.error("❌ API Connection Error:", error);
                console.error("🔍 Error details:", {
                    message: error.message,
                    stack: error.stack,
                    apiRoute: CONFIG.apiRoute
                });
                this.showToast('API connection failed. Check console for details.', 'error');
            }
        }

        updateApiStatus(status, text) {
            const el = document.getElementById('apiStatus');
            if (!el) return;

            el.querySelector('.status-text').textContent = text;
            const dot = el.querySelector('.status-dot');
            dot.style.background = `var(--${status === 'connected' ? 'success' : 'danger'})`;
        }

        countDialogueLines(text) {
            if (!text) return 0;

            const lines = text.split('\n').filter(line => line.trim() !== '');
            let dialogueCount = 0;

            // Enhanced dialogue detection patterns
            const dialogueIndicators = [
                // English patterns
                'says', 'say', 'replies', 'reply', 'asks', 'ask', 'mutters', 'mutter',
                'shouts', 'shout', 'whispers', 'whisper', 'calls out', 'call out',
                'jokes', 'joke', 'adds', 'add', 'laughs and says', 'nods and says',
                'mutters to himself', 'speaks', 'speak', 'tells', 'tell',
                'responds', 'respond', 'exclaims', 'exclaim', 'screams', 'scream',
                'yells', 'yell', 'announces', 'announce', 'declares', 'declare',
                'states', 'state', 'mentions', 'mention', 'comments', 'comment',
                'continues', 'continue', 'interrupts', 'interrupt',
                'sighs and says', 'smiles and says',

                // Hindi/Urdu patterns
                'kehti hai', 'kehta hai', 'kaha', 'bola', 'boli',
                'puchta hai', 'puchti hai', 'jawab deta hai', 'jawab deti hai',
                'chillata hai', 'chillati hai', 'chillati hai', 'kehke', 'bolkar', 'kahkar',
                'haskar kehta hai', 'haskar kehti hai', 'muskurakar kehta hai',

                // Other common patterns
                'said', 'told', 'asked', 'replied', 'answered', 'questioned',
                'remarked', 'observed', 'noted', 'pointed out', 'suggested',
                'proposed', 'insisted', 'argued', 'protested', 'complained',
                'praised', 'criticized', 'warned'
            ];

            for (const line of lines) {
                const trimmedLine = line.trim();
                const lowerLine = trimmedLine.toLowerCase();

                // Skip empty lines
                if (!trimmedLine) continue;

                let isDialogue = false;

                // Method 1: Check for explicit dialogue indicators
                if (dialogueIndicators.some(indicator => lowerLine.includes(indicator))) {
                    isDialogue = true;
                }
                // Method 2: Lines starting with quotation marks (any type)
                else if (/^[\s]*["'""`„‚«»‹›「」『』〝〞〟]/u.test(trimmedLine)) {
                    isDialogue = true;
                }
                // Method 3: Lines ending with quotation marks and containing dialogue-like content
                else if (/["'""`„‚«»‹›「」『』〝〞〟][\s]*[.!?]*$/.test(trimmedLine) && trimmedLine.length > 3) {
                    isDialogue = true;
                }
                // Method 4: Character name followed by colon (script format)
                else if (/^[A-Z][A-Za-z\s]+:\s+/.test(trimmedLine)) {
                    isDialogue = true;
                }
                // Method 5: Lines with dialogue punctuation patterns
                else if (/[.!?]+["'""`„‚«»‹›「」『』〝〞〟]/.test(trimmedLine)) {
                    isDialogue = true;
                }
                // Method 6: Common conversational starters and responses
                const conversationalPatterns = [
                    /^(hello|hi|hey|okay|ok|yes|no|yeah|nah|sure|maybe|please|thanks|sorry)/i,
                    /^(what|how|why|when|where|who|which)/i,
                    /^(i\s|you\s|we\s|they\s|he\s|she\s|it\s)/i,
                    /^(let\'s|don\'t|can\'t|won\'t|shouldn\'t|wouldn\'t|couldn\'t)/i,
                    /\?$/, // Questions
                    /!$/, // Exclamations
                ];

                if (conversationalPatterns.some(pattern => pattern.test(trimmedLine))) {
                    // Additional check: must not be a narrative description
                    if (!lowerLine.includes('he ') && !lowerLine.includes('she ') && 
                        !lowerLine.includes('they ') && !lowerLine.includes('the character') &&
                        !lowerLine.includes('narrator') && !lowerLine.includes('scene')) {
                        isDialogue = true;
                    }
                }

                // Method 7: Hindi/Urdu conversational patterns
                const hindiPatterns = [
                    /^(kya|kaise|kahan|kab|kyun|kaun)/i,
                    /^(main|tum|hum|aap|wo|yeh)/i,
                    /^(haan|nahi|achha|theek|sorry|thanks)/i,
                ];

                if (hindiPatterns.some(pattern => pattern.test(trimmedLine))) {
                    isDialogue = true;
                }

                // Method 8: Emotional expressions and interjections
                const emotionalExpressions = [
                    /^(oh|ah|eh|uh|um|hmm|wow|oops|yay|hey)/i,
                    /^(ouch|ow|phew|whew|sigh|gasp|gulp)/i,
                    /^(haha|hehe|lol|omg|wtf|damn)/i,
                ];

                if (emotionalExpressions.some(pattern => pattern.test(trimmedLine))) {
                    isDialogue = true;
                }

                // Method 9: Exclude obvious narrative descriptions
                const narrativeExclusions = [
                    /^(the scene|fade in|fade out|cut to|close up|wide shot|camera)/i,
                    /^(meanwhile|later|earlier|suddenly|then|after)/i,
                    /^(description|note|setting|location|time)/i,
                ];

                if (narrativeExclusions.some(pattern => pattern.test(trimmedLine))) {
                    isDialogue = false;
                }

                if (isDialogue) {
                    dialogueCount++;
                }
            }

            return dialogueCount;
        }

        updateDialogueCount() {
            const userInput = document.getElementById('userInput');
            const statusContainer = document.getElementById('dialogueCountStatus');
            if (!userInput || !statusContainer) return;

            const script = userInput.value;
            const count = this.countDialogueLines(script);

            const dot = statusContainer.querySelector('.status-dot');
            const text = statusContainer.querySelector('.status-text');

            text.textContent = `Detected Dialogues: ${count}`;

            if (count > CONFIG.maxScenes) {
                dot.style.backgroundColor = 'var(--danger)';
            } else {
                dot.style.backgroundColor = 'var(--success)';
            }
        }

        clearInput() {
            document.getElementById('userInput').value = '';
            this.updateDialogueCount();
        }

        async handleGeneration() {
            if (this.state.isGenerating) return;

            const script = document.getElementById('userInput').value.trim();
            if (!script) {
                return this.showToast('Please paste your script first.', 'error');
            }

            if (script.length > CONFIG.maxScriptLength) {
                return this.showToast(`Script exceeds maximum character limit of ${CONFIG.maxScriptLength}.`, 'error');
            }

            this.state.isGenerating = true;
            this.showLoading(true);
            document.getElementById('resultsSection').style.display = 'none';

            const startTime = Date.now();

            try {
                const prompt = this.createGenerationPrompt(script);
                const responseText = await this.generateGeminiContent(prompt);

                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error("No valid JSON object found in API response.");
                }

                const storyboardData = JSON.parse(jsonMatch[0]);

                // Post-process to split long dialogues
                const processedStoryboard = this.processDialogueSplitting(storyboardData);
                const withEnvironment = this.applyEnvironmentMerging(processedStoryboard);
                const finalStoryboard = this.applyVerticalModeProcessing(withEnvironment);
                this.currentStoryboard = finalStoryboard;
                this.displayStoryboard(finalStoryboard);

                // Update analytics
                const generationTime = Math.round((Date.now() - startTime) / 1000);
                // Analytics functionality removed

                // AUTO-SCROLL TO RESULTS
                this.scrollToResults();

            } catch (error) {
                console.error("Storyboard Generation Error:", error);
                this.showToast('Failed to generate storyboard. Check console for errors.', 'error');
            } finally {
                this.state.isGenerating = false;
                this.showLoading(false);
            }
        }

        // Auto-scroll to results
        scrollToResults() {
            const resultsSection = document.getElementById('resultsSection');
            const generatedHeader = document.getElementById('generatedStoryboardHeader');

            if (resultsSection && generatedHeader) {
                // Small delay to ensure content is rendered
                setTimeout(() =>                {
                    generatedHeader.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start', 
                        inline: 'nearest' 
                    });

                    // Show success toast
                    setTimeout(() => {
                        this.showToast('✅ Storyboard generated successfully!', 'success');
                    }, 800);
                }, 300);
            }
        }

        // New function to split long dialogues into multiple scenes
        processDialogueSplitting(storyboardData) {
            if (!storyboardData.scenes) return storyboardData;

            const processedScenes = [];
            let sceneCounter = 1;
            
            // Check if vertical mode is enabled
            const isVerticalMode = document.getElementById('verticalMode')?.checked || false;
            
            // Check user's scene count preference
            const userSceneCount = document.getElementById('sceneCount')?.value || 'auto';
            const maxScenes = userSceneCount === 'auto' ? CONFIG.maxScenes : parseInt(userSceneCount);
            
            // Generate a unique story identifier based on the first scene's content
            const firstScene = storyboardData.scenes[0];
            const storyIdentifier = this.generateStoryIdentifier(firstScene);

            // Get the full consistent prompts from the storyboard data
            const characterConsistencyPrompt = storyboardData.consistent_character_prompt || "Maintain consistent character appearance, clothing, and mannerisms throughout the scene.";
            
            // Simple character consistency - no complex logic
            const firstSceneCharacterRef = "";
            
            // Use the original, simple character consistency approach
            const enhancedCharacterPrompt = characterConsistencyPrompt;
            


            storyboardData.scenes.forEach((scene, originalIndex) => {
                const dialogue = scene.dialogue || '';

                // If dialogue is within limit, keep as is
                if (dialogue.length <= CONFIG.dialogueCharLimit || dialogue === '(No dialogue)') {
                    let updatedScene = {
                        ...scene,
                        scene_number: sceneCounter++
                    };

                    // Add full character consistency to ALL scenes
                    if (sceneCounter === 2) {
                        // First scene: just the full consistent prompts without recognizable line
                        updatedScene.character_consistency = enhancedCharacterPrompt;
                    } else if (sceneCounter > 2 && storyIdentifier) {
                        // All other scenes: add recognizable line in parentheses
                        updatedScene.character_consistency = `${enhancedCharacterPrompt} (Use the same character as in the "${storyIdentifier}" scene.)`;
                    }

                    processedScenes.push(updatedScene);
                } else {
                    // Split long dialogue into multiple scenes
                    const dialogueParts = this.splitDialogue(dialogue, CONFIG.dialogueCharLimit);

                    dialogueParts.forEach((dialoguePart, partIndex) => {
                        let newScene = {
                            ...scene,
                            scene_number: sceneCounter++,
                            dialogue: dialoguePart,
                            // Add continuation indicator for split scenes
                            visual_prompt: partIndex === 0 ? scene.visual_prompt : 
                                          `${scene.visual_prompt} (Continuation of previous scene)`,
                            // Handle action_prompt based on mode
                            ...(isVerticalMode ? {} : {
                                action_prompt: partIndex === 0 ? scene.action_prompt : 
                                              `${scene.action_prompt} (Continued dialogue delivery)`
                            })
                        };

                        // Add full character consistency to ALL scenes
                        if (sceneCounter === 2) {
                            // First scene: just the full consistent prompts without recognizable line
                            newScene.character_consistency = enhancedCharacterPrompt;
                        } else if (sceneCounter > 2 && storyIdentifier) {
                            // All other scenes: add recognizable line in parentheses
                            newScene.character_consistency = `${enhancedCharacterPrompt} (Use the same character as in the "${storyIdentifier}" scene.)`;
                        }

                        processedScenes.push(newScene);
                    });
                }
            });

            // If we exceed max scenes, truncate
            if (processedScenes.length > maxScenes) {
                processedScenes.splice(maxScenes);
                processedScenes[processedScenes.length - 1].dialogue += ` [Truncated - Scene limit of ${maxScenes} reached]`;
            }

            return {
                ...storyboardData,
                scenes: processedScenes
            };
        }

        // Function to intelligently split dialogue
        splitDialogue(dialogue, maxLength) {
            if (dialogue.length <= maxLength) {
                return [dialogue];
            }

            const parts = [];
            let remaining = dialogue.trim();

            while (remaining.length > 0) {
                if (remaining.length <= maxLength) {
                    parts.push(remaining);
                    break;
                }

                // Find the best split point within the limit
                let splitPoint = maxLength;

                // Try to split at sentence boundaries first
                const sentenceEnd = remaining.substring(0, maxLength).lastIndexOf('. ');
                if (sentenceEnd > maxLength * 0.6) { // Don't split too early
                    splitPoint = sentenceEnd + 1;
                }
                // Try to split at word boundaries
                else {
                    const lastSpace = remaining.substring(0, maxLength).lastIndexOf(' ');
                    if (lastSpace > maxLength * 0.7) { // Don't split too early
                        splitPoint = lastSpace;
                    }
                }

                // Extract the part and clean it up
                let part = remaining.substring(0, splitPoint).trim();
                if (part.length > 0) {
                    parts.push(part);
                }

                // Update remaining text
                remaining = remaining.substring(splitPoint).trim();
            }

            return parts.filter(part => part.length > 0);
        }



        createGenerationPrompt(script) {
            const transitionStyle = document.getElementById('transitionStyle').value;
            const characters = this.getAllCharacters();
            const primarySetting = document.getElementById('primarySetting').value.trim();
            const visualStyle = document.getElementById('visualStyle').value;
            const isConsistentEnv = !!this.state.consistentEnvironment;
            const isVerticalMode = document.getElementById('verticalMode')?.checked || false;
            const sceneCount = document.getElementById('sceneCount')?.value || 'auto';

            let characterInstructions = '';
            let settingInstructions = '';
            let styleInstructions = '';

            if (characters) {
                characterInstructions = `\n\n**USER-PROVIDED CHARACTER DESCRIPTIONS:**\n${characters}\n\nUse these character descriptions for consistency across all scenes.`;
            }

            if (primarySetting) {
                settingInstructions = `\n\n**USER-PROVIDED SETTING DESCRIPTION (ENVIRONMENT):**\n${primarySetting}\n\nUse this EXACT environment in EVERY scene. Merge it into each scene's visual_prompt. Do NOT output a separate environment prompt. IMPORTANT: Do NOT add "| Environment:" sections if the visual_prompt already contains environment descriptions.`;
            }

            // Environment policy instructions
            let environmentPolicy = '';
            if (primarySetting) {
                environmentPolicy = `\n\n**ENVIRONMENT POLICY:** The user provided a manual environment above. Override any auto-generation and merge that exact environment text into the visual_prompt of ALL scenes. Do NOT include any top-level environment fields. IMPORTANT: Avoid duplicate "| Environment:" sections - merge naturally into the visual description.`;
            } else if (isConsistentEnv) {
                environmentPolicy = `\n\n**ENVIRONMENT POLICY:** Auto-generate ONE concise environment description for the entire storyboard and merge that SAME environment text into the visual_prompt of EVERY scene. Do NOT include any top-level environment fields. IMPORTANT: Avoid duplicate "| Environment:" sections - merge naturally into the visual description.`;
            } else {
                environmentPolicy = `\n\n**ENVIRONMENT POLICY:** Toggle is OFF - Generate DIFFERENT/ADAPTIVE environments for EACH scene based on the scene's specific context, dialogue, and action. Each scene should have its own unique environment that fits that particular scene's situation. Do NOT include any top-level environment fields. IMPORTANT: Avoid duplicate "| Environment:" sections - merge naturally into the visual description. CRITICAL: When toggle is OFF, each scene must have a DIFFERENT environment description that matches that specific scene's context - do NOT use the same environment across scenes.`;
            }

            if (visualStyle) {
                styleInstructions = `\n\n**VISUAL STYLE PREFERENCE:** ${visualStyle}\nApply this visual style to all scene descriptions.`;
            }

            // Vertical mode instructions
            let verticalInstructions = '';
            if (isVerticalMode) {
                verticalInstructions = `\n\n**VERTICAL MODE ENABLED:** Generate scenes optimized for vertical video format (9:16 aspect ratio). In vertical mode:
- NO action_prompt fields - merge character actions into visual_prompt
- Camera is rotated 90 degrees counter-clockwise for vertical emphasis
- Character stands centered in vertical safe zone
- Background is solid color backdrop (no complex environments)
- Focus on character-centric composition
- Each scene should be optimized for mobile viewing
- Create flowing, natural descriptions that integrate character details seamlessly
- Use descriptive language that paints a vivid picture
- Include emotional and atmospheric elements
- Ensure character name is naturally integrated throughout the description
- Environment consistency toggle works with vertical mode (environment details integrated naturally into scene descriptions)`;
            }

            // Scene count instructions
            let sceneCountInstructions = '';
            if (sceneCount !== 'auto') {
                sceneCountInstructions = `\n\n**SCENE COUNT REQUIREMENT:** Generate exactly ${sceneCount} scenes. Do not exceed this limit. Each scene should be approximately 8 seconds in duration.`;
            }

            return `
You are a world-class, multilingual storyboard creator for the Veo 3 AI video generator. Your task is to analyze the provided script with extreme precision and generate a structured JSON output optimized for Veo 3's capabilities.

**CRITICAL REQUIREMENTS FOR VEO 3 OPTIMIZATION:**

1. **Enhanced Visual Prompts**: Create cinematic, detailed visual descriptions that include:
   - Camera angles and movements (close-up, wide shot, tracking shot, etc.)
   - Lighting conditions (golden hour, soft lighting, dramatic shadows)
   - Visual style (photorealistic, cinematic, documentary style)
   - Color grading suggestions (warm tones, cool blues, high contrast)
   - Composition details (rule of thirds, symmetrical, dynamic framing)

2. **Character Consistency**: For recurring characters, provide:
   - Detailed physical appearance (age, ethnicity, build, distinctive features)
   - Clothing and style descriptions
   - Facial expressions and body language patterns
   - Voice and mannerism indicators

3. **Environment Enhancement**: Create rich environmental descriptions:
   - Time of day and weather conditions
   - Architectural details and props
   - Atmosphere and mood indicators
   - Spatial relationships and depth

**DIALOGUE HANDLING - IMPORTANT:**
- Generate natural dialogue for each scene without worrying about character limits
- The system will automatically split long dialogues across multiple scenes later
- Focus on creating authentic, meaningful dialogue that fits the scene context
- Each dialogue should feel natural and conversational

**Primary Analysis Tasks:**

1. **Identify Consistent Assets:**
   - "consistent_character_prompt": Ultra-detailed description of main character(s) with physical traits, clothing, age, ethnicity, and distinctive features

2. **Intelligent Scene Splitting:**
   - Split script into logical 8-second scenes anchored by dialogue or action beats
   - Analyze script structure for dialogue indicators and contextual clues
   - Estimate word count per 8-second segment in the script's language
   - Maximum 38 scenes initially (dialogue splitting may create additional scenes)

**Enhanced JSON Output Structure:**
${isVerticalMode ? `**VERTICAL MODE (9:16 format):**
{
  "consistent_character_prompt": "Detailed character description with physical traits, age, ethnicity, clothing style, and distinctive features for Veo 3 consistency",
  "scenes": [
    {
      "scene_number": 1,
      "visual_prompt": "Flowing, natural description with camera rotated 90° counter-clockwise, character naturally integrated with actions, solid background, mobile-optimized composition",
      "dialogue": "Natural dialogue without character restrictions - system will auto-split if needed",
      "camera_direction": "Static shot, centered framing for vertical format",
      "mood_lighting": "Even lighting optimized for vertical composition",
      "character_consistency": "Character appearance details for consistency",
      "duration": "8 seconds"
    }
  ]
}` : `**NORMAL MODE (16:9 format):**
{
  "consistent_character_prompt": "Detailed character description with physical traits, age, ethnicity, clothing style, and distinctive features for Veo 3 consistency",
  "scenes": [
    {
      "scene_number": 1,
      "visual_prompt": "Cinematic description with camera angle, lighting, composition, visual style",
      "action_prompt": "Detailed character actions, movements, gestures, and expressions",
      "dialogue": "Natural dialogue without character restrictions - system will auto-split if needed",
      "camera_direction": "Specific camera movement or angle (close-up, wide shot, tracking, etc.)",
      "mood_lighting": "Lighting description (golden hour, soft lighting, dramatic, etc.)",
      "duration": "8 seconds"
    }
  ]
}`}

**Transition Style:** ${transitionStyle}${characterInstructions}${settingInstructions}${styleInstructions}${environmentPolicy}${verticalInstructions}${sceneCountInstructions}

**Script to Analyze:**
---
${script}
---

Return ONLY the valid JSON object with enhanced Veo 3-optimized prompts. Do NOT include any top-level environment fields. The system will handle dialogue length optimization automatically.
`;
        }

        // Vertical mode post-processing
        applyVerticalModeProcessing(storyboardData) {
            const isVerticalMode = document.getElementById('verticalMode')?.checked || false;
            
            if (!isVerticalMode || !storyboardData || !Array.isArray(storyboardData.scenes)) {
                return storyboardData;
            }

            // Remove action_prompt fields and ensure character_consistency is present
            storyboardData.scenes = storyboardData.scenes.map(scene => {
                const { action_prompt, ...sceneWithoutAction } = scene;
                
                // Ensure character_consistency is present
                if (!sceneWithoutAction.character_consistency) {
                    sceneWithoutAction.character_consistency = storyboardData.consistent_character_prompt || 
                        "Maintain consistent character appearance, clothing, and mannerisms throughout the scene.";
                }
                
                return sceneWithoutAction;
            });

            return storyboardData;
        }

        // Environment merging logic per requirements
        applyEnvironmentMerging(storyboardData) {
            try {
                if (!storyboardData || !Array.isArray(storyboardData.scenes)) return storyboardData;

                const manualEnv = (document.getElementById('primarySetting')?.value || '').trim();
                const toggleOn = !!this.state.consistentEnvironment;

                // If manual environment is provided: Always use it for all scenes
                if (manualEnv) {
                    const isVerticalMode = document.getElementById('verticalMode')?.checked || false;
                    
                    storyboardData.scenes = storyboardData.scenes.map(scene => {
                        // Remove any existing "| Environment:" sections to prevent duplicates
                        let cleanVisualPrompt = scene.visual_prompt || '';
                        cleanVisualPrompt = cleanVisualPrompt.replace(/\s*\|\s*Environment:.*$/g, '').trim();
                        
                        let updatedVisualPrompt;
                        if (isVerticalMode) {
                            // In vertical mode, integrate environment more naturally
                            // Since vertical mode focuses on character-centric descriptions,
                            // we'll add environment as part of the scene context
                            updatedVisualPrompt = cleanVisualPrompt ? 
                                `${cleanVisualPrompt} The scene takes place in ${manualEnv.toLowerCase()}.` : 
                                `The scene takes place in ${manualEnv.toLowerCase()}.`;
                        } else {
                            // Normal mode: append environment with separator
                            updatedVisualPrompt = cleanVisualPrompt ? 
                                `${cleanVisualPrompt} | Environment: ${manualEnv}` : 
                                `Environment: ${manualEnv}`;
                        }
                        
                        return {
                            ...scene,
                            visual_prompt: updatedVisualPrompt
                        };
                    });
                    // Ensure no separate environment fields
                    delete storyboardData.environment_prompt;
                    return storyboardData;
                }

                // Auto-generated environment behavior
                // Toggle OFF (default): each scene can keep its own (no change needed)
                // Toggle ON: generate a single environment string and merge into all scenes
                if (toggleOn) {
                    const isVerticalMode = document.getElementById('verticalMode')?.checked || false;
                    
                    // Prefer environment_prompt from consistent assets if present
                    let globalEnv = '';

                    // Infer a compact environment phrase from first scene visual_prompt
                    const firstVisual = storyboardData.scenes[0]?.visual_prompt || '';
                    // Remove any existing environment sections before inferring
                    const cleanFirstVisual = firstVisual.replace(/\s*\|\s*Environment:.*$/g, '').trim();
                    const inferred = cleanFirstVisual.split(/[.\n]/)[0].trim();
                    globalEnv = inferred || 'consistent environment';

                    storyboardData.scenes = storyboardData.scenes.map(scene => {
                        // Remove any existing "| Environment:" sections to prevent duplicates
                        let cleanVisualPrompt = scene.visual_prompt || '';
                        cleanVisualPrompt = cleanVisualPrompt.replace(/\s*\|\s*Environment:.*$/g, '').trim();
                        
                        let updatedVisualPrompt;
                        if (isVerticalMode) {
                            // In vertical mode, integrate environment more naturally
                            updatedVisualPrompt = cleanVisualPrompt ? 
                                `${cleanVisualPrompt} The scene takes place in ${globalEnv.toLowerCase()}.` : 
                                `The scene takes place in ${globalEnv.toLowerCase()}.`;
                        } else {
                            // Normal mode: append environment with separator
                            updatedVisualPrompt = cleanVisualPrompt ? 
                                `${cleanVisualPrompt} | Environment: ${globalEnv}` : 
                                `Environment: ${globalEnv}`;
                        }
                        
                        return {
                            ...scene,
                            visual_prompt: updatedVisualPrompt
                        };
                    });
                    delete storyboardData.environment_prompt;
                } else {
                    // Toggle OFF: Clean any existing "| Environment:" sections but keep original scene environments
                    // This ensures the API-generated adaptive environments per scene are preserved
                    storyboardData.scenes = storyboardData.scenes.map(scene => {
                        // Remove any existing "| Environment:" sections to prevent duplicates
                        let cleanVisualPrompt = scene.visual_prompt || '';
                        cleanVisualPrompt = cleanVisualPrompt.replace(/\s*\|\s*Environment:.*$/g, '').trim();
                        
                        return {
                            ...scene,
                            visual_prompt: cleanVisualPrompt || scene.visual_prompt
                        };
                    });
                }

                return storyboardData;
            } catch (e) {
                console.error('Environment merging error:', e);
                return storyboardData;
            }
        }

        // Vertical mode visual prompt generation
        generateVerticalVisualPrompt(characterName, userCharacterDetails, settings) {
            const bgColor = document.getElementById('bgColor')?.value || 'solid white';
            const selectedObjects = this.getSelectedObjects();
            
            // Character consistency prompt
            const characterPrompt = userCharacterDetails || this.generateAutoCharacter(settings.script);
            
            // Build a natural, flowing description that reads like descriptive prose
            let visualPrompt = '';
            
            // Start with atmospheric description
            visualPrompt += `In this vertical composition, the camera's ninety-degree counter-clockwise rotation transforms the familiar horizontal world into a striking vertical tableau. `;
            
            // Introduce the character naturally
            if (characterPrompt) {
                visualPrompt += `${characterName} emerges as the central figure, ${characterPrompt.toLowerCase()}, `;
            } else {
                visualPrompt += `${characterName} emerges as the central figure, `;
            }
            
            // Describe their positioning and the scene's mood
            visualPrompt += `positioned with perfect balance within the vertical safe zone. `;
            
            // Create atmospheric background description
            if (bgColor.includes('white') || bgColor.includes('light')) {
                visualPrompt += `The ${bgColor} backdrop creates a clean, minimalist canvas that draws all attention to the character's presence. `;
            } else if (bgColor.includes('dark') || bgColor.includes('black')) {
                visualPrompt += `The ${bgColor} backdrop provides a dramatic, cinematic foundation that makes the character's form stand out with striking clarity. `;
            } else {
                visualPrompt += `The ${bgColor} backdrop offers a subtle, textured foundation that complements the character's presence without overwhelming it. `;
            }
            
            // Integrate objects naturally into the narrative
            if (selectedObjects.length > 0 && selectedObjects[0] !== 'none') {
                visualPrompt += `As the scene unfolds, `;
                const objectDescriptions = selectedObjects.map((obj, index) => {
                    if (VERTICAL_OBJECTS[obj]) {
                        return VERTICAL_OBJECTS[obj].replace('{characterName}', characterName);
                    }
                    return `${characterName} naturally interacts with a ${obj}`;
                });
                
                if (objectDescriptions.length === 1) {
                    visualPrompt += objectDescriptions[0] + '. ';
                } else if (objectDescriptions.length === 2) {
                    visualPrompt += objectDescriptions[0] + ', while ' + objectDescriptions[1] + '. ';
                } else {
                    visualPrompt += objectDescriptions.slice(0, -1).join(', ') + ', and ' + objectDescriptions[objectDescriptions.length - 1] + '. ';
                }
            }
            
            // Add emotional and atmospheric elements
            visualPrompt += `The vertical framing creates an intimate, personal connection with the viewer, drawing them into ${characterName}'s world. `;
            
            // Ensure technical requirements are met naturally
            visualPrompt += `Every element within the 16:9 frame contributes to the story, with no wasted space or distracting overlays. `;
            
            // Add a poetic closing that emphasizes the vertical experience
            visualPrompt += `This vertical perspective transforms the ordinary into the extraordinary, creating a moment of pure visual storytelling that captivates the mobile viewer's attention.`;
            
            return {
                visualPrompt: visualPrompt,
                characterConsistency: characterPrompt
            };
        }

        // Get selected objects for vertical mode
        getSelectedObjects() {
            // For now, return a default object - you can enhance this with actual object selection UI
            return ['phone']; // Default to phone
        }

        // Generate auto character description
        generateAutoCharacter(script) {
            // AI-based character generation based on script context
            const characterTypes = [
                "whose flowing brown hair catches the light as it frames their oval face, dressed in a casual white t-shirt and dark jeans with comfortable sneakers that speak of everyday adventures",
                "whose short black hair is styled with precision, their crisp business shirt and tailored dress pants reflecting a life of purpose, completed by polished formal shoes that carry them through important moments",
                "whose athletic build is complemented by blonde hair pulled back in a vibrant ponytail, their colorful sports jersey and athletic shorts telling stories of competition, while well-worn running shoes show the miles they've traveled",
                "whose friendly, expressive face is framed by salt-and-pepper hair that adds character to every smile, dressed in a comfortable polo shirt and khaki pants that speak of wisdom earned, with classic loafers that have walked many paths"
            ];
            
            // Simple logic - you can enhance with AI analysis
            return characterTypes[Math.floor(Math.random() * characterTypes.length)];
        }

        // Get character consistency based on manual input or auto-generation
        getCharacterConsistency(settings) {
            const manualDetails = this.getManualCharacterDetails();
            
            if (manualDetails) {
                // Use user-provided details
                return this.buildCharacterPrompt(manualDetails);
            } else {
                // Auto-generate based on script content
                return this.generateAutoCharacter(settings.script);
            }
        }

        // Get manual character details from form inputs
        getManualCharacterDetails() {
            const hairColor = document.getElementById('hairColor')?.value.trim();
            const eyeColor = document.getElementById('eyeColor')?.value.trim();
            const shirtColor = document.getElementById('shirtColor')?.value.trim();
            const shoesColor = document.getElementById('shoesColor')?.value.trim();
            const faceDetails = document.getElementById('faceDetails')?.value.trim();
            const ageBuild = document.getElementById('ageBuild')?.value.trim();
            
            if (!hairColor && !eyeColor && !shirtColor && !shoesColor && !faceDetails && !ageBuild) {
                return null; // No manual details provided
            }
            
            return {
                hairColor, eyeColor, shirtColor, shoesColor, faceDetails, ageBuild
            };
        }

        // Build character prompt from manual details
        buildCharacterPrompt(details) {
            let prompt = "";
            
            // Start with age and build for natural flow
            if (details.ageBuild) {
                prompt += `${details.ageBuild}`;
                if (details.faceDetails) {
                    prompt += ` with ${details.faceDetails}`;
                }
                prompt += " whose ";
            } else if (details.faceDetails) {
                prompt += `${details.faceDetails} person whose `;
            } else {
                prompt += "whose ";
            }
            
            // Describe hair and eyes with natural language
            if (details.hairColor) {
                prompt += `${details.hairColor} hair flows naturally`;
                if (details.eyeColor) {
                    prompt += `, while their ${details.eyeColor} eyes sparkle with life`;
                }
                prompt += ". ";
            } else if (details.eyeColor) {
                prompt += `${details.eyeColor} eyes sparkle with life. `;
            }
            
            // Describe clothing with style and personality
            if (details.shirtColor || details.shoesColor) {
                prompt += "They're dressed ";
                if (details.shirtColor && details.shoesColor) {
                    prompt += `in a ${details.shirtColor} top paired with ${details.shoesColor} footwear`;
                } else if (details.shirtColor) {
                    prompt += `in a ${details.shirtColor} top`;
                } else if (details.shoesColor) {
                    prompt += `with ${details.shoesColor} footwear`;
                }
                prompt += ", ";
            }
            
            // Add personality and mood reflection
            if (prompt.length > 0) {
                // Remove trailing comma and space if present
                if (prompt.endsWith(", ")) {
                    prompt = prompt.slice(0, -2);
                }
                prompt += " — their entire appearance tells a story of who they are and what moment they're experiencing";
            }
            
            return prompt;
        }

        // Copy JSON prompt to clipboard
        copyJsonPrompt() {
            if (!this.currentStoryboard) {
                this.showToast('No JSON to copy yet. Generate first.', 'warning');
                return;
            }
            try {
                const json = JSON.stringify(this.currentStoryboard, null, 2);
                this.copyToClipboard(json);
                this.showToast('JSON prompt copied to clipboard!', 'success');
            } catch (e) {
                console.error('JSON copy error:', e);
                this.showToast('Failed to copy JSON.', 'error');
            }
        }

        async generateGeminiContent(prompt, options = {}) {
            console.log('🚀 Making Gemini API request via secure Vercel route...');
            console.log('📝 Prompt:', prompt);
            console.log('⚙️ Options:', options);
            console.log('🌐 API Route:', CONFIG.apiRoute);
            
            const requestBody = {
                prompt: prompt,
                model: CONFIG.modelId
            };
            
            console.log('📦 Request body:', requestBody);

            try {
                console.log('🔄 Sending fetch request to secure API route...');
                const response = await fetch(CONFIG.apiRoute, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('📡 Response status:', response.status, response.statusText);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: response.statusText }));
                    console.error('❌ API Error Response:', errorData);
                    throw new Error(errorData.error || `API request failed: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('📥 Response data:', data);
            
                // Handle standard Gemini response format
                if (data.candidates && data.candidates[0]) {
                    const result = data.candidates[0].content.parts[0].text;
                    console.log('✅ API call successful, result:', result);
                    return result;
                } else {
                    console.error('❌ Unexpected response format:', data);
                    throw new Error('Unexpected API response format');
                }
            } catch (error) {
                console.error('❌ Fetch error:', error);
                console.error('❌ Error type:', error.constructor.name);
                console.error('❌ Error message:', error.message);
                
                // Check if it's a network error
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    console.error('❌ Network error detected - check internet connection');
                }
                
                throw error;
            }
        }

        // Note: Fallback logic is now handled by the secure Vercel API route (/api/gemini)

        displayStoryboard(data) {
            const consistentContainer = document.getElementById('consistentPromptsContainer');
            const overviewContainer = document.getElementById('storyboardOverview');
            const storyboardContainer = document.getElementById('storyboardContainer');

            // Clear previous content
            const consistentContent = consistentContainer.querySelector('.consistent-assets-content');
            const consistentHeader = consistentContainer.querySelector('.consistent-assets-header');
            
            consistentContent.innerHTML = '';
            storyboardContainer.innerHTML = '';

            // Display consistent prompts
            if (data.consistent_character_prompt) {
                // Show header with copy button
                consistentHeader.style.display = 'flex';
                
                let consistentHTML = '';

                if (data.consistent_character_prompt) {
                    consistentHTML += `
                        <h5><i class="fas fa-user"></i> Character Consistency Prompt</h5>
                        <p>${data.consistent_character_prompt}</p>
                    `;
                }

                consistentContent.innerHTML = consistentHTML;
            } else {
                // Hide header if no consistent assets
                consistentHeader.style.display = 'none';
            }

            // Display overview
            if (data.scenes && data.scenes.length > 0) {
                const sceneCount = data.scenes.length;
                const dialogueScenes = data.scenes.filter(scene => 
                    scene.dialogue && scene.dialogue !== '(No dialogue)'
                ).length;

                overviewContainer.innerHTML = `
                    <h4><i class="fas fa-film"></i> Storyboard Overview</h4>
                    <p><strong>Generated:</strong> ${sceneCount} scenes optimized for Veo 3 with ${dialogueScenes} dialogue scenes (auto-split for ≤95 chars per scene).</p>
                `;
            }

            // Display scenes
            if (data.scenes && data.scenes.length > 0) {
                data.scenes.forEach((scene, index) => {
                    const dialogueLength = scene.dialogue ? scene.dialogue.length : 0;
                    let dialogueLengthClass = 'perfect';

                    if (dialogueLength < 50) {
                        dialogueLengthClass = 'short';
                    } else if (dialogueLength > CONFIG.dialogueCharLimit) {
                        dialogueLengthClass = 'long';
                    }

                    const sceneHTML = `
                        <div class="storyboard-card" id="scene-${index}">
                            <div class="scene-header">
                                <h4>Scene ${scene.scene_number}</h4>
                                <button class="scene-copy-btn" onclick="window.storyboardTool.copyScene(${index})">
                                    <i class="fas fa-copy"></i> Copy Scene
                                </button>
                            </div>

                            <div class="scene-detail">
                                <h5><i class="fas fa-eye"></i> Visual Prompt</h5>
                                <p>${scene.visual_prompt}</p>
                            </div>

                            ${scene.action_prompt ? `
                                <div class="scene-detail">
                                    <h5><i class="fas fa-running"></i> Action Prompt</h5>
                                    <p>${scene.action_prompt}</p>
                                </div>
                            ` : ''}

                            ${scene.dialogue && scene.dialogue !== '(No dialogue)' ? `
                                <div class="scene-detail">
                                    <h5><i class="fas fa-comments"></i> Dialogue 
                                        <span class="dialogue-length ${dialogueLengthClass}">
                                            ${dialogueLength}/95 chars
                                        </span>
                                    </h5>
                                    <p class="dialogue-text">${scene.dialogue}</p>
                                </div>
                            ` : ''}

                            ${scene.camera_direction && !this.isVerticalMode() ? `
                                <div class="scene-detail">
                                    <h5><i class="fas fa-video"></i> Camera Direction</h5>
                                    <p>${scene.camera_direction}</p>
                                </div>
                            ` : ''}

                            ${scene.mood_lighting && !this.isVerticalMode() ? `
                                <div class="scene-detail">
                                    <h5><i class="fas fa-lightbulb"></i> Mood & Lighting</h5>
                                    <p>${scene.mood_lighting}</p>
                                </div>
                            ` : ''}

                            ${scene.character_consistency ? `
                                <div class="scene-detail">
                                    <h5><i class="fas fa-user"></i> Character Consistency</h5>
                                    <p>${scene.character_consistency}</p>
                                </div>
                            ` : ''}

                            <!-- Environment merged into visual prompt only -->

                            <div class="scene-meta">
                                <span><i class="fas fa-clock"></i> Duration: ${scene.duration || '8 seconds'}</span>
                            </div>
                            
                            <!-- Scene JSON Copy Button -->
                            <div class="scene-json-controls">
                                <button class="scene-json-btn" onclick="storyboardTool.copySceneJson(${scene.scene_number})" title="Copy this scene as JSON">
                                    <i class="fas fa-code"></i> Copy JSON
                                </button>
                            </div>
                        </div>
                    `;

                    storyboardContainer.innerHTML += sceneHTML;
                });
            }

            // Make results section visible
            document.getElementById('resultsSection').style.display = 'block';
        }

        copyScene(sceneIndex) {
            if (!this.currentStoryboard || !this.currentStoryboard.scenes) return;

            const scene = this.currentStoryboard.scenes[sceneIndex];
            if (!scene) return;

            let sceneText = `Scene ${scene.scene_number}:\n\n`;
            sceneText += `Visual Prompt: ${scene.visual_prompt}\n\n`;
            
            // Only include action prompt if it exists (for normal mode)
            if (scene.action_prompt) {
                sceneText += `Action Prompt: ${scene.action_prompt}\n\n`;
            }

            if (scene.dialogue && scene.dialogue !== '(No dialogue)') {
                sceneText += `Dialogue: ${scene.dialogue}\n\n`;
            }

            // Only include camera direction and mood & lighting if not in vertical mode
            if (scene.camera_direction && !this.isVerticalMode()) {
                sceneText += `Camera Direction: ${scene.camera_direction}\n\n`;
            }
            
            if (scene.mood_lighting && !this.isVerticalMode()) {
                sceneText += `Mood & Lighting: ${scene.mood_lighting}\n\n`;
            }

            if (scene.character_consistency) {
                sceneText += `Character Consistency: ${scene.character_consistency}\n\n`;
            }

            // Environment merged into visual prompt only

            this.copyToClipboard(sceneText);
            this.showToast(`Scene ${scene.scene_number} copied to clipboard!`, 'success');
        }

        // Copy individual scene as JSON
        copySceneJson(sceneNumber) {
            if (!this.currentStoryboard || !this.currentStoryboard.scenes) return;

            const scene = this.currentStoryboard.scenes.find(s => s.scene_number === sceneNumber);
            if (!scene) return;

            try {
                // Create a clean scene object for JSON export
                const sceneJson = {
                    scene_number: scene.scene_number,
                    visual_prompt: scene.visual_prompt,
                    dialogue: scene.dialogue,
                    character_consistency: scene.character_consistency
                };
                
                // Only include action_prompt if it exists (for normal mode)
                if (scene.action_prompt) {
                    sceneJson.action_prompt = scene.action_prompt;
                }
                
                // Only include camera_direction and mood_lighting if not in vertical mode
                if (scene.camera_direction && !this.isVerticalMode()) {
                    sceneJson.camera_direction = scene.camera_direction;
                }
                
                if (scene.mood_lighting && !this.isVerticalMode()) {
                    sceneJson.mood_lighting = scene.mood_lighting;
                }

                const jsonString = JSON.stringify(sceneJson, null, 2);
                this.copyToClipboard(jsonString);
                this.showToast(`Scene ${sceneNumber} JSON copied to clipboard!`, 'success');
            } catch (e) {
                console.error('Scene JSON copy error:', e);
                this.showToast('Failed to copy scene JSON.', 'error');
            }
        }







        copyAllStoryboard() {
            if (!this.currentStoryboard) return;

            let fullText = 'VEO 3 STORYBOARD\n';
            fullText += '='.repeat(50) + '\n\n';

            // Add consistent prompts
            if (this.currentStoryboard.consistent_character_prompt) {
                fullText += 'CHARACTER CONSISTENCY PROMPT:\n';
                fullText += this.currentStoryboard.consistent_character_prompt + '\n\n';
            }

            // No separate environment prompt in output

            fullText += 'SCENES:\n';
            fullText += '='.repeat(30) + '\n\n';

            // Add all scenes
            this.currentStoryboard.scenes.forEach(scene => {
                fullText += `SCENE ${scene.scene_number}\n`;
                fullText += '-'.repeat(20) + '\n';
                fullText += `Visual Prompt: ${scene.visual_prompt}\n\n`;
                
                // Only include action prompt if it exists (for normal mode)
                if (scene.action_prompt) {
                    fullText += `Action Prompt: ${scene.action_prompt}\n\n`;
                }

                if (scene.dialogue && scene.dialogue !== '(No dialogue)') {
                    fullText += `Dialogue: ${scene.dialogue}\n\n`;
                }

                // Only include camera direction and mood & lighting if not in vertical mode
                if (scene.camera_direction && !this.isVerticalMode()) {
                    fullText += `Camera Direction: ${scene.camera_direction}\n\n`;
                }
                
                if (scene.mood_lighting && !this.isVerticalMode()) {
                    fullText += `Mood & Lighting: ${scene.mood_lighting}\n\n`;
                }

                if (scene.character_consistency) {
                    fullText += `Character Consistency: ${scene.character_consistency}\n\n`;
                }

                // Environment is merged into visual_prompt; do not output separately

                fullText += '='.repeat(50) + '\n\n';
            });

            this.copyToClipboard(fullText);
            this.showToast('Complete storyboard copied to clipboard!', 'success');
        }

        copyDialoguesOnly() {
            if (!this.currentStoryboard) return;

            let dialoguesText = 'VEO 3 STORYBOARD - DIALOGUES ONLY\n';
            dialoguesText += '='.repeat(40) + '\n\n';

            this.currentStoryboard.scenes.forEach(scene => {
                if (scene.dialogue && scene.dialogue !== '(No dialogue)') {
                    dialoguesText += `Scene ${scene.scene_number}: ${scene.dialogue}\n\n`;
                }
            });

            if (dialoguesText.trim() === 'VEO 3 STORYBOARD - DIALOGUES ONLY\n' + '='.repeat(40)) {
                this.showToast('No dialogues found to copy!', 'warning');
                return;
            }

            this.copyToClipboard(dialoguesText);
            this.showToast('All dialogues copied to clipboard!', 'success');
        }

        copyConsistentAssets() {
            if (!this.currentStoryboard) return;

            let assetsText = 'VEO 3 CONSISTENT ASSETS\n';
            assetsText += '='.repeat(30) + '\n\n';

            let hasAssets = false;

            if (this.currentStoryboard.consistent_character_prompt) {
                assetsText += 'CHARACTER CONSISTENCY PROMPT:\n';
                assetsText += '-'.repeat(30) + '\n';
                assetsText += this.currentStoryboard.consistent_character_prompt + '\n\n';
                hasAssets = true;
            }

            // No separate environment asset; environment is merged per-scene

            if (!hasAssets) {
                this.showToast('No consistent assets found to copy!', 'warning');
                return;
            }

            assetsText += 'Usage Instructions:\n';
            assetsText += '- Use the character prompt for consistent character appearance across all scenes\n';
            assetsText += '- Apply these prompts as base templates in Veo 3 before adding scene-specific details\n';

            this.copyToClipboard(assetsText);
            this.showToast('Consistent assets copied to clipboard!', 'success');
        }

        downloadStoryboard() {
            if (!this.currentStoryboard) {
                this.showToast('No storyboard to download!', 'warning');
                return;
            }

            try {


                let content = 'VEO 3 STORYBOARD\n';
                content += '='.repeat(50) + '\n\n';
                content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

                // Add consistent prompts
                if (this.currentStoryboard.consistent_character_prompt) {
                    content += 'CHARACTER CONSISTENCY PROMPT:\n';
                    content += this.currentStoryboard.consistent_character_prompt + '\n\n';
                }

                // No separate environment prompt in downloaded content

                content += 'SCENES:\n';
                content += '='.repeat(30) + '\n\n';

                // Add all scenes
                this.currentStoryboard.scenes.forEach(scene => {
                    content += `SCENE ${scene.scene_number || 'N/A'}\n`;
                    content += '-'.repeat(20) + '\n';
                    content += `Visual Prompt: ${scene.visual_prompt || 'N/A'}\n\n`;
                    
                    // Only include action prompt if it exists (for normal mode)
                    if (scene.action_prompt) {
                        content += `Action Prompt: ${scene.action_prompt}\n\n`;
                    }

                    if (scene.dialogue && scene.dialogue !== '(No dialogue)') {
                        content += `Dialogue: ${scene.dialogue}\n\n`;
                    }

                    // Only include camera direction and mood & lighting if not in vertical mode
                    if (scene.camera_direction && !this.isVerticalMode()) {
                        content += `Camera Direction: ${scene.camera_direction}\n\n`;
                    }
                    
                    if (scene.mood_lighting && !this.isVerticalMode()) {
                        content += `Mood & Lighting: ${scene.mood_lighting}\n\n`;
                    }

                    if (scene.character_consistency) {
                        content += `Character Consistency: ${scene.character_consistency}\n\n`;
                    }

                    // Environment merged into visual prompt only
                    content += '='.repeat(50) + '\n\n';
                });

                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `veo3-storyboard-${new Date().getTime()}.txt`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showToast('Storyboard downloaded successfully!', 'success');
            } catch (error) {
                console.error('Download Error:', error);
                this.showToast('Download failed. Please try again.', 'error');
            }
        }









        shareStoryboard() {
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: 'Veo 3 Script Writer by RAOGY',
                    text: 'Check out this amazing Veo 3 Script Writer!',
                    url: url
                });
            } else {
                this.copyToClipboard(url);
                this.showToast('Page URL copied to clipboard!', 'success');
            }
        }

        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
        }

        showLoading(show) {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = show ? 'flex' : 'none';
            }
        }

        showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast ${type} compact-toast`;
            toast.textContent = message;

            container.appendChild(toast);

            // Auto remove after 3 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 3000);
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        

        resetConfig() {
            // Reset to default values
            document.getElementById('configTransitionStyle').value = 'smooth_cuts';
            document.getElementById('configVisualStyle').value = '';
            document.getElementById('configSceneLength').value = '8';
            document.getElementById('configDialogueMode').value = 'auto_split';

            // Sync with main form
            document.getElementById('transitionStyle').value = 'smooth_cuts';
            document.getElementById('visualStyle').value = '';

            this.showToast('Configuration reset to defaults', 'success');
        }

        saveConfig() {
            const config = {
                transitionStyle: document.getElementById('configTransitionStyle').value,
                visualStyle: document.getElementById('configVisualStyle').value,
                sceneLength: document.getElementById('configSceneLength').value,
                dialogueMode: document.getElementById('configDialogueMode').value,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('storyboardConfig', JSON.stringify(config));
            this.showToast('Configuration saved successfully!', 'success');
        }




        // Analytics functionality removed

        // Analytics functionality removed

        // Analytics functionality removed

        // NEW: Collaboration Features
        initializeCollaboration() {
            // Add collaboration button to results controls
            const resultsControls = document.querySelector('.results-controls');
            if (resultsControls) {
                const collaborateBtn = document.createElement('button');
                collaborateBtn.className = 'control-btn';
                collaborateBtn.id = 'collaborateBtn';
                collaborateBtn.innerHTML = '<i class="fas fa-users"></i> Collaborate';
                collaborateBtn.addEventListener('click', () => this.showCollaborationPanel());
                
                // Insert after share button
                const shareBtn = document.getElementById('shareBtn');
                if (shareBtn) {
                    shareBtn.parentNode.insertBefore(collaborateBtn, shareBtn.nextSibling);
                }
            }
        }

        showCollaborationPanel() {
            if (!this.currentStoryboard) {
                this.showToast('Generate a storyboard first to enable collaboration!', 'warning');
                return;
            }

            const modal = document.createElement('div');
            modal.className = 'collaboration-modal';
            modal.innerHTML = `
                <div class="collaboration-modal-content">
                    <div class="collaboration-modal-header">
                        <h3><i class="fas fa-users"></i> Collaboration Tools</h3>
                        <button class="collaboration-close-btn" onclick="this.closest('.collaboration-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="collaboration-tabs">
                        <button class="collab-tab-btn active" data-tab="share">Share Project</button>
                        <button class="collab-tab-btn" data-tab="comments">Comments</button>
                        <button class="collab-tab-btn" data-tab="history">Version History</button>
                    </div>
                    <div class="collaboration-content">
                        <div class="collab-tab-content active" id="share-tab">
                            <div class="share-section">
                                <h4><i class="fas fa-link"></i> Share Link</h4>
                                <div class="share-link-container">
                                    <input type="text" id="shareLink" value="${this.generateShareLink()}" readonly>
                                    <button class="copy-link-btn" onclick="window.storyboardTool.copyShareLink()">
                                        <i class="fas fa-copy"></i> Copy
                                    </button>
                                </div>
                                <p class="share-note">Anyone with this link can view and comment on your storyboard.</p>
                            </div>
                            <div class="share-section">
                                <h4><i class="fas fa-qrcode"></i> QR Code</h4>
                                <div class="qr-code-container" id="qrCodeContainer">
                                    <div class="qr-placeholder">QR Code will be generated here</div>
                                </div>
                                <button class="generate-qr-btn" onclick="window.storyboardTool.generateQRCode()">
                                    <i class="fas fa-qrcode"></i> Generate QR Code
                                </button>
                            </div>
                        </div>
                        <div class="collab-tab-content" id="comments-tab">
                            <div class="comments-section">
                                <h4><i class="fas fa-comments"></i> Scene Comments</h4>
                                <div class="comments-container" id="commentsContainer">
                                    ${this.renderComments()}
                                </div>
                                <div class="add-comment-section">
                                    <select id="commentSceneSelect">
                                        <option value="">Select scene to comment on...</option>
                                        ${this.currentStoryboard.scenes.map((scene, index) => 
                                            `<option value="${index}">Scene ${scene.scene_number}</option>`
                                        ).join('')}
                                    </select>
                                    <textarea id="newComment" placeholder="Add your comment..."></textarea>
                                    <button class="add-comment-btn" onclick="window.storyboardTool.addComment()">
                                        <i class="fas fa-plus"></i> Add Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="collab-tab-content" id="history-tab">
                            <div class="history-section">
                                <h4><i class="fas fa-history"></i> Version History</h4>
                                <div class="version-list" id="versionList">
                                    ${this.renderVersionHistory()}
                                </div>
                                <button class="save-version-btn" onclick="window.storyboardTool.saveVersion()">
                                    <i class="fas fa-save"></i> Save Current Version
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.setupCollaborationTabs();
        }

        setupCollaborationTabs() {
            const tabBtns = document.querySelectorAll('.collab-tab-btn');
            const tabContents = document.querySelectorAll('.collab-tab-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabName = btn.dataset.tab;
                    
                    // Update active tab button
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update active tab content
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === `${tabName}-tab`) {
                            content.classList.add('active');
                        }
                    });
                });
            });
        }

        generateShareLink() {
            const projectData = {
                storyboard: this.currentStoryboard,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            const encodedData = btoa(JSON.stringify(projectData));
            return `${window.location.origin}${window.location.pathname}?project=${encodedData}`;
        }

        copyShareLink() {
            const shareLink = document.getElementById('shareLink');
            this.copyToClipboard(shareLink.value);
            this.showToast('Share link copied to clipboard!', 'success');
        }

        generateQRCode() {
            const shareLink = this.generateShareLink();
            const qrContainer = document.getElementById('qrCodeContainer');
            
            // Simple QR code generation using a library or service
            // For now, we'll create a placeholder
            qrContainer.innerHTML = `
                <div class="qr-code">
                    <div class="qr-pattern"></div>
                    <div class="qr-text">QR Code for sharing</div>
                </div>
            `;
            
            this.showToast('QR Code generated!', 'success');
        }

        renderComments() {
            const comments = JSON.parse(localStorage.getItem('storyboardComments') || '[]');
            const currentProjectId = this.getProjectId();
            
            const projectComments = comments.filter(comment => comment.projectId === currentProjectId);
            
            if (projectComments.length === 0) {
                return '<div class="no-comments">No comments yet. Be the first to add one!</div>';
            }
            
            return projectComments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-scene">Scene ${comment.sceneNumber}</span>
                        <span class="comment-time">${new Date(comment.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `).join('');
        }

        addComment() {
            const sceneSelect = document.getElementById('commentSceneSelect');
            const commentText = document.getElementById('newComment');
            
            if (!sceneSelect.value || !commentText.value.trim()) {
                this.showToast('Please select a scene and enter a comment!', 'warning');
                return;
            }
            
            const comment = {
                projectId: this.getProjectId(),
                sceneNumber: parseInt(sceneSelect.value) + 1,
                text: commentText.value.trim(),
                timestamp: new Date().toISOString()
            };
            
            const comments = JSON.parse(localStorage.getItem('storyboardComments') || '[]');
            comments.push(comment);
            localStorage.setItem('storyboardComments', JSON.stringify(comments));
            
            // Refresh comments display
            const commentsContainer = document.getElementById('commentsContainer');
            commentsContainer.innerHTML = this.renderComments();
            
            // Clear form
            sceneSelect.value = '';
            commentText.value = '';
            
            this.showToast('Comment added successfully!', 'success');
        }

        renderVersionHistory() {
            const versions = JSON.parse(localStorage.getItem('storyboardVersions') || '[]');
            const currentProjectId = this.getProjectId();
            
            const projectVersions = versions.filter(version => version.projectId === currentProjectId);
            
            if (projectVersions.length === 0) {
                return '<div class="no-versions">No saved versions yet.</div>';
            }
            
            return projectVersions.map(version => `
                <div class="version-item">
                    <div class="version-header">
                        <span class="version-name">Version ${version.version}</span>
                        <span class="version-time">${new Date(version.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="version-actions">
                        <button class="version-btn" onclick="window.storyboardTool.loadVersion('${version.id}')">
                            <i class="fas fa-download"></i> Load
                        </button>
                        <button class="version-btn" onclick="window.storyboardTool.deleteVersion('${version.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }

        saveVersion() {
            const version = {
                id: Date.now().toString(),
                projectId: this.getProjectId(),
                version: this.getNextVersionNumber(),
                storyboard: this.currentStoryboard,
                timestamp: new Date().toISOString()
            };
            
            const versions = JSON.parse(localStorage.getItem('storyboardVersions') || '[]');
            versions.push(version);
            localStorage.setItem('storyboardVersions', JSON.stringify(versions));
            
            // Refresh version list
            const versionList = document.getElementById('versionList');
            versionList.innerHTML = this.renderVersionHistory();
            
            this.showToast(`Version ${version.version} saved successfully!`, 'success');
        }

        loadVersion(versionId) {
            const versions = JSON.parse(localStorage.getItem('storyboardVersions') || '[]');
            const version = versions.find(v => v.id === versionId);
            
            if (version) {
                this.currentStoryboard = version.storyboard;
                this.displayStoryboard(version.storyboard);
                this.showToast(`Version ${version.version} loaded successfully!`, 'success');
                
                // Close collaboration modal
                const modal = document.querySelector('.collaboration-modal');
                if (modal) modal.remove();
            }
        }

        deleteVersion(versionId) {
            if (confirm('Are you sure you want to delete this version?')) {
                const versions = JSON.parse(localStorage.getItem('storyboardVersions') || '[]');
                const updatedVersions = versions.filter(v => v.id !== versionId);
                localStorage.setItem('storyboardVersions', JSON.stringify(updatedVersions));
                
                // Refresh version list
                const versionList = document.getElementById('versionList');
                versionList.innerHTML = this.renderVersionHistory();
                
                this.showToast('Version deleted successfully!', 'success');
            }
        }

        getProjectId() {
            return this.currentStoryboard ? 
                btoa(JSON.stringify(this.currentStoryboard)).slice(0, 20) : 
                'default';
        }

        getNextVersionNumber() {
            const versions = JSON.parse(localStorage.getItem('storyboardVersions') || '[]');
            const currentProjectId = this.getProjectId();
            const projectVersions = versions.filter(v => v.projectId === currentProjectId);
            return projectVersions.length + 1;
        }

        // Generate a unique story identifier based on the first scene
        generateStoryIdentifier(firstScene) {
            // Extract key elements from the first scene to create a unique identifier
            const visualPrompt = firstScene.visual_prompt || '';
            const dialogue = firstScene.dialogue || '';
            
            // Create a more descriptive identifier from the visual prompt
            let identifier = '';
            
            // Look for the most descriptive part of the visual prompt
            const visualWords = visualPrompt.split(' ');
            
            // Find the first sentence or phrase that contains key visual elements
            let startIndex = 0;
            let endIndex = visualWords.length;
            
            // Look for the first period or significant punctuation to find the main descriptive phrase
            for (let i = 0; i < visualWords.length; i++) {
                if (visualWords[i].includes('.') && i > 2) {
                    endIndex = i;
                    break;
                }
            }
            
            // Extract the first descriptive phrase (usually the camera and lighting setup)
            identifier = visualWords.slice(0, Math.min(endIndex, 8)).join(' ').trim();
            
            // Clean up the identifier - remove trailing punctuation but keep commas
            identifier = identifier
                .replace(/[.!?]+$/, '') // Remove trailing punctuation
                .replace(/[^\w\s,]/g, '') // Remove special characters but keep commas
                .replace(/\s+/g, ' ') // Normalize spaces
                .trim();
            
            // If the identifier is too short, try to find a better phrase
            if (identifier.length < 20) {
                // Look for phrases that contain key visual elements
                for (let i = 0; i < visualWords.length - 3; i++) {
                    const phrase = visualWords.slice(i, i + 6).join(' ');
                    if (phrase.includes('shot') && (phrase.includes('lighting') || phrase.includes('style') || phrase.includes('camera'))) {
                        identifier = phrase
                            .replace(/[.!?]+$/, '')
                            .replace(/[^\w\s,]/g, '')
                            .replace(/\s+/g, ' ')
                            .trim();
                        break;
                    }
                }
            }
            
            // If still too short, use dialogue
            if (identifier.length < 15 && dialogue) {
                identifier = dialogue
                    .replace(/[^\w\s]/g, '')
                    .split(' ')
                    .slice(0, 5)
                    .join(' ')
                    .trim();
            }
            
            // Fallback if still too short
            if (identifier.length < 10) {
                identifier = "Story Scene";
            }
            
            return identifier;
        }

        // Check if vertical mode is enabled
        isVerticalMode() {
            return document.getElementById('verticalMode')?.checked || false;
        }

    }

    // Initialize the tool
    window.storyboardTool = new StoryboardGeneratorTool();
    
    // Set up theme toggle event listener after tool is initialized
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.storyboardTool.toggleTheme();
        });
    }
});