import {
    IntranetServerConfig,
} from './server-info-config';
import axios from 'axios';

axios.defaults.baseURL = `http://${IntranetServerConfig.host}:${IntranetServerConfig.port}`;
