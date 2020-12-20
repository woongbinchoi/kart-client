import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
// import { Chart } from "react-google-charts";
import axios from 'axios';
// import logo from './premier_league_logo.svg';
import './App.scss';


const server_host = process.env.REACT_APP_SERVER_HOST;
const map_dict = {
    '빌리지 고가의 질주': '01:35:00',
    'WKC 코리아 서킷': '01:45:00',
    '사막 빙글빙글 공사장': '01:52:00',
    '대저택 은밀한 지하실': '01:55:00',
    '노르테유 익스프레스': '01:45:00',
    '빌리지 운명의 다리': '01:59:00',
    '해적 로비 절벽의 전투': '01:50:00',
    '쥐라기 공룡 결투장': '01:48:00',
}
const map_levels = {
    'R': ['빌리지 고가의 질주'],
    'L3': ['WKC 코리아 서킷', '빌리지 운명의 다리', '쥐라기 공룡 결투장'],
    'L2': ['해적 로비 절벽의 전투', '사막 빙글빙글 공사장', '대저택 은밀한 지하실'],
    'L1': ['노르테유 익스프레스'],
}

const tierPoint = 'Tier Point'
const ign_temp = '세야'
class Home extends Component {
    state = {
        is_loaded: false,
        high_25: [],
        high_25_50: [],
        low_50: [],
        level_records: {},
        map_records: {},
        num_records: {},
        rank_records: {},
        map_percentiles: {},
        map_levels_dict: {},
        over_performing_map: [],
        under_performing_map: [],
        ign: '',
    }

    componentDidMount() {
        axios.get(server_host + '/home_info?ign=' + ign_temp)
            .then(response => {
                let map_percentiles = {};
                if (!!response.data.rank_records) {
                    map_percentiles = Object.assign(
                        {}, 
                        ...Object.keys(response.data.rank_records).map((map_name, idx) => (
                            {[map_name]: (
                                Math.round(10000 * response.data.rank_records[map_name] / response.data.num_records[map_name])
                                / 100).toFixed(2)}
                        )));
                }
                this.setState({ 
                    is_loaded: true,
                    high_25: response.data.high_25,
                    high_25_50: response.data.high_25_50,
                    low_50: response.data.low_50,
                    level_records: response.data.level_records,
                    map_records: response.data.map_records,
                    num_records: response.data.num_records,
                    rank_records: response.data.rank_records,
                    map_percentiles: map_percentiles,
                    map_levels_dict: response.data.map_levels,
                    over_performing_map: response.data.over_performing_map,
                    under_performing_map: response.data.under_performing_map,
                    ign: ign_temp,
                });
            });
    }

