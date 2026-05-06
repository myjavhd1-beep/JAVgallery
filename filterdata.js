// State management
let currentTheme = 'light';
let activeTab = 'videos';
let activeFilters = [];
let currentSort = 'shuffle';
let currentSearchTerm = '';
let selectedFilters = {
    actress: [],
    tags: [],
    studios: [],
    tokens: [],
    series: [],
    version: [],
    group: []
};

// Pagination stateF
let currentVideoPage = 1;
let currentAlbumPage = 1;
let currentPicturePage = 1;
const itemsPerPage = {
    videos: 6,
    albums: 6,
    pictures: 12
};

// Current video for suggestion carousels
let currentVideoForSuggestions = null;

// Track video player state
let isVideoPlaying = false;
let currentVideoPlayerType = null;

// Chapters state
let isChaptersVisible = false;
let currentPlayingChapterIndex = null;

// Store event listeners to prevent duplicates
let modalEventListenersAttached = false;

// Grid layout state for actress filter
let currentActressGridLayout = 'grid-3';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const filtersBtn = document.getElementById('filtersBtn');
const searchInput = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const sortMenu = document.getElementById('sortMenu');
const activeFiltersContainer = document.getElementById('activeFilters');
const tabs = document.querySelectorAll('.tab');
const contentSections = document.querySelectorAll('.content-section');
const videosGrid = document.getElementById('videosGrid');
const albumsGrid = document.getElementById('albumsGrid');
const picturesGrid = document.getElementById('picturesGrid');
const videoModal = document.getElementById('videoModal');
const filterModal = document.getElementById('filterModal');
const albumModal = document.getElementById('albumModal');
const imageModal = document.getElementById('imageModal');
const closeVideoModal = document.getElementById('closeVideoModal');
const closeFilterModal = document.getElementById('closeFilterModal');
const closeAlbumModal = document.getElementById('closeAlbumModal');
const closeImageModal = document.getElementById('closeImageModal');
const fullscreenImage = document.getElementById('fullscreenImage');

// Video modal elements
const mainModalContent = document.getElementById('mainModalContent');
const previewPage = document.getElementById('previewPage');
const previewBackBtn = document.getElementById('previewBackBtn');
const videoThumbnailContainer = document.getElementById('videoThumbnailContainer');
const modalThumb = document.getElementById('modalThumb');
const videoPlayer = document.getElementById('videoPlayer');
const videoFrame = document.getElementById('videoFrame');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const toggleDesc = document.getElementById('toggleDesc');
const modalTags = document.getElementById('modalTags');
const modalSeries = document.getElementById('modalSeries');
const modalActress = document.getElementById('modalActress');
const modalRating = document.getElementById('modalRating');
const modalStudio = document.getElementById('modalStudio');
const modalLabel = document.getElementById('modalLabel');
const modalRelease = document.getElementById('modalRelease');
const modalDuration = document.getElementById('modalDuration');
const modalVersions = document.getElementById('modalVersions');
const modalGroup = document.getElementById('modalGroup');
const modalViews = document.getElementById('modalViews');
const modalPoster = document.getElementById('modalPoster');
const modalCode = document.getElementById('modalCode');
const previewBtn = document.getElementById('previewBtn');
const trailerBtn = document.getElementById('trailerBtn');
const videoBtn = document.getElementById('videoBtn');
const previewImagesFull = document.getElementById('previewImagesFull');

// Suggestion carousel elements
const alsoStarredCarousel = document.getElementById('alsoStarredCarousel');
const youMayLikeCarousel = document.getElementById('youMayLikeCarousel');
const alsoStarredPrev = document.getElementById('alsoStarredPrev');
const alsoStarredNext = document.getElementById('alsoStarredNext');
const youMayLikePrev = document.getElementById('youMayLikePrev');
const youMayLikeNext = document.getElementById('youMayLikeNext');

// Pagination elements
const videosPrevBtn = document.getElementById('videosPrevBtn');
const videosNextBtn = document.getElementById('videosNextBtn');
const videosPageNumber = document.getElementById('videosPageNumber');
const albumsPrevBtn = document.getElementById('albumsPrevBtn');
const albumsNextBtn = document.getElementById('albumsNextBtn');
const albumsPageNumber = document.getElementById('albumsPageNumber');
const picturesPrevBtn = document.getElementById('picturesPrevBtn');
const picturesNextBtn = document.getElementById('picturesNextBtn');
const picturesPageNumber = document.getElementById('picturesPageNumber');

// Album modal elements
const albumModalTitle = document.getElementById('albumModalTitle');
const albumModalTags = document.getElementById('albumModalTags');
const albumModalActress = document.getElementById('albumModalActress');
const albumModalImageCount = document.getElementById('albumModalImageCount');
const albumMainCover = document.getElementById('albumMainCover');
const albumImagesContainer = document.getElementById('albumImages');

// Filter modal elements
const filterTabs = document.querySelectorAll('.filter-tab');
const filterSections = document.querySelectorAll('.filter-section');
const selectedFiltersContainer = document.getElementById('selectedFilters');

// Initialize the app
function init() {
    console.log('Initializing app...');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            currentTheme = 'dark';
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleTheme();
    }
    
    // Load saved grid layout preference
    const savedGridLayout = localStorage.getItem('actressGridLayout');
    if (savedGridLayout) {
        currentActressGridLayout = savedGridLayout;
    }
    
    // Set default sort to "shuffle"
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.sort === 'shuffle') {
            option.classList.add('active');
        }
    });
    
    // Log video data to debug
    console.log('Video Data Available:', typeof videoData !== 'undefined');
    if (typeof videoData !== 'undefined') {
        console.log('First video has plotData:', videoData[0]?.plotData);
        console.log('First video has activities:', videoData[0]?.activities);
        console.log('First video has reviews:', videoData[0]?.reviews);
    }
    
    // Load initial content
    loadFilterData();
    loadVideos();
    loadAlbums();
    loadPictures();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update pagination displays
    updatePagination();
    
    // Create grid layout controls
    createGridLayoutControls();
    
    // Setup sticky filter controls
    setupStickyFilterControls();
    
    console.log('App initialized');
}

// ========== SMOOTH SCROLL FUNCTIONS - FIXED VERSION ==========

// Single smooth scroll function that works properly
function smoothScrollToTopOfModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) return;
    
    // Find the main scrollable container
    let scrollContainer = modal.querySelector('.filter-content');
    if (!scrollContainer) {
        scrollContainer = modal.querySelector('.modal-body');
    }
    if (!scrollContainer) {
        scrollContainer = modal.querySelector('.video-modal-content');
    }
    if (!scrollContainer) {
        // If no specific container, try to find any scrollable div
        const allDivs = modal.querySelectorAll('div');
        for (let div of allDivs) {
            const style = window.getComputedStyle(div);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                scrollContainer = div;
                break;
            }
        }
    }
    
    // If we found a scrollable container, scroll it smoothly to top
    if (scrollContainer && scrollContainer.scrollTop !== undefined) {
        scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // Fallback: scroll the modal itself
        modal.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ========== NEW SECTION FUNCTIONS ==========

// Create Plot Section HTML
function createPlotSectionHTML(video) {
    console.log('Creating plot section for video:', video.title);
    
    if (!video.plotData || !video.plotData.categories || video.plotData.categories.length === 0) {
        console.log('No plot data found');
        return '';
    }
    
    console.log('Plot data found:', video.plotData);
    
    return `
        <div class="plot-section">
            <h3 class="plot-title">
                <i class="fas fa-chart-pie"></i> Plot Distribution
            </h3>
            <div class="plot-container">
                <div class="chart-container">
                    <canvas id="plotPieChart" width="300" height="300"></canvas>
                </div>
                 <div class="plot-legend" id="plotLegend"></div>
            </div>
        </div>
    `;
}

// Create Activities Section HTML (UPDATED: removed click handlers and URL data)
function createActivitiesSectionHTML(video) {
    console.log('Creating activities section for video:', video.title);
    
    if (!video.activities || !Array.isArray(video.activities) || video.activities.length === 0) {
        console.log('No activities data found');
        return '';
    }
    
    console.log('Activities data found:', video.activities.length, 'items');
    
    let activitiesHTML = `
        <div class="activities-section">
            <h3 class="activities-title">
                <i class="fas fa-images"></i> Activities
            </h3>
            <div class="activities-carousel-container">
                <div class="activities-carousel" id="activitiesCarousel">
    `;
    
    video.activities.forEach((activity, index) => {
        activitiesHTML += `
            <div class="activity-item">
                <div class="activity-image-wrapper">
                    <img src="${activity.image}" alt="${escapeHtml(activity.title)}" class="activity-image" onerror="this.src='https://via.placeholder.com/400x225/7c3aed/ffffff?text=${encodeURIComponent(activity.title)}'">
                </div>
                <div class="activity-title">${escapeHtml(activity.title)}</div>
            </div>
        `;
    });
    
    activitiesHTML += `
                </div>
            </div>
        </div>
    `;
    
    return activitiesHTML;
}

// Create Review Section HTML - Compact version with colored progress bars
function createReviewSectionHTML(video) {
    console.log('Creating review section for video:', video.title);
    
    if (!video.reviews || !video.reviews.categories || video.reviews.categories.length === 0) {
        console.log('No review data found');
        return '';
    }
    
    console.log('Review data found:', video.reviews.categories.length, 'categories');
    
    let reviewHTML = `
        <div class="review-section">
            <h3 class="review-title">
                <i class="fas fa-star"></i> Ratings & Reviews
            </h3>
            <div class="review-grid">
    `;
    
    // Define color classes based on category name
    const getProgressClass = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('actress') || name.includes('performance')) return 'performance';
        if (name.includes('production') || name.includes('quality')) return 'production';
        if (name.includes('sexual') || name.includes('activity')) return 'activity';
        if (name.includes('plot') || name.includes('storyline')) return 'plot';
        return 'default';
    };
    
    video.reviews.categories.forEach(category => {
        // Calculate percentage for progress bar (rating out of 10)
        const percentage = (category.rating / 10) * 100;
        // Ensure rating is displayed with proper decimal (0.5 increments)
        const ratingDisplay = category.rating % 1 === 0 ? category.rating.toFixed(0) : category.rating.toFixed(1);
        const progressClass = getProgressClass(category.name);
        
        reviewHTML += `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-category">${escapeHtml(category.name)}</span>
                    <span class="review-rating">${ratingDisplay}/10</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill ${progressClass}" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    });
    
    reviewHTML += `
            </div>
        </div>
    `;
    
    return reviewHTML;
}

// Render Pie Chart
function renderPieChart() {
    const canvas = document.getElementById('plotPieChart');
    if (!canvas) {
        console.log('Canvas not found');
        return;
    }
    
    const video = currentVideoForSuggestions;
    if (!video || !video.plotData || !video.plotData.categories) {
        console.log('No video or plot data for chart');
        return;
    }
    
    console.log('Rendering doughnut chart with data:', video.plotData.categories);
    
    const categories = video.plotData.categories;
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF8C42', '#6A4E9B'];
    
    // Destroy existing chart if any
    if (window.plotChart && typeof window.plotChart.destroy === 'function') {
        window.plotChart.destroy();
        window.plotChart = null;
    }
    
    // Remove any existing label canvas that might be showing text
    const existingLabelCanvas = document.getElementById('doughnutLabelCanvas');
    if (existingLabelCanvas) {
        existingLabelCanvas.remove();
    }
    
    // Remove any center text plugin that might be registered
    if (Chart.registry.plugins.get('centerText')) {
        Chart.registry.plugins.unregister('centerText');
    }
    
    // Adjust settings based on screen width
    const isMobile = window.innerWidth <= 768;
    
    // Create clean doughnut chart
    window.plotChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.name),
            datasets: [{
                data: categories.map(c => c.percentage),
                backgroundColor: colors.slice(0, categories.length),
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 10,
                cutout: '55%',
                borderRadius: 2,
                spacing: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 8,
                    cornerRadius: 6
                }
            },
            cutout: '55%',
            radius: '90%',
            layout: {
                padding: isMobile ? 5 : 10
            }
        }
    });
    
    // Create legend with percentage values
    const legendContainer = document.getElementById('plotLegend');
    if (legendContainer) {
        legendContainer.innerHTML = '';
        categories.forEach((category, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${colors[index % colors.length]}"></div>
                <div class="legend-label">${escapeHtml(category.name)}</div>
                <div class="legend-percentage">${category.percentage.toFixed(1)}%</div>
            `;
            legendItem.addEventListener('mouseenter', () => {
                if (window.plotChart) {
                    window.plotChart.setActiveElements([{datasetIndex: 0, index: index}]);
                    window.plotChart.update();
                }
            });
            legendItem.addEventListener('mouseleave', () => {
                if (window.plotChart) {
                    window.plotChart.setActiveElements([]);
                    window.plotChart.update();
                }
            });
            legendContainer.appendChild(legendItem);
        });
    }
}

