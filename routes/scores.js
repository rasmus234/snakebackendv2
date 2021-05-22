const express = require("express")
const router = express.Router()
const Score = require("../models/score")
module.exports = router



//getting all scores
router.get("/", (async (req, res) => {
    try {
        const scores = await Score.find().sort(
        {
            score: -1
        })
            .limit(20)
        res.json(scores)
    } catch (err){
        res.status(500).json({message: err.message})
    }

}))
//getting one score
router.get("/:id", ((req, res) => {
    res.send(req.params.id)
}))

//creating one score
router.post("/", (async (req, res) => {

    const score = new Score({
        username: req.body.username,
        score: req.body.score,
    })
    try {
        const newScore = await score.save()
        res.status(201).json(newScore)
    }catch (err){
        res.status(400).json({message: error.message})
    }
}))
//deleting one score
router.delete("/:id", ((req, res) => {

}))
//updating one
router.patch("/:id", ((req, res) => {

}))