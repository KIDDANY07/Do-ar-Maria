import React from 'react'
// Importa el componente Link de react-router-dom para crear enlaces internos
import { Link } from 'react-router-dom'

// Componente funcional Footer que renderiza el pie de pagina
export default function Footer() {
  return (
    // Etiqueta footer con estilos de fondo y margen superior
    <footer className="bg-gray-100 dark:bg-gray-900 mt-12">
      {/* Contenedor central con maximo ancho y padding */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Contenedor para centrar el titulo con color teal */}
        <div className="flex justify-center text-teal-600 dark:text-teal-300">
          {/* Titulo principal con enlace a la pagina de inicio */}
          <h1 className="text-4xl font-bold">
            <Link to="/" className='animated-gradient-text'>Doña Maria</Link>
          </h1>
        </div>

        {/* Parrafo descriptivo centrado con estilos para texto */}
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 dark:text-gray-400">
          La gastronomia colombiana es tan diversa como su geografia y su gente. Cada region del pais aporta ingredientes autóctonos, tecnicas culinarias tradicionales y sabores unicos que reflejan la historia y la cultura de Colombia.
        </p>
        {/* Contenedor centrado para mostrar el texto "Creado por" */}
        <div className='flex justify-center items-center mt-4'>
          <h1 className='text-white text-xl'>Creado por</h1>
        </div>
        {/* Lista horizontal con enlaces a los creadores */}
        <ul className="mt-4 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          <li>
            <a
              className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
              href="https://github.com/KIDDANY07"
            >
              Daniel Jose Morales Teatino
            </a>
          </li>

          <li>
            <a
              className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
              href="#"
            >
              Shara Bernal
            </a>
          </li>
        </ul>

        {/* Lista con iconos y enlaces sociales, en este caso GitHub */}
        <ul className="mt-12 flex justify-center gap-6 md:gap-8">
          <li>
            <a
              href="https://github.com/KIDDANY07"
              rel="noreferrer"
              target="_blank"
              className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
            >
              {/* Texto oculto para accesibilidad */}
              <span className="sr-only">GitHub</span>
              {/* Icono SVG de GitHub */}
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
