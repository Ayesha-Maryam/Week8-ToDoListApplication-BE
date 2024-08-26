const express=require('express')
const cors =require('cors')
const mongoose= require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const app= express();
require('dotenv').config();
app.use(express.json())
app.use(cors())
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>console.log("Connected to MongoDb")).catch(()=>console.log("Error in Connection to MongoDb"))

const userSchema= new mongoose.Schema({
    username:{type:String, required:true, unique: true},
    password:{type:String, required:true},
})


userSchema.pre('save',async function (next)
{
    if(!this.isModified('password'))
    {
        return next();
    }
    this.password=await bcrypt.hash(this.password,10)
        
})

userSchema.methods.comparePassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
} 
const User=mongoose.model('User', userSchema)

const generateAccessToken=(userId)=>jwt.sign({userId},process.env.JWT_SECRET, {expiresIn:'15m'})
const generateRefreshToken=(userId)=>jwt.sign({userId},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'})


app.post('/signup',async(req,res)=>
{
    try{
        let user= new User({
            username: req.body.username,
            password:req.body.password
        })
        user= await user.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch(error)
    {
        console.log('Signup Error:', error);
        res.status(500).json({ message: 'User creation failed', error: error.message});
    }
})

app.post('/login', async(req,res)=>{
    try{
        const user= await User.findOne({username:req.body.username});
        if(!user || !(await user.comparePassword(req.body.password)))
        {
            return res.status(401).json({ message: 'Invalid username or password' })
        }
        const accessToken=generateAccessToken(user._id);
        const refreshToken=generateRefreshToken(user._id);
        res.json({accessToken,refreshToken,user})

    }
    catch(error)
    {
        res.status(500).json({ message: 'Login failed', error });
    }
})

app.post('/refresh-token', async (req,res)=>
{
    try{
        if(!req.body.refreshToken)
        {
            return res.status(401).json({ message: 'Refresh Token is required' });
        }
        const user=jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET)
        const accessToken=generateAccessToken(user.userId)
        res.json({accessToken})
    }
    catch(error)
    {
        res.status(403).json({ message: 'Invalid or expired refresh token', error });    }
})
app.get('/protected', (req,res)=>
{
    try{
        const authHeader= req.headers['authorization'];
        const token= authHeader && authHeader.split(' ')[1];
        if(!token)
        {
            return res.status(401).json({ message: 'Access Token is required' });
        }
        const user=jwt.verify(token, process.env.JWT_SECRET)
        res.json({ message: 'This is a protected route', user });
    }
    catch(error)
    {
        res.status(403).json({ message: 'Invalid or expired token', error });
    }
})

const PORT= 8000;
app.listen(PORT, ()=>
{
    console.log(`Server Running on port ${PORT}`);
})