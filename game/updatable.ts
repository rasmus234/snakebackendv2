import GameState from "./gameState"

export interface Updatable {
    update(gameState: GameState)
}