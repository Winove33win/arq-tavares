const express = require('express');
const path    = require('path');
const app     = express();

const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
}));

// SPA fallback — always return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Tavares Arq rodando na porta ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} em uso. Verifique processos ativos no Plesk e use "Reiniciar aplicativo".`);
    process.exit(1);
  } else {
    throw err;
  }
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT',  () => server.close(() => process.exit(0)));
