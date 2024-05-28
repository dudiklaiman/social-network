import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "src/state/authSlice";
import { useNavigate } from "react-router-dom";

import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import api from "src/utils/apiRequests";


const Friend = ({ friendId, name, subtitle, userPicturePath, userPicturePathSize = "55px" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const friends = useSelector((state) => state.user.friends);
  const isFriend = friends.find((friend) => friend.loggedInUserId === friendId);

  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;


  const handleAddRemoveFriend = async () => {
    const updatedFriends = (await api(token).patch(`users/${loggedInUserId}/${friendId}`)).data;
    dispatch(setFriends({ friends: updatedFriends }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size={userPicturePathSize} />
        <Box
          onClick={() => navigate(`/profile/${friendId}`)}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.dark,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {loggedInUserId != friendId && (
        <IconButton
          onClick={() => handleAddRemoveFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}

    </FlexBetween>
  );
};

export default Friend;
