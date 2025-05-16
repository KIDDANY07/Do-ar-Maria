import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
//URL de la api usuarios
const API_BASE = 'http://localhost:5000/api/users'
export const UserContext = createContext()

//Provider para el manejo de sesiones
export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoadingUser(false)
      return
    }
    axios
      .get(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoadingUser(false))
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/login`, { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_BASE}/register`, { name, email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, register, loadingUser }}>
      {children}
    </UserContext.Provider>
  )
}
