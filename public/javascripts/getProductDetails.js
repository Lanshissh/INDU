const displayProductDetails = async () => {
    const params = new URLSearchParams(window.location.search);
    try
    {
        const productId = params.get('id');

        if (!productId)
        {
            console.log('Product id not found.')
        }

        const res = await fetch(`/api/products/${productId}`);

        const product = await res.json();

        const nameContainer = document.querySelector('.product-name');
        const priceContainer = document.querySelector('.product-price');
        const imageContainer = document.querySelector('a img');
        const descriptionContainer = document.querySelector('.product-desc');

        nameContainer.textContent = product.productName;
        priceContainer.textContent = product.productPrice;
        imageContainer.src = product.imageUrl;
        descriptionContainer.textContent = product.productDesc;


    }
    catch(error)
    {
        console.log(`Encountered an error in fetching product details ${error}`);
    }


}



document.addEventListener('DOMContentLoaded', () => {
    displayProductDetails();
})