import React from 'react';
import styled from 'styled-components';
import WebTorrent from 'webtorrent';
import thunky from 'thunky';
import {
    BaseAppThemeButton,
    BaseColor,
    T1
} from '../base/base-component';
import TransCard from './trans-card';
import Input from 'antd/lib/input';
import Tag from 'antd/lib/tag';
import prettyBytes from 'pretty-bytes';
import createTorrent from 'create-torrent';
import message from 'antd/lib/message';
import ToolTip from 'antd/lib/tooltip';
import BackTop from 'antd/lib/back-top';
import QueueAnim from 'rc-queue-anim';
import {
    getCloudServerAxios,
    CloudServerAPI,
} from '../../config/API';
import axios from 'axios';


global.WEBTORRENT_ANNOUNCE = createTorrent.announceList
    .map(function (arr) {
        return arr[0]
    })
    .filter(function (url) {
        return url.indexOf('wss://') === 0 || url.indexOf('ws://') === 0
    });


const {
    Search
} = Input;

const getClient = thunky(cb => {
    getRtcConfig((err, rtcConfig) => {
        let client;
        if (err)
            client = new WebTorrent();
        else {
            client = new WebTorrent({
                tracker: {
                    rtcConfig: rtcConfig
                }
            })
        }
        cb(client)
    });
    cb(new WebTorrent());
});

getClient(client => {

    client.on('error', err => {
        console.log(err);
    });

    client.on('warning', msg => {
        console.log(msg);
    })
});

function getRtcConfig(cb) {
    axios.get('https://instant.io/__rtcConfig__')
        .then(response => {
            let rtcConfig = response.data;
            delete rtcConfig.comment;
            cb(null, rtcConfig);
        })
        .catch(err => {
            console.log(err);
        });
}

const ShareButton = styled(BaseAppThemeButton)`
    width: 150px;
    height: 150px;
    border-radius: 150px;
    font-size: 2em;
    display: inline-block;
`;

const DownloadInput = styled(Search)`
    margin-top: 20px;
    max-width: 500px;
`;

const P2pBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 50px;
`;

const FileInput = styled.input`
    width: 0;
    height: 0;
    opacity: 0;
`;

const GlobalTags = styled.div`
    margin-top: 20px;
`;


const TransCardsBody = styled.div`
    margin-top: 20px;
`;

function getFormatSpeed(rawBytes) {
    if (!rawBytes)
        rawBytes = 0;
    return prettyBytes(rawBytes) + " / s";
}

class P2pShareComponent extends React.Component {
    constructor(props) {
        super(props);
        this.inputFile = React.createRef();
        this.inputMagnet = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.onDownload = this.onDownload.bind(this);
        this.downloadByTorrentId = this.downloadByTorrentId.bind(this);
    }

    /**
     * 处理文件选择
     * 将选中的文件seed
     * @param event
     */
    handleChange(event) {
        let {addTorrent} = this.props;
        let files = this.inputFile.files;
        if (files) {
            message.success('正在准备分享文件...');
            getClient(client => {
                client.seed(files, torrent => {
                    message.destroy();
                    torrent.myType = 'upload';
                    addTorrent(torrent);
                });
            })
        }
    }

    downloadByTorrentId(value) {
        let {addTorrent} = this.props;
        if (value.length === 4) {     //用提取码下载
            getCloudServerAxios(axios => {
                axios.get(`${CloudServerAPI.GET_ID.api}?${CloudServerAPI.GET_ID.PARAM_CODE}=${value}`)
                    .then(res => {
                        if (res.data.code === 0 && !!res.data.data) {
                            getClient(client => {
                                message.success('正在尝试下载文件...');
                                client.add(res.data.data, torrent => {
                                    torrent.myType = 'download';
                                    addTorrent(torrent);
                                    message.destroy();
                                    torrent.on('error', function (err) {
                                        console.log(err);
                                    });
                                })
                            })
                        } else {
                            message.error('无效的提取码')
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        message.error('无效的提取码')
                    })
            });
        } else {
            getClient(client => {
                message.success('正在尝试下载文件...');
                client.add(value, torrent => {
                    torrent.myType = 'download';
                    addTorrent(torrent);
                    message.destroy();
                    torrent.on('error', function (err) {
                        console.log(err);
                    });
                })
            })
        }

    }

    onDownload(value) {
        //清空输入框中的磁力链接
        this.inputMagnet.input.input.value = '';
        this.downloadByTorrentId(value);
    }

    componentDidMount() {
        let hash = document.location.hash;
        //去掉第一个HashRouter生成的#
        hash = hash.substring(1);
        if (hash) {
            this.downloadByTorrentId(hash);
        }
        // 周期性更新界面的信息，实时监控
        let {updateClientInfo} = this.props;
        this.intervalId = setInterval(() => {
            getClient(client => {
                updateClientInfo(client);
            })
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        let {torrents, removeTorrent} = this.props;
        let transCards = torrents.map(torrent => {
            return <TransCard key={torrent.infoHash} type={torrent.myType} torrent={torrent} onRemove={torrent => {
                getClient(client => {
                    client.remove(torrent.magnetURI);
                });
                //可以让其从列表消失
                removeTorrent(torrent);
            }}/>
        });
        let {downloadSpeed, uploadSpeed} = this.props.client;
        return (
            <P2pBody>
                <BackTop/>
                <T1>P2P SHARE</T1>
                <ToolTip placement={'right'} title={'选择文件分享，将生成的磁力链接发送给好友，即可开始传输文件。（传输过程中请保持本页面不关闭，越多人下载，下载的速度会越快）'}>
                    <ToolTip placement={'left'} title={'注意：大于800M的文件可能无法传输'}>
                        <ShareButton onClick={() => {
                            this.inputFile.click();
                        }}>分享
                        </ShareButton>
                    </ToolTip>
                </ToolTip>
                <ToolTip placement={'left'} title={'请输入有效的磁力链接，成功下载到种子文件后会在列表中显示（无效的磁力链接，或者下载不到种子文件的链接，将不会在列表中显示）'}>
                    <DownloadInput
                        placeholder="在此输入磁力链接或下载码"
                        enterButton="下载"
                        size="large"
                        onSearch={this.onDownload}
                        innerRef={instance => this.inputMagnet = instance}
                    />
                </ToolTip>
                <FileInput type="file" innerRef={instance => this.inputFile = instance}
                           onChange={this.handleChange} multiple/>
                <GlobalTags>
                    <Tag color={BaseColor.tag_color_2}>总上传速度：{getFormatSpeed(uploadSpeed)}</Tag>
                    <Tag color={BaseColor.tag_color_3}>总下载速度：{getFormatSpeed(downloadSpeed)}</Tag>
                </GlobalTags>
                <TransCardsBody>
                    <QueueAnim>
                        {transCards}
                    </QueueAnim>
                </TransCardsBody>
            </P2pBody>
        );
    }
}

export default P2pShareComponent;