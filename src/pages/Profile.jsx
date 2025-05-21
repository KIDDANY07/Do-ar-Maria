// Importacion de librerias y componentes necesarios
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import Footer from '../components/Footer'

// Definicion de la URL base de la API
const API_BASE = 'http://localhost:5000/api/users'

// Componente principal del perfil
export default function Profile() {
  // Uso del contexto para acceder al usuario y la funcion para actualizarlo
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  // Estados para manejar datos del formulario, archivo, imagen preview, mensaje y carga
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || '', 
    address: user?.address || '',
  })
  const [selectedFile, setSelectedFile] = useState(null) 
  const [preview, setPreview] = useState(user?.image || '') 
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Redireccionar al inicio si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Mostrar preview cuando se selecciona un archivo
  useEffect(() => {
    if (!selectedFile) {
      setPreview(user?.image || '')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Limpiar la URL del objeto cuando se cambia el archivo
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile, user])

  // Si no hay usuario, no renderizar nada
  if (!user) return null 

  // Obtener token del almacenamiento local
  const token = localStorage.getItem('token')

  // Manejar cambios en inputs de texto
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Manejar seleccion de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setFormData((prev) => ({
        ...prev,
        image: '', // Limpiar el campo de URL si se selecciona archivo
      }))
    }
  }

  // Funcion para convertir un archivo a base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  // Manejar envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      let imageData = formData.image

      // Si hay archivo seleccionado, convertir a base64
      if (selectedFile) {
        imageData = await fileToBase64(selectedFile)
      }

      // Enviar datos actualizados al backend
      const res = await axios.put(
        `${API_BASE}/profile`,
        {
          name: formData.name,
          email: formData.email,
          image: imageData,
          address: formData.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Mostrar mensaje de exito y actualizar usuario
      setMessage(res.data.message || 'Perfil actualizado correctamente')
      setUser((prev) => ({
        ...prev,
        ...formData,
        image: imageData,
      }))
      setSelectedFile(null)
    } catch (err) {
      // Mostrar mensaje de error
      setMessage(err.response?.data?.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  // Renderizado del componente
  return (
    <div>
      <div className="max-w-md mx-auto pt-6 mt-40 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h1>

        {message && (
          <div className="mb-4 text-center text-red-600">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen de perfil o placeholder */}
          <div className="flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Perfil"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                Sin Imagen
              </div>
            )}
          </div>

          {/* Input para subir imagen */}
          <div>
            <label className="block mb-1 font-semibold">Subir Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* Campo de nombre */}
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Campo de correo */}
          <div>
            <label className="block mb-1 font-semibold">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Campo de direccion */}
          <div>
            <label className="block mb-1 font-semibold">Direccion</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Tu direccion"
            />
          </div>

          {/* Campo para URL de imagen */}
          <div>
            <label className="block mb-1 font-semibold">URL Imagen (opcional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="https://ejemplo.com/miimagen.jpg"
            />
          </div>

          {/* Boton para enviar el formulario */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-white text-orange-600 border-1 border-orange-600 font-semibold py-2 rounded hover:bg-orange-600 hover:text-white duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Guardando...' : 'Actualizar Perfil'}
          </button>
        </form>
      </div>

      {/* Componente Footer */}
      <Footer/>
    </div>
  )
}
