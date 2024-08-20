import * as Galaxy from "./galaxy.js"
import * as Star from "./star.js"

import {radians, choice, shuffle, stepDistanceAngle,
	floatsNearlyEqual, range, random, int, dist} from "../utils.js"

let log = console.log
let error = console.error
let values = Object.values

const starGridSize = 0.25
const starGridJitter = 0.25 - (0.25/4)

export function centerGalaxy(galaxy) {
	// center the map in the galaxy
	let min_x = Number.MAX_VALUE
	let min_y = Number.MAX_VALUE
	let max_x = Number.MIN_VALUE
	let max_y = Number.MIN_VALUE

	for (let star of values(galaxy.stars)) {
		if (star.x < min_x) min_x = star.x
		if (star.y < min_y) min_y = star.y
		if (star.x > max_x) max_x = star.x
		if (star.y > max_y) max_y = star.y
	}

	let mid_x = (max_x + min_x) / 2
	let mid_y = (max_y + min_y) / 2

	let dif_x = 0 - mid_x + int(random(-2, 2))
	let dif_y = 0 - mid_y + int(random(-2, 2))

	for (let star of values(galaxy.stars)) {
		star.x += dif_x
		star.y += dif_y
	}
	for (let fleet of values(galaxy.fleets)) {
		fleet.x += dif_x
		fleet.y += dif_y
	}
}

export function initAllStars(galaxy) {
	// adjust the upgrade prices of all stars.
	for (let star of values(galaxy.stars)) {
		Star.calcResources(galaxy, star)
		Star.updateScanned(star)
	}
}

export function setResources(star, level, fixed = 0) {
	// fixed is used by the custom editor so the player can specify the resources rather than roll them.
	if (fixed > 0) {
		if (level === 1) fixed *= 0.75
		if (level === 3) fixed *= 1.5
		star.res = Math.round(fixed)
		star.nat = star.res
		return star
	}

	let p0x = 1
	let p1x = 12.5
	if (level === 1) p1x = 1
	if (level === 3) p1x = 25

	let p2x = 50

	let t = random()
	let u = 1.0 - t

	star.res = Math.round(p0x * u * u + p1x * 2 * u * t + p2x * t * t)
	star.nat = star.res
	return star
}

export function testWapgate(star, chance) {
	if (chance === 0) return star

	let gateRoll = random()
	if (chance === 1 && gateRoll < 0.10) star.gate = 1
	if (chance === 2 && gateRoll < 0.30) star.gate = 1

	return star
}

export function createHomeStarPointsCustom(distance, rawCustomStars, players) {
	let homeStarPoints = []
	for (let i = 0; i <= players.length; i += 1) {
		if (i < rawCustomStars.length) {
			let sx = rawCustomStars[i][0] * distance / 24.0
			let sy = rawCustomStars[i][1] * distance / 24.0
			homeStarPoints.push({x: sx, y: sy})
		}
	}
	return homeStarPoints
}

export function createHomeStarPointsQuadFlower64(distance, players) {
	distance *= 1.125
	let homeStarPoints = []
	let xjhdextersData = [[31.9068, -6.2000], [8.7681, 0.0000], [21.1681, 0.0000], [31.9068, 6.2000], [42.6456, 12.4000], [44.9731, 24.5796], [54.3572, 16.4741], [56.6847, 28.6537], [56.2323, 41.0455], [44.2548, 44.2548], [53.0229, 53.0229], [41.0455, 56.2323], [28.6537, 56.6847], [24.5796, 44.9731], [16.4741, 54.3572], [12.4000, 42.6456], [6.2000, 31.9068], [0.0000, 8.7681], [0.0000, 21.1681], [-6.2000, 31.9068], [-12.4000, 42.6456], [-24.5796, 44.9731], [-16.4741, 54.3572], [-28.6537, 56.6847], [-41.0455, 56.2323], [-44.2548, 44.2548], [-53.0229, 53.0229], [-56.2323, 41.0455], [-56.6847, 28.6537], [-44.9731, 24.5796], [-54.3572, 16.4741], [-42.6456, 12.4000], [-31.9068, 6.2000], [-8.7681, 0.0000], [-21.1681, 0.0000], [-31.9068, -6.2000], [-42.6456, -12.4000], [-44.9731, -24.5796], [-54.3572, -16.4741], [-56.6847, -28.6537], [-56.2323, -41.0455], [-44.2548, -44.2548], [-53.0229, -53.0229], [-41.0455, -56.2323], [-28.6537, -56.6847], [-24.5796, -44.9731], [-16.4741, -54.3572], [-12.4000, -42.6456], [-6.2000, -31.9068], [0.0000, -8.7681], [0.0000, -21.1681], [6.2000, -31.9068], [12.4000, -42.6456], [24.5796, -44.9731], [16.4741, -54.3572], [28.6537, -56.6847], [41.0455, -56.2323], [44.2548, -44.2548], [53.0229, -53.0229], [56.2323, -41.0455], [56.6847, -28.6537], [44.9731, -24.5796], [54.3572, -16.4741], [42.6456, -12.4000]]
	for (let i = 0; i <= players.length; i += 1) {
		if (i < xjhdextersData.length) {
			let sx = xjhdextersData[i][0] * distance / 20.0
			let sy = xjhdextersData[i][1] * distance / 20.0
			homeStarPoints.push({x: sx, y: sy})
		}
	}
	return homeStarPoints
}


