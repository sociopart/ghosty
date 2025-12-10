const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://backend:5000',
      changeOrigin: true,
    })
  );

  app.use(
    '/cable',
    createProxyMiddleware({
      target: 'ws://backend:5000',
      ws: true,
    })
  );
};
