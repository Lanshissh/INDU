document.addEventListener('DOMContentLoaded', function () 
{
    function getQueryParam(param) 
    {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the categoryId from the URL
    const categoryId = getQueryParam('categoryId');
    console.log(categoryId);

    // Form submission handler
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent form from submitting the default way

        // Get the category name from the input field
        const categoryName = document.querySelector('#categoryName').value;
        console.log(categoryId);

        try 
        {
            // Send a PUT request to update the category
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryName }), // Send the updated category name
            });

            // Check if the update was successful
            if (response.ok) {
                window.location.href = '/admin'; // Redirect to admin page after successful update
            } else {
                const errorData = await response.json();
                alert(`Error updating category: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Category already exists.')
        }
    });
});
