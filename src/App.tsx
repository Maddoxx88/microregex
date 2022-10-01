import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/home";
import Navbar from "./components/navbar";
import { Box } from "@chakra-ui/react";

import theme from "./theme";

function App() {
	return (
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
	);
}

export default App;
