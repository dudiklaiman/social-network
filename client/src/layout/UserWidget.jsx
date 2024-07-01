import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { formatDateToMonthAndYear } from "src/utils/utils";

import { Box, Typography, Divider, useTheme } from "@mui/material";
import { ManageAccountsOutlined, LocationOnOutlined, WorkOutlineOutlined, CalendarTodayOutlined } from "@mui/icons-material";


const UserWidget = ({ user }) => {
    const navigate = useNavigate();
    const { palette } = useTheme();

    const { primary, neutral, background } = palette;
    const loggedInUserId = useSelector((state) => state.user._id);
    const formattedDate = formatDateToMonthAndYear(new Date(user?.createdAt));
    const isOnUserPage = location.href.endsWith(user._id);

    const navigateToUserPage = () => {
        if (!isOnUserPage) navigate(`/profile/${user._id}`)
    }

    return (
        <WidgetWrapper>

            {/* FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
            >
                <FlexBetween gap="1rem">
                    <UserImage image={user.picture?.url} userId={loggedInUserId} />
                    <Box>
                        <Typography
                            onClick={navigateToUserPage}
                            variant="h4"
                            color={neutral.dark}
                            fontWeight="500"
                            sx={{
                                ...(!isOnUserPage && {
                                    "&:hover": {
                                        color: primary.dark,
                                        cursor: "pointer",
                                    },
                                })
                            }}
                        >
                            {user.name}
                        </Typography>
                        <Typography color={neutral.medium}>{user.friends.length} friends</Typography>
                    </Box>
                </FlexBetween>

                {/* Edit profile button (not functional yet) */}
                {user._id == loggedInUserId && (
                    <Typography
                        onClick={() => navigate("/editprofile")}
                        color={neutral.medium}
                        sx={{ "&:hover": { cursor: "pointer", color: neutral.main } }}
                    >
                        <ManageAccountsOutlined />
                    </Typography>
                )}
            </FlexBetween>

            <Divider />

            {/* SECOND ROW */}
            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <LocationOnOutlined fontSize="large" sx={{ color: neutral.main }} />
                    <Typography color={neutral.medium}>{user.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <WorkOutlineOutlined fontSize="large" sx={{ color: neutral.main }} />
                    <Typography color={neutral.medium}>{user.occupation}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem" mt="0.5rem">
                    <CalendarTodayOutlined fontSize="large" sx={{ color: neutral.main }} />
                    <Typography color={neutral.medium}>Joined: {formattedDate}</Typography>
                </Box>
            </Box>

        </WidgetWrapper>
    );
};

export default UserWidget;
