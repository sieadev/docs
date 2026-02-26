---
banner_title: "Unifi4J - Java Client for Unifi Network API"
banner_description: "Reactive-style Java client for the Unifi Network API. Query sites, devices, and network info with a clean async API."
---

# Unifi4J

Unifi4J is a Java client for the **Unifi Network** API. It provides a reactive-style API so you can work with your Unifi controller programmatically—fetching sites, devices, and network info—either in a blocking way or asynchronously with callbacks and chained operations.

The client uses the Unifi **Network** integration API (not the legacy Controller API). You configure it with an API key and base URL; it handles HTTP calls, JSON (de)serialization, and maps API errors to typed exceptions. All service methods return `UnifiAction<T>`, which wraps a `CompletableFuture<T>`, so you can call `.complete()` to block, `.queue(success, failure)` for callbacks, or `.thenApply()` / `.thenCompose()` to chain async work.

Ready to get started? Follow the [Installation](/unifi4j/introduction/installation) and [Configuration](/unifi4j/introduction/configuration) guides.  
To use the API: [Network Service](/unifi4j/services/network-service), [Device Service](/unifi4j/services/device-service), and [Reactive API](/unifi4j/reactive-api).
