const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// Creating a JWT
const secretKey = "I am a secret and hard to guess";

//Registered Users e.g Database
const users = [
  {
    username: "John",
    email: "john@example.com",
    password: "12345",
    user_id: 1,
  },
  {
    username: "Mark",
    email: "mark@example.com",
    password: "simple",
    user_id: 2,
  },
  {
    username: "Mark",
    email: "mark@example.com",
    password: "simple",
    user_id: 2,
  },
];

app.post("/login", (req, res) => {
  // Authenticate User
  const { email, username, password } = req.body;
  console.log(email, password);
  //check if user exists
  const user = users.find((user) => user.email === email);
  if (!user) return res.status(400).send({ message: "User not found" });
  //check if password is correct
  if (user.password !== password)
    return res.status(400).send({ message: "Invalid password" });
  // Create JWT Payload
  const payload = {
    email: user.email,
    username: user.username,
    user_id: user.user_id,
  };
  // Sign the JWT token and populate the payload with the user email and id
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });
  console.log(token);
  res.json({ token }); //send back to client
});

// Protecting Routes
app.get("/users", (req, res) => {
  // Get the token from the header
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
  }
  // If no token found, return error
  if (!token) return res.status(401).send("Access denied. No token provided.");
  // If token found, verify it
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
  } catch (ex) {
    // If invalid token
    res.status(400).send("Invalid token.");
  }
  // If everything is good, return the response

  res.json(users);
});

app.listen(3000, () => console.log("Server running on port 3000"));
