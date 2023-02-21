//require express from express
const express = require('express')
//Require cors from cors
const cors = require('cors')
//Require uuid
const { v4: uuidv4 } = require('uuid');
const pool = require('./db')
const app = express()
const port = process.env.PORT || 5000
//use cors with app
app.use(cors())

//User Express
app.use(express.json())

app.get('/users', async (req, res) => {
    try {
        const { currentPage, usersPerpage } = req.query;
        const offset = ((currentPage - 1) * usersPerpage);
        const filteredUsers = await pool.query(`SELECT * FROM users OFFSET ${offset} LIMIT ${usersPerpage}`);
        const allUsers = await pool.query('SELECT * FROM users');
        const count = allUsers.rows.length;
        res.status(200).json({ count, message: 'All users Fetched Successfully', data: filteredUsers.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
});


//Post data to database
app.post('/users', async (req, res) => {
    const usersData = req.body;
    const insertValues = usersData.map((user) => `('${uuidv4()}', '${user.name}', '${user.email}', '${user.phone}', '${user.gender}', '${user.location}', '${user.picture}')`).join(',');
    const query = `INSERT INTO users (id, name, email, phone, gender, location, picture) VALUES ${insertValues} RETURNING *`;
    try {
        const newUsers = await pool.query(query);
        res.status(200).json({ message: 'User Saved to Database', data: newUsers.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
});
//Delete All Users from database
app.delete('/deleteusers', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM users');
        res.status(200).send('All user data has been deleted successfully!');
    } catch (error) {
        res.json({ error: error.message });
    }
});

//Default API
app.get('/', (req, res) => {
    res.send('CoinTab Server is Running...')
})
//Add a app listener
app.listen(port, () => {
    console.log('Server Running on Port: ', port);
})
