import React from "react";
// Se importan las imagenes de los perfiles
import danielImg from "../assets/about/daniel.jpg";
import sharaImg from "../assets/about/shara.jpg";
// Se importa el componente de pie de pagina
import Footer from "../components/Footer";

// Componente para mostrar el titulo de una seccion
function SectionTitle({ children }) {
  return (
    <div className="flex flex-col items-center mb-12">
      <h2 className="text-5xl font-extrabold text-orange-600 drop-shadow-md relative text-center">
        {children}
      </h2>
      {/* Linea decorativa debajo del titulo */}
      <div className="mt-2 w-24 h-1 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400 rounded-full shadow-lg" />
    </div>
  );
}

// Componente para mostrar la tarjeta de perfil de una persona
function ProfileCard({
  name,
  description,
  skills,
  githubUrl,
  imageSrc,
  imageAlt,
  reverse = false, // Permite invertir el orden de los elementos en pantallas pequenas
}) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col items-center gap-8 p-12
      ${reverse ? "flex-col-reverse" : ""} w-full lg:w-1/2`}
    >
      {/* Seccion de imagen de perfil */}
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="rounded-full w-80 h-80 object-cover shadow-2xl border-2 border-orange-300 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Seccion de informacion del perfil */}
      <div className="space-y-8 max-w-xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          {name}
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed">{description}</p>

        {/* Lista de habilidades */}
        <ul className="flex flex-col gap-3 text-gray-600 text-lg list-disc list-inside">
          {skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        {/* Enlace al perfil de GitHub */}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-orange-600 hover:text-orange-800 transition-colors text-lg font-semibold justify-center"
          aria-label={`Visitar perfil de GitHub de ${name}`}
        >
          {/* Icono de GitHub */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          GitHub
        </a>
      </div>
    </div>
  );
}

// Componente principal de la pagina "About"
export default function About() {
  // Informacion del perfil de Daniel
  const daniel = {
    name: "Daniel Jose Morales Teatino",
    description: `Soy estudiante de Ingenieria de Software apasionado por la creacion
      de soluciones innovadoras y eficientes. Tengo experiencia en desarrollo
      frontend con React, Vite y TailwindCSS, y backend con Node.js y MySQL.`,
    skills: [
      "🎓 Ingenieria de Software de la Universidad de Cundinamarca",
      "💻 Frontend: React, Vite, TailwindCSS",
      "🛠 Backend: Node.js, PHP, MySQL",
    ],
    githubUrl: "https://github.com/KIDDANY07",
    imageSrc: danielImg,
    imageAlt: "DanielJoseMoralesTeatino",
  };

  // Informacion del perfil de Shara
  const shara = {
    name: "Shara Brigith Bernal Angel",
    description: `Soy estudiante de ingeniería de software creo tecnología con propósito. Soy programadora enfocada en el desarrollo de soluciones digitales funcionales, humanas y creativas. Me encanta aprender, resolver problemas y transformar ideas en código útil.`,
    skills: [
      "🎓 Ingenieria de Software de la Universidad de Cundinamarca",
      "💻 Frontend: JavaScript, CSS y Boostrap",
      "🛠 Backend: Python, Java, PHP",
    ],
    githubUrl: "https://github.com/Colibri33",
    imageSrc: sharaImg,
    imageAlt: "SharaBernal",
  };

  // Estructura principal de la pagina
  return (
    <div className="bg-gray-50 min-h-screen pt-18">
      {/* Seccion de titulo */}
      <div className="bg-white py-12 shadow-lg">
        <SectionTitle>Equipo de trabajo</SectionTitle>
      </div>

      {/* Seccion de perfiles */}
      <section className="pt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 flex flex-col lg:flex-row gap-12 items-center">
          <ProfileCard {...daniel} />
          <ProfileCard {...shara} />
        </div>
      </section>

      {/* Pie de pagina */}
      <Footer />
    </div>
  );
}
