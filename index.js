const express = require('express')
const app = express()

// import routes

const adminRoutes = require('./src/controllers/commons/admin/commons');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/admin', adminRoutes);

app.listen(3000);