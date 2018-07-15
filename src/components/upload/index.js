import React from 'react';

import Upload from 'rc-upload';
import Icon from 'antd/lib/icon';
import styled from 'styled-components';
import ToolTip from 'antd/lib/tooltip';
import {
    T1,
    BaseColor,
    BaseHoverFloatDiv,
} from '../base/base-component';
import {
    CloudServerAPI,
    getCloudServerAxios, IntranetServerAPI
} from '../../config/API';
import {
    getMD5
} from '../../tool/md5';
import UploadCard from './upload-card';
import QueueAnim from 'rc-queue-anim';
import BackTop from 'antd/lib/back-top';


// const Dragger = Upload.Dragger;

const UploadPage = styled.div`
    padding: 30px 50px;
    display: flex;
    align-items: center;
    justify-content:center;
    width: 100%;
    flex-direction: column;
`;

const UploadBody = styled(BaseHoverFloatDiv)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: ${BaseColor.color_apptheme};
    color: white;
    border-radius: 10px;
    max-height: 300px;
    max-width: 500px;
    padding: 50px;
`;

const props = {
    name: 'file',
    multiple: true,
    action: IntranetServerAPI.UPLOAD_FILE.url,
    showUploadList: false,
};

const UploadListBody = styled(QueueAnim)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 80%;
`;

class UploadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.uploader = React.createRef();
    }

    beforeUpload(file, fileList) {
        let {addFile} = this.props;
        file.percent = 0;
        addFile(file);
        return new Promise((resolve, reject) => {
            getMD5(file)
                .then(md5 => {
                    getCloudServerAxios(axios => {
                        axios.get(`${CloudServerAPI.JUDGE_MD5.api}?${CloudServerAPI.JUDGE_MD5.PARAM_MD5}=${md5}`)
                            .then(res => {
                                if (res.data.data.exist) {
                                    let {addFile} = this.props;
                                    file.response = res;
                                    file.percent = 100;
                                    addFile(file);
                                    reject();
                                } else {
                                    resolve();
                                }
                            })
                            .catch(err => {
                                reject(err);
                            })
                    });
                })
                .catch(err => {
                    reject(err)
                });
        });
    }

    onChange(info) {
        let {file} = info;
        let {addFile} = this.props;
        addFile(file);
    }

    onRemove(file) {
        this.uploader.abort(file);
        let {removeFile} = this.props;
        removeFile(file);
    }

    async onProgress(progressEvent, file){
        let {addFile} = this.props;
        file.percent = progressEvent.percent;
        addFile(file);
    }

    render() {
        props.onChange = this.onChange;
        props.beforeUpload = this.beforeUpload;
        let {
            fileList
        } = this.props;

        let uploadItems = fileList.map(file => {
            return <UploadCard key={file.uid} file={file} onRemove={this.onRemove} onClick={() => {
                if(!!file.response)
                    this.props.history.push(`/detail/${file.response.data.data.movie.id}`);
            }}/>
        });
        return (
            <UploadPage>
                <BackTop/>
                <T1>SHARE FIRST</T1>
                <ToolTip placement={'left'} title={'上传成功之后便可以在站内资源检索到您分享的资源'}>
                    <ToolTip placement={'right'} title={'声明：分享的文件会被上传到资源社区，所有用户都能获取~'}>
                        <Upload {...props} ref={instance => {
                            this.uploader = instance;
                        }} style={{
                            outline: '0 none'
                        }} onProgress={this.onProgress}>
                            <UploadBody>
                                <Icon type="inbox" style={{
                                    fontSize: '2em',
                                    marginBottom: '10px',
                                }}/>
                                <span style={{
                                    fontSize: '1.8em',
                                    textAlign: 'center',
                                }}>点击此处或拖拽到此上传</span>
                                <span style={{
                                    textAlign: 'center',
                                }}>上传过程中请不要切换到本站点的其他功能模块，否则传输过程会中断</span>
                            </UploadBody>
                        </Upload>

                    </ToolTip>
                </ToolTip>
                <UploadListBody>
                    {uploadItems}
                </UploadListBody>
            </UploadPage>
        )
    }
}

export default UploadComponent;