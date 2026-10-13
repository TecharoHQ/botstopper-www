# Installation

Use the Anubis installation instructions with the BotStopper image reference:

```diff
-ghcr.io/techarohq/anubis:latest
+ghcr.io/techarohq/botstopper/anubis:latest
```

## Binary packages

Binary packages are available [in the GitHub Releases tab](https://github.com/TecharoHQ/botstopper/releases). The repository is currently private, so that link works for team members. The main difference is that the package name is `techaro-botstopper`, the systemd service is `techaro-botstopper@your-instance.service`, the binary is `/usr/bin/botstopper`, and the configuration is in `/etc/techaro-botstopper`. Otherwise [everything here applies](https://anubis.techaro.lol/docs/admin/native-install).

## Docker / Podman

In order to pull the BotStopper image, you need to [authenticate with GitHub's Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry).

```text
docker login ghcr.io -u your-username --password-stdin
```

Then you can use the image as normal.

## Kubernetes

If you are using Kubernetes, you will need to create an image pull secret:

```text
kubectl create secret docker-registry \
  techarohq-botstopper \
  --docker-server ghcr.io \
  --docker-username your-username \
  --docker-password your-access-token \
  --docker-email your@email.address
```

Then attach it to your Deployment:

```diff
     spec:
       securityContext:
         fsGroup: 1000
+      imagePullSecrets:
+      - name: techarohq-botstopper
```

Next, read [configuration](/docs/configuration.md) for the Docker Compose options and example.
