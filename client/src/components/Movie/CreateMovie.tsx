import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMovie: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState('');
  const [popular, setPopular] = useState(false);
  const [category, setCategory] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/movies/create',
        { title, description, price, imageURL, popular, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate('/');
    } catch (err) {
      setError('Не удалось создать кино');
    }
  };

  return (
    <div>
      <h2>Создать кино</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Заголовок:
          <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Описание:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
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
          <input type='checkbox' checked={popular} onChange={(e) => setPopular(e.target.checked)} />
        </label>
        <label>
          Категория:
          <select value={category} onChange={(e) => setCategory(Number(e.target.value))}>
            <option value={1}>Категория 1</option>
            <option value={2}>Категория 2</option>
            <option value={3}>Категория 3</option>
          </select>
        </label>
        <button type='submit'>Создать</button>
      </form>
    </div>
  );
};

export default CreateMovie;
