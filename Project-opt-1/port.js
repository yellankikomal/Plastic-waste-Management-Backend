// const express = require('express');
// const path = require("path");
// const collection = require("./config");
// const bcrypt = require('bcrypt');

// const app = express();

// // Static file
// // app.use(express.static("public"));

// app.use(express.urlencoded({ extended: false }));

// app.get("/Login.html", (req, res) => {
//     res.sendFile(path.join(__dirname, 'Login.html'));
// });

// app.get("/SignUp.html", (req, res) => {
//     res.sendFile(path.join(__dirname, 'SignUp.html'));
// });

// // Register User
// app.post("/SignUp.html", async (req, res) => {
//     const data = {
//         name: req.body.username,
//         password: req.body.password
//     }

//     // Check if the username already exists in the database
//     const existingUser = await collection.findOne({ name: data.name });

//     if (existingUser) {
//         res.send('User already exists. Please choose a different username.');
//     } else {
//         // Hash the password using bcrypt
//         const saltRounds = 10; // Number of salt rounds for bcrypt
//         const hashedPassword = await bcrypt.hash(data.password, saltRounds);

//         data.password = hashedPassword; // Replace the original password with the hashed one

//         const userdata = await collection.insertMany(data);
//         console.log(userdata);
//     }
// });

// // Login user 
// app.post("/Login.html", async (req, res) => {
//     try {
//         const check = await collection.findOne({ name: req.body.username });
//         if (!check) {
//             res.send("User name cannot found")
//         }
//         // Compare the hashed password from the database with the plaintext password
//         const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//         if (!isPasswordMatch) {
//             res.send("wrong Password");
//         } else {
//             res.sendFile(path.join(__dirname, 'public', 'index.html'));
//         }
//     } catch {
//         res.send("wrong Details");
//     }
// });

// // Define Port for Application
// const port = 7500;
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`)
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/myLogin', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});


const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String
});


const User = mongoose.model('User', userSchema);


app.post('/SignUp.html', (req, res) => {
  const { fullname, email, password } = req.body;

  const newUser = new User({
    fullname,
    email,
    password
  });

  newUser.save((err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to sign up' });
    } else {
      console.log('User signed up successfully');
      res.redirect('/Login.html'); 
    }
  });
});


app.post('/Login.html', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email, password: password }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      console.log('User logged in successfully');
      res.redirect('/index.html'); 
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

