#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start Vite dev server from the client directory
const vite = spawn('npx', ['vite', 'dev', '--host', '0.0.0.0'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
});