import React, { useRef, useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { SearchIcon } from "@chakra-ui/icons";
import _, { debounce } from "lodash";

type Filter = {
	search: string;
	tags: string[];
};

type FilterType = string;
type FilterKeyType = "search" | "tags";

type FilterObject = { [key: FilterType]: string };
type TagsObject = { [key: string]: true };

const filterTypes: FilterObject = {
	usernames: "Usernames",
	passwords: "Passwords",
};

const filterList = Object.keys(filterTypes);

export default function HomePage() {
	const [searchValue, setSearchValue] = useState<string>("");
	const [tags, setTags] = useState<TagsObject>({});

	const filterRef = useRef<Filter>({
		search: "",
		tags: [],
	});

	const handleSetFilter = React.useCallback(
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

	return (
		<Flex justify="center" w="100vw" pt={10}>
			<Box w="100%" maxW="container.md" px={6}>
				<InputGroup colorScheme="gray">
					<InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.500" />} />
					<Input placeholder="Find your match" value={searchValue} onChange={handleSearchChange} />
				</InputGroup>

				<Flex mt={3} wrap="wrap">
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
								<TagLabel>{filterTypes[filterType]}</TagLabel>
							</Tag>
						);
					})}
				</Flex>
			</Box>
		</Flex>
	);
}
