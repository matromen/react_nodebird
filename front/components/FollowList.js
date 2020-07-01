import React, {memo} from 'react';
import {List, Button, Card} from 'antd';
import {StopOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';

const FollowList = memo(({header, loadMore, onClick, followList, unFollow}) => {
    return (
        <List 
            sytle={{marginBottom: '20px'}}
            // grid={{gutter: 4, xs: 2, md: 3}}
            grid={{gutter: 4, column: 3}}
            size= 'small'
            header={header}
            loadMore={loadMore && <Button style={{width:'100%'}} onClick={onClick}>더보기</Button>}
            bordered
            dataSource={followList}
            renderItem={item => (
                <List.Item style={{marginTop:'20px'}}>
                    <Card 
                        actions={[
                            <StopOutlined key='stop' onClick={unFollow(item.id)} />
                        ]}     
                    >

                        <Card.Meta description={item.nickName}
                        />
                    </Card>
                </List.Item>
            )}
        >
        </List>
    )
});

FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    loadMore: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    followList: PropTypes.array.isRequired,
    unFollow: PropTypes.func.isRequired
}

export default FollowList;