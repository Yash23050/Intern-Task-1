const express = require('express');
const path = require('path');
const blogs = require('./data.js');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON data from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// --- API ROUTES ---

// GET Route: Send all blogs to the frontend
app.get('/api/blogs', (req, res) => {
    res.json({ success: true, data: blogs });
});

// POST Route: Receive a new blog from the frontend
app.post('/api/blogs', (req, res) => {
    const { title, content } = req.body;
    
    // Server-side validation
    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Create a new blog object and push it to our array
    const newBlog = { 
        id: Date.now(), 
        title, 
        content, 
        date: new Date().toLocaleDateString() 
    };
    blogs.push(newBlog);
    
    // Terminal Logging
    console.log('\n--- New Blog Received via POST Route ---');
    console.log(newBlog);
    
    res.status(201).json({ success: true, message: 'Blog added successfully!', data: newBlog });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server actively listening on port ${port}`);
    console.log(`GET and POST routes are ready at /api/blogs`);
});