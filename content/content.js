// Content script для обработки ввода текста
let snippets = []
let settings = {
	enableSound: true,
	soundVolume: 0.5,
	enableAnimation: false,
	animationType: 'confetti',
}
let lastActiveElement = null

// Загрузка данных при запуске
async function loadData() {
	const data = await browser.storage.local.get(['snippets', 'settings'])
	snippets = data.snippets || []
	settings = data.settings || {
		enableSound: true,
		soundVolume: 0.5,
		enableAnimation: false,
		animationType: 'confetti',
	}
}

// Обработка изменений в storage
browser.storage.onChanged.addListener((changes, area) => {
	if (area === 'local') {
		if (changes.snippets) {
			snippets = changes.snippets.newValue || []
		}
		if (changes.settings) {
			settings = changes.settings.newValue || {
				enableSound: true,
				soundVolume: 0.5,
				enableAnimation: false,
				animationType: 'confetti',
			}
		}
	}
})

// Обработка нажатий клавиш
document.addEventListener('keydown', handleKeyDown, true)
document.addEventListener('keyup', handleKeyUp, true)

function handleKeyDown(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) {
		return
	}

	const target = e.target
	if (!isEditableElement(target)) {
		return
	}

	lastActiveElement = target
}

function handleKeyUp(e) {
	if (!lastActiveElement || !isEditableElement(lastActiveElement)) {
		return
	}

	const text = getTextBeforeCursor(lastActiveElement)

	for (const snippet of snippets) {
		if (text.endsWith(snippet.shortcut)) {
			e.preventDefault()
			insertSnippet(lastActiveElement, snippet)
			break
		}
	}
}

// Проверка, является ли элемент редактируемым
function isEditableElement(element) {
	if (!element) return false

	const tagName = element.tagName.toLowerCase()

	if (tagName === 'input' || tagName === 'textarea') {
		const type = element.type?.toLowerCase()
		return (
			!type ||
			['text', 'search', 'url', 'tel', 'email', 'password'].includes(type)
		)
	}

	if (element.isContentEditable) {
		return true
	}

	return false
}

// Получение текста перед курсором
function getTextBeforeCursor(element) {
	const tagName = element.tagName.toLowerCase()

	if (tagName === 'input' || tagName === 'textarea') {
		const pos = element.selectionStart
		return element.value.substring(0, pos)
	}

	if (element.isContentEditable) {
		const selection = window.getSelection()
		if (selection.rangeCount === 0) return ''

		const range = selection.getRangeAt(0)
		const preCaretRange = range.cloneRange()
		preCaretRange.selectNodeContents(element)
		preCaretRange.setEnd(range.endContainer, range.endOffset)

		return preCaretRange.toString()
	}

	return ''
}

// Вставка сниппета
async function insertSnippet(element, snippet) {
	const processedText = await processSnippetBody(snippet.body)
	const shortcutLength = snippet.shortcut.length

	const tagName = element.tagName.toLowerCase()

	if (tagName === 'input' || tagName === 'textarea') {
		insertIntoInputElement(
			element,
			processedText,
			shortcutLength,
			snippet.richText,
		)
	} else if (element.isContentEditable) {
		insertIntoContentEditable(
			element,
			processedText,
			shortcutLength,
			snippet.richText,
		)
	}

	if (settings.enableSound) {
		playSound()
	}

	if (settings.enableAnimation) {
		showInsertAnimation(element, settings.animationType)
	}
}

// Вставка в input/textarea
function insertIntoInputElement(element, text, shortcutLength, richText) {
	const pos = element.selectionStart
	const value = element.value

	const newValue =
		value.substring(0, pos - shortcutLength) + text + value.substring(pos)
	element.value = newValue

	const newPos = pos - shortcutLength + text.length
	element.selectionStart = element.selectionEnd = newPos

	element.dispatchEvent(new Event('input', { bubbles: true }))
}

// Вставка в contentEditable
function insertIntoContentEditable(element, text, shortcutLength, richText) {
	const selection = window.getSelection()
	if (selection.rangeCount === 0) return

	const range = selection.getRangeAt(0)

	for (let i = 0; i < shortcutLength; i++) {
		range.setStart(range.startContainer, Math.max(0, range.startOffset - 1))
	}
	range.deleteContents()

	if (richText) {
		const tempDiv = document.createElement('div')
		tempDiv.innerHTML = text
		const fragment = document.createDocumentFragment()

		while (tempDiv.firstChild) {
			fragment.appendChild(tempDiv.firstChild)
		}

		range.insertNode(fragment)
	} else {
		const textNode = document.createTextNode(text)
		range.insertNode(textNode)

		range.setStartAfter(textNode)
		range.setEndAfter(textNode)
	}

	selection.removeAllRanges()
	selection.addRange(range)
}

// Обработка тела сниппета
async function processSnippetBody(body) {
	const pattern = /\{([^}]+)\}/g
	let processed = body

	const matches = [...body.matchAll(pattern)]

	for (const match of matches) {
		const content = match[1]

		// Буфер обмена
		if (content === 'clipboard') {
			try {
				const clipboardText = await navigator.clipboard.readText()
				processed = processed.replace(match[0], clipboardText)
			} catch (err) {
				processed = processed.replace(match[0], '[clipboard error]')
			}
			continue
		}

		// Рандомизация
		const variants = content.split('|').map((v) => v.trim())
		const randomIndex = Math.floor(Math.random() * variants.length)
		processed = processed.replace(match[0], variants[randomIndex])
	}

	return processed
}

