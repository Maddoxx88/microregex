import {
	Box,
	Button,
	Center,
	chakra,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Grid,
	GridItem,
	Spinner,
	Text,
	useColorModeValue as lightDarkValue,
	useDisclosure,
	useMediaQuery,
	useToken,
} from "@chakra-ui/react";

import { useNhostClient } from "@nhost/react";
import { createFilter, MultiValue, Select, SingleValue } from "chakra-react-select";
import _, { debounce, throttle } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Card from "../components/card";
import { PATTERNS, PATTERNS_AND_TAGS_Q, PATTERNS_LIKE } from "../graphql/queries";
import { OptionType } from "../types";
import { tagsObject } from "../utils/tags";

import { SiJavascript, SiPython } from "react-icons/si";
import InfoModal from "../components/modal";
import Search from "../components/search";

type Filter = {
	search: string;
	tags: string[];
};

type ContentType = {
	[key: string]: string;
};

type Pattern = {
	name: string;
	description: string;
	content: ContentType;
	tags: string[];
	preview: string;
};

type HandleChangeTypes = (newValue: MultiValue<OptionType>) => void;

type HandleChangeLang = (newValue: SingleValue<OptionType>) => void;

type FilterKeyType = "search" | "tags";

type LangTypes = { [key: string]: string };
type LangIconTypes = { [key: string]: JSX.Element };

const langTypes: LangTypes = {
	js: "JavaScript",
	py: "Python 3",
};

const langIcons: LangIconTypes = {
	js: <SiJavascript />,
	py: <SiPython />,
};

const langList = Object.keys(langTypes);

const langOptions = langList.map((lang) => ({
	value: lang,
	label: (
		<Flex align="center">
			{langIcons[lang]}

			<chakra.span pl={2}>{langTypes[lang]}</chakra.span>
		</Flex>
	),
	searchString: langTypes[lang],
}));

const filterList = Object.keys(tagsObject);

const tagsOptions = filterList.map((tag) => ({
	value: tag,
	label: <>{tagsObject[tag]}</>,
}));

