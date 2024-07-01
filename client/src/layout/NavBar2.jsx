import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserSearch from "src/components/UserSearch";
import { switchMode, setLogout } from "src/state/authSlice";
// import ChatPage from "src/pages/ChatPage";

import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery, Drawer } from "@mui/material";
import { Message, DarkMode, LightMode, Notifications, Help, Menu, Close, } from "@mui/icons-material";


const NavBar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { palette } = useTheme();

	const user = useSelector((state) => state.user);
	const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const isMobileScreen = useMediaQuery("(max-width: 1000px)");
	const neutralLight = palette.neutral.light;
	const dark = palette.neutral.dark;
	const background = palette.background.default;
	const primaryLight = palette.primary.light;
	const alt = palette.background.alt;


	return (
		<FlexBetween padding="1rem 5rem" backgroundColor={alt}>
			<Typography
				fontWeight="bold"
				fontSize="clamp(1rem, 2rem, 2.25rem)"
				color="primary"
				onClick={() => navigate("/")}
				sx={{
					"&:hover": {
						color: primaryLight,
						cursor: "pointer",
					},
				}}
			>
				Social Network
			</Typography>

			<Box flexBasis="42%">
				<UserSearch />
			</Box>

			<FormControl variant="standard" value={user.name}>
				<Select
					value={user.name}
					sx={{
						backgroundColor: neutralLight,
						width: "150px",
						borderRadius: "0.25rem",
						p: "0.25rem 1rem",
						"& .MuiSvgIcon-root": {
							pr: "0.25rem",
							width: "3rem",
						},
						"& .MuiSelect-select:focus": {
							backgroundColor: neutralLight,
						},
					}}
					input={<InputBase />}
				>
					<MenuItem value={user.name}>
						<Typography
							sx={{
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							{user.name}</Typography>
					</MenuItem>
					<MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
				</Select>
			</FormControl>

		</FlexBetween>
	);
};

export default NavBar;
