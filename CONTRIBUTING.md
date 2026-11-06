# Contributing to TradeAPI SDK

Guide for setting up and working with the SDK after forking.

## Prerequisites

- Node.js >= 18
- Git
- VS Code (recommended)

## Setup

```bash
git clone <your-fork-url>
cd trade-sdk
npm install
```

## Environment Configuration

Generate a `.env` template:

```bash
npm run generate:env
```

Fill in your TradeAPI credentials:

```bash
TRADE_SDK_STAGE=staging
TRADE_SDK_USERNAME=your_username
TRADE_SDK_PASSWORD=your_password
TRADE_SDK_APP_ID=your_app_id
TRADE_SDK_APP_VERSION=1.0.0
TRADE_SDK_CLIENT_ID=your_client_id
TRADE_SDK_SEC=your_api_secret
```

The `.env` file includes optional configurations for logging, socket connections,
rate limiting, message queuing, and maintenance window detection.

## Development

```bash
npm run dev          # Run dev-test.ts for quick SDK testing
npm run type-check   # Verify TypeScript compiles
```

Run the automated setup script to configure hooks and verify tooling:

```bash
npm run dev:setup
```

## Testing

```bash
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
npm run test:ui         # Browser UI
```

## Building

The build step is optional -- examples import directly from source. Use it when
you need bundled output for deployment.

```bash
npm run build        # ESM + CJS bundles + type declarations
npm run build:api    # Regenerate API types from schema
npm run build:ts     # TypeScript declarations only
npm run clean        # Remove dist/
```

## Code Quality

Pre-commit hooks run linting and formatting automatically via Husky.

```bash
npm run lint         # Lint and auto-fix
npm run format       # Format all files
npm run lint:check   # Check only
npm run format:check # Check only
```

## Project Structure

```
trade-sdk/
├── index.ts            # Main entry point (all exports)
├── api/                # API types and endpoints
├── sdks/               # Core SDK implementation
├── types/              # Shared type definitions
├── utils/              # Utility functions (auth, etc.)
├── examples/           # Working example scripts
├── tests/              # Vitest unit tests
├── scripts/            # Build and setup scripts
├── docs/               # Documentation
│   └── public/         # Hand-written API reference
└── dist/               # Build output (optional)
```

## Debugging

- Set `TRADE_SDK_LOGGER_LEVEL=debug` in `.env` for verbose logging
- Check `logs/` for file-based log output
- VS Code launch configs are included for debugging

## Resources

- [API Reference](docs/public/API_REFERENCE.md)
- [Examples](examples/)
- [TypeScript Config](tsconfig.json)