export default function HomePage() {
	const nhost = useNhostClient();

	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isOpen: isModalOpen, onClose: onModalClose, onOpen: onModalOpen } = useDisclosure();
	const [lgSize] = useToken("sizes", ["container.md"]);
	const [isLg] = useMediaQuery(`(min-width: ${lgSize})`);
	const [isTab] = useMediaQuery(`(min-width: ${lgSize}) and (max-width: 1154px)`);

	const [lang, setLang] = useState("js");
	const [menuTags, setMenuTags] = useState<OptionType[]>([]);
	const [menuLang, setMenuLang] = useState<OptionType>(langOptions[0]);
	const [patternList, setPatternList] = useState<Pattern[]>([]);
	const [searchLoading, setSearchLoading] = useState(true);
	const [searchValue, setSearchValue] = useState<string>("");
	const [selectedCard, setselectedCard] = useState<Pattern | null>(null);

	const subscribed = useRef(true);
	const filterBtnRef = useRef(null);
	const filterRef = useRef<Filter>({
		search: "",
		tags: [],
	});

	const handleCardClick = throttle(async (selectedIndex) => {
		if (selectedIndex > -1) {
			setselectedCard(patternList[selectedIndex]);
			onModalOpen();
		}
	}, 750);

	const searchPatterns = useCallback(
		async (text: string) => {
			setSearchLoading(true);

			const { data } = await nhost.graphql.request(PATTERNS_LIKE, { name: `%${text}%` });

			if (subscribed.current) {
				setSearchLoading(false);

				setPatternList(data.patterns);
			}
		},
		[nhost.graphql]
	);

	const searchPatternsAndTags = useCallback(
		async (text: string, tags: string[]) => {
			setSearchLoading(true);

			const tagsQuery: { tags: { _contains: string } }[] = [];

			tags.forEach((tag) => {
				tagsQuery.push({ tags: { _contains: tag } });
			});

			const { data } = await nhost.graphql.request(PATTERNS_AND_TAGS_Q, {
				where: {
					_and: [
						{ name: { _ilike: `%${text}%` } },
						{
							_or: tagsQuery,
						},
					],
				},
			});

			if (subscribed.current) {
				setSearchLoading(false);

				setPatternList(data.patterns);
			}
		},
		[nhost.graphql]
	);

	const hangleChangeLang: HandleChangeLang = (optionSelected) => {
		if (optionSelected) {
			setMenuLang(optionSelected);
		}
	};

	const handleSetFilter = React.useMemo(
		() =>
			debounce((key: FilterKeyType, value) => {
				if (!_.isEqual(filterRef.current[key], value)) {
					filterRef.current = { ...filterRef.current, [key]: value };

					if (filterRef.current.tags.length > 0) {
						// query for name and tags
						searchPatternsAndTags(filterRef.current.search, filterRef.current.tags);
					} else {
						// query by name only
						searchPatterns(filterRef.current.search);
					}
				}
			}, 550),
		[searchPatterns, searchPatternsAndTags]
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (searchLoading) return;

		const value = e.target.value;
		setSearchValue(value);

		handleSetFilter("search", value);
	};

	const handleChangeTags: HandleChangeTypes = (optionsSelected) => {
		if (searchLoading) return;
		const optionsVal = [...optionsSelected] as OptionType[];

		setMenuTags(optionsVal);
	};

	const handleApplyFilters = () => {
		const tags = menuTags.map((t) => t.value);

		handleSetFilter("tags", tags);
		setLang(menuLang?.value || "js");

		onClose();
	};

	const handleCancelFilters = () => {
		const selectedTags = filterRef.current.tags.map((t) => ({
			value: t,
			label: <>{tagsObject[t]}</>,
		}));

		setMenuTags(selectedTags);
		setMenuLang({
			value: lang,
			label: (
				<Flex align="center">
					{langIcons[lang]}

					<chakra.span pl={2}>{langTypes[lang]}</chakra.span>
				</Flex>
			),
		});

		onClose();
	};

	const handleClearFilter = () => {
		handleSetFilter("tags", []);
		setMenuTags([]);
		setMenuLang(langOptions[0]);

		onClose();
	};

	useEffect(() => {
		subscribed.current = true;

		return () => {
			subscribed.current = false;
		};
	}, []);

	useEffect(() => {
		async function anyNameFunction() {
			const { data } = await nhost.graphql.request(PATTERNS);

			if (data?.patterns) {
				setPatternList(data.patterns);
				setSearchLoading(false);
			}
		}

		anyNameFunction();
	}, [nhost.graphql]);

	return (
		<Flex flexDir="column" align="center" w="100vw" pt="42px" pb={10} pr={{ base: 0, md: 4 }}>
			{selectedCard != null && (
				<InfoModal
					selectedLang={lang}
					isLg={isLg}
					isTab={isTab}
					isOpen={isModalOpen}
					onClose={onModalClose}
					menuLang={menuLang}
					langOptions={langOptions}
					hangleChangeLang={hangleChangeLang}
					{...selectedCard}
				/>
			)}
			<Flex align="center" flexDir="column" w="100%" maxW="container.xl" px={{ base: 4, md: 6 }}>
				<Search
					searchLoading={searchLoading}
					searchValue={searchValue}
					handleSearchChange={handleSearchChange}
					isLg={isLg}
					onOpen={onOpen}
				/>

				<Drawer
					size={{ base: "xs", md: "md" }}
					isOpen={isOpen}
					placement="right"
					onClose={handleCancelFilters}
					finalFocusRef={filterBtnRef}
				>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerHeader>
							<Flex justify="space-between" align="center">
								<Text fontWeight="400" color={lightDarkValue("gray.600", "gray.400")} as="span">
									Filters
								</Text>

								<Flex>
									{filterRef.current.tags.length > 0 && (
										<Button mr={4} onClick={handleClearFilter} variant="link">
											Clear
										</Button>
									)}
									<Button onClick={handleApplyFilters}>Apply</Button>
								</Flex>
							</Flex>
						</DrawerHeader>

						<DrawerBody>
							<FormControl>
								<FormLabel>Tags</FormLabel>
								<Select
									isDisabled={searchLoading}
									value={menuTags}
									isMulti
									options={tagsOptions}
									onChange={handleChangeTags}
								/>
								<FormHelperText>Select tags to filter your search.</FormHelperText>
							</FormControl>

							<FormControl mt={5}>
								<FormLabel>Language</FormLabel>
								<Select
									isDisabled={searchLoading}
									value={menuLang}
									options={langOptions}
									isSearchable
									onChange={hangleChangeLang}
									filterOption={createFilter({
										stringify: (option) => {
											return `${option.data.searchString || option.value}`;
										},
									})}
								/>
								<FormHelperText>More languages support coming soon.</FormHelperText>
							</FormControl>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			</Flex>

			<Box w="100%" maxW="container.xl" px={{ base: 4, md: 6 }}>
				{searchLoading ? (
					<Flex h="40vh" align="center" justify="center">
						<Spinner height="10vh" width="10vh" thickness="2.5px" emptyColor="gray.100" speed=".5s" />
					</Flex>
				) : patternList.length > 0 ? (
					<Grid templateColumns={isLg ? `repeat(${isTab ? "2" : "3"}, 1fr)` : "1fr"} gridGap={6} pt={3}>
						{patternList.map((pattern, elKey) => {
							return (
								<GridItem key={elKey}>
									<Card
										{...pattern}
										selectedLang={lang}
										isLg={isLg}
										isTab={isTab}
										idx={elKey}
										handleCardClick={handleCardClick}
									/>
								</GridItem>
							);
						})}
					</Grid>
				) : (
					<Center>
						<Text fontSize={isLg ? "xl" : "lg"} fontWeight={500}>
							⚠️ Sorry, we couldn’t find your pattern in our records. Care to contribute?
						</Text>
					</Center>
				)}
			</Box>
		</Flex>
	);
}
