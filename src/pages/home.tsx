import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import {
	Box,
	Button,
	chakra,
	Flex,
	Grid,
	GridItem,
	InputRightElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	TagCloseButton,
	useMediaQuery,
	useToken
} from "@chakra-ui/react";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { useNhostClient } from "@nhost/react";
import _, { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SiJavascript } from "react-icons/si";
import Card from "../components/card";
import { PATTERNS, PATTERNS_AND_TAGS_Q, PATTERNS_LIKE } from "../graphql/queries";
import { tagsObject } from "../utils/tags";

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
};

type FilterType = string;
type FilterKeyType = "search" | "tags";

type TagsObject = { [key: string]: true };

type LangTypes = { [key: string]: string };
type LangIconTypes = { [key: string]: JSX.Element };

const langTypes: LangTypes = {
	js: "JavaScript",
	// py: "Python 3",
};

const langIcons: LangIconTypes = {
	js: <SiJavascript />,
	// py: <SiPython />,
};

const langList = Object.keys(langTypes);

const filterList = Object.keys(tagsObject);

export default function HomePage() {
	const nhost = useNhostClient();

	const [patternList, setPatternList] = useState<Pattern[]>([]);

	const [lgSize] = useToken("sizes", ["container.md"]);
	const [isLg] = useMediaQuery(`(min-width: ${lgSize})`);
	const [isTab] = useMediaQuery(`(min-width: ${lgSize}) and (max-width: 1154px)`);

	const [searchValue, setSearchValue] = useState<string>("");
	const [tags, setTags] = useState<TagsObject>({});
	const [lang, setLang] = useState("js");

	const [searchLoading, setSearchLoading] = useState(false);
	const subscribed = useRef(true);

	const filterRef = useRef<Filter>({
		search: "",
		tags: [],
	});
	const searchPatterns = useCallback(async (text: string) => {
		console.log(text);
		setSearchLoading(true);
		
		const { data } = await nhost.graphql.request(PATTERNS_LIKE, { name: `%${text}%` });
		
		console.log(data);
		
		if (subscribed.current) {
			setSearchLoading(false);

			setPatternList(data.patterns);
		}
	}, [nhost.graphql]);

	const searchPatternsAndTags = useCallback(async (text: string, tags: string[]) => {
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
		
		console.log(data);
		
		if (subscribed.current) {
			setSearchLoading(false);

			setPatternList(data.patterns);
		}

	}, [nhost.graphql]);

	const hangleChangeLang = (key: string) => () => {
		setLang(key);
	};

	const handleSetFilter = React.useMemo(
		() =>
			debounce((key: FilterKeyType, value) => {
				if (!_.isEqual(filterRef.current[key], value)) {
					filterRef.current = { ...filterRef.current, [key]: value };

					console.log(filterRef.current);
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

	const handleTypeChange = (key: string) => () => {
		if (searchLoading) return;
		
		setTags((s) => {
			const result = { ...s };
			if (key in result) delete result[key];
			else result[key] = true;

			handleSetFilter("tags", Object.keys(result));

			return result;
		});
	};

	const handleTagsReset = () => {
		setTags({});

		handleSetFilter("tags", []);
	};

	const isAnyTagSelected = React.useMemo(() => {
		if (tags && Object.keys(tags).length > 0) {
			return true;
		}

		return false;
	}, [tags]);

	useEffect(() => {
		subscribed.current = true;

		return () => {
			subscribed.current = false;
		}
	}, []);

	useEffect(() => {
		async function anyNameFunction() {
			const { data } = await nhost.graphql.request(PATTERNS);
			console.log(data.patterns);
			setPatternList(data.patterns);
		}

		anyNameFunction();
	}, [nhost.graphql]);

	return (
		<Flex flexDir="column" align="center" w="100vw" pt="42px" pb={10}>
			<Flex align="center" flexDir="column" w="100%" maxW="container.xl" px={{ base: 10, md: 6 }}>
				<InputGroup colorScheme="gray" w="100%" h={20}>
					<InputLeftElement
						h="100%"
						pointerEvents="none"
						mt={1.2}
						children={<SearchIcon color="gray.500" fontSize="xl" />}
						pl={4}
					/>
					<Input
						h="100%"
						placeholder="find your match"
						value={searchValue}
						onChange={handleSearchChange}
						borderRadius="xl"
						_placeholder={{ letterSpacing: -0.25, lineHeight: 1, color: 'gray.500' }}
						lineHeight={1}
						fontSize="2xl"
						_focus={{ borderWidth: 1, borderColor: 'blue.100'}}
						fontWeight={500}
						pl={"48px"}
						color={'gray.500'}
						pr={isLg ? "160px" : "50px"}
						disabled={searchLoading}
					/>

					<InputRightElement h="100%" pr={2} width={isLg ? "160px" : "50px"}>
						<Menu>
							<MenuButton as={Button} variant="outline" w={"100%"} px={isLg ? 2 : 0}>
								<Flex as="span" align="center" justify="center">
									{langIcons[lang] || null}

									{isLg && <chakra.span pl={2}>{langTypes[lang]}</chakra.span>}
								</Flex>
							</MenuButton>
							<MenuList>
								{langList.map((langKey: string, langIndex) => (
									<MenuItem minH="40px" onClick={hangleChangeLang(langKey)} key={langIndex}>
										{langIcons[langKey]}
										<chakra.span pl={2}>{langTypes[langKey]}</chakra.span>
									</MenuItem>
								))}
							</MenuList>
						</Menu>
					</InputRightElement>
				</InputGroup>

				<Flex mt={3} wrap="wrap" pb="44px" w="100%">
					<Tag
						marginInlineStart={0}
						mb={2}
						marginInlineEnd={2}
						cursor="pointer"
						variant={searchLoading ? "subtle" : isAnyTagSelected ? "outline" : "solid"}
						// color={'#EDF2F7'}
						// bgColor={'#2D3748'}
						colorScheme={'blackAlpha'}
						px={5}
						borderRadius={15}
						onClick={handleTagsReset}
					>
						<TagLabel>All</TagLabel>
					</Tag>

					{filterList.map((filterType: FilterType, key) => {
						return (
							<Tag
								marginInlineStart={0}
								mb={2}
								marginInlineEnd={key === filterList.length - 1 ? 0 : 2}
								key={filterType}
								variant={searchLoading ? "subtle" : tags[filterType] ? "solid" : "outline"}
								cursor="pointer"
								colorScheme={'blackAlpha'}
								px={5}
								borderRadius={15}
								onClick={handleTypeChange(filterType)}
							>
								<TagLabel>{tagsObject[filterType]}</TagLabel>
								{ tags[filterType] && <TagCloseButton />}
							</Tag>
						);
					})}
				</Flex>
			</Flex>

			<Box w="100%" maxW="container.xl" px={{ base: 10, md: 6 }}>
				{searchLoading ? <>Loading</> : <Grid templateColumns={isLg ? `repeat(${isTab ? "2" : "3"}, 1fr)` : "1fr"} gridGap={6} pt={3}>
					{patternList.map((pattern, elKey) => {
						return (
							<GridItem key={elKey}>
								<Card {...pattern} selectedLang={lang} isLg={isLg} isTab={isTab} />
							</GridItem>
						);
					})}
				</Grid>}
			</Box>
		</Flex>
	);
}
