# About

BotStopper is made by Techaro, the team behind
[Anubis](https://anubis.techaro.lol), the open source proof-of-work bot
protection tool that many websites run behind. BotStopper is the
commercial patchset for Anubis: everything upstream does applies, plus
the additions organizations need.

## What BotStopper does

BotStopper sits in front of your site and evaluates every request
against a policy file. Rules match requests with regular expressions or
[CEL](https://cel.dev) (Common Expression Language) filters over request
data such as headers, and BotStopper adds its own CEL variables like
`headlessScore`. Rules can allow, deny, challenge, or add weight to a
request, and thresholds turn that weight into progressively stricter
responses.

On top of upstream Anubis, BotStopper currently adds:

- [Headless browser detection](/docs/extensions/headless.md): a
  WebAssembly detector that runs alongside the challenge and reports
  automation signals. Hard signals fail the challenge outright, and
  session scores and per-network counts feed back into CEL policy
  expressions. Results are exported as Prometheus metrics.
- [The Soteria challenge](/docs/challenges/soteria.md): an obfuscated
  virtual machine challenge that synthesizes programs at runtime and
  solves four of them at once with WASM SIMD, with reduced difficulty
  for phones.
- [Customization](/docs/customization.md): overlay folders for your own
  CSS, fonts, and images, plus custom message titles, so the challenge
  page carries your brand instead of ours.
- [Deployment packaging](/docs/installation.md): Docker and Podman
  images, Kubernetes support, and binary packages with templated systemd
  units for running many instances per host.
- [Proxy and service upgrades](/docs/upgrades.md): per-hostname TLS
  connection pools and per-instance runtime directories.

The defaults come from years of fighting unwanted automated traffic
without making websites hostile to humans: challenges that do the job
without drama, and detection that runs quietly in the background.

- Website: https://botstopper.net
- Source code: https://github.com/TecharoHQ
- Upstream Anubis documentation: https://anubis.techaro.lol/docs

Questions? [Contact us](/contact).
