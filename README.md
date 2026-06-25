# datav-kit

Framework-agnostic visual decoration components for data dashboards, built on Web Components.

The project is currently in its foundation phase. The first packages are:

- `@datav-kit/shared`: framework-agnostic utilities.
- `@datav-kit/core`: Web Components primitives, registration helpers, events, and lifecycle controllers.
- `@datav-kit/elements`: public Web Components entrypoints.
- `@datav-kit/themes`: optional CSS variable themes.

Vue and React adapters are planned, but intentionally not part of the current foundation work.

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
pnpm lint
```

Architecture contracts live in [docs/architecture-contracts.md](./docs/architecture-contracts.md).

## License

[MIT](./LICENSE) License © [hackycy](https://github.com/hackycy)
