const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { collection, doc, updateDoc, deleteDoc, getDocs, addDoc, query, where } = require('firebase/firestore');

// Reference to the carts collection
const cartsRef = collection(db, 'carts');

// Retrieve all cart items for the logged-in user and compute total price
router.get('/', async (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session

    if (!userId) {
        return res.status(403).json({ error: 'User not logged in. Please log in to view your cart.' });
    }

    try {
        const userCartRef = collection(db, 'customers', userId, 'cart'); // Reference to the user's cart sub-collection
        const querySnapshot = await getDocs(userCartRef); 

        const cartItems = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Compute total price
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.productPrice * item.quantity); 
        }, 0);

        res.status(200).json({ cartItems, totalPrice }); 
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/createItem', async (req, res) => {
    const { productName, productPrice, productDesc, productImg, quantity } = req.body;

    const userId = req.session.userId; // Get the user ID from the session

    if (!userId) {
        return res.status(403).json({ error: 'User not logged in. Please log in to add items to your cart.' });
    }

    const priceAsNumber = parseFloat(productPrice);
    const quantityAsNumber = parseInt(quantity, 10);

    try {
        const userCartRef = collection(db, 'customers', userId, 'cart');

        // Check if the item already exists in the cart
        const querySnapshot = await getDocs(query(userCartRef, where('productName', '==', productName)));

        if (!querySnapshot.empty) {
            // Item already exists, update the quantity
            const existingItemDoc = querySnapshot.docs[0];
            const existingItemData = existingItemDoc.data();

            // Update the quantity of the existing item
            const newQuantity = existingItemData.quantity + quantityAsNumber; 
            await updateDoc(existingItemDoc.ref, { quantity: newQuantity });

            return res.status(200).json({ id: existingItemDoc.id, ...existingItemData, quantity: newQuantity });
        }

        // If the item does not exist, create a new entry
        const cartItem = {
            productName,
            productPrice: priceAsNumber, 
            productDesc,
            productImg,
            quantity: quantityAsNumber, 
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(userCartRef, cartItem);
        res.status(201).json({ id: docRef.id, ...cartItem });
    } catch (error) {
        console.error('Error adding item to user cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update quantity of a specific cart item by ID
router.put('/updateQuantity/:id', async (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session
    const { id } = req.params;
    const { quantity } = req.body;

    if (!userId) {
        return res.status(403).json({ error: 'User not logged in. Please log in to update your cart.' });
    }

    const quantityAsNumber = parseInt(quantity, 10);

    try {
        const cartItemRef = doc(db, 'customers', userId, 'cart', id);
        await updateDoc(cartItemRef, { quantity: quantityAsNumber });

        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a specific cart item by ID
router.delete('/deleteItem/:id', async (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session
    const { id } = req.params;

    if (!userId) {
        return res.status(403).json({ error: 'User not logged in. Please log in to remove items from your cart.' });
    }

    try {
        const cartItemRef = doc(db, 'customers', userId, 'cart', id);
        await deleteDoc(cartItemRef);

        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
