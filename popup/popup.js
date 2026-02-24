// Popup script
const snippetList = document.getElementById('snippetList')
const openSettingsBtn = document.getElementById('openSettings')

// Загрузка и отображение сниппетов
async function loadSnippets() {
	const data = await browser.storage.local.get('snippets')
	const snippets = data.snippets || []

    if (snippets.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'empty-message'
        empty.textContent = 'Нет сниппетов. Создайте их в настройках!'
        snippetList.appendChild(empty)
        return
    }

    // Clear safely without innerHTML
    while (snippetList.firstChild) {
        snippetList.removeChild(snippetList.firstChild)
    }

    snippets.forEach((snippet) => {
        const item = document.createElement('div')
        item.className = 'snippet-item'

        // Build label and shortcut safely
        const labelDiv = document.createElement('div')
        labelDiv.className = 'snippet-label'
        labelDiv.textContent = snippet.label

        const shortcutDiv = document.createElement('div')
        shortcutDiv.className = 'snippet-shortcut'
        shortcutDiv.textContent = snippet.shortcut

        item.appendChild(labelDiv)
        item.appendChild(shortcutDiv)
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
