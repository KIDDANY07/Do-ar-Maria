import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaShoppingCart, FaInfoCircle, FaPencilAlt  } from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import userImage from '../assets/images/usuario.png'

export default function Navbar() {
  // Obtener estados y funciones del contexto de usuario
  const { user, login, logout, register } = useContext(UserContext)
  // Estado para controlar si el dropdown del menu esta abierto
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // Estado para controlar si el modal de login esta abierto
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // Estado para controlar si el modal de registro esta abierto
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  // Estado para manejar los datos del formulario de login
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  // Estado para manejar los datos del formulario de registro
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  // Funcion para alternar el estado del dropdown del menu usuario
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  // Funciones para abrir y cerrar el modal de login
  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }
  const closeLoginModal = () => setIsLoginModalOpen(false)

  // Funciones para abrir y cerrar el modal de registro
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }
  const closeRegisterModal = () => setIsRegisterModalOpen(false)

  // Funcion para manejar el login del usuario
  const handleLogin = async () => {
    try {
      await login(loginData.email, loginData.password)
      closeLoginModal() // Cerrar modal al iniciar sesion exitosamente
    } catch {
      alert('Error al iniciar sesion')
    }
  }

  // Funcion para manejar el registro del usuario
  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = registerData
    if (password !== confirmPassword) return alert('Las contrasenas no coinciden')

    try {
      await register(name, email, password)
      closeRegisterModal() // Cerrar modal al registrarse exitosamente
    } catch {
      alert('Error al registrarse')
    }
  }

  // Funcion para cerrar sesion
  const handleLogout = () => {
    logout()
    setDropdownOpen(false) // Cerrar dropdown al salir
  }

  return (
    <div className='fixed top-0 left-0 w-full z-50'>

      {/* Modal de login, se muestra solo si isLoginModalOpen es true */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative flex flex-col gap-4">
            {/* Boton para cerrar modal */}
            <button onClick={closeLoginModal} className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-semibold">&times;</button>
            <h2 className="text-lg font-bold mb-2 text-center">Iniciar sesion</h2>
            {/* Input para correo */}
            <input
              type="email"
              placeholder="Correo"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500"
            />
            {/* Input para contraseña */}
            <input
              type="password"
              placeholder="Contrasena"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500"
            />
            {/* Boton para iniciar sesion */}
            <button onClick={handleLogin} className="bg-white text-orange-600 border-1 py-2 rounded hover:bg-orange-600 hover:text-white duration-300">
              Iniciar sesion
            </button>
            <p className="text-center mt-2 text-sm">
              ¿No tienes cuenta?{' '}
              {/* Boton para abrir modal de registro */}
              <button onClick={openRegisterModal} className="text-orange-600 hover:text-orange-400 duration-300">
                Registrate
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Modal de registro, se muestra solo si isRegisterModalOpen es true */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative flex flex-col gap-4">
            {/* Boton para cerrar modal */}
            <button onClick={closeRegisterModal} className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-semibold">&times;</button>
            <h2 className="text-lg font-bold mb-2 text-center">Registrarse</h2>
            {/* Input para nombre */}
            <input 
              type="text" 
              placeholder="Nombre" 
              value={registerData.name} 
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })} 
              className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            {/* Input para correo */}
            <input 
             type="email" placeholder="Correo" 
             value={registerData.email} 
             onChange={e => setRegisterData({ ...registerData, email: e.target.value })} 
             className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            {/* Input para contraseña */}
            <input 
             type="password" 
             placeholder="Contrasena" 
             value={registerData.password} 
             onChange={e => setRegisterData({ ...registerData, password: e.target.value })} 
             className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            {/* Input para confirmar contraseña */}
            <input 
             type="password"
             placeholder="Repita la contrasena" 
             value={registerData.confirmPassword} 
             onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} 
             className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            {/* Boton para registrarse */}
            <button onClick={handleRegister} className="bg-white text-orange-600 border-1 py-2 rounded hover:bg-orange-600 hover:text-white duration-300">
              Registrarse
            </button>
            <p className="text-center mt-2 text-sm">
              ¿Ya tienes cuenta?{' '}
              {/* Boton para abrir modal de login */}
              <button onClick={openLoginModal} className="text-orange-600 hover:text-orange-400 duration-300">
                Inicia sesion
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Navbar para escritorio (pantallas medianas o grandes) */}
      <nav className='bg-gray-900 text-white p-4 md:flex justify-between hidden drop-shadow-lg items-center'>
        <div className='flex items-center gap-6'>
          {/* Titulo con link a home */}
          <h1 className="text-xl font-bold">
            <Link to="/" className='animated-gradient-text'>Doña Maria</Link>
          </h1>
          {/* Links principales */}
          <Link to="/" className="hover:text-orange-400">Inicio</Link>
          <Link to="/about" className="hover:text-orange-400">Nosotros</Link>
          {/* Mostrar link de productos solo si usuario es admin */}
          {user?.role === 'admin' && (
            <Link to="/products" className="hover:text-orange-400">Productos</Link>
          )}
        </div>
        <div className='flex items-center gap-4'>
          {/* Si hay usuario logueado mostrar menu usuario */}
          {user ? (
            <div className="relative">
              <div className='flex justify-center items-center'>
                {/* Nombre del usuario */}
                <p className='px-4'>{user.name}</p>
                {/* Boton con imagen de perfil que abre el dropdown */}
                <button onClick={toggleDropdown} className="rounded-full overflow-hidden border-2 border-white">
                  <img src={user.image || userImage} alt="Perfil" className="h-8 w-8 object-cover rounded-full" />
                </button>
              </div>
              {/* Dropdown con opciones */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50 py-2">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">Carrito</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Cerrar sesion</button>
                </div>
              )}
            </div>
          ) : (
            // Si no hay usuario mostrar botones para login y registro
            <>
              <button onClick={openLoginModal} className="text-orange-600 px-4 py-2 rounded hover:text-white duration-300">Login</button>
              <button onClick={openRegisterModal} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-white hover:text-orange-600 duration-300">Registrarse</button>
            </>
          )}
          {/* Mostrar link a carrito si hay usuario */}
          {user ? (
            <div className='flex justify-center items-center'>
              <Link to="/cart" className="hover:text-orange-400 flex justify-center items-center">
                <FaShoppingCart className='text-2xl'/>
                <h1 className='px-2'>Carrito</h1>
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>

      {/* Navbar para dispositivos moviles (pantallas pequeñas) */}
      <nav className='bg-gray-900 text-white p-4 flex md:hidden justify-between items-center drop-shadow-lg h-20'>
        <h1 className="text-xl font-bold">
          <Link to="/" className='animated-gradient-text'>Doña Maria</Link>
        </h1>
        <div className="flex gap-4 justify-center items-center">
          {/* Icono home */}
          <Link to="/" className="text-white"><FaHome /></Link>
          {/* Icono carrito solo si hay usuario */}
          {user ? (
            <Link to="/cart" className="text-white"><FaShoppingCart /></Link>
          ) : (
            <></>
          )}
          {/* Icono nosotros */}
          <Link to="/about" className="text-white"><FaInfoCircle /></Link>
          {/* Icono productos solo para admin */}
          {user?.role === 'admin' && (
            <Link to="/products" className="text-white"><FaPencilAlt/></Link>
          )}
          {/* Menu usuario con dropdown para moviles */}
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="rounded-full overflow-hidden border-2 border-white">
                <img src={user.image || userImage} alt="Perfil" className="h-6 w-6 object-cover rounded-full" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50 py-2">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">Carrito</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Cerrar sesion</button>
                </div>
              )}
            </div>
          ) : (
            // Botones login y registro para moviles si no hay usuario
            <div className="flex gap-2">
              <button onClick={openLoginModal} className="text-orange-600 px-3 py-1 rounded hover:text-white duration-300">Login</button>
              <button onClick={openRegisterModal} className="bg-orange-600 text-white px-3 py-1 rounded">Registro</button>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
