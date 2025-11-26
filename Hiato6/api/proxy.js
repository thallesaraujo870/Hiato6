export default async function handler(req, res) {
    const API_URL = 'http://18.218.141.160:8080';

    // monta a url final da API
    const targetUrl = API_URL + req.url;

    const options = {
        method: req.method,
        headers: { ...req.headers },
    };

    // adiciona body se nao for GET
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = req.body;
    }

    try {
        const response = await fetch(targetUrl, options);
        const data = await response.text();

        res.status(response.status).send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Erro no proxy' });
    }
}
