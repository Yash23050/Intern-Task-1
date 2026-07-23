document.addEventListener("DOMContentLoaded", () => {
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
                return; // Stop execution
            } 

            try {
                // Send the validated data to our new Express POST route
                const response = await fetch('/api/blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: titleValue, content: contentValue })
                });

                const result = await response.json();

                if (result.success) {
                    messageBox.textContent = "Success! Blog successfully posted to the backend API.";
                    messageBox.className = "message-box message-success";
                    form.reset(); // Clear the inputs
                } else {
                    throw new Error("Server rejected the data");
                }
            } catch (error) {
                messageBox.textContent = "Error connecting to the backend server.";
                messageBox.className = "message-box message-error";
            }
        });
    }
});