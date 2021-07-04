import {Vec2D} from "./vec2D"
import {Drawable} from "./Drawable"
import {canvasDimension, tileWidth, tileHeight, snakes} from "./gameLogic"
import {Snake} from "./snake"
import {Entity} from "./entity"
import {Warp} from "./powerup"

export class Food implements Entity {
    location: Vec2D
    color = "#fdc601"

    constructor() {
        this.location = new Vec2D(0,0)
        this.location.setRandomLocation()

    }

    static foodArray(amount: number): Food[] {
        let foodArray: Food[] = []
        for (let i = 0; i < amount; i++) {
            foodArray.push(new Food())
        }
        return foodArray
    }

    draw(gameboard: CanvasRenderingContext2D) {
        gameboard.fillStyle = this.color
        gameboard.lineWidth = 0.5
        gameboard.strokeStyle = "black"
        gameboard.fillRect(this.location.x * tileWidth, this.location.y * tileHeight, tileWidth, tileHeight)
        gameboard.strokeRect(this.location.x * tileWidth, this.location.y * tileHeight, tileWidth, tileHeight)
    }

    update() {

        snakes.forEach(snake => {
            let snakeHead = snake.snakeParts[0]
            let snakeOnFood = snakeHead.isOn(this.location)
            if (snakeOnFood) {
                snake.eatFood()
                this.location.setRandomLocation()
            }
        })

    }



}


