module.exports = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "SANS AGV API",
        version: "0.1.0",
        description:
          "AGV interface",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      servers: [
        {
          url: "https://sans-api-service.onrender.com/api/",
        },
        {
          url: "http://localhost:9000/api/",
        },
      ],
    },
    apis: ["./app/routes/*.js", "./app/models/*.js","./app/ws/*.js",],
  };