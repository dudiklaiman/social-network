import { useDispatch, useSelector } from "react-redux";
import { setPost } from "src/state/authSlice";
import { useNavigate } from "react-router-dom";

import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { Box, Typography, useTheme, IconButton } from "@mui/material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { formatTimePassed } from "src/utils/utils";
import api from "src/utils/apiRequests";


const Comment = ({
    postUserId,
    commentId,
    commentBody,
    likes,
    userName,
    userPicturePath,
    createdAt
}) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    const commentDate = formatTimePassed(createdAt);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    
    const primary = palette.primary.main;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;


    const handleLikeComment = async () => {
        const updatedPost = (await api(token).patch(`posts/comments/${commentId}/like`)).data;
        dispatch(setPost({ post: updatedPost }));
    };


    return (
        <WidgetWrapper padding="1.5rem 0rem 0.75rem 0.5rem">
            <FlexBetween sx={{ alignItems: "flex-start"}} >
                <FlexBetween gap="1.5rem" sx={{ alignItems: "flex-start" }}>
                    <UserImage image={userPicturePath} size="40px" sx={{ "&:hover": {cursor: "pointer"} }} onClick={() => navigate(`/profile/${postUserId}`)} />

                    <Box>
                        <FlexBetween gap="0.7rem" sx={{ justifyContent: "left" }}>
                            <Typography
                                onClick={() => navigate(`/profile/${postUserId}`)}
                                variant="h5"
                                fontSize="0.8rem"
                                fontWeight="500"
                                sx={{
                                    "&:hover": {
                                        color: palette.primary.dark,
                                        cursor: "pointer",
                                    },
                                }}
                            >{userName}</Typography>
                            <Typography
                                color={medium}
                                variant="h5"
                                fontSize="0.8rem"
                                fontWeight="100"
                            >
                                {commentDate}
                            </Typography>
                        </FlexBetween>

                        <Typography
                            color={main}
                            pt="5px"
                        >
                            {commentBody}
                        </Typography>
                    </Box>
                </FlexBetween>

                <FlexBetween gap="0.3rem" >
                    <IconButton onClick={handleLikeComment} >
                        {isLiked ? (
                            <FavoriteOutlined sx={{ color: primary }} />
                        ) : (
                            <FavoriteBorderOutlined />
                        )}
                    </IconButton>
                    <Typography>{likeCount}</Typography>
                </FlexBetween>

            </FlexBetween>
        </WidgetWrapper>
    );
};

export default Comment;
