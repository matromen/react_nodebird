import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import {LOAD_POST_REQUEST} from '../reducers/post';


const Post = ({id}) => {
    const { singlePost } = useSelector(state => state.post);
    console.log(singlePost);
    return ( 
        <>
            <Helmet 
                title={`${singlePost.user.nickName}님의 글`}
                description={singlePost.content}
                meta={[
                    {name: 'description', content: singlePost.content},
                    {property: 'og:title', content: `${singlePost.user.nickName}님의 게시글`},
                    {property: 'og:description', content: singlePost.content},
                    {property: 'og:image', content: singlePost.images[0] && singlePost.images[0].src},
                    {property: 'og:url', content:`http://15.165.190.8/post/${id}`}
                ]}
                />
            <div>{singlePost.content}</div>
            <div>{singlePost.user.nickName}</div>
            <div>{singlePost.images[0] && <img src={singlePost.images[0].src}/>}</div>
        </>
    )
}


Post.propTypes = {
    id: PropTypes.number.isRequired,
}

Post.getInitialProps = async (context) =>{
    console.log('실행');
    context.store.dispatch({type: LOAD_POST_REQUEST, data: context.query.id});
    console.log(parseInt(context.query.id))
    return {id: parseInt(context.query.id)}
}



export default Post;