export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
        return res.status(400).json({ error: 'Falta el campo history' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'API key no configurada' });
    }

    const SYSTEM_PROMPT = `Sos la asistente virtual de AMARA, una tienda uruguaya de belleza natural, organica y cruelty-free.

Tu personalidad:
Hablas en español rioplatense (usa 'vos', 'queres', 'tenes', 'che').
Sos amable, sofisticada y profesional.
Respuestas breves: maximo 3 oraciones.

Contexto de productos:
Labios: Aceite labial hidratante (941 pesos), Labial Dark Burgundy (840 pesos), Lip Gloss Natural (999 pesos).
Cabello: Serum Capilar Reparador (1850 pesos), Mascarilla Nutritiva de Argan (1250 pesos), Aceite Seco Capilar (1480 pesos).
Piel: Serum Vitamina C Iluminador (1850 pesos), Crema Reparadora de Noche (2500 pesos), Contorno Pro-Firmness (2134 pesos).
Ojos: Lapiz Delineador Deep Kohl (1850 pesos), Sombra de Ojos Mineral Velvet (2500 pesos), Mascara de Pestanas Infinite Lift (2134 pesos).

Politicas:
Envios gratis en compras mayores a 3000 pesos. Menos de eso, cuesta 350 pesos a todo Uruguay.
Ubicacion: Florida, Uruguay.
Si preguntan por stock o devoluciones, deciles que escriban al WhatsApp de soporte.

Regla: No inventes productos ni cambies precios. Si no sabes algo, recomienda hablar con un humano.`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + GROQ_API_KEY
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                max_tokens: 400,
                temperature: 0.7,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history.slice(-20)
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(502).json({ error: data.error?.message || 'Error de Groq' });
        }

        return res.status(200).json({
            reply: data.choices[0].message.content.trim()
        });

    } catch (err) {
        return res.status(500).json({ error: 'Error interno: ' + err.message });
    }
}
