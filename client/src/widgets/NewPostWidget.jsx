import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "src/state/authSlice";
import Dropzone from "react-dropzone";

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

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import UserImage from "src/components/utilComponents/UserImage";
import { compressImage } from "src/utils/utils";
import api from "src/utils/apiRequests";


const NewPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const token = useSelector((state) => state.token);
    const [description, setDescription] = useState("");
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;


    const handlePost = async () => {
        const formData = new FormData();
        formData.append("description", description);
        if (image) {
            const compressedImage = await compressImage(image);
            formData.append("picture", compressedImage);
        }

        const allPosts = (await api(token, { 'Content-Type': 'multipart/form-data' }).post("posts", formData)).data;

        dispatch(setPosts({ posts: allPosts }));
        setDescription("");
        setImage(null);
        setIsImage(false);
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
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
            {isImage && (
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
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween
                    gap="0.25rem"
                    onClick={() => setIsImage(!isImage)}
                    sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                >
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain}>Image</Typography>
                </FlexBetween>

                {/* {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>
                    </>
                ) : (
                )} */}
                <FlexBetween gap="0.25rem">
                    <MoreHorizOutlined sx={{ color: mediumMain }} />
                </FlexBetween>

                <Button
                    disabled={!description}
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
