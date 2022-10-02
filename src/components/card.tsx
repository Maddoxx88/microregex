import { CopyIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Tag, TagLabel, Text, useColorModeValue as lightDarkVal } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { throttle } from "lodash";

type Props = {};

export default function Card({}: Props) {
	const toast = useToast();

	const handleCardClick = throttle(() => {
		toast({
			title: "Copied to Clipboard!",
			status: "success",
			icon: <CopyIcon fontSize="xl" />,
			duration: 750,
		});
	}, 750);

	const handlePreventClickPassthrough: React.MouseEventHandler<HTMLDivElement> = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	return (
		<Box
			minH={60}
			h="full"
			w="100%"
			borderRadius={6}
			boxShadow="0 0 6px 2px rgba(0, 0, 0, 0.075)"
			p={4}
			_hover={{ boxShadow: "0 0 6px 2px rgba(0, 0, 0, 0.25)" }}
			onClick={handleCardClick}
			cursor="pointer"
		>
			<Flex flexDir="column" position="relative" w="100%" h="100%">
				<Flex align="center" fontWeight={600} fontSize="1.25rem" w="calc(100% - 40px)" h="40px" pr={2} lineHeight={1}>
					<Text onClick={handlePreventClickPassthrough}>Title</Text>
				</Flex>

				<IconButton
					aria-label="Click to copy"
					icon={<CopyIcon />}
					variant="ghost"
					position="absolute"
					top="0"
					right="0"
				/>

				<Flex flex="1 0 auto" align="center" w="full" justify="center">
					<Text
						w="full"
						fontSize="lg"
						fontStyle="italic"
						textAlign="center"
						color={lightDarkVal("gray.500", "gray.400")}
					>
						Preview text
					</Text>
				</Flex>

				<Flex align="center" justify="flex-end">
					<Tag
						onClick={handlePreventClickPassthrough}
						variant="solid"
						marginInlineStart={0}
						marginInlineEnd={2}
						cursor="pointer"
					>
						<TagLabel>{Math.random() > 0.5 ? "Usernames" : "Passwords"}</TagLabel>
					</Tag>
				</Flex>
			</Flex>
		</Box>
	);
}
