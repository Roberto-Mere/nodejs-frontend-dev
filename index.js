import express from 'express';
import cors from 'cors';
import('dotenv').then((dotenv) => dotenv.config());
import { initializeDatabase } from './src/db/db.js';
import userRoutes from './src/routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await initializeDatabase();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ error: 'Internal Server Error', message: err.message });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export default app;
