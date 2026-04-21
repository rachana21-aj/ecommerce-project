import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../CartContext";
import "./search.css";

function SearchPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const query = new URLSearchParams(location.search).get("query");

  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState({});

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query?.toLowerCase())
  );

  const handleSize = (id, size) => {
    setSizes({ ...sizes, [id]: size });
  };

  const addCart = (product) => {

    const size = sizes[product._id];

    if (!size) {
      alert("Please select size");
      return;
    }

    addToCart({
  _id: product._id,
  name: product.name,
  price: product.price,
  image: product.image,
  size: size,
  quantity: 1
});
  };

  const buyNow = (product) => {

    const size = sizes[product._id];

    if (!size) {
      alert("Please select size");
      return;
    }

    navigate("/checkout", {
      state: {
        product: product,
        size: size,
        quantity: 1
      }
    });
  };

  return (

    <div className="search-container">

      <h2>Search Results for "{query}"</h2>

      {filteredProducts.length === 0 && <p>No products found</p>}

      <div className="product-grid">

        {filteredProducts.map((p) => (

          <div className="product-card" key={p._id}>

            <img
  src={p.image}
  alt={p.name}
/>

            <h4>{p.name}</h4>

            <p>₹ {p.price}</p>

            <select
              value={sizes[p._id] || ""}
              onChange={(e) => handleSize(p._id, e.target.value)}
            >
              <option value="">Select Size</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>

            <div className="btn-group">

              <button onClick={() => addCart(p)}>
                Add to Cart
              </button>

              <button onClick={() => buyNow(p)}>
                Buy Now
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default SearchPage;