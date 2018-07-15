import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Tabs from 'antd/lib/tabs';
import BackTop from 'antd/lib/back-top';
import styled from 'styled-components';
import {
    withRouter
} from 'react-router-dom';
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


class VideoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.createItems = this.createItems.bind(this);
    }

    createItems(items, hasMore, loading, loadMore, key, isMobile) {
        let Items = items.map((movie, index) => {
            return <ResourceItem width={isMobile ? 80 : 200} key={movie.id} resource={movie} onClick={() => {
                console.log('onClick');
                this.props.history.push(`/detail/${movie.id}`)
            }} isMobile={isMobile}/>
        });

        let itemsBodyStyle = {};
        return <TabPane tab={key} key={key}>
            <ItemsBody
                pageStart={0}
                loadMore={page => {
                    loadMore(page, true, true, CloudServerAPI.GET_MOVIES.TYPE_VIDEO)
                }}
                hasMore={hasMore && !loading}       //如果还有更多的数据，并且不处于加载状态就会继续加载更多
                style={itemsBodyStyle}
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
        let {
            allItems, allHasMore,
            actItems, actHashMore,
            loveItems, loveHasMore,
            thrillerItems, thrillerHasMore,
            adventureItems, adventureHasMore,
            scienceFictionItems, scienceFictionHasMore,
            loadMore, loading,
            isMobile, activityTabKey,
            changeTab,
            years
        } = this.props;
        let AllItems = this.createItems(allItems, allHasMore, loading, page => {
            loadMore(page, true, true)
        }, '所有视频', isMobile);

        let ActItems = this.createItems(actItems, actHashMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.CATEGORY_ACT);
        }, '动作', isMobile);

        let LoveItems = this.createItems(loveItems, loveHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.CATEGORY_LOVE);
        }, '爱情', isMobile);
        //
        let ThrillerItems = this.createItems(thrillerItems, thrillerHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.CATEGORY_THRILLER);
        }, '惊悚', isMobile);

        let AdventureItems = this.createItems(adventureItems, adventureHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.CATEGORY_ADVENTURE);
        }, '冒险', isMobile);

        let ScienceFictionItems = this.createItems(scienceFictionItems, scienceFictionHasMore, loading, page => {
            loadMore(page, true, true, CloudServerAPI.GET_MOVIES.CATEGORY_SCIENCE_FICTION);
        }, '科幻', isMobile);

        let YearsItems = years.map(year => {
           return this.createItems(this.props[`year${year}_items`], this.props[`year${year}_hasMore`], loading, page => {
               loadMore(page, true, true, CloudServerAPI.GET_MOVIES.CATEGORY_YEAR, year);
           }, year, isMobile);
        });
        return (
            <HomeBody>
                <BackTop/>
                <Tabs tabPosition={isMobile ? 'top' : 'left'} type={'line'} onTabClick={changeTab}
                      activeKey={activityTabKey}>
                    {AllItems}
                    <TabPane tab={'类别'} key={'类别'}>
                        <Tabs tabPosition={'top'} type={'card'}>
                            {ActItems}
                            {LoveItems}
                            {ThrillerItems}
                            {AdventureItems}
                            {ScienceFictionItems}
                        </Tabs>
                    </TabPane>
                    <TabPane tab={'时间'} key={'时间'}>
                        <Tabs tabPosition={'top'} type={'card'}>
                            {YearsItems}
                        </Tabs>
                    </TabPane>
                </Tabs>
            </HomeBody>

        );
    }
}

export default withRouter(VideoComponent);