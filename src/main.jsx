// Importacion de React para usar JSX y crear componentes
import React from 'react'

// Importacion de ReactDOM para montar la aplicacion en el DOM
import ReactDOM from 'react-dom/client'

// Importacion del componente principal de la aplicacion
import App from './App'

// Importacion del proveedor de contexto para manejar el estado global del usuario
import { UserProvider } from './context/UserContext'

// Crear el root en el elemento con id 'root' y renderizar la aplicacion
ReactDOM.createRoot(document.getElementById('root')).render(
  // Modo estricto de React para ayudar a detectar problemas en la aplicacion
  <React.StrictMode>
    {/* Proveedor del contexto de usuario para que toda la aplicacion pueda acceder a ese estado */}
    <UserProvider>
      {/* Renderizado del componente principal de la aplicacion */}
      <App />
    </UserProvider>
  </React.StrictMode>
)
