/* eslint-disable camelcase */

exports.shorthands = undefined;
 
exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
   
  })
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre : {
        type : 'VARCHAR(50)',
        notNull: true,
    },
    performer :{
        type : 'VARCHAR(50)',
        notNull: true,
    },
    duration : {
        type : 'INTEGER',
        notNull : false,
    },
    albumId : {
        type: 'VARCHAR(50)',
        notNull : false,

    }
    
  });
  pgm.addConstraint('songs', 'fk_songs.albumId_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
 
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
  
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
 
  });
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
 
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },

  });
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'VARCHAR(50)',
      notNull: true,
    },

  });
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
 
  
};


 
exports.down = (pgm) => {
 
  pgm.dropTable('playlist_songs')
  pgm.dropTable('authentications')
  pgm.dropTable('collaborations')
  pgm.dropTable('playlist_song_activities')
  pgm.dropTable('songs');
  pgm.dropTable('albums');
  pgm.dropTable('playlists');
  pgm.dropTable('users');

};