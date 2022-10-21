import { AbsoluteCenter, Button, Link, Text, useMediaQuery, useToken } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";

const NotFound = () => {
	const [lgSize] = useToken("sizes", ["container.md"]);
	const [isLg] = useMediaQuery(`(min-width: ${lgSize})`);
	const [isTab] = useMediaQuery(`(min-width: ${lgSize}) and (max-width: 1154px)`);
	return (
		<AbsoluteCenter h="40%" color="black" textAlign={"center"}>
			<Text fontSize={isLg ? (isTab ? "8xl" : "9xl") : "6xl"} my={2}>
				Oops!
			</Text>
			<Text fontSize={isLg ? (isTab ? "3xl" : "4xl") : "xl"} my={2}>
				404 - Page not found
			</Text>
			<Button my={2} colorScheme="twitter" variant={"solid"}>
				<Link as={ReachLink} to="/">
					Go to homepage
				</Link>
			</Button>
		</AbsoluteCenter>
	);
};

export default NotFound;
