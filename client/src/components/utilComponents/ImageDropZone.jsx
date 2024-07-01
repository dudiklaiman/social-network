import Dropzone from 'react-dropzone';

import FlexBetween from 'src/components/utilComponents/FlexBetween';

import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";


const ImageDropZone = ({ image, setImage }) => {
    const { palette } = useTheme();
    
    const { primary, neutral, background } = palette;

    return (
        <Box
            border={`1px solid ${neutral.medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            gridColumn="span 4"
        >
            <Dropzone
                acceptedFiles=".jpg,.jpeg,.png,.heic"
                multiple={false}
                onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
                {({ getRootProps, getInputProps }) => (
                    <Box
                        border={`2px dashed ${primary.main}`}
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
                                        
                                        <EditOutlined sx={{ color: neutral.main }} />
                                    </FlexBetween>
                                )}
                            </Box>

                            {image && (
                                <IconButton
                                    onClick={() => setImage(null)}
                                    sx={{ padding: 0, paddingLeft: 1, color: neutral.main }}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            )}

                        </FlexBetween>
                    </Box>
                )}
            </Dropzone>
        </Box>
    )
}

export default ImageDropZone
