// Popup script
const snippetList = document.getElementById('snippetList')
const openSettingsBtn = document.getElementById('openSettings')

// Загрузка и отображение сниппетов
async function loadSnippets() {
	const data = await browser.storage.local.get('snippets')
	const snippets = data.snippets || []

	if (snippets.length === 0) {
		snippetList.innerHTML =
			'<div class="empty-message">Нет сниппетов. Создайте их в настройках!</div>'
		return
	}

	snippetList.innerHTML = ''

	snippets.forEach((snippet) => {
		const item = document.createElement('div')
		item.className = 'snippet-item'

		item.innerHTML = `
      <div class="snippet-label">${escapeHtml(snippet.label)}</div>
      <div class="snippet-shortcut">${escapeHtml(snippet.shortcut)}</div>
    `

		snippetList.appendChild(item)
	})
}

// Открытие настроек
openSettingsBtn.addEventListener('click', () => {
	browser.runtime.openOptionsPage()
})

// Экранирование HTML
function escapeHtml(text) {
	const div = document.createElement('div')
	div.textContent = text
	return div.innerHTML
}

// Инициализация
loadSnippets()
