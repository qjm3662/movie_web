import {
    ACTION_DETAIL_UPDATE_RESOURCE_INFO,
} from '../../ActionType'

const initState = {
};
const DetailReducer = (state = initState, action) => {
    let newState = {};
    Object.assign(newState, state);
    switch (action.type){
        case ACTION_DETAIL_UPDATE_RESOURCE_INFO:
            newState.resource = action.data;
            break;
    }
    return newState;
};

export default DetailReducer;