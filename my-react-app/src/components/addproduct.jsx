import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./addproduct.css";
import AdminNavbar from "./AdminNavbar";

function AddProducts() {

  const location = useLocation();
  const product = location.state?.product;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {

    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setQuantity(product.quantity);
      setCategory(product.category);
    }

  }, [product]);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
const handleAddProduct = async () => {

  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", Number(price));
  formData.append("quantity", Number(quantity));
  formData.append("category", category);

  if (image) {
    formData.append("image", image);
  }

  try {

    if (product) {
      await axios.put(
        `http://localhost:3001/updateproduct/${product._id}`,
        formData
      );
      alert("Product Updated Successfully");
    } else {
      await axios.post(
        "http://localhost:3001/addproduct",
        formData
      );
      alert("Product Added Successfully");
    }

  } catch (err) {
    console.log(err);
  }
};

  return (
    <>
      <AdminNavbar />

      <div className="add-product-container">

        <h2>{product ? "Edit Product" : "Add New Product"}</h2>

        <label>Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option>Women</option>
          <option>Men</option>
          <option>Boys</option>
          <option>Girls</option>
        </select>

        <label>Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        <button onClick={handleAddProduct}>
          {product ? "Update Product" : "Add Product"}
        </button>

      </div>
    </>
  );
}

export default AddProducts;