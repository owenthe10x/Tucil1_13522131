const processInput = (matrix, sequence) => {
	const newMatrix = matrix.split('\n').map((m) => {
		return m.split(' ')
	})
	const newSequence = sequence.map((s) => {
		return {token: s.token.split(' '), reward: s.reward}
	})
	return [newMatrix, newSequence]
}

export const bruteForce = (matrix, sequence, buffer) => {
	const [newMatrix, newSequence] = processInput(matrix, sequence)
	console.log(newMatrix, newSequence)
	const start = new Date().getTime()
	const n = newMatrix.length
	const m = newMatrix[0].length
	const dp = new Array(n)
	for (let i = 0; i < n; i++) {
		dp[i] = new Array(m)
		for (let j = 0; j < m; j++) {
			dp[i][j] = 0
		}
	}
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			for (let k = 0; k < newSequence.length; k++) {
				if (i - k < 0) {
					break
				}
				if (newMatrix[i][j] === newSequence[k].token) {
					if (k === 0) {
						dp[i][j] = newSequence[k].reward
					} else {
						dp[i][j] += newSequence[k].reward
					}
				}
			}
		}
	}
	const result = {totalReward: 0, buffer: 0, coordinate: [], time: 0}
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if (dp[i][j] > result.totalReward) {
				result.totalReward = dp[i][j]
				result.coordinate = [i, j]
			}
		}
	}
	const end = new Date().getTime()
	result.time = end - start
	result.buffer = buffer
	return result
}

export const bufferOptions = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
]

const dummyMatrix = [
	['7A', '55', 'E9', 'E9', '1C', '55'],
	['55', '7A', '1C', '7A', 'E9', '55'],
	['55', '1C', '1C', '55', 'E9', 'BD'],
	['BD', '1C', '7A', '1C', '55', 'BD'],
	['BD', '55', 'BD', '7A', '1C', '1C'],
	['1C', '55', '55', '7A', '55', '7A'],
]
