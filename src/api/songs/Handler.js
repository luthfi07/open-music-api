const ClientError = require('../../exceptions/ClientError');
class Handler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;

      this.postSongHandler = this.postSongHandler.bind(this);
      this.getSongsHandler = this.getSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
  
    async postSongHandler(request, h) {
      try {

        this._validator.validateSongPayload(request.payload);
        
        const { title = 'untitled', year, genre, performer, duration, albumId } = request.payload;
        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId});

        const response = h.response({
          status: 'success',
          message: 'Lagu berhasil ditambahkan',
          data: {
            songId,
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
  
    async getSongsHandler(request) {
      const songs = await this._service.getSongs();

      
      const seacrhTitle = request.query.title;
      const seacrhPerformer = request.query.performer;

      if (seacrhTitle != undefined && seacrhPerformer != undefined) {
        const songsQuery = songs.filter((n) => n.title.toLowerCase().includes(seacrhTitle) && n.performer.toLowerCase().includes(seacrhPerformer));
        return {
          status: 'success',
          data: {
            songs :songsQuery 
          },
        };
      } 

      if (seacrhTitle != undefined) {
        const songsQuery = songs.filter((n) => n.title.toLowerCase().includes(seacrhTitle));
        return {
          status: 'success',
          data: {
            songs :songsQuery 
          },
        };
      } 
      if (seacrhPerformer != undefined) {
        const songsQuery = songs.filter((n) => n.performer.toLowerCase().includes(seacrhPerformer));

        return {
          status: 'success',
          data: {
            songs :songsQuery
          },
        };
      }
      return {
        status: 'success',
        data: {
          songs ,
        },
      };
    }
  
    async getSongByIdHandler(request, h) {
      try {
        const { id } = request.params;
        const song = await this._service.getSongById(id);
        return {
          status: 'success',
          data: {
            song,
          },
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
  
    async putSongByIdHandler(request, h) {
      
      try {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;
  
        await this._service.editSongById(id, request.payload);
  
        return {
          status: 'success',
          message: 'Lagu berhasil diperbarui',
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
  
    async deleteSongByIdHandler(request, h) {
      try {
        const { id } = request.params;
        await this._service.deleteSongById(id);
        
        return {
          status: 'success',
          message: 'Lagu berhasil dihapus',
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