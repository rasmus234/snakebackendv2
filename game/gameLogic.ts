require("dotenv").config()

import {Socket} from "socket.io"
import {Snake} from "./snake"
import {Food} from "./food"
import {Vec2D} from "./vec2D"
import {EatOthers, Powerup, Teleport, Warp} from "./powerup"
import {Entity} from "./entity"
import GameState from "./gameState"
import { v4 as uuidv4 } from 'uuid';



const mongoose = require("mongoose")
const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http')

app.options('*', cors())
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://snakeMaster:snake@snakecluster.cbj1k.mongodb.net/snakeMaster?retryWrites=true&w=majority", {useNewUrlParser: true})
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("connected to database"))

const usersRouter = require("../routes/scores")
app.use("/scores", usersRouter)

const server = http.createServer(app)
export const io: Socket = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})


io.on("connection", (socket: Socket) => {
    console.log("hi " + socket.id)
    io.emit("hiFromServer",  "you connected with client id: " + socket.id)
    socket.on("newGameRequest",(players: number) => {
        let gameState: GameState = (createGameState(players))
        gameState.room = uuidv4()
        console.log(gameState.room)
        socket.join(gameState.room)
        gameState.snakes[0].socketId = socket.id
        gameStates.set(socket.id,gameState)
        gameState.startGame()
        socket.on("disconnect", () => {
            gameState.stopGame(undefined)
            console.log("user disconnected")
        })
        socket.on("newDirection", (key: string) => {
            let snake = gameState.snakes.find(value => value.socketId === socket.id)
            snake.setDirection(key)
        })
    })


})

server.listen(process.env.PORT || 5000, () => console.log("server started"))

const size: number = 1600
export const canvasDimension: Vec2D = new Vec2D(size, size / 2)
export const tileWidth = 20, tileHeight = 20
let gameStates: Map<String, object> = new Map<String, object>()



function createGameState(players: number) {

    let snakes: Snake[] = []
    let powerups: Powerup[] = []
    let foods: Food[] = []
    let entities: Entity[] = []
    let entityLocations: Vec2D[] = []
    let snake1: Snake
    let snake2: Snake

    const gameState: GameState = new GameState(snakes,foods,powerups,entities,entityLocations)

    snake1 = new Snake(new Vec2D(40, 6), new Vec2D(51, 6), new Vec2D(52, 6))
    snakes.push(snake1)

    if (players == 2) {
        snake2 = new Snake(new Vec2D(30, 6), new Vec2D(11, 6), new Vec2D(12, 6))
        snakes.push(snake2)

    }
    entityLocations.push(...snakes.flatMap(value => value.snakeParts))

    // powerups.push(new Warp(gameState), new Teleport(gameState))
    // if (players == 2) {
    //     powerups.push(new EatOthers(gameState))
    // }
    // entityLocations.push(...powerups.map(value => value.location))

    Food.foodArray(30,gameState)
    entities.push(...snakes, ...foods, ...powerups)
    return gameState

}

function draw() {

}

function tick(gameState:GameState) {
    gameState.entities.forEach(entity => entity.update(gameState))
    draw()
}

let prevRenderTime: number
export let currentFrame

// function gameLoop(currentTime: number) {
//
//     currentFrame = window.requestAnimationFrame(gameLoop)
//     const difference = (currentTime - prevRenderTime) / 1000
//     if (difference < 1 / 15) return
//     prevRenderTime = currentTime
//     tick()
// }








