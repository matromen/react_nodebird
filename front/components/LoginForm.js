import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import {Form, Button, Input} from 'antd';
import {useCustom}  from '../pages/signup';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import {LOG_IN_REQUEST} from '../reducers/user';

const LoginError = styled.div`
    color: red;
`;
const LoginForm = () => {
    console.log('LoginForm ... ');
    
    const [userId, onChangeId] = useCustom('');
    const [password, onChangePassword] = useCustom('');
    const {isLoggingin, me, loginErrorReason} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if(me){
    //         alert('로그인 하였으니 메인페이지로 이동합니다.');
    //         Router.push('/');
    //     }
    // }, [me && me.userId]);
    
    const onSubmitForm = useCallback((e)=>{
        console.log({
            userId, 
            password
        });

        dispatch({type:LOG_IN_REQUEST, data: {userId, password}});

    },[userId, password]);

    
    return (
        
        <Form onFinish={onSubmitForm} style={{padding: '20px'}}>
            <div>
                <label htmlFor='user-id'>아이디</label>
                <br/>
                <Input name='user-id' value={userId} onChange={onChangeId} required></Input>
            </div>
            <div>
                <label htmlFor='user-password'>패스워드</label>
                <br/>
                <Input name='user-password' type='password' value={password} onChange={onChangePassword} required></Input>
            </div>    
            {loginErrorReason && <LoginError>{loginErrorReason}</LoginError>}
            <div style={{marginTop: '10px'}}>
                <Button type='primary' htmlType='submit' loading={isLoggingin}>로그인</Button>
                <Link href='/signup'><a><Button type='primary' style={{float: 'right'}}>회원가입</Button></a></Link>
            </div>
        </Form>
    );
}

export default LoginForm;