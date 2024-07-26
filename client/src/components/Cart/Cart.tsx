import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFromCart, fetchCart } from '../../redux/movie/moviesSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.movies.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (movieId: string) => {
    dispatch(removeFromCart(movieId));
  };

  return (
    <div>
      <h2>Корзина</h2>
      {cart ? (
        <div>
          {cart.movies.map((item) => (
            <div key={item.movie._id}>
              <p>{item.movie.title}</p>
              <p>Количество: {item.quantity}</p>
              <button onClick={() => handleRemoveFromCart(item.movie._id)}>Удалить</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Корзина пуста</p>
      )}
    </div>
  );
};

export default Cart;
