'use client'
import {useState} from 'react'
import TextField from '@mui/material/TextField'
import {createTheme, Divider, ThemeProvider} from '@mui/material'
import Button from '@mui/material/Button'
import findSolution from '../lib/algorithm'
import {processInput} from '../lib/processors'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {styled} from '@mui/material/styles'
import {processFile} from '../lib/processors'
import {generateInput} from '@/lib/utilities'
const nullSettings = {
	matrix: '',
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
const nullGenerateSettings = {
	buffer: 0,
	matrixSizer: {row: 0, column: 0},
	token: '',
	totalSequence: 0,
	sequenceMax: 0,
}
const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
})
const Form = ({onResultFound}) => {
	const [settings, setSettings] = useState(nullSettings)
	const [generateSettings, setGenerateSettings] = useState(nullGenerateSettings)
	const submitHandler = async (e) => {
		e.preventDefault()
		const sequenceToken = settings.sequence.map((s) => s.token).join('\n')
		const [processedMatrix, processedSequence] = processInput(
			settings.matrix,
			sequenceToken
		)
		const start = new Date().getTime()
		let result = findSolution(
			processedMatrix,
			processedSequence,
			settings.buffer,
			settings.sequence
		)
		const end = new Date().getTime()
		result = {...result, time: end - start}
		onResultFound(result, settings.matrix)
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

	const onAddSequence = () => {
		const newSequence = settings.sequence
		newSequence.push({token: '', reward: 0})
		setSettings({...settings, sequence: newSequence})
	}

	const onSequenceChange = (index, e) => {
		let data = [...settings.sequence]
		if (e.target.name === 'reward') {
			data[index]['reward'] = Number(e.target.value)
		} else {
			data[index]['token'] = e.target.value
		}

		setSettings({...settings, sequence: data})
	}

	const onFileChange = async (e) => {
		e.preventDefault()
		const reader = new FileReader()
		reader.onload = async (e) => {
			const text = e.target.result
			const fileSettings = processFile(text)
			setSettings(fileSettings)
		}
		reader.readAsText(e.target.files[0])
		document.getElementById('manualinput').scrollIntoView({behavior: 'smooth'})
	}

	const generateHandler = (e) => {
		e.preventDefault()
		const settings = generateInput(generateSettings)
		setSettings(settings)
		document.getElementById('manualinput').scrollIntoView({behavior: 'smooth'})
	}
	return (
		<ThemeProvider theme={theme}>
			<div className="px-20 ">
				<h3 className="text-xl mb-5">File Input</h3>
				<Button
					color="ochre"
					component="label"
					variant="contained"
					startIcon={<CloudUploadIcon />}
					href="#manualinput"
				>
					Upload file
					<VisuallyHiddenInput type="file" onChange={(e) => onFileChange(e)} />
				</Button>
			</div>
			<Divider
				textAlign="left"
				sx={{marginY: 5, width: '90%', marginX: 'auto'}}
			>
				OR
			</Divider>
			<form className="px-20" onSubmit={generateHandler}>
				<h3 className="text-xl ">Generated Input</h3>
				<section className="grid grid-cols-8 gap-5 py-5">
					<TextField
						label="Token"
						value={generateSettings.token}
						color="ochre"
						focused
						onChange={(e) =>
							setGenerateSettings({...generateSettings, token: e.target.value})
						}
						placeholder="BD E9 1C 7A"
					/>
					<TextField
						label="Buffer size"
						value={generateSettings.buffer}
						color="ochre"
						focused
						onChange={(e) =>
							setGenerateSettings({
								...generateSettings,
								buffer: Number(e.target.value),
							})
						}
					/>
					<TextField
						label="Row"
						value={generateSettings.matrixSizer.row}
						color="ochre"
						focused
						onChange={(e) =>
							setGenerateSettings({
								...generateSettings,
								matrixSizer: {
									...generateSettings.matrixSizer,
									row: Number(e.target.value),
								},
							})
						}
					/>
					<TextField
						label="Column"
						value={generateSettings.matrixSizer.column}
						color="ochre"
						focused
						onChange={(e) =>
							setGenerateSettings({
								...generateSettings,
								matrixSizer: {
									...generateSettings.matrixSizer,
									column: Number(e.target.value),
								},
							})
						}
					/>
					<TextField
						label="Max seq size"
						value={generateSettings.sequenceMax}
						color="ochre"
						focused
						onChange={(e) =>
							setGenerateSettings({
								...generateSettings,
								sequenceMax: Number(e.target.value),
							})
						}
					/>
					<TextField
						label="Total sequence"
						value={generateSettings.totalSequence}
						color="ochre"
						focused
						onChange={(e) =>
							setGenerateSettings({
								...generateSettings,
								totalSequence: Number(e.target.value),
							})
						}
					/>

					<div className="flex items-center col-span-2">
						<Button
							variant="contained"
							type="submit"
							className="bg-yellow-400 text-black hover:bg-yellow-400 hover:text-black"
							sx={{
								gridColumn: 'span 2',
								height: 'fit-content',
							}}
							disabled={
								generateSettings.buffer === 0 ||
								generateSettings.matrixSizer.row === 0 ||
								generateSettings.matrixSizer.column === 0 ||
								generateSettings.sequenceMax === 0
							}
						>
							Generate
						</Button>
					</div>
				</section>
			</form>
			<Divider
				textAlign="left"
				sx={{marginY: 5, width: '90%', marginX: 'auto'}}
			>
				OR
			</Divider>
			<form onSubmit={submitHandler}>
				<h3 id="manualinput" className="manualinput text-xl px-20 mb-5">
					Manual Input
				</h3>
				<div className="grid grid-cols-2 px-20 gap-10">
					<section className="grid grid-cols-1 gap-10">
						<TextField
							label="Buffer size"
							value={settings.buffer}
							color="ochre"
							focused
							onChange={(e) =>
								setSettings({...settings, buffer: Number(e.target.value)})
							}
						/>
						<TextField
							id="outlined-multiline-flexible"
							label="Matrix"
							value={settings.matrix}
							multiline
							maxRows={10}
							color="ochre"
							focused
							placeholder={`7A 55 E9 E9 1C 55\n55 7A 1C 7A E9 55\n55 1C 1C 55 E9 BD\nBD 1C 7A 1C 55 BD\nBD 55 BD 7A 1C 1C\n1C 55 55 7A 55 7A`}
							onChange={(e) =>
								setSettings({...settings, matrix: e.target.value})
							}
						/>
						<Button
							variant="contained"
							type="submit"
							className="bg-yellow-400 text-black hover:bg-yellow-400 hover:text-black"
							disabled={
								settings.matrix === '' || settings.sequence.length === 0
							}
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
										placeholder="BD E9 1C 7A 55"
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
