import {
    connect
} from 'react-redux'

import {
    VideoComponent
} from '../../components'
import {
    ACTION_VIDEO_LOADING_FINISH,
    ACTION_VIDEO_NO_MORE,
    ACTION_VIDEO_CHANGE_TAB,
    ACTION_VIDEO_BEGIN_LOADING,
    ACTION_VIDEO_ADD_ITEMS,
} from '../../ActionType';
import {
    CloudServerAPI,
    getCloudServerAxios,
} from '../../config/API';
import message from "antd/lib/message/index";

export default connect(
    (state) => {
        return {
            ...state.VideoReducer
        }
    },
    (dispatch) => {
        return {
            loadMore: (page, isDownload = false, sortByTime = true, category, year = 1997) => {
                dispatch({
                    type: ACTION_VIDEO_BEGIN_LOADING,
                    category: category
                });
                const GET_MOVIES = CloudServerAPI.GET_MOVIES;
                let URL = `${GET_MOVIES.api}?${GET_MOVIES.PARAM_PAGE}=${page}&${GET_MOVIES.PARAM_SIZE}=10`;
                // if(isDownload)
                //     URL += `&${GET_MOVIES.PARAM_IS_DOWNLOAD}=1`;
                if(sortByTime)
                    URL += `&${GET_MOVIES.PARAM_ORDER_PROP}=createdAt&${GET_MOVIES.PARAM_ORDER}=DESC`;
                URL += `&${GET_MOVIES.PARAM_TYPE}=${CloudServerAPI.GET_MOVIES.TYPE_VIDEO}`;
                if(category && category !== CloudServerAPI.GET_MOVIES.CATEGORY_YEAR)
                    URL += `&filterProps=category&filterValues=${category}`;
                else if (category === CloudServerAPI.GET_MOVIES.CATEGORY_YEAR)
                    URL += `&filterProps=releaseTime&filterValues=${year}`;
                getCloudServerAxios(axois => {
                    axois.get(URL)
                        .then(res => {
                            dispatch({
                                type: ACTION_VIDEO_LOADING_FINISH,
                                category: category,
                                year: year
                            });
                            let items = res.data.data;
                            if (!items || items.length === 0) {       //没有获取到数据说明说有数据都获取完毕了
                                dispatch({
                                    type: ACTION_VIDEO_NO_MORE,
                                    category: category,
                                    year: year
                                });
                            } else {
                                dispatch({
                                    type: ACTION_VIDEO_ADD_ITEMS,
                                    data: items,
                                    category: category,
                                    year: year
                                })
                            }
                        })
                        .catch(err => {
                            dispatch({
                                type: ACTION_VIDEO_NO_MORE,
                                category: category,
                                year: year
                            });
                            dispatch({
                                type: ACTION_VIDEO_LOADING_FINISH,
                                category: category,
                                year: year
                            });
                            console.log(err);
                            message.info('获取错误')
                        });
                });
            },
            changeTab: (key) => {
                dispatch({
                    type: ACTION_VIDEO_CHANGE_TAB,
                    data: key,
                })
            }
        }
    },
) (VideoComponent)