export function createHomeStarPointsQuadFlower32(distance, players) {
	// 32 players

	distance = 0.33
	let homeStarPoints = []
	let xjhdextersData = [[11.3218, -2.2000], [3.1113, 0.0000], [7.5113, 0.0000], [11.3218, 2.2000], [11.9446, 6.5557], [7.6945, 7.6945], [10.8058, 10.8058], [6.5557, 11.9446], [2.2000, 11.3218], [0.0000, 3.1113], [0.0000, 7.5113], [-2.2000, 11.3218], [-6.5557, 11.9446], [-7.6945, 7.6945], [-10.8058, 10.8058], [-11.9446, 6.5557], [-11.3218, 2.2000], [-3.1113, 0.0000], [-7.5113, 0.0000], [-11.3218, -2.2000], [-11.9446, -6.5557], [-7.6945, -7.6945], [-10.8058, -10.8058], [-6.5557, -11.9446], [-2.2000, -11.3218], [0.0000, -3.1113], [0.0000, -7.5113], [2.2000, -11.3218], [6.5557, -11.9446], [7.6945, -7.6945], [10.8058, -10.8058], [11.9446, -6.5557]]
	for (let i = 0; i <= players.length; i += 1) {
		if (i < xjhdextersData.length) {
			let sx = xjhdextersData[i][0] * distance
			let sy = xjhdextersData[i][1] * distance
			homeStarPoints.push({x: sx, y: sy})
		}
	}
	return homeStarPoints
}

export function createHomeStarPointsDysps32Even(distance, players) {
	// 32 players

	distance = 1.0
	let homeStarPoints = []
	let xjhdextersData = [[5, 0], [6, 0], [3, 1], [8, 1], [5, 2], [6, 2], [1, 3], [4, 3], [7, 3], [10, 3], [3, 4], [8, 4], [0, 5], [2, 5], [9, 5], [11, 5], [0, 6], [2, 6], [9, 6], [11, 6], [3, 7], [8, 7], [1, 8], [4, 8], [7, 8], [10, 8], [5, 9], [6, 9], [3, 10], [8, 10], [5, 11], [6, 11]]
	for (let i = 0; i <= players.length; i += 1) {
		if (i < xjhdextersData.length) {
			let sx = xjhdextersData[i][0] * distance
			let sy = xjhdextersData[i][1] * distance
			homeStarPoints.push({x: sx, y: sy})
		}
	}
	return homeStarPoints
}

export function createHomeStarPointsDyspsClustersOf4(distance, players) {
	// 32 players

	distance = 0.1
	let homeStarPoints = []
	let xjhdextersData = [[10, 10], [20, 10], [10, 20], [20, 20], [40, 10], [40, 20], [50, 10], [50, 20], [10, 40], [20, 40], [10, 50], [20, 50], [10, 70], [20, 70], [10, 80], [20, 80], [40, 70], [40, 80], [50, 80], [50, 70], [70, 70], [80, 70], [70, 80], [80, 80], [70, 50], [80, 50], [80, 40], [70, 40], [70, 20], [80, 20], [80, 10], [70, 10]]
	for (let i = 0; i <= players.length; i += 1) {
		if (i < xjhdextersData.length) {
			let sx = xjhdextersData[i][0] * distance
			let sy = xjhdextersData[i][1] * distance
			homeStarPoints.push({x: sx, y: sy})
		}
	}
	return homeStarPoints
}


