import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { setPost } from "src/state/authSlice";
import { useError } from "src/context/ErrorContext";
import { formatTimePassed } from "src/utils/utils";
import api from "src/utils/apiRequests";

import { useMediaQuery, Box, Typography, useTheme, IconButton, Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { FavoriteBorderOutlined, FavoriteOutlined, } from "@mui/icons-material";


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
    const { showErrorDialog } = useError();
    const isMobileScreen = useMediaQuery("(max-width: 1000px)");

    const { primary, neutral, background } = palette;
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    const [isDeleteCommentDialogOpen, setIsDeleteCommentDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isCommentLiked = Boolean(likes[loggedInUserId]);
    const commentLikeCount = Object.keys(likes).length;
    const commentDate = formatTimePassed(createdAt, isMobileScreen);
    const isOnUserPage = location.href.endsWith(userId);

    const handleLikeComment = async () => {
        setIsLoading(true);

        try {
            const updatedPost = (await api(token).patch(`posts/comments/like/${commentId}`)).data;
            dispatch(setPost({ post: updatedPost }));
        }
        catch (error) {
            console.error(error);
            showErrorDialog(error?.response?.data?.message || "An unexpected error occurred");
        }

        setIsLoading(false);
    };

    const handleDeleteComment = async () => {
        setIsLoading(true);

        try {
            const updatedPost = (await api(token).delete(`posts/comments/delete/${commentId}`)).data;
            dispatch(setPost({ post: updatedPost }));
        }
        catch (error) {
            setIsDeleteCommentDialogOpen(false);
            console.error(error);
            showErrorDialog(error?.response?.data?.message || "An unexpected error occurred");
        }

        setIsLoading(false);
    };

    return (
        <WidgetWrapper padding="1.5rem 0rem 0.75rem 0.5rem">
            <FlexBetween sx={{ alignItems: "flex-start" }} >
                <FlexBetween gap="1.5rem" sx={{ alignItems: "flex-start" }}>
                    <UserImage image={userPicturePath} userId={userId} size="40px" />

                    <Box>
                        <FlexBetween gap="0.7rem" sx={{ justifyContent: "left" }}>
                            <Typography
                                onClick={() => !isOnUserPage ? navigate(`/profile/${userId}`) : null}
                                variant="h5"
                                fontSize="0.8rem"
                                fontWeight="500"
                                maxWidth="6.5rem"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    ...(!isOnUserPage && {
                                        "&:hover": {
                                            color: primary.dark,
                                            cursor: "pointer",
                                        },
                                    })
                                }}
                            >   {userName}
                            </Typography>
                            <Typography
                                color={neutral.medium}
                                fontSize="0.8rem"
                            >
                                {commentDate}
                            </Typography>
                            {userId == loggedInUserId && (
                                <Typography
                                    onClick={() => setIsDeleteCommentDialogOpen(true)}
                                    color={neutral.medium}
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
                                    <Button
                                        onClick={handleDeleteComment}
                                        color="error"
                                        autoFocus
                                        disabled={isLoading}
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </FlexBetween>

                        <Typography
                            color={neutral.main}
                            pt="5px"
                        >
                            {commentBody}
                        </Typography>
                        
                    </Box>
                    
                </FlexBetween>

                <FlexBetween gap="0.3rem" >
                    <IconButton onClick={handleLikeComment} disabled={isLoading} >
                        {isCommentLiked ? (
                            <FavoriteOutlined sx={{ color: primary.main }} />
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
