---
banner_title: "Jonion - Logging"
banner_description: "Using logging in your plugins"
---

# Logging

Each plugin gets its own logger instance automatically. The logger uses SLF4J, so you can configure it with your preferred logging framework (Logback, Log4j, etc.).

## Using the Logger

Access the logger in your plugin:

```java
import org.slf4j.Logger;

@Override
public void start() {
    Logger logger = getLogger();
    
    logger.info("Plugin started!");
    logger.warn("This is a warning");
    logger.error("An error occurred", exception);
    logger.debug("Debug information");
}
```

## Log Levels

The logger supports standard log levels:

```java
getLogger().trace("Very detailed information");
getLogger().debug("Debug information");
getLogger().info("Informational message");
getLogger().warn("Warning message");
getLogger().error("Error message");
getLogger().error("Error with exception", exception);
```

## Logger Naming

Each plugin's logger is automatically named after the plugin ID. This makes it easy to filter logs by plugin in your logging configuration.

For example, if your plugin ID is `my-plugin`, the logger name will be `my-plugin`.

## Logging Best Practices

1. **Use appropriate levels** - Use `info` for important events, `debug` for detailed information, `warn` for warnings, and `error` for errors
2. **Include context** - Add relevant information to log messages
3. **Log exceptions** - Always include exceptions when logging errors
4. **Avoid sensitive data** - Don't log passwords, tokens, or other sensitive information
5. **Use placeholders** - Use SLF4J's placeholder syntax for better performance

## Example: Good Logging

```java
@Override
public void start() {
    PluginDescriptor meta = getMetaData();
    
    getLogger().info("Starting {} v{}", meta.getPluginId(), meta.getVersion());
    
    try {
        PluginConfig config = getDefaultConfig();
        String message = config.getString("message", "Default");
        getLogger().debug("Loaded configuration: message={}", message);
        
        // Plugin logic...
        
        getLogger().info("Plugin {} started successfully", meta.getPluginId());
    } catch (Exception e) {
        getLogger().error("Failed to start plugin {}", meta.getPluginId(), e);
        throw e;
    }
}

@Override
public void stop() {
    getLogger().info("Stopping plugin {}", getMetaData().getPluginId());
    // Cleanup logic...
    getLogger().info("Plugin stopped");
}
```

## Configuring Logging

Since Jonion uses SLF4J, you can configure logging using any SLF4J-compatible logging framework:

- **Logback** - Add `logback-classic` dependency
- **Log4j 2** - Add `log4j-slf4j-impl` dependency
- **Java Util Logging** - Use `slf4j-jdk14` adapter

Configure your chosen framework's configuration file (e.g., `logback.xml`, `log4j2.xml`) to control log levels, formats, and outputs.
