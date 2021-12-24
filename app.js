require('dotenv').config()
require('express-async-errors')
const connectDB =require('./db/connect')
const express = require ('express')
const productRouter = require('./routes/products')
const path = require("path");
const app= express ()


//settings
const port = process.env.PORT || 3000

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHanlderMiddleware =require('./middleware/error-handler')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, ".", "/view", "/index.html"));
})
app.use('/products',productRouter)
app.use(notFoundMiddleware);
app.use(errorHanlderMiddleware);

//start server
const start = async ()=> {
    try {
         await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Listening and ready on ${port}`));
    } catch (error) {
        console.log(error);  
    }
}
start()

