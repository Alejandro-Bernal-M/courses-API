const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
//routes files
const authRoutes = require('./routes/auth');

// env
env.config();

//connect db
mongoose.connect(process.env.MONGO).then(() => console.log('Database connected'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes middlewares
app.use('/api' , authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port = ${process.env.PORT}`)
});