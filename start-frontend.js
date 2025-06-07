import { spawn } from 'child_process';

const vite = spawn('npx', ['vite', 'dev', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: './client',
  stdio: 'inherit'
});

console.log('Starting Crypto Analysis Dashboard...');

vite.on('error', (err) => {
  console.error('Failed to start application:', err);
});