const express = require('express');
const router = express.Router();
const { db } = require('../config'); // Import Firestore
const bcrypt = require('bcrypt'); // For hashing passwords
const { collection, query, where, getDocs, addDoc } = require('firebase/firestore');

// Reference to the 'admins' collection
const adminRef = collection(db, 'admins');

// Admin Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log({ username, password });

  try {
    // Query to find the admin based on username
    console.log(username);
    const adminQuery = query(adminRef, where('username', '==', username));
    const querySnapshot = await getDocs(adminQuery);
    const adminDoc = querySnapshot.docs[0]; // Get the first matching document

    if (!adminDoc) {
      return res.status(401).json({ error: 'Incorrect username or password.' });
    }

    const adminData = adminDoc.data();

    // Compare the hashed password using bcrypt
    console.log(adminData.password);
    const isPasswordValid = await bcrypt.compare(password, adminData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store admin info in session
    req.session.adminId = adminDoc.id; // Store the admin ID in the session
    req.session.adminUsername = adminData.username;

    console.log(`Session Admin ID: ${req.session.adminId}`);
    console.log(`Admin Username: ${req.session.adminUsername}`);

    res.status(200).json({ message: 'Successful admin login'}); // Redirect to admin dashboard after login
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});




// Admin Logout Route
router.post('/logout', (req, res) => {
  // Destroy the session to log the admin out
  console.log(`Logging out admin with session ID: ${req.session.adminId}`);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Check Admin Status (whether logged in or not)
router.get('/checkAdminStatus', (req, res) => {
  if (req.session.adminId) {
    res.json({ isLoggedIn: true, adminId: req.session.adminId });
  } else {
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;
