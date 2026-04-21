import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/Home/home";
import Admin from "./components/admin";
import Dashboard from "./components/dashboard";
import Addproduct from "./components/addproduct";
import ManageProduct from "./components/manageproduct";
import ProductDetails from "./components/Home/productdetails";
import Cart from "./components/Home/Cart";
import Checkout from "./components/Home/checkout";
import OrderSuccess from "./components/Home/OrderSuccess";
import ManageOrder from "./components/manageorder";
import Payment from "./components/Home/Payment";
import EditOrder from "./components/EditOrder";
import SearchPage from "./components/Home/Search";
import ManageUser from "./components/manageuser";
import Orders from "./components/Home/orders";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        
        <Route path="/" element={<><Navbar/><Home/></>} />
        <Route path="/productdetails" element={<><Navbar/><ProductDetails/></>} />
        <Route path="/cart" element={<><Navbar/><Cart/></>} />
        <Route path="/checkout" element={<><Navbar/><Checkout/></>} />
        <Route path="/payment" element={<><Navbar/><Payment/></>} />
        <Route path="/ordersuccess" element={<><Navbar/><OrderSuccess/></>} />

        
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Signup />} />
        

        
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/manageproduct" element={<ManageProduct />} />
        <Route path="/manageorder" element={<ManageOrder />} />
        <Route path="/edit-order/:id" element={<EditOrder />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/manageuser" element={<ManageUser/>}/>
        <Route path="/orders" element={<><Navbar/><Orders/></>} />
        

      </Routes>

    </BrowserRouter>
  );
}

export default App;