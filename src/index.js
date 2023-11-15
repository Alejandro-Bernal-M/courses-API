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
//cors
const cors = require('cors');

// env
env.config();

//connect db
mongoose.connect(process.env.MONGO).then(() => console.log('Database connected'));

//cors options
app.options('*', cors());

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public',express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: process.env.ORIGIN, // or an array of allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
}));

//routes middlewares
app.use('/api' , authRoutes);
app.use('/api/', courseRoutes);
app.use('/api/', userRoutes);

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
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port = ${process.env.PORT}`)
});