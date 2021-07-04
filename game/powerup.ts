import {Entity} from "./entity"
import {Vec2D} from "./vec2D"
import {snakes, tileHeight, tileWidth} from "./gameLogic"
import {player} from "./player"
import {Snake} from "./snake"

export class Powerup implements Entity {
    color: string
    time: number
    timeLeft: number
    location: Vec2D
    currentOwner: Snake

    constructor() {
        this.location = new Vec2D(0, 0)
        this.location.setRandomLocation()
        this.timeLeft = this.time
    }

    draw(gameboard: CanvasRenderingContext2D): void {
        if (this.currentOwner === undefined) {
            gameboard.fillStyle = this.color
            gameboard.strokeStyle = "black"
            gameboard.globalAlpha = this.timeLeft/this.time
            gameboard.strokeRect(this.location.x * tileWidth, this.location.y * tileHeight, tileWidth, tileHeight)
            gameboard.fillRect(this.location.x * tileWidth, this.location.y * tileHeight, tileWidth, tileHeight)
            gameboard.globalAlpha = 1
        }
    }


    update() {
        // console.log(this.timeLeft)
        this.timeLeft -= 100
        this.checkColissions()
        if (this.timeLeft < 1) {
            if (this.currentOwner !== undefined) {
                console.log(this.currentOwner)
                this.currentOwner.activePowerups.splice(this.currentOwner.activePowerups.indexOf(this), 1)
                delete this.currentOwner
                console.log(this.currentOwner)
            }
            this.location.setRandomLocation()
            this.timeLeft = this.time
        }
    }

    checkColissions() {
        snakes.forEach(snake => {
            let snakeHead = snake.snakeParts[0]
            let snakeOnPowerup = snakeHead.isOn(this.location)
            if (snakeOnPowerup) {
                this.timeLeft = this.time
                this.location.x = null
                this.location.y = null
                this.currentOwner = snake
                snake.activePowerups.unshift(this)
            }
        })
    }
}

export class EatOthers extends Powerup {
    color: string = "green"
    time: number = 10000

    constructor() {
        super()
        this.timeLeft = this.time
    }
}

export class Warp extends Powerup {
    color = "pink"
    time = 10000

    constructor() {
        super()
        this.timeLeft = this.time
    }
}
export class Teleport extends Powerup{
    color = "black"
    time = 10000
    constructor() {
        super()
        this.timeLeft = this.time
    }

}