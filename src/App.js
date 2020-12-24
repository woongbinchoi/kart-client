import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
// import { Chart } from "react-google-charts";
import axios from 'axios';
// import logo from './premier_league_logo.svg';
import './App.scss';


const server_host = process.env.REACT_APP_SERVER_HOST;
const tierPoint = 'Tier Point'
const ign_temp = '세야'
const app_name = 'RUSH.GG' // Temporary name

class UserInfo extends Component {
    _is_mounted = false;

    state = {
        is_loaded: false,
        is_user_registered: false,
        is_map_registered: false,
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
        this._is_mounted = true;
        const ign = this.props.ign;

        axios.get(server_host + '/user_info?ign=' + ign)
            .then(response => {
                if (this._is_mounted) {
                    const records_data = response.data.records_data;
                    if (Object.keys(records_data).length === 0) {
                        this.setState({ is_loaded: true, is_user_registered: response.data.is_user_registered, is_map_registered: false })
                    } else {
                        let map_percentiles = {}
                        for (let map_name in records_data.rank_records) {
                            let percentile = Math.round(10000 * records_data.rank_records[map_name] / records_data.num_records[map_name]) / 100;
                            percentile = percentile.toFixed(2);
                            map_percentiles[map_name] = percentile;
                        }
                        this.setState({
                            is_loaded: true,
                            is_user_registered: response.data.is_user_registered,
                            is_map_registered: true,
                            high_25: records_data.high_25,
                            high_25_50: records_data.high_25_50,
                            low_50: records_data.low_50,
                            level_records: records_data.level_records,
                            map_records: records_data.map_records,
                            num_records: records_data.num_records,
                            rank_records: records_data.rank_records,
                            map_percentiles: map_percentiles,
                            map_levels_dict: records_data.map_levels,
                            over_performing_map: records_data.over_performing_map,
                            under_performing_map: records_data.under_performing_map,
                            ign: ign,
                        });
                    }
                }
            });
    }

    componentWillUnmount() {
        this._is_mounted = false;
    }

