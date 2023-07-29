const canvas = document.querySelector("canvas")
const gfx = canvas.getContext("2d")

var pixelScale = 3

class Level {
	w = 0
	h = 0
	pixels = new Array()
	chunkSize = 32

	constructor(w, h) {
		this.w = w
		this.h = h

		this.pixels.length = ((this.w * this.chunkSize) * this.h)
	}

	generate() {
		for (let x = 0; x < this.w * this.chunkSize; x++) {
			let height = (((Math.abs(Math.sin(x * 0.05) * (x / 48) % (this.h) - 10)) - 0.2) / 0.4) % this.h

			for (let y = 0; y < this.h; y++) {
				this.pixels[x + y * (this.w * this.chunkSize)] = 0

				if (y >= height) {
					this.pixels[x + y * (this.w * this.chunkSize)] = 1
				}
			}
		}
	}
}

var level = new Level(23, 128)

class Noise {
	w = 0
	h = 0
	cells = new Array()

	constructor(w, h) {
		this.w = w
		this.h = h

		this.cells.length = this.w * this.h
		this.cells.fill(1)
	}

	deg2rad(degrees){
		var pi = Math.PI

		return degrees * (pi/180)
	}

	countNeighbors(x, y) {
		var count = 0

		for (let w = -1; w < 2; w++) {
			for (let s = -1; s < 2; s++) {
				if (w == 0 && s == 0)
					continue

				if (x + w < 0 || y + s < 0 || x + w >= this.w || y + s >= this.h)
					count++

				var n = this.cells[(x + w) + (y + s) * this.w]

				if (n == 1)
					count++
			}
		}

		return count
	}

	generate() {
		var to = {
			x: 0,
			y: 0
		}

		for (let x = 0; x < this.w; x++) {
			for (let y = 0; y < this.h; y++) {
				//to.x *= Math.cos(to.x) * 180 / Math.PI

				var period = 0

				var eye = {
					x: 0,
					y: 0
				}

				while (period < 12) {
					
					eye.x += Math.cos(this.deg2rad(Math.random() * 360))
					eye.y += Math.cos(this.deg2rad(Math.random() * 180))

					eye.x += Math.pow(9, -2)

					period ++
				}

				if (to.x + eye.x < 0)
					eye.x = -eye.x

				if (to.y + eye.y < 0)
					eye.y = -eye.y

				to.x += eye.x / 3 + 0
				to.y += eye.y / 3 + 0

				if (to.x < 0 || to.y < 0 || to.x >= this.w || to.y >= this.h)
					this.cells[Math.floor(to.x) + Math.floor(to.y) * this.w] = 1

					
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {

						var cellX = Math.floor(to.x + i)
						var cellY = Math.floor(to.y + j)

						this.cells[cellX + cellY * this.w] = 0
					}
				}
			}
		}

		for (let x = 0; x < this.w; x++) {
			for (let y = 0; y < this.h; y++) {
				if (this.cells[x + y * this.w] == 1 && this.countNeighbors(x, y) < 4) {
					this.cells[x + y * this.w] = 0
				}

				if (x < 4 || y < 4 || x > (this.w - 4) || y > (this.h - 4))
					this.cells[x + y * this.w] = 1
			}
		}
	}

	draw() {
		for (let x = 0; x < this.w; x++) {
			for (let y = 0; y < this.h; y++) {
				gfx.fillStyle = "white"

				if (this.cells[x + y * this.w] == 1) {
					gfx.fillStyle = "black"
				}

				gfx.fillRect(x, y, 1, 1)
			}
		}
	}
}

var noise = new Noise(level.w * level.chunkSize, level.h)
noise.generate()

function update() {
	
	//noise.draw()

	gfx.fillStyle = "rgb(125, 50, 25)"

	for (let x = 0; x < level.w * level.chunkSize; x++) {
		for (let y = 0; y < level.h; y++) {
			if (level.pixels[x + y * (level.w * level.chunkSize)] == 1) {
				//gfx.fillRect(x * pixelScale, 100 + y * pixelScale, pixelScale, pixelScale)
			}
		}
	}

	for (let x = 0; x < level.w * level.chunkSize; x++) {
		for (let y = 0; y < level.h; y++) {
			if (noise.cells[x + y * level.w * level.chunkSize] == 1) {
				gfx.fillRect(x * pixelScale, y * pixelScale, pixelScale, pixelScale)
			}
		}
	}
	

	requestAnimationFrame(update)
}

function main() {
	gfx.clearRect(0, 0, canvas.width, canvas.height)

	gfx.fillStyle = "lightblue"
	gfx.fillRect(0, 0, canvas.width, canvas.height)

	level.generate()

	update()
}

main()