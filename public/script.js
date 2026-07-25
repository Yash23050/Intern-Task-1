document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // ADD BLOG LOGIC (Days 4 & 5) - Local Storage Update
    // ==========================================
    const form = document.getElementById("addBlogForm");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const messageBox = document.getElementById("messageBox");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); 
            const titleValue = titleInput.value.trim();
            const contentValue = contentInput.value.trim();

            if (titleValue === "" || contentValue === "") {
                messageBox.textContent = "Please fill in both the title and content fields.";
                messageBox.className = "message-box message-error";
                return; 
            } 

            // Local Storage: Get existing, push new, save back
            let blogs = JSON.parse(localStorage.getItem('simple_blogs')) || [];
            
            const newBlog = {
                id: Date.now().toString(),
                title: titleValue,
                content: contentValue,
                date: new Date().toLocaleDateString()
            };

            blogs.push(newBlog);
            localStorage.setItem('simple_blogs', JSON.stringify(blogs));

            messageBox.textContent = "Success! Blog successfully posted.";
            messageBox.className = "message-box message-success";
            form.reset(); 
        });
    }

    // ==========================================
    // VIEW, EDIT & DELETE BLOGS LOGIC (Days 7, 8 & 9)
    // ==========================================
    const blogsContainer = document.getElementById("blogsContainer");

    if (blogsContainer) {
        
        const fetchBlogs = () => {
            // DAY 10 ENHANCEMENT: Show a loading state
            blogsContainer.innerHTML = '<p style="text-align: center; font-weight: 500; color: #6b7280;">Loading blog posts...</p>';
            
            // Using a slight timeout to keep the loading animation feel before showing local storage data
            setTimeout(() => {
                let blogs = JSON.parse(localStorage.getItem('simple_blogs')) || [];

                // Inject a default welcome blog if the array is completely empty
                if (blogs.length === 0) {
                    const defaultBlog = {
                        id: Date.now().toString(),
                        title: "Welcome to SimpleBlog!",
                        content: "This live demo uses your browser's local storage to save posts. Add a new blog to test it out!",
                        date: new Date().toLocaleDateString()
                    };
                    blogs.push(defaultBlog);
                    localStorage.setItem('simple_blogs', JSON.stringify(blogs));
                }

                displayBlogs(blogs);
            }, 400);
        };

        const displayBlogs = (blogs) => {
            blogsContainer.innerHTML = ""; 

            if (blogs.length === 0) {
                blogsContainer.innerHTML = "<p>No blog posts yet. Go to 'Add Blog' to create one!</p>";
                return;
            }

            blogs.forEach(blog => {
                const card = document.createElement("div");
                card.className = "blog-card";
                
                card.innerHTML = `
                    <!-- VIEW MODE -->
                    <div class="view-mode">
                        <h2>${blog.title}</h2>
                        <div class="blog-date">Posted on: ${blog.date}</div>
                        <div class="blog-content">${blog.content}</div>
                        <div class="card-actions">
                            <button class="btn-edit" data-id="${blog.id}">Edit Post</button>
                            <button class="btn-delete" data-id="${blog.id}">Delete Post</button>
                        </div>
                    </div>
                    
                    <!-- EDIT MODE (Hidden by default) -->
                    <div class="edit-mode" style="display: none;">
                        <input type="text" class="edit-input" id="edit-title-${blog.id}" value="${blog.title}">
                        <textarea class="edit-textarea" rows="4" id="edit-content-${blog.id}">${blog.content}</textarea>
                        <div class="card-actions">
                            <button class="btn-save" data-id="${blog.id}">Save Changes</button>
                            <button class="btn-cancel" data-id="${blog.id}">Cancel</button>
                        </div>
                    </div>
                `;
                blogsContainer.appendChild(card);
            });
        };

        // Event Delegation for Edit, Save, Cancel, and Delete buttons
        blogsContainer.addEventListener('click', (e) => {
            const btn = e.target;
            const blogId = btn.getAttribute('data-id');
            if (!blogId) return;

            const card = btn.closest('.blog-card');
            const viewMode = card.querySelector('.view-mode');
            const editMode = card.querySelector('.edit-mode');

            // Handle Edit
            if (btn.classList.contains('btn-edit')) {
                viewMode.style.display = 'none';
                editMode.style.display = 'block';
            }

            // Handle Cancel
            if (btn.classList.contains('btn-cancel')) {
                viewMode.style.display = 'block';
                editMode.style.display = 'none';
            }

            // Handle Save (PUT replacement)
            if (btn.classList.contains('btn-save')) {
                const updatedTitle = document.getElementById(`edit-title-${blogId}`).value.trim();
                const updatedContent = document.getElementById(`edit-content-${blogId}`).value.trim();

                if (!updatedTitle || !updatedContent) {
                    alert("Title and content cannot be empty.");
                    return;
                }

                let blogs = JSON.parse(localStorage.getItem('simple_blogs')) || [];
                const blogIndex = blogs.findIndex(b => b.id === blogId);
                
                if (blogIndex !== -1) {
                    blogs[blogIndex].title = updatedTitle;
                    blogs[blogIndex].content = updatedContent;
                    localStorage.setItem('simple_blogs', JSON.stringify(blogs));
                    fetchBlogs(); 
                } else {
                    alert("Failed to update the blog post.");
                }
            }

            // Handle Delete (DELETE replacement)
            if (btn.classList.contains('btn-delete')) {
                if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
                    let blogs = JSON.parse(localStorage.getItem('simple_blogs')) || [];
                    blogs = blogs.filter(blog => blog.id !== blogId);
                    localStorage.setItem('simple_blogs', JSON.stringify(blogs));
                    fetchBlogs(); // Re-fetch to show the blog is gone
                }
            }
        });

        fetchBlogs();
    }
});