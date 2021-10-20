import fs from 'fs'
import express from 'express';
import { json } from 'body-parser';
import ip from 'ip'
import fetch from 'isomorphic-fetch';

fs.writeFileSync('pidServer', process.pid.toString());

const PORT = 3000;
const app = express();

app.use(express.static('./front/build'));
app.use(json());

app.post<'/do', {}, {}, IDoRequest>('/do', async (req, res) => {
    const body = req.body;
    try {
        const innerRequest = await fetch(body.url, { "method": body.method });
        const innerRequestBody = await innerRequest.text();
        res.json({
            status: innerRequest.status,
            incomingConfig: body,
            innerRequest,
            innerHeaders: Object.fromEntries(innerRequest.headers),
            innerRequestBody
        });

    } catch (error) {
        console.log(error)
        res.json({
            status: 'error',
            incomingConfig: body,
            serverError: '' + error
        });
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://${ip.address()}:${PORT}`);
});

interface IDoRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string
}
