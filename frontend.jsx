import React, { useState } from 'react';
import { ShoppingBag, Coffee, Search, Plus, Trash2, CreditCard, User, Menu } from 'lucide-react';

const categories = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'non-coffee', name: 'Non-Coffee' },
  { id: 'bakery', name: 'Bakery' },
];

const menuItems = [
  { id: 1, category: 'coffee', name: 'Matcha Espresso Latte', price: 120, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300' },
  { id: 2, category: 'coffee', name: 'Iced Americano', price: 85, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300' },
  { id: 3, category: 'coffee', name: 'Oat Milk Latte', price: 105, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300' },
  { id: 4, category: 'non-coffee', name: 'Green Tea Frappe', price: 115, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300' },
  { id: 5, category: 'bakery', name: 'Butter Croissant', price: 75, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300' },
];

export default function PosInterface() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 bg-emerald-950 flex flex-col items-center py-6 justify-between text-emerald-200">
        <div className="flex flex-col items-center gap-8">
          <div className="p-3 bg-emerald-500 text-emerald-950 rounded-2xl shadow-lg font-bold">
            <Coffee size={28} />
          </div>
          <nav className="flex flex-col gap-6">
            <button className="p-3 bg-emerald-800 text-white rounded-xl shadow"><ShoppingBag size={22} /></button>
            <button className="p-3 hover:bg-emerald-900 rounded-xl transition"><User size={22} /></button>
            <button className="p-3 hover:bg-emerald-900 rounded-xl transition"><Menu size={22} /></button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header & Search */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Green Grounds POS</h1>
            <p className="text-sm text-slate-500">แคชเชียร์: Barista #01</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาเมนู..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </header>

        {/* Category Pills */}
        <div className="flex gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Item Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-5 pr-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-xl mb-3" />
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition">{item.name}</h3>
                <p className="text-emerald-600 font-bold mt-1">฿{item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart & Checkout Panel */}
      <aside className="w-96 bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-600" /> รายการสั่งซื้อ
          </h2>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-3 pr-1">
            {cart.length === 0 ? (
              <p className="text-center text-slate-400 py-10">ยังไม่มีสินค้าในตะกร้า</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">฿{item.price} / แก้ว</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    <button onClick={() => updateQty(item.id, -1)} className="text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-slate-500 hover:text-emerald-600"><Plus size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pricing Summary & Checkout */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>ยอดรวม (Subtotal)</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>ภาษี (VAT 7%)</span>
            <span>฿{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>ยอดรวมสุทธิ</span>
            <span className="text-emerald-600">฿{total.toFixed(2)}</span>
          </div>

          <button
            disabled={cart.length === 0}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-lg flex justify-center items-center gap-2 transition"
          >
            <CreditCard size={18} /> ชำระเงิน
          </button>
        </div>
      </aside>
    </div>
  );
}