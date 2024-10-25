const express = require('express');
const router = express.Router();
const { db } = require('../config');
const {
    collection,
    doc,
    getDocs,
    addDoc,
    query,
    where,
    deleteDoc,
    updateDoc
} = require('firebase/firestore');

const categoriesRef = collection(db, 'categories');
const productsRef = collection(db, 'products');

// Route to retrieve all categories
router.get('/', async (req, res, next) => {
    try {
        const querySnapshot = await getDocs(categoriesRef);
        const categories = querySnapshot.docs.map(categoryDoc => ({
            name: categoryDoc.data().categoryName,
            id: categoryDoc.id
        }));
        res.json(categories);
    } catch (error) {
        res.status(500).send({ error: 'Encountered an error in fetching all categories.' });
    }
});

// Route to retrieve all products by category ID
router.get('/:categoryId', async (req, res, next) => {
    try {
        const params = req.params;
        const q = query(productsRef, where('categoryId', '==', params.categoryId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const filteredProducts = querySnapshot.docs.map(doc => ({
                productName: doc.data().productName,
                productPrice: doc.data().productPrice,
                productDesc: doc.data().productDesc,
                imageUrl: doc.data().imageUrl,
                productId: doc.id, // Include the document ID if needed
            }));

            res.json(filteredProducts); // Send the response back
        } else {
            res.status(404).json({ message: 'Products not found.' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Encountered an error in fetching the product.' });
    }
});

// Delete category and associated products
router.delete('/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params; // Extract categoryId from request parameters

    try {
        // Reference to the category document
        const categoryRef = doc(categoriesRef, categoryId);

        // Delete the category document
        await deleteDoc(categoryRef);

        // Optionally, delete all products associated with the category
        const productsQuery = query(productsRef, where('categoryId', '==', categoryId));
        const productsSnapshot = await getDocs(productsQuery);

        // Delete each product associated with the category
        const deletePromises = productsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        res.status(200).json({ message: 'Category and associated products deleted successfully.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send({ error: 'Encountered an error while deleting the category.' });
    }
});

// Single POST route to add a category
router.post('/', async (req, res, next) => {
    try {
        const categoryName = req.body.categoryName;

        // Check if the category name already exists
        const categoryQuery = query(categoriesRef, where('categoryName', '==', categoryName));
        const categorySnapshot = await getDocs(categoryQuery);

        if (!categorySnapshot.empty) {
            // Redirect to /admin with an error message in the query string
            return res.redirect('/admin');
        }

        const data = {
            categoryName
        };

        await addDoc(categoriesRef, data);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error adding category' });
    }
});

router.put('/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params; // Extract categoryId from request parameters
    const newCategoryName = req.body.categoryName; // Get the new category name from the request body

    try {
        // Check if the new category name already exists (excluding the current category)
        const categoryQuery = query(
            categoriesRef,
            where('categoryName', '==', newCategoryName)
        );
        const categorySnapshot = await getDocs(categoryQuery);

        // If a category with the new name exists and it's not the same as the current one, redirect
        if (!categorySnapshot.empty) {
            return res.redirect('/admin');
        }

        // Reference to the category document
        const categoryRef = doc(categoriesRef, categoryId);

        // Update the category name
        await updateDoc(categoryRef, { categoryName: newCategoryName });

        res.status(200).json({ message: 'Category updated successfully.' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send({ error: 'Encountered an error while updating the category.' });
    }
});

module.exports = router;
