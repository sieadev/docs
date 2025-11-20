---
banner_title: "Jonion - Setting Up Your Plugin Manager"
banner_description: "Learn how to create and configure your PluginManager"
---

# 🔧 Setting Up Your Plugin Manager

You have two options for using Jonion:

## Option 1: Use the Default Implementation

The simplest way is to use `DefaultPluginManager` and `SimplePlugin` directly:

```java
import dev.siea.jonion.manager.DefaultPluginManager;
import dev.siea.jonion.impl.SimplePlugin;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        // Create plugin manager (loads plugins from "plugins" directory)
        DefaultPluginManager pluginManager = new DefaultPluginManager();
        
        // Start all plugins
        pluginManager.start();
        
        // Your application logic here...
        
        // Stop all plugins when shutting down
        pluginManager.stop();
    }
}
```

Your plugins would then extend `SimplePlugin`:

```java
import dev.siea.jonion.impl.SimplePlugin;

public class MyPlugin extends SimplePlugin {
    @Override
    public void start() {
        getLogger().info("Plugin started!");
    }
    
    @Override
    public void stop() {
        getLogger().info("Plugin stopped!");
    }
}
```

## Option 2: Create Your Own Plugin Base Class (Recommended)

For more control, create your own plugin base class in your **API module**:

```java
package com.example.api;

import dev.siea.jonion.Plugin;

public class MyPlugin extends Plugin {
    
    public void start() {
        // To be overridden by subclasses
    }
    
    public void stop() {
        // To be overridden by subclasses
    }
}
```

Then create a custom `PluginManager` in your **App module**:

```java
package com.example.app;

import com.example.api.MyPlugin;
import dev.siea.jonion.PluginWrapper;
import dev.siea.jonion.descriptor.finder.YamlDescriptorFinder;
import dev.siea.jonion.lifecycle.PluginState;
import dev.siea.jonion.manager.AbstractPluginManager;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicInteger;

public class MyPluginManager extends AbstractPluginManager {
    
    public MyPluginManager() {
        this(Paths.get("plugins"));
    }
    
    public MyPluginManager(Path directory) {
        super(directory, new YamlDescriptorFinder());
    }
    
    public void start() {
        AtomicInteger failedCount = new AtomicInteger();
        
        getPlugins().forEach(pluginWrapper -> {
            try {
                if (pluginWrapper.getState().equals(PluginState.LOADED)) {
                    ((MyPlugin) pluginWrapper.getPlugin()).start();
                }
            } catch (Throwable e) {
                pluginWrapper.setState(PluginState.FAILED);
                logger.error("Failed to start plugin: {}", 
                    pluginWrapper.getPluginDescriptor().getPluginId(), e);
                failedCount.getAndIncrement();
            }
        });
        
        logger.info("Successfully started {} plugins. {} failed.", 
            getPlugins().size() - failedCount.get(), failedCount.get());
    }
    
    public void stop() {
        getPlugins().forEach(pluginWrapper -> {
            try {
                if (pluginWrapper.getState().equals(PluginState.LOADED)) {
                    ((MyPlugin) pluginWrapper.getPlugin()).stop();
                }
            } catch (Throwable e) {
                logger.error("Failed to stop plugin: {}", 
                    pluginWrapper.getPluginDescriptor().getPluginId(), e);
            }
        });
        
        unloadPlugins();
    }
}
```

Use it in your main class:

```java
package com.example.app;

import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        MyPluginManager pluginManager = new MyPluginManager();
        pluginManager.start();
        
        // Your application logic...
        
        pluginManager.stop();
    }
}
```

## Custom Plugin Directory

You can specify a custom directory for plugins:

```java
// Use a custom directory
MyPluginManager manager = new MyPluginManager(Paths.get("my-plugins"));
```

## Next Steps

Now you're ready to create plugins! Continue to [Creating a Plugin](creating-a-plugin/plugin-introduction.md).
