import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable CORS and Cross-Origin Resource Policy for images & assets
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// API endpoints
app.use('/api', apiRouter);

// Serve static images directly from public and dist folders
const publicPath = path.resolve(__dirname, 'public');
const distPath = path.resolve(__dirname, 'dist');
const assetsPath = path.resolve(__dirname, 'src', 'assets', 'images');

app.use('/images', express.static(path.join(publicPath, 'images')));
app.use('/images', express.static(path.join(distPath, 'images')));
app.use('/images', express.static(assetsPath));
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
app.use(express.static(publicPath));
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If dist hasn't been built yet in dev mode
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BRANDED. Streetwear server running on port ${PORT}`);
});
