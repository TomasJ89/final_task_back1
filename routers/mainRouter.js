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
    createConversation,
    allConversations,
    singleConversation,
    newMessage,
    deleteConversation,
    updateUser,
    like,
    addNotification


} = require("../controllers/mainController")

const {
    registerValidate,
    loginValidate,
    photoUrlValidate,
    newNameValidate,
    newPasswordValidate,
    newMessageValidate,



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
Router.post ("/create-conversation",authMiddle, createConversation)
Router.get("/all-conversations/:id", allConversations)
Router.post("/single-conversation",authMiddle, singleConversation)
Router.post("/send-message",newMessageValidate,newMessage)
Router.post("/delete-conversation",authMiddle,deleteConversation)
Router.post("/updatedUser",updateUser)
Router.post("/like",like)
Router.post("/notification",addNotification)
module.exports = Router