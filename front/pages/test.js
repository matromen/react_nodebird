import React, {useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ADD_POST_REQUIRE} from '../reducers/test';


const Test = ()=>{
    let count = useRef(0);
    console.log('ccc ', count);  //ccc  {current: 0}
    count.current = count.current + 1;

    const [count2, setCount2] = useState(1); 

    const dispatch = useDispatch();
    const {posts} = useSelector(state => state.test);

    useEffect(() => {
        dispatch({type: ADD_POST_REQUIRE, data: {id:1}})
        setCount2(2);
        console.log('@@@@@@@@@@@@@@@@@' + count2)
    }, [count])

    return (
        <div>
            {console.log(`redering${count.current}`)}
            {console.log(`redering2${count2}`)}
        </div>
    )
}

export default Test;