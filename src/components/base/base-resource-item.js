import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import TweenOne from 'rc-tween-one';
import {BaseColor} from "../base/base-component";


const radius = '8px';

const TransCardBody = styled.div`
    border-radius: ${radius};
    display: flex;
    flex-direction: column;
    transition: transform 0.3s;
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
    };
    cursor: pointer;
    margin: 5px;
    width: 100%;
    max-width: 800px;
`;

const CardImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${radius};
    background-size: cover;
`;

const CardTitle = styled.span`
    margin: 5px;
    text-align: center;
`;

const CardDescription = styled.div`
    color: white;
    width: 100%;
    max-height: 100%;
    position: absolute;
    bottom: 0px;
    padding: 5px;
    word-break: break-all;
    background: ${BaseColor.gray}
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
`;


function getIconByMIME(mime) {
    if (!mime)
        return require('../../img/file.png');
    else if (mime.startsWith('audio/'))
        return require('../../img/music.png');
    else if (mime.startsWith('application/vnd.ms-excel')
        || mime.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.'))
        return require('../../img/excel.png');
    else if (mime.startsWith('application/msword') ||
        mime.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml') ||
        mime.startsWith('application/vnd.ms-word'))
        return require('../../img/word.png');
    else if (mime.startsWith('application/vnd.ms-powerpoint') ||
        mime.startsWith('application/vnd.openxmlformats-officedocument.presentationml'))
        return require('../../img/ppt.png');
    else if (mime.startsWith('application/pdf'))
        return require('../../img/pdf.png');
    else if (mime.startsWith('image'))
        return require('../../img/picture.png');
    else
        return require('../../img/file.png');
}

class BaseResourceItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter() {
        this.setState({
            hover: true
        });
    }

    handleMouseLeave() {
        this.setState({
            hover: false
        });
    }

    render() {
        let {title, mime, cover, introduction} = this.props.resource;
        let {onRemove, width, isMobile, showIntroduction} = this.props;
        let cardImageStyle = {
            width: width,
            height: width,
            borderStyle: 'none',
        };
        let transCardBodyStyle = {
            width: width,
        };
        if (cover) {
            cardImageStyle.backgroundImage = `url(${cover})`;
        } else {
            cardImageStyle.backgroundColor = 'white';
        }
        //取得文件列表中最大的文件作为主标题
        return (
            <TransCardBody {...this.props} style={transCardBodyStyle} onMouseEnter={this.handleMouseEnter}
                           onMouseLeave={this.handleMouseLeave}>
                <CardImage style={cardImageStyle}>
                    {
                        !!cover ?
                            ''
                            :
                            <img src={getIconByMIME(mime)} alt="" style={{
                                width: width / 2,
                                height: width / 2,
                            }}/>
                    }
                    {
                        this.state.hover && showIntroduction && !!cover?
                            <TweenOne animation={{
                                height: '100%',
                                opacity: 0.8,
                            }} style={{
                                position: 'relative',
                                width: '100%',
                                height: 0,
                            }}>
                                <CardDescription>{introduction}</CardDescription>
                            </TweenOne>
                            :
                            ''
                    }
                </CardImage>

                <CardTitle>{title}</CardTitle>
            </TransCardBody>
        )
    }
}

BaseResourceItem.propTypes = {
    resource: PropTypes.shape({
            title: PropTypes.string,
            introduction: PropTypes.string,
            cover: PropTypes.string,
            mime: PropTypes.string,
        }
    ),
    width: PropTypes.number,
    onRemove: PropTypes.func,
    showIntroduction: PropTypes.bool,
};

BaseResourceItem.defaultProps = {
    resource: PropTypes.shape({
            title: '',
            introduction: '',
            cover: '',
            mime: '',
        }
    ),
    width: 200,
    showIntroduction: true,
    onRemove: () => {

    },
};

export default BaseResourceItem;