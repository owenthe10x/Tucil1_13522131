export const processInput = (matrix, sequence) => {
	return [
		matrix.split('\n').map((row) =>
			row
				.trim()
				.split(' ')
				.map((n) => parseInt(n, 16))
		),
		sequence.split('\n').map((row) =>
			row
				.trim()
				.split(' ')
				.map((n) => parseInt(n, 16))
		),
	]
}


export const processFile = (text) => {
	const lines = text
		.trim()
		.split(/[(\n|\r\n)]/)
		.filter((s) => s !== '')
	const buffer = lines[0]
	const m = Number(lines[1].split(' ')[0])
	let matrix = ''
	let sequence = []
	for (let i = 2; i < m + 2; i++) {
		matrix = matrix.concat(lines[i])
		if (i + 1 !== m + 2) {
			matrix = matrix.concat('\n')
		}
	}
	const x = Number(lines[m + 2]) * 2
	for (let j = m + 3; j < x + m + 3; j = j + 2) {
		sequence.push({token: lines[j], reward: Number(lines[j + 1])})
	}
	return {buffer, matrix, sequence}
}

function matchSequence(split, remain) {
	const children = remain.flatMap((remainder, remainIndex) => {
		const childSplits = constructSequence(remainder, split.result, [
			remainder,
			...split.includes,
		])
		const childRemains = remain.filter((_, i) => i !== remainIndex)
		return childSplits.map((childSplit) =>
			matchSequence(childSplit, childRemains)
		)
	})
	return {
		children,
		value: split,
	}
}


export const processOutput = (matrix) => {
	return matrix.split('\n').map((row) => row.trim().split(' '))
}

export default function findSequences(candidates) {
	let rootNodes = []
	for (let i = 0; i < candidates.length; i++) {
		const candidate = candidates[i]
		const targets = candidates.filter((_, index) => index !== i)
		for (let j = 0; j < targets.length; j++) {
			const target = targets[j]
			const remain = targets.filter((_, index) => index !== j)
			const initialSplits = constructSequence(candidate, target, [
				candidate,
				target,
			])
			rootNodes = rootNodes.concat(
				initialSplits.map((split) => matchSequence(split, remain))
			)
		}
	}
	return rootNodes
}

function checkMatchR(offset, a, b) {
	for (let i = offset; i < b.length; i++) {
		if (a[i - offset] !== b[i]) {
			return false
		}
	}
	return true
}

function checkMatchL(offset, a, b) {
	for (let i = offset; i < a.length; i++) {
		if (a[i] !== b[i - offset]) {
			return false
		}
	}
	return true
}

function constructSequence(candidate, target, includes) {
	let sequences = []
	// gabungin 2 sequence dengan menghilangkan token yang sama dan bertetangga, misal A B dengan B C menjadi A B C
	// bisa jadi tidak ada kombinasi yang mungkin
	for (let shiftRight = 0; shiftRight < target.length; shiftRight++) {
		if (checkMatchR(shiftRight, candidate, target)) {
			sequences.push({shift: shiftRight, dir: 'right'})
		}
	}

	for (let shiftLeft = 1; shiftLeft < candidate.length; shiftLeft++) {
		if (checkMatchL(shiftLeft, candidate, target)) {
			sequences.push({shift: shiftLeft, dir: 'left'})
		}
	}

	sequences.push({shift: target.length, dir: 'right'})
	sequences.push({shift: candidate.length, dir: 'left'})

	return sequences.map((s) => applyShift(candidate, target, s, includes))
}

function applyShift(shiftee, target, shift, includes) {
	let result = []

	if (shift.dir === 'right') {
		const output = [...target]
		output.length = Math.max(shiftee.length + shift.shift, target.length)
		for (let i = 0; i < shiftee.length; i++) {
			output[i + shift.shift] = shiftee[i]
		}
		result = output
	} else {
		const output = [...shiftee]
		output.length = Math.max(target.length + shift.shift, shiftee.length)
		for (let i = 0; i < target.length; i++) {
			output[i + shift.shift] = target[i]
		}
		result = output
	}

	return {
		...shift,
		result,
		shiftee,
		target,
		includes,
	}
}
