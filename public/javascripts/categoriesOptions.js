const fetchCategories = async () => {
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();
        const categorySelect = document.querySelector('#category');

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name; 
            option.textContent = category.name; 
            console.log(option.value);
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.log('Error in fetching categories', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
});
