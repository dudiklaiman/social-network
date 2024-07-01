import NavBar from 'src/layout/NavBar'
// import NavBar2 from 'src/components/NavBar2'
import UserWidget from 'src/layout/UserWidget';
import NewPostWidget from 'src/layout/NewPostWidget';
import FriendListWidget from 'src/layout/FriendListWidget';
import Feed from 'src/layout/Feed';

import { Box, useMediaQuery } from '@mui/material'


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
					<Feed user={user} isProfile={isProfile} />
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
