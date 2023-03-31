import { CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	IconButton, Tag,
	TagLabel,
	Text,
	useColorModeValue as lightDarkVal,
	useToast,
	useToken
} from "@chakra-ui/react";
import { throttle } from "lodash";
import { useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
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
	preview: string;
	selectedLang: string;
	isLg: boolean;
	isTab: boolean;
	idx: number;
	handleCardClick: (currentCardIndex: number) => void;
};


export default function Card({ name, content, tags, selectedLang, isLg, isTab, handleCardClick, idx }: Props) {
	const toast = useToast();
	const [blue500] = useToken("colors", ["blue.500"])

	const handleCopyBtnClick: React.MouseEventHandler<HTMLButtonElement> = throttle(async (e) => {
		e.stopPropagation();
		e.preventDefault();
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

	const [containerXL] = useToken('sizes', ['container.xl'])

	const selectedLanguage: string = useMemo(() => {
		const syntaxLang: { [key: string]: string } = {
			'js': 'javascript',
			'py': 'python',
		};
		
		return syntaxLang[selectedLang] || 'javascript';
	}, [selectedLang]);

	return (
		<Box
			minH={48}
			h="full"
			w="full"
			borderRadius={6}
			boxShadow={`0 0 6px 2px ${blue500}33`}
			p={4}
			transition="box-shadow ease-in 175ms"
			_hover={{ boxShadow: `0 0 6px 2px ${blue500}66` }}
			onClick={()=>handleCardClick(idx)}
			cursor="pointer"
		>

			<Flex flexDir="column" position="relative" w="100%" h="full">
				<Flex align="center" fontWeight={400} fontSize="sm" w="calc(100% - 40px)" h="40px" pr={2} lineHeight={1}>
					<Text
						color={lightDarkVal("#1f1f1f", "white")}
						onClick={handlePreventClickPassthrough}
						cursor="default"
						fontWeight={500}
						fontSize={isLg ? (isTab ? "md" : "lg") : "md"}
					>
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
					onClick={handleCopyBtnClick}
				/>

				<Flex flex="1 0 auto" align="center" w="full" justify="center">
					<Text
						maxW={isLg ? (isTab ? "330px" : `calc((${containerXL}) / 3 - 70px)`) : "xs"}
						textAlign="center"
						overflowX="auto"
						as="div"
						fontSize={isLg ? (isTab ? "md" : "md") : "xs"}
						p={2}
					>
						<SyntaxHighlighter wrapLines wrapLongLines language={selectedLanguage} style={a11yLight}>
							{getContent() || ''}
						</SyntaxHighlighter>
					</Text>
				</Flex>

				<Flex align="center" justify="flex-end" mt={4}>
					{tags.map((tag, tagIndex) => {
						return (
							<Tag
								onClick={handlePreventClickPassthrough}
								marginInlineStart={0}
								marginInlineEnd={2}
								cursor="default"
								key={tagIndex}
								size="md"
								variant='subtle'
								colorScheme='twitter'
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
