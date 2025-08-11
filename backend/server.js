// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurantapp';

// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Start server
// const PORT = process.env.PORT || 5000;
// const reservationRoutes = require('./src/routes/reservationRoutes');
// app.use('/api/reservations', reservationRoutes);

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const adminRoutes = require(path.join(__dirname, 'src', 'routes', 'adminRoutes'));
const reservationRoutes = require(path.join(__dirname, 'src', 'routes', 'reservationRoutes'));

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
