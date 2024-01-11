import React, { useState } from "react";
import { IconButton, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { apiGetWithToken } from "src/utils/apiRequests";
import { useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import FlexBetween from "src/components/FlexBetween";
import Friend from "src/components/Friend";
import WidgetWrapper from "src/components/WidgetWrapper";

const UserSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;


  const handleSearchChange = async (text) => {
    if (text == "") {
      setSearchText("");
      return setSearchResults([]);
    }
    setSearchText(text);
    try {
      const data = await apiGetWithToken(`users/search?query=${text}`, token);
      setSearchResults(data);
      console.log(data);
    }
    catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween
        backgroundColor={neutralLight}
        borderRadius="9px"
        gap="3rem"
        padding="0.1rem 0.5rem"
      >
        <InputBase
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          startAdornment={<IconButton><Search /></IconButton>}
        />
      </FlexBetween>

      {/* <Box display="flex" flexDirection="column" gap="1.5rem">
        {searchResults.map((user) => (
          <Friend
            key={user._id}
            friendId={user._id}
            name={`${user.name}`}
            userPicturePath={user.picturePath}
          />
        ))}
      </Box> */}

    </WidgetWrapper>
  );
};

export default UserSearch;
