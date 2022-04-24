const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
// const mapDBToModel = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
    
  }
  async addPlaylist({name, owner}){
  

    const id = nanoid(16);
    const query = {
        text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows[0].id) {
        throw new InvariantError('Playlist gagal ditambahkan');
      }
  
      return result.rows[0].id;

  }
   //*SELECT playlists.* FROM playlists
  //  LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
  //  LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
  //  WHERE playlist.owner = $1 OR collaborations.user_id = $1
  //  GROUP BY playlists.id
  async getPlaylists(owner){
  
    const query = {
        
        text: `SELECT playlists.id, playlists.name, users.username FROM playlists
        LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1`,
        values: [owner],
      };

    
  
      const result = await this._pool.query(query);
      
      return result.rows;
  }
  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist({ playlistId, songId, credentialId}){
    const id = nanoid(16);
    const idActivities = nanoid(16);
    const action = "add";
    const time =   new Date().toISOString();
    // console.log(playlistId);
    // console.log(songId);
    // console.log(credentialId);
    const checkSong = {
      text : `SELECT * FROM songs WHERE id = $1 `,
      values : [songId]
    }

    const resultCheckSong = await this._pool.query(checkSong);
    // console.log(resultCheck);
    if(!resultCheckSong.rows[0]){
      throw new NotFoundError('Lagu tidak Ditemukan');
    }
 

    const query = {
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
        values: [id, playlistId, songId],
      };
  
    const query1 = {
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [idActivities, playlistId, songId, credentialId, action, time],
      };
      
      
      const result = await this._pool.query(query);
      const result1 = await this._pool.query(query1);

      
      if (!result.rows[0].id && !result1.rows[0].id) {
        throw new InvariantError('Lagu Playlist gagal ditambahkan');
      }
  
      return result.rows[0].id;
  }

  async getSongsFromPlaylist(owner, playlistId){
    // console.log(owner);
    // console.log(playlistId);
    const query = {
        text: `SELECT playlists.id, name, username FROM playlists 
              LEFT JOIN users ON users.id = playlists.owner
              WHERE playlists.id = $1 AND owner = $2
              `,
        values: [playlistId, owner],
      };
      const query1 = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
        RIGHT JOIN songs ON songs.id = playlist_songs.song_id
       
        WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      const result1 = await this._pool.query(query1);
      
  
      if (result1.rows.length) {
  
        result.rows[0]["songs"] = result1.rows;
      }
      if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
  
      return result.rows[0];
  }

  async deleteSongFromPlaylist(playlistId, songId, userId ){
      const idActivities = nanoid(16);
      const action = 'delete';
      const time =   new Date().toISOString();
      // console.log(songId);
      // console.log(playlistId);
      // console.log(userId);
    const query = {
        text : `DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id`,
        values : [songId]
    }
    const query1 = {
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [idActivities, playlistId, songId, userId, action, time],
      };

      const result = await this._pool.query(query);
    
      const result1 = await this._pool.query(query1);
      if (!result.rows.length) {
        throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
      }
      if (!result1.rows.length) {
        throw new NotFoundError('Playlist activities gagal dibuat');
      }

  }
  async verifyPlaylistOwner(id, owner) {
    // console.log(id);
    // console.log(owner);
    
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

   
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  // async verifyNoteAccess(playlistId, userId) {
  //   try {
  //     await this.verifyNoteOwner(playlistId, userId);
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       throw error;
  //     }
  //     try {
  //       await this._collaborationService.verifyCollaborator(playlistId, userId);
  //     } catch {
  //       throw error;
  //     }
  //   }
  // }

  // async getUsersByUsername(username) {
  //   const query = {
  //     text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
  //     values: [`%${username}%`],
  //   };
  //   const result = await this._pool.query(query);
  //   return result.rows;
  // }
}

module.exports = PlaylistsService;