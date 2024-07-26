import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMovies,
  deleteMovie,
  likeMovie,
  dislikeMovie,
  addToCart,
  fetchCart,
  removeFromCart,
  commentMovie,
} from '../../redux/movie/moviesSlice';
import { RootState, AppDispatch } from '../../redux/store';
import style from './Home.module.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.movies.movies);
  const cart = useSelector((state: RootState) => state.movies.cart);
  const movieStatus = useSelector((state: RootState) => state.movies.status);
  const error = useSelector((state: RootState) => state.movies.error);
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (movieStatus === 'idle') {
      dispatch(fetchMovies());
      if (user) {
        dispatch(fetchCart());
      }
    }
  }, [movieStatus, dispatch, user]);

  const handleDelete = async (id: string) => {
    if (user?.role === 'admin') {
      await dispatch(deleteMovie(id));
    }
  };

  const handleLike = async (id: string) => {
    if (user) {
      await dispatch(likeMovie(id));
    }
  };

  const handleDislike = async (id: string) => {
    if (user) {
      await dispatch(dislikeMovie(id));
    }
  };

  const handleAddToCart = async (movieId: string) => {
    if (user) {
      const response = await dispatch(addToCart(movieId));
      if (addToCart.rejected.match(response)) {
        alert('Фильм уже добавлен в корзину');
      }
    }
  };

  const handleRemoveFromCart = async (movieId: string) => {
    if (user) {
      await dispatch(removeFromCart(movieId));
    }
  };

  const handleAddComment = async (id: string) => {
    if (user && comment.trim()) {
      await dispatch(commentMovie({ id, comment }));
      setComment('');
    }
  };

  const filteredMovies = movies
    .filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((movie) => (selectedCategory ? movie.category === selectedCategory : true))
    .sort((a, b) => a.category - b.category);

  let content;

  if (movieStatus === 'loading') {
    content = <div>Загрузка...</div>;
  } else if (movieStatus === 'succeeded') {
    content = (
      <div className={style.block_movie}>
        <div className={style.search_sort_controls}>
          <input
            type='text'
            placeholder='Поиск по названию'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCategory ?? ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          >
            <option value=''>Все категории</option>
            <option value='1'>Категория 1</option>
            <option value='2'>Категория 2</option>
            <option value='3'>Категория 3</option>
          </select>
        </div>
        {filteredMovies.map((movie) => (
          <div key={movie._id} className={style.movie_card}>
            <h2 className={movie.popular ? style.popularTitle : ''}>{movie.title}</h2>
            <img src={movie.imageURL} alt={movie.title} className={style.movie_img} />
            <p>{movie.description}</p>
            <p>Цена: ${movie.price}</p>
            <div className={style.movie_info}>
              <Link to={`/movies/${movie._id}`}>Посмотреть подробно</Link>
              {user?.role === 'admin' && (
                <>
                  <Link to={`/edit-movie/${movie._id}`}>Изменить</Link>
                  <button onClick={() => handleDelete(movie._id)}>Удалить</button>
                </>
              )}
              <button onClick={() => handleAddToCart(movie._id)}>Добавить в корзину</button>
              <div>
                <button onClick={() => handleLike(movie._id)} disabled={!user}>
                  👍 {movie.likes.length}
                </button>
                <button onClick={() => handleDislike(movie._id)} disabled={!user}>
                  👎 {movie.dislikes.length}
                </button>
              </div>
              {user && (
                <div>
                  <input
                    type='text'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Оставить комментарий'
                  />
                  <button onClick={() => handleAddComment(movie._id)}>Добавить комментарий</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {cart && (
          <div>
            <h2>Корзина</h2>
            {cart.movies.map((item) => (
              <div key={item.movie?._id}>
                {item.movie && (
                  <>
                    <p>{item.movie.title}</p>
                    <p>Количество: {item.quantity}</p>
                    <button onClick={() => handleRemoveFromCart(item.movie._id)}>Удалить</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else if (movieStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return <div>{content}</div>;
};

export default Home;
