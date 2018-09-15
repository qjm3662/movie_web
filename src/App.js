import React, {Component} from 'react';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import {enquireScreen} from 'enquire-js';       //用于做手机屏幕适配
import './config/axios-config';         //导入axios配置

import {
    Router,
    Route,
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

import {
    Provider
} from 'react-redux';
import {
    HeaderContainer,
    FooterContainer,
    HomeContainer,
    P2pShareContainer,
    UploadContainer,
    DetailContainer,
    VideoContainer,
    LittleToolContainer,
    SearchResultContainer,
    ShareWebsiteContainer,
} from './containers'
import {
    VertifyGitmentComponent,
} from './components';
import store from './store';
import styled from 'styled-components';
import LocalRouter from './LocalRouter'

import Layout from 'antd/lib/layout'


const {Content} = Layout;
const AppBody = styled(Layout)`
`;

const MyContent = styled(Content)`
`;

let isMobile = false;
enquireScreen((b) => {
    isMobile = !!b;
});

function withPropsComponent(Component, setProps) {
    return props => {
        return <Component {...props} {...setProps}/>
    }
}

const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});


class App extends Component {


    componentDidMount() {
        // 适配手机屏幕;
        enquireScreen((b) => {
            this.setState({isMobile: !!b});
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Router
                    basename={process.env.PUBLIC_URL}
                    history={history}
                >
                    <AppBody style={{
                        minHeight: '100%',
                    }}>
                        <HeaderContainer isMobile={isMobile} history={history}/>
                        <MyContent>
                            <Route key={'a'} exact path={LocalRouter.HOME} component={withPropsComponent(HomeContainer, {
                                isMobile: isMobile
                            })}/>
                            <Route key={'b'} path={LocalRouter.UPLOAD} component={withPropsComponent(UploadContainer, {
                                isMobile: isMobile
                            })}/>
                            {/*<Route key={'c'} path={LocalRouter.P2P_SHARE}*/}
                                   {/*component={withPropsComponent(P2pShareContainer, {*/}
                                       {/*isMobile: isMobile,*/}
                                   {/*})}/>*/}
                            <Route key={'d'} path={`${LocalRouter.RESOURCE_DETAIL}/:id`}
                                   component={withPropsComponent(DetailContainer, {
                                       isMobile: isMobile,
                                   })}/>
                            <Route key={'e'} path={`${LocalRouter.VERTIFY_GITMENT}`}
                                   component={withPropsComponent(VertifyGitmentComponent, {
                                       isMobile: isMobile,
                                   })}/>
                            <Route key={'f'} path={`${LocalRouter.VIDEO}`} component={withPropsComponent(VideoContainer, {
                                isMobile: isMobile,
                            })}/>
                            <Route key={'g'} path={`${LocalRouter.LITTLE_TOOL}`}
                                   component={withPropsComponent(LittleToolContainer, {
                                       isMobile: isMobile,
                                   })}/>
                            <Route key={'h'} path={`${LocalRouter.SEARCH_RESULT}/:keywords`}
                                   component={withPropsComponent(SearchResultContainer, {
                                       isMobile: isMobile,
                                   })}/>

                            {/*<Route key={'i'} path={`${LocalRouter.SHARE_WEBSITE}`}*/}
                                   {/*component={withPropsComponent(ShareWebsiteContainer, {*/}
                                       {/*isMobile: isMobile,*/}
                                   {/*})}/>*/}
                        </MyContent>
                        <FooterContainer/>
                    </AppBody>
                </Router>
            </Provider>
        );
    }
}

export default App;
