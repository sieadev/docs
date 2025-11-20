---
banner_title: "Jonion - Creating a Plugin"
banner_description: "Learn how to create your first Jonion plugin"
---

# 🎯 Creating a Plugin

This guide will walk you through creating your first Jonion plugin.

## Plugin Structure

A Jonion plugin consists of at least:

1. **Plugin Descriptor** - A YAML file (`plugin.yml`) with plugin metadata
2. **Main Plugin Class** - A class that extends your plugin base class

## Step 1: Create the Plugin Descriptor File

Create `src/main/resources/plugin.yml` in your plugin project:

```yaml
name: my-plugin
version: 1.0.0
description: My first Jonion plugin
main: com.example.plugins.MyPlugin
authors:
  - YourName
```

### Descriptor Fields

- **`name`** (required) - The unique identifier for your plugin
- **`version`** (optional) - Plugin version
- **`description`** (optional) - What your plugin does
- **`main`** (required) - The fully qualified class name of your plugin class
- **`authors`** (optional) - List of author names

## Step 2: Create the Plugin Class

Create your plugin class that extends your base plugin class:

```java
package com.example.plugins;

import com.example.api.MyPlugin;
import dev.siea.jonion.configuration.PluginConfig;

public class MyPlugin extends MyPlugin {
    
    @Override
    public void start() {
        getLogger().info("MyPlugin started!");
        
        // Load configuration
        PluginConfig config = getDefaultConfig();
        String message = config.getString("message", "Hello from MyPlugin!");
        getLogger().info(message);
    }
    
    @Override
    public void stop() {
        getLogger().info("MyPlugin stopped!");
    }
}
```

## Step 3: Build Your Plugin

Build your plugin as a JAR:

```bash
mvn clean package
```

Copy the JAR file from `target/` to your application's plugin directory (default: `plugins/`).
