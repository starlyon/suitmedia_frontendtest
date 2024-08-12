// Simulasi data post
const posts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
    image: `https://picsum.photos/seed/${i + 1}/300/200`,
    date: new Date(2024, 0, 1 + i).toISOString()
}));

// State
let currentPage = 1;
let postsPerPage = 10;
let sortOrder = 'newest';

// DOM Elements
const header = document.getElementById('header');
const banner = document.getElementById('banner');
const postContainer = document.getElementById('post-container');
const paginationContainer = document.getElementById('pagination');
const itemStatus = document.getElementById('item-status');
const sortSelect = document.getElementById('sort-select');
const showSelect = document.getElementById('show-select');

// Header visibility
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    header.classList.toggle('transparent', scrollTop > 0);
    lastScrollTop = scrollTop;
});

// Banner parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    banner.querySelector('.banner-image').style.transform = `translateY(${scrolled * 0.5}px)`;
    banner.querySelector('.banner-text').style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.3}px)`;
});

// Render posts
function renderPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const sortedPosts = [...posts].sort((a, b) => {
        return sortOrder === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    });
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    postContainer.innerHTML = paginatedPosts.map(post => `
        <div class="post-card">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <h3>${post.title}</h3>
        </div>
    `).join('');

    renderPagination();
    updateItemStatus(startIndex + 1, endIndex, posts.length);
}

// Render pagination
function renderPagination() {
    const pageCount = Math.ceil(posts.length / postsPerPage);
    paginationContainer.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})"><</button>
        <span>${currentPage} / ${pageCount}</span>
        <button ${currentPage === pageCount ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">></button>
    `;
}

// Update item status
function updateItemStatus(start, end, total) {
    itemStatus.textContent = `Showing ${start} - ${Math.min(end, total)} of ${total} items`;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderPosts();
    saveState();
}

// Event listeners
sortSelect.addEventListener('change', (e) => {
    sortOrder = e.target.value;
    currentPage = 1;
    renderPosts();
    saveState();
});

showSelect.addEventListener('change', (e) => {
    postsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderPosts();
    saveState();
});

// Save state to localStorage
function saveState() {
    localStorage.setItem('listState', JSON.stringify({ currentPage, postsPerPage, sortOrder }));
}

// Load state from localStorage
function loadState() {
    const savedState = JSON.parse(localStorage.getItem('listState'));
    if (savedState) {
        currentPage = savedState.currentPage;
        postsPerPage = savedState.postsPerPage;
        sortOrder = savedState.sortOrder;
        sortSelect.value = sortOrder;
        showSelect.value = postsPerPage;
    }
}

// Initialize
loadState();
renderPosts();