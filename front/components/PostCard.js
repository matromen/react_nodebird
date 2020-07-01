import React, {useState, useRef, useCallback, useEffect, memo} from 'react';
import {Form, Card, Button, Avatar, Input, List, Comment, Popover} from 'antd';
import { EditOutlined, EllipsisOutlined, RetweetOutlined, HeartOutlined,  HeartTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import {ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST, REMOVE_POST_REQUEST} from '../reducers/post';
import {UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST} from  '../reducers/user';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import CommentForm from './CommentForm';
import FollowButton from './FollowButton'

import moment from 'moment';
moment.locale('ko');

const CardWrapper = styled.div`
    margin-bottom: 20px; 
`;

const PostCard = memo(({post}) => {
    const [commentFormOpend, setCommentFormOpend] = useState(false);
    const id = useSelector(state => state.user.me && state.user.me.id);

    const dispatch = useDispatch();

    const onRemovePost = useCallback((postId) => () => {
        dispatch({type: REMOVE_POST_REQUEST, data: postId});
    },[]);

    const onUnfollow = useCallback((userId) => () => {
        dispatch({type: UNFOLLOW_USER_REQUEST, data: userId});
    }, []);

    const onFollow = useCallback((userId) => () => {
        dispatch({type: FOLLOW_USER_REQUEST, data: userId});
    }, []);

    const onRetweet = useCallback(() => {
        if(!id) return alert('로그인이 필요 합니다.');

        dispatch({type: RETWEET_REQUEST, data: post.id})
    }, [id, post && post.id]);


    const onToggleLike = useCallback(() => {
        if(!id) return alert('로그인이 필요 합니다.');
        if(post.Likers && post.Likers.find(v=>v.id === id)){  //좋아요를 이미 누른 상태
            dispatch({type: UNLIKE_POST_REQUEST, data: post.id})
        }else{ //좋아요를 아직 안누른 상태
            dispatch({type: LIKE_POST_REQUEST, data: post.id})
        }
    }, [id, post && post.Likers]);

    const onToggleComment = useCallback(() => {
        setCommentFormOpend(prevCommentFormOpend => {return !prevCommentFormOpend;});
        dispatch({type: LOAD_COMMENTS_REQUEST, data: post.id})
    }, []);

    
    return (
        <CardWrapper>
            <Card 
                cover={post.images && post.images[0] && <PostImages images={post.images} /> }

                actions={[
                    <RetweetOutlined onClick={onRetweet} />,
                    
                    id && post.Likers && post.Likers.find(v=>v.id === id)
                    ?
                    <HeartTwoTone  onClick={onToggleLike} />
                    :
                    <HeartOutlined onClick={onToggleLike} />
                    ,
                    
                    <EditOutlined onClick={onToggleComment}/>,
                    <Popover
                        key="ellipsis"
                        content={(
                        <Button.Group>
                            {id && post.userId === id
                            ? (
                                <>
                                <Button>수정</Button>
                                <Button type="danger" onClick={onRemovePost(post.id)}>삭제</Button>
                                </>
                            )
                            : <Button>신고</Button>}
                        </Button.Group>
                        )}
                    >
                        <EllipsisOutlined />
                    </Popover>
                               
                ]} 
                title={post.RetweetsId ? `${post.user.nickName}님이 리트윗 하였습니다.`: null}    
                extra={<FollowButton  post={post} onUnfollow={onUnfollow} onFollow={onFollow}/>}                       
            >
                {post.RetweetsId && post.Retweets ?
                    <Card cover={post.Retweets.images[0] && <PostImages images={post.Retweets.images} />}>
                        <Card.Meta
                            avatar={<Link href={{pathname:'/user', query: {id: post.Retweets.user.id}}} as={`/user/${post.Retweets.user.id}`}><a><Avatar>{ post.Retweets.user.nickName[0] }</Avatar></a></Link>}
                            title={post.Retweets.user.nickName}
                            description={<PostCardContent postData={post.Retweets.content} />}
                        />                        
                    </Card>
                :
               
                <Card.Meta
                    avatar={<Link href={{pathname:'/user', query: {id: post.user.id}}} as={`/user/${post.user.id}`}><a><Avatar>{ post.user.nickName[0] }</Avatar></a></Link>}
                    title={post.user.nickName}
                    description={<PostCardContent postData={post.content} />}
                />
                }
                <Link href={{pathname:'/post', query:{id:post.id}}} as={`/post/${post.id}`}><a>{moment(post.createdAt).format('YYYY.MM.DD')}</a></Link>
            </Card>
            
            {commentFormOpend && 
                <div>
                    <CommentForm post={post} />    

                    <List header={`${post.comments ? post.comments.length: 0} 댓글`}
                        itemLayout='horizontal'
                        dataSource={post.comments||[]}
                        renderItem={item=>(
                            <li>
                                <Comment
                                    author={item.user.nickName}
                                    avatar={<Link href={{pathname: '/user', query: {id: post.comments.id}}} as={`/user/${post.comments.id}`}><a><Avatar>{item.user.nickName[0]}</Avatar></a></Link>} 
                                    content={item.content}
                                    datetime={item.createAt}
                                />
                            </li>
                        )} 
                    />
                </div>
            }
            
        </CardWrapper>
    )
});

PostCard.propTypes = {
    post: PropTypes.shape({
        user: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string,
        createdAt: PropTypes.string
    })
}

export default PostCard;