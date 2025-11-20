---
banner_title: "Jonion - Error Handling"
banner_description: "Handling errors and exceptions in Jonion"
---

# Error Handling

Jonion provides specific exception types for different error scenarios. Understanding these exceptions helps you handle errors better.

## Exception Types

Jonion defines several exception types:

- **`PluginLoadException`** - Thrown when a plugin fails to load
- **`MissingDependencyException`** - Thrown when a required dependency is missing
- **`CircularDependencyException`** - Thrown when circular dependencies are detected
- **`ConfigException`** - Thrown when there's an error with configuration
- **`ConfigSaveException`** - Thrown when saving configuration fails
- **`DependencyException`** - General dependency-related exception
- **`PluginException`** - General plugin-related exception

## Handling Plugin Loading Errors

When loading plugins manually:

```java
import dev.siea.jonion.exceptions.PluginLoadException;
import dev.siea.jonion.exceptions.MissingDependencyException;
import dev.siea.jonion.exceptions.CircularDependencyException;
import dev.siea.jonion.PluginWrapper;

try {
    pluginWrapper.load();
} catch (PluginLoadException e) {
    logger.error("Failed to load plugin: {}", 
        pluginWrapper.getPluginDescriptor().getPluginId(), e);
} catch (MissingDependencyException e) {
    logger.error("Missing required dependency: {}", e.getMessage());
} catch (CircularDependencyException e) {
    logger.error("Circular dependency detected: {}", e.getMessage());
}
```

## Handling Configuration Errors

When working with configurations:

```java
import dev.siea.jonion.exceptions.ConfigException;
import dev.siea.jonion.exceptions.ConfigSaveException;
import dev.siea.jonion.configuration.PluginConfig;

try {
    PluginConfig config = getDefaultConfig();
    config.set("key", "value");
    config.save();
} catch (ConfigSaveException e) {
    getLogger().error("Failed to save configuration", e);
} catch (ConfigException e) {
    getLogger().error("Configuration error", e);
}
```

## Plugin Manager Error Handling

The `AbstractPluginManager` automatically handles many errors during plugin loading. Plugins that fail to load will be marked with `PluginState.FAILED` and logged.

You can check for failed plugins:

```java
import dev.siea.jonion.lifecycle.PluginState;
import dev.siea.jonion.manager.PluginManager;

PluginManager manager = getPluginWrapper().getPluginManager();
List<PluginWrapper> failedPlugins = manager.getPlugins(PluginState.FAILED);

if (!failedPlugins.isEmpty()) {
    getLogger().warn("{} plugins failed to load", failedPlugins.size());
    failedPlugins.forEach(plugin -> {
        getLogger().warn("Failed plugin: {}", 
            plugin.getPluginDescriptor().getPluginId());
    });
}
```

## Best Practices

1. **Always handle exceptions** - Don't let exceptions go unhandled
2. **Log errors appropriately** - Use appropriate log levels (error, warn, etc.)
3. **Provide context** - Include plugin IDs and relevant information in error messages
4. **Graceful degradation** - Handle errors in a way that doesn't crash your application
5. **Check plugin states** - Verify plugins are in the expected state before using them

## Example: Comprehensive Error Handling

```java
@Override
public void start() {
    try {
        PluginConfig config = getDefaultConfig();
        
        // Validate configuration
        if (config.getString("required-key") == null) {
            throw new ConfigException("Required configuration key is missing");
        }
        
        // Use configuration
        String value = config.getString("required-key");
        getLogger().info("Starting with value: {}", value);
        
    } catch (ConfigException e) {
        getLogger().error("Configuration error in plugin {}", getId(), e);
        // Handle error appropriately
    } catch (Exception e) {
        getLogger().error("Unexpected error in plugin {}", getId(), e);
        // Handle unexpected errors
    }
}
```
