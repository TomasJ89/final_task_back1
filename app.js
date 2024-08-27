const express = require("express");
const app = express();
const cors = require("cors")
const mainRouter = require("./routers/mainRouter")
const mongoose = require("mongoose")


require("dotenv").config()

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log("DB connect success ")
    }).catch(err => {
    console.log("error")
    console.log(err)
})


app.use(cors())
app.use(express.json());

app.use("/", mainRouter)


app.listen(2000);
