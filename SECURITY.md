# Security Policy

## Reporting a vulnerability

Email **info@beyondai.africa** with "Security" in the subject. Please do not open a
public issue or a pull request that demonstrates the problem.

Include what you can: the affected URL or file, what an attacker could do, and the steps
to reproduce. We will acknowledge within five working days.

Please do not run automated scanners, load tests, or brute-force attempts against
`beyondai.africa`. It is a small civic site on shared infrastructure, and that traffic is
indistinguishable from an attack.

## Scope

In scope: `beyondai.africa` and this repository.

Out of scope: our third-party processors — Vercel, AWS, Mailchimp and Luma. Report issues
in those to the vendor directly.

## What we hold

The database stores contact, volunteer and sponsorship enquiries — names, email
addresses, phone numbers and free-text messages submitted by the public. Newsletter
subscribers are held by Mailchimp. Anything touching those records is high priority.

## Practices

- CMS accounts are role-separated: editors manage content, admins additionally manage
  users and read submissions.
- Personal data in submissions is readable only by admins.
- Dependencies are audited weekly by Dependabot, and CI fails on high or critical
  advisories.
- Analytics cookies are set only after consent, and Sentry is configured not to capture
  request bodies, cookies or authorization headers.
