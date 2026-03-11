const http = require('http');

const data = [
    {
        "Cliente": "[Tráfego] Cooper",
        "Satisfação": "Risco",
        "Última mensagem": "13/02/2026 16:31:00",
        "Tarefas": "Tarefas concluídas",
        "Resumo": "Durante a semana, foram alinhados encontros...",
        "Última atualização": "13/02/2026 18:08:00",
        "Squad": "Argonautas"
    },
    {
        "Cliente": "[Mídia] Alpha",
        "Satisfação": "Positivo",
        "Última mensagem": "15/02/2026 09:00:00",
        "Tarefas": "Em andamento",
        "Resumo": "Campanha performando acima da média.",
        "Última atualização": "15/02/2026 10:00:00",
        "Squad": "Titans"
    },
    {
        "Cliente": "[SEO] Beta",
        "Satisfação": "Neutro",
        "Última mensagem": "14/02/2026 14:00:00",
        "Tarefas": "Aguardando aprovação",
        "Resumo": "Relatório de palavras-chave enviado.",
        "Última atualização": "14/02/2026 15:00:00",
        "Squad": "Argonautas"
    }
];

const dataString = JSON.stringify(data);

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(dataString);
req.end();
