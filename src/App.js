import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
// import { Chart } from "react-google-charts";
import axios from 'axios';
// import logo from './premier_league_logo.svg';
import './App.scss';


const server_host = process.env.REACT_APP_SERVER_HOST;
const tierPoint = 'Tier Point'
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
                                        <div className='performing_span_header'><h2>상위 50+%</h2></div>
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
                                                <span className='horizontal_child map_rating'>등급*</span>
                                                <span className='horizontal_child map_ranking'>등수</span>
                                            </div>
                                        </li>
                                        {Object.keys(map_records).map((map_name, idx) =>
                                            <li key={idx}>
                                                <div className='span_div horizontal_parent'>
                                                    <span className='horizontal_child map_name'>{map_name}</span>
                                                    <span className='horizontal_child map_level'>{map_levels_dict[map_name]}</span>
                                                    <span className='horizontal_child map_record'>{map_records[map_name]}</span>
                                                    <span className={'horizontal_child map_rating ' + level_records[map_name]}>{level_records[map_name]}</span>
                                                    <span className='horizontal_child map_ranking'>{`${rank_records[map_name]} / ${num_records[map_name]} (${map_percentiles[map_name]}%)`}</span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                    <ul className='help_message'>
                                        <li>등급*: 맵의 기록에 따라 등급이 스타선수, 랭커, 엘리트, 수준급, L1, 일반 으로 나뉩니다.</li>
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
        const my_ign = localStorage.getItem('ign');
        const value_1 = !!my_ign ? '내 기록 업데이트하기' : '실력 측정 시작하기';
        const href_1 = !!my_ign ? '/setting/maps' : '/sign_up';

        const value_2 = !!my_ign ? '내 기록 보기' : '로그인';
        const href_2 = !!my_ign ? '/user/' + my_ign : '/sign_in';

        return (
            <div className='home_user_search_container home_container'>
                <div className='search_title'>
                    <h1>{app_name}</h1>
                    <h2>카트라이더 러쉬플러스 기록 측정, 유저 전적 검색</h2>
                </div>
                <div className='break_column'/>
                <div className='other_options'>
                    <input 
                        type='button'
                        className='green'
                        value={value_1}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = href_1;
                        }}
                    />
                    <div className='break_column'/>
                    <input 
                        type='button'
                        className='green'
                        value={value_2}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = href_2;
                        }}
                    />
                    <div className='break_column'/>
                    <input 
                        type='button'
                        className='blue'
                        value='유저 검색'
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/user';
                        }}
                    />
                    <div className='break_column'/>
                    <input 
                        type='button'
                        className='blue'
                        value='유저 랭킹'
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/user_ranking';
                        }}
                    />
                </div>
            </div>
        )
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
            window.location.href = '/user/' + this.state.search_ign;
        }
    }

    render() {
        return (
            <div className='search_form_container'>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        id='nickname'
                        name='nickname'
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
            <div className='home_user_search_container'>
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
            my_ign: '',
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
        const my_ign = localStorage.getItem('ign');
        if (!my_ign) {
            window.location.href = '/';
            return;
        }

        axios.get(server_host + '/maps?igns=' + my_ign)
            .then(response => {
                if (this._is_mounted) {
                    this.setState({ 
                        maps_data: response.data[0] || {},
                        is_loaded: true,
                        my_ign: my_ign,
                    });
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
        const recordSplit = record.split(':');
        const minimumSplit = minimum.split(':');
        const recordInt = parseInt(recordSplit[0]) * 6000 + parseInt(recordSplit[1]) * 100 + parseInt(recordSplit[2]);
        const minimumInt = parseInt(minimumSplit[0]) * 6000 + parseInt(minimumSplit[1]) * 100 + parseInt(minimumSplit[2]);

        return minimumInt < recordInt;
    };
    handleSubmit(e, go_to_my_page=false) {
        e.preventDefault();

        const { changed_maps, map_minimums, my_ign } = this.state;
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

        if (!changed && Object.keys(errors).length === 0 && go_to_my_page) {
            window.location.href = '/user/' + my_ign;
            return;
        }

        if (Object.keys(errors).length === 0 &&
            Object.keys(submit_dict).length > 0 &&
            changed) {
            axios.post(server_host + '/maps', {
                ign: my_ign,
                maps: submit_dict
            }).then((response) => {
                if (go_to_my_page) {
                    window.location.href = '/user/' + my_ign;
                } else {
                    window.location.reload();
                }
            }, (error) => {
                this.setState({ submit_error: 'Unexpected Error occurred. Please try again.'})
            });
        } else {
            this.setState({ 
                error_maps: errors,
                // submit_error: !changed ? 'Enter a record to submit.' : ''
            });
        }
    }

    renderMapRow(map_name) {
        const { maps_data, changed_maps, error_maps } = this.state;

        return (
            <li key={map_name}>
                <div className='map_container'>
                    <div>
                        <p className={map_name in maps_data ? 'map_exists map_name' : 'map_name'}>{map_name}</p>
                        {/* <div className='break_column'></div> */}
                        <input
                            className={
                                (map_name in maps_data ? 'map_exists ' : ' ') + 
                                (map_name in error_maps ? 'map_error' : '')
                            }
                            key={map_name}
                            name={map_name}
                            type='text'
                            placeholder={map_name in maps_data ? maps_data[map_name] : 'Ex) 01:42:59'}
                            value={map_name in changed_maps ? changed_maps[map_name] : ''}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    {/* <div className='break_column'></div> */}
                    {map_name in error_maps && <p className='map_error'>{error_maps[map_name]}</p>}
                </div>
            </li>
        );
    }

    render() {
        const { submit_error, error_maps, maps_data, map_levels, is_loaded, my_ign } = this.state;
        const disabled = (Object.keys(error_maps).length !== 0 || !!submit_error)
        const maps_to_check = Object.keys(error_maps).join(', ')
        const maps_error_message = !!maps_to_check ? 'Invalid record: ' + maps_to_check : ''

        const registered_count = Math.max(Object.keys(maps_data).length - 1, 0);
        const can_continue = (registered_count >= 8);

        if (!is_loaded || !this._is_mounted) return '';
        return (
            <div className='update_maps_container'>
                <div className='title_div'>
                    <h1>Update Records</h1>
                </div>
                <ul className='records_info_ul'>
                    <li className={can_continue ? '' : 'red'}><p>- 현재 <strong>{registered_count}</strong>개의 맵을 등록하였습니다. 원활하고 정확한 실력 측정을 위해 <strong>8</strong>개 이상의 맵 기록이 필요합니다.</p></li>
                    <li className={can_continue ? '' : 'red'}><p>- <strong>8</strong>개 이상의 맵을 성공적으로 저장하면 측정하기 버튼이 활성화됩니다.</p></li>
                    <li><p>- 등록된 맵중 가장 실력이 좋은 맵 8개의 맵이 사용되어 {my_ign}님의 Tier Point를 측정합니다.</p></li>
                    <li><p>- 등록된 맵의 기록을 갱신할 수 있고 새로운 맵의 기록을 선택하여 추가할 수 있습니다.</p></li>
                    <li><p>- 성공적으로 등록한 맵은 초록색으로 표시됩니다.</p></li>
                </ul>
                <form onSubmit={this.handleSubmit}>
                    <div className='update_maps_levels'>
                        {Object.keys(map_levels).reverse().map((level, idx) =>
                            <div key={level} className={level + '_level level_container'}>
                                <h2>{level}</h2>
                                <ul>
                                    { map_levels[level].filter(mapp => mapp in maps_data).map((map_name) => this.renderMapRow(map_name)) }
                                    { map_levels[level].filter(mapp => !(mapp in maps_data)).map((map_name) => this.renderMapRow(map_name)) }
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className='update_maps_submit'>
                        <input 
                            type='button'
                            className='cancel_button'
                            value='취소'
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href='/user_ranking';
                            }}
                        />
                        <input type='submit' value='저장' disabled={disabled} />
                        <div className='break_column'></div>
                        {/* TODO: Add '내 실력 측정하기' button below submit If over 8 maps */}
                        <div className='save_and_continue_div'>
                            {!can_continue && <p className='red'>8개 이상의 맵을 성공적으로 저장하면 측정하기 버튼이 활성화됩니다.</p>}
                            <div className='break_column'></div>
                            <input 
                                type='button'
                                className='save_and_continue_button'
                                value='저장하고 내 실력 측정하기'
                                onClick={(e) => {
                                    this.handleSubmit(e, true);
                                }}
                                disabled={disabled || !can_continue} 
                            />
                            <input 
                                type='button'
                                className='save_and_continue_button'
                                value='저장하지 않고 내 실력 측정하기'
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = '/user/' + my_ign;
                                }}
                                disabled={!can_continue}
                            />
                        </div>
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
    constructor(props) {
        super(props);
        this.state = {
            is_loaded: false,
            my_ign: '',
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        const my_ign = localStorage.getItem('ign');
        if (!my_ign) {
            window.location.href = '/';
        } else {
            this.setState({ my_ign: my_ign})
        }
    }

    handleLogout() {
        localStorage.removeItem('ign');
        window.location.href = '/sign_in';
    }

    render() {
        const { my_ign } = this.state;
        return (
            <div className='my_page_container'>
                <h1>Welcome, {my_ign}</h1>
                <div className='setting_div'>
                    <ul>
                        <li key='update_map_records'><p><a href='/setting/maps'>Update Map Records</a></p></li>
                        <li key='view_my_records'><p><a href={`/user/${my_ign}`}>View My Records</a></p></li>
                        <li key='log_out' onClick={this.handleLogout}><p className='red'>Log Out</p></li> 
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
        const { map_data, current_tab, maps_list, is_loaded } = this.state;
        const current_data = map_data[current_tab];

        if (!is_loaded || !this._is_mounted) return '';
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

// TODO: Change the logic to redirect to my page or home when jwt is saved/available
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error_msg: '',
            is_loaded: false,
        }

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const my_ign = window.localStorage.getItem('ign');
        if (!!my_ign) window.location.href = '/setting';
        else this.setState({ is_loaded: true });
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value,
            error_msg: ''
        });
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value,
            error_msg: ''
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;

        if (!email) {
            this.setState({ 
                error_msg: 'Email should not be empty'
            })
        } else if (!password) {
            this.setState({ 
                error_msg: 'Password should not be empty'
            })
        } else {
            axios.post(server_host + '/sign_in', {
                email: email,
                password: password,
            }).then(response => {
                if (response.data.error) {
                    this.setState({error_msg: response.data.error});
                } else {
                    // TODO: Change this logic to save jwt as well
                    window.localStorage.setItem('ign', response.data.user.ign);
                    window.location.href = '/'
                }
            });
        }
    }

    render() {
        if (!this.state.is_loaded) return '';
        return (
            <div className='sign_in_container'>
                <h1>{app_name}</h1>
                <div className='form_div'>
                    <h4>로그인</h4>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            id='email'
                            name='email'
                            placeholder='Email'
                            value={this.state.email}
                            onChange={this.handleChangeEmail}
                        />
                        <div className='break_column'></div>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            placeholder='Password'
                            value={this.state.password}
                            onChange={this.handleChangePassword}
                        />
                        <div className='break_column'></div>
                        <input className='blue' type="submit" value="로그인" />
                        <div className='break_column'></div>
                        <p className='error_msg'>{this.state.error_msg}</p>
                    </form>
                    <input
                        className='green'
                        type='button'
                        value='회원가입'
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href='/sign_up';
                        }}
                    />
                </div>
            </div>
        )
    }
}

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
            ign: '',
            error_msg: '',
            is_loaded: false,
        }

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangePassword2 = this.handleChangePassword2.bind(this);
        this.handleChangeIGN = this.handleChangeIGN.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const my_ign = window.localStorage.getItem('ign');
        if (!!my_ign) window.location.href = '/setting';
        else this.setState({ is_loaded: true });
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value,
            error_msg: ''
        });
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value,
            error_msg: ''
        });
    }

    handleChangePassword2(event) {
        this.setState({
            password2: event.target.value,
            error_msg: ''
        });
    }

    handleChangeIGN(event) {
        this.setState({
            ign: event.target.value,
            error_msg: ''
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { email, password, password2, ign } = this.state;

        if (!email) {
            this.setState({ 
                error_msg: 'Email should not be empty'
            })
        } else if (!email.match(/\S+@\S+\.\S+/)) {
            this.setState({ 
                error_msg: 'Enter a valid email address'
            })
        } else if (!password) {
            this.setState({ 
                error_msg: 'Password should not be empty'
            })
        } else if (!password2) {
            this.setState({ 
                error_msg: 'Confirm password should not be empty'
            })
        } else if (password !== password2) {
            this.setState({ 
                error_msg: 'Password and Confirm password do not match'
            })
        } else if (!ign) {
            this.setState({ 
                error_msg: 'Nickname should not be empty'
            })
        } else {
            axios.post(server_host + '/sign_up', {
                email: email,
                password: password,
                ign: ign,
            }).then(response => {
                if (response.data.error) {
                    this.setState({error_msg:  response.data.error});
                } else {
                    // TODO: Change this logic to save jwt as well
                    window.localStorage.setItem('ign', response.data.user.ign);
                    window.location.href = '/setting/maps';
                }
            });
        }
    }

    render() {
        if (!this.state.is_loaded) return '';
        return (
            <div className='sign_in_container'>
                <h1>{app_name}</h1>
                <div className='form_div'>
                    <h4>회원가입</h4>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            id='email'
                            name='email'
                            placeholder='Email'
                            value={this.state.email}
                            onChange={this.handleChangeEmail}
                        />
                        <div className='break_column'></div>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            placeholder='Password'
                            value={this.state.password}
                            onChange={this.handleChangePassword}
                        />
                        <div className='break_column'></div>
                        <input
                            type="password"
                            id='password_verification'
                            name='password_verification'
                            placeholder='Confirm password'
                            value={this.state.password2}
                            onChange={this.handleChangePassword2}
                        />
                        <div className='break_column'></div>
                        <input
                            type="text"
                            id='ign'
                            name='ign'
                            placeholder='Nickname (IGN)'
                            value={this.state.ign}
                            onChange={this.handleChangeIGN}
                        />
                        <div className='break_column'></div>
                        <input className='blue' type="submit" value="기록 측정 시작하기" />
                        <div className='break_column'></div>
                        <p className='error_msg'>{this.state.error_msg}</p>
                    </form>
                    <input
                        className='green'
                        type='button'
                        value='기존 계정으로 로그인'
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href='/sign_in';
                        }}
                    />
                </div>
            </div>
        )
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

    renderNavigator() {
        const logged_in = !!localStorage.getItem('ign');

        return (
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
                    {logged_in
                        ? 
                        <div className='log_in_div'>
                            <Link to="/setting">
                                <span onClick={() => this.handleLinkClick('setting')} className={ this.getLinkClassName('setting') }>My Account</span>
                            </Link>
                        </div>
                        :
                        <div className='log_in_div'>
                            <Link to="/sign_up">
                                <span onClick={() => this.handleLinkClick('sign_up')} className={ this.getLinkClassName('sign_up') }>Sign Up</span>
                            </Link>
                            <Link to="/sign_in">
                                <span onClick={() => this.handleLinkClick('sign_in')} className={ this.getLinkClassName('sign_in') }>Sign In</span>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Router>
                    <div>
                        {this.renderNavigator()}
                        <div className="content">
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path="/user_ranking" exact component={() => <UserRanking maps_list={Object.keys(this.state.map_minimums)} />} />
                                <Route path="/user" exact component={UserSearch} />
                                <Route path="/user/:ign" component={User} />
                                <Route path="/setting" exact component={Setting} />
                                <Route path="/setting/maps" exact component={() => <Maps map_levels={this.state.map_levels} map_minimums={this.state.map_minimums} />} />
                                <Route path="/sign_in" exact component={SignIn} />
                                <Route path="/sign_up" exact component={SignUp} />
                                <Redirect to="/" />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}


export default App;



