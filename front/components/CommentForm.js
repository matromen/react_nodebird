import React, {useState, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {Form, Input, Button} from 'antd';
import {ADD_COMMENT_REQUEST} from '../reducers/post';

const CommentForm = ({post}) => {
    const [commentText, setCommentText] = useState('');
    const {isAddingComment, commentAdded} = useSelector(state => state.post);
    const {me} = useSelector(state => state.user);
    
    const dispatch = useDispatch();


    const onChangeCommentText = useCallback((e)=>{
        setCommentText(e.target.value);
    }, []);

    const onSubmitForm = useCallback(() => {
        if(!me){
            return alert('로그인이 필요 합니다.');
        }

        dispatch({type:ADD_COMMENT_REQUEST, data:{postId: post.id, content: commentText}})
        
    }, [me && me.id, commentText]);

    useEffect(() => {
        if(commentAdded){
            setCommentText('');
        }
    }, [commentAdded]);
    
    
    return (
        <Form onFinish={onSubmitForm} >
            <Form.Item>
                <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}></Input.TextArea>
            </Form.Item>
            <Button type='primary' htmlType='submit' loading={isAddingComment}>댓글등록</Button>
        </Form>            
    )
}

CommentForm.propTypes = {
    post: PropTypes.object.isRequired
}

export default CommentForm;