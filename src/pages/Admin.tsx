import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'categories'>('dashboard');
  const navigate = useNavigate();

  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenueAllTime: 0,
    revenueThisMonth: 0,
    totalOrders: 0,
    ordersThisMonth: 0,
  });

  // Editor states
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setSession(session);
        fetchData();
      }
      setLoadingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin/login');
    });

    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    // We use the admin backend endpoints to safely query data with service_role key
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    if (!token) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/categories', { headers })
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        calculateStats(ordersData);
      }
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const calculateStats = (data: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let revAllTime = 0;
    let revThisMonth = 0;
    let ordTotal = data.length;
    let ordThisMonth = 0;

    data.forEach(order => {
      if (order.status === 'paid' || order.status === 'fulfilled') {
        revAllTime += Number(order.subtotal);
      }
      const orderDate = new Date(order.created_at);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        ordThisMonth++;
        if (order.status === 'paid' || order.status === 'fulfilled') {
          revThisMonth += Number(order.subtotal);
        }
      }
    });

    setStats({
      revenueAllTime: revAllTime,
      revenueThisMonth: revThisMonth,
      totalOrders: ordTotal,
      ordersThisMonth: ordThisMonth
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loadingSession) return <div className="p-10 font-sans text-on-surface">Loading...</div>;

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 md:pb-0">
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#3B1A00] text-white">
          <h1 className="font-serif text-lg font-bold italic">Selorm Admin</h1>
          <button onClick={handleLogout} className="text-[#FDF3DC]/70 hover:text-white">
              <span className="material-symbols-outlined">logout</span>
          </button>
      </div>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-[#3B1A00] dark:bg-[#2A0E00] flex-col py-8 shadow-2xl border-r border-[#C97D0A]/10 z-50">
        <div className="px-6 mb-10">
          <h1 className="font-serif text-white text-xl font-bold italic">Selorm Admin</h1>
          <p className="font-sans text-xs uppercase tracking-widest text-[#FDF3DC]/60 mt-1">Kitchen Lead</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-200 ${
              activeTab === 'dashboard' ? 'text-[#FDF3DC] bg-[#C97D0A]' : 'text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10'
            }`}
          >
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-sans text-sm tracking-wide">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-200 ${
              activeTab === 'menu' ? 'text-[#FDF3DC] bg-[#C97D0A]' : 'text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10'
            }`}
          >
            <span className="material-symbols-outlined mr-3">restaurant_menu</span>
            <span className="font-sans text-sm tracking-wide">Menu</span>
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-200 ${
              activeTab === 'categories' ? 'text-[#FDF3DC] bg-[#C97D0A]' : 'text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10'
            }`}
          >
            <span className="material-symbols-outlined mr-3">category</span>
            <span className="font-sans text-sm tracking-wide">Categories</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-200 ${
              activeTab === 'orders' ? 'text-[#FDF3DC] bg-[#C97D0A]' : 'text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10'
            }`}
          >
            <span className="material-symbols-outlined mr-3">receipt_long</span>
            <span className="font-sans text-sm tracking-wide">Orders</span>
          </button>
        </nav>

        <div className="px-4 mb-6">
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); setActiveTab('menu'); }}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white rounded-xl py-3 flex items-center justify-center font-semibold transition-transform active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Add New Item
          </button>
        </div>
        
        <div className="mt-auto border-t border-[#FDF3DC]/10 pt-4">
            <Link to="/" className="w-full flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 transition-all">
              <span className="material-symbols-outlined mr-3">store</span>
              <span className="font-sans text-sm tracking-wide">Storefront</span>
            </Link>
            <button className="w-full flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 transition-all">
              <span className="material-symbols-outlined mr-3">settings</span>
              <span className="font-sans text-sm tracking-wide">Settings</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 transition-all">
              <span className="material-symbols-outlined mr-3">logout</span>
            <span className="font-sans text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-0 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-200px)]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-on-surface">Kitchen Overview</h2>
            <p className="text-on-surface-variant mt-1 md:mt-2 font-sans text-sm md:text-base">Welcome back, Selorm. Here is what's cooking today.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-2 md:gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
              <span className="text-xs md:text-sm font-medium">{today}</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardTab orders={orders} stats={stats} products={products} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} refresh={fetchData} />}
        {activeTab === 'menu' && (
          <MenuTab 
            products={products} 
            categories={categories}
            refresh={fetchData} 
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {activeTab === 'categories' && (
          <CategoriesTab categories={categories} refresh={fetchData} />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#3B1A00] border-t-2 border-[#C97D0A] z-40 px-2 pt-2 pb-safe flex justify-around items-center font-sans shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
        <button 
           onClick={() => setActiveTab('dashboard')}
           className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-[#C97D0A]' : 'text-white/60'}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold mt-1">Dashboard</span>
        </button>
        <button 
           onClick={() => setActiveTab('menu')}
           className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'menu' ? 'text-[#C97D0A]' : 'text-white/60'}`}
        >
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span className="text-[10px] font-bold mt-1">Menu</span>
        </button>
        <button 
           onClick={() => setActiveTab('orders')}
           className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'orders' ? 'text-[#C97D0A]' : 'text-white/60'}`}
        >
          <div className="relative">
             <span className="material-symbols-outlined">receipt_long</span>
             {orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full border border-[#3B1A00]"></span>
             )}
          </div>
          <span className="text-[10px] font-bold mt-1">Orders</span>
        </button>
        <button 
           onClick={() => { setEditingProduct(null); setIsModalOpen(true); setActiveTab('menu'); }}
           className="flex flex-col items-center p-2 rounded-xl transition-all text-white/60 hover:text-white"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[10px] font-bold mt-1">Add</span>
        </button>
        <Link to="/" className="flex flex-col items-center p-2 rounded-xl transition-all text-white/60 hover:text-white">
          <span className="material-symbols-outlined">store</span>
          <span className="text-[10px] font-bold mt-1">Store</span>
        </Link>
      </div>
      
      {/* Contextual FAB - Quick Action */}
      <button className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-[0_20px_40px_rgba(132,80,0,0.2)] items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary rounded-full border-2 border-background text-[10px] flex items-center justify-center font-bold">
          {orders.filter(o => o.status === 'pending').length || '0'}
        </span>
      </button>
    </div>
  );
};

// --- TABS ---

function DashboardTab({ orders, stats, products }: { orders: any[], stats: any, products: any[] }) {
  // Chart transforms
  const dailyRevenue = processDailyRevenue(orders);
  const salesByCategory = processSalesByCategory(orders, products);
  const COLORS = ['#C97D0A', '#3B1A00', '#C0392B', '#E8A020'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Status Cards (Tonal Layering) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-primary shadow-sm">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Daily Revenue</p>
          <h3 className="font-serif text-3xl text-primary mt-2">${stats.revenueThisMonth.toFixed(2)}</h3>
          <div className="flex items-center text-xs text-green-600 mt-2 font-bold">
            <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span> 
            In progress
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-secondary shadow-sm">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Active Orders</p>
          <h3 className="font-serif text-3xl text-secondary mt-2">{stats.ordersThisMonth}</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-bold">{orders.filter((o:any) => o.status === 'pending').length} pending</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-tertiary shadow-sm">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Stock Alerts</p>
          <h3 className="font-serif text-3xl text-tertiary mt-2">0 Items</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-bold">All stock optimal</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-primary shadow-sm">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Customer Rating</p>
          <h3 className="font-serif text-3xl text-[#2B1700] mt-2">4.9/5</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-bold">Based on early reviews</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        
        {/* Revenue Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container p-8 rounded-xl relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-serif text-xl font-bold">Daily Revenue (Last 7 Days)</h4>
          </div>
          
          <div className="h-64 mt-4">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{stroke: '#e0e0e0', strokeWidth: 2, fill: 'transparent'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Revenue']} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C97D0A" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#C97D0A' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container p-8 rounded-xl shadow-sm relative overflow-hidden">
          <h4 className="font-serif text-xl font-bold mb-6">Sales by Category</h4>
          <div className="h-64 flex justify-center items-center">
            {salesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [value, 'Units Sold']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm italic text-on-surface-variant">No sales data available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Live Orders Grid */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-12 bg-surface-container-high p-8 rounded-xl shadow-inner">
          <h4 className="font-serif text-xl font-bold mb-6">Live Orders Feed</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {orders.slice(0, 6).map((order) => (
               <div key={order.id} className="flex flex-col bg-white p-4 justify-between rounded-lg shadow-sm border border-outline-variant/30">
                 <div className="flex justify-between items-start mb-3">
                   <p className="text-sm font-bold text-on-surface">Order #{order.id.slice(0, 8)}</p>
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                     order.status === 'paid' ? 'bg-green-100 text-green-700' :
                     order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-gray-200 text-gray-700'
                   }`}>
                     {order.status}
                   </span>
                 </div>
                 <p className="text-xs text-on-surface-variant font-body mb-4 flex-grow">
                   {order.items?.map((i:any) => `${i.quantity}x ${i.name}`).join(', ')}
                 </p>
                 <div className="flex justify-between items-center mt-auto border-t border-outline-variant/30 pt-3">
                   <p className="text-sm font-bold text-primary">${Number(order.subtotal).toFixed(2)}</p>
                   <p className="text-[10px] text-on-surface-variant/60 italic">
                     {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </p>
                 </div>
               </div>
            ))}
            
            {orders.length === 0 && (
              <p className="text-sm italic text-on-surface-variant col-span-full">No active orders right now.</p>
            )}

          </div>
          {orders.length > 6 && (
            <button className="w-full mt-6 text-xs font-bold text-primary uppercase tracking-widest hover:underline text-center">View All Orders</button>
          )}
        </div>
      </div>
    
    </div>
  );
}

function OrdersTab({ orders, refresh }: { orders: any[], refresh: () => void }) {
  const [filter, setFilter] = useState('All');
  const [trackingNumber, setTrackingNumber] = useState<{ [id: string]: string }>({});
  const [carrier, setCarrier] = useState<{ [id: string]: string }>({});

  const updateStatus = async (id: string, status: string) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    const payload: any = { status };
    if (status === 'shipped') {
       const existingOrder = orders.find(o => o.id === id);
       payload.tracking_number = trackingNumber[id] !== undefined ? trackingNumber[id] : (existingOrder?.tracking_number || '');
       payload.carrier = carrier[id] !== undefined ? carrier[id] : (existingOrder?.carrier || 'USPS');
    }

    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    refresh();
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
           <span className="material-symbols-outlined text-primary">receipt_long</span> Orders Management
        </h2>
        <select 
          className="border-none bg-surface-container-high rounded-lg px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Processing">Processing</option>
          <option value="Ready_for_pickup">Ready for Pickup</option>
          <option value="Out_for_delivery">Out for Delivery</option>
          <option value="Shipped">Shipped</option>
          <option value="Fulfilled">Fulfilled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-lowest border-b border-outline-variant">
              <tr>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Date</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Customer</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Items</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Total</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredOrders.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant text-sm">No orders found.</td></tr>
              )}
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="p-4 text-xs font-mono text-on-surface-variant">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold text-on-surface">{order.customer_email}</td>
                  <td className="p-4 text-sm text-on-surface-variant max-w-[250px] truncate">
                    {order.items?.map((i:any) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="p-4 text-sm font-bold text-primary">${Number(order.subtotal).toFixed(2)}</td>
                  <td className="p-4 text-right flex flex-col items-end gap-2">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`border-none rounded-full px-3 py-1 text-xs uppercase font-bold tracking-wide outline-none cursor-pointer ${
                         order.status === 'paid' ? 'bg-green-100 text-green-800' :
                         order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                         order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                         order.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                         order.status === 'ready_for_pickup' ? 'bg-amber-100 text-amber-800' :
                         order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                         'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing (Being Prepared)</option>
                      <option value="paid">Paid</option>
                      <option value="ready_for_pickup">Ready for Pickup</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="shipped">Shipped</option>
                      <option value="fulfilled">Fulfilled</option>
                    </select>

                    {order.status === 'shipped' && (
                        <div className="flex gap-2 items-center justify-end flex-col md:flex-row mt-2">
                            <input 
                               type="text"
                               placeholder="Tracking #"
                               value={trackingNumber[order.id] !== undefined ? trackingNumber[order.id] : (order.tracking_number || '')}
                               onChange={(e) => setTrackingNumber({...trackingNumber, [order.id]: e.target.value})}
                               className="text-xs p-1 border rounded w-32"
                            />
                            <select 
                               value={carrier[order.id] !== undefined ? carrier[order.id] : (order.carrier || 'USPS')}
                               onChange={(e) => setCarrier({...carrier, [order.id]: e.target.value})}
                               className="text-xs p-1 border rounded"
                            >
                               <option value="USPS">USPS</option>
                               <option value="UPS">UPS</option>
                               <option value="FedEx">FedEx</option>
                            </select>
                            <button 
                               onClick={() => updateStatus(order.id, 'shipped')}
                               className="text-xs font-bold bg-[#C97D0A] text-white px-2 py-1.5 rounded flex items-center gap-1"
                            >
                               Save
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MenuTab({ products, categories, refresh, editingProduct, setEditingProduct, isModalOpen, setIsModalOpen }: any) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  
  const toggleAvailable = async (id: string, isAvailable: boolean) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ is_available: !isAvailable })
    });
    refresh();
  };

  const deleteProduct = async (id: string) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return;
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    refresh();
  };

  const filteredProducts = products.filter((p:any) => {
     const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
     const matchesCat = catFilter === 'all' || p.category === catFilter;
     return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-surface-container-high text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
             onClick={() => setCatFilter('all')}
             className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${catFilter === 'all' ? 'bg-[#C97D0A] text-white border-[#C97D0A]' : 'bg-surface-container-high text-on-surface border-outline-variant'}`}
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            All
          </button>
          
          {categories?.map((c: any) => (
             <button 
                key={c.id || c.slug}
                onClick={() => setCatFilter(c.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${catFilter === c.slug ? 'bg-[#C97D0A] text-white border-[#C97D0A]' : 'bg-surface-container-high text-on-surface border-outline-variant'}`}
             >
                {c.name}
             </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-lowest border-b border-outline-variant">
              <tr>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant w-[80px]">Image</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Name</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Category</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Price</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Status</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredProducts.map((p: any) => (
                <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-surface-container rounded-md overflow-hidden skeleton shadow-sm">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-on-surface">{p.name}</td>
                  <td className="p-4 text-sm text-on-surface-variant capitalize">{p.category}</td>
                  <td className="p-4 text-sm font-mono text-on-surface">${Number(p.price).toFixed(2)}</td>
                  <td className="p-4">
                    <label className="flex items-center cursor-pointer w-max">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={p.is_available} onChange={() => toggleAvailable(p.id, p.is_available)} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${p.is_available ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${p.is_available ? 'translate-x-4' : ''} shadow-sm`}></div>
                      </div>
                      <span className="ml-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        {p.is_available ? 'In Stock' : 'Out'}
                      </span>
                    </label>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-primary hover:text-primary-container p-1 rounded transition-colors mr-2">
                       <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-tertiary hover:text-red-800 p-1 rounded transition-colors">
                       <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant text-sm">No items match your search.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          categories={categories}
          onClose={() => setIsModalOpen(false)} 
          refresh={() => { refresh(); setIsModalOpen(false); }} 
        />
      )}
    </div>
  );
}

function CategoriesTab({ categories, refresh }: any) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    if (editingId) {
       const cat = categories.find((c:any) => c.id === editingId);
       await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, slug, oldSlug: cat?.slug })
       });
    } else {
       await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, slug })
       });
    }
    setEditingId(null);
    setName('');
    setSlug('');
    refresh();
  };

  const handleDelete = async (id: string, catName: string) => {
     if(!window.confirm(`Are you sure you want to delete the category "${catName}"? Products in this category will still exist but lack a valid category.`)) return;
     const token = (await supabase.auth.getSession()).data.session?.access_token;
     await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
     });
     refresh();
  };

  const handleEdit = (cat: any) => {
     setEditingId(cat.id);
     setName(cat.name);
     setSlug(cat.slug);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-surface-container p-6 rounded-xl shadow-sm border border-outline-variant">
         <h3 className="font-serif text-xl font-bold mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full">
               <label className="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
               <input type="text" value={name} onChange={e => { setName(e.target.value); if(!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }} className="w-full border rounded p-2" required />
            </div>
            <div className="w-full">
               <label className="block text-xs font-bold uppercase tracking-wider mb-1">Slug (Identifier)</label>
               <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border rounded p-2" required />
            </div>
            <div className="flex gap-2">
               {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setName(''); setSlug(''); }} className="px-4 py-2 bg-surface-container-high rounded text-sm font-bold">Cancel</button>
               )}
               <button type="submit" className="px-6 py-2 bg-[#C97D0A] text-white rounded font-bold shadow-sm">{editingId ? 'Update' : 'Add'}</button>
            </div>
         </form>
         <p className="text-sm text-on-surface-variant mt-3 italic">
            Note: The slug must be a database-friendly identifier. E.g. name "Ice Cream" = slug "icecream".
            If you do not have a <code>categories</code> table created in Supabase yet, creating/editing categories here will not persist cleanly. Make sure the table exists!
         </p>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                <th className="p-4 font-bold w-1/3">Name</th>
                <th className="p-4 font-bold w-1/3">Slug</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
               {categories.map((c: any) => (
                  <tr key={c.id || c.slug} className="hover:bg-surface-container-lowest transition-colors">
                     <td className="p-4 text-sm font-bold">{c.name}</td>
                     <td className="p-4 text-sm font-mono text-on-surface-variant">{c.slug}</td>
                     <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEdit(c)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button onClick={() => handleDelete(c.id, c.name)} className="p-2 text-error hover:bg-error/10 rounded-lg"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                     </td>
                  </tr>
               ))}
               {categories.length === 0 && (
                  <tr><td colSpan={3} className="p-4 text-center text-on-surface-variant">No categories found.</td></tr>
               )}
            </tbody>
          </table>
       </div>
    </div>
  );
}

// Modal Component for Menu Editor
function ProductModal({ product, categories, onClose, refresh }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'drink',
    price: product?.price || 0,
    unit_label: product?.unit_label || '',
    short_description: product?.short_description || '',
    full_description: product?.full_description || '',
    cultural_origin: product?.cultural_origin || '',
    health_benefits: Array.isArray(product?.health_benefits) ? product.health_benefits.join(', ') : (product?.health_benefits || ''),
    ingredients: Array.isArray(product?.ingredients) ? product.ingredients.join(', ') : (product?.ingredients || ''),
    sizes: Array.isArray(product?.sizes) ? product.sizes : [],
    image_url: product?.image_url || '',
    is_available: product ? product.is_available : true,
    allowed_fulfillment_methods: Array.isArray(product?.allowed_fulfillment_methods) ? product.allowed_fulfillment_methods : ['pickup', 'local_delivery', 'extended_delivery', 'west_coast_shipping', 'nationwide_shipping'],
    fulfillment_minimums: product?.fulfillment_minimums || {},
  });

  const handleSizeAdd = () => {
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, { label: '', price: 0 }] }));
  };

  const handleSizeRemove = (index: number) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const handleSizeChange = (index: number, field: 'label' | 'price', value: string | number) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: field === 'price' ? Number(value) : value };
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    const payload = {
      ...formData,
      health_benefits: formData.health_benefits.split(',').map((s:string) => s.trim()).filter(Boolean),
      ingredients: formData.ingredients.split(',').map((s:string) => s.trim()).filter(Boolean),
    };

    const url = product ? `/api/admin/products/${product.id}` : `/api/admin/products`;
    const method = product ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    refresh();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2" required>
                 <option value="">Select a category</option>
                 {categories?.map((c: any) => (
                    <option key={c.slug || c.id} value={c.slug}>{c.name}</option>
                 ))}
                 {(!categories || categories.length === 0) && (
                    <option value={formData.category}>{formData.category || 'No categories available'}</option>
                 )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Base Price</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Unit Label</label>
              <input name="unit_label" placeholder="e.g. 8oz bottle" value={formData.unit_label} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
          </div>
          
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider">Product Sizes / Pricing Options (Optional)</label>
              <button type="button" onClick={handleSizeAdd} className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded text-xs items-center flex font-bold gap-1">
                <span className="material-symbols-outlined text-sm">add</span> Add Size
              </button>
            </div>
            {formData.sizes.length > 0 ? (
              <div className="space-y-2 mt-2">
                {formData.sizes.map((size: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="e.g. 1 Gallon, Large" 
                      value={size.label} 
                      onChange={(e) => handleSizeChange(idx, 'label', e.target.value)} 
                      className="flex-1 border rounded p-2 text-sm" 
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={size.price} 
                        onChange={(e) => handleSizeChange(idx, 'price', e.target.value)} 
                        className="w-24 pl-6 border rounded p-2 text-sm" 
                      />
                    </div>
                    <button type="button" onClick={() => handleSizeRemove(idx)} className="text-tertiary hover:text-red-800 p-2 rounded">
                       <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-xs text-on-surface-variant italic mt-1">If no sizes are added, the Base Price and Unit Label will be used exclusively.</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Image URL or Upload</label>
            <div className="flex gap-2 items-center">
              <input name="image_url" value={formData.image_url} onChange={handleChange} className="flex-1 w-full border rounded p-2" required placeholder="https://..." />
              <span className="text-sm font-bold text-gray-500">OR</span>
              <label className="bg-surface-container-high hover:bg-surface-container-highest cursor-pointer px-4 py-2 rounded border border-outline-variant font-bold text-sm">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, image_url: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
            {formData.image_url && formData.image_url.startsWith('data:image') && (
               <div className="mt-2 text-xs text-green-600 font-bold">Image loaded successfully</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Short Description</label>
            <input name="short_description" value={formData.short_description} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Full Description</label>
            <textarea name="full_description" value={formData.full_description} onChange={handleChange} className="w-full border rounded p-2 h-20" />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Cultural Origin</label>
            <textarea name="cultural_origin" value={formData.cultural_origin} onChange={handleChange} className="w-full border rounded p-2 h-20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Ingredients (comma separated)</label>
              <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} className="w-full border rounded p-2 h-20" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Health Benefits (comma separated)</label>
              <textarea name="health_benefits" value={formData.health_benefits} onChange={handleChange} className="w-full border rounded p-2 h-20" />
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Fulfillment Methods & Minimum Quantities</label>
            <div className="space-y-4">
              {[
                  { value: 'pickup', label: 'Pickup' },
                  { value: 'local_delivery', label: 'Local Delivery' },
                  { value: 'extended_delivery', label: 'Extended Bay Area Delivery' },
                  { value: 'west_coast_shipping', label: 'West Coast Shipping' },
                  { value: 'nationwide_shipping', label: 'Nationwide Shipping' },
              ].map(opt => (
                <div key={opt.value} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="flex items-center gap-3 sm:w-1/2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                      checked={formData.allowed_fulfillment_methods.includes(opt.value)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => ({ 
                           ...prev, 
                           allowed_fulfillment_methods: checked 
                             ? [...prev.allowed_fulfillment_methods, opt.value] 
                             : prev.allowed_fulfillment_methods.filter(m => m !== opt.value) 
                        }));
                      }}
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant w-16 uppercase tracking-wider font-bold">Min Qty:</span>
                    <input 
                       type="number" 
                       className="border rounded px-3 py-1.5 w-24 text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-surface-container-highest disabled:text-on-surface-variant/50 disabled:cursor-not-allowed" 
                       min="0"
                       disabled={!formData.allowed_fulfillment_methods.includes(opt.value)}
                       value={formData.fulfillment_minimums[opt.value] || ''}
                       onChange={(e) => setFormData(prev => ({
                           ...prev,
                           fulfillment_minimums: {
                              ...prev.fulfillment_minimums,
                              [opt.value]: Number(e.target.value) || 0
                           }
                       }))}
                       placeholder="e.g. 1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded font-bold bg-[#C97D0A] text-white hover:bg-[#A86606]">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helpers for Dashboard Charts
function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#C97D0A]/20 transform transition-transform hover:scale-105">
      <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">{title}</h3>
      <p className="text-4xl font-serif font-bold text-[#3B1A00]">{value}</p>
    </div>
  )
}

function processDailyRevenue(orders: any[]) {
  const days: Record<string, number> = {};
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days[label] = 0;
  }

  orders.forEach(o => {
    if(o.status === 'paid' || o.status === 'processing' || o.status === 'fulfilled') {
      const d = new Date(o.created_at);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Only add if it's within the last 7 days window we initialized
      if (days[label] !== undefined) {
        days[label] += Number(o.subtotal);
      }
    }
  });
  
  return Object.keys(days).map(date => ({ date, revenue: days[date] }));
}

function processSalesByCategory(orders: any[], products: any[]) {
  const categoryCounts: Record<string, number> = {};
  
  // Create a map to quickly look up product category by its ID or name
  const productCategoryMap: Record<string, string> = {};
  products.forEach(p => {
    // some orders might save product ID, some might save details. Assuming name or ID is available.
    productCategoryMap[p.id] = p.category;
    productCategoryMap[p.name] = p.category;
  });

  orders.forEach(o => {
    if(o.status !== 'pending' && o.items) {
      o.items.forEach((item: any) => {
        // Try finding category by ID, fallback to name, default to 'Unknown'
        const category = productCategoryMap[item.productId] || productCategoryMap[item.name] || 'Other';
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        categoryCounts[formattedCategory] = (categoryCounts[formattedCategory] || 0) + item.quantity;
      });
    }
  });

  return Object.keys(categoryCounts).map(name => ({ name, value: categoryCounts[name] }));
}

function processOrderStatus(orders: any[]) {
  const counts: Record<string, number> = { pending: 0, processing: 0, paid: 0, ready_for_pickup: 0, out_for_delivery: 0, shipped: 0, fulfilled: 0 };
  orders.forEach(o => {
    if(counts[o.status] !== undefined) counts[o.status]++;
    else counts.other = (counts.other || 0) + 1;
  });
  return Object.keys(counts).map(name => ({ name: name.replace(/_/g, ' ').toUpperCase(), value: counts[name] })).filter(item => item.value > 0);
}
