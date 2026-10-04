const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store players in memory
const players = {};

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "Game server is running",
        players: Object.keys(players).length
    });
});

// Create a new player
app.post("/players", (req, res) => {
    const id = "player_" + Date.now();

    players[id] = {
        id: id,
        x: 50,
        y: 50,
        health: 100,
        score: 0
    };

    res.json(players[id]);
});

// Get all players
app.get("/players", (req, res) => {
    res.json(players);
});

// Update a player's position
app.put("/players/:id", (req, res) => {
    const id = req.params.id;

    if (!players[id]) {
        return res.status(404).json({
            error: "Player not found"
        });
    }

    const { x, y, health, score } = req.body;

    if (x !== undefined) players[id].x = x;
    if (y !== undefined) players[id].y = y;
    if (health !== undefined) players[id].health = health;
    if (score !== undefined) players[id].score = score;

    res.json(players[id]);
});

// Delete a player
app.delete("/players/:id", (req, res) => {
    const id = req.params.id;

    if (!players[id]) {
        return res.status(404).json({
            error: "Player not found"
        });
    }

    delete players[id];

    res.json({
        message: "Player removed"
    });
});

app.listen(PORT, () => {
    console.log(`Game server running on port ${PORT}`);
});