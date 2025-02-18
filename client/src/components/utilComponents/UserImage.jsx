import { useNavigate } from "react-router-dom";
import genericUserIcon from "src/assets/icons8-male-user-48.png";
import { Box } from "@mui/material";


const UserImage = ({ image = genericUserIcon, userId, size = "60px" }) => {
	const navigate = useNavigate();
	const isOnUserPage = location.href.endsWith(userId);

	return (
		<Box
			width={size}
			height={size}
			onClick={() => !isOnUserPage ? navigate(`/profile/${userId}`) : null}
			sx={!isOnUserPage ? { cursor: "pointer" } : {}}
		>
			<img
				style={{ objectFit: "cover", borderRadius: "50%" }}
				width={size}
				height={size}
				alt="profile pictue"
				src={image}
			/>
		</Box>
	);
};

export default UserImage;
