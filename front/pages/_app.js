import React from 'react';
import Head from 'next/head';

import PropTypes from 'prop-types';

import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Helmet} from 'react-helmet';
import {Container} from 'next/app';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';

import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

import {LOAD_USER_REQUEST} from '../reducers/user';
import axios from 'axios';


const NodeBird = ({Component, store, pageProps}) => {   {/*<-- next가 props로 다른 page component를  넣어줌. 그리고 next-redux-wrapper를 통해 store 값을 넣어줌*/}
    return (
        <Container>  
             {/* _document.js에서 사용하기 위해 Container로 한번더 묶음 */}
            <Provider store={store}>
                <Helmet 
                    title='NodeBird'
                    htmlAttributes={{lang:'ko'}}
                    meta={[
                        {charset: 'UTF-8'},
                        {name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover'},
                        {'http-equiv': 'X-UA-Compatible', content: 'IE-edge'},
                        {name: 'description', content: 'react NodeBird'},
                        {property: 'og-title', content: 'React-NodeBird'},
                        {property: 'og-description', content: 'react NodeBird'},
                        {property: 'og-type', content: 'website'},
                        {property: 'og-image', content: '/favicon.ico'}
                    
                    ]}
                    link={[
                        {rel:'stylesheet', href:'https://cdnjs.cloudflare.com/ajax/libs/antd/4.2.5-alpha.0/antd.css'},
                        {rel:'stylesheet', href:'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'},
                        {rel:'stylesheet', href:'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'}
                    ]}
                    script={[]}
                />
                {/* <Head>
                    <title>NodeBird-React</title>
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/antd/4.2.5-alpha.0/antd.css' />
                    <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />                
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>         */}
                <AppLayout>
                    <Component {...pageProps} />  {/* children 방식으로 props전달 하는 방법.  jsx 테그(AppLayout) 안에 children을 props로 사용*/}
                </AppLayout>
            </Provider>
        </Container>
    );
}


//////////////////////////////////////prop- types 예제//////////////////////////////////////
NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired
}
//////////////////////////////////////prop- types 예제//////////////////////////////////////

//////////////////////////동적인 주소를 사용하기 위해 express<->next(redux-saga)////////////////////////////
NodeBird.getInitialProps = async (context) => {
    // console.log('_app.js : ', context);
    const {Component, ctx} = context;

    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';  // 서버 사이드 랜더링에서는 브라우져가 하던 cookie 전송(saga연동)을 직접 구현(cookie 가져오기)해야 함.
    if(ctx.isServer && cookie){                                 // 서버 사이드 환경 일때만 최종 axios에 쿠키 저장, 클라이언트 환경일때는 무시
        axios.defaults.headers.Cookie = cookie;
    }

    const state = ctx.store.getState();                     // 처음 서버 사이드 랜더링  직접 me와 reducer, saga를 함
    if(!state.user.me){
        ctx.store.dispatch({type: LOAD_USER_REQUEST});
    }

    let pageProps = {};
    if(Component.getInitialProps){
        pageProps = await Component.getInitialProps(ctx) || {};   //Component page에 ctx 전달, 기본값 {}
    }


    return {pageProps}; //query: { tag: '12345' }
                        //클라이언트 사이드 호출 : <Link href={{pathname:'/hashtag', query: {tag: tag.slice(1)}}} as={`/hashtag/${tag.slice(1)}`}
                        //서버 사이드는 직접 페이지를 리로드 또는 호출 하는 것을 말함. 
}
//////////////////////////동적인 주소를 사용하기 위해 express<->next(redux-saga)////////////////////////////

/////////////////////////next <--> redux <--> saga //////////////////////////////
// export default withRedux((initialState, options)=>{
//     const sagaMiddleware = createSagaMiddleware();
//     const middlewares = [sagaMiddleware];
//     const enhancer = 
//         process.env.NODE_ENV === 'production' 
//         ? 
//         compose(applyMiddleware(...middlewares))
//         :
//         compose(applyMiddleware(...middlewares), 
//         // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__!=='undefined' ? __REDUX_DEVTOOLS_EXTENSION__() : (f)=>f
//         !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? __REDUX_DEVTOOLS_EXTENSION__() : (f)=>f
//         )
    
//     const store = createStore(rootReducer, initialState, enhancer);
//     store.sagaTask = sagaMiddleware.run(rootSaga);  //server side rendering을 위해 추가  next-redux-saga
//     sagaMiddleware.run(rootSaga);

//     return store;
// })(withReduxSaga(NodeBird));   //server side rendering을 위해 withReduxSaga 추가  next-redux-saga

/////////////////////////next <--> redux <--> saga //////////////////////////////

const configureStore = (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    // const middlewares = [sagaMiddleware, (store)=>(next)=>(action)=>{
    //     console.log(action);
    //     next(action);
    // }];
    const middlewares = [sagaMiddleware];    
    const enhancer = process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
        applyMiddleware(...middlewares),
        !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
      );
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
  };
  
  export default withRedux(configureStore)(withReduxSaga(NodeBird));