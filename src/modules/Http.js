const  Stream = require('stream').Transform;
const { parse } = require('url');

class Http {
    constructor(type = 'https') {
        this.type = type;
        this.nodeHttp = require(type);
    }
    
    request(options, postData) {
        return new Promise((resolve, reject) => {
            const request = this.nodeHttp.request(options, (response) => {
                if (response.statusCode < 200 || response.statusCode >= 300) return reject(response.statusMessage || `Status ${response.statusCode}`);
                if (options.method === 'GET' && options.encoding === null) {
                    let chunks = [];
                    response.setEncoding('binary');
                    response.on('data', (chunk) => {                                       
                        chunks.push(Buffer.from(chunk, 'binary'));
                    });
                   return response.on('end', () => resolve(Buffer.concat(chunks)));
                };
                let body = '';
                response.on('data', (chunk) => body += chunk);
                response.on('end', () => resolve(body));
            }).on('error', reject);
            if (postData) request.write(JSON.stringify(postData));
            request.end();
        });
    } 

    async delete({ url, authorization, options = {} }) {
        const { hostname, path } = parse(url);
        let headers = {};
        if (authorization) headers = {
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.251 Chrome/56.0.2924.87 Discord/1.6.15 Safari/537.36',
            Origin: 'discordapp.com',
            Referer: 'https://discordapp.com/activity',
            Authorization: authorization,
        }
        return await this.request({
            method: 'DELETE',
            headers,
            hostname,
            path
        });
    }

    async post({ url, data, authorization, put, options = {} }) {
        const { hostname, path } = parse(url);
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (authorization) headers = {
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.251 Chrome/56.0.2924.87 Discord/1.6.15 Safari/537.36',
            Origin: 'discordapp.com',
            Referer: 'https://discordapp.com/activity',
            Authorization: authorization,
            ...headers
        }
        return await this.request({
            method: put ? 'PUT' : 'POST',
            headers,
            hostname,
            path
        }, data);
    }

    async get({ url, authorization, headers = {}, options = { encoding: 'utf8' } }) {
        const { hostname, path, port } = parse(url);
        if (authorization) headers = {
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.251 Chrome/56.0.2924.87 Discord/1.6.15 Safari/537.36',
            Origin: 'discordapp.com',
            Referer: 'https://discordapp.com/activity',
            Authorization: authorization,
            ...headers
        }
        return await this.request({
            method: 'GET',
            port,
            headers,
            hostname,
            path,
            ...options
        });
   };

    async getJSON({ url, authorization, headers = {}, options = {} }) {
        const { hostname, path, port } = parse(url);
        if (authorization) headers = {
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.251 Chrome/56.0.2924.87 Discord/1.6.15 Safari/537.36',
            Origin: 'discordapp.com',
            Referer: 'https://discordapp.com/activity',
            Authorization: authorization,
            ...headers
        }
        const response = await this.request({
            method: 'GET',
            port,
            headers,
            hostname,
            path,
            ...options
        });
        return JSON.parse(response);
   };
};

module.exports = Http;