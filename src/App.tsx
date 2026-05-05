import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Shipping } from './pages/Shipping';
import { Privacy } from './pages/Privacy';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderTrack } from './pages/OrderTrack';
import { OrderHistory } from './pages/OrderHistory';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { CustomerLogin } from './pages/CustomerLogin';
import { CustomerSignup } from './pages/CustomerSignup';
import { UpdatePassword } from './pages/UpdatePassword';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Main User Site wrapper */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/confirmation" element={<OrderConfirmation />} />
            <Route path="track/:orderId" element={<OrderTrack />} />
            <Route path="history" element={<OrderHistory />} />
            <Route path="auth/login" element={<CustomerLogin />} />
            <Route path="auth/signup" element={<CustomerSignup />} />
            <Route path="auth/update-password" element={<UpdatePassword />} />
          </Route>
          
          {/* Dedicated Admin Portal container */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
