const ClientError = require('../../exceptions/ClientError');

class ActivitiesHandler {
  constructor(service) {
    this._service = service;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
   
  }

 
  async getActivitiesHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
    
      await this._service.verifyActivitiesExist(id);  
      await this._service.verifyActivitiesOwner(id, credentialId);
      const Activities = await this._service.getActivities(id);
      return {
        status: 'success',
        data: {
          playlistId : id,
          activities:Activities,
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

module.exports = ActivitiesHandler;
