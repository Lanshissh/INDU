const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { collection, doc, updateDoc, deleteDoc, getDocs, addDoc, query, orderBy } = require('firebase/firestore');


router.get('/', async (req, res) => {
    const userId = req.session.userId; // Assume the user is logged in and session holds userId
    console.log(userId);

    if (!userId) {
        return res.status(403).json({ error: 'User not logged in' });
    }

    try {
        // Reference to the user's orders sub-collection
        const ordersRef = collection(db, 'customers', userId, 'orders');
        
        // Query the documents by orderDate, ordering them
        const ordersQuery = query(ordersRef, orderBy('orderDate', 'desc')); // 'desc' for newest orders first

        const ordersSnapshot = await getDocs(ordersQuery);

        // Check if the orders sub-collection is empty
        if (ordersSnapshot.empty) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Map through the order documents and retrieve their data
        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id, // Include the order document ID
            ...doc.data() // Spread the order data
        }));

        res.status(200).json({ orders }); // Respond with the list of orders

    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






router.post('/checkout', async (req, res) => 
{
    const userId = req.session.userId; // Assume the user is logged in and session holds userId

    if (!userId) 
    {
        return res.status(403).json({ error: 'User not logged in' });
    }

    try 
    {
        // Retrieve the cart items for the user
        const userCartRef = collection(db, 'customers', userId, 'cart');
        const cartSnapshot = await getDocs(userCartRef);

        if (cartSnapshot.empty) 
        {
            return res.status(400).json({ error: 'No items in cart to checkout' });
        }


        const cartItems = cartSnapshot.docs.map(doc => ({
            productName: doc.data().productName,
            productPrice: doc.data().productPrice,
            quantity: doc.data().quantity,
            productImg: doc.data().productImg
        }));

        // Compute total price
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.productPrice * item.quantity);
        }, 0);

        // Create a new order in the orders sub-collection
        const ordersRef = collection(db, 'customers', userId, 'orders');
        const newOrder = 
        {
            items: cartItems,
            totalPrice: totalPrice,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };
        await addDoc(ordersRef, newOrder);

        // maps over each document in the cart snapshot, creating an array of promises from deleteDoc(doc.ref). Promise.all waits for all these delete operations to complete before proceeding to delete the cart sub-collection.
        await Promise.all(cartSnapshot.docs.map(doc => deleteDoc(doc.ref)));

        res.status(200).json({ message: 'Checkout successful', order: newOrder });
    } 
    catch (error) 
    {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;