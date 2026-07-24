document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // DAY 4 & 5: ADD BLOG LOGIC
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
                    messageBox.textContent = "Success! Blog successfully posted to the backend API.";
                    messageBox.className = "message-box message-success";
                    form.reset(); 
                } else {
                    throw new Error("Server rejected the data");
                }
            } catch (error) {
                messageBox.textContent = "Error connecting to the backend server.";
                messageBox.className = "message-box message-error";
            }
        });
    }

    // ==========================================
    // DAY 7: VIEW BLOGS LOGIC (Home Page)
    // ==========================================
    const blogsContainer = document.getElementById("blogsContainer");

    // Only run if we are on the Home page where this container exists
    if (blogsContainer) {
        
        const fetchBlogs = async () => {
            try {
                // Fetch the data from our Express API
                const response = await fetch('/api/blogs');
                const result = await response.json();

                if (result.success) {
                    displayBlogs(result.data);
                } else {
                    blogsContainer.innerHTML = '<p class="message-error">Failed to load blogs.</p>';
                }
            } catch (error) {
                blogsContainer.innerHTML = '<p class="message-error">Error connecting to the server.</p>';
            }
        };

        const displayBlogs = (blogs) => {
            blogsContainer.innerHTML = ""; // Clear the "Loading..." text

            if (blogs.length === 0) {
                blogsContainer.innerHTML = "<p>No blog posts yet. Go to 'Add Blog' to create one!</p>";
                return;
            }

            // Loop through the array and create a card for each blog
            blogs.forEach(blog => {
                const card = document.createElement("div");
                card.className = "blog-card";
                
                card.innerHTML = `
                    <h2>${blog.title}</h2>
                    <div class="blog-date">Posted on: ${blog.date}</div>
                    <div class="blog-content">${blog.content}</div>
                `;
                
                blogsContainer.appendChild(card);
            });
        };

        // Execute the fetch when the page loads
        fetchBlogs();
    }
});