// Состояние приложения
let snippets = []
let settings = {
	enableSound: true,
	soundVolume: 0.5,
	enableAnimation: false,
	animationType: 'confetti',
	language: 'en',
}
let currentSnippetId = null
let currentView = 'home' // home, editor, settings

// DOM элементы
const snippetList = document.getElementById('snippetList')
const addSnippetBtn = document.getElementById('addSnippetBtn')
const homeBtn = document.getElementById('homeBtn')
const settingsBtn = document.getElementById('settingsBtn')

const homePanel = document.getElementById('homePanel')
const emptyState = document.getElementById('emptyState')
const testArea = document.getElementById('testArea')
const testTextarea = document.getElementById('testTextarea')
const editorPanel = document.getElementById('editorPanel')
const settingsPanel = document.getElementById('settingsPanel')

const snippetLabel = document.getElementById('snippetLabel')
const snippetShortcut = document.getElementById('snippetShortcut')
const snippetBody = document.getElementById('snippetBody')
const snippetRichText = document.getElementById('snippetRichText')
const saveSnippetBtn = document.getElementById('saveSnippetBtn')
const deleteSnippetBtn = document.getElementById('deleteSnippetBtn')

const enableSound = document.getElementById('enableSound')
const soundVolume = document.getElementById('soundVolume')
const volumeValue = document.getElementById('volumeValue')
const enableAnimation = document.getElementById('enableAnimation')
const animationType = document.getElementById('animationType')
const saveSettingsBtn = document.getElementById('saveSettingsBtn')

const insertRandomBtn = document.getElementById('insertRandomBtn')
const randomVariants = document.getElementById('randomVariants')
const insertClipboardBtn = document.getElementById('insertClipboardBtn')

const importBtn = document.getElementById('importBtn')
const exportBtn = document.getElementById('exportBtn')
const importFile = document.getElementById('importFile')
const toast = document.getElementById('toast')

// Language Toggle
const languageToggleBtn = document.getElementById('languageToggleBtn')
const currentFlag = document.getElementById('currentFlag')
const currentLanguageName = document.getElementById('currentLanguageName')

languageToggleBtn.addEventListener('click', toggleLanguage)

