import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Tabs from 'antd/lib/tabs';
import BackTop from 'antd/lib/back-top';
import styled from 'styled-components';
import {
    withRouter
} from 'react-router-dom';
import {
    T1
} from '../base/base-component';
import Spin from 'antd/lib/spin';
import {
    ResourceItem
} from '../index'
import {
    CloudServerAPI
} from '../../config/API';

const TabPane = Tabs.TabPane;
const HomeBody = styled.div`
    padding: 30px 50px;
`;
const ItemsBody = styled(InfiniteScroll)`
    display: flex;
    flex-wrap: wrap;
`;


class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.createItems = this.createItems.bind(this);
    }

    createItems(items, hasMore, loading, loadMore, key, isMobile) {
        let Items = items.map((movie, index) => {
            return <ResourceItem width= {isMobile ? 80 : 200} key={movie.id} resource={movie} onClick={() => {
                this.props.history.push(`/detail/${movie.id}`)
            }} isMobile={isMobile} />
        });

        return <TabPane tab={key} key={key}>
            <ItemsBody
                pageStart={0}
                loadMore={page => {
                    loadMore(page, true, true, CloudServerAPI.GET_MOVIES.TYPE_VIDEO)
                }}
                hasMore={hasMore && !loading}       //如果还有更多的数据，并且不处于加载状态就会继续加载更多
            >
                {Items}
            </ItemsBody>
            {loading ? <Spin style={{
                width: '100%',
                margin: '0 auto',
            }} tip={'Loading...'}/> : ''}
        </TabPane>
    }

    render() {
        let {allItems, allHasMore,
            videoItems, videoHasMore,
            audioItems, audioHasMore,
            imageItems, imageHasMore,
            applicationItems, applicationHasMore,
            loadMore, loading,
            isMobile, activityTabKey,
            changeTab,} = this.props;
        let AllItems = this.createItems(allItems, allHasMore, loading, page => {
            loadMore(page, true, true)
        }, '所有资源', isMobile);

        let VideoItems = this.createItems(videoItems, videoHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.TYPE_VIDEO);
        }, '视频', isMobile);

        let AutioItems = this.createItems(audioItems, audioHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.TYPE_AUDIO);
        }, '音频', isMobile);

        let ImageItems = this.createItems(imageItems, imageHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.TYPE_IMAGE);
        }, '图片', isMobile);

        let ApplicationItems = this.createItems(applicationItems, applicationHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.TYPE_APPLICATION);
        }, '文档', isMobile);


        return (
            <HomeBody>
                <BackTop/>
                <T1 style={{
                    margin: '0 auto',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}>RESOURCE CENTER</T1>
                <Tabs tabPosition={isMobile ? 'top' : 'left'} type={'line'} onTabClick={changeTab}
                      className={'what'}
                      activeKey={activityTabKey}>
                    {AllItems}
                    {VideoItems}
                    {AutioItems}
                    {ImageItems}
                    {ApplicationItems}
                </Tabs>
            </HomeBody>

        );
    }
}

export default withRouter(HomeComponent);