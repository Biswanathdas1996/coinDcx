import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { CryptoAnalysisService } from './crypto-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createViteExpressServer() {
  const app = express();
  const cryptoService = new CryptoAnalysisService();

  // Parse JSON bodies
  app.use(express.json());
  app.use(cors());

  // API endpoints
  app.post('/analyze', async (req, res) => {
    try {
      const { pair } = req.body;
      
      if (!pair) {
        return res.status(400).json({ error: 'Trading pair is required' });
      }

      console.log(`Analyzing crypto pair: ${pair}`);
      const analysis = await cryptoService.analyzeMarket(pair);
      console.log(`Analysis completed for ${pair}`);
      res.json(analysis);

    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const pairName = req.body.pair || 'unknown';
      
      if (errorMessage.includes('not found')) {
        res.status(404).json({ 
          error: `Trading pair "${pairName}" not found. Please check the symbol and try again.`,
          suggestion: 'Try using common pairs like BTC-USD, ETH-USD, or ADA-USD'
        });
      } else if (errorMessage.includes('fetch')) {
        res.status(503).json({ 
          error: 'Unable to fetch market data. The crypto data service may be temporarily unavailable.',
          details: errorMessage
        });
      } else {
        res.status(500).json({ 
          error: 'Analysis failed due to an internal error.',
          details: errorMessage
        });
      }
    }
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Crypto Analysis Server is running' });
  });

  // Create Vite dev server
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: join(__dirname, '../client')
  });

  // Use Vite middleware
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  return app;
}