// Доступные языки
const languages = [
	{
		code: 'ru',
		name: 'Русский',
		flag: `<rect width="512" height="512" rx="64" fill="#F5F5F5"/>
			<rect width="512" height="170.667" rx="0" fill="#F5F5F5"/>
			<rect y="170.667" width="512" height="170.667" fill="#41479B"/>
			<rect y="341.333" width="512" height="170.667" fill="#FF4B55"/>`,
	},
	{
		code: 'en',
		name: 'English',
		flag: `<rect width="512" height="512" rx="64" fill="#F5F5F5"/>
			<rect width="512" height="39.384" fill="#F5F5F5"/>
			<rect y="39.384" width="512" height="39.384" fill="#FF4B55"/>
			<rect y="78.768" width="512" height="39.384" fill="#F5F5F5"/>
			<rect y="117.152" width="512" height="39.384" fill="#FF4B55"/>
			<rect y="156.536" width="512" height="39.384" fill="#F5F5F5"/>
			<rect y="194.92" width="512" height="39.384" fill="#FF4B55"/>
			<rect y="234.304" width="512" height="39.384" fill="#F5F5F5"/>
			<rect y="272.688" width="512" height="39.384" fill="#FF4B55"/>
			<rect y="312.072" width="512" height="39.384" fill="#F5F5F5"/>
			<rect y="350.456" width="512" height="39.384" fill="#FF4B55"/>
			<rect y="389.84" width="512" height="39.384" fill="#F5F5F5"/>
			<rect y="428.224" width="512" height="39.384" fill="#FF4B55"/>
			<rect y="467.608" width="512" height="44.392" fill="#F5F5F5"/>
			<rect width="256" height="272.696" fill="#41479B"/>
			<path d="M27.824 38.792L31.776 51.024H44.52L34.192 58.616L38.144 70.848L27.824 63.256L17.496 70.848L21.448 58.616L11.12 51.024H23.872L27.824 38.792Z" fill="#F5F5F5"/>
			<path d="M84.656 38.792L88.608 51.024H101.352L91.024 58.616L94.976 70.848L84.656 63.256L74.328 70.848L78.28 58.616L67.952 51.024H80.704L84.656 38.792Z" fill="#F5F5F5"/>
			<path d="M141.488 38.792L145.44 51.024H158.184L147.856 58.616L151.808 70.848L141.488 63.256L131.16 70.848L135.112 58.616L124.784 51.024H137.536L141.488 38.792Z" fill="#F5F5F5"/>
			<path d="M198.32 38.792L202.272 51.024H215.016L204.688 58.616L208.64 70.848L198.32 63.256L187.992 70.848L191.944 58.616L181.616 51.024H194.368L198.32 38.792Z" fill="#F5F5F5"/>
			<path d="M56.24 77.56L60.192 89.792H72.936L62.608 97.384L66.56 109.616L56.24 102.024L45.912 109.616L49.864 97.384L39.536 89.792H52.288L56.24 77.56Z" fill="#F5F5F5"/>
			<path d="M113.072 77.56L117.024 89.792H129.768L119.44 97.384L123.392 109.616L113.072 102.024L102.744 109.616L106.696 97.384L96.368 89.792H109.12L113.072 77.56Z" fill="#F5F5F5"/>
			<path d="M169.904 77.56L173.856 89.792H186.6L176.272 97.384L180.224 109.616L169.904 102.024L159.576 109.616L163.528 97.384L153.2 89.792H165.952L169.904 77.56Z" fill="#F5F5F5"/>
			<path d="M226.736 77.56L230.688 89.792H243.432L233.104 97.384L237.056 109.616L226.736 102.024L216.408 109.616L220.36 97.384L210.032 89.792H222.784L226.736 77.56Z" fill="#F5F5F5"/>
			<path d="M27.824 116.328L31.776 128.56H44.52L34.192 136.152L38.144 148.384L27.824 140.792L17.496 148.384L21.448 136.152L11.12 128.56H23.872L27.824 116.328Z" fill="#F5F5F5"/>
			<path d="M84.656 116.328L88.608 128.56H101.352L91.024 136.152L94.976 148.384L84.656 140.792L74.328 148.384L78.28 136.152L67.952 128.56H80.704L84.656 116.328Z" fill="#F5F5F5"/>
			<path d="M141.488 116.328L145.44 128.56H158.184L147.856 136.152L151.808 148.384L141.488 140.792L131.16 148.384L135.112 136.152L124.784 128.56H137.536L141.488 116.328Z" fill="#F5F5F5"/>
			<path d="M198.32 116.328L202.272 128.56H215.016L204.688 136.152L208.64 148.384L198.32 140.792L187.992 148.384L191.944 136.152L181.616 128.56H194.368L198.32 116.328Z" fill="#F5F5F5"/>
			<path d="M56.24 155.096L60.192 167.328H72.936L62.608 174.92L66.56 187.152L56.24 179.56L45.912 187.152L49.864 174.92L39.536 167.328H52.288L56.24 155.096Z" fill="#F5F5F5"/>
			<path d="M113.072 155.096L117.024 167.328H129.768L119.44 174.92L123.392 187.152L113.072 179.56L102.744 187.152L106.696 174.92L96.368 167.328H109.12L113.072 155.096Z" fill="#F5F5F5"/>
			<path d="M169.904 155.096L173.856 167.328H186.6L176.272 174.92L180.224 187.152L169.904 179.56L159.576 187.152L163.528 174.92L153.2 167.328H165.952L169.904 155.096Z" fill="#F5F5F5"/>
			<path d="M226.736 155.096L230.688 167.328H243.432L233.104 174.92L237.056 187.152L226.736 179.56L216.408 187.152L220.36 174.92L210.032 167.328H222.784L226.736 155.096Z" fill="#F5F5F5"/>
			<path d="M27.824 193.864L31.776 206.096H44.52L34.192 213.688L38.144 225.92L27.824 218.328L17.496 225.92L21.448 213.688L11.12 206.096H23.872L27.824 193.864Z" fill="#F5F5F5"/>
			<path d="M84.656 193.864L88.608 206.096H101.352L91.024 213.688L94.976 225.92L84.656 218.328L74.328 225.92L78.28 213.688L67.952 206.096H80.704L84.656 193.864Z" fill="#F5F5F5"/>
			<path d="M141.488 193.864L145.44 206.096H158.184L147.856 213.688L151.808 225.92L141.488 218.328L131.16 225.92L135.112 213.688L124.784 206.096H137.536L141.488 193.864Z" fill="#F5F5F5"/>
			<path d="M198.32 193.864L202.272 206.096H215.016L204.688 213.688L208.64 225.92L198.32 218.328L187.992 225.92L191.944 213.688L181.616 206.096H194.368L198.32 193.864Z" fill="#F5F5F5"/>
			<path d="M56.24 232.632L60.192 244.864H72.936L62.608 252.456L66.56 264.688L56.24 257.096L45.912 264.688L49.864 252.456L39.536 244.864H52.288L56.24 232.632Z" fill="#F5F5F5"/>
			<path d="M113.072 232.632L117.024 244.864H129.768L119.44 252.456L123.392 264.688L113.072 257.096L102.744 264.688L106.696 252.456L96.368 244.864H109.12L113.072 232.632Z" fill="#F5F5F5"/>
			<path d="M169.904 232.632L173.856 244.864H186.6L176.272 252.456L180.224 264.688L169.904 257.096L159.576 264.688L163.528 252.456L153.2 244.864H165.952L169.904 232.632Z" fill="#F5F5F5"/>
			<path d="M226.736 232.632L230.688 244.864H243.432L233.104 252.456L237.056 264.688L226.736 257.096L216.408 264.688L220.36 252.456L210.032 244.864H222.784L226.736 232.632Z" fill="#F5F5F5"/>`,
	},
]

