import React from 'react';
import PropTypes from 'prop-types'
import {
    BaseResourceItem
} from '../base';
import {
    CloudServerConfig
} from '../../config/server-info-config';
class LittleToolItem extends React.Component {
    render() {
        let {title, cover, description, website} = this.props.resource;
        let {staticPath} = this.props;
        if(cover)
            cover = cover.startsWith('http') ? cover : staticPath + cover;
        //取得文件列表中最大的文件作为主标题
        return (
            <BaseResourceItem {...this.props} resource={{
                title: title,
                cover: cover,
                introduction: description,
                mime: '',
            }}/>
        )
    }
}

LittleToolItem.propTypes = {
    resource: PropTypes.shape({
            title: PropTypes.string,
            website: PropTypes.string,
            description: PropTypes.string,
            cover: PropTypes.string,
            category: PropTypes.string,
        }
    ),
    width: PropTypes.number,
    onRemove: PropTypes.func,
    staticPath: PropTypes.string,
};

LittleToolItem.defaultProps = {
    resource: PropTypes.shape({
            title: '',
            website: '#',
            description: '',
            category: '',
            cover: '',
        }
    ),
    width: 200,
    staticPath: CloudServerConfig.STATIC_URL,
};

export default LittleToolItem;