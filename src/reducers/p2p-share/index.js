import {
    ACTION_P2P_SHARE_ADD_TORRENT,
    ACTION_P2P_SHARE_UPDATE_CLIENT_INFO,
    ACTION_P2P_SHARE_REMOVE_TORRENT,
    ACTION_P2P_SHARE_CHANGE_STATE,
} from '../../ActionType';

const initState = {
    torrents: [],
    client: {
        downloadSpeed: 0,
        uploadSpeed: 0,
    },
    state: 'normal'
};

const P2pShareReducer = (state = initState, action) => {
    let newState = state;
    switch (action.type){
        case ACTION_P2P_SHARE_ADD_TORRENT:
            newState.torrents = newState.torrents.concat(action.data);
            break;
        case ACTION_P2P_SHARE_UPDATE_CLIENT_INFO:
            let {downloadSpeed, uploadSpeed} = action.data;
            newState.client = {
                downloadSpeed,
                uploadSpeed,
            };
            break;
        case ACTION_P2P_SHARE_REMOVE_TORRENT:
            newState.torrents = newState.torrents.filter(value => {
               return value !== action.data;
            });
            break;
        case ACTION_P2P_SHARE_CHANGE_STATE:
            newState.state = action.data;
            break;
    }
    return newState;
};

export default P2pShareReducer