document.addEventListener('DOMContentLoaded', function () 
{
    const categoriesGrid = document.querySelector('.row.grid.cat'); // Select the grid for categories

    // Function to fetch all categories
    async function fetchCategories() 
    {
        try {
            const response = await fetch('/api/categories/'); // Adjust the URL if necessary
            if (!response.ok) 
            {
                throw new Error('Failed to fetch categories');
            }

            const categories = await response.json();
            console.log(categories);
            populateCategoriesGrid(categories);
        } 
        catch (error) 
        {
            console.error('Error fetching categories:', error);
            alert('Failed to fetch category data. Please try again later.');
        }
    }

    // Function to populate the categories grid with category data
    function populateCategoriesGrid(categories) 
    {
        categoriesGrid.innerHTML = ''; // Clear the grid

        categories.forEach(category => 
        {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-item', 'col-lg-4', 'col-md-6', 'col-sm-12'); // Bootstrap classes for layout

            // Create content for the category card
            categoryCard.innerHTML = `
                <div class="category">
                    <div class="category-content">
                        <h4>${category.name}</h4>
                        <button class="btn btn-danger delete-category-btn" data-category-id="${category.id}">Delete</button>
                        <button class="btn btn-primary update-category-btn" data-category-id="${category.id}">Update Name</button>
                    </div>
                </div>
            `;

            categoriesGrid.appendChild(categoryCard); // Add the card to the grid
        });

        // Attach event listeners to the delete and update buttons after populating categories
        attachDeleteCategoryListeners();
        attachUpdateCategoryListeners();
    }

    // Function to attach event listeners to delete buttons
    function attachDeleteCategoryListeners() 
    {
        const deleteButtons = document.querySelectorAll('.delete-category-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function () 
            {
                const categoryId = this.getAttribute('data-category-id'); // Get the category ID from data attribute
                console.log(`Attempting to delete category with ID: ${categoryId}`); // Log ID for debugging

                try 
                {   //fetch the delete endpoint to delete category by ID
                    const response = await fetch(`/api/categories/${categoryId}`, 
                    {
                        method: 'DELETE',
                    });

                    console.log('Response status:', response.status); // Log response status for debugging
                    if (!response.ok) 
                    {
                        throw new Error('Failed to delete category');
                    }

                    window.location.href = '/admin'; // Redirect to admin page
                } 
                catch (error) 
                {
                    console.error('Error deleting category:', error);
                    alert('Failed to delete category. Please try again later.');
                }
            });
        });
    }

    // Function to attach event listeners to update buttons
    function attachUpdateCategoryListeners() 
    {
        const updateButtons = document.querySelectorAll('.update-category-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', function () {
                const categoryId = this.getAttribute('data-category-id'); // Get the category ID from data attribute
                // Redirect to the update page with the categoryId as a query parameter
                window.location.href = `/updateCategory?categoryId=${categoryId}`;
            });
        });
    }

    // Initial fetch for categories when the page loads
    fetchCategories();
});
