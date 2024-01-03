import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "src/components/FlexBetween";
import UserImage from "src/components/UserImage";
import WidgetWrapper from "src/components/WidgetWrapper";
// import { useState } from "react";


const Comment = ({ comment }) => {
    const { palette } = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    console.log(comment);


    return (
        <WidgetWrapper padding="1.5rem 0rem 0.75rem 0.5rem">
            <FlexBetween gap="1.5rem">
                <UserImage image={comment.user.picturePath} size="40px" />
                {/* <InputBase
                    placeholder="Leave a comment..."
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    sx={{
                        width: "100%",
                        height: "40px",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                /> */}
                {/* <Button
                    disabled={!body}
                    onClick={patchComment}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                        height: "40px",
                        "&:hover": {
                            backgroundColor: palette.primary.dark,
                        }
                        
                    }}
                    >
                    POST
                </Button> */}
            </FlexBetween>
        </WidgetWrapper>
    );
};

export default Comment;
