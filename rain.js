const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.03
const wind = 0.5

const maxHeight = 15
const minHeight = 5

const maxWidth = 6
const minWidth = 3

const maxStartSpeed = 15

const umbrellaHandleRadius = 30
const umbrellaHeight = 130
const umbrellaRadius = 100

const raincolor = '#c4c4c4' // Rain

c.strokeStyle = 'black' // Umbrella

const mouse = {x: null, y: null};

window.addEventListener('mousemove', (e) => {mouse.x = e.clientX; mouse.y = e.clientY; console.log(mouse.x, mouse.y)})

class Drops {
    constructor() {
        this.reset()
    }

    reset() {
        this.x = Math.random()*canvas.width;
        this.y = 0;
        this.dx = Math.random()*wind * (Math.random() < 0.5 ? -1 : 1)
        this.dy = Math.random()*maxStartSpeed;
        this.width = (Math.random()*(maxWidth-minWidth)) + minWidth
        this.height = (Math.random()*(maxHeight-minHeight)) + minHeight
    }

    drop() {
        if (this.y <= canvas.height) {
            if (this.x < mouse.x + umbrellaRadius && this.x > mouse.x - umbrellaRadius
                && this.y >= mouse.y - umbrellaHeight - umbrellaRadius - 15
            ) {
                if (this.x < mouse.x) { 
                    this.dx = -1.5
                } else {
                    this.dx = 1.5
                }

                this.dy = 0.4
            }

            this.x += this.dx
            this.y += this.dy
            this.dy += gravity
        
            c.fillStyle = raincolor
            c.fillRect(this.x, this.y, this.width, this.height)
        } else {
            this.reset()
        }
    }
}

const rain = []

for (let i = 0; i < 150; i++) {
    rain.push(new Drops())
}

function startRain() {
    c.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < rain.length; i++) {
        rain[i].drop()
    }

    c.beginPath();
    c.lineWidth = 8
    // c.moveTo(mouse.x, mouse.y)
    c.arc(mouse.x - umbrellaHandleRadius, mouse.y, umbrellaHandleRadius, 0, Math.PI)
    c.stroke();

    c.lineWidth = 4
    c.beginPath()
    c.moveTo(mouse.x, mouse.y)
    c.lineTo(mouse.x, mouse.y-umbrellaHeight)
    c.stroke();

    c.lineWidth = 2
    c.fillStyle = 'rgba(0, 0, 0, 0.3)'
    c.arc(mouse.x, mouse.y-umbrellaHeight, umbrellaRadius, 0, Math.PI, true)
    c.lineTo(mouse.x, mouse.y-umbrellaHeight)
    c.stroke();
    c.fill();

    requestAnimationFrame(startRain)
}

startRain();
