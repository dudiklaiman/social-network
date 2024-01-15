import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "src/state/authSlice";

import { InputBase, useTheme, Button, Box } from "@mui/material";

import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import api from "src/utils/apiRequests";


const NewComment = ({ postId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [commentBody, setCommentBody] = useState("");
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);


    const handleNewComment = async () => {
        const updatedPost = (await api(token).post(`posts/comments/${postId}`, { body: commentBody })).data;

        dispatch(setPost({ post: updatedPost }));
        setCommentBody("");
    };

    return (
        <Box p="1rem 0rem 1rem 0.5rem">
            <FlexBetween gap="1.5rem">
                <UserImage image={user.picturePath} size="40px" />
                <InputBase
                    placeholder="Leave a comment..."
                    onChange={(e) => setCommentBody(e.target.value)}
                    value={commentBody}
                    sx={{
                        fontSize: "12px",
                        width: "100%",
                        height: "40px",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
                <Button
                    disabled={!commentBody}
                    onClick={handleNewComment}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                        "&:hover": {
                            backgroundColor: palette.primary.dark,
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
