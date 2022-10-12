import { CopyIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Tag, TagLabel, Text, useColorModeValue as lightDarkVal, useToast } from "@chakra-ui/react";
import { throttle } from "lodash";

import { copyTextToClipboard } from "../utils/copytext";
import { tagsObject } from "../utils/tags";

type ContentType = {
	[key: string]: string;
};

type Props = {
	name: string;
	description: string;
	content: ContentType;
	tags: string[];
	selectedLang: string;
	isLg: boolean;
	isTab: boolean;
};

export default function Card({ name, content, description, tags, selectedLang, isLg, isTab }: Props) {
	const toast = useToast();

	const handleCardClick = throttle(async () => {
		let content = getContent();
		if (content) {
			const copied = await copyTextToClipboard(content);
			
			toast({
				title: copied ? "Copied to Clipboard!" : "Error copying content. Try again!",
				status: copied ? "success" : "error",
				icon: <CopyIcon fontSize="xl" />,
				duration: 750,
				isClosable: true,
			});
		}
	}, 750);

	const getContent = () => {
		if (content && selectedLang in content) {
			return content[selectedLang];
		}
		return null;
	};

	const handlePreventClickPassthrough: React.MouseEventHandler<HTMLDivElement> = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};
	

	return (
		<Box
			minH={60}
			h="full"
			w="full"
			borderRadius={6}
			boxShadow="0 0 6px 2px rgba(0, 0, 0, 0.075)"
			p={4}
			transition="box-shadow ease-in 175ms"
			_hover={{ boxShadow: "0 0 6px 2px rgba(0, 0, 0, 0.25)" }}
			onClick={handleCardClick}
			cursor="pointer"
		>
			<Flex flexDir="column" position="relative" w="100%" h="100%">
				<Flex align="center" fontWeight={600} fontSize="1.25rem" w="calc(100% - 40px)" h="40px" pr={2} lineHeight={1}>
					<Text onClick={handlePreventClickPassthrough} cursor="default">
						{name}
					</Text>
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
						maxW={isLg ? isTab ? "330px": "320px": "auto"}
						fontSize={isLg ? isTab ? "md" : "md" : "2.5vw"}
						fontStyle="italic"
						textAlign="center" overflowX='auto'
						as="pre"
						color={lightDarkVal("gray.500", "gray.400")}
					>
						{getContent()}
					</Text>
				</Flex>

				<Flex align="center" justify="flex-end">
					{tags.map((tag, tagIndex) => {
						return (
							<Tag
								onClick={handlePreventClickPassthrough}
								variant="solid"
								marginInlineStart={0}
								marginInlineEnd={2}
								cursor="default"
								key={tagIndex}
							>
								<TagLabel>{tagsObject[tag] || null}</TagLabel>
							</Tag>
						);
					})}
				</Flex>
			</Flex>
		</Box>
	);
}
