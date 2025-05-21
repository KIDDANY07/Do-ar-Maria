import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

// Componente principal del carrito
export default function Cart() {
  // Se obtiene el usuario desde el contexto
  const { user } = useContext(UserContext);

  // Estado para los productos del carrito
  const [cartItems, setCartItems] = useState([]);

  // Estado para manejar el indicador de carga
  const [loading, setLoading] = useState(true);

  // Funcion para obtener los productos del carrito desde la API
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al detectar cambios en el usuario
  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // Funcion para actualizar la cantidad de un producto
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; 
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/cart/${productId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error('Error actualizando cantidad:', err);
    }
  };

  // Funcion para eliminar un producto del carrito
  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  // Redirecciona si no hay usuario logueado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Muestra pantalla de carga
  if (loading) {
    return <div className="flex justify-center items-center font-semibold h-screen">Cargando carrito...</div>;
  }

  // Muestra mensaje si el carrito esta vacio
  if (cartItems.length === 0) {
    return <div className="flex justify-center items-center font-semibold h-screen">No hay nada en el carrito.</div>;
  }

  // Calculo del subtotal, IVA y total
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const vat = subtotal * 0.1;
  const discount = 0; 
  const total = subtotal + vat - discount;

  // Funcion para simular finalizacion de compra
  const handleSubmitPay = (()=> {
    alert('compra realizada con exito');
  });

  // Retorna la interfaz del carrito
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 px-4 pt-16 mt-12">
      <div className="mx-auto w-full max-w-3xl bg-white rounded shadow p-6 sm:px-6 sm:py-12">
        {/* Encabezado del carrito */}
        <header className="text-center mb-8">
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center'>
            Carrito de {user.name}
          </h1>
        </header>

        {/* Lista de productos en el carrito */}
        <ul className="space-y-6">
          {cartItems.map((item) => (
            <li
              key={item.product_id}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4 border-b pb-4"
            >
              {/* Imagen del producto */}
              <img
                src={item.image_url}
                alt={item.name}
                className="h-20 w-20 sm:h-16 sm:w-16 rounded-sm object-cover self-center"
              />

              {/* Detalles del producto */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              {/* Controles de cantidad y eliminar */}
              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 mt-2 sm:mt-0">
                {/* Boton para disminuir cantidad */}
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  –
                </button>

                {/* Campo para ingresar cantidad manualmente */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1) updateQuantity(item.product_id, val);
                  }}
                  className="w-14 h-8 rounded border border-gray-300 text-center text-sm text-gray-600"
                />

                {/* Boton para aumentar cantidad */}
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  className="w-8 h-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  +
                </button>

                {/* Boton para eliminar producto */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="ml-4 text-gray-600 hover:text-red-600 transition"
                  aria-label={`Eliminar ${item.name} del carrito`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>

              {/* Precio individual total por producto */}
              <div className="sm:w-16 text-right font-semibold text-gray-900 mt-2 sm:mt-0">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        {/* Seccion de resumen de precios */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-right space-y-2 text-sm sm:text-base">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>IVA (10%)</span>
            <span>${vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Descuento</span>
            <span>${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Boton para finalizar la compra */}
          <button
            onClick={handleSubmitPay}
            className="mt-4 w-full rounded bg-gray-800 py-3 text-white hover:bg-orange-600 transition duration-300"
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </section>
  );
}
