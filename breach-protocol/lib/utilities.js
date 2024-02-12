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

