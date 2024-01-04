import i18n from "../hooks/i18n.mjs";
import init from "../hooks/init.mjs";
import ready from "../hooks/ready.mjs";
import sidebar from "../hooks/sidebar.mjs";

export default function registerHooks() {
    init();
    ready();
    sidebar();
    i18n();
}