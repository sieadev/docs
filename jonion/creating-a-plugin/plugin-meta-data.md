---
banner_title: "Jonion - Plugin Metadata"
banner_description: "Accessing plugin metadata and information"
---

# Plugin Metadata

Every plugin has metadata that describes it. You can access this information through the `PluginDescriptor`.

## Accessing Metadata

Get information about your plugin:

```java
import dev.siea.jonion.descriptor.PluginDescriptor;

PluginDescriptor meta = getMetaData();

String id = meta.getPluginId();
String version = meta.getVersion();
String description = meta.getDescription();
List<String> authors = meta.getAuthors();
String license = meta.getLicense();
String pluginClass = meta.getPluginClass();
```

## Available Metadata Fields

- **`getPluginId()`** - The unique identifier of the plugin (from `name` in `plugin.yml`)
- **`getVersion()`** - The version of the plugin
- **`getDescription()`** - A description of what the plugin does
- **`getAuthors()`** - A list of author names
- **`getLicense()`** - The license of the plugin
- **`getPluginClass()`** - The fully qualified class name of the main plugin class
- **`getDependencies()`** - A list of plugin dependencies

## Example Usage

```java
@Override
public void start() {
    PluginDescriptor meta = getMetaData();
    
    getLogger().info("Starting {} v{}", meta.getPluginId(), meta.getVersion());
    getLogger().info("Description: {}", meta.getDescription());
    getLogger().info("Authors: {}", String.join(", ", meta.getAuthors()));
    
    // Check dependencies
    List<PluginDependency> deps = meta.getDependencies();
    if (!deps.isEmpty()) {
        getLogger().info("Dependencies: {}", deps.size());
    }
}
```

## Getting Metadata from Other Plugins

You can also access metadata from other plugins through the `PluginManager`:

```java
import dev.siea.jonion.manager.PluginManager;
import dev.siea.jonion.PluginWrapper;

PluginManager manager = getPluginWrapper().getPluginManager();
PluginWrapper otherPlugin = manager.getPlugin("other-plugin-id");

if (otherPlugin != null) {
    PluginDescriptor otherMeta = otherPlugin.getPluginDescriptor();
    getLogger().info("Other plugin version: {}", otherMeta.getVersion());
}
```
