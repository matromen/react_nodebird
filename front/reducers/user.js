export const initialState = {
    isSignedup: false, //회원가입  여부
    isSingingup: false, //회원가입 시도중
    signupErrorReason: '', //회원가입 실패 사유    
    isLoggedin : false, //로그인 여부
    isLoggingin: false, //로그인 시도중
    isLoggingout: false, //로그아웃 시도중
    loginErrorReason: '', //로그인 에러 사유
    me: null,           // 내정보
    followingList: [], //팔로윙 리스트
    followerList: [], //팔로우 리스트
    userInfo: null, //남의정보
    isEditingNickName : false, //이름변경 중
    isEditNickNameErrorReason: '', //이름변경 실패 사유
    hasMoreFollowing: false,
    hasMoreFollower: false
};


export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST';
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS= 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOAD_FOLLOW_REQUST = 'LOAD_FOLLOW_REQUST';
export const LOAD_FOLLOW_SUCCESS = 'LOAD_FOLLOW_SUCCESS';
export const LOAD_FOLLOW_FAILURE = 'LOAD_FOLLOW_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';   //REDUX 단점으로 생긴 ACTION
export const REMOVE_POST_TO_ME  = 'REMOVE_POST_TO_ME'


const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOG_IN_REQUEST : {
            return {...state, isLoggingin: true, loginErrorReason: ''};
        }
        case LOG_IN_SUCCESS: {
            return {...state, isLoggingin: false,  isLoggedin: true, me: action.data};
        }
        case LOG_IN_FAILURE: {
            return {...state, isLoggingin: false,  isLoggedin: false, loginErrorReason: action.error,  me: null};
        }
        case LOG_OUT_REQUEST : {
            return {...state, isLoggingout: true};
        }     
        case LOG_OUT_SUCCESS: {
            return {...state, isLoggingout: false,  me: null, followingList: null, follwerList: null};
        }
        case LOG_OUT_FAILURE: {
            return {...state, isLoggingout: false,  me: null};
        }             
        case SIGN_UP_REQUEST : {
            return {...state, isSingingup: true, signupErrorReason: ''};
        } 
        case SIGN_UP_SUCCESS : {
            return {...state, isSingingup: false, isSignedup: true};
        } 
        case SIGN_UP_FAILURE : {
            console.log(action.error);
            return {...state, isSingingup: false, isSignedup: false, loginErrorReason: action.error};
        }         
        
        case EDIT_NICKNAME_REQUEST : {
            return {...state, isEditingNickName: true, isEditNickNameErrorReason: ''};
        } 
        case EDIT_NICKNAME_SUCCESS : {
            return {...state, isEditingNickName: false, me: {...state.me, nickName: action.data}}
        } 
        case EDIT_NICKNAME_FAILURE : {
            return {...state, isEditingNickName: false, isEditNickNameErrorReason: action.error};
        }     

        case LOAD_USER_REQUEST : {
            return {...state};
        } 
        case LOAD_USER_SUCCESS : {
            if(action.me){
                return {...state, isLoggedin: true, me: action.data};
            }
            return {...state, isLoggedin: true, userInfo: action.data};
        } 
        case LOAD_USER_FAILURE : {
            return {...state, me: null,  signupErrorReason: action.error};
        }        
        
        case FOLLOW_USER_REQUEST : {
            return {...state};
        } 
        case FOLLOW_USER_SUCCESS : {
            return {...state, me: {...state.me, Followings: [...state.me.Followings, {id: action.data}]}}
        } 
        case FOLLOW_USER_FAILURE : {
            return {...state};
        }   
        
        case UNFOLLOW_USER_REQUEST : {
            return {...state};
        } 
        case UNFOLLOW_USER_SUCCESS : {
            return {...state, followingList: state.me.Followings.filter(v=>v.id !== action.data),
                  me: {...state.me, Followings: state.me.Followings.filter(v => v.id !== action.data)}}
        } 
        case UNFOLLOW_USER_FAILURE : {
            return {...state};
        }     
        case ADD_POST_TO_ME: {
            return {...state, me: {...state.me, posts: [{id: action.data}, ...state.me.posts]}}
        }     

        case REMOVE_POST_TO_ME: {
            return {...state, me: {...state.me, posts: state.me.posts.filter(p=>p.id!==action.data)}}
        }

        case LOAD_FOLLOWINGS_REQUEST : {
            return {...state, 
                    followingList: action.offset ? state.followingList : [],
                    hasMoreFollowing: action.offset ? state.hasMoreFollowing : true
                };
        } 
        case LOAD_FOLLOWINGS_SUCCESS : {
            return {...state, followingList: state.followingList.concat(action.data), 
                    hasMoreFollowing: action.data.length === 3
                }
        } 
        case LOAD_FOLLOWINGS_FAILURE : {
            return {...state};
        }            

        case LOAD_FOLLOWERS_REQUEST : {
            return {
                ...state,
                followerList: action.offset ? state.followerList : [],
                hasMoreFollower: action.offset ? state.hasMoreFollower :  true
            };
        } 
        case LOAD_FOLLOWERS_SUCCESS : {
            return {...state, followerList: state.followerList.concat(action.data),
                    hasMoreFollower: action.data.length === 3
                }
        } 
        case LOAD_FOLLOWERS_FAILURE : {
            return {...state};
        }     
        
        case REMOVE_FOLLOWER_REQUEST : {
            return {...state};
        } 
        case REMOVE_FOLLOWER_SUCCESS : {
            return {...state, followerList: [...state.followerList.filter(c=>c.id !== action.data)], 
                     me: {...state.me, Followers: state.followerList.filter(c=>c.id !== action.data)}}
        } 
        case REMOVE_FOLLOWER_FAILURE : {
            return {...state};
        }          


        default : {
            return {...state};
        }
    }
}

export default reducer;