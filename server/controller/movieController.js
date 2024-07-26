const Movie = require('../models/movie');
const User = require('../models/user');

exports.createMovie = async (req, res) => {
  const { title, imageURL, description, price, popular, category } = req.body;

  try {
    const newMovie = new Movie({
      title,
      imageURL,
      description,
      price,
      popular,
      category,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    const moviesWithLikesDislikes = movies.map((movie) => ({
      ...movie.toObject(),
      likesCount: movie.likes.length,
      dislikesCount: movie.dislikes.length,
    }));
    res.json(moviesWithLikesDislikes);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};
exports.getMovieById = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }
    const response = {
      ...movie.toObject(),
      likesCount: movie.likes.length,
      dislikesCount: movie.dislikes.length,
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }
    res.json({ message: 'Фильм успешно удален' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, imageURL, description, price, popular, category } = req.body;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }

    movie.title = title || movie.title;
    movie.imageURL = imageURL || movie.imageURL;
    movie.description = description || movie.description;
    movie.price = price || movie.price;
    movie.popular = popular !== undefined ? popular : movie.popular;
    movie.category = category !== undefined ? category : movie.category;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }

    const likesIndex = movie.likes.indexOf(userId);
    const dislikesIndex = movie.dislikes.indexOf(userId);

    if (likesIndex > -1) {
      movie.likes.splice(likesIndex, 1);
    } else {
      movie.likes.push(userId);
      if (dislikesIndex > -1) {
        movie.dislikes.splice(dislikesIndex, 1);
      }
    }

    await movie.save();
    const response = {
      ...movie.toObject(),
      likesCount: movie.likes.length,
      dislikesCount: movie.dislikes.length,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.toggleDislike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }

    const likesIndex = movie.likes.indexOf(userId);
    const dislikesIndex = movie.dislikes.indexOf(userId);

    if (dislikesIndex > -1) {
      movie.dislikes.splice(dislikesIndex, 1);
    } else {
      movie.dislikes.push(userId);
      if (likesIndex > -1) {
        movie.likes.splice(likesIndex, 1);
      }
    }

    await movie.save();
    const response = {
      ...movie.toObject(),
      likesCount: movie.likes.length,
      dislikesCount: movie.dislikes.length,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};
exports.commentMovie = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user.userId;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }

    movie.comments.push({ user: userId, text: comment });
    await movie.save();

    res.json({ message: 'Комментарий добавлен' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};
