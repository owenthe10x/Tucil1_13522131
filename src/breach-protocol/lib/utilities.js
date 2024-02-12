export const resultToTxt = (result, matrix) => {
	const {solution, time} = result
	let resultText = ''
	resultText = resultText.concat(solution[0].totalReward)
	resultText = resultText.concat('\n')
	resultText = resultText.concat(
		constructSolutionText(solution[0].solution, matrix)
	)
	resultText = resultText.concat('\n')
	resultText = resultText.concat(
		solution[0].solution.map((sol) => `${sol.x},${sol.y}`).join('\n')
	)
	resultText = resultText.concat('\n\n')
	resultText = resultText.concat(time)
	resultText = resultText.concat('ms\n')
	return resultText
}

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
	return {matrix: matrixString, sequence, buffer}
}
