// Background script для управления расширением

// Открытие настроек при клике на иконку
browser.browserAction.onClicked.addListener(() => {
	browser.runtime.openOptionsPage()
})

// Инициализация при установке
browser.runtime.onInstalled.addListener(async (details) => {
	const browserLanguage = navigator.language
	console.log(browserLanguage) // Например: "ru-RU", "en-US", "fr"

	if (details.reason === 'install') {
		// Создаем примеры сниппетов при первой установке
		var exampleSnippets = []

		if (browserLanguage === 'ru-RU') {
			exampleSnippets = [
				{
					id: generateId(),
					label: 'Приветствие',
					shortcut: '/hi',
					body: '{Привет|Здравствуйте|Добрый день}! Как дела?',
					richText: false,
				},
				{
					id: generateId(),
					label: 'Email подпись',
					shortcut: '/sig',
					body: 'С уважением,\nВаше имя\nВаша должность',
					richText: false,
				},
			]
		} else {
			exampleSnippets = [
				{
					id: generateId(),
					label: 'Greeting',
					shortcut: '/hi',
					body: '{Hello|Hi|Good day}! How are you?',
					richText: false,
				},
				{
					id: generateId(),
					label: 'Email Signature',
					shortcut: '/sig',
					body: 'Best regards,\nYour Name\nYour Position',
					richText: false,
				},
			]
		}

		const defaultSettings = {
			enableSound: true,
			soundVolume: 0.5,
			enableAnimation: false,
			animationType: 'confetti',
			language: 'en',
		}

		await browser.storage.local.set({
			snippets: exampleSnippets,
			settings: defaultSettings,
		})

		// Открываем страницу настроек после установки
		browser.runtime.openOptionsPage()
	}
})

// Генерация уникального ID
function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Обработка сообщений от content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// TODO:
	// Здесь будет обработка сообщений
	return true
})
