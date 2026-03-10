const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.04
const wind = 0.5

const maxHeight = 15
const minHeight = 5

const maxWidth = 6
const minWidth = 3

const maxStartSpeed = 13

const maxCloudWidth = 230
const minCloudWidth = 150

const maxCloudHeight = 100
const minCloudHeight = 35

const umbrellaHandleRadius = 30
const umbrellaHeight = 130
const umbrellaRadius = 100

const raincolor = '#c4c4c4' // Rain

c.strokeStyle = 'black' // Umbrella

const mouse = {x: null, y: null};

window.addEventListener('mousemove', (e) => {mouse.x = e.clientX; mouse.y = e.clientY})

function minmaxgenerator(max, min) {
    return (Math.random()*(max-min))+min
}

class Drops {
    constructor() {
        this.reset()
    }

    reset() {
        this.x = Math.random()*canvas.width;
        this.y = 0;
        this.dx = Math.random()*wind * (Math.random() < 0.5 ? -1 : 1)
        this.dy = Math.random()*maxStartSpeed;
        this.width = minmaxgenerator(maxWidth, minWidth)
        this.height = minmaxgenerator(maxHeight, minHeight)
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

                this.dy = 0.8
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

class Clouds {
    constructor() {
        this.width = minmaxgenerator(maxCloudWidth, minCloudWidth)
        this.x = Math.random()*(canvas.width-this.width)
        this.y = Math.random()*(canvas.height*0.4) + (canvas.height*0.1)
        this.dx = Math.random()*wind * (Math.random() < 0.5 ? -1 : 1)
        this.opacity = Math.random()
        this.height = minmaxgenerator(maxCloudHeight*0.7, minCloudHeight)

        this.npoints = Math.floor(Math.random()*3)+2
    }

    draw() {
        if (this.x < 0 || this.x+this.width > canvas.width) {
            this.dx *= -1;
        }
        this.x += this.dx

        c.fillStyle = `rgba(199, 196, 191, ${this.opacity})`
        c.beginPath()
        c.moveTo(this.x, this.y)
        c.lineTo(this.x+this.width, this.y)
        c.stroke()

        for (let i = 0; i < this.npoints; i++) {
            const x = this.width*(this.npoints - i - 1) / this.npoints
            const cx = this.x+x+(x/2)
            if (i == this.npoints - 1) {
                c.quadraticCurveTo(cx, this.y - maxCloudHeight, this.x+x, this.y)
                c.stroke()
                break
            }
            c.quadraticCurveTo(cx, this.y - maxCloudHeight, this.x+x, this.y - this.height)
            c.stroke()
        }

        c.fill();
    }
}

const rain = []

for (let i = 0; i < 200; i++) {
    rain.push(new Drops())
}

const clouds = []

for (let i = 0; i < 8; i++) {
    clouds.push(new Clouds())
}

function startRain() {
    c.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < clouds.length; i++) {
        clouds[i].draw()
    }


    for (let i = 0; i < rain.length; i++) {
        rain[i].drop()
    }

    // Umbrella
    c.beginPath();
    c.lineWidth = 8
    c.arc(mouse.x - umbrellaHandleRadius, mouse.y, umbrellaHandleRadius, 0, Math.PI)
    c.stroke();

    c.lineWidth = 4
    c.beginPath()
    c.moveTo(mouse.x, mouse.y)
    c.lineTo(mouse.x, mouse.y-umbrellaHeight-umbrellaRadius/6)
    c.stroke();

    c.lineWidth = 2
    c.fillStyle = 'rgba(0, 0, 0, 0.3)'
    c.beginPath()
    c.arc(mouse.x, mouse.y-umbrellaHeight, umbrellaRadius, 0, Math.PI, true)
    c.quadraticCurveTo(mouse.x - (umbrellaRadius*2/3), mouse.y-umbrellaHeight-umbrellaRadius/3, mouse.x-(umbrellaRadius/3), mouse.y - umbrellaHeight)
    c.quadraticCurveTo(mouse.x, mouse.y-umbrellaHeight-umbrellaRadius/3, mouse.x+(umbrellaRadius/3), mouse.y-umbrellaHeight)
    c.quadraticCurveTo(mouse.x + (umbrellaRadius*2/3), mouse.y-umbrellaHeight-umbrellaRadius/3, 
    mouse.x+umbrellaRadius, mouse.y-umbrellaHeight)
    c.stroke();
    c.fill();

    requestAnimationFrame(startRain)
}

startRain();
