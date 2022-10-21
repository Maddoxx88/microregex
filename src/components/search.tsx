import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup, InputLeftElement, Spinner, Input, InputRightElement, IconButton } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { IoIosFunnel } from "react-icons/io";
import { useShortcut } from "../utils/hooks/use-shortcut"

interface SearchPropType {
	searchLoading: boolean;
	searchValue: string;
	handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isLg: boolean;
	onOpen: () => void;
}

export default function Search({ searchLoading, searchValue, handleSearchChange, isLg, onOpen }: SearchPropType) {
	const searchShortcutActive = useShortcut(["K", "Control"]);
	const searchRef = useRef<HTMLInputElement>(null);
	const [searchFocused, setSearchFocus] = useState(false);

	useEffect(() => {
		if (searchShortcutActive) {
			searchRef.current?.focus();
		}
	}, [searchShortcutActive]);

	return (
		<InputGroup colorScheme="gray" w="100%" h={20} mb="44px">
			<InputLeftElement
				h="100%"
				pointerEvents="none"
				mt={1.2}
				children={searchLoading ? <Spinner size="md" /> : <SearchIcon color="gray.500" fontSize="xl" />}
				pl={4}
			/>
			<Input
				ref={searchRef}
				h="100%"
				placeholder={searchFocused ? "type here to search" : "find your match"}
				value={searchValue}
				onChange={handleSearchChange}
				onFocus={() => {
					setSearchFocus(true);
				}}
				onBlur={() => {
					setSearchFocus(false);
				}}
				borderRadius="xl"
				_placeholder={{ letterSpacing: -0.25, lineHeight: 1, color: "gray.500" }}
				lineHeight={1}
				fontSize={isLg ? "xl" : "lg"}
				_focus={{ borderWidth: 1, borderColor: "blue.100" }}
				fontWeight={500}
				pl={"48px"}
				color={"gray.800"}
				pr="68px"
			/>

			<InputRightElement h="100%" width="68px">
				<IconButton mx="auto" size="lg" aria-label="Filter" icon={<IoIosFunnel />} onClick={onOpen} />
			</InputRightElement>
		</InputGroup>
	);
}