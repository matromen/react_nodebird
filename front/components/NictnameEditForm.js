import React, {useState, useCallback} from 'react';
import {Form, Input, Button} from  'antd';
import {useSelector, useDispatch} from  'react-redux';
import {EDIT_NICKNAME_REQUEST} from '../reducers/user';


const NicknameEditForm = () => {
    const {me, isEditingNickName} = useSelector((state)=> state.user);
    const dispatch  = useDispatch();

    const [nickName, setNickName] = useState('');

    const onChangeNickName = useCallback((e) => {
        setNickName(e.target.value);
    }, []);

    const onSubmitForm = useCallback((e)=>{
        if(!nickName || !nickName.trim()){
            return alert('공백 입니다.')
        }else{
            dispatch({type: EDIT_NICKNAME_REQUEST, data: nickName})
        }
    }, [nickName]);

    return (
        <Form onFinish={onSubmitForm} style={{marginBottom: '20px', border: '1px solid #9d9d9', padding: '20px'}}>
            <Input addonBefore='닉네임' value={nickName} onChange={onChangeNickName} />
            <Button type='primary' htmlType='submit' loading={isEditingNickName}>수정</Button>
        </Form>
    )
}

export default NicknameEditForm;