    render() {
        const {
            is_loaded,
            is_user_registered,
            is_map_registered,
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

        if (!is_loaded) {
            return '';
        }
        console.log(this.state)
        return (
            <div className='user_info_container'>
                <div className='profile_container'>
                    <h1>{ign}</h1>
                </div>
                <div className='records_container'>
                    {is_user_registered && is_map_registered &&
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
                    }
                    {is_user_registered && !is_map_registered &&
                        <div className='not_found_container'>
                            <h2>맵 기록이 등록되지 않은 유저입니다.</h2>
                        </div>
                    }
                    {!is_user_registered &&
                        <div className='not_found_container'>
                            <h2>{app_name} 에 등록되지 않은 유저입니다.</h2>
                            <h3>오타를 확인 후 다시 검색해주세요.</h3>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

class Home extends Component {
    render() {
        return <UserInfo ign={ign_temp} />
    }
}

class User extends Component {
    state = {
        ign: '',
        is_loaded: false,
    }
    componentDidMount() {
        this.setState({
            ign: this.props.match.params.ign,
            is_loaded: true,
        });
    }
    render() {
        if (this.state.is_loaded) {
            return <UserInfo ign={this.state.ign} />
        } else {
            return ''
        }
    }
}

class UserSearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_ign: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({search_ign: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!!this.state.search_ign) {
            window.location.href='/user/' + this.state.search_ign;
        }
    }

    render() {
        return (
            <div className='search_form_container'>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder='닉네임 검색'
                        value={this.state.search_ign}
                        onChange={this.handleChange}
                    />
                    <input type="submit" value="검색" />
                </form>
            </div>
        )
    }
}

class UserSearch extends Component {
    render() {
        return (
            <div className='user_search_container'>
                <div className='search_title'>
                    <h1>{app_name}</h1>
                    <h2>카트라이더 러쉬플러스 유저 전적 검색</h2>
                </div>
                <div className='break_column'/>
                <UserSearchForm/>
            </div>
        )
    }
}

class Maps extends Component {
    _is_mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            maps_data: {},
            changed_maps: {},
            error_maps: {},
            submit_error: '',
            map_minimums: props.map_minimums,
            map_levels: props.map_levels,
            is_loaded: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this._is_mounted = true;

        axios.get(server_host + '/maps?igns=' + ign_temp)
            .then(response => {
                if (this._is_mounted) {
                    this.setState({ maps_data: response.data[0], is_loaded: true });
                }
            });
    }

    componentWillUnmount() {
        this._is_mounted = false;
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

        const { changed_maps, map_minimums } = this.state;
        const submit_dict = {};
        const errors = {};

        let changed = false;
        Object.keys(changed_maps).forEach((map_name, idx) => {
            const record = changed_maps[map_name];
            if (record !== '') {
                changed = true;
                if (!this.validateRecord(record)) {
                    errors[map_name] = 'Invalid time format. The record should follow \'XX:XX:XX\'. (Ex. 01:42:59)';
                } else if (!this.validateMinimum(record, map_minimums[map_name])) {
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
        const { submit_error, error_maps, map_levels, is_loaded } = this.state;
        
        const disabled = (Object.keys(error_maps).length !== 0 || !!submit_error)
        const maps_to_check = Object.keys(error_maps).join(', ')
        const maps_error_message = !!maps_to_check ? 'Invalid record: ' + maps_to_check : ''

        if (!is_loaded) return '';
        return (
            <div className='update_maps_container'>
                <h1>Update Records</h1>
                <form onSubmit={this.handleSubmit}>
                    {Object.keys(map_levels).reverse().map((level, idx) =>
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

class Setting extends Component {
    state = {
        is_loaded: false,
    }

    render() {
        return (
            <div className='my_page_container'>
                <h1>Welcome, {ign_temp}</h1>
                <div className='setting_div'>
                    <ul>
                        <li key='update_map_records'><a href='/setting/maps'>Update Map Records</a></li>
                        <li key='view_my_records'><a href={`/user/${ign_temp}`}>View My Records</a></li>
                        <li key='log_out'>Log Out</li> 
                    </ul>
                </div>
            </div>
        );
    }
}

class UserRanking extends Component {
    _is_mounted = false;

    state = {
        maps_list: [tierPoint].concat(this.props.maps_list),
        map_data: {
            [tierPoint]: [],
        },
        is_loaded: false,
        current_tab: tierPoint,
    }

    componentDidMount() {
        this._is_mounted = true;

        axios.get(server_host + '/elo')
            .then(response => {
                if (this._is_mounted) {
                    this.setState({ 
                        map_data: {
                            ...this.state.map_data, [tierPoint]: response.data
                        },
                        is_loaded: true,
                        current_tab: tierPoint
                    });
                }
            });
    }

    componentWillUnmount() {
        this._is_mounted = false;
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
                    this.setState({ 
                        map_data: {
                            ...this.state.map_data, [map_name]: response.data
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
                    <a href={'/user/' + record.ign}><span className='ign'>{record.ign}</span></a>
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
        const { map_data, current_tab, maps_list } = this.state;
        const current_data = map_data[current_tab];

        return (
            <div className='user_ranking_container'>
                <h1>User Ranking by <span className='highlight'>{current_tab}</span></h1>
                <div className='user_ranking_content horizontal_parent'>
                    <span className='user_ranking_search'>
                        <ul className='user_ranking'>
                            {maps_list.map((map_name) =>
                                this.renderSideBar(map_name)
                            )}
                        </ul>
                    </span>
                    <span className='user_ranking_records'>
                        <ul className='user_ranking'>
                            <li key='header'>
                                <div className='span_div'>
                                    <span className='rank'>#</span>
                                    <span className='ign'>Nickname</span>
                                    <span className='elo'>{current_tab === tierPoint ? tierPoint : 'Record'}</span>
                                </div>
                            </li>
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
        current_page: null,
        map_levels: {},
        map_minimums: {},
    }

    handleLinkClick(path) {
        this.setState({current_page: path});
    }

    getLinkClassName(path) {
        return path === this.state.current_page ? 'active_link' : '';
    }

    componentDidMount() {
        const pathname = window.location.pathname.split('/');
        const request_map_levels = axios.get(server_host + '/map_levels');
        const request_map_minimums = axios.get(server_host + '/map_minimums');

        axios.all([request_map_levels, request_map_minimums])
            .then(axios.spread((...responses) => {
                this.setState({
                    current_page: pathname[1],
                    map_levels: responses[0].data,
                    map_minimums: responses[1].data,
                });
            }));
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
                            <Link to="/user_ranking">
                                <span onClick={() => this.handleLinkClick('user_ranking')} className={ this.getLinkClassName('user_ranking') }>User Ranking</span>
                            </Link>
                            <Link to={"/user"}>
                                <span onClick={() => this.handleLinkClick('user')} className={ this.getLinkClassName('user') }>Users</span>
                            </Link>
                            <div className='right'>
                                <UserSearchForm/>
                                <Link to="/sign_up">
                                    <span onClick={() => this.handleLinkClick('sign_up')} className={ this.getLinkClassName('sign_up') }>Sign Up</span>
                                </Link>
                                <Link to="/sign_in">
                                    <span onClick={() => this.handleLinkClick('sign_in')} className={ this.getLinkClassName('sign_in') }>Sign In</span>
                                </Link>
                                <Link to="/setting">
                                    <span onClick={() => this.handleLinkClick('setting')} className={ this.getLinkClassName('setting') }>My Account</span>
                                </Link>
                            </div>
                        </div>

                        <div className="content">
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/user_ranking" exact component={() => <UserRanking maps_list={Object.keys(this.state.map_minimums)} />} />
                                <Route path="/user" exact component={UserSearch} />
                                <Route path="/user/:ign" component={User} />
                                <Route path="/setting" exact component={Setting} />
                                <Route path="/setting/maps" exact component={() => <Maps map_levels={this.state.map_levels} map_minimums={this.state.map_minimums} />} />
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



