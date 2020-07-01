

export const initialState = {
    posts: [
        {
            id: 1,
            title: '',
            description: '',
            date: +new Date(),
            user : {
                id: 1,
                pw: '',
                name: '',
                age: 0
            },
            comments: []
        },
        {
            id: 1,
            title: '',
            description: '',
            date: +new Date(),
            user : {
                id: 1,
                pw: '',
                name: '',
                age: 0
            },
            comments: []
        }
    ]
};

export const ADD_POST_REQUIRE = 'ADD_POST_REQUIRE';

const reducer = (state=initialState, action) => {
    switch(action.type){
        case ADD_POST_REQUIRE : {
            const selectIndex = state.posts.findIndex(v=> v.id === action.data.id);
            const post = state.posts[selectIndex];
            const comments = [...post.comments, 'bgkim'];

            const posts = [...state.posts];
            posts[selectIndex] = {...post, comments};

            return {...state, posts}
        }
        default: {
            return {...state};
        }
    }
}

export default reducer;