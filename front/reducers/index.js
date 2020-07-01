import {combineReducers} from  'redux';
import user from './user';
import post from  './post';
import test from './test';


const rootReducer = combineReducers({
    user,
    post,
    test
});

export default rootReducer;