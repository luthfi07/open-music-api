const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlalistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});


module.exports = {
    PostPlalistSongsPayloadSchema,
    PostPlaylistsPayloadSchema
};
