import {canvasDimension, tileHeight, tileWidth} from "./gameLogic"
import GameState from "./gameState"

export class Vec2D {
    x: number
    y: number
    width?: number
    height?: number

    constructor(x: number, y: number,width?,height?) {
        this.x = x
        this.y = y
        if (height && width){
            this.height = height
            this.width = width
        }

    }


    public isOn?(other: Vec2D): boolean {
        if (other.y === this.y && other.x === this.x) return true
        return false
    }

    setRandomLocation?(gamestate?: GameState) {
        let x: number
        let y: number
        let newLocation: Vec2D

        do {
            x = Math.floor(Math.random() * (canvasDimension.x / tileWidth))
            y = Math.floor(Math.random() * (canvasDimension.y / tileHeight))
            newLocation = new Vec2D(x, y)
        } while (gamestate && gamestate.entityLocations.some(value => value.isOn(newLocation) ||
            gamestate.snakes.flatMap(value1 => value1.snakeParts).some(value1 => value1.isOn(newLocation))
        ))

        this.x = x
        this.y = y
    }
}

