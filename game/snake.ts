import "./Drawable"
import {canvasDimension, currentFrame, snakes, tileHeight, tileWidth, username} from "./gameLogic"
import {Vec2D} from "./vec2D"
import {getDirection} from "./input"
import {Drawable} from "./Drawable"
import {player} from "./player"
import {Entity} from "./entity"
import {EatOthers, Powerup, Warp} from "./powerup"
import {io} from "./gameLogic";


export class Snake implements Entity {

    playerNumber: player
    speed = 10
    color = "cyan"
    snakeParts: Vec2D[]
    activePowerups: Powerup[] = []

    constructor(playerNumber: player, ...bodyParts: Vec2D[]) {
        this.playerNumber = playerNumber
        if (playerNumber == player.PLAYER2) this.color = "red"
        this.snakeParts = bodyParts

    }

    draw(gameboard: CanvasRenderingContext2D): void {

        gameboard.fillStyle = this.color
        gameboard.strokeStyle = "black"
        gameboard.lineWidth = 2
        this.snakeParts.forEach(part => gameboard.strokeRect(part.x * tileWidth, part.y * tileHeight, tileWidth, tileHeight))
        this.snakeParts.forEach(part => gameboard.fillRect(part.x * tileWidth, part.y * tileHeight, tileWidth, tileHeight))
    }


    update(): void {
        this.move()
    }

    private move() {
        let currentHead: Vec2D = this.snakeParts[0]
        let newHead: Vec2D = new Vec2D(currentHead.x + getDirection(this.playerNumber).x, currentHead.y + getDirection(this.playerNumber).y)
        let hasWarpPowerup = this.activePowerups.some(powerup => powerup instanceof Warp)
        let hasCollided = this.checkCollisions(newHead, hasWarpPowerup)
        if (hasWarpPowerup) this.warp(newHead)

        if (hasCollided) {
            this.kill()

        }
        this.snakeParts.pop()
        this.snakeParts.unshift(newHead)
    }

    private kill() {
        window.cancelAnimationFrame(currentFrame)
        console.log(this)
    }

    private warp(newHead: Vec2D) {
        if (this.checkBounds(newHead)) {
            if (newHead.x < 0) newHead.x = canvasDimension.x / tileWidth
            else if (newHead.x > canvasDimension.x / tileWidth) newHead.x = 0
            else if (newHead.y < 0) newHead.y = canvasDimension.y / tileHeight
            else if (newHead.y > canvasDimension.y / tileHeight) newHead.y = 0
        }
    }

    private checkCollisions(newHead: Vec2D, hasWarpPowerup: boolean = false): boolean {
        const otherSnakes: Snake[] = this.getOtherSnakes()
        const overlapOtherSnakes = this.checkOverlapOtherSnakes(otherSnakes, newHead)
        let overlapOfSelf = this.checkOverlap(newHead)
        let outBounds = hasWarpPowerup ? false : this.checkBounds(newHead)
        if (outBounds || overlapOfSelf || overlapOtherSnakes) return true
        return false
    }

    private checkOverlapOtherSnakes(otherSnakes: Snake[], newHead: Vec2D): boolean {
        let overlaps = false
        otherSnakes.forEach(snake => {
            if (snake.snakeParts.some(snakePart => snakePart.isOn(newHead))) overlaps = true
        })
        return overlaps
    }

    private checkOverlap(newHead: Vec2D): boolean {
        let overlap = this.snakeParts.some(bodyPart => bodyPart.isOn(newHead))
        return overlap
    }

    private checkBounds(newHead: Vec2D): boolean {
        let outBounds = newHead.x < 0 || newHead.x >= canvasDimension.x / tileWidth || newHead.y < 0 || newHead.y >= canvasDimension.y / tileHeight
        return outBounds
    }

    public addSegment(): void {
        let tail: Vec2D = this.snakeParts[this.snakeParts.length - 1]
        this.snakeParts.push(tail)
    }

    private removeSegmentOthers() {
        const otherSnakes: Snake[] = this.getOtherSnakes()
        otherSnakes.forEach(snake => {
            snake.removeSegment()
            if (snake.snakeParts.length == 0) {
                snake.kill()
            }
        })
    }

    private getOtherSnakes() {
        return snakes.filter(snake => snake.playerNumber != this.playerNumber)
    }

    public removeSegment() {
        this.snakeParts.pop()
    }

    public eatFood() {

        this.addSegment()
        this.speed = Math.min(this.speed +1.5, 20)
        if (this.activePowerups.some(powerup => powerup instanceof EatOthers)) {
            this.removeSegmentOthers()
        }
    }
}

