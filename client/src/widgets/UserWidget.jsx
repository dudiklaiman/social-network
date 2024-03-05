import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Divider, useTheme } from "@mui/material";
import { ManageAccountsOutlined, LocationOnOutlined, WorkOutlineOutlined, CalendarTodayOutlined } from "@mui/icons-material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { formatDateToMonthAndYear } from "src/utils/utils";


const UserWidget = ({ user }) => {
    const navigate = useNavigate();
    const { palette } = useTheme();

    const loggedInUserId = useSelector((state) => state.user._id);
    const formattedDate = formatDateToMonthAndYear(new Date(user?.createdAt));

    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    return (
        <WidgetWrapper>

            {/* FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
            >
                <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${user._id}`)}>
                    <UserImage image={user.picturePath} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                            sx={{
                                "&:hover": {
                                    color: palette.primary.dark,
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {user.name}
                        </Typography>
                        <Typography color={medium}>{user.friends.length} friends</Typography>
                    </Box>
                </FlexBetween>

                {/* Edit profile button (not functional yet) */}
                {user._id == loggedInUserId && (
                    <Typography
                        onClick={() => { console.log("page in development"); }}
                        color={medium}
                        sx={{ "&:hover": { cursor: "pointer", color: main } }}
                    >
                        <ManageAccountsOutlined />
                    </Typography>
                )}
            </FlexBetween>

            <Divider />

            {/* SECOND ROW */}
            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                    <Typography color={medium}>{user.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                    <Typography color={medium}>{user.occupation}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem" mt="0.5rem">
                    <CalendarTodayOutlined fontSize="large" sx={{ color: main }} />
                    <Typography color={medium}>Joined: {formattedDate}</Typography>
                </Box>
            </Box>

        </WidgetWrapper>
    );
};

export default UserWidget;
