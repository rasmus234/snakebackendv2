
const mongoose = require("mongoose")
const express = require("express");
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL || 5000, {useNewUrlParser: true})
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("connected to database"))


const usersRouter = require("./routes/scores")
app.use("/scores",usersRouter)

app.listen(process.env.PORT,() => console.log("server started"))
