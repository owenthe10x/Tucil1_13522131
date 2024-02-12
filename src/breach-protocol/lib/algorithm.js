import findSequencess from './processors'
import {constructSolutionText} from './utilities'

export function BFS(roots) {
	const seenNodes = []
	let queue = [...roots.map((n) => ({...n, depth: 1}))]
	while (queue.length > 0) {
		const node = queue.shift()
		seenNodes.push(node)
		queue = queue.concat(
			node.children.map((child) => ({...child, depth: node.depth + 1}))
		)
	}
	return seenNodes
}

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

export default function findSolution(
	matrix,
	sequences,
	bufferSize,
	rawSequence
) {
	// optimizesquence mengembalikan semua kombinasi sequence yang mungkin menjadi solusi akhir
	const roots = findSequencess(sequences)
	const rootsValues = BFS(roots).map((node) => node.value)

	// ini menambah sequence secara individu karna optimizer hanya return kombinasinya saja
	const values = [
		...sequences.map((sequence) => ({
			result: sequence,
			includes: [sequence],
		})),
		...rootsValues,
	]
	const seqsThatFitInBuffer = values.filter(
		(r) => r.result.length <= bufferSize
	)
	const uniqueSequences = removeDuplicates(seqsThatFitInBuffer)
	const solutionsByDistance = uniqueSequences
		.flatMap((match) => {
			const pattern = match.result
			const solutions = findSolutions(pattern, matrix, true)
			return solutions.map((solution) => ({match, solution}))
		})
		.filter((seq) => seq.solution.length <= bufferSize)
		.map((s) => ({
			...s,
			totalReward: calculateTotalReward(s.solution, rawSequence, matrix),
		}))
		.sort((totalReward) => totalReward.reward)
		.reverse()
	return {solution: solutionsByDistance}
}

function calculateTotalReward(route, rawSequence, rawMatrix) {
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
	}
	return totalReward
}

export const findSolutions = (pattern, matrix, findAll) => {
	const yLen = matrix.length
	const xLen = matrix[0].length

	// queue untuk bfs
	const queue = [
		{
			patternPtr: 0,
			used: constructArray(yLen, xLen, false),
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
			if (!findAll) {
				return [stepsSoFar]
			}
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
			}
			// baris pertama bukan? kalo iya maka di toleransi walaupun ga sesuai sequence
			else if (isInitial) {
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
	const copy = cloneArray(arr)
	copy[y][x] = true
	return copy
}

function cloneArray(arr) {
	return arr.map((subarr) => subarr.slice())
}

function constructArray(yLen, xLen, fillValue) {
	const arr = new Array(yLen)
	for (let y = 0; y < yLen; y++) {
		arr[y] = new Array(xLen).fill(fillValue)
	}
	return arr
}
