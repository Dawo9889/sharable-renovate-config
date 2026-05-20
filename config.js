module.exports = {

  // ---------------------------------------------------------------------------
  // Host rules — credentials for private registries / GitHub Enterprise.
  // In pipeline mode, inject these via environment variables (CI secrets).
  // ---------------------------------------------------------------------------
  hostRules: [
    // Private GitHub Enterprise — github.tools.sap
    // Required for Renovate to resolve Go modules hosted on github.tools.sap
    // Pipeline: set RENOVATE_SAP_GITHUB_TOKEN as a CI secret
    ...(process.env.RENOVATE_SAP_GITHUB_TOKEN
      ? [
          {
            matchHost: 'github.tools.sap',
            hostType: 'github',
            token: process.env.RENOVATE_SAP_GITHUB_TOKEN,
          },
          {
            matchHost: 'github.tools.sap',
            hostType: 'github-tags',
            token: process.env.RENOVATE_SAP_GITHUB_TOKEN,
          },
        ]
      : []),
  ],

};