// Переключение языка
async function toggleLanguage() {
	const currentIndex = languages.findIndex(
		(lang) => lang.code === settings.language,
	)
	const nextIndex = (currentIndex + 1) % languages.length
	const nextLang = languages[nextIndex]

	settings.language = nextLang.code
	await saveData()
	updateLanguageDisplay()
	initLanguage() // Вызываем существующую функцию инициализации языка
}

// Обновление отображения языка
function updateLanguageDisplay() {
	const lang = languages.find((l) => l.code === settings.language)
	if (lang) {
		// Safely render SVG flag using DOMParser (avoid innerHTML)
		while (currentFlag.firstChild)
			currentFlag.removeChild(currentFlag.firstChild)
		try {
			const doc = new DOMParser().parseFromString(
				lang.flag,
				'image/svg+xml',
			)
			const svg = doc.documentElement
			currentFlag.appendChild(svg)
		} catch (e) {
			const span = document.createElement('span')
			span.textContent = lang.flag
			currentFlag.appendChild(span)
		}
		currentLanguageName.textContent = lang.name
	}
}

// Инициализация
async function init() {
	await loadData()
	initLanguage()
	renderSnippetList()
	updateView()
	setupEventListeners()
	setupTestArea()
}

// Загрузка данных
async function loadData() {
	const data = await browser.storage.local.get(['snippets', 'settings'])
	snippets = data.snippets || []
	settings = data.settings || {
		enableSound: true,
		soundVolume: 0.5,
		enableAnimation: false,
		animationType: 'confetti',
		language: 'en',
	}

	enableSound.checked = settings.enableSound
	soundVolume.value = Math.round(settings.soundVolume * 100)
	volumeValue.textContent = Math.round(settings.soundVolume * 100) + '%'
	enableAnimation.checked = settings.enableAnimation
	animationType.value = settings.animationType
}

