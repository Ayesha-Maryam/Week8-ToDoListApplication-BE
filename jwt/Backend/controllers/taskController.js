const Task=require('../model/taskModel')
const User=require('../model/userModel')

async function createTask(req, res)
{
try{
    if (!req.body.title || !req.body.description || !req.body.dueDate) 
        {
        return res.status(400).json({ message: 'All fields are required' })
    };
    let newTask=  new Task({
        title: req.body.title,
        description:req.body.description,
        dueDate:req.body.dueDate,
        status:req.body.status,
        category: req.body.category,
        userId: req.user.userId
    })
    newTask= await newTask.save();
    const user= await User.findById(req.user.userId)
    res.send({newTask, user})

}
catch(error)
{
    return res.status(500).json({message:"Error in creation of Task", error: error.message})
}
}
async function getAllTask(req, res)
{
    try{
        const task= await Task.find({userId:req.user.userId})
        if(!task)
        {
            return res.status(404).send("Task not Found")
        }
        res.send(task)
    }
    catch(error)
    {
        return res.status(500).json({message:"Error in getting Task", error:error.message})
    }
}

async function getTask(req, res)
{
    try
    {
        const task=await Task.findOne({_id:req.params.id, userId:req.user.userId})
        const user=await User.findById(task.userId)
        if(!task)
        {
            return res.status(404).send("Task not Found")
        }
        res.send({task, user})

    }
    catch(error)
    {
        return res.status(500).json({message:"Error in Getting Task", error: error.message})

    }
}
async function updateTask(req, res)
{
    try{
        const task=await Task.findOneAndUpdate({_id:req.params.id},
            {title:req.body.title,
                description:req.body.description,
                dueDate:req.body.dueDate,
                status:req.body.status,
                category: req.body.category
            }
        )
        if(!task)
        {
            return res.status(404).send("Task not Found")
        }
        const updatedtask=await Task.findById(req.params.id)
        res.send(updatedtask)
        
    }
    catch(error)
    {
        return res.status(500).json({message:"Error in Updating Task", error: error.message})

    }
}
async function deleteTask(req, res)
{
    try{
        const task=await Task.findByIdAndDelete({_id:req.params.id})
        if(!task)
        {
            return res.status(404).send("Task not Found")
        }
        res.send("Task Deleted Successsfully.")
    }
    catch(error)
    {
        return res.status(500).json({message:"Error in Deleting Task", error: error.message})

    }
}
async function getCompletedTask(req, res)
{
    try{
        const task=await Task.find({userId:req.user.userId, status:'completed'})
        if(!task)
        {
            return res.status(404).send("Task not Found")
        }
        res.send(task)
    }
    catch(error){
        return res.status(500).json({message:"Error in Getting Completed Task", error: error.message})

    }
}
async function getPendingTasks(req, res)
{
    try{
        const task=await Task.find({userId:req.user.userId, status:'pending'})
        if(!task)
        {
            return res.status(404).send("Task not Found")
        }
        res.send(task)
    }
    catch(error)
    {
        return res.status(500).json({message:"Error in Getting Completed Task", error: error.message})
    }
}

module.exports={
    createTask,
    getAllTask,
    getTask,
    updateTask,
    deleteTask,
    getCompletedTask,
    getPendingTasks

}