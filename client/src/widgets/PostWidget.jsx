import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "src/state/authSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";

import WidgetWrapper from "src/components/utilComponents/WidgetWrapper";
import FlexBetween from "src/components/utilComponents/FlexBetween";
import Friend from "src/components/Friend";
import NewComment from "src/components/NewComment";
import Comment from "src/components/Comment";
import { formatTimePassed } from "src/utils/utils";
import api from "src/utils/apiRequests";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [isComments, setIsComments] = useState(false);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const postDate = formatTimePassed(createdAt);

  const mode = useSelector((state) => state.mode);
  const main = palette.neutral.main;
  const primary = palette.primary.main;


  const handleLike = async () => {
    const updatedPost = (await api(token).patch(`posts/${postId}/like`)).data;
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper my="2rem">

      <Friend
        friendId={postUserId}
        name={name}
        subtitle={postDate}
        userPicturePath={userPicturePath}
      />

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">

          {/* Like button */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleLike} >
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          {/* Comment button */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* Share button */}
        <IconButton>
          <CopyToClipboard text={`${window.location.href}`} onCopy={() => toast("Coppied to clipboard")} >
            <ShareOutlined />
          </CopyToClipboard>
        </IconButton>
      </FlexBetween>

      {/* Comment section */}
      {isComments && (
        <Box mt="0.5rem">
          <Divider />
          <NewComment postId={postId} />
          <Divider />
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              postUserId={postUserId}
              commentId={comment._id}
              commentBody={comment.body}
              likes={comment.likes}
              userName={`${comment.user.name}`}
              userPicturePath={comment.user.picturePath}
              createdAt={comment.createdAt}
            />
          ))}
        </Box>
      )}

      {/* Notification on share */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme={mode}
      />
      
    </WidgetWrapper>
  );
};

export default PostWidget;
