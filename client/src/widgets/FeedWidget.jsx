import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "src/state/authSlice";

import PostWidget from "src/widgets/PostWidget";
import api from 'src/utils/apiRequests';


const FeedWidget = ({ user, isProfile }) => {
    const dispatch = useDispatch();

    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);


    useEffect(() => {
        const getFeed = async () => {
            const endpoint = isProfile ? `posts/${user._id}` : "posts";
            const allPosts = (await api(token).get(endpoint)).data;
            dispatch(setPosts({ posts: allPosts }));
        };
        getFeed();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!posts) return null;

    return (
        <>
            {posts.map((post) => (
                <PostWidget
                    key={post._id}
                    postId={post._id}
                    postUserId={post.user._id}
                    name={`${post.user.name}`}
                    description={post.description}
                    location={post.user.location}
                    picturePath={post.picturePath}
                    userPicturePath={post.user.picturePath}
                    likes={post.likes}
                    comments={post.comments}
                    createdAt={post.createdAt}
                />
            ))}
        </>
    );
};

export default FeedWidget;
