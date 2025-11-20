---
banner_title: "Jonion - Plugin Configurations"
banner_description: "Understanding and managing plugin configurations"
---

# Plugin Configurations

Jonion provides built-in support for plugin configurations. Each plugin can have its own configuration files that are automatically managed.

## Default Configuration

By default, Jonion looks for a `config.yml` file in your plugin's resources. This file will be automatically copied to the plugin's configuration directory when needed.

## Adding Configuration

Create `src/main/resources/config.yml` in your plugin project:

```yaml
message: "Welcome to MyPlugin!"
number: 42
enabled: true
```

This file will be copied to the plugin's config directory automatically when `saveDefaultConfig()` is called.

## Using Configuration

Access configuration in your plugin:

```java
import dev.siea.jonion.configuration.PluginConfig;

@Override
public void start() {
    PluginConfig config = getDefaultConfig();
    
    // Read values with defaults
    String message = config.getString("message", "Default message");
    int number = config.getInt("number", 10);
    boolean enabled = config.getBoolean("enabled", true);
    
    // Save default config if it doesn't exist
    getDefaultConfig().save();
    
    // Modify and save
    config.set("message", "Updated message");
    config.save();
}
```

## Configuration Methods

The `PluginConfig` class provides methods for reading and writing configuration values:

```java
// Strings
String value = config.getString("key");
String value = config.getString("key", "default");

// Numbers
int value = config.getInt("key");
int value = config.getInt("key", 0);
long value = config.getLong("key", 0L);
double value = config.getDouble("key", 0.0);
float value = config.getFloat("key", 0.0f);
short value = config.getShort("key", (short) 0);
byte value = config.getByte("key", (byte) 0);

// Booleans
boolean value = config.getBoolean("key");
boolean value = config.getBoolean("key", false);

// Generic
Object value = config.get("key");
Object value = config.get("key", defaultValue);

// Writing
config.set("key", value);
config.save();
```

## Multiple Configuration Files

You can access different configuration files:

```java
// Default config (config.yml)
PluginConfig defaultConfig = getDefaultConfig();

// Custom config file
PluginConfig customConfig = getConfig("custom-config.yml");
```

Both methods return a `PluginConfig` instance that you can use to read and write values.

## Saving Configuration

Always call `save()` after modifying configuration values:

```java
config.set("message", "New message");
config.set("number", 100);
config.save(); // Don't forget to save!
```
