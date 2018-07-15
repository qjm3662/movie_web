import {
    ACTION_UPLOAD_ADD_FILE,
    ACTION_UPLOAD_REMOVE_FILE,
} from '../../ActionType';

const initState = {
    fileList: [],
};

Array.prototype.insertOrUpdate = function(data, judgeKey){
    let newArray = this.slice();
    let idx = -1;
    newArray.forEach((item, index) => {
        if(item[judgeKey] === data[judgeKey])
            idx = index;
    });
    if(idx === -1){
        newArray.splice(newArray.size, 0, data);
    } else {
        newArray[idx] = data;
    }
    return newArray;
};

Array.prototype.removeItem = function(data, judgeKey){
    return this.filter(item => {
        return item[judgeKey] !== data[judgeKey];
    })
};

const UploadReducer = (state = initState, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case ACTION_UPLOAD_ADD_FILE:
            newState.fileList = state.fileList.insertOrUpdate(action.data, 'uid');
            break;
        case ACTION_UPLOAD_REMOVE_FILE:
            newState.fileList = state.fileList.removeItem(action.data, 'uid');
            break;
    }
    return newState;
};

export default UploadReducer