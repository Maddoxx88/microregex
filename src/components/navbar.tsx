import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
	chakra,
	Box,
	Collapse,
	Flex,
	Icon,
	IconButton,
	Image,
	Link as ChakraLink,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Stack,
	Text,
	Kbd,
	useColorModeValue as lightDarkVal,
	useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Navbar() {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Box>
			<Flex
				bg={lightDarkVal("white", "blue.800")}
				color={lightDarkVal("blue.600", "white")}
				minH={"60px"}
				py={{ base: 2 }}
				px={{ base: 4 }}
				borderBottom={1}
				borderStyle={"solid"}
				borderColor={lightDarkVal("gray.200", "gray.900")}
				align={"center"}
			>
				<Flex flex={{ base: 1, md: "auto" }} ml={{ base: -2 }} display={{ base: "flex", md: "none" }}>
					<IconButton
						onClick={onToggle}
						icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
						variant={"ghost"}
						aria-label={"Toggle Navigation"}
					/>
				</Flex>
				<Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
					<Image src="/web-hero-logo.svg" height={25} width={150} alt="microregex logo" />

					<Flex display={{ base: "none", md: "flex" }} ml={1} flexGrow={1}>
						<DesktopNav />
					</Flex>
				</Flex>

				<Stack flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} spacing={6}></Stack>
			</Flex>

			<Collapse in={isOpen} animateOpacity>
				<MobileNav />
			</Collapse>
		</Box>
	);
}

const DesktopNav = () => {
	const linkColor = lightDarkVal("blue.700", "blue.200");
	const linkHoverColor = lightDarkVal("blue.500", "white");
	const popoverContentBgColor = lightDarkVal("white", "blue.800");

	return (
		<Stack direction={"row"} spacing={4} w="full">
			<Text>&nbsp;|&nbsp;</Text>
			{NAV_ITEMS.map((navItem) => {
				const link = navItem.isExternal ? (
					<ChakraLink
						isExternal
						href={navItem.href ?? "#"}
						p={2}
						fontSize={"sm"}
						fontWeight={500}
						color={linkColor}
						_hover={{
							textDecoration: "none",
							color: linkHoverColor,
						}}
					>
						{navItem.label}
					</ChakraLink>
				) : (
					<Link to={navItem.href ?? "#"}>
						<ChakraLink
							as="span"
							p={2}
							fontSize={"sm"}
							fontWeight={500}
							color={linkColor}
							_hover={{
								textDecoration: "none",
								color: linkHoverColor,
							}}
						>
							{navItem.label}
						</ChakraLink>
					</Link>
				);
				return (
					<Box key={navItem.label}>
						<Popover trigger={"hover"} placement={"bottom-start"}>
							<PopoverTrigger>{link}</PopoverTrigger>

							{navItem.children && (
								<PopoverContent
									border={0}
									boxShadow={"xl"}
									bg={popoverContentBgColor}
									p={4}
									rounded={"xl"}
									minW={"sm"}
								>
									<Stack>
										{navItem.children.map((child) => (
											<DesktopSubNav key={child.label} {...child} />
										))}
									</Stack>
								</PopoverContent>
							)}
						</Popover>
					</Box>
				);
			})}
			<Flex flexGrow={1} justify="flex-end" align="center">
				<Text lineHeight={1} fontSize="0.925rem">
					<chakra.span mr={1.5}>Perform a quick search using</chakra.span>
					<chakra.span>
						<Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
					</chakra.span>
				</Text>
			</Flex>
		</Stack>
	);
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
	return (
		<Link to={href ?? "#"}>
			<ChakraLink
				role={"group"}
				display={"block"}
				p={2}
				rounded={"md"}
				_hover={{ bg: lightDarkVal("pink.50", "blue.900") }}
			>
				<Stack direction={"row"} align={"center"}>
					<Box>
						<Text transition={"all .3s ease"} _groupHover={{ color: "pink.400" }} fontWeight={500}>
							{label}
						</Text>
						<Text fontSize={"sm"}>{subLabel}</Text>
					</Box>
					<Flex
						transition={"all .3s ease"}
						transform={"translateX(-10px)"}
						opacity={0}
						_groupHover={{ opacity: "100%", transform: "translateX(0)" }}
						justify={"flex-end"}
						align={"center"}
						flex={1}
					>
						<Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
					</Flex>
				</Stack>
			</ChakraLink>
		</Link>
	);
};

const MobileNav = () => {
	return (
		<Stack bg={lightDarkVal("white", "blue.800")} p={4} display={{ md: "none" }}>
			{NAV_ITEMS.map((navItem) => (
				<MobileNavItem key={navItem.label} {...navItem} />
			))}
		</Stack>
	);
};

const MobileNavItem = ({ label, children, href, isExternal }: NavItem) => {
	const { isOpen, onToggle } = useDisclosure();

	const link = isExternal ? (
		<ChakraLink
			href={href ?? "#"}
			isExternal
			as={"a"}
			py={2}
			display="flex"
			justifyContent={"space-between"}
			alignContent={"center"}
			_hover={{
				textDecoration: "none",
			}}
		>
			<Text fontWeight={600} color={lightDarkVal("blue.600", "blue.200")}>
				{label}
			</Text>
			{children && (
				<Icon
					as={ChevronDownIcon}
					transition={"all .25s ease-in-out"}
					transform={isOpen ? "rotate(180deg)" : ""}
					w={6}
					h={6}
				/>
			)}
		</ChakraLink>
	) : (
		<Link to={href ?? "#"}>
			<Flex
				py={2}
				justify={"space-between"}
				align={"center"}
				_hover={{
					textDecoration: "none",
				}}
			>
				<Text fontWeight={600} color={lightDarkVal("blue.600", "blue.200")}>
					{label}
				</Text>
				{children && (
					<Icon
						as={ChevronDownIcon}
						transition={"all .25s ease-in-out"}
						transform={isOpen ? "rotate(180deg)" : ""}
						w={6}
						h={6}
					/>
				)}
			</Flex>
		</Link>
	);

	return (
		<Stack spacing={4} onClick={children && onToggle}>
			{link}

			<Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
				<Stack
					mt={2}
					pl={4}
					borderLeft={1}
					borderStyle={"solid"}
					borderColor={lightDarkVal("blue.200", "blue.700")}
					align={"start"}
				>
					{children &&
						children.map((child) => {
							if (child.type === "link" && child.href !== undefined) {
								return (
									// TODO: isExternal handling
									<Link key={child.label} to={child.href}>
										<ChakraLink py={2}>{child.label}</ChakraLink>
									</Link>
								);
							}

							return null;
						})}
				</Stack>
			</Collapse>
		</Stack>
	);
};

interface NavItem {
	label: string;
	subLabel?: string;
	children?: Array<NavItem>;
	href?: string;
	type?: "link" | "action";
	isExternal?: boolean;
}

const NAV_ITEMS: Array<NavItem> = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "GitHub",
		href: "https://github.com/Maddoxx88/microregex",
		isExternal: true,
	},
];
