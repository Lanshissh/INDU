const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

router.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/view.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signUp.html'));
});

router.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/cart.html'));
});

router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/contact.html'));
});

router.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/orders.html'));
});

router.get('/category', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/category.html'));
});

router.get('/adminLogin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/adminLogin.html'));
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/adminDashboard.html'));
});

router.get('/ViewUserOrders', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/adminOrders.html'));
});

router.get('/createCategory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/createCategory.html'));
});

router.get('/createProduct', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/createProduct.html'));
});

router.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/products.html'));
});

router.get('/updateCategory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/updateCategory.html'));
});

router.get('/updateProduct', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/updateProduct.html'));
});


module.exports = router;