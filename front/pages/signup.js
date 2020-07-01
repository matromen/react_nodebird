import React, {useState, useCallback, useEffect} from 'react';
import {Input, Form, Button, Checkbox} from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {SIGN_UP_REQUEST} from '../reducers/user';
import Router from 'next/router';


export const useCustom = (inValue = null) => {
    console.log('useCustom' + inValue);
    const [value, setter] = useState(inValue);
    const onChangeInput = useCallback((e)=>{
        setter(e.target.value);
    },[]);

    return [value, onChangeInput];
}

const Signup = () => {
    const [userId, setUserId] = useState('');
    const [nickName, setNickName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);

    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const {isSingingup, me} = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if(me){
            alert('로그인 하였으니 메인페이지로 이동합니다.');
            Router.push('/');
        }
    }, [me && me.userId]);

    const onSubmitForm = useCallback((e) => {
        if(password !== passwordCheck){
            return setPasswordError(true);
        }
        if(!term){
            return setTermError(true);
        }

        console.log({
            userId, nickName, password, passwordCheck, term
        })

        // dispatch(signupDataAction({id, nick, password}));
        dispatch({type: SIGN_UP_REQUEST, data: {userId, nickName, password}})
    }, [userId, nickName, password, passwordCheck, term]);

    const onChangeId =  useCallback((e) => {
        setUserId(e.target.value);
    }, [userId]);

    const onChangeNick = useCallback((e) => {
        setNickName(e.target.value);
    }, [nickName]);

    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
    }, [password]);

    const onChangePasswordChk = useCallback((e) => {
        setPasswordError(password !== e.target.value);
        setPasswordCheck(e.target.value);
    }, [passwordCheck]);

    const onChangeCheck = useCallback((e) => {
        setTermError(false);
        setTerm(e.target.checked);
    }, [term]);
    
    if(me){
        return null;
    }

    return (
        <>
            <Form onFinish={onSubmitForm} style={{padding: 10}}>
                <div>
                    <label htmlFor='user-id'>아이디</label>
                    <br/>
                    <Input name='user-id' required value={userId} onChange={onChangeId}></Input>
                </div>
                <div>
                    <label htmlFor='user-nick'>닉네임</label>
                        <br/>
                        <Input name='user-nick' required value={nickName} onChange={onChangeNick}></Input>
                </div>
                <div>
                    <label htmlFor='user-password'>비밀번호</label>
                    <br/>
                    <Input name='user-password' required value={password} onChange={onChangePassword}></Input>
                </div>
                <div>
                    <label htmlFor='user-password-chk'>비밀번호 확인</label>
                    <br/>
                    <Input name='user-password-chk' required value={passwordCheck} onChange={onChangePasswordChk}></Input>
                    {passwordError && <div style={{color: 'red'}}>패스워드가 일치하지 않습니다.</div>}                                            
                </div>
                <div>
                    <Checkbox name="user-term" checked={term}  onChange={onChangeCheck}>동의</Checkbox>
                    {termError && <div style={{color: 'red'}}>동의 해주세요.</div>}                                   
                </div>
                <div style={{marginTop: 10}}>
                    <Button type='primary' htmlType='submit' loading={isSingingup}>가입하기1</Button>
                </div>
            </Form>

        </>
    );
}


export default Signup;  