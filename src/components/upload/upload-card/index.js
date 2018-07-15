import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import {
    BaseColor
} from '../../base/base-component';

import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import Tag from 'antd/lib/tag';
import Progress from 'antd/lib/progress';
import prettyBytes from "pretty-bytes";
import Tooltip from 'antd/lib/tooltip';


const radius = '8px';

const TransCardBody = styled.div`
    background-color: white;
    border-radius: ${radius};
    display: flex;
    flex-direction: row;
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
    };
    margin: 8px 0px;
    justify-content: center;
    width: 100%;
    max-width: 600px;
`;

const MyTag = styled.span`
    color: white;
    text-align: center;
    font-size: 1.8em;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: ${radius};
    border-bottom-left-radius: ${radius};
    flex-grow: 0;
    background-color: ${BaseColor.tag_color_3}
`;

const TransCardContent = styled.div`
    margin-left: 10px;
    padding: 8px;
    flex-grow: 1;
`;

const Title = styled.span`
    font-size: 1.2em;
    margin-right: 20px;
`;

const ItemTags = styled.div`
    margin-top: 10px;
`;

const RemoveIcon = styled(Icon)`
    position: absolute;
    right: 0px;
    top: 0px
    padding: 5px;
    &:hover {
        cursor: pointer;
    }
`;

const ProgressBody = styled.div`
    flex-grow: 0;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;    
`;

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

class UploadCard extends React.Component {

    render() {
        let {name, size, uid, type, response, percent} = this.props.file;
        let {onRemove} = this.props;
        //取得文件列表中最大的文件作为主标题
        return (
            <TransCardBody {...this.props}>
                <MyTag>
                    <Icon type="cloud-upload-o"/>
                </MyTag>
                <TransCardContent id={'display-body'}>
                    <Title>
                        {`${name}`}
                    </Title>
                    <ItemTags>
                        <Tag color={BaseColor.tag_color_2}>总大小：{prettyBytes(!!size ? size : 0)}</Tag>
                    </ItemTags>
                </TransCardContent>
                <ProgressBody>
                    {
                        percent === 0 ?
                            <Spin indicator={antIcon} style={{
                                width: '40px',
                            }}/>
                            :
                            <Progress type="circle" percent={ !!percent ? percent.toFixed(1) : 0} width={40}/>
                    }
                </ProgressBody>

                <Tooltip placement="topLeft" title="移除将会终止传输" arrowPointAtCenter>
                    <RemoveIcon type={'close'} onClick={() => {
                        onRemove(this.props.file);
                    }}/>
                </Tooltip>

            </TransCardBody>
        )
    }
}

UploadCard.propTypes = {
    file: PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
            uid: PropTypes.string,
            type: PropTypes.string,
            percent: PropTypes.number,
            response: PropTypes.object,
        }
    ),
    onRemove: PropTypes.func,
};

UploadCard.defaultProps = {
    file: PropTypes.shape({
            name: '',
            size: 0,
            uid: '',
            type: '',
            percent: 0.1,
            response: {},
        }
    ),
    onRemove: () => {

    },

};

export default UploadCard;