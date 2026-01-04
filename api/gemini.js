// Vercel Serverless Function - Gemini API Proxy
// This keeps your API key secure on the server side

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers for your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get API key from environment variable (set in Vercel dashboard)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY environment variable is not set');
        return res.status(500).json({ 
            error: 'API key not configured',
            message: 'Please set GEMINI_API_KEY in Vercel environment variables'
        });
    }

    try {
        const { prompt, model } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Use the model specified or default to gemini-2.5-flash
        const modelId = model || 'gemini-2.5-flash';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`;

        // Call Gemini API
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                }
            })
        });

        const data = await response.json();

        // Check for API errors
        if (!response.ok) {
            console.error('Gemini API error:', data);
            
            // If primary model fails, try fallback model
            if (response.status === 400 || response.status === 404) {
                const fallbackModel = 'gemini-1.5-pro';
                const fallbackUrl = `https://generativelanguage.googleapis.com/v1/models/${fallbackModel}:generateContent?key=${apiKey}`;
                
                const fallbackResponse = await fetch(fallbackUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 8192,
                        }
                    })
                });

                const fallbackData = await fallbackResponse.json();
                
                if (!fallbackResponse.ok) {
                    return res.status(fallbackResponse.status).json({
                        error: 'Gemini API error',
                        details: fallbackData
                    });
                }

                return res.status(200).json(fallbackData);
            }

            return res.status(response.status).json({
                error: 'Gemini API error',
                details: data
            });
        }

        // Return successful response
        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
