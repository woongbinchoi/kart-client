import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
// import { Chart } from "react-google-charts";
import axios from 'axios';
// import logo from './premier_league_logo.svg';
import './App.scss';


const host = 'http://localhost:5000'
const map_dict = {
    '빌리지 고가의 질주': '1:35:00',
    'WKC 코리아 서킷': '1:45:00',
    '사막 빙글빙글 공사장': '1:52:00',
    '대저택 은밀한 지하실': '1:55:00',
    '노르테유 익스프레스': '1:45:00',
    '빌리지 운명의 다리': '1:59:00',
    '해적 로비 절벽의 전투': '1:50:00',
    '쥐라기 공룡 결투장': '1:48:00',
}

const tierPoint = 'Tier Point'

class Home extends Component {
    state = {
        summary: {},
        is_loaded: false
    }

    componentDidMount() {
        axios.get('https://epl-server.herokuapp.com/summary')
            .then(response => {
                console.log(response.data);
                this.setState({ summary: response.data, is_loaded: true });
            });
    }

    render() {
        return (
            <div className='home'>
                <h2 className='content_header'>Summary</h2>
                {this.state.is_loaded && 
                    <div>
                        <p>Most likely to win the season: <b>{this.state.summary.winner}</b></p>
                        <p>Prediction Accuracy: <b>{Math.round(this.state.summary.accuracy * 10000) / 100}%</b></p>
                        <p>Last Update: <b>{this.state.summary.time}</b></p>
                    </div>
                }
                <br/>
                <h2 className='content_header'>Help</h2>
                <p>If you would like to look at match predictions, <b><a href='/predictions'>Click Predictions</a></b>.</p>
                <p>If you would like to look at previous matches of the current season, <b><a href='/results'>Click Results</a></b>.</p>
                <p>If you would like to look at the current standing as well as predicted standings, <b><a href='/standings'>Click Standings</a></b>.</p>
                <p>If you would like to look at github repo of this website, <b><a href='https://github.com/woongbinchoi/English-Premier-League-Prediction'>Click here</a></b>.</p>
                <p>If you have any questions for the developer, <b><a href='mailto:woongbinchoi@gmail.com'>Please contact me</a></b>.</p>
            </div>
        );
    }
}

class Maps extends Component {
    state = {
        maps_data: [],
        is_loaded: false
    }

    componentDidMount() {
        axios.get(host + '/maps') // axios.get(host + '/maps?igns=seya,seya2')
            .then(response => {
                this.setState({ maps_data: response.data, is_loaded: true });
            });
    }

    render() {
        const { maps_data } = this.state
        return (
            <div>
                {maps_data.map((user_record) =>
                    <div key={user_record['ign']}>
                        <p key='ign'>{user_record['ign']}</p>
                        {Object.keys(user_record).map((key, idx) =>
                            key !== 'ign' && (<li key={idx}>{key} {user_record[key]}</li>)
                        )}
                    </div>
                )}
            </div>
        );
    }
}

class UserRanking extends Component {
    state = {
        map_data: {
            [tierPoint]: [],
        },
        is_loaded: false,
        current_tab: tierPoint,
    }

    componentDidMount() {
        axios.get(host + '/chart')
            .then(response => {
                const elo_data = response.data
                const elo_list = [{'rank': '#', 'ign': 'Nickname', 'elo': tierPoint}].concat(elo_data)
                this.setState({ 
                    map_data: {
                        ...this.state.map_data, [tierPoint]: elo_list
                    },
                    is_loaded: true,
                    current_tab: tierPoint
                });
            });
    }

    handleSideBarClick(map_name) {
        if ((!!this.state.map_data &&
            !!this.state.map_data[map_name] &&
            this.state.map_data[map_name].length > 0) ||
            map_name === tierPoint
        ) {
            this.setState({ current_tab: map_name });
        } else {
            axios.get(host + '/maps?map=' + map_name)
                .then(response => {
                    const map_list = [{'rank': '#', 'ign': 'Nickname', 'record': 'Record'}].concat(response.data)
                    this.setState({ 
                        map_data: {
                            ...this.state.map_data, [map_name]: map_list
                        },
                        current_tab: map_name
                    });
                });
        }
    }

    renderRecord(record) {
        const record_data = (!!record.elo) ? record.elo : record.record;
        return (
            <li key={record.rank}>
                <div className='span_div'>
                    <span className='rank'>{record.rank}</span>
                    <span className='ign'>{record.ign}</span>
                    <span className='elo'>{record_data}</span>
                </div>
            </li>
        );
    }

    renderSideBar(map_name) {
        const { current_tab } = this.state

        return (
            <li key={map_name}>
                <div className={map_name === current_tab ? 'active_tab' : ''}>
                    <span onClick={() => this.handleSideBarClick(map_name)}>{map_name}</span>
                </div>
            </li>
        );
    }

    render() {
        const { map_data, current_tab } = this.state;
        const current_data = map_data[current_tab];
        const map_list = [tierPoint].concat(Object.keys(map_dict))

        return (
            <div className='user_ranking_container'>
                <h1>User Ranking by <span className='highlight'>{current_tab}</span></h1>
                <div className='user_ranking_content'>
                    <span className='user_ranking_search'>
                        <ul className='user_ranking'>
                            {map_list.map((map_name) =>
                                this.renderSideBar(map_name)
                            )}
                        </ul>
                    </span>
                    <span className='user_ranking_records'>
                        <ul className='user_ranking'>
                            {current_data.map((user_record) =>
                                this.renderRecord(user_record)
                            )}
                        </ul>
                    </span>
                </div>
            </div>
        );
    }
}

class App extends Component {
    state = {
        current_page: null
    }

    handleLinkClick(path) {
        this.setState({current_page: path});
    }

    getLinkClassName(path) {
        return path === this.state.current_page ? 'active_link' : false;
    }

    componentDidMount() {
        const url = window.location.href.split('/');
        this.setState({current_page: url[url.length - 1]});
    }

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <div className="navigator">
                            <Link to="/">
                                <span onClick={() => this.handleLinkClick('')} className={'' === this.state.current_page ? 'active_link' : ''}>Home</span>
                            </Link>
                            <Link to="/maps">
                                <span onClick={() => this.handleLinkClick('maps')} className={'maps' === this.state.current_page ? 'active_link' : ''}>Maps</span>
                            </Link>
                            <Link to="/user_ranking">
                                <span onClick={() => this.handleLinkClick('user_ranking')} className={'user_ranking' === this.state.current_page ? 'active_link' : ''}>User Ranking</span>
                            </Link>
                        </div>

                        <div className="content">
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/maps" exact component={Maps} />
                                <Route path="/user_ranking" exact component={UserRanking} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}


export default App;



