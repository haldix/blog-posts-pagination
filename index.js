const express = require('express');
const postRoutes = require('./routes');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

mongoose.connect('mongodb://localhost/pagination', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));

app.use('/posts', postRoutes);

app.get('/', (req, res, next) => {
  res.render('home');
});

app.listen(3000, () => console.log('Server on Port 3000'));
