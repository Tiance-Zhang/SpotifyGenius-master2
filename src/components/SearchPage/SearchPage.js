import React from 'react';
import styles from './SearchPage.css';
import QueryString from 'query-string';
import SearchCards from './SearchCards/SearchCards';
import LyricsSection from './LyricsSection/LyricsSection';
import Backdrop from '../Backdrop/Backdrop';
import Login from '../Login/Login';
// import NoLyrics from '../NoLyrics/NoLyrics';

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            songData: null,
            lyricsData: [],
            loginRequired: false,
            showNoLyrics: false,
        };
        this.onUserInput = this.onUserInput.bind(this);
        this.getSongData = this.getSongData.bind(this);
        this.getLyrics = this.getLyrics.bind(this);
        this.onEnterPressed = this.onEnterPressed.bind(this);
        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.onSearchCardClicked = this.onSearchCardClicked.bind(this);
    }

    onUserInput(e) {
        let value = e.target.value;
        this.setState(() => {
            return {
                searchTerm: value
            };
        });
    }

    getSongData() {
        if (this.state.searchTerm && this.state.searchTerm.trim().length > 0)  {
            if (!this.props.token) {
                this.setState(() => {
                   return {
                       loginRequired: true
                    };
                });
            }
            fetch('http://localhost:9090' + '/search/song?' + QueryString.stringify({
                q: this.state.searchTerm,
            }), {
                method: 'GET',
                headers: {
                    'Authorization' : 'Bearer ' + this.props.token,
                }
            })
                .then(response => {
                    return response.json();
                })
            .then(json => {
                if (json.results) {
                    console.log(json.results)
                    this.setState(() => {
                        return {
                            songData: json.results
                        }
                    });
                } else {
                    if (json.error || json.status >= 400) {
                        this.setState(() => {
                            return {
                                loginRequired: true
                            };
                        });
                    }
                }
            })
            .catch(() => {
                this.setState(() => {
                    return {
                        songData: null
                    };
                });
            });
        }
    }

    getLyrics(name, artist) {
        console.log('artist: ',artist);
        fetch('http://localhost:9090'+ '/search/lyric?' + QueryString.stringify({
            name,
            artist
        }))
        .then(response => response.json())
        .then(json => {
            if (json.lyrics.length > 0) {
                this.setState(() => {
                    return {
                        lyricsData: json.lyrics,
                        showNoLyrics: false
                    };
                });
            } else if (json.message && json.status || json.lyrics === 0) {
                this.setState(() => {
                    return {
                        showNoLyrics: true
                    };
                });
            } else {
                throw new Error('Nothing done for lyrics');
            }
        })
        .catch(() => {
            this.setState(() => {
                return {
                    showNoLyrics: true
                };
            });
        })
    }

    onEnterPressed(e) {
        const key = e.key;
        if (key === 'Enter') {
            this.getSongData();
        }
    }

    onSearchButtonClicked() {
        this.getSongData();
    }

    onSearchCardClicked(name, artist) {
        this.getLyrics(name, artist);
    }


    render() {
        const songData = this.state.songData;
        const lyricsData = this.state.lyricsData;
        let songsToDisplay = null;
        if (songData) {
            songsToDisplay = <SearchCards songs={songData} onClick={this.onSearchCardClicked}/>;
        }

        return (
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.titleContainer}>
                        <h1>
                            <img id="univ" alt="picture.jpg"
                                 src="https://cdn.glitch.com/8d10671e-b841-4c9d-a4c4-28fba3dff985%2Fpitt_edu_logo.png?v=1606063786999"
                                 className="math" width="217"
                                 height="67" align="up"/>
                        </h1>
                        <h2> <font size="5" face="arial" color="#f5f5f5"> Lyrics Search For Spotify </font> </h2>
                        {/*<h3> </h3>*/}
                        {/*<h4> </h4>*/}
                        {/*<h5>Team Members:</h5>*/}
                        {/*<h5>Tiance Zhang - tiz57@pitt.edu</h5>*/}
                        {/*    <h5> Xueming Yang - xuy22@pitt.edu</h5>*/}
                        {/*        <h5>Zijing Gao - zig13@pitt.edu</h5>*/}

                    </div>
                    
                    { this.state.loginRequired ? <Backdrop><Login/></Backdrop> :
                    (
                    <React.Fragment>
                        <div className={styles.searchBarContainer}>
                            <input className={styles.searchBar} type="text" value={this.state.searchTerm} onChange={(e) => {this.onUserInput(e)}} onKeyDown={this.onEnterPressed} placeholder="Search Lyrics Here" />
                        </div>
                        <div className={styles.searchButtonContainer}>
                            <div className={styles.searchButton} onClick={this.onSearchButtonClicked}>Search🔍</div>
                        </div>

                        <iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3" width="345"
                                height="200" frameBorder="0" allowTransparency="true" allow="encrypted-media"> </iframe>
                        {songsToDisplay}
                        {/*<iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3" width="345"*/}
                        {/*        height="200" frameBorder="0" allowTransparency="true" allow="encrypted-media"> </iframe>*/}
                    </React.Fragment>

                    )}
                </div>

                <div className={styles.right}>
                    <LyricsSection lyrics={lyricsData} showNoLyrics={this.state.showNoLyrics}/>
                </div>





            </div>

        );
    }
}

export default SearchPage;