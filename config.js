module.exports = {
  extends: [
    'config:recommended',
    'helpers:pinGitHubActionDigests'
  ],

  labels: ['renovate-dependencies'],

  dependencyDashboard: true,
  dependencyDashboardTitle: '🤖 Renovate Dependency Dashboard',
  dependencyDashboardAutoclose: true,

  hostRules: [
    {
      matchHost: 'europe-west3-docker.pkg.dev',
      hostType: 'docker',
      username: '_json_key',
      password: process.env.RENOVATE_GCP_DOCKER_PASSWORD
    }
  ],

  automerge: true,
  automergeType: 'pr',
  platformAutomerge: true,
  rebaseWhen: 'conflicted',

  ignorePaths: [
    '**/node_modules/**',
    '**/bower_components/**',
    '**/cypress/**'
  ],

  packageRules: [
    {
      matchManagers: ['gomod'],
      groupName: 'All Go dependencies',
      rangeStrategy: 'bump',
      postUpdateOptions: ['gomodUpdateImportPaths']
    },
    {
      matchManagers: ['github-actions'],
      groupName: 'github actions',
      separateMajorMinor: true,
      prPriority: 5
    },
    {
      matchManagers: ['pip_requirements'],
      groupName: 'python dependencies'
    },
    {
      matchDatasources: ['terraform-provider'],
      groupName: 'terraform providers'
    },
    {
      matchDatasources: ['docker'],
      groupName: 'docker images'
    },
    {
      matchManagers: ['custom.regex'], // Zmienione z 'regex'
      matchDatasources: ['docker'],
      matchCurrentVersion: 'v?\\d+\\.\\d+\\.\\d+',
      versioning: 'semver',
      groupName: 'custom docker images (semver) to {{newVersion}}'
    },
    {
      matchManagers: ['custom.regex'], // Zmienione z 'regex'
      matchDatasources: ['docker'],
      versioning: 'loose',
      groupName: 'custom docker images (loose) to {{newVersion}}'
    }
  ],

  customManagers: [
    {
      customType: 'regex', // W nowszych wersjach to zostaje, ale matchManagers musi być 'custom.regex'
      fileMatch: [
        '\\.ya?ml$',
        '\\.sh$',
        '\\.json$',
        '\\.tf$',
        '\\.tfvars$'
      ],
      matchStrings: [
        '(?<depName>(?:[a-z0-9.-]+\\.)?[a-z0-9.-]+/[a-z0-9._/-]+):(?<currentValue>v?[0-9][a-z0-9._-]*)(?:@(?<currentDigest>sha256:[a-f0-9]+))?'
      ],
      datasourceTemplate: 'docker'
    },
    {
      customType: 'regex',
      fileMatch: [
        '\\.ya?ml$',
        '\\.sh$',
        '\\.json$',
        '\\.tf$',
        '\\.tfvars$'
      ],
      matchStrings: [
        '(?<depName>(?:[a-z0-9.-]+\\.)?[a-z0-9.-]+/[a-z0-9._/-]+)@(?<currentDigest>sha256:[a-f0-9]+)'
      ],
      depNameTemplate: '{{{depName}}}',
      currentValueTemplate: 'latest',
      datasourceTemplate: 'docker'
    }
  ]
};