import styled from 'styled-components';
import {CloseOutlined} from  '@ant-design/icons';

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0
`;
export const Header = styled.header`
  height: 44;
  background-color: white;
  position: relative;
  padding: 0;
  text-align: center
  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333,
    line-height: 44px
  }
`;


export const SlickWrapper = styled.div`
  height: calc(100%-44px);
  backgound: #090909;
`;

export const CloseButton = styled(CloseOutlined)`
  position: absolute;
  right:0px;
  top: 0px;
  padding: 15px;
  line-height:14px;
  cursour: pointer;
`;

export const Indicator = styled.div`
  text-align: center;
  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    boarder-radius: 15px;;
    background: #313131
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

export const ImageWrapper = styled.div`
  padding: 32px;
  text-align: center;
  & > img {
    margin: 0px auto;
    max-height: 750px;
  }
`;
