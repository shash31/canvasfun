const canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext('2d')

const colors = ['red', 'blue', 'green', 'purple', 'magenta']

c.textAlign = 'center'
c.textBaseline = 'middle'
c.font = '30px Sans-Serif'

const maxxspeed = 10
const maxyspeed = 5

const gravity = 0.5

console.log(maxxspeed, maxyspeed)

class DVDPlayer {
    constructor() {
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*(canvas.height / 2);
        this.dx = (Math.random()*maxxspeed - 1)+1
        this.dy = (Math.random()*maxyspeed - 1)+1
        this.dx *= Math.random() < 0.5 ? -1 : 1
        this.dy *= Math.random() < 0.5 ? -1 : 1
        // this.dx = 1
        // this.dy = 1
        this.color = colors[Math.floor(Math.random()*colors.length)]
    }

    draw() {
        c.fillStyle = this.color;
        c.fillText('DVDPlayer', this.x, this.y)
    }

    update() {
        if (this.x < canvas.width && this.x > 0) {
            this.x += this.dx
        } else {
            this.dx *= -1
            this.x += this.dx
        }

        if (this.y < canvas.height && this.y > 0) {
            this.y += this.dy
        } else {
            this.dy *= -1
            this.y += this.dy*2
        }

        this.dy += gravity

        this.draw();
    }
}

const players = []
for (let i = 0; i < 10; i++) {
    players.push(new DVDPlayer())
}

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < players.length; i++) {
        players[i].update()
    }

    requestAnimationFrame(animate)
}

animate();
