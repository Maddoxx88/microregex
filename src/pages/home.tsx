import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, Flex, Grid, GridItem, useMediaQuery, useToken } from "@chakra-ui/react";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { useNhostClient } from "@nhost/react";
import _, { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Card from "../components/card";
import { PATTERNS } from "../graphql/queries";
import { tagsObject } from "../utils/tags";

type Filter = {
	search: string;
	tags: string[];
};

type ContentType = {
	[key: string]: string
};

type Pattern = {
	name: string;
	description: string;
	content: ContentType
	tags: string[];
};

type FilterType = string;
type FilterKeyType = "search" | "tags";

type FilterObject = { [key: FilterType]: string };
type TagsObject = { [key: string]: true };

const filterList = Object.keys(tagsObject);

export default function HomePage() {
	const nhost = useNhostClient();
	
	const [patternList, setPatternList] = useState<Pattern[]>([]);

	const [lgSize] = useToken("sizes", ["container.md"]);
	const [isLg] = useMediaQuery(`(min-width: ${lgSize})`);

	const [searchValue, setSearchValue] = useState<string>("");
	const [tags, setTags] = useState<TagsObject>({});

	const filterRef = useRef<Filter>({
		search: "",
		tags: [],
	});

	const handleSetFilter = React.useMemo(
		() =>
			debounce((key: FilterKeyType, value) => {
				if (!_.isEqual(filterRef.current[key], value)) {
					filterRef.current = { ...filterRef.current, [key]: value };

					console.log(filterRef.current);
				}
			}, 350),
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
		const url = nhost.graphql.getUrl();
		// console.log(`url: ${url}`);
		async function anyNameFunction() {
			const { data, error } = await nhost.graphql.request(PATTERNS);
			console.log(data.patterns);
			setPatternList(data.patterns)
		}
		anyNameFunction();
		// https://wwgsiqjwetcrvgptnyta.graphql.ap-south-1.nhost.run/v1
	}, []);

	return (
		<Flex flexDir="column" align="center" w="100vw" pt="42px" pb={10}>
			<Flex align="center" flexDir="column" w="100%" maxW="container.xl" px={{ base: 10, md: 6 }}>
				<InputGroup colorScheme="gray" w="100%" h={20}>
					<InputLeftElement h="100%" pointerEvents="none" mt={1.2} children={<SearchIcon color="gray.500" fontSize="xl" />} pl={2} />
					<Input
						h="100%"
						placeholder="find your match"
						value={searchValue}
						onChange={handleSearchChange}
						borderRadius="xl"
						_placeholder={{ letterSpacing: -0.25, lineHeight: 1, }}
						lineHeight={1}
						fontSize="xl"
						pl="44px"
					/>
				</InputGroup>

				<Flex mt={3} wrap="wrap" pb="44px" w="100%">
					<Tag
						marginInlineStart={0}
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
				<Grid templateColumns={isLg ? "repeat(3, 1fr)" : "1fr"} gridGap={6} pt={3}>
					{patternList.map((pattern, elKey) => {
						return (
							<GridItem key={elKey}>
								<Card {...pattern} />
							</GridItem>
						);
					})}
				</Grid>
			</Box>
		</Flex>
	);
}

// return (
// 	<GridItem key={elKey}>
// 		<Card />
// 	</GridItem>
// );
