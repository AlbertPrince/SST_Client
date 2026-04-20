import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALLOWED_EMAILS = ['apmensah@gmail.com', 'sst.treat@gmail.com'];

export const Admin = () => {
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Unauthorized access. This portal is for kitchen leads only.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface-container rounded-3xl p-8 shadow-xl border border-outline-variant/20">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Admin Portal</h1>
            <p className="text-on-surface-variant font-body">Sign in to manage kitchen operations.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">Auth Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t-md text-lg outline-none font-body"
                placeholder="kitchen@example.com"
                required
              />
              {error && <p className="text-error text-sm mt-2 font-medium">{error}</p>}
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full text-lg font-bold font-headline shadow-md hover:-translate-y-1 transition-transform active:scale-95"
            >
              Access Kitchen
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/')} className="text-sm font-bold text-primary hover:text-primary-container transition-colors tracking-wide underline underline-offset-4">
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#3B1A00] dark:bg-[#2A0E00] flex flex-col py-8 shadow-2xl border-r border-[#C97D0A]/10 z-50">
        {/* Brand Identity */}
        <div className="px-6 mb-10 flex items-center justify-between gap-3">
          <div>
             <h1 className="font-headline text-white text-xl font-bold italic">Selorm Admin</h1>
             <p className="font-body text-xs uppercase tracking-widest text-[#FDF3DC]/60 mt-1">Kitchen Lead</p>
          </div>
          <img src="/logo.png" alt="SST Logo" className="h-12 w-auto object-contain brightness-0 invert opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-2">
          <a className="flex items-center px-4 py-3 text-[#FDF3DC] bg-[#C97D0A] rounded-xl mx-2 my-1 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-body text-sm font-semibold tracking-wide">Dashboard</span>
          </a>
          <a className="flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 my-1 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">restaurant_menu</span>
            <span className="font-body text-sm font-medium tracking-wide">Menu Management</span>
          </a>
          <a className="flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 my-1 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">receipt_long</span>
            <span className="font-body text-sm font-medium tracking-wide">Orders</span>
          </a>
          <a className="flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 my-1 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">analytics</span>
            <span className="font-body text-sm font-medium tracking-wide">Analytics</span>
          </a>
        </nav>
        
        {/* CTA Action */}
        <div className="px-4 mb-6">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white rounded-xl py-3 flex items-center justify-center font-bold font-body transition-transform active:scale-95 duration-200 shadow-md">
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Add New Item
          </button>
        </div>
        
        {/* Footer Tabs */}
        <div className="mt-auto border-t border-[#FDF3DC]/10 pt-4">
          <a className="flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 transition-all cursor-pointer">
            <span className="material-symbols-outlined mr-3">settings</span>
            <span className="font-body text-sm tracking-wide">Settings</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-[#FDF3DC]/70 hover:bg-[#FDF3DC]/10 rounded-xl mx-2 transition-all text-left">
            <span className="material-symbols-outlined mr-3">logout</span>
            <span className="font-body text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 p-8 min-h-screen w-full">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl font-bold text-on-surface">Kitchen Overview</h2>
            <p className="text-on-surface-variant mt-2 font-body text-lg">Welcome back, Selorm. Here is what's cooking today.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              <span className="text-sm font-bold font-headline">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Status Cards (Tonal Layering) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-primary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Daily Revenue</p>
            <h3 className="font-headline text-3xl font-bold text-primary">₵1,240.00</h3>
            <div className="flex items-center text-xs text-green-600 mt-3 font-bold bg-green-50 w-fit px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span> 12% vs yesterday
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-secondary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Active Orders</p>
            <h3 className="font-headline text-3xl font-bold text-secondary">18</h3>
            <p className="text-xs text-on-surface-variant mt-3 font-medium">6 pending pick-up</p>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-tertiary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Stock Alerts</p>
            <h3 className="font-headline text-3xl font-bold text-tertiary">3 Items</h3>
            <p className="text-xs text-on-surface-variant mt-3 font-medium text-error">Plantain running low</p>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl border-t-4 border-primary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">Customer Rating</p>
            <h3 className="font-headline text-3xl font-bold text-on-primary-fixed">4.9/5</h3>
            <p className="text-xs text-on-surface-variant mt-3 font-medium">Based on 124 reviews</p>
          </div>
        </div>

        {/* Asymmetric Bento Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Revenue Chart (Simulated Visualization) */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container p-8 rounded-2xl relative overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline text-2xl font-bold">Revenue Dynamics</h4>
              <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            {/* Visual Placeholder for Chart */}
            <div className="h-64 flex items-end gap-3 px-2">
              <div className="bg-primary/20 w-full rounded-t-lg transition-all hover:bg-primary/40" style={{ height: '60%' }}></div>
              <div className="bg-primary/20 w-full rounded-t-lg transition-all hover:bg-primary/40" style={{ height: '45%' }}></div>
              <div className="bg-primary/20 w-full rounded-t-lg transition-all hover:bg-primary/40" style={{ height: '85%' }}></div>
              <div className="bg-primary/20 w-full rounded-t-lg transition-all hover:bg-primary/40" style={{ height: '70%' }}></div>
              <div className="bg-primary w-full rounded-t-lg transition-all hover:bg-primary-container shadow-md" style={{ height: '95%' }}></div>
              <div className="bg-primary/20 w-full rounded-t-lg transition-all hover:bg-primary/40" style={{ height: '50%' }}></div>
              <div className="bg-primary/20 w-full rounded-t-lg transition-all hover:bg-primary/40" style={{ height: '65%' }}></div>
            </div>
            <div className="flex justify-between mt-4 text-xs uppercase tracking-widest text-on-surface-variant font-bold px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Recent Orders Feed */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-high p-8 rounded-2xl shadow-inner border border-outline-variant/20 flex flex-col">
            <h4 className="font-headline text-2xl font-bold mb-6">Live Orders</h4>
            <div className="space-y-6 overflow-y-auto flex-grow" style={{ maxHeight: '380px' }}>
              {/* Order Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">shopping_basket</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold font-headline">#ST-1094</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold uppercase tracking-wider">Paid</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium font-body mt-1">2x Kelewele, 1x Sobolo</p>
                  <p className="text-[11px] text-on-surface-variant/70 mt-2 italic">2 mins ago • Pick-up</p>
                </div>
              </div>
              
              {/* Order Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-sm">shopping_basket</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold font-headline">#ST-1093</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase tracking-wider">Pending</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium font-body mt-1">1x Waakye Special</p>
                  <div className="mt-2 bg-secondary/10 p-2 rounded-md border-l-2 border-secondary">
                    <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-0.5">Note:</p>
                    <p className="text-xs text-on-surface italic">"Extra spicy shito please! No wele."</p>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 mt-2 italic">8 mins ago • Delivery</p>
                </div>
              </div>

              {/* Order Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">shopping_basket</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold font-headline">#ST-1092</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold uppercase tracking-wider">Paid</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium font-body mt-1">3x Spicy Suya Wings</p>
                  <div className="mt-2 bg-tertiary/10 p-2 rounded-md border-l-2 border-tertiary">
                    <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-0.5">Note:</p>
                    <p className="text-xs text-on-surface italic">"Leave at front desk."</p>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 mt-2 italic">15 mins ago • Pick-up</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 pt-4 border-t border-outline-variant/10 text-xs font-bold text-primary uppercase tracking-widest hover:text-primary-container transition-colors text-center">
              View All Orders
            </button>
          </div>
        </div>

        {/* Menu Management Section */}
        <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
          <div className="p-8 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-headline text-2xl font-bold">Menu Management</h3>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-sm">search</span>
                <input 
                  className="pl-10 pr-4 py-2.5 bg-surface-container rounded-lg text-sm border-none focus:ring-2 focus:ring-primary w-full md:w-64 font-body outline-none transition-shadow" 
                  placeholder="Search menu items..." 
                  type="text"
                />
              </div>
              <button className="bg-surface-container-high hover:bg-surface-dim px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shrink-0 border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm">filter_list</span> Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Item</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Category</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Price</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-on-surface-variant">Status</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                
                {/* Table Row 1 */}
                <tr className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                        <img 
                          alt="Spicy Kelewele" 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOuSBorVjDs5bfX9Uxo3nex74Dnjm445kC1tcMfCl470I0P2OFnmCqBFtZTzyn6yDO2Pt06EPhlReSL3r53J1npjcuj7nJc9zLw1DwkzaZaTesLL2QrBA_F-kT6CPim5mdMDUZAgmO2taIw25-eeXSQLxGGPc7NhuqZPEN0YnlWgqXIsQFY83ISaW_4ImMJgnuPDOFULhUL5fTUylJSszfJN4VE-j28o34BzG9IeY66Oh47PfcKy_i4hqqKhTzI_ua5OfEidleU7c"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface font-headline text-lg">Spicy Kelewele</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">Signature ginger-marinated plantain</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full tracking-wide">Snacks</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-headline font-bold text-lg">₵45.00</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs font-bold text-green-700">Available</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline-variant hover:text-primary">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline-variant hover:text-primary">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Table Row 2 */}
                <tr className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                        <img 
                          alt="Waakye Special" 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuPytqywsdQwfd0C4NcRYI8SlurTtDGHOabCtFnHVEG_lVHWgVEDXageczbzn2XMOpxHaaJUeBcfN0dyUjPFMWl20KDifMQc2QUputQypwV4O8eUGzmjqwJ9-pBIfzhn0iziw-IAAd0a4kbwRPncghzmNroP7U9QDHJYBgx98_WGI0uxBLrZ67jL5aTgtxEzczO6e6fJEr3wMaCy1MQPP_gPk8YxHWbO1-_IpVKXU744EAiqXMbKm1K6Ylq_yClc1kgE17Bz2crYk"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface font-headline text-lg">Waakye Special</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">Rice and beans with shito and wele</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold px-3 py-1 bg-secondary/10 text-secondary rounded-full tracking-wide">Main Dish</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-headline font-bold text-lg">₵85.00</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs font-bold text-green-700">Available</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline-variant hover:text-primary">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline-variant hover:text-primary">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Table Row 3 */}
                <tr className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                        <img 
                          alt="Beef Suya" 
                          className="w-full h-full object-cover" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuh7b-6yic7tsIgKGvuWb_8kwQDmORWWdjWi-1doft-TzJ-ZZ_Ra4nzixbGSFxXZclYhKZXmNmS76Z8eOSOeaN2cTNfa-dzulgyAmZCKHOeZFxpXEKn8AhieG3gH4ZJy7llb57c_wUhtNrVnpzY0v8AUzyLB2bij3pCWET6n2ZZDhJgxmsdq0WudwVZafYa15O59gWIB_19z4MBkeqS2hndd58U_7CrKgBJ70Nt8ofWOW6TsNl5oqWQelb4fxn1gYnFvcqGp7Gk4w"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface font-headline text-lg">Beef Suya</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">Grilled beef with peanut spice rub</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold px-3 py-1 bg-tertiary/10 text-tertiary rounded-full tracking-wide">Grill</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-headline font-bold text-lg">₵60.00</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <span className="text-xs font-bold text-error">Out of Stock</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline-variant hover:text-primary">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline-variant hover:text-primary">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          
          <div className="p-5 bg-surface-container/30 flex justify-center border-t border-outline-variant/10">
            <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors tracking-wide">
              View All Menu Items
            </button>
          </div>
        </section>
      </main>

      {/* Contextual FAB - Quick Action */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 z-50 group">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold">4</span>
      </button>
    </div>
  );
};
