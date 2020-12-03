import React from 'react';
import {uniqueId} from 'lodash';
import styles from './SearchCard.css';

export default (props) => {
    //Props: name, artists[], album_art{height, width, url}
    const artists = props.artists;
    const name = props.name;
    const albumArt = props.album_art;


    return (
        <li key={uniqueId()} className={styles.container} onClick={() => props.onClick(name, artists[0])}>

            <div className={styles.textContainer}>
                <p>{name}</p>
                <h6>{artists}</h6>
            </div>
        </li>
    );
};