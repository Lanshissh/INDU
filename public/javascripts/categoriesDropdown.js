const fetchCategoriesLinks = async () => {
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();
        console.log(categories);
        const dropdownMenu = document.querySelector('.dropdown-menu');

        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.className = 'dropdown-item';
            categoryLink.href = `#`; // Use "#" to prevent default link behavior initially
            
            // Add an event listener to handle the redirection
            categoryLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                window.location.href = `/category?categoryId=${category.id}`; // Redirect to the category page
            });

            categoryLink.textContent = category.name; // Set the display name
            dropdownMenu.appendChild(categoryLink); // Add the link to the dropdown menu
        });
    } catch (error) {
        console.log('Error in fetching categories', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchCategoriesLinks(); // Call the function to populate the dropdown
});
