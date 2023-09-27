// 导入相关模块和库
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import * as uuid from 'https://jspm.dev/uuid';
import * as lodash from 'https://jspm.dev/lodash-es';

// 获取 UUID 环境变量或者默认值
const userID = Deno.env.get('UUID') || '41446577-9ca4-4358-8082-1be0e65aace0';
// 多用户模式
const users = [
    { username: "alice", password: "password123", uuid: userID },
    { username: "bob", password: "letmein", uuid: userID },
  ];
// 生成指定长度的随机字符串
function generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 构造 vless URL，返回字符串
function getVlessURL(uuid: string, hostname: string, options: { ws0Rtt?: boolean } = {}) {
    let pathParam = generateRandomString(Math.floor(Math.random() * 11) + 10);
    pathParam = `&path=${encodeURIComponent(pathParam)}?ed=2048`;
    return `vless://${uuid}@${hostname}:443?encryption=none&security=tls&type=ws${pathParam || ''}#${hostname}`;
}

// 处理客户端请求
async function serveClient(req: Request, basePath: string) {
    // 获取 Authorization 头信息
    const basicAuth = req.headers.get('Authorization') || '';
    const authString = basicAuth.split(' ')?.[1] || '';
    console.log(basePath);
    console.log(req);

    // 判断是否为 info 请求并且验证通过
    const pathname = new URL(req.url).pathname;
    if (pathname.startsWith('/info') && atob(authString).includes(basePath)) {
        // 获取环境变量和请求信息
        const env = Deno.env.toObject();
        const responseObj = {
            message: 'hello world',
            supabaseUrl: Deno.env.get('SUPABASE_URL') || '',
            upgradeHeader: req.headers.get('upgrade') || '',
            authString: authString,
            uuidValidate: basePath,
            method: req.method,
            environment: env,
            url: req.url,
            proto: req.proto,
            headers: Object.fromEntries(req.headers.entries()),
            body: req.body ? new TextDecoder().decode(await req.arrayBuffer()) : undefined,
        };
        const responseBody = JSON.stringify(responseObj);
        return new Response(responseBody, {
            status: 200,
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        });
    }

    // 如果是包含 basePath 的请求，构造 vless URL 返回
    if (pathname.includes(basePath)) {
        const url = new URL(req.url);
        const uuid = Deno.env.get('UUID') || basePath;;
        console.log(uuid);
        const hostname = url.hostname;
        const vlessURL = getVlessURL(uuid, hostname, { ws0Rtt: true });

        const result = `
  *******************************************
  ${atob('VjItcmF5Tjo=')}
  ----------------------------
  ${vlessURL.replace('vless://,', 'vless://')}
  *******************************************
  ${atob('U2hhZG93cm9ja2V0Og==')}
  ----------------------------
  ${vlessURL.replace('vless://,', 'vless://')}
  *******************************************
  ${atob('Q2xhc2g6')}
  ----------------------------
  - {name: Argo-Vless, type: vless, server: ${hostname}, port: 443, uuid: ${uuid}, tls: true, servername: ${hostname}, skip-cert-verify: false, network: ws, ws-opts: {path: /${encodeURIComponent(generateRandomString(Math.floor(Math.random() * 11) + 10))}?ed=2048, headers: { Host: ${hostname}}}, udp: false}`;

        return new Response(result, {
            status: 200,
            headers: {
                'content-type': 'text/plain; charset=utf-8',
            },
        });
    }
    console.log(authString);
    console.log(basicAuth);
    // 查找用户
    const user = users.find(user => {
    const decoded = atob(authString);
    return user.username + ':' + user.password === decoded && user.uuid === basePath;
  });
    if (atob(authString).includes(basePath) || user) {
    // if (user) {
        console.log(basePath);
        console.log('302');
        return new Response(``, {
            status: 302,
            headers: {
                'content-type': 'text/html; charset=utf-8',
                Location: `./${basePath}`,
            },
        });
    } else {
        return new Response(``, {
            status: 401,
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'WWW-Authenticate': 'Basic',
            },
        });
    }
}

export {
    serveClient
};

function uuidValidate(this: void, value: string, index: number, obj: string[]): value is any {
    throw new Error('Function not implemented.');
}

export function vlessJs(): string {
    return 'vless-js';
}
/*
定义 delay 函数，返回一个 Promise 对象，延迟指定的毫秒数
参数：ms - 毫秒数
*/
export function delay(ms: number) {
    return new Promise((resolve, rej) => {
        setTimeout(resolve, ms);
    });
}
/*

定义 processWebSocket 函数，返回一个 Promise 对象，用于处理 WebSocket
参数：一个包含 userID、webSocket、rawTCPFactory、libs 等属性的对象
userID - 用户 ID
web
