import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {MoreOutlined}  from  '@ant-design/icons';
import ImageZoom from './ImageZoom';


const PostImages = ({images}) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(()=>{
        setShowImagesZoom(true);
    }, []);

    const onClose = useCallback(()=>{
        setShowImagesZoom(false);
    }, []);
    
    if(images.length === 1){
        return (
            <>
                <img src={images[0].src} onClick={onZoom}  />
                {showImagesZoom && <ImageZoom images={images} onClose={onClose}/>}
            </>
        )
    }  
    if(images.length === 2){
        return (
            <>
                <div>
                    <img src={images[0].src} width='50%'  onClick={onZoom}   />
                    <img src={images[1].src} style={{width:'50%'}}  onClick={onZoom}  />
                </div>
                {showImagesZoom && <ImageZoom images={images} onClose={onClose}/>}
            </>
        )
    }

    return (
        <>
            <div>
                <img src={images[0].src} width='50%'  onClick={onZoom} />
                <div style={{display: 'inline-block', width: '50%', textAlign:'center', verticalAlign:'middle'}}  onClick={onZoom} >
                    <MoreOutlined />
                    <br />
                    {images.length - 1} 개의 사진 더 보기
                </div>
            </div>
            {showImagesZoom && <ImageZoom images={images} onClose={onClose}/>}
        </>
    )
}

PostImages.propTypes = {
    // images: PropTypes.arrayOf(PropTypes.object).isRequired  //아래는 더 구체적으로
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string
    })).isRequired
}

export default PostImages;