// Handle window resize to maintain chart responsiveness
window.addEventListener('resize', function() {
    if (document.getElementById('videoModal') && document.getElementById('videoModal').classList.contains('active')) {
        const canvas = document.getElementById('plotPieChart');
        if (canvas && window.plotChart) {
            setTimeout(() => {
                window.plotChart.resize();
            }, 100);
        }
    }
});

// Setup Activities Carousel (UPDATED: removed click handlers for activity items)
function setupActivitiesCarousel() {
    const carousel = document.getElementById('activitiesCarousel');
    if (!carousel) {
        console.log('Activities carousel not found');
        return;
    }
    
    console.log('Setting up activities carousel');
    
    const prevBtn = document.querySelector('.activities-prev');
    const nextBtn = document.querySelector('.activities-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }
    
    // Setup touch scrolling
    let isDown = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    carousel.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('touchend', () => {
        isDown = false;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
}

// Insert New Sections into Modal
function insertNewSections(video) {
    console.log('Inserting new sections for video:', video.title);
    
    const container = document.getElementById('videoModalExtraSections');
    if (!container) {
        console.error('Container videoModalExtraSections not found!');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    let hasSections = false;
    let sectionsHTML = '';
    
    // Add Plot Section
    const plotHTML = createPlotSectionHTML(video);
    if (plotHTML) {
        sectionsHTML += plotHTML;
        hasSections = true;
        console.log('Added plot section');
    }
    
    // Add Activities Section
    const activitiesHTML = createActivitiesSectionHTML(video);
    if (activitiesHTML) {
        sectionsHTML += activitiesHTML;
        hasSections = true;
        console.log('Added activities section');
    }
    
    // Add Review Section
    const reviewHTML = createReviewSectionHTML(video);
    if (reviewHTML) {
        sectionsHTML += reviewHTML;
        hasSections = true;
        console.log('Added review section');
    }
    
    if (hasSections) {
        container.innerHTML = sectionsHTML;
        console.log('Sections added to DOM');
        
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            if (video.plotData && video.plotData.categories) {
                setTimeout(() => {
                    renderPieChart();
                }, 50);
            }
            if (video.activities && video.activities.length > 0) {
                setTimeout(() => {
                    setupActivitiesCarousel();
                }, 50);
            }
        });
    } else {
        console.log('No sections to add - missing data');
        container.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: var(--text-secondary);">
                <i class="fas fa-info-circle"></i> No additional content available
            </div>
        `;
    }
}

// Create grid layout controls for actress filter
function createGridLayoutControls() {
    const actressFilterSection = document.getElementById('actressFilter');
    if (!actressFilterSection) return;
    
    if (document.getElementById('actressGridControls')) return;
    
    const controlsHTML = `
        <div class="grid-controls" id="actressGridControls">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">
                <i class="fas fa-th"></i> Layout:
            </span>
            <div class="grid-layout-control">
                <button class="grid-btn ${currentActressGridLayout === 'grid-1' ? 'active' : ''}" data-layout="grid-1">
                    <i class="fas fa-th-large"></i> 1
                </button>
                <button class="grid-btn ${currentActressGridLayout === 'grid-2' ? 'active' : ''}" data-layout="grid-2">
                    <i class="fas fa-th"></i> 2
                </button>
                <button class="grid-btn ${currentActressGridLayout === 'grid-3' ? 'active' : ''}" data-layout="grid-3">
                    <i class="fas fa-th-large"></i> 3
                </button>
            </div>
        </div>
    `;
    
    actressFilterSection.insertAdjacentHTML('afterbegin', controlsHTML);
    
    const gridBtns = document.querySelectorAll('.grid-btn');
    gridBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const layout = btn.dataset.layout;
            if (layout) {
                changeActressGridLayout(layout);
            }
        });
    });
}

// Setup sticky controls for filter modal
function setupStickyFilterControls() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;
    
    // Create sticky controls wrapper if it doesn't exist
    let stickyWrapper = document.querySelector('.filter-sticky-controls');
    if (!stickyWrapper) {
        const filterContent = document.querySelector('.filter-content');
        const filterSearch = document.querySelector('.filter-search');
        const gridControls = document.querySelector('#actressGridControls');
        
        if (filterContent && filterSearch) {
            // Create sticky wrapper
            stickyWrapper = document.createElement('div');
            stickyWrapper.className = 'filter-sticky-controls';
            
            // Clone and move grid controls if they exist in actress section
            if (gridControls && gridControls.parentElement) {
                const clonedGridControls = gridControls.cloneNode(true);
                stickyWrapper.appendChild(clonedGridControls);
            }
            
            // Clone and move search input
            const clonedSearch = filterSearch.cloneNode(true);
            stickyWrapper.appendChild(clonedSearch);
            
            // Insert sticky wrapper at top of filter content
            filterContent.insertBefore(stickyWrapper, filterContent.firstChild);
            
            // Hide original elements
            if (gridControls) gridControls.style.display = 'none';
            filterSearch.style.display = 'none';
            
            // Re-attach search event listener to cloned input
            const searchInputClone = stickyWrapper.querySelector('.filter-search-input');
            if (searchInputClone) {
                searchInputClone.addEventListener('input', handleFilterSearch);
            }
            
            // Re-attach grid button listeners
            const gridBtns = stickyWrapper.querySelectorAll('.grid-btn');
            gridBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const layout = btn.dataset.layout;
                    if (layout) {
                        changeActressGridLayout(layout);
                        gridBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    }
                });
            });
        }
    }
}

function changeActressGridLayout(layout) {
    currentActressGridLayout = layout;
    
    document.querySelectorAll('.grid-btn').forEach(btn => {
        if (btn.dataset.layout === layout) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const actressGrid = document.getElementById('actressGrid');
    if (actressGrid) {
        actressGrid.classList.remove('grid-1', 'grid-2', 'grid-3');
        actressGrid.classList.add(layout);
    }
    
    localStorage.setItem('actressGridLayout', layout);
}

function getFilterCounts(itemData) {
    return {
        videos: itemData.videoCount || 0,
        albums: itemData.albumCount || 0,
        pictures: itemData.pictureCount || 0
    };
}

function formatCountDisplay(videoCount, albumCount, pictureCount) {
    const parts = [];
    if (videoCount > 0) parts.push(`${videoCount} Video${videoCount !== 1 ? 's' : ''}`);
    if (albumCount > 0) parts.push(`${albumCount} Album${albumCount !== 1 ? 's' : ''}`);
    if (pictureCount > 0) parts.push(`${pictureCount} Picture${pictureCount !== 1 ? 's' : ''}`);
    
    if (parts.length === 0) {
        return '';
    }
    
    return parts.join(' | ');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    if (themeToggle) {
        themeToggle.removeEventListener('click', toggleTheme);
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (searchInput) {
        searchInput.removeEventListener('input', handleSearch);
        searchInput.removeEventListener('keypress', handleSearchKeyPress);
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', handleSearchKeyPress);
    }
    
    if (sortBtn) {
        sortBtn.removeEventListener('click', toggleSortMenu);
        sortBtn.addEventListener('click', toggleSortMenu);
    }
    
    document.querySelectorAll('.sort-option').forEach(option => {
        option.removeEventListener('click', handleSortChange);
        option.addEventListener('click', handleSortChange);
    });
    
    tabs.forEach(tab => {
        tab.removeEventListener('click', handleTabChange);
        tab.addEventListener('click', handleTabChange);
    });
    
    if (filtersBtn) {
        filtersBtn.removeEventListener('click', openFilterModal);
        filtersBtn.addEventListener('click', openFilterModal);
    }
    
    if (closeVideoModal) {
        closeVideoModal.removeEventListener('click', closeVideoModalHandler);
        closeVideoModal.addEventListener('click', closeVideoModalHandler);
    }
    
    if (closeFilterModal) {
        closeFilterModal.removeEventListener('click', closeFilterModalHandler);
        closeFilterModal.addEventListener('click', closeFilterModalHandler);
    }
    
    if (closeAlbumModal) {
        closeAlbumModal.removeEventListener('click', closeAlbumModalHandler);
        closeAlbumModal.addEventListener('click', closeAlbumModalHandler);
    }
    
    if (closeImageModal) {
        closeImageModal.removeEventListener('click', closeImageModalHandler);
        closeImageModal.addEventListener('click', closeImageModalHandler);
    }
    
    [videoModal, filterModal, albumModal, imageModal].forEach(modal => {
        if (modal) {
            modal.removeEventListener('click', modalOutsideClick);
            modal.addEventListener('click', modalOutsideClick);
        }
    });
    
    document.removeEventListener('click', documentClickHandler);
    document.addEventListener('click', documentClickHandler);
    
    if (toggleDesc) {
        toggleDesc.removeEventListener('click', toggleDescription);
        toggleDesc.addEventListener('click', toggleDescription);
    }
    
    if (previewBtn) {
        previewBtn.removeEventListener('click', openPreviewPage);
        previewBtn.addEventListener('click', openPreviewPage);
    }
    
    if (trailerBtn) {
        trailerBtn.removeEventListener('click', trailerClickHandler);
        trailerBtn.addEventListener('click', trailerClickHandler);
    }
    
    if (videoBtn) {
        videoBtn.removeEventListener('click', videoClickHandler);
        videoBtn.addEventListener('click', videoClickHandler);
    }
    
    if (previewBackBtn) {
        previewBackBtn.removeEventListener('click', closePreviewPage);
        previewBackBtn.addEventListener('click', closePreviewPage);
    }
    
    if (alsoStarredPrev) {
        alsoStarredPrev.removeEventListener('click', alsoStarredPrevHandler);
        alsoStarredPrev.addEventListener('click', alsoStarredPrevHandler);
    }
    
    if (alsoStarredNext) {
        alsoStarredNext.removeEventListener('click', alsoStarredNextHandler);
        alsoStarredNext.addEventListener('click', alsoStarredNextHandler);
    }
    
    if (youMayLikePrev) {
        youMayLikePrev.removeEventListener('click', youMayLikePrevHandler);
        youMayLikePrev.addEventListener('click', youMayLikePrevHandler);
    }
    
    if (youMayLikeNext) {
        youMayLikeNext.removeEventListener('click', youMayLikeNextHandler);
        youMayLikeNext.addEventListener('click', youMayLikeNextHandler);
    }
    
    if (videosPrevBtn) {
        videosPrevBtn.removeEventListener('click', videosPrevHandler);
        videosPrevBtn.addEventListener('click', videosPrevHandler);
    }
    
    if (videosNextBtn) {
        videosNextBtn.removeEventListener('click', videosNextHandler);
        videosNextBtn.addEventListener('click', videosNextHandler);
    }
    
    if (albumsPrevBtn) {
        albumsPrevBtn.removeEventListener('click', albumsPrevHandler);
        albumsPrevBtn.addEventListener('click', albumsPrevHandler);
    }
    
    if (albumsNextBtn) {
        albumsNextBtn.removeEventListener('click', albumsNextHandler);
        albumsNextBtn.addEventListener('click', albumsNextHandler);
    }
    
    if (picturesPrevBtn) {
        picturesPrevBtn.removeEventListener('click', picturesPrevHandler);
        picturesPrevBtn.addEventListener('click', picturesPrevHandler);
    }
    
    if (picturesNextBtn) {
        picturesNextBtn.removeEventListener('click', picturesNextHandler);
        picturesNextBtn.addEventListener('click', picturesNextHandler);
    }
    
    filterTabs.forEach(tab => {
        tab.removeEventListener('click', handleFilterTabChange);
        tab.addEventListener('click', handleFilterTabChange);
    });
    
    document.querySelectorAll('.filter-search-input').forEach(input => {
        input.removeEventListener('input', handleFilterSearch);
        input.addEventListener('input', handleFilterSearch);
    });
    
    document.querySelectorAll('.option-item').forEach(item => {
        item.removeEventListener('click', handleOptionSelect);
        item.addEventListener('click', handleOptionSelect);
    });
    
    setupCarouselTouch();
    
    if (modalPoster) {
        modalPoster.removeEventListener('click', posterClickHandler);
        modalPoster.addEventListener('click', posterClickHandler);
    }
    
    if (videoThumbnailContainer) {
        videoThumbnailContainer.removeEventListener('click', thumbnailContainerClickHandler);
        videoThumbnailContainer.addEventListener('click', thumbnailContainerClickHandler);
    }
}

function handleSearchKeyPress(e) {
    if (e.key === 'Enter') performSearch();
}

function closeVideoModalHandler() {
    closeModal(videoModal);
    hideChaptersSection();
    resetVideoPlayer();
    resetPlayingChapterHighlight();
}

function closeFilterModalHandler() {
    closeModal(filterModal);
}

function closeAlbumModalHandler() {
    closeModal(albumModal);
}

function closeImageModalHandler() {
    closeModal(imageModal);
}

function modalOutsideClick(e) {
    if (e.target === this) closeModal(this);
}

function documentClickHandler(e) {
    if (sortBtn && sortMenu && !sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
        sortMenu.classList.remove('active');
    }
}

function trailerClickHandler() {
    // Smooth scroll to top of modal when trailer button is clicked
    smoothScrollToTopOfModal();
    // Play video after scroll completes
    setTimeout(() => {
        playVideo('trailer');
    }, 300);
}

function videoClickHandler() {
    toggleChaptersSection();
}

function alsoStarredPrevHandler() {
    scrollCarousel('alsoStarred', -1);
}

function alsoStarredNextHandler() {
    scrollCarousel('alsoStarred', 1);
}

function youMayLikePrevHandler() {
    scrollCarousel('youMayLike', -1);
}

function youMayLikeNextHandler() {
    scrollCarousel('youMayLike', 1);
}

function videosPrevHandler() {
    changePage('videos', -1);
}

function videosNextHandler() {
    changePage('videos', 1);
}

function albumsPrevHandler() {
    changePage('albums', -1);
}

function albumsNextHandler() {
    changePage('albums', 1);
}

function picturesPrevHandler() {
    changePage('pictures', -1);
}

function picturesNextHandler() {
    changePage('pictures', 1);
}

function posterClickHandler(e) {
    e.stopPropagation();
}

function thumbnailContainerClickHandler(e) {
    if (isVideoPlaying && (e.target === videoPlayer || e.target === videoFrame || (videoPlayer && videoPlayer.contains(e.target)))) {
        e.stopPropagation();
    }
}

function toggleTheme() {
    const body = document.body;
    
    if (currentTheme === 'light') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        currentTheme = 'dark';
    } else {
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        currentTheme = 'light';
    }
    
    localStorage.setItem('theme', currentTheme);
}

function disableBodyScroll() {
    document.body.classList.add('modal-open');
}

function enableBodyScroll() {
    document.body.classList.remove('modal-open');
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        disableBodyScroll();
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        enableBodyScroll();
        
        if (modal === videoModal) {
            resetVideoPlayer();
            currentVideoForSuggestions = null;
        }
    }
}

function resetVideoPlayer() {
    if (videoFrame) videoFrame.src = '';
    if (modalThumb) modalThumb.style.display = 'block';
    if (videoPlayer) videoPlayer.style.display = 'none';
    isVideoPlaying = false;
    currentVideoPlayerType = null;
    
    const modal = document.getElementById('videoModal');
    if (modal && !modal.classList.contains('active')) {
        hideChaptersSection();
        resetPlayingChapterHighlight();
    }
}

function resetPlayingChapterHighlight() {
    currentPlayingChapterIndex = null;
    const allChapterCards = document.querySelectorAll('.chapter-card');
    allChapterCards.forEach(card => {
        card.classList.remove('playing');
    });
}

function toggleSortMenu() {
    if (sortMenu) sortMenu.classList.toggle('active');
}

function handleSortChange(e) {
    const sortValue = e.currentTarget.dataset.sort;
    
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    currentSort = sortValue;
    if (sortMenu) sortMenu.classList.remove('active');
    
    resetPageForActiveTab();
    renderCurrentTab();
    updatePagination();
}

function resetPageForActiveTab() {
    if (activeTab === 'videos') currentVideoPage = 1;
    if (activeTab === 'albums') currentAlbumPage = 1;
    if (activeTab === 'pictures') currentPicturePage = 1;
}

function handleTabChange(e) {
    const tabId = e.currentTarget.dataset.tab;
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(`${tabId}Section`);
    if (targetSection) targetSection.classList.add('active');
    
    activeTab = tabId;
    
    updatePagination();
}

function handleSearch() {
    currentSearchTerm = searchInput.value.trim();
    
    if (!currentSearchTerm) {
        resetPageForActiveTab();
        renderCurrentTab();
        updatePagination();
    } else {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            resetPageForActiveTab();
            renderCurrentTab();
            updatePagination();
        }, 300);
    }
}

function performSearch() {
    if (currentSearchTerm) {
        resetPageForActiveTab();
        renderCurrentTab();
        updatePagination();
        showNotification(`Search results for "${currentSearchTerm}"`);
    }
}

function toggleDescription() {
    if (modalDesc && toggleDesc) {
        modalDesc.classList.toggle('expanded');
        toggleDesc.textContent = modalDesc.classList.contains('expanded') ? 'Show Less' : 'Show More';
    }
}

function openPreviewPage() {
    if (mainModalContent && previewPage) {
        mainModalContent.style.display = 'none';
        previewPage.style.display = 'block';
    }
}

function closePreviewPage() {
    if (previewPage && mainModalContent) {
        previewPage.style.display = 'none';
        mainModalContent.style.display = 'block';
    }
}

function getGoogleDrivePreviewUrl(url) {
    if (!url || !url.includes('drive.google.com')) return null;
    
    let match = url.match(/\/d\/([^\/?]+)/);
    if (!match) {
        match = url.match(/[?&]id=([^&]+)/);
    }
    if (!match) {
        match = url.match(/[a-zA-Z0-9_-]{28,}/);
    }
    
    if (!match) {
        console.warn('Invalid Google Drive link format');
        return null;
    }
    
    const fileId = match[1] || match[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getVideoEmbedUrl(url) {
    if (!url) return '';
    
    if (url.includes('drive.google.com')) {
        const previewUrl = getGoogleDrivePreviewUrl(url);
        if (previewUrl) return previewUrl;
    }
    
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            try {
                videoId = new URL(url).searchParams.get('v');
            } catch (e) {
                const match = url.match(/[?&]v=([^&]+)/);
                if (match) videoId = match[1];
            }
        } else if (url.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
    }
    
    if (url.includes('youtube.com/shorts/')) {
        const videoId = url.split('shorts/')[1]?.split('?')[0];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
    }
    
    if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        if (videoId) {
            return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        }
    }
    
    if (url.includes('dailymotion.com')) {
        const videoId = url.split('dailymotion.com/video/')[1]?.split('?')[0];
        if (videoId) {
            return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
        }
    }
    
    if (url.includes('embed') || url.includes('preview') || url.includes('player')) {
        if (url.includes('?')) {
            return url + '&autoplay=1';
        } else {
            return url + '?autoplay=1';
        }
    }
    
    if (url.includes('?')) {
        return url + '&autoplay=1';
    } else {
        return url + '?autoplay=1';
    }
}

function playVideo(type) {
    if (!videoThumbnailContainer || !currentVideoForSuggestions) return;
    
    const thumbnail = videoThumbnailContainer.querySelector('img');
    const player = videoThumbnailContainer.querySelector('.video-player');
    
    if (!thumbnail || !player || !videoFrame) return;
    
    if (isVideoPlaying) {
        videoFrame.src = '';
    }
    
    let videoUrl = '';
    if (type === 'trailer') {
        videoUrl = currentVideoForSuggestions.trailerUrl;
    } else if (type === 'full') {
        videoUrl = currentVideoForSuggestions.videoUrl;
    }
    
    if (!videoUrl) {
        showNotification(`${type === 'trailer' ? 'Trailer' : 'Video'} URL not available`);
        return;
    }
    
    const embedUrl = getVideoEmbedUrl(videoUrl);
    videoFrame.src = embedUrl;
    thumbnail.style.display = 'none';
    player.style.display = 'block';
    isVideoPlaying = true;
    currentVideoPlayerType = type;
    resetPlayingChapterHighlight();
}

function handleFilterTabChange(e) {
    const tabId = e.currentTarget.dataset.filterTab;
    
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    filterSections.forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(`${tabId}Filter`);
    if (targetSection) targetSection.classList.add('active');
}

function handleFilterSearch(e) {
    const filterType = e.currentTarget.dataset.filterType;
    const searchTerm = e.currentTarget.value.toLowerCase();
    
    const gridId = `${filterType}Grid`;
    const grid = document.getElementById(gridId);
    
    if (grid) {
        const items = grid.querySelectorAll('.filter-item');
        items.forEach(item => {
            const nameElement = item.querySelector('.filter-name');
            if (nameElement) {
                const name = nameElement.textContent.toLowerCase();
                item.style.display = name.includes(searchTerm) ? 'flex' : 'none';
            }
        });
    }
}

function handleOptionSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const filterType = e.currentTarget.dataset.filterType;
    const value = e.currentTarget.dataset.value;
    
    if (!filterType || !value) return;
    
    if (selectedFilters[filterType].includes(value)) {
        selectedFilters[filterType] = selectedFilters[filterType].filter(v => v !== value);
        e.currentTarget.classList.remove('selected');
    } else {
        selectedFilters[filterType].push(value);
        e.currentTarget.classList.add('selected');
    }
    
    applyFilterChanges();
}

function selectFilterItem(filterType, value) {
    if (!filterType || !value) return;
    
    if (selectedFilters[filterType].includes(value)) {
        selectedFilters[filterType] = selectedFilters[filterType].filter(v => v !== value);
    } else {
        selectedFilters[filterType].push(value);
    }
    
    updateFilterItemUI(filterType, value);
    applyFilterChanges();
}

function updateFilterItemUI(filterType, value) {
    const isSelected = selectedFilters[filterType].includes(value);
    
    const filterItems = document.querySelectorAll(`.filter-item[data-value="${value}"]`);
    filterItems.forEach(item => {
        if (isSelected) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    const optionItems = document.querySelectorAll(`.option-item[data-filter-type="${filterType}"][data-value="${value}"]`);
    optionItems.forEach(item => {
        if (isSelected) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function applyFilterChanges() {
    resetPageForActiveTab();
    updateActiveFilters();
    renderSelectedFilters();
    
    loadVideos();
    loadAlbums();
    loadPictures();
    updatePagination();
}

function removeSelectedFilter(filterType, value) {
    if (!filterType || !value) return;
    
    selectedFilters[filterType] = selectedFilters[filterType].filter(v => v !== value);
    updateFilterItemUI(filterType, value);
    applyFilterChanges();
}

function updateActiveFilters() {
    activeFilters = [];
    
    Object.keys(selectedFilters).forEach(filterType => {
        selectedFilters[filterType].forEach(value => {
            let displayName = value;
            
            if (filterType === 'version' || filterType === 'group') {
                displayName = value.charAt(0).toUpperCase() + value.slice(1);
            }
            
            activeFilters.push(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${displayName}`);
        });
    });
    
    renderActiveFilters();
}

