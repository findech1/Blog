// Responsive Navbar
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.onclick = () => navLinks.classList.toggle('active');

// SPA Navigation
const sections = document.querySelectorAll('.page-section');
const navLinksAll = document.querySelectorAll('.nav-link');

function showSection(sectionId) {
  sections.forEach(sec => {
    sec.style.display = (sec.id === sectionId) ? 'block' : 'none';
  });
  // Highlight active link
  navLinksAll.forEach(link => {
    if (link.getAttribute('href') === '#' + sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Handle navigation clicks
navLinksAll.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const sectionId = this.getAttribute('href').substring(1);
    showSection(sectionId);
    // Close mobile nav
    navLinks.classList.remove('active');
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Show Home by default
showSection('home');

// Blog Post Logic
const postsContainer = document.getElementById('posts');
const modal = document.getElementById('modal');
const postForm = document.getElementById('postForm');
const addPostBtn = document.getElementById('addPostBtn');
const closeModal = document.getElementById('closeModal');
let editingIndex = null;

function getPosts() {
  return JSON.parse(localStorage.getItem('posts') || '[]');
}

function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

function renderPosts() {
  const posts = getPosts();
  postsContainer.innerHTML = '';
  posts.forEach((post, idx) => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-date">${post.date}</div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <button onclick="editPost(${idx})">Edit</button>
        <button onclick="deletePost(${idx})">Delete</button>
      </div>
    `;
    postsContainer.appendChild(postEl);
  });
}

// Dummy blog posts if none exist
function injectDummyPosts() {
  const posts = getPosts();
  if (posts.length === 0) {
    const dummy = [
      {
        title: "Getting Started with React in 2024",
        content: "React remains one of the most popular JavaScript libraries for building user interfaces. In this guide, we'll cover the basics of setting up a React project, component structure, and state management.",
        date: "2024-06-01"
      },
      {
        title: "Top 5 VS Code Extensions for Productivity",
        content: "Boost your coding efficiency with these must-have VS Code extensions: Prettier, ESLint, GitLens, Live Server, and Bracket Pair Colorizer.",
        date: "2024-05-28"
      },
      {
        title: "Understanding Docker for Beginners",
        content: "Docker simplifies application deployment by using containers. Learn how to create your first Docker container and understand the basics of Dockerfiles.",
        date: "2024-05-20"
      }
    ];
    savePosts(dummy);
    renderPosts();
  }
}
injectDummyPosts();

window.editPost = function(idx) {
  const posts = getPosts();
  editingIndex = idx;
  document.getElementById('postTitle').value = posts[idx].title;
  document.getElementById('postContent').value = posts[idx].content;
  modal.classList.add('active');
};

window.deletePost = function(idx) {
  const posts = getPosts();
  posts.splice(idx, 1);
  savePosts(posts);
  renderPosts();
};

if (addPostBtn) {
  addPostBtn.onclick = () => {
    editingIndex = null;
    postForm.reset();
    modal.classList.add('active');
  };
}

if (closeModal) {
  closeModal.onclick = () => {
    modal.classList.remove('active');
  };
}

if (postForm) {
  postForm.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const posts = getPosts();
    if (editingIndex !== null) {
      posts[editingIndex] = { ...posts[editingIndex], title, content };
    } else {
      posts.unshift({
        title,
        content,
        date: new Date().toLocaleDateString()
      });
    }
    savePosts(posts);
    renderPosts();
    modal.classList.remove('active');
  };
}

renderPosts();

// Contact form dummy handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.onsubmit = function(e) {
    e.preventDefault();
    document.getElementById('contactSuccess').style.display = 'block';
    contactForm.reset();
    setTimeout(() => {
      document.getElementById('contactSuccess').style.display = 'none';
    }, 4000);
  };
}