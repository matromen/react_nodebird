import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import PostCard from '../components/PostCard';
import { Card, Avatar } from 'antd';
import {LOAD_USER_REQUEST} from '../reducers/user';
import {LOAD_USER_POSTS_REQUEST} from '../reducers/post';


const User = ({ id }) => {
    const dispatch = useDispatch();
    const { mainPosts } = useSelector(state => state.post);
    const { userInfo } = useSelector(state => state.user);

    // useEffect(()=>{
    //     dispatch({type:LOAD_USER_REQUEST, data: id});
    //     dispatch({type:LOAD_USER_POSTS_REQUEST, data: id});
    // }, []);
    console.log(' userInfo :', userInfo);
    return (
        <div>
            {
                userInfo
                ?
                <Card
                    actions={[
                        <div key="twit">짹짹<br/>{userInfo.posts}</div>,
                        <div key="follower">팔로우<br/>{userInfo.Followers}</div>,
                        <div key="following">팔오윙<br/>{userInfo.Followings}</div>,                        
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickName[0]}</Avatar>}
                        title={userInfo.nickName}
                        description="This is the description"
                    />
                </Card>
                :
                null
            }
            {

                mainPosts.map(c=>{
                    return (
                        <PostCard post={c} key={+c.createdAt} />
                    )
                })
            }
        </div>
    )
}

User.propTypes = {
    id: PropTypes.number.isRequired
}

User.getInitialProps = async (context)=>{
    const id = context.query.id;
    context.store.dispatch({type:LOAD_USER_REQUEST, data: id});
    context.store.dispatch({type:LOAD_USER_POSTS_REQUEST, data: id});

    return { id};
}

export default User;