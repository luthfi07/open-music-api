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
        notNull : true,
    },
    albumId : {
        type: 'VARCHAR(50)',
        primaryKey: true,
        references: '"albums"',
    }
   
  });
  pgm.createIndex('songs', 'albumId')
};
 
exports.down = (pgm) => {
  pgm.dropTable('albums')
  pgm.dropTable('songs');
};