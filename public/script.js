document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addBlogForm");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const messageBox = document.getElementById("messageBox");

    // Only run this logic if the form exists on the current page
    if (form) {
        form.addEventListener("submit", (e) => {
            // Prevent the page from hard reloading
            e.preventDefault(); 

            const titleValue = titleInput.value.trim();
            const contentValue = contentInput.value.trim();

            // Validation Logic
            if (titleValue === "" || contentValue === "") {
                // Show Error using DOM Manipulation
                messageBox.textContent = "Please fill in both the title and content fields.";
                messageBox.className = "message-box message-error";
            } else {
                // Show Success using DOM Manipulation
                messageBox.textContent = "Blog post validated successfully! (Ready for backend submission)";
                messageBox.className = "message-box message-success";
                
                // Clear the form fields for the next entry
                form.reset();
            }
        });
    }
});