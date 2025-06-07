import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'vite';
import cors from 'cors';
import { CryptoAnalysisService } from './crypto-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createViteServer() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: join(__dirname, '../client'),
    configFile: join(__dirname, '../vite.config.ts')
  });

  const app = express();

  // Enable CORS and JSON parsing
  app.use(cors());
  app.use(express.json());

  // API routes before Vite middleware
  app.post('/analyze', async (req, res) => {
    try {
      const { pair } = req.body;
      
      if (!pair) {
        return res.status(400).json({ error: 'Trading pair is required' });
      }

      // Check if we have a crypto analysis API key
      const apiKey = process.env.CRYPTO_API_KEY || process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        return res.status(503).json({ 
          error: 'Crypto analysis service not configured. Please provide API credentials in environment variables.' 
        });
      }

      // Return error indicating the service needs proper configuration
      res.status(503).json({
        error: 'Crypto analysis service requires external API integration. Please configure the appropriate API keys and endpoints.',
        details: 'This endpoint needs to be connected to a real crypto data provider such as CoinGecko, Binance API, or a custom trading analysis service.'
      });

    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Use vite's connect instance as middleware for everything else
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  const port = parseInt(process.env.PORT || '5000', 10);
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    console.log(`📊 API available at http://0.0.0.0:${port}/analyze`);
  });
}

createViteServer().catch(console.error);