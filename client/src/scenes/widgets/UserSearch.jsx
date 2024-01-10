import React, { useState } from "react";
import { IconButton, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { apiGetWithToken } from "src/utils/apiRequests";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material";
import FlexBetween from "src/components/FlexBetween";

const UserSearch = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;


  const handleSearchChange = async (text) => {
    setSearchText(text);
    try {
      const data = await apiGetWithToken(`users/search?query=${text}`, token);
      onSearch(data);
      // console.log(data);
    }
    catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default UserSearch;
