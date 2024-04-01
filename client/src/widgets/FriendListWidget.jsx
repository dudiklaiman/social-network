import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setFriends } from "src/state/authSlice";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import Friend from "src/components/Friend";
// import api from "src/utils/apiRequests";


const FriendListWidget = ({ friends }) => {
  // const dispatch = useDispatch();
  const { palette } = useTheme();

  // const token = useSelector((state) => state.token);
  // const friends = useSelector((state) => state.user.friends);
  const [showAllResults, setShowAllResults] = useState(false);
  const resultsPerPage = 3;


  // useEffect(() => {
  //   const getFriends = async () => {
  //     const friends = (await api(token).get(`users/${userId}/friends`)).data;
  //     dispatch(setFriends({ friends }));
  //   }
  //   getFriends();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps


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

      <Box display="flex" flexDirection="column" gap="1rem">
        {friends.slice(0, showAllResults ? friends.length : resultsPerPage).map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.name}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
        
        {/* View more/less button */}
        {friends.length > resultsPerPage && (
          <Button onClick={() => setShowAllResults(!showAllResults)} sx={{'textTransform': 'none'}}>
            <Typography
              color={palette.neutral.dark}
              variant="h6"
              fontWeight="500"
              mx="0.3rem"
            >
              {showAllResults ? "View Less" : "View More"}
            </Typography>
            {showAllResults ? <ExpandLess /> : <ExpandMore />}
          </Button>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
