require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});