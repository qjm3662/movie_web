import {
    connect
} from 'react-redux'

import {
    ShareWebsiteComponent
} from '../../components'

import {
    ACTION_SHARE_WEBSITE_CHANGE_FIELDS,
    ACTION_SHARE_WEBSITE_BEGIN_SHARE,
    ACTION_SHARE_WEBSITE_FINISH_SHARE,
} from '../../ActionType';
import message from 'antd/lib/message';

import {
    CloudServerAPI,
    getCloudServerAxios,
} from '../../config/API';

export default connect(
    (state) => {
        return {
            ...state.ShareWebsiteReducer
        }
    },
    (dispatch) => {
        return {
            updateFields: (changeFields) => {
                dispatch({
                    type: ACTION_SHARE_WEBSITE_CHANGE_FIELDS,
                    data: changeFields,
                })
            },
            shareWebsite: (params) => {
                let {title, website, category, description} = params;
                dispatch({
                    type: ACTION_SHARE_WEBSITE_BEGIN_SHARE,
                });
                const PW = CloudServerAPI.PUSH_WEBSITE;
                let requestParams = {};
                requestParams[PW.PARAM_TITLE] = title.value;
                requestParams[PW.PARAM_WEBSITE] = website.value;
                requestParams[PW.PARAM_CATEGORY] = category.value;
                requestParams[PW.PARAM_DESCRIPTION] = description.value;
                getCloudServerAxios(axios => {
                   axios.post(PW.api, requestParams)
                       .then(res => {
                           if(res.data.code === 0){
                               message.success('分享成功')
                           } else {
                               message.error(res.data.msg);
                           }

                           dispatch({
                               type: ACTION_SHARE_WEBSITE_FINISH_SHARE,
                           });
                       })
                       .catch(err => {
                           message.error(err.message);
                           dispatch({
                               type: ACTION_SHARE_WEBSITE_FINISH_SHARE,
                           });
                       })
                });
            }
        }
    },
) (ShareWebsiteComponent)