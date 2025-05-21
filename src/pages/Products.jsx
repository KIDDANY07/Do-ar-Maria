// Importacion de librerias necesarias
import React from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react'

// Componente principal de productos
export default function Products() {

  // Obtiene la informacion del usuario desde el contexto
  const { user } = useContext(UserContext);

  // Redirecciona al inicio si el usuario no esta autenticado o no es admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Estados para manejar productos, formularios, carga, errores, y modal
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = 'http://localhost:5000/api/products';

  // Funcion para obtener los productos desde la API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Ejecuta fetchProducts una sola vez al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtra productos en tiempo real segun el termino de busqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, products]);

  // Actualiza el estado del formulario cuando cambia un campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Actualiza el termino de busqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Abre el modal para agregar producto
  const openAddModal = () => {
    setForm({ name: '', description: '', price: '', stock: '', image_url: '' });
    setEditingProduct(null);
    setError(null);
    setIsModalOpen(true);
  };

  // Abre el modal con los datos de un producto para editarlo
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url
    });
    setEditingProduct(product);
    setError(null);
    setIsModalOpen(true);
  };

  // Cierra el modal y reinicia el formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', stock: '', image_url: '' });
    setError(null);
  };

  // Envia el formulario para crear o actualizar un producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(form.price);
    const stockNum = parseInt(form.stock, 10);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('El precio debe ser un numero positivo');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError('El stock debe ser un numero positivo');
      return;
    }

    try {
      const payload = { ...form, price: priceNum, stock: stockNum };
      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct._id || editingProduct.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto');
    }
  };

  // Elimina un producto luego de confirmacion
  const handleDelete = async (id) => {
    if (window.confirm('¿Estas seguro de eliminar este producto?')) {
      setError(null);
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
        setError('Error al eliminar el producto');
      }
    }
  };

  // Renderizado principal del componente
  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">Gestion de Productos</h1>

      {/* Buscador de productos */}
      <input
        type="text"
        placeholder="Buscar producto por nombre..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-6 p-2 border rounded w-full"
      />

      {/* Boton para agregar un producto */}
      <button
        onClick={openAddModal}
        className="bg-orange-600 text-white px-6 py-2 rounded mb-6 hover:bg-orange-800 duration-300 w-full"
      >
        Agregar Producto
      </button>

      {/* Modal de agregar o editar producto */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 shadow-2xl">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </h2>

            {/* Formulario del modal */}
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
                className="p-2 border border-orange-600 focus:outline-orange-600 rounded duration-300"
              />
              <textarea
                name="description"
                placeholder="Descripcion"
                value={form.description}
                onChange={handleChange}
                required
                className="p-2 border border-orange-600 focus:outline-orange-600 rounded duration-300"
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                required
                className="p-2 border border-orange-600 focus:outline-orange-600 rounded duration-300"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="p-2 border border-orange-600 focus:outline-orange-600 rounded duration-300"
              />
              <input
                type="text"
                name="image_url"
                placeholder="URL de imagen"
                value={form.image_url}
                onChange={handleChange}
                required
                className="p-2 border border-orange-600 focus:outline-orange-600 rounded duration-300"
              />

              {/* Mensaje de error si existe */}
              {error && <p className="text-red-500">{error}</p>}

              {/* Botones del modal */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600 duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded ${
                    editingProduct
                      ? 'bg-white border-1 text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white duration-300'
                      : 'bg-white border-1 text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white duration-300'
                  }`}
                >
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de productos renderizados */}
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="border rounded p-4 shadow"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
                <p className="text-orange-600 font-bold">${Number(product.price).toFixed(2)}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-white border-1 border-orange-600 text-orange-600 px-3 py-1 rounded hover:bg-orange-600 hover:text-white duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product._id || product.id)}
                    className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-red-700 duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