// Сохранение данных
async function saveData() {
	await browser.storage.local.set({ snippets, settings })
}

// Рендер списка сниппетов
function renderSnippetList() {
	// snippetList.innerHTML = ''
	while (snippetList.firstChild) {
		snippetList.removeChild(snippetList.firstChild)
	}

	snippets.forEach((snippet) => {
		const item = document.createElement('div')
		item.className = 'snippet-item'
		if (snippet.id === currentSnippetId && currentView === 'editor') {
			item.classList.add('active')
		}

		// Build label and shortcut safely
		const labelDiv = document.createElement('div')
		labelDiv.className = 'snippet-item-label'
		labelDiv.textContent = snippet.label

		const shortcutDiv = document.createElement('div')
		shortcutDiv.className = 'snippet-item-shortcut'
		shortcutDiv.textContent = snippet.shortcut

		item.appendChild(labelDiv)
		item.appendChild(shortcutDiv)

		item.addEventListener('click', () => selectSnippet(snippet.id))
		snippetList.appendChild(item)
	})
}

// Обновление вида
function updateView() {
	// Скрываем все панели
	homePanel.style.display = 'none'
	editorPanel.style.display = 'none'
	settingsPanel.style.display = 'none'

	// Убираем active класс с настроек
	settingsBtn.classList.remove('active')

	if (currentView === 'home') {
		homePanel.style.display = 'block'
		if (snippets.length === 0) {
			emptyState.style.display = 'block'
			testArea.style.display = 'none'
		} else {
			emptyState.style.display = 'none'
			testArea.style.display = 'block'
		}
	} else if (currentView === 'editor' && currentSnippetId) {
		editorPanel.style.display = 'block'
		loadSnippetIntoEditor()
	} else if (currentView === 'settings') {
		settingsPanel.style.display = 'block'
		settingsBtn.classList.add('active')
	}

	renderSnippetList()
}

// Показать домашнюю панель
function showHome() {
	currentView = 'home'
	currentSnippetId = null
	updateView()
}

// Показать настройки
function showSettings() {
	currentView = 'settings'
	currentSnippetId = null
	updateView()
}

// Выбор сниппета
function selectSnippet(id) {
	currentSnippetId = id
	currentView = 'editor'
	updateView()
}

// Загрузка сниппета в редактор
function loadSnippetIntoEditor() {
	const snippet = snippets.find((s) => s.id === currentSnippetId)
	if (snippet) {
		snippetLabel.value = snippet.label
		snippetShortcut.value = snippet.shortcut
		snippetBody.value = snippet.body
		snippetRichText.checked = snippet.richText || false
	}
}

// Создание нового сниппета
function createNewSnippet() {
	const newSnippet = {
		id: generateId(),
		label: t('newSnippet'),
		shortcut: '/',
		body: '',
		richText: false,
	}

	snippets.push(newSnippet)
	currentSnippetId = newSnippet.id
	currentView = 'editor'

	saveData()
	updateView()

	snippetLabel.focus()
	snippetLabel.select()
}

// Сохранение текущего сниппета
async function saveCurrentSnippet() {
	if (!currentSnippetId) return

	const snippet = snippets.find((s) => s.id === currentSnippetId)
	if (snippet) {
		snippet.label = snippetLabel.value.trim() || 'Без названия'
		snippet.shortcut = snippetShortcut.value.trim()
		snippet.body = snippetBody.value
		snippet.richText = snippetRichText.checked

		if (!snippet.shortcut) {
			showToast('setShortcut', 'error')
			return
		}

		await saveData()
		renderSnippetList()
		showToast('toastSnippetSaved')
	}
}

// Удаление сниппета
async function deleteCurrentSnippet() {
	if (!currentSnippetId) return

	if (confirm(t('deleteSnippetQuestion'))) {
		snippets = snippets.filter((s) => s.id !== currentSnippetId)
		currentSnippetId = null
		currentView = 'home'

		await saveData()
		updateView()
		showToast(t('snippetDeleted'), 'success')
	}
}

