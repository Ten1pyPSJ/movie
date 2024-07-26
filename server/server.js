const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cart', cartRoutes);

mongoose
  .connect('mongodb://localhost:27017/movie', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
