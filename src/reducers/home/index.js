import {
    ACTION_HOME_ADD_ITEMS,
    ACTION_HOME_LOADING_FINISH,
    ACTION_HOME_NO_MORE,
    ACTION_HOME_BEGIN_LOADING,
    ACTION_HOME_CHANGE_TAB,
} from '../../ActionType';

import {
    CloudServerAPI
} from '../../config/API'

const initState = {
    allItems: [],
    allHasMore: true,
    videoItems: [],
    videoHasMore: true,
    applicationItems: [],
    applicationHasMore: true,
    audioItems: [],
    audioHasMore: true,
    imageItems: [],
    imageHasMore: true,
    loading: false,
    activityTabKey: '所有资源',
};



const HomeReducer = (state = initState, action) => {
    let newState = state;
    switch (action.type) {
        case ACTION_HOME_ADD_ITEMS:
            if (!action.toType)
                newState.allItems = newState.allItems.insertOrUpdateList(action.data, 'id');
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_VIDEO)
                newState.videoItems = newState.videoItems.insertOrUpdateList(action.data, 'id');
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_APPLICATION)
                newState.applicationItems = newState.applicationItems.insertOrUpdateList(action.data, 'id');
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_AUDIO)
                newState.audioItems = newState.audioItems.insertOrUpdateList(action.data, 'id');
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_IMAGE)
                newState.imageItems = newState.imageItems.insertOrUpdateList(action.data, 'id');
            break;
        case ACTION_HOME_NO_MORE:
            if (!action.toType)
                newState.allHasMore = false;
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_VIDEO)
                newState.videoHasMore = false;
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_APPLICATION)
                newState.applicationHasMore = false;
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_AUDIO)
                newState.audioHasMore = false;
            else if (action.toType === CloudServerAPI.GET_MOVIES.TYPE_IMAGE)
                newState.imageHasMore = false;
            break;
        case ACTION_HOME_BEGIN_LOADING:
            newState.loading = true;
            break;
        case ACTION_HOME_LOADING_FINISH:
            newState.loading = false;
            break;
        case ACTION_HOME_CHANGE_TAB:
            newState.activityTabKey = action.data;
            break;

    }
    return newState;
};

export default HomeReducer