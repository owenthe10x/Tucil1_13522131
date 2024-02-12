// sequences adalah array of sequence
// targetSequence adalah sequence yang ingin dicari
export const containsSequence = (sequences, targetSequence) =>
	sequences.some((sequence) => {
		if (sequence.length !== targetSequence.length) {
			return false
		}
		for (let i = 0; i < sequence.length; i++) {
			if (sequence[i] !== targetSequence[i]) {
				return false
			}
		}

		return true
	})

export const constructSolutionText = (solution, matrix) => {
	const solutionText = solution.map((s) => matrix[s.y][s.x]).join(' ')
	return solutionText
}

export const isOneOfTheSolutions = (x, y, solution) => {
	return solution.some((s) => s.x === x && s.y === y)
}

export const generateInput = ({
	buffer,
	matrixSizer,
	token,
	totalSequence,
	sequenceMax,
}) => {
	const tokenArray = token.trim().split(' ')
	const matrix = Array.from({length: matrixSizer.row}, () =>
		Array.from({length: matrixSizer.column}, () => {
			const randomIndex = Math.floor(Math.random() * tokenArray.length)
			return tokenArray[randomIndex]
		})
	)
	const matrixString = matrix.map((row) => row.join(' ')).join('\n')
	let sequence = []
	for (let i = 0; i < totalSequence; i++) {
		const sequenceLength = Math.floor(Math.random() * sequenceMax) + 1
		const sequenceArray = Array.from({length: sequenceLength}, () => {
			const randomIndex = Math.floor(Math.random() * tokenArray.length)
			return tokenArray[randomIndex]
		})
		const reward = Math.floor(Math.random() * 100)
		sequence.push({token: sequenceArray.join(' '), reward})
	}
	console.log('matrix', matrixString)
	console.log('sequence', sequence)
	return {matrix: matrixString, sequence, buffer}
}
