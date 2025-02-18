import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { setFriends } from "src/state/authSlice";
import { useError } from "src/context/ErrorContext";
import api from "src/utils/apiRequests";

import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";


const Friend = ({ friendId, name, subtitle, userPicturePath, userPicturePathSize = "55px" }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { palette } = useTheme();
	const { showErrorDialog } = useError();

	const { primary, neutral, background } = palette;
	const token = useSelector((state) => state.token);
	const loggedInUserId = useSelector((state) => state.user._id);
	const friends = useSelector((state) => state.user.friends);
	const isFriend = friends.find((friend) => friend._id === friendId);
	const [isLoading, setIsLoading] = useState(false);

	const handleAddRemoveFriend = async () => {
		setIsLoading(true);

		try {
			const updatedFriends = (await api(token).patch(`users/${loggedInUserId}/${friendId}`)).data;
			dispatch(setFriends({ friends: updatedFriends }));
		}
		catch (error) {
			console.error(error);
			showErrorDialog(error?.response?.data?.message || "An unexpected error occurred");
		}

		setIsLoading(false);
	};

	return (
		<FlexBetween>
			<FlexBetween gap="1rem">
				<UserImage image={userPicturePath} userId={friendId} size={userPicturePathSize} />
				<Box>
					<Typography
						onClick={() => { if (!location.href.endsWith(friendId)) navigate(`/profile/${friendId}`) }}
						color={neutral.main}
						variant="h5"
						fontWeight="500"
						sx={{
							...(!location.href.endsWith(friendId) && {
								"&:hover": {
									color: palette.primary.dark,
									cursor: "pointer",
								},
							})
						}}
					>
						{name}
					</Typography>
					<Typography color={neutral.medium} fontSize="0.75rem">
						{subtitle}
					</Typography>
				</Box>
			</FlexBetween>
			{loggedInUserId != friendId && (
				<IconButton
					onClick={() => handleAddRemoveFriend()}
					disabled={isLoading}
					sx={{ backgroundColor: primary.light, p: "0.6rem" }}
				>
					{isFriend ? (
						<PersonRemoveOutlined sx={{ color: primary.dark }} />
					) : (
						<PersonAddOutlined sx={{ color: primary.dark }} />
					)}
				</IconButton>
			)}

		</FlexBetween>
	);
};

export default Friend;
