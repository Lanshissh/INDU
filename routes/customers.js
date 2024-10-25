const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { collection, doc, getDocs, query, where, orderBy } = require('firebase/firestore');

const customersRef = collection(db, 'customers');

const isAdminAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Admin not logged in.' });
    }
};

// Route to get all customers from Firestore 
router.get('/', isAdminAuthenticated, async (req, res, next) => {
    try {
        const querySnapshot = await getDocs(customersRef);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No customers found.' });
        }

        const customers = querySnapshot.docs.map(customer => ({
            username: customer.data().username,
            id: customer.id,
            email: customer.data().email,
        }));
        res.json(customers);
    } catch (error) {
        res.status(500).send({ error: 'Encountered an error in fetching all customers.' });
    }
});

// Route to get a specific customer's orders by ID (requires admin authentication)
router.get('/orders/:id', isAdminAuthenticated, async (req, res, next) => {
    try {
        const customerId = req.params.id;
        const customerDocRef = doc(db, 'customers', customerId);
        const ordersRef = collection(customerDocRef, 'orders');

        // Fetch orders and order by 'orderDate'
        const ordersQuery = query(ordersRef, orderBy('orderDate', 'desc')); // Orders by 'orderDate' in descending order
        const querySnapshot = await getDocs(ordersQuery);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No orders found for this customer.' });
        }

        // Map over the orders and return relevant fields
        const orders = querySnapshot.docs.map(order => ({
            orderId: order.id,
            orderDate: order.data().orderDate,
            items: order.data().items, // assuming 'items' is an array in the order
            totalPrice: order.data().totalPrice,
            status: order.data().status,
        }));

        res.json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).send({ error: 'Encountered an error in fetching customer orders.' });
    }
});

module.exports = router;
