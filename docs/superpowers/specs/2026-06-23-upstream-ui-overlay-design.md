# Upstream UI Sync and Image Overlay Design

## Goal

Synchronize this fork with the latest `BerriAI/litellm` source, retain the dashboard's English and Chinese internationalization, and package the compiled dashboard directly into an image based on `litellm/litellm:main-stable` without rebuilding the Python service.

## Scope

The upstream source tree will be synchronized as a whole so that the dashboard and server APIs remain compatible. Conflict resolution and custom development after the synchronization are limited to `ui/litellm-dashboard`, the UI image overlay, and repository metadata already changed by this fork. No new server behavior will be introduced.

The existing i18n context, locale files, language selector, and translated component calls are retained where they still apply. Pages moved or introduced by upstream are migrated to the same i18n mechanism. Components removed by upstream are not restored solely to preserve old translations.

## Integration Strategy

An integration branch will be created from the current `litellm_internal_staging` branch. The latest upstream `main` will be merged into it in one synchronization commit. Unrelated upstream server changes will be accepted as upstream authored them. UI conflicts will be resolved against the new App Router layout, using the upstream implementation as the functional baseline and reapplying internationalization where necessary.

The merge will preserve both upstream history and the fork's i18n commits. Individual upstream UI commits will not be cherry-picked because the dashboard depends on matching server routes and schemas.

## Container Architecture

`ui/Dockerfile` will become a multi-stage image overlay:

1. A pinned Node.js builder installs the dashboard lockfile with `npm ci` and runs the static Next.js export.
2. The runtime stage uses `litellm/litellm:main-stable` as its base.
3. The exported files are copied to `/var/lib/litellm/ui`.
4. `LITELLM_UI_PATH=/var/lib/litellm/ui` explicitly directs LiteLLM to the overlaid dashboard regardless of the base image's root or non-root layout.

The base image's entrypoint, command, Python environment, and server dependencies remain unchanged. Compiled UI files remain Docker build artifacts and are not committed to Git.

## Compatibility and Failure Handling

The build fails immediately if dependency installation or the Next.js export fails. The Docker build also verifies that the exported entry page exists before producing the runtime image. File ownership and permissions will allow the inherited LiteLLM runtime user to read the static files.

The image tag remains configurable through a Docker build argument while defaulting to `litellm/litellm:main-stable`. This permits reproducible pinning by deployment automation without changing the Dockerfile.

## Verification

Verification consists of:

- Dashboard dependency installation, linting, type checking, tests, and production build
- Docker image build using the `main-stable` base
- Inspection of the image environment and `/var/lib/litellm/ui` contents
- Starting the inherited LiteLLM server and checking its health endpoint
- Opening `/ui/`, signing in, switching between English and Chinese, and checking representative migrated pages
- Confirming the Git worktree contains no generated `out/` files

The representative UI review covers navigation, API keys, teams, models, usage, logs, MCP servers, guardrails, and settings because these areas received upstream route migrations or fixes after the fork point.

## Maintenance

Future upstream updates follow the same sequence: merge upstream first, resolve functional UI changes against upstream, update locale keys, run the UI and image verification suite, and publish a derived image. Server code remains an upstream concern unless a future requirement explicitly changes that boundary.