    render() {
        const { 
            high_25,
            high_25_50,
            low_50,
            level_records,
            map_records,
            num_records,
            rank_records,
            map_percentiles,
            map_levels_dict,
            over_performing_map,
            under_performing_map,
            ign,
        } = this.state;

        return (
            <div className='home_container'>
                <div className='profile_container'>
                    <h1>{ign}</h1>
                </div>
                <div className='records_container'>
                    <div className='performing_container'>
                        <div className='horizontal_parent row_div'>
                            <span className='performing_span horizontal_child'>
                                <div>
                                    <div className='performing_span_header'><h2>상위 25%</h2></div>
                                    <ul>
                                        {high_25.map((map_name) =>
                                            <li key={map_name}>{map_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </span>
                            <span className='performing_span horizontal_child'>
                                <div>
                                    <div className='performing_span_header'><h2>상위 25-50%</h2></div>
                                    <ul>
                                        {high_25_50.map((map_name) =>
                                            <li key={map_name}>{map_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </span>
                            <span className='performing_span horizontal_child'>
                                <div>
                                    <div className='performing_span_header'><h2>하위 50%</h2></div>
                                    <ul>
                                        {low_50.map((map_name) =>
                                            <li key={map_name}>{map_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </span>
                        </div>
                        <div className='horizontal_parent row_div'>
                            <span className='performing_span horizontal_child'>
                                <div>
                                    <div className='performing_span_header'>
                                        <h2>비교적으로 기록이 좋은 맵</h2>
                                        <p>{ign}님의 다른 맵을 비교하여 상대적으로 기록이 좋은 맵을 보여줍니다.</p>
                                    </div>
                                    <ul>
                                        {over_performing_map.map((map_name) =>
                                            <li key={map_name}>{map_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </span>
                            <span className='performing_span horizontal_child'>
                                <div>
                                    <div className='performing_span_header'>
                                        <h2>비교적으로 관심이 더 필요한 맵</h2>
                                        <p>{ign}님의 다른 맵을 비교하여 상대적으로 노력했을때 더 좋은 기록을 낼 수 있는 맵을 보여줍니다.</p>
                                    </div>
                                    <ul>
                                        {under_performing_map.map((map_name) =>
                                            <li key={map_name}>{map_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </span>
                        </div>
                        <div className='horizontal_parent row_div'>
                            <span className='performing_span horizontal_child'>
                                <div className='performing_span_header'><h2>{ign}님의 기록</h2></div>
                                <ul className='user_records'>
                                    <li key='header'>
                                        <div className='span_div horizontal_parent'>
                                            <span className='horizontal_child map_name'>이름</span>
                                            <span className='horizontal_child map_level'>난이도</span>
                                            <span className='horizontal_child map_record'>기록</span>
                                            <span className='horizontal_child map_rating'>등급</span>
                                            <span className='horizontal_child map_ranking'>등수</span>
                                        </div>
                                    </li>
                                    {Object.keys(map_records).map((map_name, idx) =>
                                        <li key={idx}>
                                            <div className='span_div horizontal_parent'>
                                                <span className='horizontal_child map_name'>{map_name}</span>
                                                <span className='horizontal_child map_level'>{map_levels_dict[map_name]}</span>
                                                <span className='horizontal_child map_record'>{map_records[map_name]}</span>
                                                <span className='horizontal_child map_rating'>{level_records[map_name]}</span>
                                                <span className='horizontal_child map_ranking'>{`${rank_records[map_name]} / ${num_records[map_name]} (${map_percentiles[map_name]}%)`}</span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Maps extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maps_data: {},
            changed_maps: {},
            error_maps: {},
            submit_error: '',
            is_loaded: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios.get(server_host + '/maps?igns=' + ign_temp)
            .then(response => {
                this.setState({ maps_data: response.data[0], is_loaded: true });
            });
    }

    formatTime = (timestamp) => (Math.min(parseInt(timestamp), 59).toString().padStart(timestamp.length, "0"));
    normalizeInput(curr, prev) {
        if (!curr) return curr;
        const currVal = curr.replace(/[^\d]/g, '').replace(/\s/g, '');
        const currLen = currVal.length;

        if (!prev || prev.length < curr.length) {
            if (!prev && !currVal) return '';
            if (currLen < 3) return this.formatTime(currVal);
            if (currLen < 5) return `${this.formatTime(currVal.slice(0, 2))}:${this.formatTime(currVal.slice(2))}`;
            return `${this.formatTime(currVal.slice(0, 2))}:${this.formatTime(currVal.slice(2, 4))}:${currVal.slice(4, 6)}`;
        }
        return '';
        
    };
    handleInputChange({ target: { name, value } }) {
        const { changed_maps } = this.state;
        const copy_error_maps = {...this.state.error_maps}
        if (name in copy_error_maps) delete copy_error_maps[name]

        this.setState(prevState => ({
            changed_maps: {
                ...changed_maps,
                [name]: this.normalizeInput(
                    value,
                    name in prevState.changed_maps ? prevState.changed_maps[name] : ''
                )},
            error_maps: copy_error_maps,
            submit_error: ''
        }));
    };

    validateRecord = (record) => (record.length === 8 && record.match(/^[0-5][0-9]:[0-5][0-9]:\d{2}$/));
    validateMinimum(record, minimum) {
        const recordInt = parseInt(record.slice(0, 2)) * 6000 + parseInt(record.slice(3, 5)) * 100 + parseInt(record.slice(6));
        const minimumInt = parseInt(minimum.slice(0, 2)) * 6000 + parseInt(minimum.slice(3, 5)) * 100 + parseInt(minimum.slice(6));
        return minimumInt < recordInt;
    };
    handleSubmit(e) {
        e.preventDefault();

        const { changed_maps } = this.state;
        const submit_dict = {};
        const errors = {};

        let changed = false;
        Object.keys(changed_maps).forEach((map_name, idx) => {
            const record = changed_maps[map_name];
            if (record !== '') {
                changed = true;
                if (!this.validateRecord(record)) {
                    errors[map_name] = 'Invalid time format. The record should follow \'XX:XX:XX\'. (Ex. 01:42:59)';
                } else if (!this.validateMinimum(record, map_dict[map_name])) {
                    errors[map_name] = 'Enter a valid record.';
                } else {
                    submit_dict[map_name] = changed_maps[map_name];
                }
            }
        });

        if (Object.keys(errors).length === 0 &&
            Object.keys(submit_dict).length > 0 &&
            changed) {
            axios.post(server_host + '/maps', {
                ign: ign_temp,
                maps: submit_dict
            }).then((response) => {
                window.location.reload();
            }, (error) => {
                this.setState({ submit_error: 'Unexpected Error occurred. Please try again.'})
            });
        } else {
            this.setState({ 
                error_maps: errors,
                submit_error: !changed ? 'Enter a record to submit.' : ''
            });
        }
    }

    renderMapRow(map_name) {
        const { maps_data, changed_maps, error_maps } = this.state;

        return (
            <li key={map_name}>
                <div className='map_container'>
                    <div>
                        <p className='map_name'>{map_name}</p>
                        <div className='break_column'></div>
                        <input
                            className={map_name in error_maps ? 'map_error' : ''}
                            key={map_name}
                            name={map_name}
                            type='text'
                            placeholder={map_name in maps_data ? maps_data[map_name] : 'Ex) 01:42:59'}
                            value={map_name in changed_maps ? changed_maps[map_name] : ''}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className='break_column'></div>
                    {map_name in error_maps && <p className='map_error'>{error_maps[map_name]}</p>}
                </div>
            </li>
        );
    }

    render() {
        const { submit_error, error_maps } = this.state;
        
        const disabled = (Object.keys(error_maps).length !== 0 || !!submit_error)
        const maps_to_check = Object.keys(error_maps).join(', ')
        const maps_error_message = !!maps_to_check ? 'Invalid record: ' + maps_to_check : ''

        return (
            <div className='update_maps_container'>
                <h1>Update Records</h1>
                <form onSubmit={this.handleSubmit}>
                    {Object.keys(map_levels).map((level, idx) =>
                        <div key={level} className={level + '_level level_container'}>
                            <h2>{level}</h2>
                            <ul>
                                { map_levels[level].map((map_name) => this.renderMapRow(map_name)) }
                            </ul>
                        </div>
                    )}
                    <div className='update_maps_submit'>
                        <input 
                            type='button'
                            value='Cancel'
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href='/user_ranking';
                            }}
                        />
                        <input type='submit' value='Submit' disabled={disabled} />
                        <div className='break_column'></div>
                        {!!submit_error && <p className='submit_error'>{ submit_error }</p>}
                        {!!maps_error_message && <p className='submit_error'>{ maps_error_message }</p>}
                    </div>
                </form>
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
        axios.get(server_host + '/elo')
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
            axios.get(server_host + '/maps?map=' + map_name)
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
                <div className='user_ranking_content horizontal_parent'>
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

class UserLogin extends Component {
    state = {
        maps_data: [],
        is_loaded: false
    }

    obtainUsername(username) {
    }

    render() {
        return (
            <article className='user_login'>
                <div>
                    <h2>Login to update your records!</h2>
                    <input type="text" placeholder="ID"></input>
                    <br></br>
                    <input type="text" placeholder="Password"></input>
                    <br></br>
                    <br></br>
                    <button type="button">Sign in</button>
                </div>
            </article>
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
        return path === this.state.current_page ? 'active_link' : '';
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
                                <span onClick={() => this.handleLinkClick('')} className={ this.getLinkClassName('') }>Home</span>
                            </Link>
                            <Link to="/maps">
                                <span onClick={() => this.handleLinkClick('maps')} className={ this.getLinkClassName('maps') }>Maps</span>
                            </Link>
                            <Link to="/user_ranking">
                                <span onClick={() => this.handleLinkClick('user_ranking')} className={ this.getLinkClassName('user_ranking') }>User Ranking</span>
                            </Link>
                            <div className='right'>
                                <Link to="/sign_up">
                                    <span onClick={() => this.handleLinkClick('sign_up')} className={ this.getLinkClassName('sign_up') }>Sign Up</span>
                                </Link>
                                <Link to="/sign_in">
                                    <span onClick={() => this.handleLinkClick('sign_in')} className={ this.getLinkClassName('sign_in') }>Sign In</span>
                                </Link>
                            </div>
                        </div>

                        <div className="content">
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/maps" exact component={Maps} />
                                <Route path="/user_ranking" exact component={UserRanking} />
                                <Route path="/sign_in" exact component={UserLogin} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}


export default App;



