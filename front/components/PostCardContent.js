import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';


const PostCardContent = ({postData})=>{
    return (
        <div>
            {
                postData.split(/(#[^\s]+)/g).map((tag, i) => {
                    if(tag.match(/#[^\s]+/g)){
                        return (
                            <><Link href={{pathname:'/hashtag', query: {tag: tag.slice(1)}}} as={`/hashtag/${tag.slice(1)}`}  key={tag}><a>{tag}</a></Link></>
                        )
                    }else{
                        return (
                            <>{tag}</>
                        )
                    }
                })
            }
        </div>
    
    )
}

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired
}

export default PostCardContent;