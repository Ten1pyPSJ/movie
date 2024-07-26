import { createSlice, createAsyncThunk, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

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
  comments: Comment[];
}

interface Comment {
  user: string;
  text: string;
}

interface Cart {
  movies: { movie: Movie; quantity: number }[];
}

interface MoviesState {
  movies: Movie[];
  cart: Cart | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  cart: null,
  status: 'idle',
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get('http://localhost:3000/api/movies');
  return response.data;
});

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3000/api/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (movieId: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    'http://localhost:3000/api/cart/remove',
    { movieId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
});

export const commentMovie = createAsyncThunk(
  'movies/commentMovie',
  async ({ id, comment }: { id: string; comment: string }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://localhost:3000/api/movies/${id}/comment`,
      { comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
);

export const deleteMovie = createAsyncThunk('movies/deleteMovie', async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`http://localhost:3000/api/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const likeMovie = createAsyncThunk('movies/likeMovie', async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `http://localhost:3000/api/movies/${id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
});

export const dislikeMovie = createAsyncThunk('movies/dislikeMovie', async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `http://localhost:3000/api/movies/${id}/dislike`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async (movieId: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    'http://localhost:3000/api/cart/add',
    { movieId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Что-то пошло не так';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.movies = state.cart.movies.filter(
            (item) => item.movie._id !== action.payload.movieId,
          );
        }
      })
      .addCase(commentMovie.fulfilled, (state, action) => {
        const movie = state.movies.find((movie) => movie._id === action.payload.movieId);
        if (movie) {
          movie.comments = action.payload.comments;
        }
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((movie) => movie._id !== action.meta.arg);
      })
      .addCase(likeMovie.fulfilled, (state, action) => {
        const movie = state.movies.find((movie) => movie._id === action.meta.arg);
        if (movie) {
          movie.likes = action.payload.likes;
          movie.dislikes = action.payload.dislikes;
        }
      })
      .addCase(dislikeMovie.fulfilled, (state, action) => {
        const movie = state.movies.find((movie) => movie._id === action.meta.arg);
        if (movie) {
          movie.likes = action.payload.likes;
          movie.dislikes = action.payload.dislikes;
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (state.cart) {
          const existingItemIndex = state.cart.movies.findIndex(
            (item) => item.movie._id === action.payload.movie._id,
          );

          if (existingItemIndex >= 0) {
            state.cart.movies[existingItemIndex].quantity += 1;
          } else {
            state.cart.movies.push({ movie: action.payload.movie, quantity: 1 });
          }
        } else {
          state.cart = { movies: [{ movie: action.payload.movie, quantity: 1 }] };
        }
      });
  },
});
export default moviesSlice.reducer;
