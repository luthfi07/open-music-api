const ClientError = require('../../exceptions/ClientError');
class Handler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;

      this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
      this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
      this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
      this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
      this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
      this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    }
  
    async postPlaylistHandler(request, h) {
      try {

        this._validator.validatePostPlaylistsPayload(request.payload);

        const { name = 'untitled' } = request.payload;
        const { id: credentialId } = request.auth.credentials;
     
        const playlistId = await this._service.addPlaylist({ name,  owner:credentialId });
  
  
        const response = h.response({
          status: 'success',
          message: 'Playlist berhasil ditambahkan',
          data: {
            playlistId,
          },
        });
        response.code(201);
        return response;
      } catch (error) {
       if (error instanceof ClientError){
         const response = h.response({
           status : 'fail',
           message : error.message,
         });
         response.code(error.statusCode);
         return response;
       }
        // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
     }
    }
    async getPlaylistsHandler(request) {
      const { id: credentialId } = request.auth.credentials;
    
      //console.log(credentialId);
      const playlist = await this._service.getPlaylists(credentialId);
      
     
      return {
        status: 'success',
        data: {
          playlists:playlist,
        },
      };
    }
  async deletePlaylistByIdHandler (request, h){
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      // console.log(id);
      // console.log(credentialId);
      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async postSongToPlaylistHandler(request, h){
    try {
      this._validator.validatePostPlaylistsSongPayload(request.payload);

      const {id:playlistId} = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._service.addSongToPlaylist({ playlistId, songId, credentialId });
     
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlist,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
     if (error instanceof ClientError){
       const response = h.response({
         status : 'fail',
         message : error.message,
       });
       response.code(error.statusCode);
       return response;
     }
      // Server ERROR!
    const response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    response.code(500);
    console.error(error);
    return response;
   }
  }
  async getSongsFromPlaylistHandler(request,h){
    try {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // console.log(credentialId);
    // console.log(playlistId);

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._service.getSongsFromPlaylist(credentialId, playlistId);
      
      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    }catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongFromPlaylistHandler(request, h){
    try {
      const { id: playlistId } = request.params;
      const {songId} = request.payload;
      const { id: credentialId } = request.auth.credentials;
      this._validator.validateDeleteSongPlaylistsPayload(request.payload);

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deleteSongFromPlaylist(playlistId,songId,credentialId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari Playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
   
  }
  
  module.exports = Handler;