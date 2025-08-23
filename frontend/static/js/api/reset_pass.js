export async function resetPassword(email) {
    const res = await fetch('/api/reset/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_institucional: email }),
    });

    if (!res.ok) throw new Error('Error en la solicitud');
    return await res.json();
}