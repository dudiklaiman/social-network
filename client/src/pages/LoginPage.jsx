import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import UserForm from "src/components/UserForm";
import { setLogin } from "src/state/authSlice";
import { registerSchema, loginSchema } from "src/utils/validationShemas";
import { compressImage } from "src/utils/utils";
import api from "src/utils/apiRequests";

import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";


const LoginPage = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    
    const loginFields = [
        {
            name: 'email',
            label: 'Email',
            initial: "",
        },
        {
            name: 'password',
            label: 'Password',
            initial: "",
        },
    ];
    const registerFields = [
        {
            name: 'email',
            label: 'Email',
            initial: "",
        },
        {
            name: 'password',
            label: 'Password',
            initial: "",
        },
        {
            name: 'name',
            label: 'Full Name',
            initial: "",
        },
        {
            name: 'location',
            label: 'Location',
            initial: "",
        },
        {
            name: 'occupation',
            label: 'Occupation',
            initial: "",
        },
        {
            name: 'picture',
            label: 'Add Picture Here',
            initial: "",
        },
    ];

    const { primary, neutral, background } = palette;
    const [pageType, setPageType] = useState("login");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fields = pageType === 'login' ? loginFields : registerFields;
    const validationSchema = pageType === 'login' ? loginSchema : registerSchema;

    const handleFormSubmit = async (values, onSubmitProps) => {
        setErrorMessage("");
        setIsLoading(true);
        if (pageType === 'login') await handleLogin(values, onSubmitProps);
        else if (pageType === 'register') await handleRegister(values, onSubmitProps);
        setIsLoading(false);
    }

    const handleLogin = async (values, onSubmitProps) => {
        const filteredValues = Object.fromEntries(
            loginFields.map(field => [field.name, values[field.name]])
        );

        try {
            const response = (await api().post("auth/login", filteredValues)).data;
            const { user, token } = response;

            if (user && token) {
                dispatch(
                    setLogin({ user, token })
                );
                navigate("/");
            }

            onSubmitProps.resetForm();
        }
        catch (error) {
            console.error(error);
            setErrorMessage(error?.response?.data?.message || "An unexpected error occurred");
        }
    }

    const handleRegister = async (values, onSubmitProps) => {
        const formData = new FormData();
        
        for (const [key, value] of Object.entries(values)) {
            if (value) {
                if (key === 'picture') {
                    try {
                        const compressedImage = await compressImage(value);
                        formData.append('picture', compressedImage);
                    }
                    catch (error) {
                        console.error(error);
                        setErrorMessage(error.message || "An unexpected error occurred while uploading image");
                        return;
                    }
                }
                
                else formData.append(key, value);
            }
        }
        
        try {
            const savedUser = (await api("", { 'Content-Type': 'multipart/form-data' }).post("auth/register", formData)).data;
            onSubmitProps.resetForm();

            if (savedUser) {
                setPageType("login");
            }
        }
        catch (error) {
            console.error(error);
            setErrorMessage(error?.response?.data?.message || "An unexpected error occurred");
        }
    }

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
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={background.alt}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Welcome to my social network!
                </Typography>

                <UserForm
                    fields={fields}
                    handleFormSubmit={handleFormSubmit}
                    validationSchema={validationSchema}
                    errorMessage={errorMessage}
                    submitButtonText={pageType === 'login' ? 'Login' : 'Register'}
                    isSubmitLoading={isLoading}
                />

                <Typography
                    onClick={() => {
                        setPageType(pageType === 'login' ? 'register' : 'login');
                        setErrorMessage("");
                    }}
                    sx={{
                        textDecoration: "underline",
                        color: primary.main,
                        "&:hover": {
                            cursor: "pointer",
                            color: primary.light,
                        },
                    }}
                >
                    {pageType === 'login'
                        ? "Don't have an account? Sign Up here."
                        : "Already have an account? Login here."}
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage
