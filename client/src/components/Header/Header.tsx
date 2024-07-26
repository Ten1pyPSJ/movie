import React, { useState, useEffect } from 'react';
import style from './Header.module.css';
import logoIMG from '../../assets/images/film-svgrepo-com.svg';
import cartImg from '../../assets/images/cart-large-minimalistic-svgrepo-com.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCart } from '../../redux/movie/moviesSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.movies.cart);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const cartCount = cart?.movies.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className={style.header}>
      <div className='container'>
        <div className={style.header_inner}>
          <div className={style.header_logo}>
            <Link to='/'>
              <img src={logoIMG} alt='Logo' />
            </Link>
            <Link to='/'>Кино</Link>
          </div>
          <div className='admin'>
            {user && user.role === 'admin' && (
              <>
                <Link to='/create-movie'>Создать кино</Link>{' '}
                <Link to='/edit-movie'>Изменить фильм</Link>{' '}
              </>
            )}
          </div>
          <div className={style.header_cart}>
            <Link to='/cart'>
              <img src={cartImg} alt='Cart' />
              <p>{cartCount}</p>
            </Link>
            {user ? (
              <div>
                <Link to='/me'>{user.username}</Link>
                <button onClick={logout}>Выйти</button>
              </div>
            ) : (
              <Link to='/login'>Войти</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
