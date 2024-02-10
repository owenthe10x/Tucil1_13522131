'use client'
import {useState} from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import {createTheme, ThemeProvider} from '@mui/material'
import Button from '@mui/material/Button'
import {bruteForce, bufferOptions} from './algorithm'
import Autocomplete from '@mui/material/Autocomplete'
const nullSettings = {
	matrix: [],
	sequence: [{token: '', reward: 0}],
	buffer: 0,
}
const dummySettings = {
	matrix:
		'7A 55 E9 E9 1C 55\n55 7A 1C 7A E9 55\n55 1C 1C 55 E9 BD\nBD 1C 7A 1C 55 BD\nBD 55 BD 7A 1C 1C\n1C 55 55 7A 55 7A',
	sequence: [
		{token: 'BD E9 1C', reward: 15},
		{token: 'BD 7A BD', reward: 20},
		{token: 'BD 1C BD 55', reward: 30},
	],
	buffer: 7,
}
const nullResult = {totalReward: 0, buffer: 0, coordinate: [], time: 0}

const Form = () => {
	const [settings, setSettings] = useState(dummySettings)
	const [result, setResult] = useState()
	const submitHandler = async (e) => {
		e.preventDefault()
		const result = await bruteForce(
			settings.matrix,
			settings.sequence,
			settings.buffer
		)
		console.log(result)
	}
	const theme = createTheme({
		palette: {
			mode: 'dark',
			ochre: {
				main: '#E3D026',
				light: '#E9DB5D',
				dark: '#A29415',
				contrastText: '#242105',
			},
		},
	})

	const onMatrixChange = (e) => {
		const matrix = e.target.value.split('\n')
		const newMatrix = matrix.map((m) => {
			return m.split(' ')
		})
		setSettings({...settings, matrix: newMatrix})
		console.log(settings)
	}

	const onAddSequence = () => {
		const newSequence = settings.sequence
		newSequence.push({token: '', reward: 0})
		setSettings({...settings, sequence: newSequence})
	}

	const onSequenceChange = (index, e) => {
		let data = [...settings.sequence]
		data[index][e.target.name] = e.target.value
		setSettings({...settings, sequence: data})
	}
	return (
		<ThemeProvider theme={theme}>
			<form onSubmit={submitHandler}>
				<div className="grid grid-cols-2 px-20 gap-10">
					<section className="grid grid-cols-1 gap-10">
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							color="ochre"
							value={settings.buffer}
							options={bufferOptions}
							sx={{width: '100%'}}
							onChange={(e) => {
								setSettings({...settings, buffer: Number(e.target.value)})
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Buffer size"
									color="ochre"
									focused
								/>
							)}
						/>
						<TextField
							id="outlined-multiline-flexible"
							label="Matrix"
							value={settings.matrix}
							multiline
							maxRows={10}
							color="ochre"
							focused
							onChange={onMatrixChange}
						/>
						<Button
							variant="contained"
							type="submit"
							className="bg-yellow-400 text-black hover:bg-yellow-400 hover:text-black"
						>
							Solve
						</Button>
					</section>
					<section className="row-span-2 space-y-4">
						{settings.sequence.map((s, index) => {
							return (
								<section className="space-x-4 grid grid-cols-2" key={index}>
									<TextField
										id="outlined-basic"
										name="token"
										label="Sequence"
										variant="outlined"
										value={s.token}
										color="ochre"
										focused
										onChange={(event) => {
											onSequenceChange(index, event)
										}}
									/>
									<TextField
										id="outlined-basic"
										name="reward"
										label="Reward"
										variant="outlined"
										value={s.reward}
										color="ochre"
										focused
										onChange={(event) => {
											onSequenceChange(index, event)
										}}
									/>
								</section>
							)
						})}

						<section className="flex justify-end col-span-2 h-fit">
							<Button
								variant="contained"
								onClick={onAddSequence}
								className="bg-yellow-400 text-black hover:bg-yellow-400 hover:text-black"
							>
								Add more
							</Button>
						</section>
					</section>
				</div>
			</form>
		</ThemeProvider>
	)
}

export default Form
