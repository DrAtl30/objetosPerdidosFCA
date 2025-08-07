export async function verificarCorreoConfirmado(correo, csrfToken) {
    const response = await fetch('/api/verificarCorreoConfirmado/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({ correo_institucional: correo }),
    });

    if (!response.ok) {
        throw new Error('Error al verificar el correo');
    }
    
    

    return await response.json();
}

export async function loginUsuario(data, csrfToken) {
    const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw await response.json(); // Lanza el error para atraparlo afuera
    }
    
    return await response.json();
}


export async function logout(csrfToken) {
    const response = await fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    return await response.json();
}