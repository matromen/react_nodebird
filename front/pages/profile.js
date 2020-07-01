import React, {useEffect, useCallback, useRef} from 'react';
import {Input, Form, List, Button, Card} from 'antd';
import {StopOutlined} from '@ant-design/icons';
import NicknameEditForm from '../components/NictnameEditForm';
import {useDispatch, useSelector} from 'react-redux';
import Router from 'next/router';

import { LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWERS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import {LOAD_USER_POSTS_REQUEST} from '../reducers/post';
import PostCard from '../components/PostCard';
import FollowList from '../components/FollowList';

const Profile = () => {
    const {me, followingList, followerList, hasMoreFollowing, hasMoreFollower} = useSelector((state)=> state.user);
    const {mainPosts, hasMorePost} = useSelector((state)=> state.post);
    const useLastId = useRef([]);
    const dispatch = useDispatch();

    const onScroll = useCallback(() => {
        if(mainPosts && mainPosts.length && (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300)){
            if(hasMorePost){
                const lastId = mainPosts[mainPosts.length-1].id;
                
                if(!useLastId.current.includes(lastId)){
                    dispatch( {type: 'LOAD_USER_POSTS_REQUEST', data: me && me.id, lastId})

                    useLastId.current.push(lastId);
                }
            }
        }
    }, [mainPosts.length, hasMorePost]);


    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [me, mainPosts, hasMorePost]);

    

    const loadMoreFollowings = useCallback(() => {
        dispatch({type: LOAD_FOLLOWINGS_REQUEST, data: me.id, offset: followingList.length})
    }, [followingList]);

    const loadMoreFollowers = useCallback(() => {
        dispatch({type: LOAD_FOLLOWERS_REQUEST, data: me.id, offset: followerList.length})
    }, [followerList]);

    const unFollowing = useCallback((userId) => () => {
        dispatch({type: UNFOLLOW_USER_REQUEST, data: userId});
    }, []);

    const unFollower = useCallback((userId)=>()=>{
        dispatch({type: REMOVE_FOLLOWER_REQUEST, data: userId});
    }, []);

    // useEffect(() => {
    //     if(me){
    //         dispatch({type: LOAD_FOLLOWINGS_REQUEST, data: me.id});
    //         dispatch({type: LOAD_FOLLOWERS_REQUEST, data: me.id});
    //         dispatch({type: LOAD_USER_POSTS_REQUEST, data: me.id});
    //     }
    // }, [me&&me.id]);

    useEffect(()=>{
        if(!me) {
            alert('로그인이 필요 합니다.');
            Router.push('/');
        }

    }, [me && me.id]);

    if(!me){
        return null;
    }
    // console.log('mainPosts ', mainPosts)

    return (
        <div>
            <NicknameEditForm />
            
            {/* <List 
                sytle={{marginBottom: '20px'}}
                // grid={{gutter: 4, xs: 2, md: 3}}
                grid={{gutter: 4, column: 3}}
                size= 'small'
                header={<div>팔로잉 목록</div>}
                loadMore={hasMoreFollowing && <Button style={{width:'100%'}} onClick={loadMoreFollowings}>더보기</Button>}
                bordered
                dataSource={followingList}
                renderItem={item => (
                    <List.Item style={{marginTop:'20px'}}>
                        <Card 
                            actions={[
                                <StopOutlined key='stop' onClick={unFollowing(item.id)} />
                            ]}     
                        >

                            <Card.Meta description={item.nickName}
                            />
                        </Card>
                    </List.Item>
                )}
            >
            </List> */}
          {/* <List 
                sytle={{marginBottom: '20px'}}
                // grid={{gutter: 4, xs: 2, md: 3}}
                grid={{gutter: 4, column: 3}}
                size= 'small'
                header={<div>팔로워 목록</div>}
                loadMore={hasMoreFollower && <Button style={{width:'100%'}} onClick={loadMoreFollowers}>더보기</Button>}
                bordered 
                dataSource={followerList}
                renderItem={item => (
                    <List.Item style={{marginTop:'20px'}}>
                        <Card 
                            actions={[
                                <StopOutlined key='stop' onClick={unFollower(item.id)} />
                            ]}     
                        >

                            <Card.Meta description={item.nickName}
                            />
                        </Card>
                    </List.Item>
                )}
            >
            </List>      */}

            <FollowList header={'팔로잉 목록'} loadMore={hasMoreFollowing} onClick={loadMoreFollowings} followList={followingList} unFollow={unFollowing}/>
            <FollowList header={'팔로워 목록'} loadMore={hasMoreFollower} onClick={loadMoreFollowers} followList={followerList} unFollow={unFollower}/>
              
            <div>
                {
                    mainPosts.map((c, i)=> {
                        return(
                            <PostCard post={c} key={i} />
                        )
                    })
                }
            </div>                   
        </div>
    );
};

Profile.getInitialProps = async (context) => {
    const userState = context.store.getState().user;
    context.store.dispatch({type: LOAD_FOLLOWINGS_REQUEST, data: userState.me && userState.me.id});
    context.store.dispatch({type: LOAD_FOLLOWERS_REQUEST, data: userState.me && userState.me.id});
    context.store.dispatch({type: LOAD_USER_POSTS_REQUEST, data: userState.me && userState.me.id});
}

export default Profile;  