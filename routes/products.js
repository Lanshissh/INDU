const express = require('express');
const multer = require('multer');
const router = express.Router();
const { db, storage } = require('../config');
const { collection, doc, setDoc, getCountFromServer, query, where, getDocs, addDoc, getDoc, deleteDoc} = require('firebase/firestore');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

// Initialize multer
const upload = multer({ storage: multer.memoryStorage() });
const productsRef = collection(db, 'products');




router.get('/', async (req, res, next) => {
    try
    {
        const querySnapshot = await getDocs(productsRef);
        const products = querySnapshot.docs.map(productDoc => ({
            productName: productDoc.data().productName,
            productPrice: productDoc.data().productPrice,
            productDesc: productDoc.data().productDesc,
            imageUrl: productDoc.data().imageUrl,
            productId: productDoc.id,
            categoryId: productDoc.data().categoryId
        }))
        
        res.json(products);

    }
    catch(error)
    {
        res.status(500).send({error: 'Encountered an error in fetching all products.'});
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const params = req.params;

        const docRef = doc(productsRef, params.id);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const product = {
                productName: docSnap.data().productName,
                productPrice: docSnap.data().productPrice,
                productDesc: docSnap.data().productDesc,
                imageUrl: docSnap.data().imageUrl,
                productId: docSnap.id,
                categoryId: docSnap.data().categoryId
            };

            res.json(product);
        } else 
        {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Encountered an error in fetching the product.' });
    }
});




router.post('/', upload.single('productImage'), async (req, res, next) => {
    try {
        const productName = req.body.productName;
        const file = req.file;
        const productDesc = req.body.productDescription;
        const productPrice = req.body.productPrice;
        const categoryName = req.body.categoryName;

        if (!file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        // Check if the product name already exists
        const productQuery = query(collection(db, 'products'), where('productName', '==', productName));
        const productSnapshot = await getDocs(productQuery);

        if (!productSnapshot.empty) {
            return res.status(400).redirect('/admin');
          
        }

        // Upload the image to Firebase storage
        const storageRef = ref(storage, `images/${file.originalname}`);
        await uploadBytes(storageRef, file.buffer);
        const imageUrl = await getDownloadURL(storageRef);

        // Retrieve the matching category doc's id based on its name
        const categoryQuery = query(collection(db, 'categories'), where('categoryName', '==', categoryName));
        const categorySnapshot = await getDocs(categoryQuery);

        if (categorySnapshot.empty) {
            return res.status(400).send({ error: 'Category not found' });
        }

        const categoryDoc = categorySnapshot.docs[0];
        const categoryId = categoryDoc.id; // Get the category ID

        const data = {
            productName,
            imageUrl,
            productDesc,
            productPrice,
            categoryId
        };

        await addDoc(productsRef, data);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error adding product' });
    }
});


router.put('/:id', upload.single('productImage'), async (req, res, next) => {
    try {
        const { id } = req.params;

        // Reference to the product document
        const productDocRef = doc(productsRef, id);

        // Get the product document to check if it exists
        const productDoc = await getDoc(productDocRef);

        if (!productDoc.exists()) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Get the updated product data from the request body
        const updatedProductName = req.body.productName;
        const updatedProductDesc = req.body.productDescription;
        const updatedProductPrice = req.body.productPrice;
        const updatedCategoryName = req.body.categoryName;
        let updatedImageUrl = productDoc.data().imageUrl; // Keep the existing image URL by default

        // If a new file (product image) is uploaded, upload the new image to Firebase Storage
        const file = req.file;
        if (file) {
            // Upload the new image to Firebase Storage
            const storageRef = ref(storage, `images/${file.originalname}`);
            await uploadBytes(storageRef, file.buffer);
            updatedImageUrl = await getDownloadURL(storageRef); // Get the new image URL
        }

        // Retrieve the matching category doc's ID based on its name (if category is updated)
        let updatedCategoryId = productDoc.data().categoryId; // Keep the existing category by default
        if (updatedCategoryName) {
            const categoryQuery = query(collection(db, 'categories'), where('categoryName', '==', updatedCategoryName));
            const categorySnapshot = await getDocs(categoryQuery);

            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                updatedCategoryId = categoryDoc.id;
            } else {
                return res.status(400).send({ error: 'Category not found' });
            }
        }

        // Create the updated product data object
        const updatedData = {
            productName: updatedProductName || productDoc.data().productName,
            productDesc: updatedProductDesc || productDoc.data().productDesc,
            productPrice: updatedProductPrice || productDoc.data().productPrice,
            imageUrl: updatedImageUrl,
            categoryId: updatedCategoryId
        };

        // Update the product document in Firestore
        await setDoc(productDocRef, updatedData, { merge: true }); // Merge updates with the existing document

        res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ error: 'Encountered an error while updating the product.' });
    }
});


// DELETE route to delete a product by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Reference to the product document
        const productDocRef = doc(productsRef, id);

        // Get the product document to check if it exists
        const productDoc = await getDoc(productDocRef);

        if (!productDoc.exists()) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Optionally: Delete the associated image from Firebase Storage
        const imageUrl = productDoc.data().imageUrl;
        if (imageUrl) {
            const storageRef = ref(storage, imageUrl); // Assuming imageUrl is a valid path in Firebase Storage
            await deleteObject(storageRef); // Delete the image from Firebase Storage
        }

        // Delete the product document from Firestore
        await deleteDoc(productDocRef); // Use deleteDoc function here

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: 'Encountered an error while deleting the product.' });
    }
});


module.exports = router;
