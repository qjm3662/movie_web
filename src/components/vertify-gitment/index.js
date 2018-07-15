import React from 'react';
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import styled from 'styled-components';


const VertifyBody = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;


class VertifyGitmentComponent extends React.Component{
    componentDidMount(){
        const gitalk = new Gitalk({
            clientID: '18173fd8605b5c387012',
            clientSecret: '680864c20e99ef281b12c427818e88a5d0383031',
            repo: 'movie_web',
            owner: 'SunnyQjm',
            admin: ['SunnyQjm'],
            id: 'vertify',      // Ensure uniqueness and length less than 50
            distractionFreeMode: true  // Facebook-like distraction free mode
        });
        gitalk.render('comments')
    }


    render(){
        let commentsStyle = {
            width: '800px',
        };
        return (
            <VertifyBody>
                <div id={'comments'} style={commentsStyle}/>
            </VertifyBody>
        )
    }
}

export default VertifyGitmentComponent;