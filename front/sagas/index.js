import {all, call} from 'redux-saga/effects';
import user from './user';
import post from './post';
import axios from 'axios';
import {frontUrl} from '../conf/conf'

axios.defaults.baseURL = frontUrl;

export default function* rootSaga(){
    yield all([
        call(user), call(post)
    ]);
}


