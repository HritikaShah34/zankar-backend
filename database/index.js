const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require("./routes/user");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter)

mongoose
.connect('mongodb+srv://hritika3410:bRUqkb2HrBuwBnVr@cluster0.kyvml8s.mongodb.net/Zankar')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.listen(3000, () => console.log('Server running on port 3000'));
