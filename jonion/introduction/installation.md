---
banner_title: "Jonion - Installation"
banner_description: "How to install Jonion and set up your Java project"
---

# 📦 Installation

Follow these steps to install Jonion and set up your project. Jonion is designed to be lightweight and easy to integrate, enabling you to build modular applications with clean plugin boundaries.

## 🔧 Requirements

- Java 17 or higher
- Maven (or Gradle)

## 📥 Add Jonion to Your Project



::: warning
**You should definitely create a multi-module project.** While a single-module project will work, it is **not optimal** and can lead to architectural issues.
:::

### ⚠️ Important: Multi-Module Project Structure
A multi-module Maven project (Gradle works too) with at least two modules is **strongly recommended**:
1. **API Module** – contains only the classes, interfaces, and utilities that plugins will interact with.
2. **App Module** – your main application that depends on the API module and initializes Jonion.


### Why Multi-Module is Essential


The multi-module structure ensures:

- **Clean Separation** – Plugins only see what the API exposes, keeping your application logic isolated
- **Proper Encapsulation** – Prevents plugins from accessing internal classes or implementation details
- **Better Architecture** – Enforces clear boundaries between your plugin API and application code
- **Easier Maintenance** – Changes to your application don't affect the plugin API contract

### Example Maven Multi-Module Structure

```bash
my-project/
├── pom.xml           # Parent POM
├── api/
│   ├── src  
│   └── pom.xml       # API module with plugin interfaces
└── app/
    ├── src  
    └── pom.xml       # App module that depends on API
```

### Single-Module Projects (Not Recommended)

While you *can* use Jonion in a single-module project, this approach has significant drawbacks:

- Plugins would need access to your entire application, breaking encapsulation
- Internal implementation details become part of your plugin API
- Makes it harder to maintain clean architecture
- Can lead to tight coupling between plugins and your application

**We strongly recommend using a multi-module structure for any serious project.**

## Adding Jonion to the API Module

In your API module's `pom.xml`, add Jonion as a dependency:

```xml
<dependency>
    <groupId>dev.siea.jonion</groupId>
    <artifactId>Jonion</artifactId>
    <version>${jonionversion}</version>
</dependency>
```

Replace `${jonionversion}` with the latest available version. [![Maven Central](https://img.shields.io/maven-central/v/dev.siea.jonion/Jonion?label=Maven%20Central)](https://central.sonatype.com/artifact/dev.siea.jonion/Jonion)  

## Next Steps

Continue to [Setting Up Your Plugin Manager](creating-a-plugin-system/setting-up-plugin-manager.md) to learn how to use Jonion in your application.
