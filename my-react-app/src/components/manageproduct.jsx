import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./manageproduct.css";
import AdminNavbar from "./AdminNavbar";

function ManageProduct() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/deleteproducts/${id}`);
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const editProduct = (product) => {
    navigate("/addproduct", { state: { product } });
  };

  return (
    <>
      <AdminNavbar />

      <div className="manage-container">

        <h2>Manage Products</h2>

        <table className="manage-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {products.map((product) => (
              <tr key={product._id}>

                <td>
                  <img
  src={product.image}
  alt="product"
  width="80"
/>
                </td>

                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>₹{product.price}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}

export default ManageProduct;