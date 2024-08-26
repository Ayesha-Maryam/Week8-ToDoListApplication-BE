const express=require('express')
const cors =require('cors')
const app= express();
const userRoutes=require('./routes/userRoutes')
const taskRoutes=require('./routes/taskRoutes')
const connectDb= require('./Config/db')
require('dotenv').config();
app.use(express.json())
app.use(cors())
console.log(process.env.MONGO_URL)

connectDb();
app.use('/users',userRoutes )
app.use('/tasks', taskRoutes)


const PORT= 8000;
app.listen(PORT, ()=>
{
    console.log(`Server Running on port ${PORT}`);
})