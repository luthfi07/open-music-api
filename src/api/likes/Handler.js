const ClientError = require('../../exceptions/ClientError');

class LikesHandler {
  constructor(service) {
    this._service = service;

    this.getLikesHandler = this.getLikesHandler.bind(this);
    this.postLikesHandler = this.postLikesHandler.bind(this);   
    
  }
  async postLikesHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
    //   console.log(id);
    //   console.log(credentialId);
      var likes = ''; 

      await this._service.verifyAlbumExist(id);
      const checkLike = await this._service.checkUserLike(id,credentialId);
    //   console.log(checkLike);
      if (checkLike){
          await this._service.addUserLike(id, credentialId);
          likes = "menyukai";
      }else{
        await this._service.delUserLike(id,credentialId);
        likes = "tidak menyukai"
      }
    
      const response = h.response({
        status: 'success',
        message : 'anda '+likes+ ' album'
      
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getLikesHandler(request, h) {
    try {
      const { id } = request.params;
      const Likes = await this._service.getLikes(id);
      const totalLike = parseInt(Likes.total);
        // console.log(totalLike);
        const response = h.response({
          status: 'success',
          data : {
              likes : totalLike,
          }
        });
        if(Likes.cache){
          return response.header('X-Data-Source', 'cache');
        }else{
          return response.header('X-Data-Source', 'no-cache');
        }
      
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
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

module.exports = LikesHandler;
