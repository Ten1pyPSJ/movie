import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/movie/hooks';
import { RootState } from '../../redux/store';
import { fetchMovies } from '../../redux/movie/moviesSlice';

const EditMovie: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState('');
  const [popular, setPopular] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state: RootState) => state.movies.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleSelectMovie = (movie: any) => {
    setSelectedMovie(movie);
    setTitle(movie.title);
    setDescription(movie.description);
    setPrice(movie.price);
    setImageURL(movie.imageURL);
    setPopular(movie.popular);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedMovie) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/movies/${selectedMovie._id}`,
        { title, description, price, imageURL, popular },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate('/');
    } catch (err) {
      console.error('Error updating the movie:', err);
      setError('Не удалось обновить фильм');
    }
  };

  return (
    <div>
      <h2>Изменить кино</h2>
      {error && <p>{error}</p>}
      <div>
        {movies.map((movie) => (
          <div key={movie._id}>
            <p>{movie.title}</p>
            <button onClick={() => handleSelectMovie(movie)}>выбрать</button>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <form onSubmit={handleSubmit}>
          <label>
            Заголовок:
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Описание:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Цена:
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </label>
          <label>
            URL изображения:
            <input
              type='text'
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              required
            />
          </label>
          <label>
            Популярный:
            <input
              type='checkbox'
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
            />
          </label>
          <button type='submit'>Сохранить</button>
        </form>
      )}
    </div>
  );
};

export default EditMovie;
