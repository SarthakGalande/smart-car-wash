const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[36m%s\x1b[0m', '🚗 Starting Smart Car Wash Services...');
console.log('\x1b[32m%s\x1b[0m', '👉 Backend:  http://localhost:5000');
console.log('\x1b[34m%s\x1b[0m', '👉 Frontend: http://localhost:3000');
console.log('\x1b[36m%s\x1b[0m', '=======================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Launch Backend (Express.js on port 5000)
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Launch Frontend (React Vite on port 3000)
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Backend process error:', err.message);
});

frontend.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Frontend process error:', err.message);
});

// Graceful cleanup on Ctrl+C / SIGINT
const cleanup = () => {
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down Smart Car Wash services...');
  
  if (isWindows) {
    if (backend.pid) spawn('taskkill', ['/pid', backend.pid.toString(), '/f', '/t'], { shell: true });
    if (frontend.pid) spawn('taskkill', ['/pid', frontend.pid.toString(), '/f', '/t'], { shell: true });
  } else {
    if (backend.pid) backend.kill('SIGINT');
    if (frontend.pid) frontend.kill('SIGINT');
  }

  setTimeout(() => process.exit(0), 1000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
