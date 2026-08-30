import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ข้อมูลจำลองใน Server (อนาคตค่อยต่อเข้า Database เช่น MongoDB/MySQL)
let menuItems = [
  {
    id: 1,
    category: 'coffee',
    name: 'Matcha Espresso Latte',
    price: 120,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400',
    inStock: true,
  },
  {
    id: 2,
    category: 'coffee',
    name: 'Iced Americano',
    price: 85,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400',
    inStock: true,
  }
];

// --- ROUTES (API Endpoints) ---

// 1. ดึงข้อมูลเมนูทั้งหมด (GET)
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// 2. เพิ่มเมนูใหม่ (POST)
app.post('/api/menu', (req, res) => {
  const newItem = {
    id: Date.now(),
    ...req.body
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// 3. แก้ไขเมนู (PUT)
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const index = menuItems.findIndex((item) => item.id === Number(id));

  if (index !== -1) {
    menuItems[index] = { ...menuItems[index], ...req.body };
    res.json(menuItems[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// 4. ลบเมนู (DELETE)
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  menuItems = menuItems.filter((item) => item.id !== Number(id));
  res.json({ message: 'Deleted successfully' });
});

// เริ่มรัน Server  
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});