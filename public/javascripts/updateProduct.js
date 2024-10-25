    // Function to retrieve a specific query parameter
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the productId from the URL
    const productId = getQueryParam('id'); // Ensure the parameter name matches
    console.log(productId); // Log the productId for debugging

    // Function to update the product
    async function updateProduct(event) {
        event.preventDefault(); // Prevent default form submission

        const form = document.getElementById('updateProductForm');
        const formData = new FormData(form); // Collect form data

        try {
            console.log(productId); // Log the productId for debugging
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT', // Use PUT for updates
                body: formData
            });

            if (response.ok) {
                console.log('Product updated successfully.');
                window.location.href = '/admin'; // Redirect to the admin page after successful update
            } else {
                alert('Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    // Add event listener to the form
    const form = document.getElementById('updateProductForm');
    form.addEventListener('submit', updateProduct);

