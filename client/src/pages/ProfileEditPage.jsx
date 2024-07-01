import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserForm from "src/components/UserForm";
import api from "src/utils/apiRequests";
import { setLogin, setLogout } from "src/state/authSlice";
import { compressImage } from "src/utils/utils";
import { editSchema } from "src/utils/validationShemas";

import { Box, Typography, useTheme, useMediaQuery, Button } from "@mui/material";


const ProfileEditPage = () => {
	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	
	const { primary, neutral, background } = palette;
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const editFields = [
		{
			name: 'email',
			label: 'Email',
			initial: user.email,
		},
		{
			name: 'name',
			label: 'Full Name',
			initial: user.name,
		},
		{
			name: 'location',
			label: 'Location',
			initial: user.location,
		},
		{
			name: 'occupation',
			label: 'Occupation',
			initial: user.occupation,
		},
		{
			name: 'password',
			label: 'Password (Will stay the same if you leave empty)',
			initial: "",
		},
		{
			name: 'picture',
			label: 'Add Picture Here',
			initial: "",
		},
	];

	const handleFormSubmit = async (values, onSubmitProps) => {
		setErrorMessage("");
		setIsLoading(true);
		await handleUserUpdate(values, onSubmitProps);
		setIsLoading(false);
	}

	const handleUserUpdate = async (values, onSubmitProps) => {
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
						setErrorMessage(error?.message || "An unexpected error occurred while uploading image");
						return;
					}
				}
				else formData.append(key, value);
			}
		}

		try {
			const response = (await api(token, { 'Content-Type': 'multipart/form-data' }).put(`users/edit/${user._id}`, formData)).data;
	
			onSubmitProps.resetForm();
			if (values['password']) dispatch(setLogout());
			else dispatch(setLogin({ user: response.user, token: response.token })); 
			navigate('/');
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
					Edit your account
				</Typography>

				<UserForm
					fields={editFields}
					handleFormSubmit={handleFormSubmit}
					validationSchema={editSchema}
					errorMessage={errorMessage}
					submitButtonText={'Update'}
					isSubmitLoading={isLoading}
				/>

				<Button
					fullWidth
					onClick={() => navigate("/")}
					sx={{
						p: "1rem",
						backgroundColor: neutral.main,
						color: background.alt,
						"&:hover": { backgroundColor: neutral.dark },
					}}
				>
					Cancel
				</Button>
			</Box>
		</Box>
	)
}

export default ProfileEditPage
