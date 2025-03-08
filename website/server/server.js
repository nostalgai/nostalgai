const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// For tracking active sessions
const activeSessions = new Map();

// Create a new scanning session
app.post('/api/create-scan-session', (req, res) => {
  const sessionId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  activeSessions.set(sessionId, {
    created: new Date(),
    status: 'waiting', // 'waiting', 'completed', 'expired'
    imageUrl: null
  });
  
  // Session timeout (30 minutes)
  setTimeout(() => {
    if (activeSessions.has(sessionId) && activeSessions.get(sessionId).status === 'waiting') {
      activeSessions.set(sessionId, {
        ...activeSessions.get(sessionId),
        status: 'expired'
      });
    }
  }, 30 * 60 * 1000);
  
  res.json({ sessionId });
});

// Upload scanned image from mobile device
app.post('/api/upload-scan', upload.single('image'), (req, res) => {
  const { sessionId } = req.body;
  
  if (!sessionId || !activeSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Invalid session' });
  }
  
  const session = activeSessions.get(sessionId);
  if (session.status !== 'waiting') {
    return res.status(400).json({ error: 'Session expired or already completed' });
  }
  
  // Create file URL
  const imageUrl = `/uploads/${req.file.filename}`;
  
  // Update session
  activeSessions.set(sessionId, {
    ...session,
    status: 'completed',
    imageUrl
  });
  
  // Notify desktop application via Socket.io
  io.emit(`scan:${sessionId}`, { imageUrl });
  
  res.json({ success: true, imageUrl });
});

// Check session status
app.get('/api/check-scan-session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!activeSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const session = activeSessions.get(sessionId);
  res.json(session);
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Generate QR code endpoint
app.get('/api/qrcode', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    
    res.json({ qrcode: qrCodeDataUrl });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Create a dedicated endpoint for photo viewing
app.get('/view-photo/:photoId', (req, res) => {
  const photoId = req.params.photoId;
  // This would typically serve an HTML page that displays the photo
  // For demo purposes, we're just sending information about the photo
  res.send(`<html><body><h1>Photo ${photoId}</h1><p>This would display the photo with ID: ${photoId}</p></body></html>`);
});

// Socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('subscribe', (sessionId) => {
    console.log(`Client subscribed to session: ${sessionId}`);
    socket.join(`scan:${sessionId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make sure port is set by environment variable for Vercel
const PORT = process.env.PORT || 3001;

// Export the Express API for Vercel
module.exports = app;

// Only start the server if running directly (not when imported by Vercel)
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}