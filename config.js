module.exports = {

  hostRules: process.env.RENOVATE_GCP_DOCKER_PASSWORD
    ? [
        {
          matchHost: 'europe-west3-docker.pkg.dev',
          hostType: 'docker',
          username: '_json_key_base64',
          password: process.env.RENOVATE_GCP_DOCKER_PASSWORD
        }
      ]
    : []
};