export function createHomeStarPointsHexgrid(distance, players) {
	let homeStarPoints = []
	distance = distance / 2
	let angles = [0, 60, 120, 180, 240, 300]
	let sx = 0
	let sy = 0

	homeStarPoints.push({x: 1, y: 1})
	for (let player of players) {
		// find the next home star position
		// put it one homeStarDistance/2 step away from an existing home star
		// in a direction from the angles list
		let found = false
		let pos
		while (found === false) {
			let angle = choice(angles)
			let rs = choice(homeStarPoints)

			pos = stepDistanceAngle(rs.x, rs.y, distance, radians(angle))
			let overlap = false
			for (let hs of homeStarPoints) {
				if (floatsNearlyEqual(pos.x, hs.x) && floatsNearlyEqual(pos.y, hs.y)) {
					overlap = true
				}
			}

			if (overlap === false) {
				found = true
			}
		}
		homeStarPoints.push(pos)
	}

	return homeStarPoints
}

export function createHomeStarPointsCircle(distance, players) {
	let homeStarPoints = []
	// this is the circumradius of a regular n-gon
	let circumradius = (distance / 2) / (2 * Math.sin(Math.PI / players.length))
	let playerNumber = 0

	for (let player of players) {
		// the next vertex of the regular n-gon that export functionines the "circle" of home stars
		let sx = Math.sin(playerNumber / players.length * 2 * Math.PI) * circumradius
		let sy = Math.cos(playerNumber / players.length * 2 * Math.PI) * circumradius

		homeStarPoints.push({x: sx, y: sy})
		playerNumber += 1
	}
	return homeStarPoints
}

export function createHomeStarPointsMegaCircle(distance, players) {
	let homeStarPoints = []

	let playerNumber = 0
	let circleNumber = 0

	distance *= 1.25 // a scale factor

	let circumradius = (distance / 2) / (2 * Math.sin(Math.PI / 8))
	let circumradiusCircle = (distance * 1.8) / (2 * Math.sin(Math.PI / 8))

	for (let player of players) {
		let csx = Math.sin(circleNumber / 4 * Math.PI) * circumradiusCircle
		let csy = Math.cos(circleNumber / 4 * Math.PI) * circumradiusCircle

		let sx = Math.sin(playerNumber / 4 * Math.PI) * circumradius
		let sy = Math.cos(playerNumber / 4 * Math.PI) * circumradius

		sx += csx
		sy += csy

		homeStarPoints.push({x: sx, y: sy})
		playerNumber += 1

		if (playerNumber % 8 === 0) {
			circleNumber += 1
		}
	}
	return homeStarPoints
}

export function createHomeStarPointsMegaGrid(distance, players) {
	let homeStarPoints = []

	let cords = [0, 1, 3, 4, 7, 8, 10, 11]
	distance *= 0.66

	for (let i of cords) {
		for (let j of cords) {
			homeStarPoints.push({x: i * distance, y: j * distance})
		}
	}

	let rotatedPoints = []
	let a = 0.7853
	let center = 4.5 * distance
	for (let p of homeStarPoints) {
		let nx = center + (p.x - center) * Math.cos(a) - (p.y - center) * Math.sin(a)
		let ny = center + (p.x - center) * Math.sin(a) + (p.y - center) * Math.cos(a)
		rotatedPoints.push({x: nx, y: ny})
	}
	return rotatedPoints
}


export function createPlayerStarsTwinRing(hs, hsd, spp) {
	// note: we are going to generate the stars per player but this ignores the
	// players home star in the centre. Galaxies that use this scatter
	// technique will have an extra star per player.
	let playerStars = []

	let innerCount = Math.floor(spp / 3)
	let outerCount = innerCount * 2

	let innerAngles = range(0, 359, 360 / innerCount)
	let outerAngles = range(0, 359, 360 / outerCount)

	for (let angle of innerAngles) {
		let pos = stepDistanceAngle(hs.x, hs.y, hsd / 10, angle * Math.PI / 180)
		pos.r = 30
		playerStars.push(pos)
	}

	for (let angle of outerAngles) {
		let pos = stepDistanceAngle(hs.x, hs.y, hsd / 5, angle * Math.PI / 180)
		pos.r = 10
		playerStars.push(pos)
	}

	return playerStars
}

