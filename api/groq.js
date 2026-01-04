// Vercel Serverless Function - Groq API Proxy
// Groq provides fast, free AI text generation

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error('GROQ_API_KEY environment variable is not set');
        return res.status(500).json({ 
            error: 'API key not configured',
            message: 'Please set GROQ_API_KEY in Vercel environment variables'
        });
    }

    try {
        const { prompt, model, max_tokens, temperature } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Use specified model or default to llama-3.3-70b-versatile (best quality)
        const modelId = model || 'llama-3.3-70b-versatile';
        
        // Call Groq API (OpenAI-compatible)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: max_tokens || 2048,
                temperature: temperature || 0.7,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API error:', data);
            return res.status(response.status).json({
                error: 'Groq API error',
                details: data
            });
        }

        // Convert Groq response to Gemini-compatible format
        // This allows the frontend to work without changes
        const geminiCompatibleResponse = {
            candidates: [{
                content: {
                    parts: [{
                        text: data.choices[0].message.content
                    }]
                }
            }]
        };

        // Return Gemini-compatible response
        return res.status(200).json(geminiCompatibleResponse);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
