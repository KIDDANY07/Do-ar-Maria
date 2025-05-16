import Home from './pages/Home'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import About from './pages/About'
import Products from './pages/Products'
import Profile from './pages/Profile'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' name='home' element={<Home/>}/>
        <Route path='/cart' name='home' element={<Cart/>}/>
        <Route path='/about' name='home' element={<About/>}/>
        <Route path='/products' name='home' element={<Products/>}/>
        <Route path='/profile' name='home' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
