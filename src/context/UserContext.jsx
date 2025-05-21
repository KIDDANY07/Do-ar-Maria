import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

// URL de la api usuarios
const API_BASE = 'http://localhost:5000/api/users'

// Se crea el contexto de usuario
export const UserContext = createContext()

// Provider para el manejo de sesiones
export function UserProvider({ children }) {
  // Estado para almacenar el usuario
  const [user, setUser] = useState(null)
  // Estado para indicar si se esta cargando el usuario
  const [loadingUser, setLoadingUser] = useState(true)

  // useEffect que se ejecuta al montar el componente
  useEffect(() => {
    // Se obtiene el token del localStorage
    const token = localStorage.getItem('token')
    // Si no hay token, se termina la carga y retorna
    if (!token) {
      setLoadingUser(false)
      return
    }
    // Si hay token, se solicita el perfil del usuario
    axios
      .get(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data)) // Se guarda el usuario en el estado
      .catch(() => {
        // Si falla, se elimina el token y se borra el usuario
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoadingUser(false)) // Finaliza la carga
  }, [])

  // Funcion para iniciar sesion
  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/login`, { email, password })
    localStorage.setItem('token', res.data.token) // Se guarda el token
    setUser(res.data.user) // Se actualiza el usuario
  }

  // Funcion para registrar un nuevo usuario
  const register = async (name, email, password) => {
    const res = await axios.post(`${API_BASE}/register`, { name, email, password })
    localStorage.setItem('token', res.data.token) // Se guarda el token
    setUser(res.data.user) // Se actualiza el usuario
  }

  // Funcion para cerrar sesion
  const logout = () => {
    localStorage.removeItem('token') // Se elimina el token
    setUser(null) // Se borra el usuario
  }

  // Se retorna el contexto con los valores y funciones necesarias
  return (
    <UserContext.Provider value={{ user, setUser, login, logout, register, loadingUser }}>
      {children}
    </UserContext.Provider>
  )
}
