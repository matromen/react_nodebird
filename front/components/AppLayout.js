import React, {useCallback, useEffect} from 'react';
import Link from 'next/link';
import {Menu, Input, Button, Row, Col, Card, Avatar, Form} from 'antd';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_USER_REQUEST } from '../reducers/user';
import Router from  'next/router';
import PropTypes from 'prop-types';


const AppLayout = ( { children } ) => {
    let { me } = useSelector((state) => state.user);


    const onSearch = function(value){
        Router.push( {pathname: '/hashtag', query:{tag: value}}, `/hashtag/${value}` );
    }
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key='home'><Link href='/' prefetch><a>노드버드</a></Link></Menu.Item>
                <Menu.Item key='profile'><Link href='/profile' prefetch><a>프로필</a></Link></Menu.Item>
                <Menu.Item key='mail'>
                    <Input.Search placeholder="input search text" enterButton onSearch={onSearch}
                    style={{verticalAlign: 'middle'}} />
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {
                        me ? 
                        <UserProfile />
                        :
                        <LoginForm />
                    }
                    
                    
                </Col>
                <Col xs={24} md={12}>{children}</Col>
                <Col xs={24} md={6}><Link href=''><a>Made by bgkim</a></Link></Col>
            </Row>
            
        </div>
    );
};   

AppLayout.propTypes = {
    children: PropTypes.node.isRequired 
}

export default AppLayout;