const mongoose = require("mongoose")
const express = require("express")
const app = express()
const cors = require("cors")

app.options('*', cors())
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://snakeMaster:snake@snakecluster.cbj1k.mongodb.net/snakeMaster?retryWrites=true&w=majority", {useNewUrlParser: true})
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("connected to database"))


//
const usersRouter = require("./routes/scores")
app.use("/scores", usersRouter)

app.listen(process.env.PORT || 5000, () => console.log("server started"))
