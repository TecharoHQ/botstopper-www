# Configuration

## Docker compose

Use [the upstream Docker compose directions](https://anubis.techaro.lol/docs/admin/environments/docker-compose) with the following additional options:

```diff
   anubis:
     image: ghcr.io/techarohq/botstopper/anubis:latest
     environment:
       BIND: ":8080"
       DIFFICULTY: "4"
       METRICS_BIND: ":9090"
       SERVE_ROBOTS_TXT: "true"
       TARGET: "http://nginx"
       OG_PASSTHROUGH: "true"
       OG_EXPIRY_TIME: "24h"

+      # botstopper config here
+      CHALLENGE_TITLE: "Doing math for your connnection!"
+      ERROR_TITLE: "Something went wrong!"
+      OVERLAY_FOLDER: /assets
+    volumes:
+      - "./your_folder:/assets"
```

### Example

There is an example in [docker-compose.yaml](https://github.com/TecharoHQ/botstopper/blob/main/docker-compose.yaml). The repository is currently private, so that link works for team members. Start the example with `docker compose up`:

```text
docker compose up -d
```

And then open [https://botstopper.local.cetacean.club:8443](https://botstopper.local.cetacean.club:8443) in your browser.

NOTE: This uses locally signed sacrificial TLS certificates stored in `./demo/pki`. Your browser will rightly reject these. Here is what the example looks like:

See [customization](/docs/customization.md) for overlay folders and message titles.
See [headless browser detection](/docs/extensions/headless.md) and [the Soteria challenge](/docs/challenges/soteria.md) for challenge configuration.
