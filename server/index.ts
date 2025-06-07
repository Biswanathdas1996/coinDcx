import { createViteExpressServer } from './vite-server.js';

async function startApplication() {
  try {
    const app = await createViteExpressServer();
    const port = parseInt(process.env.PORT || '5000', 10);
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
      console.log(`API available at http://0.0.0.0:${port}/analyze`);
      console.log(`Frontend accessible at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startApplication();