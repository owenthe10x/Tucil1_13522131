import optimizeSequences from './processors'
import {getRootsAllValues} from './tree'
import {constructSolutionText} from './utilities'

export function removeDuplicates(arr) {
	const keys = new Set()
	return arr.filter((seq) => {
		const key =
			seq.result.join(',') +
			'_' +
			seq.includes
				.map((incl) => incl.join(','))
				.sort((a, b) => a.localeCompare(b))
				.join('-')
		if (keys.has(key)) {
			return false
		}
		keys.add(key)
		return true
	})
}

export default function runSolver(matrix, sequences, bufferSize, rawSequence) {
	// optimizesquence mengembalikan semua kombinasi sequence yang mungkin menjadi jawaban akhir
	const roots = optimizeSequences(sequences)
	// ini menambah sequence secara individu karna optimizer hanya return kombinasinya saja
	const values = [
		// add original sequences individually since sequence optimizer
		// only returns combinations
		...sequences.map((sequence) => ({
			result: sequence,
			includes: [sequence],
		})),
		// roots adalah semua kombinasi sequence yang mungkin jadi jawaban akhir
		...getRootsAllValues(roots),
	]
	const seqsThatFitInBuffer = values.filter(
		(r) => r.result.length <= bufferSize
	)
	const dedupedSeqs = removeDuplicates(seqsThatFitInBuffer)
	return runSolverUnprioritized(matrix, bufferSize, dedupedSeqs, rawSequence)
}

function runSolverUnprioritized(
	matrix,
	bufferSize,
	optimalSequences,
	rawSequence
) {
	const solutionsByDistance = optimalSequences
		.flatMap((match) => {
			const pattern = match.result
			const solutions = brute(pattern, matrix, true)
			return solutions.map((solution) => ({match, solution}))
		})
		// it's possible that a sequence was found which includes skips
		// filter out solutions that are longer than the buffer size!
		.filter((seq) => seq.solution.length <= bufferSize)
		.map((s) => ({
			...s,
			routeWeight: calculateRouteWeight(s.solution, rawSequence, matrix),
		}))
		.sort((routeWeight) => routeWeight.reward)
		.reverse()
	return {solution: solutionsByDistance}
}

function calculateRouteWeight(route, rawSequence, rawMatrix) {
	const solutionText = constructSolutionText(route, rawMatrix)
	let totalReward = 0
	for (let i = 0; i < rawSequence.length; i++) {
		const sequence = rawSequence[i]
		const sequenceText = sequence.token
			.trim()
			.split(' ')
			.map((n) => parseInt(n, 16))
			.join(' ')
		const sequenceReward = sequence.reward
		if (solutionText.includes(sequenceText)) {
			totalReward += sequenceReward
		}
		console.log('Total Reward: ', totalReward)
	}
	return totalReward
}

export const brute = (pattern, matrix, findAll) => {
	const yLen = matrix.length
	const xLen = matrix[0].length

	// queue untuk bfs
	const queue = [
		{
			patternPtr: 0,
			used: make2dArray(yLen, xLen, false),
			stepsSoFar: [],
			x: 0,
			y: 0,
			allowedDir: 'horizontal',
		},
	]

	let isInitial = true
	const solutions = []

	while (queue.length > 0) {
		const searchPoint = queue.shift()
		const {patternPtr, used, stepsSoFar, allowedDir} = searchPoint

		if (patternPtr === pattern.length) {
			// found a solution!
			if (!findAll) {
				return [stepsSoFar]
			}
			// continue searching
			solutions.push(stepsSoFar)
		}

		for (const {x, y} of walkAllowedDir(searchPoint, yLen, xLen)) {
			if (matrix[y][x] === pattern[patternPtr]) {
				queue.push({
					patternPtr: patternPtr + 1,
					used: markUsed(used, x, y),
					stepsSoFar: stepsSoFar.concat({x, y}),
					allowedDir: allowedDir === 'vertical' ? 'horizontal' : 'vertical',
					x,
					y,
				})
			} else if (isInitial) {
				// allow one wasted step if it's the first row
				queue.push({
					patternPtr: patternPtr,
					used: markUsed(used, x, y),
					stepsSoFar: stepsSoFar.concat({x, y}),
					allowedDir: allowedDir === 'vertical' ? 'horizontal' : 'vertical',
					x,
					y,
				})
			}
		}
		// status iterasi pertama atau bukan
		isInitial = false
	}
	return solutions
}

function* walkAllowedDir(searchPoint, yLen, xLen) {
	const {used, allowedDir} = searchPoint

	if (allowedDir === 'vertical') {
		const {x} = searchPoint
		for (let y = 0; y < yLen; y++) {
			if (used[y][x]) {
				continue
			}
			yield {x, y}
		}
	} else {
		const {y} = searchPoint
		for (let x = 0; x < xLen; x++) {
			if (used[y][x]) {
				continue
			}
			yield {x, y}
		}
	}
}

function markUsed(arr, x, y) {
	const copy = clone2d(arr)
	copy[y][x] = true
	return copy
}

function clone2d(arr) {
	return arr.map((subarr) => subarr.slice())
}

function make2dArray(yLen, xLen, fillValue) {
	const arr = new Array(yLen)
	for (let y = 0; y < yLen; y++) {
		arr[y] = new Array(xLen).fill(fillValue)
	}
	return arr
}