// Вставка рандомизации
function insertRandomization() {
	const variants = randomVariants.value.split('\n').filter((v) => v.trim())
	if (variants.length === 0) {
		showToast('toastEnterVariants', 'warning')
		return
	}

	const text = '{' + variants.join('|') + '}'
	insertAtCursor(snippetBody, text)
	randomVariants.value = ''
	showToast('toastRandomInserted')
}

// Вставка буфера обмена
async function insertClipboard() {
	insertAtCursor(snippetBody, '{clipboard}')
	showToast('toastClipboardInserted')
}

// Вставка текста в позицию курсора
function insertAtCursor(textarea, text) {
	const start = textarea.selectionStart
	const end = textarea.selectionEnd
	const value = textarea.value

	textarea.value = value.substring(0, start) + text + value.substring(end)
	textarea.selectionStart = textarea.selectionEnd = start + text.length
	textarea.focus()
}

// Настройка тестовой области
function setupTestArea() {
	if (!testTextarea) return

	// Применяем логику content script для тестирования
	testTextarea.addEventListener('keyup', (e) => {
		if (e.ctrlKey || e.metaKey || e.altKey) return

		const text = testTextarea.value.substring(
			0,
			testTextarea.selectionStart,
		)

		for (const snippet of snippets) {
			if (text.endsWith(snippet.shortcut)) {
				const processed = processSnippetBody(snippet.body)
				const start =
					testTextarea.selectionStart - snippet.shortcut.length
				const end = testTextarea.selectionStart

				testTextarea.value =
					testTextarea.value.substring(0, start) +
					processed +
					testTextarea.value.substring(end)

				const newPos = start + processed.length
				testTextarea.selectionStart = testTextarea.selectionEnd = newPos

				if (settings.enableSound) {
					playTestSound()
				}
				break
			}
		}
	})
}

// Обработка тела сниппета
function processSnippetBody(body) {
	// Рандомизация
	const pattern = /\{([^}]+)\}/g
	return body.replace(pattern, (match, options) => {
		// Проверяем специальные команды
		if (options === 'clipboard') {
			// FIXME: позже нужно будет сделать тут реальное содержимое буфера
			return '[clipboard content]'
		}

		// Рандомизация
		const variants = options.split('|').map((v) => v.trim())
		const randomIndex = Math.floor(Math.random() * variants.length)
		return variants[randomIndex]
	})
}

// Воспроизведение тестового звука
function playTestSound() {
	const audio = new Audio(browser.runtime.getURL('sounds/keypress.mp3'))
	audio.volume = settings.soundVolume
	audio.play().catch(() => { })
}

// Сохранение настроек
async function saveSettingsFunc() {
	settings.enableSound = enableSound.checked
	settings.soundVolume = soundVolume.value / 100
	settings.enableAnimation = enableAnimation.checked
	settings.animationType = animationType.value

	await saveData()
	showToast(t('settingsSaved'))
}

// Экспорт данных
function exportData() {
	const data = {
		snippets,
		settings,
		version: '1.0.0',
		exportDate: new Date().toISOString(),
	}

	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json',
	})
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `sniptype-backup-${Date.now()}.json`
	a.click()
	URL.revokeObjectURL(url)

	showToast('toastDataExported', 'export')
}

// Импорт данных
function importData() {
	importFile.click()
}

// Обработка импорта файла
async function handleImportFile(event) {
	const file = event.target.files[0]
	if (!file) return

	try {
		const text = await file.text()
		const data = JSON.parse(text)

		if (data.snippets) {
			snippets = data.snippets
		}
		if (data.settings) {
			settings = data.settings
			enableSound.checked = settings.enableSound
			soundVolume.value = Math.round(settings.soundVolume * 100)
			volumeValue.textContent =
				Math.round(settings.soundVolume * 100) + '%'
			enableAnimation.checked = settings.enableAnimation
			animationType.value = settings.animationType
		}

		await saveData()
		updateView()
		showToast(t('toastDataImported'), 'import')
	} catch (err) {
		showToast(t('toastImportError') + err.message, 'error')
	}

	importFile.value = ''
}

