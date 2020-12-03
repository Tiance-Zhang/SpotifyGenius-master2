import React from 'react';
import SearchCard from './SearchCard/SearchCard';
import { uniqueId } from 'lodash';
import styles from './SearchCards.css';

class SearchCards extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        const currentSongs = this.props.songs;
        const nextSongs = nextProps.songs;
        let changed = false;
        if (currentSongs.length !== nextSongs.length) {
            return true;
        } else {
            currentSongs.forEach((song, index) => {
                let nextSong = nextSongs[index];
                if (song.name !== nextSong.name || song.artists !== nextSong.artists) {
                    changed = true;
                    return;
                }
            });
        }
        return changed;
    }

    render() {
        //props => songs, onClick
        const songCards = this.props.songs.map((song) => {
            return (
                <SearchCard key={uniqueId()} onClick={() => this.props.onClick(song.name, song.artists)} {...song}/>
                );
            });
            return (
                <div className={styles.songList}>
                    {songCards}
                </div>
        );
    };
}

export default SearchCards;