import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/home";
import Navbar from "./components/navbar";
import { Box } from "@chakra-ui/react";

import theme from "./theme";

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Router>
				<Box minH="100vh">
					<Navbar />

					<Box minH="calc(100vh - 60px)" h="calc(100vh - 60px)" overflowY="auto" overflowX="hidden">
						<Routes>
							<Route path="/" element={<HomePage />} />
						</Routes>
					</Box>
				</Box>
			</Router>
		</ChakraProvider>
	);
}

export default App;
