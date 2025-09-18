// Import the Express library
// Express helps us create a server easily with routes (like /users, /products, etc.)
express = require('express')

// Create an Express app (our server)
const app = express()


// Fake "database" in memory
// For now, instead of using a real database like MySQL or MongoDB,
// we just store data in this object
const db = {
    users: [
        {
            id: 1,
            username: 'meriem'
        },
        {
            id: 2,
            username: 'maria'
        }
    ]
}


// Middleware: allows our app to understand JSON data in requests
// Example: when a client sends { "id": 3, "username": "ahmed" }, Express can read it
app.use(express.json())


// -------------------- ROUTES --------------------

// 1. GET all users
// When someone visits GET http://localhost:3000/users
// we return the list of users
app.get('/users',(req,res)=>{
    res.json(db.users)
})


// 2. GET a single user by ID
// Example: GET http://localhost:3000/users/1
// req.params.id → gets the "id" from the URL
app.get('/users/:id',(req,res)=>{
    const id = req.params.id
    // Find the user in our "db" with the matching id
    const user = db.users.find(u => u.id == id)
    
    // If no user found, send back a 404 error
    if(!user) return res.status(404).json({error: 'user not found'})
    
    // If user found, send it as JSON
    res.json(user)
})


// 3. POST a new user
// Example: POST http://localhost:3000/users
// with body: { "id": 3, "username": "ahmed" }
app.post('/users',(req,res)=>{
    const user = req.body // Get the new user data from request body
    console.log(user)     // Log it to the terminal (for debugging)
    
    db.users.push(user)   // Add the new user to our "db"
    
    // Send back a success message with status code 201 (Created)
    res.status(201).send('User created successfully!')
})


// 4. PATCH (update partially) a user by ID
// Example: PATCH http://localhost:3000/users/1
// with body: { "username": "newname" }
app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id) // Convert id to number
    const updates = req.body           // Get the fields to update

    // Find the index of the user in the array
    const index = db.users.findIndex(u => u.id === id)

    // If no user found, return error
    if (index === -1) {
        return res.status(404).json({ error: "User not found" })
    }

    // Update only the fields that were sent in the request body
    db.users[index] = { ...db.users[index], ...updates }

    // Return success message and updated user
    res.status(200).json({ message: "User patched successfully!", user: db.users[index] })
})


// 5. DELETE a user by ID
// Example: DELETE http://localhost:3000/users/2
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // Find the index of the user
    const index = db.users.findIndex(u => u.id === id)

    // If no user found, return error
    if (index === -1) {
        return res.status(404).json({ error: "User not found" })
    }

    // Remove the user from the array (splice deletes by index)
    const deletedUser = db.users.splice(index, 1)

    // Return success and the deleted user info
    res.status(200).json({ message: "User deleted successfully!", user: deletedUser[0] })
})


// -------------------- ERROR HANDLING --------------------

// Catch-all route for unknown paths
// If someone goes to a route we didn’t define, return 404
app.use((req,res)=>{
    res.status(404).json('Not Found')
})


// -------------------- START SERVER --------------------

// Start the app on port 3000
// "Port" is like a door for communication between programs on your machine
app.listen(3000,()=>{
    console.log('listening on port 3000...')
})
