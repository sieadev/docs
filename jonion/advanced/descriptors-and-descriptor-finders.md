---
banner_title: "Jonion - Descriptors & Descriptor Finders"
banner_description: "Custom Descriptors, Descriptor-Finders & Formats"
---

# Custom Descriptor Formats

By default, Jonion uses YAML descriptor files (`plugin.yml`). You can create custom descriptor finders to support other formats like JSON, XML, or any other format you prefer.

## Custom Descriptor File Name

If you want to use a different file name but still use YAML format:

```java
import dev.siea.jonion.descriptor.finder.YamlDescriptorFinder;
import java.nio.file.Paths;

MyPluginManager manager = new MyPluginManager(
    Paths.get("plugins"),
    new YamlDescriptorFinder("my-plugin.yml")
);
```

## Creating a Custom Descriptor Finder

To support a completely different format, implement the `PluginDescriptorFinder` interface:

```java
import dev.siea.jonion.descriptor.PluginDescriptor;
import dev.siea.jonion.descriptor.DefaultPluginDescriptor;
import dev.siea.jonion.descriptor.finder.PluginDescriptorFinder;
import dev.siea.jonion.depedency.PluginDependency;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class JsonDescriptorFinder implements PluginDescriptorFinder {
    
    @Override
    public PluginDescriptor findPluginDescriptor(Path path) {
        // Read JSON file from JAR
        // Parse JSON and extract plugin information
        // Return a PluginDescriptor
        
        // Example structure:
        String pluginId = "my-plugin"; // from JSON
        String description = "My plugin"; // from JSON
        String version = "1.0.0"; // from JSON
        String pluginClass = "com.example.MyPlugin"; // from JSON
        List<String> authors = new ArrayList<>(); // from JSON
        String license = "MIT"; // from JSON
        
        DefaultPluginDescriptor descriptor = new DefaultPluginDescriptor(
            pluginId, description, version, pluginClass, authors, license
        );
        
        // Add dependencies if any
        // descriptor.addDependency(new PluginDependency("other-plugin", true));
        
        return descriptor;
    }
}
```

## Using Your Custom Finder

Use your custom descriptor finder when creating the plugin manager:

```java
MyPluginManager manager = new MyPluginManager(
    Paths.get("plugins"),
    new JsonDescriptorFinder()
);
```

## Example: JSON Descriptor Format

If you were to implement JSON support, your descriptor might look like:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My plugin",
  "main": "com.example.MyPlugin",
  "authors": ["YourName"],
  "license": "MIT",
  "dependencies": {
    "other-plugin": true
  }
}
```

## Implementation Tips

1. **Read from JAR** - Use `JarFile` to read the descriptor file from the plugin JAR
2. **Handle Missing Files** - Return `null` if the descriptor file is not found
3. **Error Handling** - Handle parsing errors gracefully
4. **Dependencies** - Parse and add dependencies to the descriptor
5. **Validation** - Validate that required fields are present

## Default Implementation

The default `YamlDescriptorFinder` looks for `plugin.yml` in the JAR root. You can use it as a reference for implementing your own finder.
