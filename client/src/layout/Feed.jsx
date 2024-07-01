import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PostWidget from "src/layout/PostWidget";
import { setPosts } from "src/state/authSlice";
import api from 'src/utils/apiRequests';

import { Box, Typography } from "@mui/material";


const Feed = ({ user, isProfile }) => {
    const dispatch = useDispatch();

    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        const getFeed = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const endpoint = isProfile ? `posts/${user._id}` : "posts";
                const allPosts = (await api(token).get(endpoint)).data;
                dispatch(setPosts({ posts: allPosts }));
                setIsLoading(false);
                setErrorMessage(allPosts ? "" : "No posts");
            }
            catch (error) {
                setIsLoading(false);
                setErrorMessage(error?.response?.data?.message || "An unexpected error occurred")
            }
        };
        getFeed();
    }, [user._id]);


    return (
        <>
            {
            isLoading || errorMessage ? (
                <Typography
                    mt="5rem"
                    textAlign="center"
                    variant="h2"
                    fontWeight="500"
                >
                    {isLoading ? "Loading..." : errorMessage}
                </Typography>
            ) :
            posts.map((post) => (
                <Box
                    key={post._id}
                    margin={isProfile ? "0 0 2rem 0" : "2rem 0"}
                >
                    <PostWidget
                        postId={post._id}
                        postUserId={post.user._id}
                        name={`${post.user.name}`}
                        description={post.description}
                        location={post.user.location}
                        picture={post.picture}
                        userPicture={post.user.picture}
                        likes={post.likes}
                        comments={post.comments}
                        createdAt={post.createdAt}
                    />
                </Box>
            )) 
            }
        </>
    );
};

export default Feed;
