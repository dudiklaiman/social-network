import { Box } from "@mui/material";
import genericUserIcon from "src/assets/icons8-male-user-48.png";


const UserImage = ({ image = genericUserIcon, size = "60px", onClick }) => {
  return (
    <Box width={size} height={size} onClick={onClick}>
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
