# Android Emulator Launcher (GNOME Shell Extension)

GNOME Shell Extension to quickly launch Android Virtual Devices (AVDs) directly from the top panel / taskbar.

## Features
- **Top Panel Icon**: Shows a phone icon on the GNOME Shell taskbar/panel.
- **AVD List**: Click the icon to display all available Android Virtual Devices created on your system.
- **One-Click Launch**: Click any AVD in the menu to start the emulator.
- **Custom SDK Path Settings**: Configure custom Android SDK directory path via Preferences (`prefs.js`).
- **Settings Shortcut**: Open settings directly from the extension menu.

## Installation

### Manual Installation
Clone this repository to your GNOME Shell extensions directory:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/
git clone git@github.com:amdkholil/gnome-emulator-launcher.git ~/.local/share/gnome-shell/extensions/android-emulator-launcher@kholil.dev
```

Compile the GSettings schema:
```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/android-emulator-launcher@kholil.dev/schemas/
```

### Enabling the Extension
Log out and log back in to reload GNOME Shell extensions, then enable it via terminal:

```bash
gnome-extensions enable android-emulator-launcher@kholil.dev
```

Or enable it using **Extensions** / **Extension Manager** GUI application.

## Configuration
If your Android SDK is located in a custom directory (default placeholder: `~/Android/Sdk`), open settings via:
- Menu dropdown -> **Settings**
- Terminal: `gnome-extensions prefs android-emulator-launcher@kholil.dev`

Set your SDK directory (e.g. `/home/user/Data/apps/Android/Sdk`).

## Compatibility
Supports GNOME Shell version 45, 46, 47, 48, 49, and 50.

## License
MIT
