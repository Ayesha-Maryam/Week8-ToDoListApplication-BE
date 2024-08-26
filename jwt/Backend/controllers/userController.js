const User= require('../model/userModel')
const {generateAccessToken,generateRefreshToken}=require('../utils/tokenUtils')
const jwt =require('jsonwebtoken')
async function signup (req, res)
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
}
async function login(req, res)
{
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
        res.status(500).json({ message: 'Login failed', error:error.message });
    }
}
async function refreshToken(req, res)
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
        res.status(403).json({ message: 'Invalid or expired refresh token', error: error.message });    }
}
async function protectedRoute(req,res)
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
}
module.exports={
    signup, login, refreshToken, protectedRoute
}