import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, deletePost } from "src/state/authSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Box, Divider, IconButton, Typography, useTheme, Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, MoreHoriz, } from "@mui/icons-material";

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
  picture,
  userPicture,
  likes,
  comments,
  createdAt
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [sortedComments, setSortedComments] = useState(comments);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
  const isPostLiked = Boolean(likes[loggedInUserId]);
  const postLikeCount = Object.keys(likes).length;
  const postCreationDate = formatTimePassed(createdAt);

  const mode = useSelector((state) => state.mode);
  const main = palette.neutral.main;
  const primary = palette.primary.main;


  const handlePostLike = async () => {
    const updatedPost = (await api(token).patch(`posts/like/${postId}`)).data;
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDeletePost = async () => {
    await api(token).delete(`posts/delete/${postId}`);
    dispatch(deletePost({ postId: postId }));
    setAnchorEl(null);
  };

  useEffect(() => {
    const sortComments = () => {
      if (isCommentSectionOpen && comments) {
        const sortedCommentsCopy = [...comments];
        sortedCommentsCopy.sort((a, b) => {
          const likesCountA = Object.keys(a.likes).length;
          const likesCountB = Object.keys(b.likes).length;
          const likesComparison = likesCountB - likesCountA;
          if (likesComparison !== 0) {
            return likesComparison;
          }
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          return dateB - dateA;
        });
        setSortedComments(sortedCommentsCopy);
      }
    };
    sortComments();
  }, [comments, isCommentSectionOpen]);

  return (
    <WidgetWrapper>

      <Friend
        friendId={postUserId}
        name={name}
        subtitle={postCreationDate}
        userPicturePath={userPicture?.url}
      />

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {picture && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picture.url}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">

          {/* Like button */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handlePostLike} >
              {isPostLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{postLikeCount}</Typography>
          </FlexBetween>

          {/* Comment button */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* Options button */}
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <MoreHoriz />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {/* Share button */}
          <MenuItem
            onClick={() => setAnchorEl(null)}
            sx={{ justifyContent: 'center', padding: "0.2rem 1rem" }}
          >
            <CopyToClipboard text={`${window.location.href}`} onCopy={() => toast("Coppied to clipboard")}>
              <Typography
                color={main}
                variant="h5"
                fontWeight="500"
              >
                Share
              </Typography>
            </CopyToClipboard>
          </MenuItem>

          {loggedInUserId == postUserId && [
            <Divider key="divider" />,

            // Delete button
            <MenuItem
              key="delete"
              onClick={() => setIsDeletePostDialogOpen(!isDeletePostDialogOpen)}
              sx={{ justifyContent: 'center', padding: "0.2rem 1rem" }}
            >
              <Typography
                color="error"
                variant="h5"
                fontWeight="500"
              >
                Delete
              </Typography>
              
              <Dialog
                open={isDeletePostDialogOpen}
                onClose={() => setIsDeletePostDialogOpen(false)}
              >
                <DialogTitle>
                  <Typography fontWeight="500">
                    Are you sure you want to delete this post?
                  </Typography>
                </DialogTitle>

                <DialogActions>
                  <Button onClick={() => setIsDeletePostDialogOpen(false)} sx={{ color: 'grey' }}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeletePost} color="error" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </MenuItem>
          ]}
        </Menu>

      </FlexBetween>

      {/* Comment section */}
      {isCommentSectionOpen && (
        <Box mt="0.5rem">
          <Divider />
          <NewComment postId={postId} />
          <Divider />
          {sortedComments.map((comment) => (
            <Comment
              key={comment._id}
              postUserId={postUserId}
              commentId={comment._id}
              commentBody={comment.body}
              likes={comment.likes}
              userId={comment.user._id}
              userName={`${comment.user.name}`}
              userPicturePath={comment.user.picture?.url}
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
