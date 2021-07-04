import {Socket} from "socket.io";

require("dotenv").config()
import {Snake} from "./snake"
import {Food} from "./food"
import {Vec2D} from "./vec2D"
import {player} from "./player"
import {EatOthers, Powerup, Teleport, Warp} from "./powerup"
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

const usersRouter = require("../routes/scores")
app.use("/scores", usersRouter)

const server = http.createServer(app);
export const io: Socket = require("socket.io")(server,{cors: {
        origin: "*"
    }
})


io.on("connection", (socket: Socket) => {
    console.log("hi " + socket.id)
    io.emit("hiFromServer")
    socket.on("hi",args => console.log(args))

})
io.on("hi", () => {
    console.log("hi")
})

io.on("playerDead", socket => {
    console.log("player died :(")
    console.log(JSON.parse(socket.data));
})

io.on("move", socket => console.log("moving"))

server.listen(process.env.PORT || 5000, () => console.log("server started"))

console.log()



const size: number = 1600
export const canvasDimension: Vec2D = new Vec2D(size, size/2)
export const tileWidth = 20, tileHeight = 20

export let snakes: Snake[]
export let powerups: Powerup[]
export let foods: Food[]
export let entityLocations: Vec2D[] = []
let snake1: Snake
let snake2: Snake
export let entities
export let username


function initVariables(players: number, username: string) {
    snake1 = new Snake(player.PLAYER1, new Vec2D(40, 6), new Vec2D(51, 6), new Vec2D(52, 6))
    snakes = [snake1]
    if (players == 2) {
        snake2 = new Snake(player.PLAYER2, new Vec2D(30, 6), new Vec2D(11, 6), new Vec2D(12, 6))
        snakes.push(snake2)
    }

    powerups = [new Warp(),new Teleport()]
    if (players == 2) {
        powerups.push(new EatOthers())
    }

    foods = Food.foodArray(30)
    entities = [...snakes, ...foods, ...powerups]
    entityLocations = [
        ...foods.map(value => value.location),
        ...powerups.map(value => value.location)]

    window.requestAnimationFrame(gameLoop)
}

function draw() {

}

function tick() {
    entities.forEach(entity => entity.update())
    draw()
}

let prevRenderTime: number
export let currentFrame

function gameLoop(currentTime: number) {

    currentFrame = window.requestAnimationFrame(gameLoop)
    const difference = (currentTime - prevRenderTime) / 1000
    if (difference < 1 / snake1.speed) return
    prevRenderTime = currentTime
    tick()
}


function handleWarpPowerup() {
    //draw canvas outline of snake holding Warp powerup
}







