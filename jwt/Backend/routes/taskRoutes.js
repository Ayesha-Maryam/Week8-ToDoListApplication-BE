const express= require('express')
const taskController=require('../controllers/taskController')
const authenticationToken=require('../middleware/authMiddleware')
const router= express.Router();

router.post('/',authenticationToken, taskController.createTask)
router.get('/completed',authenticationToken,  taskController.getCompletedTask)
router.get('/pending', authenticationToken, taskController.getPendingTasks)
router.get('/',authenticationToken,  taskController.getAllTask)
router.get('/:id',authenticationToken,  taskController.getTask)
router.put('/:id', authenticationToken, taskController.updateTask)
router.delete('/:id', authenticationToken, taskController.deleteTask)


module.exports=router