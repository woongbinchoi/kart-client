import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Chart } from "react-google-charts";
import axios from 'axios';
import logo from './premier_league_logo.svg';
import './App.scss';


const host = 'http://localhost:5000'

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
        console.log(maps_data)
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
                        </div>

                        <div className="content">
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/maps" exact component={Maps} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}


export default App;



