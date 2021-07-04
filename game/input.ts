import {Vec2D} from "./vec2D";
import {player} from "./player";

let lastDirection1: Vec2D
let direction1: Vec2D = {x: 0, y: 1}
let lastDirection2: Vec2D
let direction2: Vec2D = {x: 0, y: 1}


//   switch (ev.key) {
//     case "ArrowUp":
//       if (lastDirection1.y === 1) break
//       direction1 = {x: 0, y: -1}
//       break
//     case "ArrowDown":
//       if (lastDirection1.y === -1) break
//       direction1 = {x: 0, y: +1}
//       break
//     case "ArrowRight":
//       if (lastDirection1.x === -1) break
//       direction1 = {x: 1, y: 0}
//       break
//     case "ArrowLeft":
//       if (lastDirection1.x === 1) break
//       direction1 = {x: -1, y: 0}
//       break;
//
//     case "w":
//       if (lastDirection2.y === 1) break
//       direction2 = {x: 0, y: -1}
//       break
//     case "s":
//       if (lastDirection2.y === -1) break
//       direction2 = {x: 0, y: +1}
//       break
//     case "d":
//       if (lastDirection2.x === -1) break
//       direction2 = {x: 1, y: 0}
//       break
//     case "a":
//       if (lastDirection2.x === 1) break
//       direction2 = {x: -1, y: 0}
//       break
//   }
// })

export function getDirection(playerNumber: player) : Vec2D{
  lastDirection1 = direction1
  lastDirection2 = direction2
  if (playerNumber == player.PLAYER1) return direction1
  else if (playerNumber == player.PLAYER2) return direction2
}

