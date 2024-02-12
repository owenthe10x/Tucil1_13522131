'use client'
import {useState} from 'react'
import Form from './Form'
import {processOutput} from '@/lib/processors'
import Result from './Result'
import {createTheme, ThemeProvider} from '@mui/material'

const ClientPage = () => {
	const [result, setResult] = useState()
	const [resultModal, setResultModal] = useState(false)
	const [onLoading, setOnLoading] = useState(false)
	const [matrix, setMatrix] = useState()
	const resultHandler = (result, matrix) => {
		const processedMatrix = processOutput(matrix)
		document.body.style.overflow = 'hidden'
		setResult(result)
		setMatrix(processedMatrix)
		setResultModal(true)
		console.log('result', result)
	}
	const closeResult = () => {
		document.body.style.overflow = 'unset'
		setResultModal(false)
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
	return (
		<ThemeProvider theme={theme}>
			<Form onResultFound={resultHandler} />

			{onLoading && (
				<div className="absolute top-0 left-0 bg-black bg-opacity-70 flex justify-center">
					<p>Loading...</p>
				</div>
			)}
			{resultModal && (
				<Result matrix={matrix} result={result} onClose={closeResult} />
			)}
		</ThemeProvider>
	)
}

export default ClientPage
