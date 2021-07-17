import {Vec2D} from "./vec2D"
import {tileWidth, tileHeight} from "./gameLogic"
import {Entity} from "./entity"
import GameState from "./gameState"

export class Food implements Entity {
    location: Vec2D
    color = "#fdc601"

    constructor(gameState: GameState) {
        this.location = new Vec2D(0, 0)
        this.location.setRandomLocation(gameState)

    }

    static foodArray(amount: number, gameState: GameState): void {
        let foodArray: Food[] = gameState.foods
        for (let i = 0; i < amount; i++) {
            let food = new Food(gameState)
            foodArray.push(food)
            gameState.entityLocations.push(food.location)

        }
    }

    draw(gameboard: CanvasRenderingContext2D) {
        gameboard.fillStyle = this.color
        gameboard.lineWidth = 0.5
        gameboard.strokeStyle = "black"
        gameboard.fillRect(this.location.x * tileWidth, this.location.y * tileHeight, tileWidth, tileHeight)
        gameboard.strokeRect(this.location.x * tileWidth, this.location.y * tileHeight, tileWidth, tileHeight)
    }

    update(gameState: GameState) {

        gameState.snakes.forEach(snake => {
            let snakeHead = snake.snakeParts[0]
            let snakeOnFood = snakeHead.isOn(this.location)
            if (snakeOnFood) {
                snake.eatFood(gameState)
                this.location.setRandomLocation()
            }
        })

    }


}


