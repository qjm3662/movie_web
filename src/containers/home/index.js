import {
    connect
} from 'react-redux'

import {
    HomeComponent
} from '../../components'

import {
    ACTION_HOME_ADD_ITEMS,
    ACTION_HOME_LOADING_FINISH,
    ACTION_HOME_NO_MORE,
    ACTION_HOME_BEGIN_LOADING,
    ACTION_HOME_CHANGE_TAB,
} from '../../ActionType';
import message from 'antd/lib/message';
import {
    CloudServerAPI,
    getCloudServerAxios,
} from '../../config/API';

export default connect(
    (state) => {
        return {
            ...state.HomeReducer
        }
    },
    (dispatch) => {
        return {
            loadMore: (page, isDownload = false, sortByTime = true, type) => {
                dispatch({
                    type: ACTION_HOME_BEGIN_LOADING,
                    toType: type
                });
                const GET_MOVIES = CloudServerAPI.GET_MOVIES;
                let URL = `${GET_MOVIES.api}?${GET_MOVIES.PARAM_PAGE}=${page}&${GET_MOVIES.PARAM_SIZE}=10`;
                if(isDownload)
                    URL += `&${GET_MOVIES.PARAM_IS_DOWNLOAD}=1`;
                if(sortByTime)
                    URL = URL + `&${GET_MOVIES.PARAM_ORDER_PROP}=createdAt&${GET_MOVIES.PARAM_ORDER}=DESC`;
                if(type)
                    URL = URL + `&${GET_MOVIES.PARAM_TYPE}=${type}`;
                getCloudServerAxios(axois => {
                    axois.get(URL)
                        .then(res => {
                            dispatch({
                                type: ACTION_HOME_LOADING_FINISH,
                                toType: type
                            });
                            let items = res.data.data;
                            if (!items || items.length === 0) {       //没有获取到数据说明说有数据都获取完毕了
                                dispatch({
                                    type: ACTION_HOME_NO_MORE,
                                    toType: type
                                });
                            } else {
                                dispatch({
                                    type: ACTION_HOME_ADD_ITEMS,
                                    data: items,
                                    toType: type
                                })
                            }
                        })
                        .catch(err => {
                            dispatch({
                                type: ACTION_HOME_NO_MORE,
                                toType: type
                            });
                            dispatch({
                                type: ACTION_HOME_LOADING_FINISH,
                                toType: type
                            });
                            console.log(err);
                            message.info('获取错误')
                        });
                });
            },
            changeTab: (key) => {
                dispatch({
                    type: ACTION_HOME_CHANGE_TAB,
                    data: key,
                })
            }
        }
    },
)(HomeComponent)