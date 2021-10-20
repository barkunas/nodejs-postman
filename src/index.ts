import { contentTypes } from './contentTypes';
import fs from 'fs'
import express from 'express';
import { json } from 'body-parser';
import ip from 'ip'
import fetch from 'isomorphic-fetch';
import { URL } from 'url';

fs.writeFileSync('pidServer', process.pid.toString());

const PORT = 3000;
const app = express();

app.use(express.static('./front/build'));
app.use(json());

app.post<'/do', {}, {}, IDoRequest>('/do', async (req, res) => {
    const body = req.body;
    const url = body.url
    try {
        const urlWithQuery = encodeURI(url + body.query)
        const err = isWrongBody(body)
        if (err.length > 0) {
            res.json({
                messages: err,
            });
            return;
        }
        const innerRequest = await fetch(urlWithQuery, { "method": body.method, "content-type": req.headers["content-type"],body:req.body.frontBody });
        const innerRequestBody = await innerRequest.text();
        res.json({
            status: innerRequest.status,
            incomingConfig: body,
            fetchUrl: urlWithQuery,
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
    url: string,
    contenttype: string,
    query: string,
    frontBody:string
}

function isWrongBody(body: IDoRequest): string[] {
    var result: string[] = [];


    try {
        new URL(body.url);
        if (body.url.indexOf('.') < 1) throw new Error("invalid url");
    } catch (error) {
        result.push('urlError');
    }
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(body.method)) result.push('methodError');
    if (!contentTypes.map(value => value.label).includes(body.contenttype)) result.push('contentTypeError');

    return result
}

