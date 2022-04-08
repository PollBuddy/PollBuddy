module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.3.6',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
    useSharedDBForAllJestWorkers: false,
  },
};