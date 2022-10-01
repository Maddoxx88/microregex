import { Box, ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/home";

import { NhostClient, NhostReactProvider } from "@nhost/react";

import theme from "./theme";

const nhost = new NhostClient({
	subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
	region: process.env.REACT_APP_NHOST_REGION,
});

function App() {
	return (
		<NhostReactProvider nhost={nhost}>
			<ChakraProvider theme={theme}>
				<Box minH='100vh'>
					<Navbar />

					<Box minH='calc(100vh - 60px)'>
						<Router>
							<Routes>
								<Route path='/' element={<HomePage />} />
							</Routes>
						</Router>
					</Box>
				</Box>
			</ChakraProvider>
		</NhostReactProvider>
	);
}

export default App;
