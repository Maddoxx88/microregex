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
	useMediaQuery,
	useToken
} from "@chakra-ui/react";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { useNhostClient } from "@nhost/react";
import _, { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { SiJavascript, SiPython } from "react-icons/si";
import Card from "../components/card";
import { PATTERNS, PATTERNS_LIKE } from "../graphql/queries";
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
	py: "Python 3",
};

const langIcons: LangIconTypes = {
	js: <SiJavascript />,
	py: <SiPython />,
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

	const filterRef = useRef<Filter>({
		search: "",
		tags: [],
	});

	const searchPatterns = async (text: string) => {
		console.log(text);
		const { data } = await nhost.graphql.request(PATTERNS_LIKE, { name: `%${text}%` });
		console.log(data);
		setPatternList(data.patterns);
	};

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
					} else {
						// query by name only
						searchPatterns(filterRef.current.search);
					}
				}
			}, 550),
		[]
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);

		handleSetFilter("search", value);
	};

	const handleTypeChange = (key: string) => () => {
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
						pl={2}
					/>
					<Input
						h="100%"
						placeholder="find your match"
						value={searchValue}
						onChange={handleSearchChange}
						borderRadius="xl"
						_placeholder={{ letterSpacing: -0.25, lineHeight: 1 }}
						lineHeight={1}
						fontSize="xl"
						pl="44px"
						pr={isLg ? "160px" : "50px"}
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
						variant={isAnyTagSelected ? "outline" : "solid"}
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
								variant={tags[filterType] ? "solid" : "outline"}
								cursor="pointer"
								onClick={handleTypeChange(filterType)}
							>
								<TagLabel>{tagsObject[filterType]}</TagLabel>
							</Tag>
						);
					})}
				</Flex>
			</Flex>

			<Box w="100%" maxW="container.xl" px={{ base: 10, md: 6 }}>
				<Grid templateColumns={isLg ? `repeat(${isTab ? "2" : "3"}, 1fr)` : "1fr"} gridGap={6} pt={3}>
					{patternList.map((pattern, elKey) => {
						return (
							<GridItem key={elKey}>
								<Card {...pattern} selectedLang={lang} isLg={isLg} isTab={isTab} />
							</GridItem>
						);
					})}
				</Grid>
			</Box>
		</Flex>
	);
}
