document.getElementById('APIForm').addEventListener('submit', async (event) => {
    event.preventDefault()
    const statusDiv = document.getElementById('statusMSG')
    statusDiv.textContent = 'Sending data...'
    statusDiv.style.color = 'orange'
    const pw = document.getElementById('pw').value
    const body = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        time: document.getElementById('time').value
    }

    try {
        const response = await fetch('/club/calendarEvents.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-password': pw
            },
            body: JSON.stringify(body)
        })
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
            throw new Error(`Server returned ${response.status} (not JSON). Is the API running?`)
        }

        const result = await response.json()
        if (response.ok && result.status === 'added') {
            statusDiv.textContent = `Success! Added item ID: ${result.id}`
            statusDiv.style.color = 'green'
            document.getElementById('title').value = ''
            document.getElementById('description').value = ''
            document.getElementById('time').value = ''
        } else {
            statusDiv.textContent = `API Error: ${result.message || 'Failed to process'}`
            statusDiv.style.color = 'red'
        }
    } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`
        statusDiv.style.color = 'red'
        console.error('Fetch request failed:', error)
    }
})