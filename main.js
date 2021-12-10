import * as can from "./thelib.js"

const game = new can.main()
game.setup()

//objects
//player
const player = new can.drawRect(game.canvas, new can.vector(100, 200), new can.vector(50, 50), "yellow", 1, 0)
player.gravity = 0
player.particles = []
player.coldownPart = 0

//pumps
const pumps = []
let coldown = 0

//score
const scores = []
const scoreEl = document.querySelector("#score-el")
let scoren = 0
const scoreParticles = []

//background
const m = 3
const bg = [new can.drawImg(game.canvas, new can.vector(0, 0), new can.vector(360 * m, 240 * m), 'background.png'),
    new can.drawImg(game.canvas, new can.vector(360 * m, 0), new can.vector(360 * m, 240 * m), 'background.png')]

function update() {
    game.smoothEffect(1, new can.vector(game.width, game.height))
    //effects
    //player particles
    player.coldownPart += 0.02
    if (player.coldownPart > 0.4) {
        player.coldownPart = 0

    }


    //Controls
    //gravity
    player.gravity += 0.1
    player.gravity = can.math.clamp(player.gravity, -5, 5)
    player.pos.y += player.gravity

    //dead
    if (player.pos.y + player.size.y < 0 || player.pos.y > game.height) {
        dead()
    }

    //pumbs
    coldown += 0.02
    if (coldown > 2) {
        coldown = 0
        const pos = can.math.random(-200, 100)
        pumps.push(new can.drawRect(game.canvas, new can.vector(game.width, -100 + pos), new can.vector(50, 500), 'green', 1, 1, 'blue', 1))
        scores.push(new can.drawRect(game.canvas, new can.vector(game.width, pumps[pumps.length - 1].pos.y + pumps[pumps.length - 1].size.y), new can.vector(50, 167), 'red', 1, 0))
        scores[scores.length - 1].canAdd = true
        pumps.push(new can.drawRect(game.canvas, new can.vector(game.width, game.height - 150 + pos), new can.vector(50, 500), 'green', 1, 1, 'blue', 1))
        pumps[pumps.length - 1].canAdd = true
    }

    //Draw objects
    bg.forEach(b => {
        b.pos.x -= 1
        if(b.pos.x < 0 - b.size.x){
            b.pos.x = b.size.x - 10
        }
        b.draw()
    })
    player.draw()
    pumps.forEach(pump => {
        pump.pos.x -= 2
        if (player.pos.x > pump.pos.x && pump.canAdd) {
            pump.canAdd = false
            //add score
            scoren++
            scoreEl.textContent = `score : ${scoren}`
            for (var i = 0; i < 30; i++) {
                const size = can.math.random(3, 6)
                scoreParticles.push(new can.particles(game.canvas,
                    new can.vector(player.pos.x + player.size.x / 2,
                        player.pos.y + player.size.y / 2),
                    new can.vector(
                        size,
                        size),
                    'green',
                    1, new can.vector(can.math.random(-3, 3), can.math.random(-3, 3)), 3,0))
            }
        }
        if (can.collide.boxes(player, pump)) {
            dead()
        }
        pump.draw()
    })
    //draw effects
    player.particles.forEach((part, i) => {
        part.speed.x *= 0.9
        part.speed.y *= 0.9
        if (Math.abs(part.speed.x) < 0.1) {
            player.particles.splice(i, 1)
        }
        part.defaltMotion()
    })
    scoreParticles.forEach((part, i) => {
        if (part.timer >= part.maxTime) {
            scoreParticles.splice(i, 1)
        }
        part.defaltMotion()
    })

    requestAnimationFrame(update)
}

function dead() {
    player.pos.equal(100, 200)
    player.gravity = 0
    pumps.splice(0, pumps.length)
    scores.splice(0, scores.length)
    scoren = 0
    scoreEl.textContent = `score : 0`
    bg[0].pos.x = 0
    bg[1].pos.x = bg[0].size.x
}

update()
addEventListener("touchstart", () => {
    player.gravity -= 5
    for (var i = 0; i < 10; i++) {
        const size = can.math.random(3, 6)
        player.particles.push(new can.particles(game.canvas,
            new can.vector(player.pos.x + player.size.x / 2,
                player.pos.y + player.size.y / 2),
            new can.vector(
                size,
                size),
            'orange',
            1, new can.vector(can.math.random(-6, 6), can.math.random(-6, 6)), 3,0))
    }
})