function removeFilter(filterText) {
    const match = filterText.match(/^(\w+):\s*(.+)$/);
    if (match) {
        const filterType = match[1].toLowerCase();
        let value = match[2];
        
        if (filterType === 'version' || filterType === 'group') {
            value = value.toLowerCase();
        }
        
        removeSelectedFilter(filterType, value);
    } else {
        activeFilters = activeFilters.filter(filter => filter !== filterText);
        renderActiveFilters();
    }
}

function renderActiveFilters() {
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    activeFilters.forEach(filter => {
        const filterElement = document.createElement('div');
        filterElement.className = 'filter-tag';
        
        const safeFilter = filter.replace(/'/g, "\\'");
        filterElement.innerHTML = `
            <span>${filter}</span>
            <span class="remove" onclick="window.removeFilter('${safeFilter}')">
                <i class="fas fa-times"></i>
            </span>
        `;
        
        activeFiltersContainer.appendChild(filterElement);
    });
    
    activeFiltersContainer.style.display = activeFilters.length === 0 ? 'none' : 'flex';
}

function renderSelectedFilters() {
    if (!selectedFiltersContainer) return;
    
    selectedFiltersContainer.innerHTML = '';
    
    let hasSelectedFilters = false;
    
    Object.keys(selectedFilters).forEach(filterType => {
        if (selectedFilters[filterType].length > 0) {
            hasSelectedFilters = true;
            
            selectedFilters[filterType].forEach(value => {
                let displayName = value;
                
                if (filterType === 'version' || filterType === 'group') {
                    displayName = value.charAt(0).toUpperCase() + value.slice(1);
                }
                
                const filterItem = document.createElement('div');
                filterItem.className = 'selected-filter-item';
                filterItem.innerHTML = `
                    <span>${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${displayName}</span>
                    <button class="remove-selected" data-filter-type="${filterType}" data-value="${value}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                const removeBtn = filterItem.querySelector('.remove-selected');
                if (removeBtn) {
                    removeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSelectedFilter(filterType, value);
                    });
                }
                
                selectedFiltersContainer.appendChild(filterItem);
            });
        }
    });
    
    selectedFiltersContainer.style.display = hasSelectedFilters ? 'flex' : 'none';
}

function shuffleArray(array) {
    if (!array || !Array.isArray(array)) return [];
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderAllFilterItems() {
    Object.keys(filterData).forEach(filterType => {
        renderFilterItems(filterType, true);
    });
}

function renderFilterItems(filterType, shouldShuffle = false) {
    const gridId = `${filterType}Grid`;
    const grid = document.getElementById(gridId);
    
    if (!grid || !filterData[filterType]) return;
    
    grid.innerHTML = '';
    
    if (filterType === 'actress') {
        grid.classList.add('actress-filter-grid');
        grid.classList.add(currentActressGridLayout);
    }
    
    const selectedItems = selectedFilters[filterType] || [];
    let filterItems = [...filterData[filterType]];
    
    if (shouldShuffle) {
        filterItems = shuffleArray(filterItems);
    }
    
    selectedItems.forEach(value => {
        const itemData = filterItems.find(item => item.name === value);
        if (itemData) {
            const item = createFilterItem(filterType, itemData, true);
            grid.appendChild(item);
        }
    });
    
    filterItems.forEach(itemData => {
        if (!selectedItems.includes(itemData.name)) {
            const item = createFilterItem(filterType, itemData, false);
            grid.appendChild(item);
        }
    });
}

// Create a filter item element with compact actress details
function createFilterItem(filterType, itemData, isSelected) {
    const item = document.createElement('div');
    item.className = `filter-item ${isSelected ? 'selected' : ''}`;
    if (filterType === 'actress') {
        item.classList.add('actress-item');
    }
    item.dataset.value = itemData.name;
    
    // Get counts from the item data
    const videoCount = itemData.videoCount || 0;
    const albumCount = itemData.albumCount || 0;
    const pictureCount = itemData.pictureCount || 0;
    const countDisplay = formatCountDisplay(videoCount, albumCount, pictureCount);
    
    // Set aspect ratio based on filter type
    let aspectRatio = '1/1';
    if (filterType === 'actress') aspectRatio = '2/3';
    if (filterType === 'tokens') aspectRatio = '3/2';
    if (filterType === 'series') aspectRatio = '16/9';
    
    const placeholderText = encodeURIComponent(itemData.name);
    
    // Create compact details HTML for actress
    let detailsHTML = '';
    if (filterType === 'actress') {
        // Create compact horizontal details
        const details = [];
        if (itemData.age) details.push(`<span class="actress-age"><i class="fas fa-birthday-cake"></i> ${itemData.age}</span>`);
        if (itemData.height) details.push(`<span class="actress-height"><i class="fas fa-ruler"></i> ${itemData.height}</span>`);
        if (itemData.cupSize) details.push(`<span class="actress-cup"><i class="fas fa-heart"></i> ${itemData.cupSize}</span>`);
        
        if (details.length > 0) {
            detailsHTML = `<div class="actress-info">${details.join('')}</div>`;
        }
        
        // Add compact external link button if available
        if (itemData.externalLink) {
            detailsHTML += `
                <button class="external-link-btn" data-link="${itemData.externalLink}" onclick="event.stopPropagation(); window.open('${itemData.externalLink}', '_blank')">
                    <i class="fas fa-external-link-alt"></i> JAVguru
                </button>
            `;
        }
    }
    
    item.innerHTML = `
        <img src="${itemData.image || ''}" alt="${itemData.name}" class="filter-image" style="--ratio: ${aspectRatio};" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300/7c3aed/ffffff?text=${placeholderText}'">
        <div class="filter-name">${escapeHtml(itemData.name)}</div>
        ${countDisplay ? `<div class="filter-counts">${countDisplay}</div>` : ''}
        ${detailsHTML}
    `;
    
    // Prevent external link button click from triggering selection
    if (filterType === 'actress') {
        const extBtn = item.querySelector('.external-link-btn');
        if (extBtn) {
            extBtn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    item.addEventListener('click', (e) => {
        // Don't trigger if clicking on external link button
        if (e.target.closest('.external-link-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        selectFilterItem(filterType, itemData.name);
    });
    
    return item;
}

function loadFilterData(shouldShuffle = false) {
    Object.keys(filterData).forEach(filterType => {
        renderFilterItems(filterType, shouldShuffle);
    });
    
    renderSelectedFilters();
}

function openFilterModal() {
    renderAllFilterItems();
    openModal(filterModal);
    setTimeout(() => {
        setupStickyFilterControls();
    }, 100);
}

function changePage(contentType, direction) {
    if (contentType === 'videos') {
        currentVideoPage += direction;
        loadVideos();
    } else if (contentType === 'albums') {
        currentAlbumPage += direction;
        loadAlbums();
    } else if (contentType === 'pictures') {
        currentPicturePage += direction;
        loadPictures();
    }
    
    updatePagination();
    
    const section = document.getElementById(`${contentType}Section`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updatePagination() {
    const totalVideoPages = Math.max(1, Math.ceil(getFilteredVideos().length / itemsPerPage.videos));
    const totalAlbumPages = Math.max(1, Math.ceil(getFilteredAlbums().length / itemsPerPage.albums));
    const totalPicturePages = Math.max(1, Math.ceil(getFilteredPictures().length / itemsPerPage.pictures));
    
    if (currentVideoPage > totalVideoPages) currentVideoPage = totalVideoPages;
    if (currentAlbumPage > totalAlbumPages) currentAlbumPage = totalAlbumPages;
    if (currentPicturePage > totalPicturePages) currentPicturePage = totalPicturePages;
    
    if (videosPageNumber) videosPageNumber.textContent = currentVideoPage;
    if (videosPrevBtn) videosPrevBtn.disabled = currentVideoPage <= 1;
    if (videosNextBtn) videosNextBtn.disabled = currentVideoPage >= totalVideoPages;
    
    if (albumsPageNumber) albumsPageNumber.textContent = currentAlbumPage;
    if (albumsPrevBtn) albumsPrevBtn.disabled = currentAlbumPage <= 1;
    if (albumsNextBtn) albumsNextBtn.disabled = currentAlbumPage >= totalAlbumPages;
    
    if (picturesPageNumber) picturesPageNumber.textContent = currentPicturePage;
    if (picturesPrevBtn) picturesPrevBtn.disabled = currentPicturePage <= 1;
    if (picturesNextBtn) picturesNextBtn.disabled = currentPicturePage >= totalPicturePages;
}

function getFilteredVideos() {
    let filteredVideos = [...videoData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredVideos = filteredVideos.filter(video => 
            (video.title && video.title.toLowerCase().includes(searchLower)) ||
            (video.actress && video.actress.toLowerCase().includes(searchLower)) ||
            (video.code && video.code.toLowerCase().includes(searchLower)) ||
            (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
    }
    
    Object.keys(selectedFilters).forEach(filterType => {
        if (selectedFilters[filterType].length > 0) {
            filteredVideos = filteredVideos.filter(video => {
                switch(filterType) {
                    case 'actress':
                        if (!video.actress) return false;
                        const videoActresses = video.actress.split(',').map(a => a.trim());
                        return selectedFilters[filterType].some(selected => 
                            videoActresses.includes(selected)
                        );
                    
                    case 'tags':
                        if (!video.tags || !Array.isArray(video.tags)) return false;
                        return selectedFilters[filterType].some(selected => 
                            video.tags.includes(selected)
                        );
                    
                    case 'studios':
                        return video.studio && selectedFilters[filterType].includes(video.studio);
                    
                    case 'tokens':
                        return video.token && selectedFilters[filterType].includes(video.token);
                    
                    case 'series':
                        return video.series && selectedFilters[filterType].includes(video.series);
                    
                    case 'version':
                        return video.version && selectedFilters[filterType].includes(video.version);
                    
                    case 'group':
                        return video.group && selectedFilters[filterType].includes(video.group.toLowerCase());
                    
                    default:
                        return true;
                }
            });
        }
    });
    
    return filteredVideos;
}

function getFilteredAlbums() {
    let filteredAlbums = [...albumData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredAlbums = filteredAlbums.filter(album => 
            (album.title && album.title.toLowerCase().includes(searchLower)) ||
            (album.actress && album.actress.toLowerCase().includes(searchLower)) ||
            (album.tags && album.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
    }
    
    Object.keys(selectedFilters).forEach(filterType => {
        if (selectedFilters[filterType].length > 0) {
            filteredAlbums = filteredAlbums.filter(album => {
                switch(filterType) {
                    case 'actress':
                        if (!album.actress) return false;
                        const albumActresses = album.actress.split(',').map(a => a.trim());
                        return selectedFilters[filterType].some(selected => 
                            albumActresses.includes(selected)
                        );
                    
                    case 'tags':
                        if (!album.tags || !Array.isArray(album.tags)) return false;
                        return selectedFilters[filterType].some(selected => 
                            album.tags.includes(selected)
                        );
                    
                    default:
                        return true;
                }
            });
        }
    });
    
    return filteredAlbums;
}

function getFilteredPictures() {
    let filteredPictures = [...pictureData];
    
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filteredPictures = filteredPictures.filter(picture => 
            (picture.actress && picture.actress.toLowerCase().includes(searchLower)) ||
            (picture.tags && picture.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
    }
    
    Object.keys(selectedFilters).forEach(filterType => {
        if (selectedFilters[filterType].length > 0) {
            filteredPictures = filteredPictures.filter(picture => {
                switch(filterType) {
                    case 'actress':
                        if (!picture.actress) return false;
                        const pictureActresses = picture.actress.split(',').map(a => a.trim());
                        return selectedFilters[filterType].some(selected => 
                            pictureActresses.includes(selected)
                        );
                    
                    case 'tags':
                        if (!picture.tags || !Array.isArray(picture.tags)) return false;
                        return selectedFilters[filterType].some(selected => 
                            picture.tags.includes(selected)
                        );
                    
                    default:
                        return true;
                }
            });
        }
    });
    
    return filteredPictures;
}

function sortItems(items, contentType) {
    if (!items || !Array.isArray(items)) return [];
    
    const sortedItems = [...items];
    
    switch(currentSort) {
        case 'shuffle':
            return shuffleArray(sortedItems);
            
        case 'latest':
            if (contentType === 'videos' || contentType === 'albums') {
                sortedItems.sort((a, b) => {
                    const dateA = a.release ? new Date(a.release) : new Date(0);
                    const dateB = b.release ? new Date(b.release) : new Date(0);
                    return dateB - dateA;
                });
            } else {
                sortedItems.sort((a, b) => (b.id || 0) - (a.id || 0));
            }
            break;
            
        case 'oldest':
            if (contentType === 'videos' || contentType === 'albums') {
                sortedItems.sort((a, b) => {
                    const dateA = a.release ? new Date(a.release) : new Date(0);
                    const dateB = b.release ? new Date(b.release) : new Date(0);
                    return dateA - dateB;
                });
            } else {
                sortedItems.sort((a, b) => (a.id || 0) - (b.id || 0));
            }
            break;
            
        case 'top-rated':
            if (contentType === 'videos') {
                sortedItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (contentType === 'albums') {
                sortedItems.sort((a, b) => (b.pages || 0) - (a.pages || 0));
            }
            break;
            
        case 'most-viewed':
            if (contentType === 'videos') {
                sortedItems.sort((a, b) => (b.views || 0) - (a.views || 0));
            } else if (contentType === 'albums') {
                sortedItems.sort((a, b) => (b.pages || 0) - (a.pages || 0));
            }
            break;
    }
    
    return sortedItems;
}

function renderCurrentTab() {
    switch(activeTab) {
        case 'videos':
            loadVideos();
            break;
        case 'albums':
            loadAlbums();
            break;
        case 'pictures':
            loadPictures();
            break;
    }
}

function loadVideos() {
    if (!videosGrid) return;
    
    videosGrid.innerHTML = '';
    
    let filteredVideos = getFilteredVideos();
    filteredVideos = sortItems(filteredVideos, 'videos');
    
    const startIndex = (currentVideoPage - 1) * itemsPerPage.videos;
    const endIndex = startIndex + itemsPerPage.videos;
    const pageVideos = filteredVideos.slice(startIndex, endIndex);
    
    pageVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        videosGrid.appendChild(videoCard);
    });
    
    if (pageVideos.length === 0) {
        videosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video-slash"></i>
                <h3>No videos found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
    }
}

function createVideoCard(video) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    
    const thumbnail = video.thumbnail || 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=No+Image';
    const title = video.title || 'Untitled';
    const code = video.code || 'N/A';
    const version = video.version || 'Standard';
    const duration = video.duration || '0';
    const rating = video.rating ? video.rating.toFixed(1) : '0.0';
    
    videoCard.innerHTML = `
        <img src="${thumbnail}" alt="${title}" class="video-thumbnail" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/7c3aed/ffffff?text=Thumbnail'">
        <div class="video-info">
            <h3 class="video-title">${escapeHtml(title.substring(0, 60))}${title.length > 60 ? '...' : ''}</h3>
            <div class="video-meta">
                <div class="video-meta-item">
                    <i class="fas fa-hashtag"></i>
                    <span>${code}</span>
                </div>
                <div class="video-meta-item">
                    <i class="fas fa-layer-group"></i>
                    <span>${version}</span>
                </div>
                <div class="video-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${duration} min</span>
                </div>
                <div class="video-meta-item">
                    <i class="fas fa-star"></i>
                    <span>${rating}</span>
                </div>
            </div>
        </div>
    `;
    
    videoCard.addEventListener('click', () => {
        openVideoModal(video);
    });
    
    return videoCard;
}

function loadAlbums() {
    if (!albumsGrid) return;
    
    albumsGrid.innerHTML = '';
    
    let filteredAlbums = getFilteredAlbums();
    filteredAlbums = sortItems(filteredAlbums, 'albums');
    
    const startIndex = (currentAlbumPage - 1) * itemsPerPage.albums;
    const endIndex = startIndex + itemsPerPage.albums;
    const pageAlbums = filteredAlbums.slice(startIndex, endIndex);
    
    pageAlbums.forEach(album => {
        const albumCard = createAlbumCard(album);
        albumsGrid.appendChild(albumCard);
    });
    
    if (pageAlbums.length === 0) {
        albumsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No albums found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
    }
}

function createAlbumCard(album) {
    const albumCard = document.createElement('div');
    albumCard.className = 'album-card';
    
    const cover = album.cover || 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=No+Image';
    const title = album.title || 'Untitled';
    
    albumCard.innerHTML = `
        <img src="${cover}" alt="${title}" class="album-cover" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Album'">
        <div class="album-info">
            <h3 class="album-title">${escapeHtml(title.substring(0, 40))}${title.length > 40 ? '...' : ''}</h3>
        </div>
    `;
    
    albumCard.addEventListener('click', () => {
        openAlbumModal(album);
    });
    
    return albumCard;
}

function loadPictures() {
    if (!picturesGrid) return;
    
    picturesGrid.innerHTML = '';
    
    let filteredPictures = getFilteredPictures();
    filteredPictures = sortItems(filteredPictures, 'pictures');
    
    const startIndex = (currentPicturePage - 1) * itemsPerPage.pictures;
    const endIndex = startIndex + itemsPerPage.pictures;
    const pagePictures = filteredPictures.slice(startIndex, endIndex);
    
    pagePictures.forEach(picture => {
        const pictureCard = createPictureCard(picture);
        picturesGrid.appendChild(pictureCard);
    });
    
    if (pagePictures.length === 0) {
        picturesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-image"></i>
                <h3>No pictures found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
    }
}

function createPictureCard(picture) {
    const pictureCard = document.createElement('div');
    pictureCard.className = 'picture-card';
    
    const image = picture.image || 'https://via.placeholder.com/300x375/a78bfa/ffffff?text=No+Image';
    
    pictureCard.innerHTML = `
        <img src="${image}" alt="Picture" class="picture-img" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x375/a78bfa/ffffff?text=Picture'">
    `;
    
    pictureCard.addEventListener('click', () => {
        openImageModal(picture);
    });
    
    return pictureCard;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getAlsoStarredVideos(currentVideo) {
    if (!currentVideo || !currentVideo.actress) return [];
    
    const currentActresses = currentVideo.actress.split(',').map(a => a.trim());
    const allVideos = [...videoData];
    const otherVideos = allVideos.filter(video => video.id !== currentVideo.id);
    const matchingVideos = otherVideos.filter(video => {
        if (!video.actress) return false;
        const videoActresses = video.actress.split(',').map(a => a.trim());
        return videoActresses.some(actress => currentActresses.includes(actress));
    });
    
    matchingVideos.sort((a, b) => {
        const aActresses = a.actress ? a.actress.split(',').map(act => act.trim()) : [];
        const bActresses = b.actress ? b.actress.split(',').map(act => act.trim()) : [];
        const aMatches = aActresses.filter(act => currentActresses.includes(act)).length;
        const bMatches = bActresses.filter(act => currentActresses.includes(act)).length;
        if (bMatches !== aMatches) return bMatches - aMatches;
        return (b.views || 0) - (a.views || 0);
    });
    
    return matchingVideos.slice(0, 10);
}

function getYouMayLikeVideos(currentVideo) {
    if (!currentVideo || !currentVideo.tags) return [];
    
    const allVideos = [...videoData];
    const otherVideos = allVideos.filter(video => video.id !== currentVideo.id);
    const videosWithScore = otherVideos.map(video => {
        const commonTags = video.tags ? video.tags.filter(tag => currentVideo.tags.includes(tag)).length : 0;
        const totalTags = new Set([...(video.tags || []), ...(currentVideo.tags || [])]).size;
        const similarityScore = totalTags > 0 ? commonTags / totalTags : 0;
        return { ...video, similarityScore };
    });
    
    videosWithScore.sort((a, b) => {
        if (b.similarityScore !== a.similarityScore) return b.similarityScore - a.similarityScore;
        return (b.views || 0) - (a.views || 0);
    });
    
    return videosWithScore.slice(0, 10).map(video => {
        const { similarityScore, ...videoData } = video;
        return videoData;
    });
}

function setupCarouselTouch() {
    const carousels = [alsoStarredCarousel, youMayLikeCarousel].filter(Boolean);
    
    carousels.forEach(carousel => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });
        
        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        carousel.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        
        carousel.addEventListener('touchend', () => {
            isDown = false;
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });
}

function scrollCarousel(carouselId, direction) {
    const carousel = carouselId === 'alsoStarred' ? alsoStarredCarousel : youMayLikeCarousel;
    if (!carousel) return;
    
    const scrollAmount = 300;
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function loadSuggestionCarousels(video) {
    if (!video) return;
    
    if (alsoStarredCarousel) alsoStarredCarousel.innerHTML = '';
    if (youMayLikeCarousel) youMayLikeCarousel.innerHTML = '';
    
    const alsoStarredVideos = getAlsoStarredVideos(video);
    const youMayLikeVideos = getYouMayLikeVideos(video);
    
    if (alsoStarredCarousel) {
        if (alsoStarredVideos.length > 0) {
            alsoStarredVideos.forEach(suggestedVideo => {
                const carouselItem = createCarouselItem(suggestedVideo, 'poster');
                alsoStarredCarousel.appendChild(carouselItem);
            });
        } else {
            alsoStarredCarousel.innerHTML = `<div class="carousel-empty"><p>No other videos with the same actress(es)</p></div>`;
        }
    }
    
    if (youMayLikeCarousel) {
        if (youMayLikeVideos.length > 0) {
            youMayLikeVideos.forEach(suggestedVideo => {
                const carouselItem = createCarouselItem(suggestedVideo, 'thumbnail');
                youMayLikeCarousel.appendChild(carouselItem);
            });
        } else {
            youMayLikeCarousel.innerHTML = `<div class="carousel-empty"><p>No similar videos found</p></div>`;
        }
    }
}

function createCarouselItem(video, type) {
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${type}`;
    
    const imageUrl = type === 'poster' 
        ? (video.poster || 'https://via.placeholder.com/300x450/7c3aed/ffffff?text=Poster')
        : (video.thumbnail || 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Thumbnail');
    
    const code = video.code || 'N/A';
    
    carouselItem.innerHTML = `
        <img src="${imageUrl}" alt="${video.title || ''}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450/7c3aed/ffffff?text=Poster'">
        <div class="carousel-code">${code}</div>
    `;
    
    carouselItem.addEventListener('click', () => {
        closeModal(videoModal);
        setTimeout(() => {
            openVideoModal(video);
        }, 50);
    });
    
    return carouselItem;
}

// ========== CHAPTERS SECTION FUNCTIONS ==========

function createChaptersSection() {
    if (document.getElementById('chaptersSection')) {
        return document.getElementById('chaptersSection');
    }
    
    const videoControls = document.querySelector('.video-controls');
    if (!videoControls) return null;
    
    const chaptersSection = document.createElement('div');
    chaptersSection.id = 'chaptersSection';
    chaptersSection.className = 'chapters-section';
    chaptersSection.style.display = 'none';
    
    const chaptersHeader = document.createElement('div');
    chaptersHeader.className = 'chapters-header';
    chaptersHeader.innerHTML = '<h3 class="chapters-title"><i class="fas fa-list-ol"></i> Chapters</h3>';
    
    const chaptersCarouselContainer = document.createElement('div');
    chaptersCarouselContainer.className = 'chapters-carousel-container';
    
    const prevNav = document.createElement('div');
    prevNav.className = 'carousel-nav chapters-prev';
    prevNav.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextNav = document.createElement('div');
    nextNav.className = 'carousel-nav chapters-next';
    nextNav.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const chaptersCarousel = document.createElement('div');
    chaptersCarousel.className = 'chapters-carousel';
    chaptersCarousel.id = 'chaptersCarousel';
    
    chaptersCarouselContainer.appendChild(prevNav);
    chaptersCarouselContainer.appendChild(chaptersCarousel);
    chaptersCarouselContainer.appendChild(nextNav);
    
    chaptersSection.appendChild(chaptersHeader);
    chaptersSection.appendChild(chaptersCarouselContainer);
    
    videoControls.parentNode.insertBefore(chaptersSection, videoControls);
    
    prevNav.addEventListener('click', () => scrollChaptersCarousel(-1));
    nextNav.addEventListener('click', () => scrollChaptersCarousel(1));
    setupChaptersCarouselTouch(chaptersCarousel);
    
    return chaptersSection;
}

function scrollChaptersCarousel(direction) {
    const carousel = document.getElementById('chaptersCarousel');
    if (!carousel) return;
    
    const scrollAmount = 300;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function setupChaptersCarouselTouch(carousel) {
    if (!carousel) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });
    
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('touchend', () => {
        isDown = false;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
}

function loadChapters(video) {
    const chaptersCarousel = document.getElementById('chaptersCarousel');
    if (!chaptersCarousel) return;
    
    chaptersCarousel.innerHTML = '';
    
    if (!video.chapters || !Array.isArray(video.chapters) || video.chapters.length === 0) {
        chaptersCarousel.innerHTML = `<div class="carousel-empty"><p>No chapters available for this video</p></div>`;
        return;
    }
    
    video.chapters.forEach((chapter, index) => {
        const chapterCard = createChapterCard(chapter, index + 1, index);
        chaptersCarousel.appendChild(chapterCard);
    });
}

function createChapterCard(chapter, chapterNumber, chapterIndex) {
    const chapterCard = document.createElement('div');
    chapterCard.className = 'chapter-card';
    chapterCard.dataset.chapterIndex = chapterIndex;
    
    const chapterTitle = chapter.title || `Chapter ${chapterNumber}`;
    const thumbnailUrl = chapter.thumbnail || 'https://via.placeholder.com/400x225/7c3aed/ffffff?text=No+Thumbnail';
    const description = chapter.description || '';
    const chapterUrl = chapter.url || '';
    
    chapterCard.innerHTML = `
        <div class="chapter-number">Chapter ${chapterNumber}</div>
        <div class="chapter-thumbnail-wrapper">
            <img src="${thumbnailUrl}" alt="${chapterTitle}" class="chapter-thumbnail" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x225/7c3aed/ffffff?text=Chapter+${chapterNumber}'">
            <div class="chapter-play-overlay"><i class="fas fa-play-circle"></i></div>
        </div>
        <div class="chapter-title-text">${escapeHtml(chapterTitle)}</div>
        <div class="chapter-description-scrollable">
            <div class="chapter-description-content">${escapeHtml(description)}</div>
        </div>
    `;
    
    if (chapterUrl) {
        chapterCard.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only scroll the modal to top - remove any chapter card auto-scroll
            smoothScrollToTopOfModal();
            // Load chapter after scroll animation completes
            setTimeout(() => {
                loadChapterInVideoPlayer(chapterUrl, chapterTitle, chapterIndex);
            }, 300);
        });
    }
    
    return chapterCard;
}

function loadChapterInVideoPlayer(chapterUrl, chapterTitle, chapterIndex) {
    if (!videoFrame || !videoThumbnailContainer) return;
    
    const thumbnail = videoThumbnailContainer.querySelector('img');
    const player = videoThumbnailContainer.querySelector('.video-player');
    
    if (!thumbnail || !player) return;
    
    if (isVideoPlaying) {
        videoFrame.src = '';
    }
    
    const embedUrl = getVideoEmbedUrl(chapterUrl);
    videoFrame.src = embedUrl;
    thumbnail.style.display = 'none';
    player.style.display = 'block';
    isVideoPlaying = true;
    currentVideoPlayerType = 'chapter';
    
    // Update playing chapter highlight WITHOUT auto-scrolling
    updatePlayingChapterHighlightNoScroll(chapterIndex);
    
    showNotification(`Now playing: ${chapterTitle}`);
}

// New function that doesn't auto-scroll to the chapter
function updatePlayingChapterHighlightNoScroll(playingIndex) {
    const allChapterCards = document.querySelectorAll('.chapter-card');
    allChapterCards.forEach(card => {
        card.classList.remove('playing');
    });
    
    if (playingIndex !== null && playingIndex !== undefined) {
        const playingCard = document.querySelector(`.chapter-card[data-chapter-index="${playingIndex}"]`);
        if (playingCard) {
            playingCard.classList.add('playing');
            currentPlayingChapterIndex = playingIndex;
            // REMOVED: playingCard.scrollIntoView - this was causing the double scroll!
        }
    }
}

// Keep original function for other uses (if needed)
function updatePlayingChapterHighlight(playingIndex) {
    const allChapterCards = document.querySelectorAll('.chapter-card');
    allChapterCards.forEach(card => {
        card.classList.remove('playing');
    });
    
    if (playingIndex !== null && playingIndex !== undefined) {
        const playingCard = document.querySelector(`.chapter-card[data-chapter-index="${playingIndex}"]`);
        if (playingCard) {
            playingCard.classList.add('playing');
            currentPlayingChapterIndex = playingIndex;
            // Only scroll if we're not already handling modal scroll
            // This is kept for backward compatibility but not used in chapter clicks
        }
    }
}

function toggleChaptersSection() {
    const chaptersSection = document.getElementById('chaptersSection');
    if (!chaptersSection) return;
    
    isChaptersVisible = !isChaptersVisible;
    chaptersSection.style.display = isChaptersVisible ? 'block' : 'none';
    
    if (videoBtn) {
        if (isChaptersVisible) {
            videoBtn.innerHTML = '<i class="fas fa-list-ol"></i> Hide Chapters';
            videoBtn.classList.add('chapters-active');
        } else {
            videoBtn.innerHTML = '<i class="fas fa-film"></i> Video';
            videoBtn.classList.remove('chapters-active');
        }
    }
}

function hideChaptersSection() {
    const chaptersSection = document.getElementById('chaptersSection');
    if (chaptersSection) {
        chaptersSection.style.display = 'none';
        isChaptersVisible = false;
        if (videoBtn) {
            videoBtn.innerHTML = '<i class="fas fa-film"></i> Video';
            videoBtn.classList.remove('chapters-active');
        }
    }
}

// UPDATED: Open video modal with new sections
function openVideoModal(video) {
    if (!video) return;
    
    console.log('Opening video modal for:', video.title);
    console.log('Video has plotData:', !!video.plotData);
    console.log('Video has activities:', !!(video.activities && video.activities.length));
    console.log('Video has reviews:', !!video.reviews);
    
    currentVideoForSuggestions = video;
    resetVideoPlayer();
    closePreviewPage();
    resetPlayingChapterHighlight();
    hideChaptersSection();
    createChaptersSection();
    updateVideoModalContent(video);
    loadChapters(video);
    loadSuggestionCarousels(video);
    
    // Insert new sections
    insertNewSections(video);
    
    openModal(videoModal);
}

function updateVideoModalContent(video) {
    if (modalTitle) modalTitle.textContent = video.title || 'Untitled';
    if (modalDesc) modalDesc.textContent = video.description || '';
    if (modalCode) modalCode.textContent = video.code || 'N/A';
    
    if (modalThumb) {
        modalThumb.src = video.thumbnail || 'https://via.placeholder.com/600x400/7c3aed/ffffff?text=No+Image';
        modalThumb.alt = video.title || 'Video Thumbnail';
    }
    
    if (modalPoster) {
        modalPoster.src = video.poster || 'https://via.placeholder.com/300x450/7c3aed/ffffff?text=No+Image';
        modalPoster.alt = video.title || 'Video Poster';
    }
    
    if (modalRating) modalRating.textContent = video.rating ? video.rating.toFixed(1) : '0.0';
    if (modalStudio) modalStudio.textContent = video.studio || 'N/A';
    if (modalLabel) modalLabel.textContent = video.label || 'N/A';
    if (modalRelease) modalRelease.textContent = video.release || 'N/A';
    if (modalDuration) modalDuration.textContent = video.duration || '0';
    if (modalVersions) modalVersions.textContent = video.version || 'Standard';
    if (modalGroup) modalGroup.textContent = video.group || 'N/A';
    if (modalViews) modalViews.textContent = video.views ? video.views.toLocaleString() : '0';
    if (modalSeries) modalSeries.textContent = video.series || 'N/A';
    
    if (modalDesc && toggleDesc) {
        modalDesc.classList.remove('expanded');
        toggleDesc.textContent = 'Show More';
    }
    
    updateModalTags(video);
    updateModalActresses(video);
    updateClickableMetadata(video);
    updatePreviewImages(video);
}

function updateModalTags(video) {
    if (!modalTags) return;
    
    modalTags.innerHTML = '';
    
    if (video.tags && video.tags.length > 0) {
        video.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectFilterItem('tags', tag);
                closeModal(videoModal);
            });
            modalTags.appendChild(tagElement);
        });
    }
}

// Update modal actresses with compact enhanced details
function updateModalActresses(video) {
    if (!modalActress) return;
    
    modalActress.innerHTML = '';
    
    if (video.actress) {
        const actressNames = video.actress.split(',').map(name => name.trim());
        
        actressNames.forEach(actressName => {
            const actressData = filterData.actress ? filterData.actress.find(a => a.name === actressName) : null;
            const actressImg = actressData ? actressData.image : '';
            
            const actressElement = document.createElement('div');
            actressElement.className = 'actress';
            
            const actressImgElement = document.createElement('img');
            actressImgElement.src = actressImg;
            actressImgElement.alt = actressName;
            actressImgElement.onerror = function() {
                this.onerror = null;
                this.src = `https://via.placeholder.com/200x300/7c3aed/ffffff?text=${encodeURIComponent(actressName)}`;
            };
            
            const actressNameElement = document.createElement('span');
            actressNameElement.textContent = actressName;
            
            actressElement.appendChild(actressImgElement);
            actressElement.appendChild(actressNameElement);
            
            if (actressData && (actressData.age || actressData.height || actressData.cupSize || actressData.externalLink)) {
                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'modal-actress-details';
                
                if (actressData.age) {
                    const ageSpan = document.createElement('p');
                    ageSpan.innerHTML = `<i class="fas fa-birthday-cake"></i> ${actressData.age}`;
                    detailsDiv.appendChild(ageSpan);
                }
                if (actressData.height) {
                    const heightSpan = document.createElement('p');
                    heightSpan.innerHTML = `<i class="fas fa-ruler"></i> ${actressData.height}`;
                    detailsDiv.appendChild(heightSpan);
                }
                if (actressData.cupSize) {
                    const cupSpan = document.createElement('p');
                    cupSpan.innerHTML = `<i class="fas fa-heart"></i> ${actressData.cupSize}`;
                    detailsDiv.appendChild(cupSpan);
                }
                
                actressElement.appendChild(detailsDiv);
            }
            
            actressElement.addEventListener('click', (e) => {
                if (e.target.closest('.external-link-btn')) return;
                e.preventDefault();
                e.stopPropagation();
                selectFilterItem('actress', actressName);
                closeModal(videoModal);
            });
            
            modalActress.appendChild(actressElement);
        });
    }
}

function updateClickableMetadata(video) {
    if (modalSeries) {
        modalSeries.replaceWith(modalSeries.cloneNode(true));
        const newModalSeries = document.getElementById('modalSeries');
        if (newModalSeries && video.series) {
            newModalSeries.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectFilterItem('series', video.series);
                closeModal(videoModal);
            });
        }
    }
    
    if (modalStudio) {
        modalStudio.replaceWith(modalStudio.cloneNode(true));
        const newModalStudio = document.getElementById('modalStudio');
        if (newModalStudio && video.studio) {
            newModalStudio.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectFilterItem('studios', video.studio);
                closeModal(videoModal);
            });
        }
    }
    
    if (modalLabel) {
        modalLabel.replaceWith(modalLabel.cloneNode(true));
        const newModalLabel = document.getElementById('modalLabel');
        if (newModalLabel && video.label) {
            newModalLabel.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const labelFilter = `Label: ${video.label}`;
                if (!activeFilters.includes(labelFilter)) {
                    activeFilters.push(labelFilter);
                    renderActiveFilters();
                }
                closeModal(videoModal);
            });
        }
    }
    
    if (modalVersions) {
        modalVersions.replaceWith(modalVersions.cloneNode(true));
        const newModalVersions = document.getElementById('modalVersions');
        if (newModalVersions && video.version) {
            newModalVersions.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectFilterItem('version', video.version);
                closeModal(videoModal);
            });
        }
    }
    
    if (modalGroup) {
        modalGroup.replaceWith(modalGroup.cloneNode(true));
        const newModalGroup = document.getElementById('modalGroup');
        if (newModalGroup && video.group) {
            newModalGroup.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectFilterItem('group', video.group.toLowerCase());
                closeModal(videoModal);
            });
        }
    }
}

