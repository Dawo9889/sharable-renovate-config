module sharable-renovate-config

go 1.26.1

// Private GitHub Enterprise dependency — testing Renovate access to github.tools.sap
require (
	github.tools.sap/kyma/neighbors-contracts v0.0.0-20260423060355-772d2d4813ec
	github.tools.sap/dawid-test/renovate-test/go/logging v1.0.0
)

// Public dependency — intentionally outdated so Renovate will continuously propose bumps
require (
	github.com/stretchr/testify v1.7.0
)