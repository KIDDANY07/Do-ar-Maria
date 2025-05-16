import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaShoppingCart, FaInfoCircle, FaPencilAlt  } from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import userImage from '../assets/images/usuario.png'

export default function Navbar() {
  //Estados
  const { user, login, logout, register } = useContext(UserContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  //Menu usuario
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  //Modales de login y registro
  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }
  const closeLoginModal = () => setIsLoginModalOpen(false)
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }
  const closeRegisterModal = () => setIsRegisterModalOpen(false)
  //Logica login
  const handleLogin = async () => {
    try {
      await login(loginData.email, loginData.password)
      closeLoginModal()
    } catch {
      alert('Error al iniciar sesión')
    }
  }
  //Logica registro
  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = registerData
    if (password !== confirmPassword) return alert('Las contraseñas no coinciden')

    try {
      await register(name, email, password)
      closeRegisterModal()
    } catch {
      alert('Error al registrarse')
    }
  }
  //Cierre de sesion
  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
  }

  return (
    <div className='fixed top-0 left-0 w-full z-50'>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative flex flex-col gap-4">
            <button onClick={closeLoginModal} className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-semibold">&times;</button>
            <h2 className="text-lg font-bold mb-2 text-center">Iniciar sesión</h2>
            <input
              type="email"
              placeholder="Correo"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500"
            />
            <button onClick={handleLogin} className="bg-white text-orange-600 border-1 py-2 rounded hover:bg-orange-600 hover:text-white duration-300">
              Iniciar sesión
            </button>
            <p className="text-center mt-2 text-sm">
              ¿No tienes cuenta?{' '}
              <button onClick={openRegisterModal} className="text-orange-600 hover:text-orange-400 duration-300">
                Regístrate
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative flex flex-col gap-4">
            <button onClick={closeRegisterModal} className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-semibold">&times;</button>
            <h2 className="text-lg font-bold mb-2 text-center">Registrarse</h2>
            <input 
              type="text" 
              placeholder="Nombre" 
              value={registerData.name} 
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })} 
              className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            <input 
             type="email" placeholder="Correo" 
             value={registerData.email} 
             onChange={e => setRegisterData({ ...registerData, email: e.target.value })} 
             className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            <input 
             type="password" 
             placeholder="Contraseña" 
             value={registerData.password} 
             onChange={e => setRegisterData({ ...registerData, password: e.target.value })} 
             className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            <input 
             type="password"
             placeholder="Repita la contraseña" 
             value={registerData.confirmPassword} 
             onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} 
             className="border border-gray-300 hover:border-orange-300 rounded px-3 py-2 duration-300 focus:outline focus:outline-1 focus:outline-orange-500" />
            <button onClick={handleRegister} className="bg-white text-orange-600 border-1 py-2 rounded hover:bg-orange-600 hover:text-white duration-300">
              Registrarse
            </button>
            <p className="text-center mt-2 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button onClick={openLoginModal} className="text-orange-600 hover:text-orange-400 duration-300">
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <nav className='bg-gray-900 text-white p-4 md:flex justify-between hidden drop-shadow-lg items-center'>
        <div className='flex items-center gap-6'>
          <h1 className="text-xl font-bold">
            <Link to="/" className='animated-gradient-text'>Doña Maria</Link>
          </h1>
          <Link to="/" className="hover:text-orange-400">Inicio</Link>
          {user ?  (
            <Link to="/cart" className="hover:text-orange-400">Carrito</Link>
          ):(
            <></>
          )}
          <Link to="/about" className="hover:text-orange-400">Nosotros</Link>
          {user?.role === 'admin' && (
            <Link to="/products" className="hover:text-orange-400">Productos</Link>
          )}
        </div>
        <div className='flex items-center gap-4'>
          {user ? (
            <div className="relative">
              <div className='flex justify-center items-center'>
                <p className='px-4'>{user.name}</p>
                <button onClick={toggleDropdown} className="rounded-full overflow-hidden border-2 border-white">
                  <img src={user.image || userImage} alt="Perfil" className="h-8 w-8 object-cover rounded-full" />
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50 py-2">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">Carrito</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={openLoginModal} className="text-orange-600 px-4 py-2 rounded hover:text-white duration-300">Login</button>
              <button onClick={openRegisterModal} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-white hover:text-orange-600 duration-300">Registrarse</button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className='bg-gray-900 text-white p-4 flex md:hidden justify-between items-center drop-shadow-lg h-20'>
        <h1 className="text-xl font-bold">
          <Link to="/" className='animated-gradient-text'>Doña Maria</Link>
        </h1>
        <div className="flex gap-4 justify-center items-center">
          <Link to="/" className="text-white"><FaHome /></Link>
          {user ? (
            <Link to="/cart" className="text-white"><FaShoppingCart /></Link>
          ):
          (
            <></>
          )}
          <Link to="/about" className="text-white"><FaInfoCircle /></Link>
          {user?.role === 'admin' && (
            <Link to="/products" className="text-white"><FaPencilAlt/></Link>
          )}
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="rounded-full overflow-hidden border-2 border-white">
                <img src={user.image || userImage} alt="Perfil" className="h-6 w-6 object-cover rounded-full" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50 py-2">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">Carrito</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
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
