import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type Props = {};

export default function Card({}: Props) {
	return (
		<Box
			h={60}
			w="100%"
			borderRadius={6}
			boxShadow="0 0 6px 2px rgba(0, 0, 0, 0.075)"
			p={2}
			_hover={{ boxShadow: "0 0 6px 2px rgba(0, 0, 0, 0.25)" }}
		>
			<Text>Card</Text>
		</Box>
	);
}
