import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class AndroidEmulatorLauncherPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: _('Android SDK Settings'),
            description: _('Configure Android SDK directory location'),
        });

        const settings = this.getSettings();
        const defaultSdkPath = `${GLib.get_home_dir()}/Android/Sdk`;

        const row = new Adw.ActionRow({
            title: _('Android SDK Path'),
            subtitle: _('Default: ') + defaultSdkPath,
        });

        const entry = new Gtk.Entry({
            placeholder_text: defaultSdkPath,
            text: settings.get_string('sdk-path'),
            valign: Gtk.Align.CENTER,
            hexpand: true,
        });

        settings.bind(
            'sdk-path',
            entry,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );

        row.add_suffix(entry);
        group.add(row);
        page.add(group);
        window.add(page);
    }
}
