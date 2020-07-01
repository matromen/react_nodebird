import {all, fork, takeLatest, call, put, take, delay, takeEvery} from 'redux-saga/effects'
import {LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FOLLOW_USER_FAILURE,
UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_SUCCESS, UNFOLLOW_USER_FAILURE,
LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE,
LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE,
REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, 
EDIT_NICKNAME_REQUEST, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE} from '../reducers/user';

import axios from 'axios';



function loginAPI(data){
    return axios.post('/user/login', data, {
        withCredentials: true,
    });
}

function* loginUp(action){
    try{
        const result = yield call(loginAPI, action.data);
        yield put({type: LOG_IN_SUCCESS, data: result.data});
    }catch(error){
        // yield put({type: LOG_IN_FAILURE, error: error.response && `${error.response.status} ${error.response.data} ${error.response.data.code} ${error.response.data.message}`});
        yield put({type: LOG_IN_FAILURE, error: error.reponse && error.reponse.data.message})
                                                 //'403 [object Object] 403 비밀번호가 틀렸습니다.'
    }
}

function* watchLogin(){
    yield takeEvery(LOG_IN_REQUEST, loginUp);
}


function signAPI(data){
    return axios.post('/user/', data);
}

function* signUp(action){
    try{
        yield call(signAPI, action.data);
        // throw new Error('에러');
        yield put({type: SIGN_UP_SUCCESS});
    }catch(e){
        yield put({type: SIGN_UP_FAILURE, error: e});
    }
}

function* watchSingup(){
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logoutAPI(data){
    return axios.post('/user/logout', {}, {
        withCredentials: true
    });
}

function* loadLogout(){
    try{
        yield call(logoutAPI);
        yield put({type: LOG_OUT_SUCCESS});
    }catch(e){
        yield put({type: LOG_OUT_FAILURE, error: e});
    }
}

function* watchLogout(){
    yield takeEvery(LOG_OUT_REQUEST, loadLogout);
}



function loadUserAPI(id){
    return axios.get(id ? `/user/${id}` : '/user/', {
        withCredentials: true
    });
}

function* loadUser(action){
    try{
        const user = yield call(loadUserAPI, action.data);
        yield put({type: LOAD_USER_SUCCESS, data: user.data, me: !action.data});
    }catch(error){
        yield put({type: LOAD_USER_FAILURE, error: error.response && error.response.data.message});
    }
}

function* watchLoadUser(){
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}


function editNickNameAPI(nickName){
    return axios.patch(`/user/nickname`, {nickName}, {
        withCredentials: true
    });
}

function* editNickName(action){
    try{
        const result = yield call(editNickNameAPI, action.data);
        yield put({type: EDIT_NICKNAME_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);

        yield put({type: EDIT_NICKNAME_FAILURE, error: error});
    }
}

function* watchEditNickName(){
    yield takeLatest(EDIT_NICKNAME_REQUEST, editNickName);
}


function followAPI(userId){
    return axios.post(`/user/${userId}/follow`, {}, {
        withCredentials: true
    });
}

function* follow(action){
    try{
        const result = yield call(followAPI, action.data);
        yield put({type: FOLLOW_USER_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);
        alert(error.response && error.response.data);

        yield put({type: FOLLOW_USER_FAILURE, error: error});
    }
}

function* watchFollow(){
    yield takeLatest(FOLLOW_USER_REQUEST, follow);
}


function unFollowAPI(userId){
    return axios.delete(`/user/${userId}/follow`,  {
        withCredentials: true
    });
}

function* unFollow(action){
    try{
        const result = yield call(unFollowAPI, action.data);
        yield put({type: UNFOLLOW_USER_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);
        alert(error.response && error.response.data);

        yield put({type: UNFOLLOW_USER_FAILURE, error: error});
    }
}

function* watchUnFollow(){
    yield takeLatest(UNFOLLOW_USER_REQUEST, unFollow);
}


function loadFollowingsAPI(userId, offset = 0, limit = 3){   // 인자로 null이 들어오면 기본값으로 안됨.  undefined가 들어오면 기본값이 적용 됨.
    return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`,  {
        withCredentials: true
    });
}

function* loadFollowings(action){
    try{
        const result = yield call(loadFollowingsAPI, action.data, action.offset);
        yield put({type: LOAD_FOLLOWINGS_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);

        yield put({type: LOAD_FOLLOWINGS_FAILURE, error: error});
    }
}

function* watchLoadFollowings(){
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function loadFollowersAPI(userId, offset=0, limit=3){
    return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,  {
        withCredentials: true
    });
}

function* loadFollowers(action){
    try{
        const result = yield call(loadFollowersAPI, action.data, action.offset);
        console.log('result : ', result.data)
        yield put({type: LOAD_FOLLOWERS_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);

        yield put({type: LOAD_FOLLOWERS_FAILURE, error: error});
    }
}

function* watchLoadFollowers(){
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function removeFollowerAPI(userId){
    return axios.delete(`/user/${userId}/follower`,  {
        withCredentials: true
    });
}

function* removeFollower(action){
    try{
        const result = yield call(removeFollowerAPI, action.data);
        yield put({type: REMOVE_FOLLOWER_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);

        yield put({type: REMOVE_FOLLOWER_FAILURE, error: error});
    }
}

function* watchRemoveFollower(){
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}


export default function* userSaga(){
    yield all([
        fork(watchSingup),
        fork(watchLoadUser),
        fork(watchLogin),
        fork(watchLogout),
        fork(watchEditNickName),
        fork(watchFollow),  // 내가 팔로우 함
        fork(watchUnFollow),  //내가 언팔로우 함
        fork(watchLoadFollowings), //내 팔로우 리스트
        fork(watchLoadFollowers),  // 내 팔로워 리스트
        fork(watchRemoveFollower)  // 내 팔로워 제거
    ]);
}