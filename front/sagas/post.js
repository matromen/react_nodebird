import {all, fork, delay, put, takeLatest, call, throttle} from 'redux-saga/effects';
import {ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, LOAD_MAIN_POSTS_REQUEST,
    LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
    LOAD_USER_POSTS_REQUEST ,LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
    LOAD_COMMENTS_REQUEST, LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_FAILURE,
    UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
    UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
    RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE} from '../reducers/post';
import {ADD_POST_TO_ME, REMOVE_POST_TO_ME} from '../reducers/user';

import axios from 'axios';


function addPostAPI(data){
    return axios.post('/post', data, {
        withCredentials: true
    });
}

function* addPost(action){
    try{
        const result = yield call(addPostAPI, action.data);
        yield put({type: ADD_POST_SUCCESS, data: result.data});
        yield put({type: ADD_POST_TO_ME, data: result.data.id});
    }catch(error){
        yield put({type: ADD_POST_FAILURE, error: error.response.data.message});
    }
}

function* watchAddPost(){
    yield takeLatest(ADD_POST_REQUEST, addPost);
}


function loadPostsAPI(lastId=0, limit=10){
    return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}

function* loadPosts(action){
    try{
        const result = yield call(loadPostsAPI, action.lastId);
        yield put({type: LOAD_MAIN_POSTS_SUCCESS, data: result.data});
    }catch(error){
        yield put({type: LOAD_MAIN_POSTS_FAILURE, error: error});
    }
}

function* watchLoadPosts(){
    yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadPosts);
}


function addCommentAPI(data){
    return axios.post(`/post/${data.postId}/comment`, {content:data.content}, {
        withCredentials: true
    });
}

function* addComment(action){
    try{
        const result = yield call(addCommentAPI, action.data);
        yield put({type: ADD_COMMENT_SUCCESS, data: {comment: result.data, postId: action.data.postId}});
    }catch(e){
        yield put({type: ADD_COMMENT_FAILURE, error: e});
    }
}

function* watchAddComment(){
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}


function loadCommentsAPI(id){
    return axios.get(`/post/${id}/comments`,  {
        withCredentials: true
    });
}

function* loadComments(action){
    try{
        const result = yield call(loadCommentsAPI, action.data);
        yield put({type: LOAD_COMMENTS_SUCCESS, data: {comments: result.data, postId: action.data}});
    }catch(e){
        yield put({type: LOAD_COMMENTS_FAILURE, error: e});
    }
}

function* watchLoadComments(){
    yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}


function loadHashtagPostsAPI(tag, lastId=0){
    console.log('ss')
    return axios.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=10`);
}

function* loadHashtagPosts(action){
    try{
        const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
        console.log('result2 ', result.data);
        yield put({type: LOAD_HASHTAG_POSTS_SUCCESS, data: result.data});
    }catch(error){
        yield put({type: LOAD_HASHTAG_POSTS_FAILURE, error: error});
    }
}

function* watchLoadHashtagPosts(){
    yield throttle(200, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}




function loadUserPostsAPI(id, lastId=0, limit=10){
    return axios.get(`/user/${id || 0}/posts?lastId=${lastId}&limit=${limit}`, {
        withCredentials: true
    });
}

function* loadUserPosts(action){
    try{
        const result = yield call(loadUserPostsAPI, action.data, action.lastId, action.limit);
        console.log('LOAD_USER_POSTS result.data : ', result.data)
        yield put({type: LOAD_USER_POSTS_SUCCESS, data: result.data});
    }catch(error){
        yield put({type: LOAD_USER_POSTS_FAILURE, error: error});
    }
}

function* watchLoadUserPosts(){
    yield throttle(200, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}


function uploadImagesAPI(formData){
    return axios.post(`/post/images`, formData, {
        withCredentials: true
    });
}

function* uploadImages(action){
    try{
        const result = yield call(uploadImagesAPI, action.data);
        yield put({type: UPLOAD_IMAGES_SUCCESS, data: result.data});
    }catch(error){
        yield put({type: UPLOAD_IMAGES_FAILURE, error: error});
    }
}

function* watchUploadImages(){
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function likePostAPI(postId){
    return axios.post(`/post/${postId}/like`, {}, {
        withCredentials: true
    });
}

function* likePost(action){
    try{
        const result = yield call(likePostAPI, action.data);
        yield put({type: LIKE_POST_SUCCESS, data: {postId: action.data, user_id: result.data.user_id}});
    }catch(error){
        yield put({type: LIKE_POST_FAILURE, error: error});
    }
}

function* watchLikePost(){
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}


function unLikePostAPI(postId){
    return axios.delete(`/post/${postId}/unlike`, {
        withCredentials: true
    });
}

function* unLikePost(action){
    try{
        const result = yield call(unLikePostAPI, action.data);
        yield put({type: UNLIKE_POST_SUCCESS, data: {postId: action.data, user_id: result.data.user_id}});
    }catch(error){
        yield put({type: UNLIKE_POST_FAILURE, error: error});
    }
}

function* watchUnLikePost(){
    yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}


function retweetAPI(postId){
    return axios.post(`/post/${postId}/retweet`, {}, {
        withCredentials: true
    });
}

function* retweet(action){
    try{
        const result = yield call(retweetAPI, action.data);
        yield put({type: RETWEET_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);
        alert(error.response && error.response.data);

        yield put({type: RETWEET_FAILURE, error: error});
    }
}

function* watchRetweet(){
    yield takeLatest(RETWEET_REQUEST, retweet);
}


function removePostAPI(postId){
    return axios.delete(`/post/${postId}`,  {
        withCredentials: true
    });
}

function* removePost(action){
    try{
        const result = yield call(removePostAPI, action.data);
        yield put({type: REMOVE_POST_SUCCESS, data: result.data});
        yield put({type: REMOVE_POST_TO_ME, data: result.data});
    }catch(error){
        console.error(error);
        alert(error.response && error.response.data);

        yield put({type: REMOVE_POST_FAILURE, error: error});
    }
}

function* watchRemovePost(){
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}



function loadPostAPI(postId){
    return axios.get(`/post/${postId}`);
}

function* loadPost(action){
    try{
        const result = yield call(loadPostAPI, action.data);
        yield put({type: LOAD_POST_SUCCESS, data: result.data});
    }catch(error){
        console.error(error);
        alert(error.response && error.response.data);

        yield put({type: LOAD_POST_FAILURE, error: error});
    }
}

function* watchLoadPost(){
    yield takeLatest(LOAD_POST_REQUEST, loadPost);
}



export default function* postSaga(){
    yield all([
        fork(watchAddPost),
        fork(watchAddComment),  
        fork(watchLoadComments),
        fork(watchLoadPosts),
        fork(watchLoadHashtagPosts),
        fork(watchLoadUserPosts),
        fork(watchUploadImages),    
        fork(watchLikePost),
        fork(watchUnLikePost),
        fork(watchRetweet),
        fork(watchRemovePost),
        fork(watchLoadPost)
    ]);
}