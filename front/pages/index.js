import React, {useEffect, useCallback, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {LOG_IN, LOG_OUT} from '../reducers/user';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

import {LOAD_MAIN_POSTS_REQUEST} from '../reducers/post';


const Home = () => {
    const {isLoggedin, me} = useSelector((state)=> state.user);
    const {mainPosts, hasMorePost} = useSelector((state)=> state.post);
    const useLastId = useRef([]);
    const [aaa, setAaa] = useState(1);

    const dispatch = useDispatch();
    
    const onScroll = () => {
        // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        if(mainPosts && mainPosts.length && (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight-300)){
            if(hasMorePost){
                const lastId = mainPosts[mainPosts.length-1].id;
                if(!useLastId.current.includes(lastId)){
                    
                    dispatch({type: LOAD_MAIN_POSTS_REQUEST, lastId});

                    useLastId.current.push(lastId);
                }
            }
        }
    }


    // useEffect(()=>{
    //     useLastId.current = [];
    // }, []);

    useEffect(() => {
        setAaa(2);
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts, hasMorePost])


    return (
        <div>
            {me ? <div>{me.nickName} 로그인 하였습니다.</div> : <div>로그아웃 하였습니다.</div>}
            {me && 
                <PostForm />
            }

            {mainPosts.map((c,i)=>{
                return (
                    <PostCard key={c.id} post={c} />

                );
            })}
        </div>

    );
}

Home.getInitialProps = async (context) => {
    console.log('가장 먼저')
    context.store.dispatch({type: LOAD_MAIN_POSTS_REQUEST});
}

export default Home;

