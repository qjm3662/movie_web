import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import {
    BaseColor
} from '../../base/base-component';

import Icon from 'antd/lib/icon';
import Tag from 'antd/lib/tag';
import Progress from 'antd/lib/progress';
import prettyBytes from "pretty-bytes";
import ClipBoard from 'clipboard';
import message from 'antd/lib/message';
import Tooltip from 'antd/lib/tooltip';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';


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
    margin: 8px 50px;
    justify-content: center;
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

const DisplayModal = styled(Modal)`
    
`;

const DisplayContent = styled.div`
    width: 100%:
    padding: 30px !important;
`;

const OperatorButton = styled(Button)`
    margin-right: 10px;
`;

function getFormatSpeed(rawBytes) {
    return prettyBytes(rawBytes) + " / s";
}

class TransCard extends React.Component {

    constructor(props) {
        super(props);
        this.onDisplayClick = this.onDisplayClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.downloadFileToLocal = this.downloadFileToLocal.bind(this);
        this.state = {
            visible: false,
        }
    }

    static handleClip(e) {
        message.success('成功复制到剪切板');
        e.clearSelection();
    }

    onDisplayClick(e) {
        this.setState({
            visible: true,
        });
        setTimeout(() => {
            let torrent = this.props.torrent;
            torrent.files.forEach(file => {
                file.appendTo('#display', {
                    autoplay: true,
                }, (err, elem) => {
                    console.log('callback');
                    if (err) {
                        message.info('该类型的文件无法预览');
                        console.log(err);
                    } else {
                        console.log('element');
                        console.log(elem);
                        elem.style.width = '100%';
                        elem.style.minHeight = '600px'
                    }
                });
            })
        }, 500);
    }


    onCancel() {
        this.setState({
            visible: false,
        })
    }

    /**
     * 将Blob对象中的文件保存到本地
     */
    downloadFileToLocal() {
        let torrent = this.props.torrent;
        //将文件保存到浏览器默认的下载文件夹下
        torrent.files.forEach(file => {
            file.getBlobURL((err, url) => {
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.style.display = 'none';
                a.download = file.name;
                a.href = url;
                a.click();
                URL.revokeObjectURL(url);
            });
        })
    }

    componentDidMount() {
        let torrent = this.props.torrent;
        this.clipBoardMagnet = new ClipBoard(`.clip-magnet${torrent.infoHash}`);
        this.clipBoardMagnet.on('success', TransCard.handleClip);
        this.clipBoardDownloadLink = new ClipBoard(`.clip-download-link${torrent.infoHash}`);
        this.clipBoardDownloadLink.on('success', TransCard.handleClip);
        this.clipBoardURLAndMagnet = new ClipBoard(`.clip-url-magnet${torrent.infoHash}`);
        this.clipBoardURLAndMagnet.on('success', TransCard.handleClip);
    }

    componentWillUnmount() {
        this.clipBoardMagnet.destroy();
        this.clipBoardDownloadLink.destroy();
        this.clipBoardURLAndMagnet.destroy();
    }

