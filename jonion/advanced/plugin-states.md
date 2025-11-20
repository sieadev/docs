---
banner_title: "Jonion - Plugin States"
banner_description: "Understanding plugin lifecycle states"
---

# Plugin States

Plugins go through different states during their lifecycle. Understanding these states helps you manage plugins effectively.

## Available States

- **`CREATED`** - Plugin wrapper created, but plugin class not yet loaded
- **`LOADED`** - Plugin class loaded and initialized, ready to use
- **`FAILED`** - Plugin failed to load or encountered an error
- **`UNLOADED`** - Plugin has been unloaded

## Checking Plugin State

Check a plugin's state:

```java
import dev.siea.jonion.PluginWrapper;
import dev.siea.jonion.lifecycle.PluginState;
import dev.siea.jonion.manager.PluginManager;

PluginManager manager = getPluginWrapper().getPluginManager();
PluginWrapper wrapper = manager.getPlugin("my-plugin");

if (wrapper != null) {
    PluginState state = wrapper.getState();
    
    switch (state) {
        case LOADED:
            getLogger().info("Plugin is loaded and ready");
            break;
        case FAILED:
            getLogger().warn("Plugin failed to load");
            break;
        case CREATED:
            getLogger().info("Plugin wrapper created but not loaded");
            break;
        case UNLOADED:
            getLogger().info("Plugin has been unloaded");
            break;
    }
}
```

## State Transitions

Plugins typically follow this lifecycle:

1. **CREATED** → Plugin wrapper is created when the JAR is discovered
2. **LOADED** → Plugin class is successfully loaded and initialized
3. **FAILED** → An error occurred during loading (can happen at any point)
4. **UNLOADED** → Plugin is unloaded when the manager shuts down

## Getting Plugins by State

You can get all plugins in a specific state:

```java
import dev.siea.jonion.manager.PluginManager;

PluginManager manager = getPluginWrapper().getPluginManager();

// Get all loaded plugins
List<PluginWrapper> loadedPlugins = manager.getPlugins(PluginState.LOADED);

// Get all failed plugins
List<PluginWrapper> failedPlugins = manager.getPlugins(PluginState.FAILED);
```

## Setting Plugin State

You typically don't need to set plugin states manually, but you can if needed:

```java
PluginWrapper wrapper = manager.getPlugin("my-plugin");
wrapper.setState(PluginState.FAILED);
```

**Note:** Setting states manually should be done carefully, as it can interfere with the plugin manager's internal state management.
