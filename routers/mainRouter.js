const express = require("express")
const Router = express.Router()


const {
    register,
    login,
    updatePhoto,
    updateUserName,
    updatePassword,
    autoLogin,
    allUsers,
    singleUser,


} = require("../controllers/mainController")

const {
    registerValidate,
    loginValidate,
    photoUrlValidate,
    newNameValidate,
    newPasswordValidate,



} = require("../middleware/validators")

const authMiddle = require("../middleware/auth")

Router.post("/register", registerValidate, register)
Router.post("/login", loginValidate, login)
Router.post("/update-photo",authMiddle,photoUrlValidate,updatePhoto)
Router.post("/update-username",authMiddle,newNameValidate,updateUserName)
Router.post("/update-password",authMiddle,newPasswordValidate,updatePassword)
Router.post("/auto-login",authMiddle,autoLogin)
Router.get("/all-users",allUsers)
Router.get("/user/:username", singleUser)
module.exports = Router