export function createPlayerStarsRandomSplatter(galaxy, hs, hsd, spp, kind, ss, starGrid) {
	let playerStars = []
	let circumradius =  hsd / 2 / (2 * Math.sin(Math.PI / values(galaxy.players).length))

	let angles = range(0, 720, 5)
	shuffle(angles)

	let distanceStep = (hsd + 1) / 2 / spp
	let distances = range(0.125, distanceStep * spp * 5, distanceStep * 1)

	let fromCenter = false

	// spp -1 because the home star already counted.
	let i = 0
	while (playerStars.length < spp - 1) {
		i += 1
		if (i > distances.length) {
			break
		}

		// only circular maps throw from center.
		if (kind !== "circular") {
			fromCenter = false
		}

		// while still making starting stars, we wont throw from the centre.
		if (playerStars.length < ss) {
			fromCenter = false
		}

		let throwAngle = radians(choice(angles))
		let pos
		if (fromCenter) {
			// every second star is thrown from the centre of the map, not from the home star.
			// the distance is 0 to 2r of the circle

			let d = random() * circumradius * 2
			pos = stepDistanceAngle(0, 0, d, throwAngle)
			fromCenter = false

		} else {

			let d = distances[i]
			pos = stepDistanceAngle(hs.x, hs.y, d, throwAngle)
			fromCenter = true
		}

		// alias the points onto a grid
		let gridded = addPointToGrid(starGrid, pos)
		if (gridded !== false) {
			pos = gridded
			playerStars.push(pos)
		}

	}
	return playerStars
}


function addPointToGrid(starGrid, point) {
	let pos = {}
	pos.x = Math.round(point.x / starGridSize) * starGridSize
	pos.y = Math.round(point.y / starGridSize) * starGridSize

	if (pos.x in starGrid) {
		if (pos.y in starGrid[pos.x]) {
			// this cell is occupied. now what you going to do.
			starGrid[pos.x][pos.y] += 1
			return false
		} else {
			starGrid[pos.x][pos.y] = {}
			starGrid[pos.x][pos.y] = 1
		}
	} else {
		starGrid[pos.x] = {}
		starGrid[pos.x][pos.y] = 1
	}

	// if the cell is occupied, retun false
	// else return a gridded position
	return pos
}


export function createNameList(config) {
	let names = []
	let selectionPool = [].concat(starnames)
	let prependor = [].concat(preplacenames)
	let namesRequired = (config.starsPerPlayer + 1) * (config.players + 1)

	if (config.mirror) namesRequired += 16

	while (names.length < namesRequired) {
		if (selectionPool.length <= 0) selectionPool = [].concat(starnames)

		let newName = choice(selectionPool)
		selectionPool = selectionPool.filter(n => n !== newName)

		if (names.includes(newName) === false) {
			names.push(newName)
			continue
		} else {
			newName = choice(prependor) + " " + newName
			if (names.includes(newName) === false) {
				names.push(newName)
			}
		}
	}

	shuffle(names)
	return names
}


export function createWormholes(galaxy) {
	let whRequired = 0
	switch (galaxy.config.randomWorms) {
			// no random wormholes in this game.
		default:
			return
		case 1:
			// very rare
			whRequired = Math.ceil(galaxy.config.players / 8)
			break
		case 2:
			// rare
			whRequired = Math.ceil(galaxy.config.players / 4)
			break
		case 3:
			// common
			whRequired = Math.ceil(galaxy.config.players / 2)
			break
	}

	let candidatStars = []
	for (let star of values(galaxy.stars)) {
		if (star.puid <= 0) {
			// make sure we don't build wormholes in the players starting empire.
			candidatStars.push(star)
		}
	}


	if (candidatStars.length < whRequired * 4) {
		// not enough unclaimed stars for the galaxy to be populated with wormholes.
		return
	}

	let i = 0
	while (whRequired > 0 && i < galaxy.config.players * 100) {
		i += 1
		let starA = choice(candidatStars)
		let starB = choice(candidatStars)

		if (dist(starA, starB) < galaxy.config.homeStarDistance) {
			// player home stars are about  half confg.homeStarDistance
			// if the distance is too small, try again.
			continue
		}

		// connect the stars
		starA.whuid = starB.uid
		starB.whuid = starA.uid
		whRequired -= 1

		// trim the chosen stars
		let remainingStars = []
		for (let star of candidatStars) {
			if (star !== starA && star !== starB) {
				remainingStars.push(star)
			}
		}
		candidatStars = remainingStars
	}
}


