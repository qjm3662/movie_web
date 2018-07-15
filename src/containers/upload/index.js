import {
    connect
} from 'react-redux'

import {
    UploadComponent
} from '../../components'

import {
    ACTION_UPLOAD_ADD_FILE,
    ACTION_UPLOAD_REMOVE_FILE,
} from '../../ActionType';

export default connect(
    (state) => {
        return {
            ...state.UploadReducer
        }
    },
    (dispatch) => {
        return {
            addFile: file => {
                dispatch({
                    type: ACTION_UPLOAD_ADD_FILE,
                    data: file,
                });
            },
            removeFile: file => {
                dispatch({
                    type: ACTION_UPLOAD_REMOVE_FILE,
                    data: file
                });
            }
        }
    },
) (UploadComponent)