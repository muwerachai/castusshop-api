// const { sequelize } = require('./models');
// sequelize.sync()

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

;
const notFound = require('./middlewares/notFound');
const error = require('./middlewares/error');
const clientRouter = require('./routes/clientRoutes');
const adminRouter = require('./routes/adminRoutes');
const supplierRouter = require('./routes/supplierRoutes');



const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));



app.use('/client', clientRouter);
app.use('/supplier', supplierRouter);
app.use('/admin', adminRouter);


app.use(notFound);
app.use(error);


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port:  ${port}`));