const { Pool } = require('pg');
const AuthorizationError = require('./../../exceptions/AuthorizationError')
const NotFoundError = require('./../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyActivitiesExist(Id) {
    const query = {
      text: `SELECT id FROM playlist_song_activities WHERE playlist_id = $1 `,
      values: [Id],
    };

    const result = await this._pool.query(query);
    
    if(!result.rows[0]){
        throw new NotFoundError;
    }

    return result.rows;
    
    
  }
  
  async getActivities(Id) {
    const query = {
      text: `SELECT username, title, action, time FROM playlist_song_activities 
      LEFT JOIN users ON users.id = playlist_song_activities.user_id
      LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
      WHERE playlist_id = $1 `,
      values: [Id],
    };

    const result = await this._pool.query(query);
    if(!result.rows){
        throw new NotFoundError;
    }

    return result.rows;
    
    
  }
  async verifyActivitiesOwner(playlistId, user_id) {
    const query = {
      text: `SELECT * FROM playlist_song_activities 
      LEFT JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
      WHERE playlist_id = $1 AND owner = $2 `,
      values: [playlistId, user_id],
    };
  
    const result = await this._pool.query(query);

    if(!result.rows.length){
        throw new AuthorizationError;
    }

   
    
    
  }
  
}

module.exports = ActivitiesService;
