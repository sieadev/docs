---
banner_title: "Jonion - Plugin Dependencies"
banner_description: "Understanding and managing plugin dependencies"
---

# 🔗 Plugin Dependencies

Jonion automatically handles plugin dependencies and loads them in the correct order.

## Declaring Dependencies

Add dependencies to your `plugin.yml`:

```yaml
name: my-plugin
version: 1.0.0
main: com.example.plugins.MyPlugin
dependencies:
  required-plugin: true   # Required - plugin won't load without this
  optional-plugin: false  # Optional - plugin will load even if missing
```

### Required Dependencies

Required dependencies (`true`) must be present. If missing, your plugin won't load.

```yaml
dependencies:
  database-plugin: true
  api-plugin: true
```

### Optional Dependencies

Optional dependencies (`false`) are nice-to-have. Your plugin will load even if they're missing.

```yaml
dependencies:
  optional-feature: false
```

## Checking for Dependencies

You can check if a dependency is loaded:

```java
@Override
public void start() {
    PluginManager manager = getPluginWrapper().getPluginManager();
    PluginWrapper optional = manager.getPlugin("optional-plugin");
    
    if (optional != null) {
        getLogger().info("Optional plugin found!");
    } else {
        getLogger().info("Optional plugin not found.");
    }
}
```

## Loading Order

Jonion automatically loads plugins in the correct order:

1. Plugins with no dependencies load first
2. Plugins with dependencies load after their dependencies

For example:
- Plugin A (no dependencies) → loads first
- Plugin B (depends on A) → loads after A
- Plugin C (depends on B) → loads after B

## Circular Dependencies

Circular dependencies are not allowed and will cause both plugins to fail loading:

```yaml
# Plugin A
name: plugin-a
dependencies:
  plugin-b: true

# Plugin B  
name: plugin-b
dependencies:
  plugin-a: true
```

This will result in an error and both plugins will fail to load.
