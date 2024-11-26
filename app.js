
import cors from 'cors';
import express, { urlencoded, json } from 'express';
import { connect } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import videoRoutes from './routes/video.routes.js';

connect();

const app = express();

app.use(urlencoded({extended: true}));
app.use(json());
app.use(cors());
// routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

const port = process.env.PORT || 9001;

app.get('/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      routes.push({ path: middleware.route.path, methods });
    }
  });
  res.json(routes);
});


app.listen(port, ()=>{
  console.log(`listening at port ${port}`);
});
