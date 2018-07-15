import {
    LoadingComponent
} from '../components';
import Loadable from 'react-loadable';

// const HeaderContainer = Loadable({
//     loader: () => import('./header'),
//     loading: LoadingComponent
// });
import HeaderContainer from './header';
// const FooterContainer = Loadable({
//     loader: () => import('./footer'),
//     loading: LoadingComponent
// });
import FooterContainer from './footer';

const HomeContainer = Loadable({
    loader: () => import('./home'),
    loading: LoadingComponent
});
const P2pShareContainer = Loadable({
    loader: () => import('./p2p-share'),
    loading: LoadingComponent
});
const UploadContainer = Loadable({
    loader: () => import('./upload'),
    loading: LoadingComponent
});
const DetailContainer = Loadable({
    loader: () => import('./detail'),
    loading: LoadingComponent
});
const VideoContainer = Loadable({
    loader: () => import('./video'),
    loading: LoadingComponent
});
const LittleToolContainer = Loadable({
    loader: () => import('./little-tool'),
    loading: LoadingComponent
});
const SearchResultContainer = Loadable({
    loader: () => import('./search-result'),
    loading: LoadingComponent
});
const ShareWebsiteContainer = Loadable({
    loader: () => import('./share-website'),
    loading: LoadingComponent
});

export {
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
}