export function create(galaxy, config) {
	galaxy.stars = {}
	let names = createNameList(config)
	let players = values(galaxy.players)

	shuffle(players)
	// TODO: Its not clear that each of these home star functions needs
	// a list of the platers, and just need to know how many players there are.

	// create a list of points for each players home star
	let homeStarPoints = []
	if (config.starfield === "mega_circle") {
		homeStarPoints = createHomeStarPointsMegaCircle(config.homeStarDistance, players)
	}

	if (config.starfield === "mega_grid") {
		homeStarPoints = createHomeStarPointsMegaGrid(config.homeStarDistance, players)
	}

	if (config.starfield === "circular") {
		homeStarPoints = createHomeStarPointsCircle(config.homeStarDistance, players)
	}

	if (config.starfield === "hexgrid") {
		homeStarPoints = createHomeStarPointsHexgrid(config.homeStarDistance, players)
	}

	if (config.starfield === "custom") {
		homeStarPoints = createHomeStarPointsCustom(config.homeStarDistance, config.customStarfield, players)
	}

	if (config.starfield === "xjhdexters-quad_flower") {
		homeStarPoints = createHomeStarPointsQuadFlower64(config.homeStarDistance, players)
	}

	if (config.starfield === "xjhdexters-quad_flower_32") {
		homeStarPoints = createHomeStarPointsQuadFlower32(config.homeStarDistance, players)
	}

	if (config.starfield === "dysps_32_even") {
		homeStarPoints = createHomeStarPointsDysps32Even(config.homeStarDistance, players)
	}

	if (config.starfield === "dysps_clusters_of_4") {
		homeStarPoints = createHomeStarPointsDyspsClustersOf4(config.homeStarDistance, players)
	}

	shuffle(homeStarPoints)

	// create a star object for each point.
	let nameIndex = 0
	let homeStars = []

	// rather than testing the distance betene each star to make sure they are far enough apart
	// we place every star in a cell, and only allow one star per cell.
	let starGrid = {}

	for (let player of players) {
		let newStar = Galaxy.createStar(
			galaxy,
			names[nameIndex],
			homeStarPoints[nameIndex].x,
			homeStarPoints[nameIndex].y,
			player.uid,
			50,
			config.startInfEco,
			config.startInfSci,
			config.startInfInd,
			config.startShips)

		homeStars.push(newStar)
		nameIndex += 1

		player.home = newStar.uid

		let gridded = addPointToGrid(starGrid, newStar)
		newStar.x = gridded.x
		newStar.y = gridded.y
	}

	let mirrorRelations = []

	let ssp = config.starsPerPlayer
	if (config.mirror === 1) {
		ssp = Math.round(config.starsPerPlayer / 2)
	}

	// for each home star, sprinkle stars around
	for (let hs of homeStars) {
		let points = []
		if (config.starScatter === "twin_ring") {
			points = createPlayerStarsTwinRing(
				hs,
				config.homeStarDistance,
				config.starsPerPlayer)
		} else {
			points = createPlayerStarsRandomSplatter (
				galaxy,
				hs,
				config.homeStarDistance,
				ssp,
				config.starfield,
				config.startStars + 1,
				starGrid)
		}


		for (let point of points) {
			let n = names[nameIndex]
			nameIndex += 1

			let newStar = Galaxy.createStar(galaxy, n, point.x, point.y, -1, 0, 0, 0, 0, 0)
			setResources(newStar, config.naturalResources, point.r)
			testWapgate(newStar, config.randomGates)

			if (config.mirror === 1) {
				// there are a number of problems still with mirror galaxies
				// the home stars are not mirrored resulting in the stars per player being wrong.
				// this method below not generate a mirrored star if the grid is taken.
				// this can result in a star right in the middle at 0,0
				let gridded = addPointToGrid(starGrid, {x: -point.x, y:-point.y})
				if (gridded !== false) {
					n = newStar.name.split('').reverse().join('').toLowerCase() //names[nameIndex]
					n = n.slice(0, 1).toUpperCase().concat(n.slice(1))
					let mirrorStar = Galaxy.createStar(galaxy, n, gridded.x, gridded.y, -1, 0, 0, 0, 0, 0)
					mirrorStar.nat = newStar.nat
					mirrorStar.res = newStar.res
					mirrorStar.gate = newStar.gate

					mirrorRelations.push([newStar, mirrorStar])
				}
			}
		}
	}

	// all the stars are placed, but they are on a grid right now.
	// the grid is starGridSize, so we jiggle each starGridSize / 4 they will always be at least starGridSize / 2 apart
	// at some point in the future we may consider disabling this star grid as an option
	// maps look pretty cool on a grid
	if (config.starScatter === "random") {
		if (config.mirror === 0) {
			for (let star of values(galaxy.stars)) {
				star.x += Math.random() * starGridJitter
				star.y += Math.random() * starGridJitter
			}
		} else {
			for (let relation of mirrorRelations) {
				let jx = Math.random() * starGridJitter
				let jy = Math.random() * starGridJitter
				relation[0].x += jx
				relation[0].y += jy
				relation[1].x -= jx
				relation[1].y -= jy
			}
		}
	}

	// for each home star, sort the stars by distance and give the x nearest to the player
	// -1 because the home stars already given to players
	for (let i=0; i < config.startStars - 1; i += 1) {
		let startingStarResourceSelection = [25, 15, 35, 30, 10, 45, 5, 20, 45, 50]

		for (let hs of homeStars) {
			let sortedStars = values(galaxy.stars)
			sortedStars = sortedStars.filter(star => {
				return star.puid <= 0
			})
			if (sortedStars.length === 0) {
				continue
			}

			sortedStars.sort((a, b) => {
				let d1 = Math.abs(((a.x - hs.x) * (a.x - hs.x)) + ((a.y - hs.y) * (a.y - hs.y)))
				let d2 = Math.abs(((b.x - hs.x) * (b.x - hs.x)) + ((b.y - hs.y) * (b.y - hs.y)))
				if (d1 < d2) return -1
				return 1
			})


			sortedStars[0].puid = hs.puid
			sortedStars[0].str = config.startShips

			if (config.starScatter !== "twin_ring") {
				if (i < startingStarResourceSelection.length) {
					sortedStars[0].res = startingStarResourceSelection[i]
					sortedStars[0].nat = sortedStars[0].res
				}
			}
		}
	}
	centerGalaxy(galaxy)
	createWormholes(galaxy)
	initAllStars(galaxy)
}





