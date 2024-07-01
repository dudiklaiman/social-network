import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import api from "src/utils/apiRequests";
import { setPost } from "src/state/authSlice";
import { useError } from "src/context/ErrorContext";

import { Typography, InputBase, useTheme, Button, Box } from "@mui/material";


const NewComment = ({ postId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const { showErrorDialog } = useError();

    const { primary, neutral, background } = palette;
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [commentBody, setCommentBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleNewComment = async () => {
        setIsLoading(true);

        try {
            const updatedPost = (await api(token).post(`posts/comments/${postId}`, { body: commentBody })).data;
    
            setCommentBody("");
            dispatch(setPost({ post: updatedPost }));
        }
        catch (error) {
            console.error(error);
            showErrorDialog(error?.response?.data?.message || "An unexpected error occurred");
        }
        
        setIsLoading(false);
    };

    return (
        <Box p="1rem 0rem 1rem 0.5rem">
            <FlexBetween gap="1.5rem">
                <UserImage image={user.picture.url} userId={user._id} size="40px" />
                <InputBase
                    placeholder="Leave a comment..."
                    onChange={(e) => setCommentBody(e.target.value)}
                    value={commentBody}
                    sx={{
                        fontSize: "12px",
                        width: "100%",
                        height: "40px",
                        backgroundColor: neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
                <Button
                    disabled={!commentBody || isLoading}
                    onClick={handleNewComment}
                    sx={{
                        color: background.alt,
                        backgroundColor: primary.main,
                        borderRadius: "3rem",
                        "&:hover": {
                            backgroundColor: primary.dark,
                        }
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
        </Box>
    );
};

export default NewComment;
