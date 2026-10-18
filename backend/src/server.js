import app from './app.js';
import { config } from './config/env.js';

const { PORT } = config;

app.listen(PORT, () => {
  console.log(`Smart Facility API running on http://localhost:${PORT}`);
});