//export function parseJsonGalaxy(galaxy, jsonGalaxy) {
//	let rawGalaxy = JSON.parse(jsonGalaxy)
//	galaxy.stars = {}
//	for (let rs of rawGalaxy.stars) {
//		let star = Galaxy.createStar(
//			name = rs.n,
//			x = rs.x,
//			y = rs.y,
//			puid = -1,
//			resources = rs.r,
//			economy = rs.e,
//			science = rs.s,
//			industry = rs.i,
//			strength = rs.st)
//
//		if (rs.puid >= 0) {
//			let player = galaxy.players[rs.puid]
//			player.home = star
//			star.puid = player.uid
//		}
//	}
//}


export let preplacenames = [
	"Hard",
	"Dull",
	"Lush",
	"Dry",
	"Wet",
	"Soft",
	"Hot",
	"Cold",
	"Slow",
	"Fast",
	"Pure",
	"Blue",
	"Red",
	"Black",
	"White",
	"Lost",
	"Fort",
	"Free",
	"Bright",
	"Dark",
	"Grand",
	"Last",
	"Mega",
	"New",
	"Nova",
	"Odd",
	"Old",
	"Port",
	"Wild",
	"Young",
	"Alpha",
	"Beta",
	"Gamma",
	"Delta",
	"Zeta",
	"Eta",
	"Theta",
	"Kappa",
	"Mu",
	"Nu",
	"Xi",
	"Pi",
	"Sigma",
	"Tau",
]

