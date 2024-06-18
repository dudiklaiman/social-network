import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "src/state/authSlice";
import Dropzone from "react-dropzone";

import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogActions
} from "@mui/material";

import {
    EditOutlined,
    DeleteOutlined,
    ImageOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { compressImage } from "src/utils/utils";
import api from "src/utils/apiRequests";


const NewPostWidget = () => {
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const token = useSelector((state) => state.token);
    const pictureUrl = useSelector((state) => state.user.picture.url);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [isImageDropZoneOpen, setIsImageDropZoneOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;


    const handlePost = async () => {
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("description", description);

            if (image) {
                try {
                    const compressedImage = await compressImage(image);
                    formData.append("picture", compressedImage);
                }
                catch (error) {
                    setIsUploading(false);
                    setErrorMessage(error.message);
                    setIsErrorDialogOpen(true);
                    return;
                }
            }

            const allPosts = (await api(token, { 'Content-Type': 'multipart/form-data' }).post("posts", formData)).data;

            dispatch(setPosts({ posts: allPosts }));
            setDescription("");
            setImage(null);
            setIsImageDropZoneOpen(false);
            setErrorMessage("");
            setIsUploading(false);
        }
        catch (error) {
            setIsUploading(false);
            setErrorMessage("An unexpected error occurred.");
            setIsErrorDialogOpen(true);
        }
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={pictureUrl} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImageDropZoneOpen && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png,.heic"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <Box
                                border={`2px dashed ${palette.primary.main}`}
                                p="1rem"
                            >
                                <FlexBetween>
                                    <Box
                                        {...getRootProps()}
                                        width="90%"
                                        sx={{ "&:hover": { cursor: "pointer" } }}
                                    >
                                        <input {...getInputProps()} />
                                        {!image ? (
                                            <p>Add Image Here</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography
                                                    pr="0.8rem"
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {image.name}
                                                </Typography>
                                                <EditOutlined />
                                            </FlexBetween>
                                        )}
                                    </Box>

                                    {image && (
                                        <IconButton
                                            onClick={() => setImage(null)}
                                            sx={{ padding: 0, paddingLeft: 1 }}
                                        >
                                            <DeleteOutlined />
                                        </IconButton>
                                    )}
                                    
                                </FlexBetween>

                            </Box>
                        )}
                    </Dropzone>
                </Box>
            )}

            {/* Error dialog */}
            <Dialog
                open={isErrorDialogOpen}
                onClose={() => setIsErrorDialogOpen(false)}
            >
                <DialogTitle>
                    <Typography fontWeight="500">
                        {errorMessage}
                    </Typography>
                </DialogTitle>

                <DialogActions>
                    <Button onClick={() => setIsErrorDialogOpen(false)} sx={{ color: 'grey' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween
                    gap="0.25rem"
                    onClick={() => setIsImageDropZoneOpen(!isImageDropZoneOpen)}
                    sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                >
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain}>Image</Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem">
                    <MoreHorizOutlined sx={{ color: mediumMain }} />
                </FlexBetween>

                <Button
                    disabled={(!description.trim() && !image) || isUploading}
                    onClick={handlePost}
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

        </WidgetWrapper>
    );
};

export default NewPostWidget;
