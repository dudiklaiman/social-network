import { Box } from "@mui/material";
import userIconPath from "src/assets/icons8-male-user-48.png";


const UserImage = ({ image, size = "60px", onClick }) => {
  if (!image) image = userIconPath;

  return (
    <Box width={size} height={size} onClick={onClick}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={image}
      />
    </Box>
  );
};

export default UserImage;
