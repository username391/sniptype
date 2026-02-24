// Internationalization
const translations = {
	ru: {
		import: 'Импорт',
		export: 'Экспорт',
		snippets: 'Сниппеты',
		new: 'Новый',
		settings: 'Настройки',
		settingsSaved: 'Настройки сохранены',
		addFirstSnippet: 'Добавьте свой первый сниппет',
		createSnippetDesc: 'Создайте сниппет для быстрой вставки текста',
		testSnippets: 'Тестирование сниппетов',
		testHint: 'Введите шорткат сниппета в поле ниже для проверки',
		snippetName: 'Название сниппета',
		delete: 'Удалить',
		shortcut: 'Шорткат',
		setShortcut: 'Укажите шорткат',
		snippetText: 'Текст сниппета',
		newSnippet: 'Новый сниппет',
		deleteSnippetQuestion: 'Удалить этот сниппет?',
		snippetDeleted: 'Сниппет удален',
		snippetPlaceholder: 'Используйте панель справа для вставки...',
		richText: 'Rich текст (HTML)',
		save: 'Сохранить',
		insertPanel: 'Панель вставки',
		randomization: 'Рандомизация',
		randomizationHint: 'Случайный выбор из вариантов',
		variantsPlaceholder: 'вариант1\nвариант2\nвариант3',
		insert: 'Вставить',
		clipboard: 'Буфер обмена',
		clipboardHint: 'Вставка из буфера обмена',
		insertClipboard: 'Вставить {clipboard}',
		variables: 'Переменные',
		comingSoon: 'Скоро...',
		formulas: 'Формулы',
		sound: 'Звук',
		enableSound: 'Включить звук при вставке',
		volume: 'Громкость',
		animation: 'Анимация (работает коряво, будет исправлено позже)',
		enableAnimation: 'Включить анимацию при вставке',
		animationType: 'Тип анимации',
		confettiAnimation: 'Конфетти',
		leavesAnimation: 'Падающие листья',
		sparkleAnimation: 'Искры',
		saveSettings: 'Сохранить настройки',
		// Уведомления
		toastEnterVariants: 'Введите варианты',
		toastRandomInserted: 'Рандомизация вставлена',
		toastClipboardInserted: 'Метка буфера обмена вставлена',
		toastEnterShortcut: 'Укажите шорткат',
		toastSnippetSaved: 'Сниппет сохранен',
		toastSnippetDeleted: 'Сниппет удален',
		toastSettingsSaved: 'Настройки сохранены',
		toastDataExported: 'Данные экспортированы',
		toastDataImported: 'Данные импортированы',
		toastImportError: 'Ошибка импорта',

		testSnippetPlaceHolder: 'Введите текст здесь',
	},
	en: {
		import: 'Import',
		export: 'Export',
		snippets: 'Snippets',
		new: 'New',
		settings: 'Settings',
		settingsSaved: 'Settings saved',
		addFirstSnippet: 'Add your first snippet',
		createSnippetDesc: 'Create a snippet for quick text insertion',
		testSnippets: 'Test Snippets',
		testHint: 'Type a snippet shortcut in the field below to test',
		snippetName: 'Snippet name',
		delete: 'Delete',
		shortcut: 'Shortcut',
		setShortcut: 'Set shortcut',
		snippetText: 'Snippet text',
		newSnippet: 'New snippet',
		deleteSnippetQuestion: 'Delete this snippet?',
		snippetDeleted: 'Snippet deleted',
		snippetPlaceholder: 'Use the right panel for insertion...',
		richText: 'Rich text (HTML)',
		save: 'Save',
		insertPanel: 'Insert Panel',
		randomization: 'Randomization',
		randomizationHint: 'Random choice from variants',
		variantsPlaceholder: 'variant1\nvariant2\nvariant3',
		insert: 'Insert',
		clipboard: 'Clipboard',
		clipboardHint: 'Insert from clipboard',
		insertClipboard: 'Insert {clipboard}',
		variables: 'Variables',
		comingSoon: 'Coming soon...',
		formulas: 'Formulas',
		sound: 'Sound',
		enableSound: 'Enable sound on insert',
		volume: 'Volume',
		animation: "Animation (doesn't work as intended, will be fixed soon)",
		enableAnimation: 'Enable animation on insert',
		animationType: 'Animation type',
		confettiAnimation: 'Confetti',
		leavesAnimation: 'Falling leaves',
		sparkleAnimation: 'Sparkle',
		saveSettings: 'Save settings',
		// Notifications
		toastEnterVariants: 'Enter variants',
		toastRandomInserted: 'Randomization inserted',
		toastClipboardInserted: 'Clipboard marker inserted',
		toastEnterShortcut: 'Enter shortcut',
		toastSnippetSaved: 'Snippet saved',
		toastSnippetDeleted: 'Snippet deleted',
		toastSettingsSaved: 'Settings saved',
		toastDataExported: 'Data exported',
		toastDataImported: 'Data imported',
		toastImportError: 'Import error',

		testSnippetPlaceHolder: 'Enter text here',
	},
}

let currentLang = 'en'

function setLanguage(lang) {
	currentLang = lang

	// Обновляем все элементы с data-i18n
	document.querySelectorAll('[data-i18n]').forEach((el) => {
		const key = el.getAttribute('data-i18n')
		if (translations[lang] && translations[lang][key]) {
			el.textContent = translations[lang][key]
		}
	})

	// Обновляем placeholder'ы
	document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
		const key = el.getAttribute('data-i18n-placeholder')
		if (translations[lang] && translations[lang][key]) {
			el.placeholder = translations[lang][key]
		}
	})

	// Обновляем HTML lang
	document.documentElement.lang = lang

	// Обновляем select
	const languageSelect = document.getElementById('languageSelect')
	if (languageSelect) {
		languageSelect.value = lang
	}
}

function initLanguage() {
	// Загружаем сохраненный язык
	browser.storage.local.get('settings').then((data) => {
		const lang = data.settings?.language || 'ru'
		setLanguage(lang)
	})

	// Устанавливаем обработчик для select
	const languageSelect = document.getElementById('languageSelect')
	if (languageSelect) {
		languageSelect.addEventListener('change', async () => {
			const lang = languageSelect.value
			setLanguage(lang)

			// Сохраняем в настройках
			const data = await browser.storage.local.get('settings')
			const settings = data.settings || {}
			settings.language = lang
			await browser.storage.local.set({ settings })
		})
	}
}

// Получить переведенный текст
function t(key) {
	return translations[currentLang]?.[key] || translations['ru']?.[key] || key
}
