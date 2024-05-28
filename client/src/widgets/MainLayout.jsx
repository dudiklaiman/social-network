import { Box, useMediaQuery } from '@mui/material'

import NavBar from 'src/components/NavBar'
import UserWidget from 'src/widgets/UserWidget';
import NewPostWidget from 'src/widgets/NewPostWidget';
import FriendListWidget from 'src/widgets/FriendListWidget';
import FeedWidget from 'src/widgets/FeedWidget';


const MainLayout = ({ user, isProfile }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>

      <NavBar />

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >

        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget user={user} />
          <Box m="2rem 0" />
          {!isNonMobileScreens && isProfile && <FriendListWidget friends={user.friends} />}
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={!isNonMobileScreens && "2rem"}
        >
          {!isProfile && <NewPostWidget picturePath={user.picture?.url} />}
          <FeedWidget user={user} isProfile={isProfile} />
        </Box>

        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget friends={user.friends} />
          </Box>
        )}
        
      </Box>
    </Box>
  );
}

export default MainLayout;
