---
banner_title: "Unifi4J - Reactive API"
banner_description: "Using UnifiAction for blocking, callbacks, and chained async calls"
---

# Reactive API

All service methods return **`UnifiAction<T>`**, which wraps a `CompletableFuture<T>`. You can use it in a blocking way, with callbacks, or by chaining further async work.

## UnifiAction methods

| Method | Description |
|--------|-------------|
| `complete()` | Block until the result is available; throws `UnifiException` (or a subclass) on failure. |
| `queue(success, failure)` | Run a success callback with the result, or a failure callback with the error. |
| `thenApply(fn)` | Transform the result with a function; returns a new `UnifiAction<U>`. |
| `thenCompose(fn)` | Chain another async action (e.g. use the result to call another API method). |
| `toFuture()` | Get the underlying `CompletableFuture<T>` for custom composition. |

## Blocking with `complete()`

```java
NetworkInfo info = unifi.network().getInfo().complete();
SitesResponse sites = unifi.network().getSites().complete();
DevicesResponse devices = unifi.device().getDevices(siteId).complete();
```

On failure, `complete()` throws an exception (e.g. `AuthenticationException`, `ApiException`, `NetworkException`). All extend `UnifiException`.

## Callbacks with `queue()`

```java
unifi.network().getSites().queue(
    sites -> System.out.println("Sites: " + sites.getTotalCount()),
    err -> System.err.println("Failed: " + err)
);
```

The first callback receives the result; the second receives the throwable (e.g. `UnifiException` or its cause).

## Chaining with `thenCompose()`

Use the result of one call to trigger the next. For example: get sites, then get devices for the first site.

```java
unifi.network().getSites()
        .thenCompose(sites -> {
            Site first = sites.getData().get(0);
            return unifi.device().getDevices(first.getId().toString());
        })
        .queue(
            devices -> System.out.println("Devices: " + devices.getTotalCount()),
            Throwable::printStackTrace
        );
```

## Transforming with `thenApply()`

```java
UnifiAction<Integer> countAction = unifi.network().getSites()
        .thenApply(sites -> sites.getTotalCount());
int count = countAction.complete();
```

## Errors

Failures are reported as:

- **`AuthenticationException`** — 401/403 (invalid or missing API key).
- **`RateLimitException`** — 429 (too many requests).
- **`ApiException`** — Other non-success HTTP response from the API.
- **`NetworkException`** — Transport/connection errors.

All of these extend **`UnifiException`**. When using `complete()`, they are thrown; when using `queue()` or `toFuture()`, they are passed to your failure handler or the `CompletableFuture`’s error path.

## Next steps

- [Network Service](/unifi4j/services/network-service) — Controller info and sites.
- [Device Service](/unifi4j/services/device-service) — Devices per site.
- [Configuration](/unifi4j/introduction/configuration) — How to configure the client.
