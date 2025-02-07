const I42N = {
	currentLanguage: "en",
	defaultLanguage: "en",
	languages: [],
	translations: {},
};

/**
 *
 * uyari verirse buradaki translations objesine ekle veya burayi toptan sil
 *
 * @param {object} param0
 * @param {"en" | "fr" | "de" | "tr"} param0.defaultLanguage
 * @param {{en: object, de: object, tr: object}} param0.translations
 *
 */
const init = ({ translations, defaultLanguage }) => {
	I42N.translations = translations;
	I42N.languages = Object.keys(translations);

	if (defaultLanguage) {
		I42N.defaultLanguage = defaultLanguage;
	} else {
		const preferredLanguage = navigator.language.split("-")[0];
		I42N.defaultLanguage = translations[preferredLanguage] ? preferredLanguage : "en";
	}

	I42N.currentLanguage = I42N.defaultLanguage;
};

const addLanguage = (language, translations) => {
	if (I42N.languages.includes(language)) {
		console.warn(`Language ${language} already exists`);
		return;
	}

	I42N.languages.push(language);
	I42N.translations[language] = translations;
};

/**
 * Retrieves a translation for a given key.
 * Supports nested keys using dot notation (e.g., "auth.login").
 * @param {string} key - The key of the translation (e.g., "auth.login").
 * @returns {string} - Translated string or the key if not found.
 */
const t = (key) => {
	const getNestedTranslation = (obj, path) =>
		path.split(".").reduce((acc, part) => (acc && acc[part] ? acc[part] : null), obj);

	let translation = getNestedTranslation(I42N.translations[I42N.currentLanguage], key);
	if (translation) return translation;

	console.warn(`Translation for key "${key}" not found in language "${I42N.currentLanguage}"`);

	translation = getNestedTranslation(I42N.translations[I42N.defaultLanguage], key);
	if (translation) return translation;

	console.warn(
		`Translation for key "${key}" not found in default language "${I42N.defaultLanguage}"`
	);

	return key;
};

const changeLanguage = (language) => {
	if (I42N.languages.includes(language)) {
		I42N.currentLanguage = language;
	} else {
		console.warn(`Language "${language}" not supported`);
	}
};

const getCurrentLanguage = () => I42N.currentLanguage;

const getSupportedLanguages = () => I42N.languages;

export { init, addLanguage, t, changeLanguage, getCurrentLanguage, getSupportedLanguages };
