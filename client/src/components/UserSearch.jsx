import { useState } from "react";
import { useSelector } from "react-redux";

import { Box, useTheme, IconButton, InputBase, Paper } from "@mui/material";
import { Search, ClearOutlined } from "@mui/icons-material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import Friend from "src/components/Friend";
import api from "src/utils/apiRequests";


const UserSearch = ({ isMobile }) => {
  const { palette } = useTheme();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const neutralLight = palette.neutral.light;


  const handleSearchChange = async (text) => {
    setSearchText(text);
    if (text == "") return setSearchResults([]);

    try {
      const data = (await api(token).get(`users/search?query=${text}`)).data;
      setSearchResults(data.filter(user => user._id != loggedInUserId));  // So the results will not include the user whos'e searching
    }
    catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <WidgetWrapper padding={isMobile && "0rem"} >
      <Box
        width={isMobile ? "15rem" : "20rem"}
        position={!isMobile && "absolute"}
        zIndex="1"
        top={!isMobile && "1.5rem"}
        backgroundColor={neutralLight}
        borderRadius="9px"
        gap="3rem"
        padding="0.1rem 0.5rem"
      >
        <InputBase
          sx={{ width: "100%" }}
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          startAdornment={<IconButton><Search /></IconButton>}
          endAdornment={
            searchText && 
              <IconButton
                onClick={() => {
                  setSearchText("");
                  setSearchResults([]);
                }}
              >
                <ClearOutlined />
              </IconButton>
          }
        />

        <Paper sx={{ maxHeight: isMobile ? "14rem" : "8rem", marginBottom: (searchResults.length > 0) && "0.5rem", overflow: "auto", backgroundColor: neutralLight, boxShadow: "none", backgroundImage: "none" }}>
          {searchResults.map((user) => (
            <Box key={user._id} p="0.2rem 0.5rem" >
              <Friend
                friendId={user._id}
                name={`${user.name}`}
                userPicturePath={user.picturePath}
                userPicturePathSize="35px"
              />
            </Box>
          ))}
        </Paper>

      </Box>
    </WidgetWrapper>
  );
};

export default UserSearch;