// Показать уведомление
function showToast(messageKey, type = 'success') {
	const toastIcon = toast.querySelector('.toast-icon')
	const toastMessage = toast.querySelector('.toast-message')

	// Получаем переведенное сообщение
	const message = t(messageKey)
	toastMessage.textContent = message

	// Устанавливаем иконку в зависимости от типа
	let iconSvg = ''
	switch (type) {
		case 'success':
			// iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			{
				/* <polyline points="20 6 9 17 4 12"></polyline> */
			}
			// </svg>`
			iconSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>`
			break
		case 'error':
			// iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			//   <circle cx="12" cy="12" r="10"></circle>
			//   <line x1="15" y1="9" x2="9" y2="15"></line>
			//   <line x1="9" y1="9" x2="15" y2="15"></line>
			// </svg>`
			iconSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>`
			break
		case 'warning':
			// iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			// <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
			//   <line x1="12" y1="9" x2="12" y2="13"></line>
			//   <line x1="12" y1="17" x2="12.01" y2="17"></line>
			// </svg>`

			iconSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8V12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path> <circle cx="12" cy="15" r="1" fill="currentColor"></circle> <path d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 14.4963 20.1632 16.4284 19 17.9041M3.19284 14C4.05026 18.2984 7.57641 20.5129 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C14.6796 21.2747 15.3324 20.9478 16 20.5328" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path> </g></svg>`
			break
		case 'info':
			iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>`
			break
		case 'export':
			iconSvg = ` <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /> `
			break
		case 'import':
			iconSvg = ` <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /> </svg> `
			break
		default:
			iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`
	}

	// Safely render SVG icon for toast using DOMParser when possible
	while (toastIcon.firstChild) toastIcon.removeChild(toastIcon.firstChild)
	try {
		const doc = new DOMParser().parseFromString(iconSvg, 'image/svg+xml')
		const svg = doc.documentElement
		toastIcon.appendChild(svg)
	} catch {
		const frag = document.createRange().createContextualFragment(iconSvg)
		toastIcon.appendChild(frag)
	}
	toast.className = 'toast show'

	setTimeout(() => {
		toast.className = 'toast'
	}, 3000)
}

// Генерация ID
function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Экранирование HTML
// Simple HTML escaping kept minimal; not used after replacing innerHTML paths

// Настройка обработчиков событий
function setupEventListeners() {
	homeBtn.addEventListener('click', showHome)
	settingsBtn.addEventListener('click', showSettings)
	addSnippetBtn.addEventListener('click', createNewSnippet)
	saveSnippetBtn.addEventListener('click', saveCurrentSnippet)
	deleteSnippetBtn.addEventListener('click', deleteCurrentSnippet)
	saveSettingsBtn.addEventListener('click', saveSettingsFunc)
	exportBtn.addEventListener('click', exportData)
	importBtn.addEventListener('click', importData)
	importFile.addEventListener('change', handleImportFile)

	insertRandomBtn.addEventListener('click', insertRandomization)
	insertClipboardBtn.addEventListener('click', insertClipboard)

	// Обновление громкости
	soundVolume.addEventListener('input', () => {
		volumeValue.textContent = soundVolume.value + '%'
	})

	// Автосохранение при вводе
	let saveTimeout
		;[snippetLabel, snippetShortcut, snippetBody, snippetRichText].forEach(
			(el) => {
				el.addEventListener('input', () => {
					clearTimeout(saveTimeout)
					saveTimeout = setTimeout(saveCurrentSnippet, 1000)
				})
			},
		)
}

// Запуск
init()
updateLanguageDisplay()