export let greek = [
	"Alpha",
	"Beta",
	"Gamma",
	"Delta",
	"Epsilon",
	"Zeta",
	"Eta",
	"Theta",
	"Iota",
	"Kappa",
	"Lambda",
	"Mu",
	"Nu",
	"Xi",
	"Omicron",
	"Pi",
	"Rho",
	"Sigma",
	"Tau",
	"Upsilon",
	"Phi",
	"Chi",
	"Psi",
	"Omega"
]

export let starnames = [
	"Ale",
	"Arc",
	"Ash",
	"Bam",
	"Chi",
	"Cox",
	"Duo",
	"Dux",
	"Elk",
	"Fax",
	"Fad",
	"Fay",
	"Fez",
	"Fin",
	"Foe",
	"Git",
	"Goo",
	"Gut",
	"Hag",
	"Ill",
	"Ice",
	"Ick",
	"Imp",
	"Ion",
	"Ire",
	"Irk",
	"Jaw",
	"Jib",
	"Keg",
	"Koi",
	"Kit",
	"Kat",
	"Mac",
	"Mix",
	"Mog",
	"Mud",
	"Neo",
	"Nog",
	"Pan",
	"Paw",
	"Pax",
	"Pee",
	"Pug",
	"Quo",
	"Rad",
	"Ram",
	"Rat",
	"Raw",
	"Rub",
	"Rye",
	"Saw",
	"Shy",
	"Sky",
	"Spy",
	"Sun",
	"Tab",
	"Tack",
	"Tag",
	"Tax",
	"Tic",
	"Toe",
	"Ugh",
	"Urn",
	"Wow",
	"Yak",
	"Yay",
	"Yum",
	"Zit",
	"Zoo",
	"Acamar",
	"Achernar",
	"Achird",
	"Acrab",
	"Acrux",
	"Acubens",
	"Adhafera",
	"Adhara",
	"Ain",
	"Aladfar",
	"Alamak",
	"Alathfar",
	"Alaraph",
	"Albaldah",
	"Albali",
	"Albireo",
	"Alchiba",
	"Alcor",
	"Alcyone",
	"Aldebaran",
	"Alderamin",
	"Aldhafera",
	"Aldhanab",
	"Aldhibah",
	"Aldib",
	"Fawaris",
	"Alfecca",
	"Alfirk",
	"Algedi",
	"AlGiedi",
	"Algenib",
	"Algieba",
	"Algol",
	"Algorab",
	"Alhajoth",
	"Alhena",
	"Alioth",
	"Alkaid",
	"AlKurud",
	"Alkalurops",
	"AlKap",
	"Alkes",
	"Alkurah",
	"Almach",
	"AlNair",
	"Alnasl",
	"Alnilam",
	"Alnitak",
	"Alniyat",
	"Alpha",
	"Alphard",
	"Alphecca",
	"Alpheratz",
	"Alrai",
	"Alrakis",
	"Alrami",
	"Alrischa",
	"Alsafi",
	"Alshain",
	"Alshat",
	"Altair",
	"Altais",
	"Altarf",
	"Aludra",
	"Alula",
	"Alwaid",
	"Alya",
	"Alzir",
	"Ancha",
	"Angetenar",
	"Ankaa",
	"Antares",
	"Ant",
	"Arc",
	"Arcturus",
	"Arich",
	"Arided",
	"Arkab",
	"Arneb",
	"Arrakis",
	"Ascella",
	"Asellus",
	"Ash",
	"Ashlesha",
	"Askella",
	"Asp",
	"Asterion",
	"Asterope",
	"Atik",
	"Atlas",
	"Atria",
	"Auva",
	"Avior",
	"Azaleh",
	"Azel",
	"Azha",
	"Azimech",
	"Azmidiske",
	"Baham",
	"Baten",
	"Becrux",
	"Beid",
	"Bellatrix",
	"Benetnasch",
	"Betelgeuse",
	"Betria",
	"Bharani",
	"Biham",
	"Birdun",
	"Botein",
	"Brachium",
	"Bunda",
	"Canopus",
	"Capella",
	"Caph",
	"Castor",
	"Cebalrai",
	"Celaeno",
	"Chara",
	"Cheleb",
	"Chertan",
	"Chort",
	"Chow",
	"Cor",
	"Cursa",
	"Corvid",
	"Dabih",
	"Decrux",
	"Deneb",
	"Denebola",
	"Dheneb",
	"Diadem",
	"Diphda",
	"Dnoces",
	"Dschubba",
	"Dubhe",
	"Duhr",
	"Edasich",
	"Electra",
	"Elm",
	"Elnath",
	"Eltanin",
	"Enif",
	"Errai",
	"Etamin",
	"Fomalhaut",
	"Samakah",
	"Furud",
	"Gacrux",
	"Garnet",
	"Gatria",
	"Gianfar",
	"Giedi",
	"Gienah",
	"Giennah",
	"Girtab",
	"Gomeisa",
	"Gor",
	"Grafias",
	"Grassias",
	"Grumium",
	"Hadar",
	"Hadir",
	"Haedus",
	"Haldus",
	"Hamal",
	"Hassaleh",
	"Heka",
	"Heze",
	"Hoedus",
	"Homam",
	"Hyadum",
	"Hydrus",
	"Hydrobius",
	"Izar",
	"Jabbah",
	"Jih",
	"Juxta",
	"Kaf",
	"Kajam",
	"Kastra",
	"Kaus",
	"Keid",
	"Kita",
	"Kleeia",
	"Kochab",
	"Korn",
	"Kraz",
	"Ksora",
	"Kullat",
	"Kuma",
	"Lanx",
	"Lesath",
	"Lucida",
	"Maasym",
	"Mahasim",
	"Maia",
	"Marfark",
	"Marfik",
	"Markab",
	"Matar",
	"Mebsuta",
	"Media",
	"Megrez",
	"Meissa",
	"Mekbuda",
	"Menchib",
	"Menkab",
	"Menkalinan",
	"Menkar",
	"Menkent",
	"Menkib",
	"Merak",
	"Merga",
	"Merope",
	"Mesarthim",
	"Mi",
	"Mimosa",
	"Minchir",
	"Minelava",
	"Minkar",
	"Mintaka",
	"Mira",
	"Mirach",
	"Miram",
	"Mirfak",
	"Mirzam",
	"Misam",
	"Mizar",
	"Mothallah",
	"Muliphein",
	"Muphrid",
	"Murzim",
	"Muscida",
	"Naos",
	"Nash",
	"Nashira",
	"Navi",
	"Nekkar",
	"Neshmet",
	"Nihal",
	"Nunki",
	"Nusakan",
	"Okul",
	"Pax",
	"Peacock",
	"Phact",
	"Phad",
	"Pherkad",
	"Pherkard",
	"Pleione",
	"Polaris",
	"Pollux",
	"Porrima",
	"Praecipua",
	"Procyon",
	"Propus",
	"Proxima",
	"Pux",
	"Rana",
	"Rasalas",
	"Rastaban",
	"Ras",
	"Regor",
	"Regulus",
	"Rigel",
	"Rigil",
	"Ri",
	"Rotanev",
	"Ruchba",
	"Ruchbah",
	"Rukbat",
	"Rukh",
	"Sabik",
	"Sadachbia",
	"Sadalbari",
	"Sadalmelik",
	"Sadalsuud",
	"Sadatoni",
	"Sadira",
	"Sadr",
	"Saiph",
	"Salm",
	"Sargas",
	"Sarin",
	"Sarir",
	"Sasin",
	"Sceptrum",
	"Scheat",
	"Scheddi",
	"Schedir",
	"Segin",
	"Seginus",
	"Sham",
	"Shaula",
	"Sheliak",
	"Sheratan",
	"Sirius",
	"Situla",
	"Skore",
	"Spica",
	"SteropeII",
	"Sualocin",
	"Subra",
	"Suhail",
	"Sulafat",
	"Syrma",
	"Tabit",
	"Talitha",
	"Tania",
	"Tarazet",
	"Taygeta",
	"Tegmen",
	"Terebellum",
	"Tejat",
	"Thabit",
	"Theemin",
	"Thuban",
	"TienKuan",
	"Toliman",
	"Tor",
	"Septen",
	"TseenKee",
	"Tureis",
	"Tyl",
	"Unuk",
	"Vega",
	"Vindemiatrix",
	"Wasat",
	"Wazn",
	"Wei",
	"Wezen",
	"Yed",
	"Yildun",
	"Zaniah",
	"Zaurak",
	"Zavijava",
	"Zosma",
	"Zuben",
	"Zug",
	"Zu",
]
