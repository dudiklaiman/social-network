import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "src/state/authSlice";
import { Box, Typography, useTheme } from "@mui/material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import Friend from "src/components/Friend";
import api from "src/utils/apiRequests";


const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);


  useEffect(() => {
    const getFriends = async () => {
      const friends = (await api(token).get(`users/${userId}/friends`)).data;
      dispatch(setFriends({ friends }));
    }
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.name}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
