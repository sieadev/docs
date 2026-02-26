---
banner_title: "Unifi4J - Installation"
banner_description: "How to add Unifi4J to your Java project"
---

# Installation

Add Unifi4J to your project and create a client instance to start talking to the Unifi Network API.

## Requirements

- **Java 21+**
- Maven (or Gradle)

## Add the dependency

### Maven

In your `pom.xml`:

```xml
<dependency>
    <groupId>dev.siea.unifi4j</groupId>
    <artifactId>unifi4j</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

### Build from source

If you're using a local build of the library:

```bash
cd unifi4j
mvn clean install
```

Then depend on the same `groupId` and `artifactId` with the version produced by the build.

## Quick start

Create a client with your API key and controller base URL, then call the API. You must call `build()` before using any service; the client checks connectivity during `build()`.

```java
Unifi4J unifi = Unifi4J.withApiKey("your-api-key")
        .withBaseUri("https://192.168.1.1/")
        .allowInsecureSsl(true)   // for self-signed / IP-based controllers
        .build();

// Blocking
NetworkInfo info = unifi.network().getInfo().complete();
System.out.println("Version: " + info.getApplicationVersion());

// Async callback
unifi.network().getSites().queue(
    sites -> System.out.println("Sites: " + sites.getTotalCount()),
    err -> System.err.println("Failed: " + err)
);
```

## Next steps

- [Configuration](/unifi4j/introduction/configuration) — API key, base URI, and SSL (including when you need insecure SSL).
- [Network Service](/unifi4j/services/network-service) — Controller info and sites.
- [Device Service](/unifi4j/services/device-service) — Devices per site.
- [Reactive API](/unifi4j/reactive-api) — Using `UnifiAction` (blocking, callbacks, chaining).