    render() {
        let torrent = this.props.torrent;
        let {uploadSpeed, downloadSpeed, numPeers, uploaded, downloaded, progress} = torrent;
        let {type, onRemove} = this.props;

        //取得文件列表中最大的文件作为主标题
        let title = "";
        let maxLength = 0;
        let totalLength = 0;
        torrent.files.forEach(file => {
            totalLength += file.length;
            if (file.length > maxLength) {
                maxLength = file.length;
                title = file.name;
            }
        });

        if (torrent.files.length > 0)
            title = torrent.files[0].name;
        let myTagBg;
        if (type === 'download') {
            myTagBg = {
                backgroundColor: BaseColor.tag_color_3,
            }
        } else {
            myTagBg = {
                backgroundColor: BaseColor.tag_color_2,
            }
        }

        return (
            <TransCardBody {...this.props}>
                <MyTag style={myTagBg}>
                    {
                        type === 'download' ?
                            <Icon type="cloud-download-o"/>
                            :
                            <Icon type="cloud-upload-o"/>
                    }
                </MyTag>
                <TransCardContent id={'display-body'}>
                    <Title>
                        {`${title} 等共${torrent.files.length}个文件,总大小为${prettyBytes(totalLength)}`}
                    </Title>
                    <p>
                        <Tooltip placement="topLeft"
                                 title="复制磁力链接发送给其他用户，其他用户打开本网站，输入磁力链接点击下载即可（注意：分享文件的用户在对方接收完毕之前不要关闭本网站，会导致传输中断）"
                                 arrowPointAtCenter>
                            <a href="javascript:void(0);" className={`clip-magnet${torrent.infoHash}`}
                               data-clipboard-text={torrent.magnetURI}>[复制磁力链接]</a>
                        </Tooltip>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <Tooltip placement="topLeft"
                                 title="复制提取码发送给其他用户，其他用户打开本网站，输入提取码点击下载即可（注意：分享文件的用户在对方接收完毕之前不要关闭本网站，会导致传输中断）"
                                 arrowPointAtCenter>
                            <a href="javascript:void(0);" className={`clip-url-magnet${torrent.infoHash}`}
                               data-clipboard-text={torrent.code}>[{`复制提取码: ${torrent.code}`}]</a>
                        </Tooltip>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <Tooltip placement="topLeft"
                                 title="复制下载链接发送给其他用户，其他用户点击链接就会开始下载。（这种方式添加下载可能需要额外的解析时间，下载的时候请耐心等待）">
                            <a href="javascript:void(0);" className={`clip-download-link${torrent.infoHash}`}
                               data-clipboard-text={`${document.location.origin}${document.location.pathname}#${torrent.code ? torrent.code : torrent.infoHash}`}>[复制下载链接]</a>
                        </Tooltip>
                    </p>
                    <Tooltip placement={'left'} title={'可预览视频(MP4)、图片、PDF、MP3（其中视频和音乐可以边下载边播放，图片和PDF需下载完成方可预览）'}>
                        <OperatorButton onClick={this.onDisplayClick}>
                            预览
                        </OperatorButton>
                    </Tooltip>
                    {
                        true && +progress === 1 ?
                            <Tooltip placement={'right'} title={'将下载完的文件保存至本地'}>
                                <OperatorButton onClick={this.downloadFileToLocal}>
                                    保存到本地
                                </OperatorButton>
                            </Tooltip>
                            :
                            ''
                    }
                    <ItemTags>
                        <Tag color={BaseColor.tag_color_2}>上传速度：{getFormatSpeed(uploadSpeed)}</Tag>
                        <Tag color={BaseColor.tag_color_3}>下载速度：{getFormatSpeed(downloadSpeed)}</Tag>
                        <Tag color={BaseColor.tag_color_1}>总上传：{prettyBytes(uploaded)}</Tag>
                        <Tag color={BaseColor.tag_color_4}>总下载：{prettyBytes(downloaded)}</Tag>
                        <Tag color={BaseColor.tag_color_2}>连接节点数：{numPeers}</Tag>
                    </ItemTags>

                    <DisplayModal
                        id={'what'}
                        width={'80%'}
                        visible={this.state.visible}
                        footer={null}
                        onCancel={this.onCancel}
                        destroyOnClose={true}
                    >
                        <DisplayContent style={{
                            padding: '20px'
                        }} id={'display'}>
                        </DisplayContent>
                    </DisplayModal>
                </TransCardContent>
                <ProgressBody>
                    {
                        type === 'download' ?
                            <Progress type="circle" percent={(+progress * 100).toFixed(1)} width={40}/>
                            :
                            ''
                    }
                </ProgressBody>

                <Tooltip placement="topLeft" title="移除将会终止传输" arrowPointAtCenter>
                    <RemoveIcon type={'close'} onClick={() => {
                        onRemove(this.props.torrent);
                    }}/>
                </Tooltip>

            </TransCardBody>
        )
    }
}

TransCard.propTypes = {
    torrent: PropTypes.shape({
            uploadSpeed: PropTypes.number,
            downloadSpeed: PropTypes.number,
            downloaded: PropTypes.number,
            uploaded: PropTypes.number,
            numPeers: PropTypes.number,
            files: PropTypes.array,
            progress: PropTypes.number,
        }
    ),
    type: PropTypes.oneOf(['download', 'upload']),
    onRemove: PropTypes.func,
};

TransCard.defaultProps = {
    type: 'download',
    torrent: {
        uploadSpeed: 0,
        downloadSpeed: 0,
        downloaded: 0,
        uploaded: 0,
        numPeers: 0,
        progress: 0,
        files: [{
            name: 'title',
            length: 5,
        }]
    },
    onRemove: () => {

    },

};

export default TransCard;