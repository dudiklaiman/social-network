import { useEffect, useState } from "react";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import Friend from "src/components/Friend";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";


const FriendListWidget = ({ friends }) => {
	const { palette } = useTheme();

	const { primary, neutral, background } = palette;
	const [showAllResults, setShowAllResults] = useState(false);
	const resultsPerPage = 3;

	return (
		<WidgetWrapper>
			<Typography
				color={neutral.dark}
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
						userPicturePath={friend.picture?.url}
					/>
				))}

				{/* View more/less button */}
				{friends.length > resultsPerPage && (
					<Button onClick={() => setShowAllResults(!showAllResults)} sx={{ 'textTransform': 'none' }}>
						<Typography
							color={neutral.dark}
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
