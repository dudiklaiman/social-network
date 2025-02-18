import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme, useMediaQuery, Button } from "@mui/material";


const NotFoundPage404 = () => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { primary, neutral, background } = palette;

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography
                    fontWeight="bold"
                    fontSize="32px"
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{
                        "&:hover": {
                            color: primary.dark,
                            cursor: "pointer",
                        },
                    }}
                >
                    Social Network
                </Typography>
            </Box>

            <Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="5rem auto"
				borderRadius="1.5rem"
				backgroundColor={background.alt}
                textAlign="center"
                alignItems="center"
			>
				<Typography
                    fontWeight="500"
                    variant="h1"
                    fontSize="10rem"
                >
					404
				</Typography>

				<Typography
                    fontWeight="400"
                    variant="h1"
                    color="primary"
                >
					PAGE NOT FOUND
				</Typography>

                <Button
					// fullWidth
					onClick={() => navigate("/")}
					sx={{
                        width: "20rem",
						p: "1rem",
                        backgroundColor: neutral.dark,
						color: background.alt,
                        mt: "3rem",
						"&:hover": { color: primary.main, backgroundColor: neutral.dark, },
					}}
				>
					Go home
				</Button>
            </Box>

        </Box>
    )
}

export default NotFoundPage404
