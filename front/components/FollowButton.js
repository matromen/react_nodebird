import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Button} from 'antd';

const FollowButton = ({post, onUnfollow, onFollow}) => {
    const {me} = useSelector(state => state.user);

    return (
        <>
            {
            !me || post.userId === me.id 
            ? 
                null 
            :
                me.Followings && me.Followings.find(v=>v.id === post.userId) 
                ?
                    <Button onClick={onUnfollow(post.userId)}>언팔로우</Button>
                :
                    <Button onClick={onFollow(post.userId)}>팔로우</Button>
            }
        </>
    )
}

FollowButton.propTypes = {
    me: PropTypes.object,
    post: PropTypes.object.isRequired,
    onUnfollow: PropTypes.func.isRequired,
    onFollow: PropTypes.func.isRequired
}

FollowButton.defaultProps = {
    me: null
}

export default FollowButton;