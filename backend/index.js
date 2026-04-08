const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'finance-dashboard-secret-2026';

app.use(express.json());

// Manual CORS headers for every request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [], transactions: [] }).write();

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existing = db.get('users').find({ email }).value();
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name, email, password: hashed };
    db.get('users').push(user).write();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.get('users').find({ email }).value();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Transactions routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  const userTx = db.get('transactions').filter({ userId: req.user.userId }).value() || [];
  res.json(userTx);
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { date, description, amount, category, type } = req.body;
    const newTx = {
      id: Date.now().toString(),
      userId: req.user.userId,
      date,
      description,
      amount: Number(amount),
      category,
      type
    };
    db.get('transactions').push(newTx).write();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get('transactions').remove({ id, userId: req.user.userId }).write();
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});