const mongoose = require("mongoose")
const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http');


app.options('*', cors())
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://snakeMaster:snake@snakecluster.cbj1k.mongodb.net/snakeMaster?retryWrites=true&w=majority", {useNewUrlParser: true})
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("connected to database"))

const usersRouter = require("./routes/scores")
app.use("/scores", usersRouter)

const server = http.createServer(app);
const io = require("socket.io")(server,{cors: {
        origin: "*"
    }
})


io.on("connection", socket => {
    console.log("hi " + socket.id)
})
io.on("hi", () => console.log("hi"))

server.listen(process.env.PORT || 5000, () => console.log("server started"))

