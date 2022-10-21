import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css'
import '../TrackList/TrackList';
class Playlist extends React.Component {
    redner() {
        return(
        <div className="Playlist">
            <input defaultValue={"New Playlist"}/>
            {/* <TrackList /> */}
            <button className="Playlist-save">SAVE TO SPOTIFY</button>
        </div>
        )
    }
}
export default Playlist;