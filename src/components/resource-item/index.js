import React from 'react';
import {
    BaseResourceItem
} from '../base';
import {
    IntranetServerConfig
} from '../../config/server-info-config';
import PropTypes from 'prop-types'


class ResourceItem extends React.Component {
    render() {
        let {movieName, mime, cover, introduction} = this.props.resource;
        if(cover)
            cover = cover.startsWith('http') ? cover : IntranetServerConfig.STATIC_URL + cover;
        //取得文件列表中最大的文件作为主标题
        return (
            <BaseResourceItem {...this.props} resource={{
                title: movieName,
                introduction: introduction,
                mime: mime,
                cover: cover,
            }}/>
        )
    }
}

ResourceItem.propTypes = {
    resource: PropTypes.shape({
        movieName: PropTypes.string,
            size: PropTypes.number,
        }
    ),
    width: PropTypes.number,
    onRemove: PropTypes.func,
    staticPath: PropTypes.string,
};

ResourceItem.defaultProps = {
    resource: PropTypes.shape({
            movieName: '',
            size: 0,
        }
    ),
    width: 200,
    onRemove: () => {

    },
};

export default ResourceItem;