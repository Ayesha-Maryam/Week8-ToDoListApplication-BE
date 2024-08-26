const express= require('express')
const userController=require('../controllers/userController')
const router= express.Router()

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/refreshToken', userController.refreshToken)
router.get('/protected', userController.protectedRoute)
module. exports=router