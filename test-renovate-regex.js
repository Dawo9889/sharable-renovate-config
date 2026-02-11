// Test if Renovate regex pattern works

const pattern = /(?<depName>[a-z0-9.-]*\.[a-z0-9.-]*(?:\/[a-z0-9._-]+)+):(?<currentValue>v?[0-9][a-z0-9._-]*)(?:@(?<currentDigest>sha256:[a-f0-9]+))?/;

const tests = [
  "    - europe-docker.pkg.dev/kyma-project/prod/dashboard-token-proxy:v20260211-71e24fbd",
  "    - europe-docker.pkg.dev/kyma-project/prod/test-infra/rotate-service-account:v20260210-3236b3ca@sha256:69e6edc2d4db9343278e3859ce09fd04d9106444c5b70360c1a75ccd57c07806"
];

console.log("🧪 Testing Renovate regex pattern\n");

tests.forEach((line, i) => {
  console.log(`Test ${i + 1}:`);
  console.log(`  Line: ${line.trim().substring(0, 80)}...`);
  const match = line.match(pattern);
  if (match) {
    console.log("  ✅ MATCH!");
    console.log(`    depName: ${match.groups.depName}`);
    console.log(`    currentValue: ${match.groups.currentValue}`);
    if (match.groups.currentDigest) {
      console.log(`    currentDigest: ${match.groups.currentDigest.substring(0, 20)}...`);
    }
  } else {
    console.log("  ❌ NO MATCH");
  }
  console.log();
});
