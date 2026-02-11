export default [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:3000", "https://pmem-europa.de"],
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      jsonLimit: "100mb",
      formLimit: "100mb",
      textLimit: '200mb',
      formidable: { maxFileSize: 200 * 1024 * 1024 },
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
