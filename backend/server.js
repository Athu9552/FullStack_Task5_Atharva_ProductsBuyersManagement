const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// In-memory stores (demo)
// Product fields: id, name, category, price, quantity, description, createdAt
// Buyer fields: id, name, email, phone, address, createdAt
let products = [];
let buyers = [];

function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n); }
function validateEmail(email){
  return typeof email==='string' && /^\S+@\S+\.\S+$/.test(email);
}

// Helpers to generate incremental IDs
let idCounter = 1;
function nextId(){ return String(idCounter++); }

// PRODUCTS
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, category, price, quantity, description } = req.body;
  if(!name || price==null){
    return res.status(400).json({ error: 'Name and price are required.'});
  }
  if(!isNumber(price) || price < 0) return res.status(400).json({ error: 'Price must be a non-negative number.'});
  if(quantity != null && (!isNumber(quantity) || quantity < 0)) return res.status(400).json({ error: 'Quantity must be a non-negative number.'});
  const product = {
    id: nextId(),
    name,
    category: category || '',
    price: Number(price),
    quantity: quantity != null ? Number(quantity) : 0,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  products.push(product);
  res.status(201).json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const idx = products.findIndex(p => p.id === id);
  if(idx === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(idx,1);
  res.json({ message: 'Deleted', id });
});

// BUYERS
app.get('/api/buyers', (req, res) => {
  res.json(buyers);
});

app.post('/api/buyers', (req, res) => {
  const { name, email, phone, address } = req.body;
  if(!name || !email) return res.status(400).json({ error: 'Name and email are required.'});
  if(!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format.'});
  const buyer = {
    id: nextId(),
    name,
    email,
    phone: phone || '',
    address: address || '',
    createdAt: new Date().toISOString()
  };
  buyers.push(buyer);
  res.status(201).json(buyer);
});

app.delete('/api/buyers/:id', (req, res) => {
  const id = req.params.id;
  const idx = buyers.findIndex(b => b.id === id);
  if(idx === -1) return res.status(404).json({ error: 'Buyer not found' });
  buyers.splice(idx,1);
  res.json({ message: 'Deleted', id });
});

// health
app.get('/', (req, res) => res.send('Backend running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
