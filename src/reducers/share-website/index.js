import {
    ACTION_SHARE_WEBSITE_CHANGE_FIELDS,
    ACTION_SHARE_WEBSITE_FINISH_SHARE,
    ACTION_SHARE_WEBSITE_BEGIN_SHARE,
} from '../../ActionType';
const initState = {
    title: {
        value: ''
    },
    website: {
        value: ''
    },
    category: {
        value: ''
    },
    description: {
        value: ''
    },
    loading: false,
};
const ShareWebsiteReducer = (state = initState, action) => {
    let newState = state;
    switch (action.type){
        case ACTION_SHARE_WEBSITE_CHANGE_FIELDS:
            newState = {...state, ...action.data};
            break;
        case ACTION_SHARE_WEBSITE_BEGIN_SHARE:
            newState.loading = true;
            break;
        case ACTION_SHARE_WEBSITE_FINISH_SHARE:
            newState.loading = false;
            break;
    }
    return newState;
};

export default ShareWebsiteReducer