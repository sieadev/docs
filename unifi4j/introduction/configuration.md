---
banner_title: "Unifi4J - Configuration"
banner_description: "Configure API key, base URL, and SSL for the Unifi4J client"
---

# Configuration

Unifi4J is configured via a builder. You must call `build()` before using any service; the client verifies connectivity to the API during `build()`.

## Builder methods

| Method | Description |
|--------|-------------|
| `withApiKey(String)` | **Required.** API key for the Unifi Network integration. |
| `withBaseUri(String)` | Base URL of the Unifi Network API (e.g. `https://192.168.1.1/`). Defaults to `https://192.168.1.1/` if not set. |
| `allowInsecureSsl(boolean)` | When `true`, accepts self-signed certificates and skips hostname verification. See [Insecure SSL](#insecure-ssl) below. |

## Example

```java
Unifi4J unifi = Unifi4J.withApiKey("your-api-key")
        .withBaseUri("https://192.168.1.1/")
        .allowInsecureSsl(true)   // typical for local / IP-based controllers
        .build();
```

## Insecure SSL

**Unless your controller is reachable over HTTPS with a valid certificate and a proper hostname, you will need to call `allowInsecureSsl(true)`.**

Most Unifi setups use one of these:

- **IP-based URL** (e.g. `https://192.168.1.1/`) — The certificate won’t match the IP, so the default Java HTTP client will reject the connection. Enable insecure SSL so the client accepts the certificate anyway.
- **Self-signed certificate** — Common on local or lab controllers. Without a trusted CA, Java will refuse the connection unless you allow insecure SSL.
- **Valid SSL with a real hostname** (e.g. `https://unifi.example.com/` with a cert for that hostname) — In that case you can leave `allowInsecureSsl` as `false` (the default).

Enabling insecure SSL only affects this client: it accepts any certificate and skips hostname verification. Use it only for environments where you control the network (e.g. local or internal controller). For production over the public internet, prefer a proper certificate and leave insecure SSL disabled.

## How the client talks to the API

Internally, the client appends the Network integration path to your base URI: `/proxy/network/integration/v1/`. All requests use the `X-API-KEY` header with the key you provide. Use the same base URL you would use in a browser to reach the Unifi Network application (including trailing slash if you prefer; the client normalizes it).
