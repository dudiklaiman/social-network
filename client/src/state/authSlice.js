import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    tokenExpiration: null,
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload.mode;
        },
        switchMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            
            const days = 14;
            const futureDate = new Date(new Date().getTime() + (days * 24 * 60 * 60 * 1000)); // Add 14 days (in milliseconds)
            const futureISOString = futureDate.toISOString();
            state.tokenExpiration = futureISOString;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.posts = null;
            state.tokenExpiration = null;
        },
        setFriends: (state, action) => {
            if (!state.user) return console.error("user friends non-existent");
            state.user.friends = action.payload.friends;
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id == action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter((post) => post._id !== action.payload.postId);

        },
    },
});

export const { setMode, switchMode, setLogin, setLogout, setFriends, setPosts, setPost, deletePost } = authSlice.actions;
export default authSlice.reducer;
