const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app= express();

app.use(express.json());
app.use(cors());

const port= process.env.Port ||3000;

app.use("/api",studentRoutes);

app.listen(port,()=>{
    console.log(`sever is running http://localhost${port}`);
});