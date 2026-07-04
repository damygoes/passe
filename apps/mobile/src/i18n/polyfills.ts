// Hermes does not ship Intl.PluralRules, which IntlMessageFormat needs for
// ICU plural messages. Import order matters: locale machinery first, then
// PluralRules, then its locale data for every supported locale.
import '@formatjs/intl-getcanonicallocales/polyfill.js'
import '@formatjs/intl-locale/polyfill.js'
import '@formatjs/intl-pluralrules/polyfill.js'
import '@formatjs/intl-pluralrules/locale-data/de.js'
import '@formatjs/intl-pluralrules/locale-data/en.js'
