---
banner_title: "Unifi4J - Network Service"
banner_description: "Controller info and site listing with the Network service"
---

# Network Service

The **Network** service provides controller-level info and site listing. Get it from your `Unifi4J` instance with `unifi.network()` or `unifi.getService(NetworkService.class)`.

## Methods

| Method | Returns | Description |
|--------|--------|-------------|
| `getInfo()` | `UnifiAction<NetworkInfo>` | Application version and integration info. |
| `getSites()` | `UnifiAction<SitesResponse>` | All sites with default pagination. |
| `getSites(SitesQuery query)` | `UnifiAction<SitesResponse>` | Sites with offset, limit, and filters. |

## Controller info

```java
NetworkInfo info = unifi.network().getInfo().complete();
System.out.println("Version: " + info.getApplicationVersion());
```

## Sites with pagination and filter

```java
SitesQuery query = SitesQuery.builder()
        .offset(0)
        .limit(20)
        .filter(SiteFilterField.NAME, SiteFilterOperator.EQ, "Office")
        .build();
SitesResponse sites = unifi.network().getSites(query).complete();
```

All methods return `UnifiAction<T>`. See [Reactive API](/unifi4j/reactive-api) for blocking, callbacks, and chaining.
