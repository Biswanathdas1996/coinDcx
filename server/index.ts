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
    configFile: join(__dirname, '../vite.config.ts'),
    optimizeDeps: {
      force: true
    }
  });

  const app = express();
  const cryptoService = new CryptoAnalysisService();

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

      console.log(`Analyzing crypto pair: ${pair}`);
      
      // Use the crypto analysis service to get real market data
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

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Crypto Analysis Server is running' });
  });

  // Use vite's connect instance as middleware for everything else
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  const port = parseInt(process.env.PORT || '5000', 10);
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    console.log(`📊 API available at http://0.0.0.0:${port}/analyze`);
    console.log(`💡 Ready to analyze crypto trading pairs with real market data`);
  });
}

createViteServer().catch(console.error);