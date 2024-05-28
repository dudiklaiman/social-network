import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "src/state/authSlice";
import { useNavigate } from "react-router-dom";

import { FavoriteBorderOutlined, FavoriteOutlined, } from "@mui/icons-material";
import { useMediaQuery, Box, Typography, useTheme, IconButton, Dialog, DialogActions, DialogTitle, Button } from "@mui/material";

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
    userId,
    userName,
    userPicturePath,
    createdAt
}) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    const isCommentLiked = Boolean(likes[loggedInUserId]);
    const commentLikeCount = Object.keys(likes).length;
    
    const isMobileScreen = useMediaQuery("(max-width: 1000px)");
    const primary = palette.primary.main;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
            
    const commentDate = formatTimePassed(createdAt, isMobileScreen);
    const [isDeleteCommentDialogOpen, setIsDeleteCommentDialogOpen] = useState(false);

    
    const handleLikeComment = async () => {
        const updatedPost = (await api(token).patch(`posts/comments/like/${commentId}`)).data;
        dispatch(setPost({ post: updatedPost }));
    };

    const handleDeleteComment = async () => {
        const updatedPost = (await api(token).delete(`posts/comments/delete/${commentId}`)).data;
        dispatch(setPost({ post: updatedPost }));
        setIsDeleteCommentDialogOpen(false);
    };


    return (
        <WidgetWrapper padding="1.5rem 0rem 0.75rem 0.5rem">
            <FlexBetween sx={{ alignItems: "flex-start" }} >
                <FlexBetween gap="1.5rem" sx={{ alignItems: "flex-start" }}>
                    <UserImage image={userPicturePath} size="40px" sx={{ "&:hover": { cursor: "pointer" } }} onClick={() => navigate(`/profile/${postUserId}`)} />

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
                            >   {userName}
                            </Typography>
                            <Typography
                                color={medium}
                                fontSize="0.8rem"
                            >
                                {commentDate}
                            </Typography>
                            {userId == loggedInUserId && (
                                <Typography
                                    onClick={() => setIsDeleteCommentDialogOpen(!isDeleteCommentDialogOpen)}
                                    color={medium}
                                    fontSize="0.8rem"
                                    fontWeight="500"
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    delete
                                </Typography>
                            )}
                            <Dialog
                                open={isDeleteCommentDialogOpen}
                                onClose={() => setIsDeleteCommentDialogOpen(false)}
                            >
                                <DialogTitle>
                                    <Typography fontWeight="500">
                                        Are you sure you want to delete this comment?
                                    </Typography>
                                </DialogTitle>

                                <DialogActions>
                                    <Button onClick={() => setIsDeleteCommentDialogOpen(false)} sx={{ color: 'grey' }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleDeleteComment} color="error" autoFocus>
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
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
                        {isCommentLiked ? (
                            <FavoriteOutlined sx={{ color: primary }} />
                        ) : (
                            <FavoriteBorderOutlined />
                        )}
                    </IconButton>
                    <Typography>{commentLikeCount}</Typography>
                </FlexBetween>

            </FlexBetween>
        </WidgetWrapper>
    );
};

export default Comment;
