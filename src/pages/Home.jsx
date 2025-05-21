import React, { useEffect, useState, useContext } from 'react';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import HeroBackground from '../components/HeroBackground';

export default function Home() {
  //context user para el manejo de sesiones JWT
  const { user } = useContext(UserContext); 
  //estados
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); 

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //Traer productos y actualizarlo el tiempo real-random
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
      })
      .then((data) => {
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        const shuffled = shuffleArray(data);
        setProducts(shuffled);
        setFilteredProducts(shuffled);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  //Useeffect de productos para filtrar
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando productos...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  //Paginador - productos
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };
  
  //Funcion add cart
  const addToCart = async (product) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Debes iniciar sesión para agregar productos al carrito.');
      setMessageType('error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', {
        product_id: product.id,
        quantity: 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(`Producto "${product.name}" agregado al carrito.`);
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Error al agregar el producto al carrito.');
      setMessageType('error');
    }

    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, 3000);
  };

  // Productos destacados para carrusel (los primeros 6 productos)
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <HeroBackground className="w-full h-full object-cover" />
          <div className="absolute inset-0 backdrop-blur-[1px] bg-black/30" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              Doña Maria
            </h2>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
              Descubre la variedad y riqueza de la comida criolla colombiana. Desde la costa
              Caribe hasta las montañas de los Andes, cada región ofrece sabores únicos y
              deliciosos.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <p href="#">
                Bandeja Paisa 
              </p>
              <p href="#">
                Ajiaco 
              </p>
              <p href="#">
                Sancocho 
              </p>
              <p href="#">
                Arepas 
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Platos principales</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">50+</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Regiones</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">6</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Ingredientes únicos</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">100+</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-gray-300">Recetas tradicionales</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">200+</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      

      {/*Alerta de producto agregado*/}
        {message && (
          <div
            className={`mb-4 mt-2 p-3 text-center rounded ${
              messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}
      {/* Carrusel horizontal */}
      <div className="container mx-auto px-4 my-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Productos Destacados</h3>
        <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-orange-600 scrollbar-track-gray-200 py-2">
          {featuredProducts.map(({id, name, description, price, stock, image_url }) => (
            <div
              key={id}
              className="min-w-[250px] flex-shrink-0 bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => openModal({id, name, description, price, stock, image_url })}
            >
              <img
                src={image_url}
                alt={name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="font-semibold text-lg">{name}</h4>
              <p className="font-bold text-orange-600">${Number(price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      {/*Informacion*/}
      <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
            <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
                <div
                    className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
                    <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
                        <img className=" rounded-xl object-cover" src="https://images.pexels.com/photos/29465172/pexels-photo-29465172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="about Us image" />
                    </div>
                    <img className="sm:ml-0 ml-auto rounded-xl object-cover" src="https://www.infobae.com/new-resizer/j8Tn2FTf03GyboaZXdMHZtfrIjk=/arc-anglerfish-arc2-prod-infobae/public/7ZLBIEXDAFEUFB2MXROVEX2DHI.jpg"
                        alt="about Us image" />
                </div>
                <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                    <div class="w-full flex-col justify-center items-start gap-8 flex">
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                            <h2
                                className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                La comida criolla mas deliciosa de Colombia</h2>
                            <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                          La gastronomía colombiana es tan diversa como su geografía y su gente. Cada región del país aporta ingredientes autóctonos, técnicas culinarias tradicionales y sabores únicos que reflejan la historia y la cultura de Colombia.</p>
                        </div>
                        <div className="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex">
                          <div className="flex-col justify-start items-start inline-flex">
                            <h3 className="text-gray-900 text-3xl lg:text-4xl font-bold font-manrope leading-normal">50+</h3>
                            <h6 className="text-gray-500 text-sm lg:text-base font-normal leading-relaxed">Platos principales</h6>
                          </div>
                          <div className="flex-col justify-start items-start inline-flex">
                            <h4 className="text-gray-900 text-3xl lg:text-4xl font-bold font-manrope leading-normal">100+</h4>
                            <h6 className="text-gray-500 text-sm lg:text-base font-normal leading-relaxed">Ingredientes</h6>
                          </div>
                          <div className="flex-col justify-start items-start inline-flex">
                            <h4 className="text-gray-900 text-3xl lg:text-4xl font-bold font-manrope leading-normal">6</h4>
                            <h6 className="text-gray-500 text-sm lg:text-base font-normal leading-relaxed">Regiones</h6>
                          </div>
                          <div className="flex-col justify-start items-start inline-flex">
                            <h4 className="text-gray-900 text-3xl lg:text-4xl font-bold font-manrope leading-normal">200+</h4>
                            <h6 className="text-gray-500 text-sm lg:text-base font-normal leading-relaxed">Recetas tradicionales</h6>
                          </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Lista de productos */}
      <div className="container mx-auto p-4">
        <div className='pb-4'>
          <span className="flex items-center">
            <span className="h-px flex-1 bg-gray-300"></span>
            <span className="shrink-0 px-4 text-gray-900 md:text-2xl font-bold text-center text-sm">
              ¿Deseas un plato especifico?
            </span>
            <span className="h-px flex-1 bg-gray-300"></span>
          </span>
        </div>

        {/* Campo de búsqueda */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map(({ id, name, description, price, stock, image_url }) => (
            <div key={id} className="rounded-lg p-2 flex flex-col shadow hover:shadow-2xl transition">
              <img src={image_url} alt={name} className="w-full h-38 object-cover mb-4 rounded" />
              <h2 className="font-semibold text-lg mb-2">{name}</h2>
              <p className="text-gray-700 mb-2 line-clamp-3">{description}</p>
              <p className="text-sm text-gray-500 mb-2">Stock: {stock}</p>
              <div className="mt-auto font-bold text-xl">${Number(price).toFixed(2)}</div>
              <button
                onClick={() => openModal({ id, name, description, price, stock, image_url })}
                className="mt-4 px-4 py-2 border border-orange-600 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition duration-300 font-semibold self-start"
              >
                Ver más
              </button>
            </div>
          ))}
        </div>

        {/* Paginador */}
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`px-2 py-2 rounded hidden md:flex ${
                  currentPage === pageNumber
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-64 object-cover rounded mb-4" />
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="mb-4">{selectedProduct.description}</p>
            <p><strong>Precio:</strong> ${Number(selectedProduct.price).toFixed(2)}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>

            {user && (
              <button
                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition duration-300 font-semibold"
                onClick={() => addToCart(selectedProduct)}
              >
                Agregar al carrito
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
