import "./Drawable"
import {canvasDimension, currentFrame, io, tileHeight, tileWidth} from "./gameLogic"
import {Vec2D} from "./vec2D"
import {Entity} from "./entity"
import {EatOthers, Powerup, Warp} from "./powerup"
import GameState from "./gameState"


export class Snake implements Entity {

    player
    speed = 10
    color = "cyan"
    snakeParts: Vec2D[]
    activePowerups: Powerup[] = []
    direction: Vec2D = {x: 0,y: 1}
    lastDirection: Vec2D
    socketId

    constructor( ...bodyParts: Vec2D[]) {
        this.snakeParts = bodyParts
    }

    draw(gameboard: CanvasRenderingContext2D): void {

        gameboard.fillStyle = this.color
        gameboard.strokeStyle = "black"
        gameboard.lineWidth = 2
        this.snakeParts.forEach(part => gameboard.strokeRect(part.x * tileWidth, part.y * tileHeight, tileWidth, tileHeight))
        this.snakeParts.forEach(part => gameboard.fillRect(part.x * tileWidth, part.y * tileHeight, tileWidth, tileHeight))
    }


    update(gameState: GameState): void {
        this.move(gameState)
    }

    private move(gameState: GameState) {
        let currentHead: Vec2D = this.snakeParts[0]
        let newHead: Vec2D = new Vec2D(currentHead.x + this.getDirection().x, currentHead.y + this.getDirection().y)
        let hasWarpPowerup = this.activePowerups.some(powerup => powerup instanceof Warp)
        let hasCollided = this.checkCollisions(newHead, hasWarpPowerup, gameState)
        if (hasWarpPowerup) this.warp(newHead)

        if (hasCollided) {
            this.kill(gameState)
            console.log("killed snake")

        }
        this.snakeParts.pop()
        this.snakeParts.unshift(newHead)
    }

    private kill(gameState: GameState) {
        gameState.stopGame(this.player)
        console.log(this.snakeParts)
    }

    private warp(newHead: Vec2D) {
        if (this.checkBounds(newHead)) {
            if (newHead.x < 0) newHead.x = canvasDimension.x / tileWidth
            else if (newHead.x > canvasDimension.x / tileWidth) newHead.x = 0
            else if (newHead.y < 0) newHead.y = canvasDimension.y / tileHeight
            else if (newHead.y > canvasDimension.y / tileHeight) newHead.y = 0
        }
    }

    private checkCollisions(newHead: Vec2D, hasWarpPowerup: boolean = false, gameState: GameState): boolean {
        const otherSnakes: Snake[] = this.getOtherSnakes(gameState)
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

    private removeSegmentOthers(gameState: GameState) {
        const otherSnakes: Snake[] = this.getOtherSnakes(gameState)
        otherSnakes.forEach(snake => {
            snake.removeSegment()
            if (snake.snakeParts.length == 0) {
                snake.kill(gameState)
            }
        })
    }

    private getOtherSnakes(gameState: GameState) {
        return gameState.snakes.filter(snake => snake.player != this.player)
    }

    public removeSegment() {
        this.snakeParts.pop()
    }

    public eatFood(gameState: GameState) {

        this.addSegment()
        this.speed = Math.min(this.speed + 1.5, 20)
        if (this.activePowerups.some(powerup => powerup instanceof EatOthers)) {
            this.removeSegmentOthers(gameState)
        }
    }

    public setDirection(ev: string) {
        switch (ev) {
            case "ArrowUp":
                if (this.lastDirection.y === 1) break
                this.direction = {x: 0, y: -1}
                break
            case "ArrowDown":
                if (this.lastDirection.y === -1) break
                this.direction = {x: 0, y: +1}
                break
            case "ArrowRight":
                if (this.lastDirection.x === -1) break
                this.direction = {x: 1, y: 0}
                break
            case "ArrowLeft":
                if (this.lastDirection.x === 1) break
                this.direction = {x: -1, y: 0}
                break

            case "w":
                if (this.lastDirection.y === 1) break
                this.direction = {x: 0, y: -1}
                break
            case "s":
                if (this.lastDirection.y === -1) break
                this.direction = {x: 0, y: +1}
                break
            case "d":
                if (this.lastDirection.x === -1) break
                this.direction = {x: 1, y: 0}
                break
            case "a":
                if (this.lastDirection.x === 1) break
                this.direction = {x: -1, y: 0}
                break
        }
        console.log(this.direction)
    }

    public getDirection(): Vec2D {
        this.lastDirection = this.direction
        return this.direction
    }
}
