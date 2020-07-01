import React, { useCallback } from 'react';
import {Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {LOG_OUT_REQUEST} from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
    const dispatch = useDispatch();
    const {nickName, posts, Followers, Followings} = useSelector((state)=>state.user).me;
    const {isLoggingout} = useSelector((state)=> state.user);

    const logout = useCallback(() => {
        dispatch({type: LOG_OUT_REQUEST});
    }, []);

    return (
        <Card
            style={{ width: 300 }}
            cover={
                <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }    
            actions={[
                <Link href='/profile' key="twit" prefetch><a><div>짹짹<br/>{posts.length}</div></a></Link>,
                <Link href='/profile' key="follower" prefetch><a><div>팔로우<br/>{Followers.length}</div></a></Link>,
                <Link href='/profile' key="following" prefetch><a><div>팔오윙<br/>{Followings.length}</div></a></Link>
            ]}                                       
        >

            <Card.Meta
                avatar={<Avatar>{ nickName[0] }</Avatar>}
                title={nickName}
                description="This is the description"
            />
            <Button onClick={logout} loading={isLoggingout}>로그아웃</Button>            
        </Card>

    )
}

export default UserProfile;