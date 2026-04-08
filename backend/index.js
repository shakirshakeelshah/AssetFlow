const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'finance-dashboard-secret-2026';

const allowedOrigins = [
  'https://assetflow-frontend-qxtd.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Database setup
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [], transactions: [] }).write();

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    };

    db.get('users').push(newUser).write();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.get('users').find({ email }).value();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected routes (transactions)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get('transactions').remove({ id, userId: req.user.userId }).write();
  res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});