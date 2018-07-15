import React from 'react';
// import InfiniteScroll from 'react-infinite-scroller';
import Tabs from 'antd/lib/tabs';
import BackTop from 'antd/lib/back-top';
import styled from 'styled-components';
import {
    withRouter
} from 'react-router-dom';
import Spin from 'antd/lib/spin';
import {
    ResourceItem,
    LittleToolItem,
} from '../index'
import {
    CloudServerAPI
} from '../../config/API';

const TabPane = Tabs.TabPane;


const SearchResultBody = styled.div`
    padding: 30px 50px;
`;
const ItemsBody = styled.div`
    display: flex;
    flex-wrap: wrap;
`;


class SearchResultComponent extends React.Component {
    constructor(props) {
        super(props);
        this.createItems = this.createItems.bind(this);
    }


    createItems(items, hasMore, loading, loadMore, key) {
        return <TabPane tab={key} key={key}>
            <ItemsBody
                pageStart={0}
                loadMore={loadMore}
                hasMore={hasMore && !loading}       //如果还有更多的数据，并且不处于加载状态就会继续加载更多
            >
                {items}
            </ItemsBody>
            {loading ? <Spin style={{
                width: '100%',
                margin: '0 auto',
            }} tip={'Loading...'}/> : ''}
        </TabPane>
    }

    loadData(){
        let {loadMore, match} = this.props;
        let {keywords} = match.params;
        loadMore(0, CloudServerAPI.QUERY_RESOURCE.CATEGORY, keywords);
        loadMore(0, CloudServerAPI.QUERY_WEBSITE.CATEGORY, keywords);
    }



    render() {
        let {resourceItems, resourceHasMore,
            websiteItems, websiteHasMore,
            loadMore, loading,
            isMobile, activityTabKey,
            changeTab, match, keywords} = this.props;
        if(keywords !== match.params.keywords)      //每次关键字变化就加载数据
            this.loadData();
        let ris = resourceItems.map((movie, index) => {
            return <ResourceItem width= {isMobile ? 80 : 200} key={movie.id} resource={movie} onClick={() => {
                this.props.history.push(`/detail/${movie.id}`)
            }} isMobile={isMobile} staticPath/>
        });
        let wis = websiteItems.map(website => {
            return <LittleToolItem width={isMobile ? 80 : 200} key={website.website} resource={website}
                                   onClick={() => {
                                       window.open(website.website);
                                   }}
                                   isMobile={isMobile}/>
        });
        let ResourceItems = this.createItems(ris, resourceHasMore, loading, page => {
            loadMore(page, CloudServerAPI.QUERY_RESOURCE.CATEGORY, keywords)
        }, '资源');

        let WebsiteItems = this.createItems(wis, websiteHasMore, loading, page => {
            loadMore(page, CloudServerAPI.QUERY_WEBSITE.CATEGORY, keywords);
        }, '网站');

        return (
            <SearchResultBody>
                <BackTop/>
                <Tabs tabPosition={isMobile ? 'top' : 'left'} type={'line'} onTabClick={changeTab} activeKey={activityTabKey}>
                    {ResourceItems}
                    {WebsiteItems}
                </Tabs>
            </SearchResultBody>

        );
    }
}

export default withRouter(SearchResultComponent);