---
banner_title: "Unifi4J - Device Service"
banner_description: "List and query devices per site with the Device service"
---

# Device Service

The **Device** service lists devices for a given site. Get it with `unifi.device()` or `unifi.getService(DeviceService.class)`.

## Methods

| Method | Returns | Description |
|--------|--------|-------------|
| `getDevices(String siteId)` | `UnifiAction<DevicesResponse>` | All devices in the site (default pagination). |
| `getDevices(String siteId, DevicesQuery query)` | `UnifiAction<DevicesResponse>` | Devices with offset, limit, and filter. |

## Example

```java
DevicesQuery query = DevicesQuery.builder()
        .offset(0)
        .limit(50)
        .filter("state:eq:ONLINE")
        .build();
DevicesResponse devices = unifi.device().getDevices(siteId, query).complete();
```

All methods return `UnifiAction<T>`. See [Reactive API](/unifi4j/reactive-api) for blocking, callbacks, and chaining (e.g. get sites then get devices for the first site).
