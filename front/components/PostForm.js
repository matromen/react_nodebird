import React, { useCallback, useState, useEffect, useRef } from 'react';
import {Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE} from '../reducers/post';


const PostForm = () => {
    const [text, setText] = useState('');
    const imageRef = useRef();
    const {imagePaths, isAddingPost, postAdded} = useSelector((state) => state.post);
    const dispatch = useDispatch();
    
    const onSubmitForm = useCallback(()=>{  
        if(!text || !text.trim()){
            return alert('게시글을 작성 하세요.');
        }

        const submitFormData = new FormData();
        imagePaths.forEach(imgPath=>{
            submitFormData.append('images', imgPath);
        });
        submitFormData.append('content',text.trim());

        dispatch({type: ADD_POST_REQUEST, data: submitFormData}); 
    }, [text, imagePaths]);

    const onChnageText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    useEffect(() => {
        if(postAdded){
            setText('');
        }
    }, [postAdded]);

    // 첨부파일
    var onClickImageUpload = useCallback(()=>{
        console.log(imageRef);
        imageRef.current.click();
    }, [imageRef.current])

    var onChangeInput = useCallback((e) =>{
        const imageFormData = new FormData();
        console.log(e.target.files);
        [].forEach.call(e.target.files, (file)=>{
            console.log('file ', file);
            imageFormData.append('images', file);
        });
        console.log('imageFormData ', imageFormData);
        dispatch({type: UPLOAD_IMAGES_REQUEST, data: imageFormData});
    }, []);

    var onClickRemoveImage = useCallback((i) => () => {
        dispatch({type: REMOVE_IMAGE, data: i});
    }, []);
    // 첨부파일


    console.log('PostForm .....');
    return (
        <Form onFinish={onSubmitForm} encType='multipart/form-data' style={{margin: '10px 0 20px'}}>
            <Input.TextArea maxLength={140} placeholder='냠냠~' value={text} onChange={onChnageText}></Input.TextArea>
            <div>
                <input type='file' multiple hidden ref={imageRef} onChange={onChangeInput}/> 
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type='primary' htmlType='submit' style={{float:'right'}} loading={isAddingPost}>짹짹</Button>
            </div>
            <div>
                {imagePaths.map((v, i)=> {
                    return (
                        <div key={i} style={{display: 'inline-block'}}>
                            <img src={`http://localhost:3100/${v}`} style={{width: '200px'}} alt={v} />
                            <div>
                                <Button onClick={onClickRemoveImage(i)}>제거</Button>
                            </div>
                        </div>
                    );}
                )}
            </div>
        </Form>
    )
}

export default PostForm;