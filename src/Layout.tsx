import { Outlet } from "react-router";
import { ToastContainer } from 'react-toastify';
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Layout;