const ActivitiesHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, { service }) => {
    const activitiesHandler = new ActivitiesHandler(service);
    server.route(routes(activitiesHandler));
  },
};