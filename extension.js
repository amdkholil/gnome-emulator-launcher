import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const EmulatorIndicator = GObject.registerClass(
class EmulatorIndicator extends PanelMenu.Button {
    _init(settings) {
        super._init(0.0, 'Android Emulator Launcher');
        this._settings = settings;

        const icon = new St.Icon({
            icon_name: 'phone-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(icon);

        this._refreshMenu();
        this.menu.connect('open-state-changed', (menu, open) => {
            if (open) this._refreshMenu();
        });
    }

    _getEmulatorPath() {
        const customPath = this._settings?.get_string('sdk-path')?.trim();
        if (customPath) {
            const customExec = `${customPath}/emulator/emulator`;
            if (GLib.file_test(customExec, GLib.FileTest.IS_EXECUTABLE)) return customExec;
        }

        let systemPath = GLib.find_program_in_path('emulator');
        if (systemPath) return systemPath;

        const home = GLib.get_home_dir();
        const candidates = [
            `${home}/Data/apps/Android/Sdk/emulator/emulator`,
            `${home}/Android/Sdk/emulator/emulator`,
            '/opt/android-sdk/emulator/emulator'
        ];

        for (const cand of candidates) {
            if (GLib.file_test(cand, GLib.FileTest.IS_EXECUTABLE)) return cand;
        }

        return 'emulator';
    }

    _getAvds() {
        try {
            const emulatorPath = this._getEmulatorPath();
            const proc = Gio.Subprocess.new([emulatorPath, '-list-avds'], Gio.SubprocessFlags.STDOUT_PIPE);
            const [success, stdout] = proc.communicate_utf8(null, null);
            if (!success || !stdout) return [];
            return stdout.trim().split('\n').map(s => s.trim()).filter(Boolean);
        } catch (e) {
            console.error(`[AndroidEmulatorLauncher] Error listing AVDs: ${e}`);
            return [];
        }
    }

    _launchAvd(avd) {
        try {
            const emulatorPath = this._getEmulatorPath();
            Gio.Subprocess.new([emulatorPath, '-avd', avd], Gio.SubprocessFlags.NONE);
        } catch (e) {
            console.error(`[AndroidEmulatorLauncher] Failed to launch AVD ${avd}: ${e}`);
        }
    }

    _refreshMenu() {
        this.menu.removeAll();

        const avds = this._getAvds();
        if (avds.length === 0) {
            const item = new PopupMenu.PopupMenuItem('No AVDs found');
            item.reactive = false;
            this.menu.addMenuItem(item);
        } else {
            avds.forEach(avd => {
                const item = new PopupMenu.PopupMenuItem(avd);
                item.connect('activate', () => this._launchAvd(avd));
                this.menu.addMenuItem(item);
            });
        }

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const prefsItem = new PopupMenu.PopupMenuItem('Settings');
        prefsItem.connect('activate', () => {
            try {
                Gio.Subprocess.new(['gnome-extensions', 'prefs', 'android-emulator-launcher@kholil.dev'], Gio.SubprocessFlags.NONE);
            } catch (e) {
                console.error(`[AndroidEmulatorLauncher] Failed to open prefs: ${e}`);
            }
        });
        this.menu.addMenuItem(prefsItem);
    }
});

export default class AndroidEmulatorLauncherExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._indicator = new EmulatorIndicator(this._settings);
        Main.panel.addToStatusArea('android-emulator-launcher', this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
        this._settings = null;
    }
}
