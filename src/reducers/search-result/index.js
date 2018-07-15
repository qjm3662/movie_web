import {
    CloudServerAPI
} from '../../config/API';
import {
    ACTION_SEARCH_RESULT_ADD_ITEMS,
    ACTION_SEARCH_RESULT_BEGIN_LOADING,
    ACTION_SEARCH_RESULT_CHANGE_TAB,
    ACTION_SEARCH_RESULT_LOADING_FINISH,
    ACTION_SEARCH_RESULT_NO_MORE,
    ACTION_SEARCH_RESULT_UPDATE_KEYWORDS,
} from '../../ActionType'

const initState = {
    resourceItems: [],
    resourceHasMore: true,

    websiteItems: [],
    websiteHasMore: true,

    loading: false,
    activityTabKey: '资源',
    keywords: '',
};
const SearchResultReducer = (state = initState, action) => {
    let newState = state;
    switch (action.type) {
        case ACTION_SEARCH_RESULT_ADD_ITEMS:
            if (action.category === CloudServerAPI.QUERY_RESOURCE.CATEGORY)
            // newState.resourceItems = newState.resourceItems.insertOrUpdateList(action.data, 'id');
                newState.resourceItems = action.data;
            else if (action.category === CloudServerAPI.QUERY_WEBSITE.CATEGORY)
            // newState.websiteItems = newState.websiteItems.insertOrUpdateList(action.data, 'website');
                newState.websiteItems = action.data;
            break;
        case ACTION_SEARCH_RESULT_NO_MORE:
            if (action.category === CloudServerAPI.QUERY_RESOURCE.CATEGORY)
                newState.resourceHasMore = false;
            else if (action.category === CloudServerAPI.QUERY_WEBSITE.CATEGORY)
                newState.websiteHasMore = false;
            break;
        case ACTION_SEARCH_RESULT_BEGIN_LOADING:
            newState.keywords = action.keywords;
            newState.loading = true;
            break;
        case ACTION_SEARCH_RESULT_LOADING_FINISH:
            newState.loading = false;
            break;
        case ACTION_SEARCH_RESULT_CHANGE_TAB:
            newState.activityTabKey = action.data;
            break;

    }
    return newState;
};

export default SearchResultReducer