function updatePreviewImages(video) {
    if (!previewImagesFull) return;
    
    previewImagesFull.innerHTML = '';
    
    if (video.previews && video.previews.length > 0) {
        video.previews.forEach((preview, index) => {
            const previewImage = document.createElement('div');
            previewImage.className = 'preview-image-full';
            previewImage.innerHTML = `<img src="${preview}" alt="Preview ${index + 1}" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x338/7c3aed/ffffff?text=Preview'">`;
            previewImagesFull.appendChild(previewImage);
        });
    } else {
        previewImagesFull.innerHTML = `<div class="empty-state"><i class="fas fa-image"></i><h3>No preview images available</h3></div>`;
    }
}

function openAlbumModal(album) {
    if (!album) return;
    
    if (albumModalTitle) albumModalTitle.textContent = album.title || 'Untitled';
    
    if (albumModalTags) {
        albumModalTags.innerHTML = '';
        if (album.tags && album.tags.length > 0) {
            album.tags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectFilterItem('tags', tag);
                    closeModal(albumModal);
                });
                albumModalTags.appendChild(tagElement);
            });
        }
    }
    
    if (albumModalActress) {
        albumModalActress.innerHTML = '';
        if (album.actress) {
            const actressNames = album.actress.split(',').map(name => name.trim());
            
            actressNames.forEach(actressName => {
                const actressData = filterData.actress ? filterData.actress.find(a => a.name === actressName) : null;
                const actressImg = actressData ? actressData.image : '';
                
                const actressElement = document.createElement('div');
                actressElement.className = 'actress';
                
                const actressImgElement = document.createElement('img');
                actressImgElement.src = actressImg;
                actressImgElement.alt = actressName;
                actressImgElement.onerror = function() {
                    this.onerror = null;
                    this.src = `https://via.placeholder.com/200x300/8b5cf6/ffffff?text=${encodeURIComponent(actressName)}`;
                };
                
                const actressNameElement = document.createElement('span');
                actressNameElement.textContent = actressName;
                
                actressElement.appendChild(actressImgElement);
                actressElement.appendChild(actressNameElement);
                
                if (actressData && (actressData.age || actressData.height || actressData.cupSize || actressData.externalLink)) {
                    const detailsDiv = document.createElement('div');
                    detailsDiv.className = 'modal-actress-details';
                    let detailsHTML = '';
                    if (actressData.age) detailsHTML += `<p><i class="fas fa-birthday-cake"></i> ${actressData.age}</p>`;
                    if (actressData.height) detailsHTML += `<p><i class="fas fa-ruler"></i> ${actressData.height}</p>`;
                    if (actressData.cupSize) detailsHTML += `<p><i class="fas fa-heart"></i> ${actressData.cupSize}</p>`;
                    detailsDiv.innerHTML = detailsHTML;
                    
                    if (actressData.externalLink) {
                        const extLinkBtn = document.createElement('button');
                        extLinkBtn.className = 'external-link-btn';
                        extLinkBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Javguru';
                        extLinkBtn.onclick = (e) => {
                            e.stopPropagation();
                            window.open(actressData.externalLink, '_blank');
                        };
                        detailsDiv.appendChild(extLinkBtn);
                    }
                    actressElement.appendChild(detailsDiv);
                }
                
                actressElement.addEventListener('click', (e) => {
                    if (e.target.closest('.external-link-btn')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    selectFilterItem('actress', actressName);
                    closeModal(albumModal);
                });
                
                albumModalActress.appendChild(actressElement);
            });
        }
    }
    
    if (albumModalImageCount) {
        const totalImages = album.albumImages && album.albumImages.length ? album.albumImages.length + 1 : 1;
        albumModalImageCount.textContent = `${totalImages} images (including cover)`;
    }
    
    if (albumMainCover) {
        albumMainCover.src = album.cover || 'https://via.placeholder.com/600x800/8b5cf6/ffffff?text=No+Image';
        albumMainCover.alt = album.title || 'Album Cover';
    }
    
    if (albumImagesContainer) {
        albumImagesContainer.innerHTML = '';
        if (album.albumImages && album.albumImages.length > 0) {
            album.albumImages.forEach((image, index) => {
                const albumImage = document.createElement('div');
                albumImage.className = 'album-image';
                albumImage.innerHTML = `<img src="${image}" alt="Album Image ${index + 1}" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x338/8b5cf6/ffffff?text=Album+Image'">`;
                albumImagesContainer.appendChild(albumImage);
            });
        }
    }
    
    openModal(albumModal);
}

function openImageModal(picture) {
    if (!picture || !fullscreenImage) return;
    
    fullscreenImage.src = picture.image || 'https://via.placeholder.com/800x1000/a78bfa/ffffff?text=No+Image';
    fullscreenImage.alt = 'Fullscreen Image';
    
    openModal(imageModal);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make functions available globally
window.removeFilter = removeFilter;
window.selectFilterItem = selectFilterItem;
