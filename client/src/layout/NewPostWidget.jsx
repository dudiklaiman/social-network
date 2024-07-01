import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import ImageDropZone from "src/components/utilComponents/ImageDropZone";
import { setPosts } from "src/state/authSlice";
import { useError } from "src/context/ErrorContext";
import { compressImage } from "src/utils/utils";
import api from "src/utils/apiRequests";

import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { ImageOutlined, MoreHorizOutlined } from "@mui/icons-material";


const NewPostWidget = () => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const { showErrorDialog } = useError();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const { primary, neutral, background } = palette;
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [isImageDropZoneOpen, setIsImageDropZoneOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePost = async () => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("description", description);

            if (image) {
                try {
                    const compressedImage = await compressImage(image);
                    formData.append("picture", compressedImage);
                }
                catch (error) {
                    setIsLoading(false);
                    showErrorDialog(error?.message || "An unexpected error occurred while compressing image");
                    return;
                }
            }

            const allPosts = (await api(token, { 'Content-Type': 'multipart/form-data' }).post("posts", formData)).data;

            setDescription("");
            setImage(null);
            setIsImageDropZoneOpen(false);
            dispatch(setPosts({ posts: allPosts }));
        }
        catch (error) {
            console.error(error);
            showErrorDialog(error?.response?.data?.message || "An unexpected error occurred");
        }

        setIsLoading(false);
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={user.picture.url} userId={user._id} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    sx={{
                        width: "100%",
                        backgroundColor: neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>

            {isImageDropZoneOpen && (
                <ImageDropZone image={image} setImage={setImage} />
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween
                    gap="0.25rem"
                    onClick={() => {
                        setIsImageDropZoneOpen(!isImageDropZoneOpen)
                        setImage(null);
                    }}
                    sx={{ "&:hover": { cursor: "pointer", color: neutral.medium } }}
                >
                    <ImageOutlined sx={{ color: neutral.mediumMain }} />

                    <Typography color={neutral.mediumMain}>
                        Image
                    </Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem">
                    <MoreHorizOutlined sx={{ color: neutral.mediumMain }} />
                </FlexBetween>

                <Button
                    disabled={(!description.trim() && !image) || isLoading}
                    onClick={handlePost}
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

        </WidgetWrapper>
    );
};

export default NewPostWidget;
