# Upstream provenance

The implementation was informed by the security review of `sveltia/sveltia-cms-auth` revision `33674be7ec77c1b771983650d979cae88160e093` recorded in the Phase 5 and Phase 5B documents.

That upstream revision was not copied or deployed unchanged. OpenRedakt implemented a small dependency-free broker around the documented Decap popup protocol because the reviewed revision lacked required exact-origin, explicit callback, PKCE, staff authorization, response-hardening, and automated-test guarantees.

Maintenance owners must periodically compare the implementation with current GitHub OAuth and Decap protocol documentation. Upstream changes are references for review, never automatic updates. Any authentication behavior change requires focused security tests and non-production editorial acceptance before deployment.

