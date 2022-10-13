import { Box, ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/home";

import { NhostClient, NhostReactProvider } from "@nhost/react";

import theme from "./theme";

import "@fontsource/inter/variable.css";

const nhost = new NhostClient({
	subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
	region: process.env.REACT_APP_NHOST_REGION,
});

function App() {
	return (
		<NhostReactProvider nhost={nhost}>
			<ChakraProvider theme={theme}>
				<Router>
					<Box minH="100vh">
						<Navbar />

						<Box minH="calc(100vh - 60px)" overflowX="hidden">
							<Routes>
								<Route path="/" element={<HomePage />} />
							</Routes>
						</Box>
					</Box>
				</Router>
			</ChakraProvider>
		</NhostReactProvider>
	);
}

export default App;
