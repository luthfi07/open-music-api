const {
    PostPlaylistsPayloadSchema,
    PostPlaylistSongsPayloadSchema,
    DeletePlaylistSongPayloadSchema,  
  } = require('./schema');
  const InvariantError = require('../../exceptions/InvariantError');
  
  const PlaylistsValidator = {
    validatePostPlaylistsPayload: (payload) => {
      const validationResult = PostPlaylistsPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
    validatePostPlaylistsSongPayload: (payload) => {
      const validationResult = PostPlaylistSongsPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
    validateDeleteSongPlaylistsPayload: (payload) => {
      const validationResult = DeletePlaylistSongPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
   
  };
  
  module.exports = PlaylistsValidator;
  