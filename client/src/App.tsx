import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import MovieDetail from './components/MovieDetails/MovieDetails';
import Register from './components/User/Register';
import Login from './components/User/Login';
import Me from './components/User/Me';
import CreateMovie from './components/Movie/CreateMovie';
import EditMovie from './components/Movie/EditMovie';
function App() {
  return (
    <div>
      <Header />
      <div className='container'>
        <div className='block'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/movies/:id' element={<MovieDetail />} />
            <Route path='/cart' element={<Cart />} />

            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/me' element={<Me />} />

            <Route path='/create-movie' element={<CreateMovie />} />
            <Route path='/edit-movie' element={<EditMovie />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
