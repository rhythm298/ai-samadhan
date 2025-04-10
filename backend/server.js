const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternal_bonds';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eternal_bonds', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  compatible: {
    themes: [String],
    colorPalettes: [String]
  }
});

const InvitationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template: { type: String, required: true },
  theme: { type: String, required: true },
  colorPalette: { type: String, required: true },
  names: {
    en: { type: String, required: true },
    ar: String,
    hi: String,
    es: String,
    zh: String
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: {
    en: { type: String, required: true },
    ar: String,
    hi: String,
    es: String,
    zh: String
  },
  rsvp: {
    phone: { type: String, required: true },
    website: String
  },
  dressCode: {
    en: String,
    ar: String,
    hi: String,
    es: String,
    zh: String
  },
  languages: [String],
  customElements: [Object],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Template = mongoose.model('Template', TemplateSchema);
const Invitation = mongoose.model('Invitation', InvitationSchema);

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// API Routes
// User Registration
app.post('/api/users/register', [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/users/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Invitation
app.post('/api/invitations', auth, async (req, res) => {
  try {
    const invitation = new Invitation({
      ...req.body,
      userId: req.userId
    });
    
    await invitation.save();
    res.status(201).json(invitation);
  } catch (error) {
    console.error('Create invitation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Invitation by ID
app.get('/api/invitations/:id', async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    res.json(invitation);
  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User's Invitations
app.get('/api/user/invitations', auth, async (req, res) => {
  try {
    const invitations = await Invitation.find({ userId: req.userId });
    res.json(invitations);
  } catch (error) {
    console.error('Get user invitations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Invitation
app.put('/api/invitations/:id', auth, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    // Check if user owns this invitation
    if (invitation.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Update invitation
    const updatedInvitation = await Invitation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedInvitation);
  } catch (error) {
    console.error('Update invitation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Invitation
app.delete('/api/invitations/:id', auth, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    // Check if user owns this invitation
    if (invitation.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Invitation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invitation deleted' });
  } catch (error) {
    console.error('Delete invitation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Seed initial data (for development)
const seedData = async () => {
  // Check if templates exist
  const templatesCount = await Template.countDocuments();
  
  if (templatesCount === 0) {
    // Create sample templates
    const templates = [
      {
        name: 'Golden Elegance',
        thumbnail: '/images/templates/golden-elegance.jpg',
        category: 'luxury',
        tags: ['traditional', 'elegant', 'gold'],
        compatible: {
          themes: ['traditional', 'western', 'indian'],
          colorPalettes: ['luxury']
        }
      },
      {
        name: 'Modern Minimalist',
        thumbnail: '/images/templates/modern-minimalist.jpg',
        category: 'contemporary',
        tags: ['modern', 'minimalist', 'clean'],
        compatible: {
          themes: ['modern', 'western'],
          colorPalettes: ['modern']
        }
      },
      {
        name: 'Floral Romance',
        thumbnail: '/images/templates/floral-romance.jpg',
        category: 'traditional',
        tags: ['floral', 'romantic', 'elegant'],
        compatible: {
          themes: ['traditional', 'western', 'indian'],
          colorPalettes: ['luxury', 'modern']
        }
      },
      {
        name: 'Arabian Nights',
        thumbnail: '/images/templates/arabian-nights.jpg',
        category: 'cultural',
        tags: ['middle eastern', 'intricate', 'elegant'],
        compatible: {
          themes: ['middleEastern', 'traditional'],
          colorPalettes: ['luxury', 'cultural']
        }
      },
      {
        name: 'Indian Mandala',
        thumbnail: '/images/templates/indian-mandala.jpg',
        category: 'cultural',
        tags: ['indian', 'mandala', 'colorful'],
        compatible: {
          themes: ['indian', 'traditional'],
          colorPalettes: ['cultural']
        }
      }
    ];
    
    await Template.insertMany(templates);
    console.log('Sample templates created');
  }
};

// Call seed function when server starts
if (process.env.NODE_ENV !== 'production') {
  seedData();
}

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


