import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import {Overlay, Header, CloseButton, SlickWrapper, ImageWrapper, Indicator} from './styles/imageZoomStyle';


const ImageZoom = ({images, onClose}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Overlay>
        <Header>
          <h1>상세 이미지</h1>
          <CloseButton  onClick={onClose} />
        </Header>
        <SlickWrapper>
          <div>
            <Slick
              initialSlide={0}
              afterChange={slide => setCurrentSlide(slide)}
              infinite={false}
              arrows
              slidesToShow={1}
              slidesToScroll={1}
            >
              {images.map((v) => {
                return (
                  <ImageWrapper>
                    <img src={v.src}/>
                  </ImageWrapper>
                );
              })}
            </Slick>
            <Indicator>
              <div>
                {currentSlide + 1} / {images.length}
              </div>
            </Indicator>
          </div>
        </SlickWrapper>
      </Overlay>
    )
}

ImageZoom.prototype = {
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string
    })).isRequired,
    onClose: PropTypes.func.isRequired
}

export default ImageZoom;