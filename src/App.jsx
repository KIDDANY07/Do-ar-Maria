// Importacion de paginas y componentes necesarios
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import About from './pages/About'
import Products from './pages/Products'
import Profile from './pages/Profile'
import './App.css'

// Importacion de componentes de React Router para manejar rutas
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Componente principal de la aplicacion
function App() {
  return (
    // Componente que envuelve toda la aplicacion para habilitar el uso de rutas
    <BrowserRouter>
      {/* Barra de navegacion que se muestra en todas las paginas */}
      <Navbar/>

      {/* Definicion de las rutas de la aplicacion */}
      <Routes>
        {/* Ruta para la pagina de inicio */}
        <Route path='/' name='home' element={<Home/>}/>

        {/* Ruta para la pagina del carrito */}
        <Route path='/cart' name='home' element={<Cart/>}/>

        {/* Ruta para la pagina "Acerca de" */}
        <Route path='/about' name='home' element={<About/>}/>

        {/* Ruta para la pagina de productos */}
        <Route path='/products' name='home' element={<Products/>}/>

        {/* Ruta para la pagina de perfil del usuario */}
        <Route path='/profile' name='home' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

// Exportar el componente App para que pueda usarse en otros archivos
export default App
