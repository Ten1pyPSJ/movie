const Cart = require('../models/cart');
const Movie = require('../models/movie');

exports.addToCart = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }

    const existingMovieIndex = cart.movies.findIndex((item) => item.movie.toString() === movieId);

    if (existingMovieIndex > -1) {
      return res.status(400).json({ message: 'Фильм уже добавлен в корзину' });
    } else {
      cart.movies.push({ movie: movieId });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};
exports.getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('movies.movie');
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }

    const movieIndex = cart.movies.findIndex((item) => item.movie.toString() === movieId);

    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Фильм не найден в корзине' });
    }

    cart.movies.splice(movieIndex, 1);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};
