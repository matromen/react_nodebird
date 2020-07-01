import React from 'react';
import Document, {Main, NextScript} from 'next/document';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {ServerStyleSheet} from 'styled-components';

class MyDocument extends Document{
    static getInitialProps(context){
        const sheet = new ServerStyleSheet();  //서버 사이드 랜더링시 styled-component 적용법
        const page = context.renderPage((App)=>(props)=> sheet.collectStyles(<App {...props} />)); // styled를 위해 sheet.collectStyles메소드로 감쌈
        // const page = context.renderPage((App)=>(props)=> <App {...props} />);
        const styleTages = sheet.getStyleElement();

        return {...page, helmet: Helmet.renderStatic(), styleTages};
    }

    render(){
        const {htmlAttributes, bodyAttributes, ...helmet} = this.props.helmet;
        const htmlAttrs = htmlAttributes.toComponent();
        const bodyAttrs = bodyAttributes.toComponent();
        console.log(helmet)
        return(
            <html {...htmlAttrs}>
                <head>
                    {this.props.styleTages}
                    {Object.values(helmet).map(el=>el.toComponent())}
                </head>
                <body {...bodyAttrs}>
                    <Main />
                    {process.env.NODE_ENV === 'production' && 
                        // <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />}
                        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6%2Ces7%2CNodeList.prototype.forEach%2Ces2018%2Ces2019" />}
                    <NextScript />
                </body>
            </html>
        )
    }
}

MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
    styleTages: PropTypes.object.isRequired 
}


export default MyDocument;