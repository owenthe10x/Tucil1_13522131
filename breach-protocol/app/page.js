import Form from './Form'
import ClientPage from './ClientPage'
const Page = () => {
	return (
		<main className="space-y-20 pt-20 pb-40 font-mono">
			<section className="font-mono font-bold text-3xl pl-20 ">
				<h1>Cyberpunk 2077</h1>
				<h1 className="pl-20">Breach Protocol</h1>
			</section>
			<ClientPage />
		</main>
	)
}

export default Page
