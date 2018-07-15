import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import {
    IntranetServerConfig
} from '../../config/server-info-config';
import {
    getIconByMIME
} from '../../tool/icon-tool';
import {
    T1,
} from '../../components/base/base-component';
import {BaseColor} from "../base/base-component";
import Tag from 'antd/lib/tag';
import Button from 'antd/lib/button';
import prettyBytes from "pretty-bytes";
import Moment from 'moment';
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import ClipBoard from 'clipboard';
import message from "antd/lib/message/index";

const radius = '8px';

const DetailBody = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px 50px;
`;

const TransCardBody = styled.div`
    border-radius: ${radius};
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 20px;
`;

const CardImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${radius};
    background-size: cover;
    margin: 10px 0;
`;

const CardTitle = styled.p`
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
`;
const ItemTags = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-warp: wrap;
    width: 100%;
`;

const OperatorButtons = styled.div`
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const OperatorButton = styled(Button)`
    margin: 5px;
    font-size: 0.5em;
`;


const MovieBody = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const MovideMainInfo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const MovieIntroduction = styled.span`
    margin-left: 10px;
`;

class DetailComponent extends React.Component {

    static handleClip(e) {
        message.success('成功复制到剪切板');
        e.clearSelection();
    }

    componentDidMount() {
        let {match, getResourceById} = this.props;
        this.copyBoardMagnet = new ClipBoard(`#copy-magnet`);
        this.copyBoardMagnet.on('success', DetailComponent.handleClip);
        this.copyBordDownloadLink = new ClipBoard('#copy-download-link');
        this.copyBordDownloadLink.on('success', DetailComponent.handleClip);
        getResourceById(match.params.id);
    }

    componentWillUnmount() {
        this.copyBoardMagnet.destroy();
        this.copyBordDownloadLink.destroy();
    }

    componentDidUpdate() {
        let resource = this.props.resource;
        if (!resource.dp) {
            const gitalk = new Gitalk({
                clientID: '18173fd8605b5c387012',
                clientSecret: '680864c20e99ef281b12c427818e88a5d0383031',
                repo: 'movie_web',
                owner: 'SunnyQjm',
                admin: ['SunnyQjm'],
                id: resource.id,      // Ensure uniqueness and length less than 50
                distractionFreeMode: true  // Facebook-like distraction free mode
            });
            gitalk.render('comments');
        }
    }

    render() {
        let resource = this.props.resource;
        let {movieName, size, createAt, mime, downloadPath, percent, cover} = resource;
        let {width, isMobile} = this.props;
        let cardImageStyle = {
            width: width,
            height: width,
            borderStyle: 'none',
        };

        let cardImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6x0qGQamxaiAtVE-O8L5LVkC5wrT8Fe9AmKiJfk8bOpCj5mxZ4Q';
        if (cover) {
            cardImage = cover.startsWith('http') ? cover : IntranetServerConfig.STATIC_URL + cover;
            cardImageStyle.backgroundImage = `url(${cardImage})`;
        } else {
            cardImageStyle.backgroundColor = 'white';
        }
        let commentsStyle = {
            width: '800px',
        };
        if (isMobile) {
            commentsStyle.width = '100%';
        }

        let movieBodyStyle = {};
        if (isMobile) {
            movieBodyStyle.flexDirection = 'column';
        }
        //取得文件列表中最大的文件作为主标题
        return (
            <DetailBody>
                <T1 style={{
                    margin: '0 auto',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}>RESOURCE DETAIL</T1>
                <TransCardBody {...this.props}>
                    <MovieBody style={movieBodyStyle}>
                        <MovideMainInfo>
                            <CardImage style={cardImageStyle}>
                                {
                                    !!cover ?
                                        ''
                                        :
                                        <img src={getIconByMIME(mime)} alt="" style={{
                                            width: width,
                                            height: width,
                                        }}/>
                                }
                            </CardImage>
                            {!(resource && !!resource.introduction) ?
                                <CardTitle> {movieName}</CardTitle>
                                :
                                ''
                            }
                        </MovideMainInfo>
                        <MovieIntroduction>
                            {resource && !!resource.introduction ?
                                <CardTitle> {movieName}</CardTitle>
                                :
                                ''
                            }
                            {resource && !!resource.introduction ?
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                :
                                ''}
                            {resource ? resource.introduction : ''}
                        </MovieIntroduction>
                    </MovieBody>
                    <ItemTags>
                        <Tag color={BaseColor.tag_color_3}>{new Moment(resource.createAt).format('YYYY-MM-DD')}</Tag>
                        <Tag color={BaseColor.tag_color_2}>{prettyBytes(resource.size ? resource.size : 0)}</Tag>
                        {
                            resource.isDownload ?
                                <Tag color={BaseColor.tag_color_1}>有资源</Tag>
                                :
                                <Tag color={BaseColor.lightGray}>无资源</Tag>

                        }
                    </ItemTags>
                    <OperatorButtons>
                        <OperatorButton disabled={!resource.isDownload}><a
                            href={IntranetServerConfig.STATIC_URL + resource.downloadPath}
                            download={movieName}>预览或下载</a></OperatorButton>
                        <OperatorButton id={'copy-magnet'} disabled={!resource.isDownload}
                                        data-clipboard-text={IntranetServerConfig.STATIC_URL + resource.downloadPath}>复制下载链接</OperatorButton>
                        <OperatorButton id={'copy-download-link'}
                                        disabled={(!resource.torrents || resource.magnets.length === 0)}
                                        data-clipboard-text={resource.magnets && resource.magnets.length > 0 && resource.magnets[0]}>复制磁力链接</OperatorButton>
                    </OperatorButtons>
                </TransCardBody>
                <div id={'comments'} style={commentsStyle}/>
            </DetailBody>
        )
    }
}

DetailComponent.propTypes = {
    resource: PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
            createAt: PropTypes.number,
            mime: PropTypes.string,
        }
    ),
    width: PropTypes.number,
};

DetailComponent.defaultProps = {
    resource: {
        movieName: '',
        size: 0,
        createAt: 0,
        mime: '',
        dp: true,
    },
    width: 100,
};

export default DetailComponent;