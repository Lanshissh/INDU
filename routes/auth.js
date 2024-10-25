// routes/auth.js
const express = require('express');
const router = express.Router();
const { db } = require('../config'); // Import Firestore
const bcrypt = require('bcrypt'); // For hashing passwords
 // For session management
const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');

// Initialize express-session middleware


// Reference to the customers collection
const usersRef = collection(db, 'customers');

// Signup Route
router.post('/signUp', async (req, res) => {
  const { username, email, password, confPassword } = req.body;

 
  if (password !== confPassword) 
  {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try 
  {
    // Check if the email already exists in the 'customers' collection
    const emailQuerySnapshot = await getDocs(query(usersRef, where('email', '==', email)));
    if (!emailQuerySnapshot.empty) 
    {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if the username already exists in the 'customers' collection
    const usernameQuerySnapshot = await getDocs(query(usersRef, where('username', '==', username)));
    if (!usernameQuerySnapshot.empty) 
    {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in Firestore with an auto-generated ID
    const userData = 
    {
      email: email,
      password: hashedPassword, // Store hashed password
      username: username,
    };

    // Use addDoc to create a new user document with auto-generated ID
    await addDoc(usersRef, userData);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) 
  {
    res.status(400).json({ error: error.message });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log({ email, password });

  try {
    // Retrieve user from Firestore using a compound query lol
    const userQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);
    const userDoc = querySnapshot.docs[0]; // Get the first matching document

    if (!userDoc) 
    {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const userData = userDoc.data();

    // Compare hashed password using bcrypt!!
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user info in session
    req.session.userId = userDoc.id; // Store the user ID in the session
    // req.session.userName = userDoc.userName;

    console.log(` session id: ${req.session.userId}`);
    // console.log(` Username: ${req.session.userName}`);

    res.status(200).redirect('/');
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});


router.post('/logout', (req, res) => {
    // Destroy the session to log the user out
    console.log(req.session.userId);
    req.session.destroy((err) => 
        {
      if (err) 
        {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  });

  router.get('/checkUserStatus', (req, res) => {
    if (req.session.userId) {
      res.json({ isLoggedIn: true, userId: req.session.userId });
    } else {
      res.json({ isLoggedIn: false });
    }
  });

module.exports = router;
