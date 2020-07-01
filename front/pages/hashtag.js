import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {LOAD_HASHTAG_POSTS_REQUEST} from '../reducers/post';
import PostCard from '../components/PostCard';


const Hashtag = ({ tag })=>{
    const {mainPosts, hasMorePost} = useSelector(state => state.post);
    const useLastId = useRef([]);

    const dispatch = useDispatch();
    
    const onScroll = () => {
        if(mainPosts && mainPosts.length && (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight-300)){
            if(hasMorePost){
                console.log('hashtag p ', mainPosts.length);
                const lastId = mainPosts && mainPosts[mainPosts.length-1].id;

                if(!useLastId.current.includes(lastId)){
                    dispatch({type: LOAD_HASHTAG_POSTS_REQUEST, data: tag, lastId});
                    useLastId.current.put(lastId);
                }
            }
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts, hasMorePost]);

    return (    
        <div>
            {
                mainPosts.map((c, i)=> {
                    return(
                        <PostCard key={i} post={c}/>
                    )
                })
            }
        </div>
    )
}

Hashtag.propTypes = {
    tag: PropTypes.string.isRequired
}

Hashtag.getInitialProps = async (context) => {
    
    const tag = context.query.tag;
    context.store.dispatch({type: LOAD_HASHTAG_POSTS_REQUEST, data: tag});
    
    return {tag};
}


export default Hashtag;