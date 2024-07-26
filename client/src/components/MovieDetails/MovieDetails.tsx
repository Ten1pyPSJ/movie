import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/movie/hooks';
import { addToCart, likeMovie, dislikeMovie, commentMovie } from '../../redux/movie/moviesSlice';
import useAuth from '../../hooks/useAuth';

interface Movie {
  _id: string;
  title: string;
  imageURL: string;
  description: string;
  price: number;
  popular: boolean;
  likes: string[];
  dislikes: string[];
  category: number;
  comments: { user: string; text: string }[];
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/movies/${id}`);
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching movie');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleLike = async () => {
    if (user) {
      await dispatch(likeMovie(id!));
    }
  };

  const handleDislike = async () => {
    if (user) {
      await dispatch(dislikeMovie(id!));
    }
  };

  const handleAddToCart = async () => {
    if (user) {
      await dispatch(addToCart(id!));
    }
  };

  const handleAddComment = async () => {
    if (user && comment.trim()) {
      await dispatch(commentMovie({ id: id!, comment }));
      setComment('');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Фильм не найден</div>;

  return (
    <div className='movie-details'>
      <h2>{movie.title}</h2>
      <img src={movie.imageURL} alt={movie.title} />
      <p>{movie.description}</p>
      <p>Цена: ${movie.price}</p>
      <div>
        <button onClick={handleLike} disabled={!user}>
          👍 {movie.likes.length}
        </button>
        <button onClick={handleDislike} disabled={!user}>
          👎 {movie.dislikes.length}
        </button>
      </div>
      <button onClick={handleAddToCart} disabled={!user}>
        Добавить в корзину
      </button>
      {user && (
        <div>
          <input
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Оставить комментарий'
          />
          <button onClick={handleAddComment}>Добавить комментарий</button>
        </div>
      )}
      <div>
        <h3>Комментарии</h3>
        {movie.comments.map((comment, index) => (
          <div key={index}>
            <p>
              {comment.user}: {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetail;
