import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "src/state/index";
import PostWidget from "./PostWidget";
import axios from "axios";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [usersData, setUsersData] = useState({});


  const getPosts = async () => {
    const url = isProfile ? `http://localhost:3001/posts/${userId}/posts` : 'http://localhost:3001/posts';

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    
    // Extract unique user ids from posts
    const uniqueUserIds = Array.from(new Set(data.map(post => post.userId)));

    // Fetch user details for each unique user id
    const userPromises = uniqueUserIds.map(async (id) => {
      const userResponse = await fetch(`http://localhost:3001/users/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      return { [id]: userData }; // Map user data to their respective IDs
    });

    // Wait for all user detail fetches to complete and combine results
    const users = await Promise.all(userPromises);
    const combinedUsersData = Object.assign({}, ...users);
    setUsersData(combinedUsersData);
    // console.log(usersData);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPosts();
    }
    fetchData();
  // }, [userId, isProfile, token]);
  }, []);

  return (
    <>
      {/* {posts.map((post) => {
        const currUser = usersData[post.userId];

        <PostWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId}
          name={`${currUser.firstName} ${currUser.lastName}`}
          description={post.description}
          location={currUser.location}
          picturePath={post.picturePath}
          likes={post.likes}
          comments={post.comments}
        >
        /</PostWidget>
      })} */}
    </>
  );
};

export default PostsWidget;
