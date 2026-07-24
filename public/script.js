document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // ADD BLOG LOGIC (Days 4 & 5)
    // ==========================================
    const form = document.getElementById("addBlogForm");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const messageBox = document.getElementById("messageBox");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); 
            const titleValue = titleInput.value.trim();
            const contentValue = contentInput.value.trim();

            if (titleValue === "" || contentValue === "") {
                messageBox.textContent = "Please fill in both the title and content fields.";
                messageBox.className = "message-box message-error";
                return; 
            } 

            try {
                const response = await fetch('/api/blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: titleValue, content: contentValue })
                });

                const result = await response.json();
                if (result.success) {
                    messageBox.textContent = "Success! Blog successfully posted.";
                    messageBox.className = "message-box message-success";
                    form.reset(); 
                }
            } catch (error) {
                messageBox.textContent = "Error connecting to the backend server.";
                messageBox.className = "message-box message-error";
            }
        });
    }

    // ==========================================
    // VIEW & EDIT BLOGS LOGIC (Days 7 & 8)
    // ==========================================
    const blogsContainer = document.getElementById("blogsContainer");

    if (blogsContainer) {
        
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/blogs');
                const result = await response.json();
                if (result.success) displayBlogs(result.data);
            } catch (error) {
                blogsContainer.innerHTML = '<p class="message-error">Error connecting to the server.</p>';
            }
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
                
                // We inject both a view state and a hidden edit state
                card.innerHTML = `
                    <!-- VIEW MODE -->
                    <div class="view-mode">
                        <h2>${blog.title}</h2>
                        <div class="blog-date">Posted on: ${blog.date}</div>
                        <div class="blog-content">${blog.content}</div>
                        <div class="card-actions">
                            <button class="btn-edit" data-id="${blog.id}">Edit Post</button>
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

        // Event Delegation for Edit, Save, and Cancel buttons
        blogsContainer.addEventListener('click', async (e) => {
            const btn = e.target;
            const blogId = btn.getAttribute('data-id');
            if (!blogId) return;

            const card = btn.closest('.blog-card');
            const viewMode = card.querySelector('.view-mode');
            const editMode = card.querySelector('.edit-mode');

            // Handle Edit Button Click
            if (btn.classList.contains('btn-edit')) {
                viewMode.style.display = 'none';
                editMode.style.display = 'block';
            }

            // Handle Cancel Button Click
            if (btn.classList.contains('btn-cancel')) {
                viewMode.style.display = 'block';
                editMode.style.display = 'none';
            }

            // Handle Save Button Click
            if (btn.classList.contains('btn-save')) {
                const updatedTitle = document.getElementById(`edit-title-${blogId}`).value.trim();
                const updatedContent = document.getElementById(`edit-content-${blogId}`).value.trim();

                if (!updatedTitle || !updatedContent) {
                    alert("Title and content cannot be empty.");
                    return;
                }

                // Send PUT request to the server
                try {
                    const response = await fetch(`/api/blogs/${blogId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: updatedTitle, content: updatedContent })
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        fetchBlogs(); // Re-render the UI with the updated data
                    }
                } catch (error) {
                    alert("Failed to update the blog post.");
                }
            }
        });

        fetchBlogs();
    }
});