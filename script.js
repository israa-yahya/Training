document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch blogs data and display them
    function fetchAndDisplayBlogs() {
        fetch('http://localhost:3000/blogs')
            .then(response => response.json())
            .then(data => {
                const blogList = document.getElementById('blogList');
                blogList.innerHTML = ''; // Clear existing content

                // Iterate through each blog and display it
                data.forEach(blog => {
                    const blogItem = createBlogItem(blog);
                    blogList.appendChild(blogItem);
                });
            })
            .catch(error => console.error('Error fetching blogs:', error));
    }

    // Function to create a blog item
    function createBlogItem(blog) {
        const blogItem = document.createElement('div');
        blogItem.classList.add('blog-item');

        const titleElement = document.createElement('h2');
        titleElement.textContent = blog.title;

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = blog.description;

        // Create a delete icon
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
        deleteIcon.setAttribute('data-id', blog.id);
        deleteIcon.style.cursor = 'pointer';

        // Add event listener to delete the blog when the delete icon is clicked
        deleteIcon.addEventListener('click', function () {
            const blogId = this.getAttribute('data-id');
            deleteBlog(blogId);
        });

        blogItem.appendChild(deleteIcon);
        blogItem.appendChild(titleElement);
        blogItem.appendChild(descriptionElement);

        return blogItem;
    }

    // Function to delete a blog
    function deleteBlog(id) {
        fetch(`http://localhost:3000/blogs/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchAndDisplayBlogs(); // Refresh the displayed blogs
            } else {
                throw new Error('Failed to delete blog');
            }
        })
        .catch(error => console.error('Error deleting blog:', error));
    }

    // Function to handle form submission for posting new blogs
    document.getElementById('postForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const title = document.getElementById('Title').value;
        const description = document.getElementById('Description').value;

        // Validation checks
        if (title.trim() === '' || description.trim() === '') {
            alert('Please enter both title and description.');
            return;
        }

        // Check if description exceeds 500 characters
        if (description.length > 500) {
            alert('Description should not exceed 500 characters.');
            return;
        }

        // Create new blog object
        const newBlog = {
            title: title,
            description: description
        };

        // Send POST request to add new blog
        fetch('http://localhost:3000/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBlog)
        })
        .then(response => {
            if (response.ok) {
                fetchAndDisplayBlogs(); // Refresh the displayed blogs
                // Reset form fields
                document.getElementById('Title').value = '';
                document.getElementById('Description').value = '';
            } else {
                throw new Error('Failed to add new blog');
            }
        })
        .catch(error => console.error('Error adding new blog:', error));
    });

    // Fetch and display blogs when the page loads
    fetchAndDisplayBlogs();
});

// Toggle menu function
function toggleMenu() {
    const navbarContent = document.getElementById('navbarContent');
    navbarContent.classList.toggle('show-menu');
}
