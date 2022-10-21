import { CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	TagLabel,
	Text,
	useToast
} from "@chakra-ui/react";
import { createFilter, Select, SingleValue } from "chakra-react-select";
import { throttle } from "lodash";
import { useCallback, useMemo, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { OptionType } from "../types";
import { copyTextToClipboard } from "../utils/copytext";
import { tagsObject } from "../utils/tags";


type HandleChangeLang = (newValue: SingleValue<OptionType>) => void;

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
	isOpen: boolean;
	isLg: boolean;
	isTab: boolean;
	onClose: () => void;
	menuLang: OptionType;
	langOptions: OptionType[];
	hangleChangeLang: HandleChangeLang;
};

const InfoModal = ({
	isOpen,
	onClose,
	isLg,
	isTab,
	name,
	content,
	selectedLang,
	description,
	tags,
	preview,
	menuLang,
	langOptions,
	hangleChangeLang,
}: Props) => {
	const [modalMenuLang, setmodalMenuLang] = useState<OptionType>(menuLang);
	const [modalLang, setModalLang] = useState(selectedLang);
	const toast = useToast();

	const langContent = useMemo(() => {
		if (content && modalLang in content) {
			return content[modalLang];
		}

		return [];
	}, [content, modalLang]);

	const hangleModalChangeLang: HandleChangeLang = useCallback((optionSelected) => {
		if (optionSelected) {
			setmodalMenuLang(optionSelected);
			setModalLang(optionSelected?.value || "js");
		}
	}, []);

	const selectedLanguage: string = useMemo(() => {
		const syntaxLang: { [key: string]: string } = {
			js: "javascript",
			py: "python",
		};

		return syntaxLang[modalLang] || "javascript";
	}, [modalLang]);

	const handleCopyBtnClick = throttle(async () => {
		let content = langContent;
		if (content) {
			const copied = await copyTextToClipboard(content.toString());

			toast({
				title: copied ? "Copied to Clipboard!" : "Error copying content. Try again!",
				status: copied ? "success" : "error",
				icon: <CopyIcon fontSize="xl" />,
				duration: 750,
				isClosable: true,
			});
		}
	}, 750);

	return (
		<Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size={isLg ? (isTab ? "xl" : "4xl") : "xs"}>
			<ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2.8px" />
			<ModalContent>
				<ModalHeader fontSize={isLg ? (isTab ? "lg" : "xl") : "md"}>{name}</ModalHeader>

				<Divider />

				<ModalCloseButton />

				<ModalBody>
					<Text mb={5}>Description - {description}</Text>
					<FormControl mt={5}>
						<Select
							value={modalMenuLang}
							options={langOptions}
							onChange={hangleModalChangeLang}
							filterOption={createFilter({
								stringify: (option) => {
									return `${option.data.searchString || option.value}`;
								},
							})}
						/>
					</FormControl>
					<Box my={5} as="div" position="relative">
						<Button
							aria-label="Click to copy"
							position="absolute"
							top="1"
							right="1"
							size={isLg ? (isTab ? "sm" : "sm") : "xs"}
							variant={"solid"}
							colorScheme={"twitter"}
							onClick={handleCopyBtnClick}
							fontSize={isLg ? (isTab ? "xs" : "xs") : "2xs"}
						>
							COPY
						</Button>
						{/* <IconButton
					aria-label="Click to copy"
					icon={<CopyIcon />}
					position="absolute"
					top="0"
					right="0"
					colorScheme={"twitter"}
					onClick={handleCopyBtnClick}
				/> */}
						<SyntaxHighlighter wrapLines wrapLongLines language={selectedLanguage} style={docco}>
							{langContent}
						</SyntaxHighlighter>
					</Box>
					<Box my={5}>
						<Text>Preview - {preview}</Text>
					</Box>
					<Flex align="center" justify="flex-start" mt={4}>
						{tags.map((tag, tagIndex) => {
							return (
								<Tag
									marginInlineStart={0}
									marginInlineEnd={2}
									cursor="default"
									key={tagIndex}
									size="md"
									variant="subtle"
									colorScheme="twitter"
								>
									<TagLabel>{tagsObject[tag] || null}</TagLabel>
								</Tag>
							);
						})}
					</Flex>
				</ModalBody>

				<ModalFooter></ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default InfoModal;