// Воспроизведение звука
function playSound() {
	const audio = new Audio(browser.runtime.getURL('sounds/keypress.mp3'))
	audio.volume = settings.soundVolume
	audio.play().catch(() => { })
}

// Показ анимации
function showInsertAnimation(element, type) {
	const rect = element.getBoundingClientRect()

	// Определяем позицию курсора
	let cursorX, cursorY

	const tagName = element.tagName.toLowerCase()
	if (tagName === 'input' || tagName === 'textarea') {
		// Для input/textarea используем позицию в начале элемента
		cursorX = rect.left + 10
		cursorY = rect.top + rect.height / 2
	} else if (element.isContentEditable) {
		// Для contentEditable пытаемся получить точную позицию курсора
		const selection = window.getSelection()
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0)
			const rects = range.getClientRects()
			if (rects.length > 0) {
				const lastRect = rects[rects.length - 1]
				cursorX = lastRect.left
				cursorY = lastRect.top + lastRect.height / 2
			} else {
				cursorX = rect.left + rect.width / 2
				cursorY = rect.top + rect.height / 2
			}
		} else {
			cursorX = rect.left + rect.width / 2
			cursorY = rect.top + rect.height / 2
		}
	} else {
		cursorX = rect.left + rect.width / 2
		cursorY = rect.top + rect.height / 2
	}

	const y = cursorY + window.scrollY

	switch (type) {
		case 'confetti':
			showConfettiAnimation(cursorX, y)
			break
		case 'leaves':
			showLeavesAnimation(cursorX, y)
			break
		case 'sparkle':
			showSparkleAnimation(cursorX, y)
			break
		default:
			showConfettiAnimation(cursorX, y)
	}
}

// Анимация конфетти с гравитацией
function showConfettiAnimation(x, y) {
	const colors = ['#eb6f92', '#f6c177', '#9ccfd8', '#c4a7e7', '#ebbcba']
	const count = 15

	for (let i = 0; i < count; i++) {
		const particle = document.createElement('div')
		particle.className = 'sniptype-particle'
		particle.style.left = x + 'px'
		particle.style.top = y + 'px'
		particle.style.backgroundColor =
			colors[Math.floor(Math.random() * colors.length)]

		// Случайное направление с большим разбросом
		const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
		const velocity = 80 + Math.random() * 60
		const tx = Math.cos(angle) * velocity
		const ty = Math.sin(angle) * velocity - 40 // Начальный подъем
		const rotation = Math.random() * 720 - 360

		particle.style.setProperty('--tx', tx + 'px')
		particle.style.setProperty('--ty', ty + 'px')
		particle.style.setProperty('--rotation', rotation + 'deg')

		document.body.appendChild(particle)

		setTimeout(() => particle.classList.add('animate'), 10)
		setTimeout(() => particle.remove(), 1200)
	}
}

// Анимация падающих листьев с реалистичным движением
function showLeavesAnimation(x, y) {
	const colors = ['#eb6f92', '#f6c177', '#9ccfd8', '#c4a7e7', '#ebbcba']
	const emojis = ['🍂', '🍁', '🌿', '🍃']
	const count = 10

	for (let i = 0; i < count; i++) {
		const leaf = document.createElement('div')
		leaf.className = 'sniptype-leaf'
		leaf.textContent = emojis[Math.floor(Math.random() * emojis.length)]

		// Начальная позиция с небольшим разбросом
		const startX = x + (Math.random() - 0.5) * 60
		leaf.style.left = startX + 'px'
		leaf.style.top = y + 'px'
		leaf.style.color = colors[Math.floor(Math.random() * colors.length)]

		// Параметры движения с качанием
		const swing = -40 + Math.random() * 80 // Горизонтальное качание
		const ty = 120 + Math.random() * 80 // Вертикальное падение
		const rotation = -180 + Math.random() * 360

		leaf.style.setProperty('--swing', swing + 'px')
		leaf.style.setProperty('--ty', ty + 'px')
		leaf.style.setProperty('--rotation', rotation + 'deg')

		document.body.appendChild(leaf)

		setTimeout(
			() => leaf.classList.add('animate'),
			10 + Math.random() * 100,
		)
		setTimeout(() => leaf.remove(), 2600)
	}
}

// Анимация искр с притяжением
function showSparkleAnimation(x, y) {
	const count = 12

	for (let i = 0; i < count; i++) {
		const sparkle = document.createElement('div')
		sparkle.className = 'sniptype-sparkle'
		sparkle.textContent = '✨'
		sparkle.style.left = x + 'px'
		sparkle.style.top = y + 'px'

		// Случайное направление с вариацией
		const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
		const distance = 50 + Math.random() * 40
		const tx = Math.cos(angle) * distance
		const ty = Math.sin(angle) * distance - 20 // Небольшой подъем

		sparkle.style.setProperty('--tx', tx + 'px')
		sparkle.style.setProperty('--ty', ty + 'px')

		document.body.appendChild(sparkle)

		setTimeout(
			() => sparkle.classList.add('animate'),
			10 + Math.random() * 50,
		)
		setTimeout(() => sparkle.remove(), 1050)
	}
}

// Инициализация
loadData()
