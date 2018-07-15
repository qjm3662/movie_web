import React from 'react';
import Anchor from 'antd/lib/anchor';
import styled from 'styled-components';
import {
    LittleToolItem
} from '../index'
import {
    CloudServerConfig
} from '../../config/server-info-config';
import BackTop from 'antd/lib/back-top';
import Icon from 'antd/lib/icon';
import LocalRouter from "../../LocalRouter";
import Tooltip from 'antd/lib/tooltip';

const {Link} = Anchor;


const LittleToolBody = styled.div`
    display: flex;
    flex-direction: row;
    padding: 30px 50px;
    width: 100%;
`;

const AnchorBody = styled.div`
    background-color: #fff0
    flex-grow: 0;
`;

const LittleToolContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;


const CategoryItem = styled.div`
    display: flex;
    flex-direction: column; 
`;

const CategoryItemTitle = styled.a`
    width: 100%;
    font-size: 1.4em;
    font-weight: bold;
    text-align: center;
    margin: 20px 0;
`;

const CategoryItemContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;

const AddIcon = styled(Icon)`
    font-size: 1.6em;
    margin: 10px;
    cursor: pointer;
`;

class LittleToolComponent extends React.Component {

    componentDidMount() {
        let {initAllWebsites, category} = this.props;
        initAllWebsites(category);
    }

    render() {
        let {category, isMobile} = this.props;
        let Links = category.map(category => {
            return <Link key={category} href={`#${category}`} title={category}/>
        });
        let contents = category.map(category => {
            let websites = this.props[category];
            let websiteItems = websites.map(website => {
                return <LittleToolItem width={isMobile ? 80 : 200} key={website.website} resource={website}
                                       onClick={() => {
                                           window.open(website.website);
                                       }} isMobile={isMobile} staticPath={CloudServerConfig.STATIC_URL}/>
            });
            return websiteItems.length > 0 ?
                <CategoryItem key={category}>
                    <CategoryItemTitle id={category}>{category}</CategoryItemTitle>
                    <CategoryItemContent>
                        {websiteItems}
                    </CategoryItemContent>
                </CategoryItem>
                :
                '';
        });
        return (
            <LittleToolBody>
                <BackTop/>
                <LittleToolContent id={'scroll-content'}>
                    {contents}
                </LittleToolContent>
                {
                    isMobile ?
                        ''
                        :
                        <AnchorBody>
                            <Anchor style={{
                                backgroundColor: '#fff0',
                            }} offsetTop={50}>
                                {Links}
                                <Tooltip title={'点此分享你的小珍藏'} placement={'left'}>
                                    <AddIcon type={'edit'} onClick={() => {
                                        this.props.history.push(LocalRouter.SHARE_WEBSITE)
                                    }}/>
                                </Tooltip>
                            </Anchor>


                        </AnchorBody>
                }
            </LittleToolBody>
        );
    }
}

export default LittleToolComponent;