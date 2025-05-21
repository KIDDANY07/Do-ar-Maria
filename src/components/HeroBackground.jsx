import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Funcion para crear las particulas de la galaxia
function GalaxyParticles() {
  // Referencia para el objeto de puntos (particulas)
  const points = useRef();

  // Cantidad total de particulas
  const particlesCount = 3000;

  // Velocidad actual y objetivo del movimiento del mouse (para animacion)
  const mouseVelocity = useRef({ x: 0, y: 0 });
  const targetVelocity = useRef({ x: 0, y: 0 });

  // Arrays para posiciones, colores y velocidades de cada particula
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const speeds = new Float32Array(particlesCount);

  // Paleta de colores para las particulas
  const colorPalette = [
    new THREE.Color(0x9b5de5),
    new THREE.Color(0xf15bb5),
    new THREE.Color(0xfee440),
    new THREE.Color(0x00bbf9),
    new THREE.Color(0x00f5d4),
  ];

  // Radio maximo para distribuir las particulas en forma esferica
  const radius = 5;

  // Inicializacion de posiciones, colores y velocidades de las particulas
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;

    // Distribucion esferica aleatoria con radio r, angulos theta y phi
    const r = Math.sqrt(Math.random()) * radius;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    // Conversion a coordenadas cartesianas
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Asignacion de un color aleatorio de la paleta
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    // Velocidad angular aleatoria para animacion de cada particula
    speeds[i] = Math.random() * 0.5 + 0.1;
  }

  // Hook para actualizar cada frame de animacion
  useFrame(({ clock, mouse }) => {
    if (!points.current) return; // Espera a que la referencia exista

    // Tiempo transcurrido
    const time = clock.getElapsedTime();

    // Objetivo de velocidad basado en posicion del mouse, amplificado
    targetVelocity.current.x = mouse.x * 2.0;
    targetVelocity.current.y = mouse.y * 2.0;

    // Interpolacion suave de la velocidad actual hacia la objetivo
    mouseVelocity.current.x += (targetVelocity.current.x - mouseVelocity.current.x) * 0.05;
    mouseVelocity.current.y += (targetVelocity.current.y - mouseVelocity.current.y) * 0.05;

    // Acceso al arreglo de posiciones de las particulas para modificarlas
    const positions = points.current.geometry.attributes.position.array;

    // Actualizacion de la posicion de cada particula para crear efecto de rotacion y movimiento
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      // Coordenadas actuales x y z
      const x = positions[i3];
      const z = positions[i3 + 2];

      // Calculo del radio y angulo en el plano XZ
      const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);

      // Nuevo angulo, con rotacion dependiente de la velocidad individual
      const newAngle = angle + speeds[i] * 0.001;

      // Actualizacion de posiciones con efecto de movimiento adicional segun mouse
      positions[i3] = radius * Math.cos(newAngle) + Math.sin(time + i) * 0.002 * mouseVelocity.current.x;
      positions[i3 + 2] = radius * Math.sin(newAngle) + Math.cos(time + i) * 0.002 * mouseVelocity.current.y;
    }

    // Indicamos que la geometria ha cambiado para que se renderice la nueva posicion
    points.current.geometry.attributes.position.needsUpdate = true;

    // Rotacion ligera del conjunto completo de particulas alrededor del eje Y
    points.current.rotation.y += 0.0005;
  });

  // Renderizado del objeto puntos con su geometria y material
  return (
    <points ref={points}>
      <bufferGeometry>
        {/* BufferAttribute para posiciones de las particulas */}
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        {/* BufferAttribute para colores de las particulas */}
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Material con tamanio, transparencia y mezcla aditiva para efectos visuales */}
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Componente principal que renderiza el fondo con las particulas
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 backdrop-blur-md bg-gray-900/30">
      {/* Canvas de react-three-fiber con camara posicionada */}
      <Canvas
        camera={{ position: [0, 0, 7], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Insercion del componente de particulas */}
        <GalaxyParticles />
      </Canvas>
    </div>
  );
}
