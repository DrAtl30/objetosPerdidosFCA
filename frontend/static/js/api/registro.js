export async function registrarAlumno(data, csrfToken) {
    const response = await fetch('/api/registro/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}
