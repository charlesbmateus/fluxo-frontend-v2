# Security Advisory Status

## nanotar Path Traversal Vulnerability (GHSA-92fh-27vv-894w)

### Status: Acknowledged - No Fix Available

### Summary
There is a moderate severity path traversal vulnerability in nanotar (versions <= 0.2.0), which is a transitive dependency of Nuxt.js 4.x.

### Details
- **Vulnerability**: Path traversal in parseTar() and parseTarGzip()
- **Affected Package**: nanotar@0.2.0 (and earlier)
- **Severity**: Moderate
- **CVE/Advisory**: GHSA-92fh-27vv-894w
- **Direct Dependency**: nuxt@4.3.1
- **Transitive Dependency**: nuxt → nanotar

### Why Not Fixed?
1. **No Patched Version**: nanotar 0.2.0 is the latest available version on npm (as of February 2026)
2. **Breaking Change Required**: The only "fix" suggested by npm is to downgrade from Nuxt 4.x to Nuxt 3.13.0, which:
   - Is a major version downgrade (breaking changes)
   - Would require significant code changes
   - Removes features and functionality
   - Is not a viable solution for this project

3. **Fixes in Development**: There are commits in the nanotar repository (after v0.2.0 release) that appear to address path handling issues, but these haven't been released yet

### Mitigation
1. **Audit Configuration**: Set `audit-level=high` in `.npmrc` to only fail CI/CD on high/critical vulnerabilities
2. **Monitoring**: Regularly check for nanotar updates
3. **Risk Assessment**: The path traversal vulnerability is moderate severity and requires specific conditions to exploit

### Next Steps
- Monitor for nanotar version 0.2.1 or higher release
- Update nanotar/nuxt when a patched version is available
- Remove the audit-level suppression once fixed

### References
- GitHub Advisory: https://github.com/advisories/GHSA-92fh-27vv-894w
- nanotar repository: https://github.com/unjs/nanotar
- Nuxt.js repository: https://github.com/nuxt/nuxt

### Last Updated
2026-02-11
