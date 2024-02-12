'use client'
import {constructSolutionText, isOneOfTheSolutions} from '@/lib/utilities'

const Result = ({matrix, result, onClose}) => {
	return (
		<div
			className="w-full h-full fixed bottom-0 left-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
			onClick={onClose}
		>
			<div className="flex flex-col items-center">
				<div className="text-xl">
					<p>
						Sequence Text:{' '}
						{result.solution.length > 0
							? constructSolutionText(result.solution[0].solution, matrix)
							: 'Not found.'}
					</p>
					<p>
						Sequence Index:{' '}
						{result.solution.length > 0
							? result.solution[0].solution.map((sol) => `{${sol.x},${sol.y}}`)
							: 'Not found.'}
					</p>
					<p>
						Reward:{' '}
						{result.solution.length > 0
							? result.solution[0].routeWeight
							: 'Not found.'}
					</p>
				</div>
				{result.solution.length > 0 ? (
					<>
						<div className={`grid grid-flow-row  w-fit h-fit`}>
							{matrix.map((row, i) => (
								<div key={i} className={`grid grid-flow-col `}>
									{row.map((col, j) => (
										/* result.solution[0].solution */
										<div
											key={j}
											className={`relative w-10 h-10 flex justify-center items-center ${
												isOneOfTheSolutions(j, i, result.solution[0].solution)
													? ' border-2 border-yellow-400 '
													: ''
											}`}
										>
											{isOneOfTheSolutions(
												j,
												i,
												result.solution[0].solution
											) ? (
												<p className="absolute -top-2 -right-2 text-black bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center aspect-square">
													{result.solution[0].solution.findIndex((obj) => {
														return obj.x === j && obj.y === i
													}) + 1}
												</p>
											) : (
												<></>
											)}
											<p>{col}</p>
										</div>
									))}
								</div>
							))}
						</div>
						<p className="py-5">Solution found in {result.time}ms</p>
					</>
				) : (
					<h3 className="py-40">Solution not found.</h3>
				)}
				<p className="py-10 ">Click anywhere to close.</p>
			</div>
		</div>
	)
}

export default Result
