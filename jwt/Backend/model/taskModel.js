const mongoose= require('mongoose')
const User= require('../model/userModel')

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:
    {type: String,
        required: true},

    dueDate:
    {
        type:Date,
        required:true
    },
    status:
    {
        type:String,
        enum:['pending', 'completed'],
        default:'pending',
    },
    userId:
    {
        type:mongoose.Schema.ObjectId,
        ref:'User',
        req:true,
    },

})
const Task=mongoose.model('Task', taskSchema)
module.exports=Task;