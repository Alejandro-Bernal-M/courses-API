const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
//routes files
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/user');
// Redoc
const fs = require('fs');


app.use('/docs', (req, res) => {
  fs.readFile('redoc-static.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading HTML file');
    }

    // Send the HTML content as the response
    res.send(data);
  });
} );

// env
env.config();

//connect db
mongoose.connect(process.env.MONGO).then(() => console.log('Database connected'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public',express.static(path.join(__dirname, 'uploads')));
//routes middlewares
app.use('/api' , authRoutes);
app.use('/api/', courseRoutes);
app.use('/api/', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port = ${process.env.PORT}`)
});