import {Snake} from "./snake"
import {Food} from "./food"
import {Powerup} from "./powerup"
import {Entity} from "./entity"
import {Vec2D} from "./vec2D"
import {io} from "./gameLogic"

const diff = require('deep-diff').diff
export default class GameState {

    snakes: Snake[]
    foods: Food[]
    powerups: Powerup[]
    entities: Entity[]
    entityLocations: Vec2D[]
    room
    id
    lastState



    constructor(snakes: Snake[], foods: Food[], powerups: Powerup[], entities: Entity[], entityLocations: Vec2D[]) {
        this.snakes = snakes
        this.foods = foods
        this.powerups = powerups
        this.entities = entities
        this.entityLocations = entityLocations
    }

    public toString() {
        return this.toJSON()
    }


    public startGame() {
        this.lastState = JSON.stringify(this)
        this.gameLoop()
        console.log("starting game")
    }

    public gameLoop() {

        this.id = setInterval(() => this.tick(), 50)

    }

    public stopGame(loser) {
        clearInterval(this.id)
        console.log("stopping game")
        io.to(this.room).emit("gameOver",loser)
    }

    public tick() {
        this.entities.forEach(entity => entity.update(this))
        const thisState = JSON.stringify(this)

        const difference = diff(thisState,this.lastState)
        io.to(this.room).emit("newGameState", thisState)
        this.lastState = thisState

    }

    toJSON() {
        return {
            snakes: this.snakes,
            foods: this.foods,
            powerups: this.powerups
        }
    }
}