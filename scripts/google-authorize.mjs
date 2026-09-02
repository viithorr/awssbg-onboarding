import fs from "node:fs/promises";
import http from "node:http";
import { google } from "googleapis";

const credentials = JSON.parse(await fs.readFile("google-oauth-client.json", "utf8"));
const config = credentials.installed;
if (!config?.client_id || !config?.client_secret) throw new Error("Credencial OAuth para computador inválida.");

const port = 53682;
const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
const oauth = new google.auth.OAuth2(config.client_id, config.client_secret, redirectUri);
const authUrl = oauth.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar.events"],
});

console.log("\nAbra este endereço no navegador e autorize a conta do calendário:\n");
console.log(authUrl);
console.log("\nAguardando autorização...\n");

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", redirectUri);
    if (url.pathname !== "/oauth2callback") {
      response.writeHead(404).end("Não encontrado");
      return;
    }
    const code = url.searchParams.get("code");
    if (!code) throw new Error(url.searchParams.get("error") ?? "Código de autorização ausente.");
    const { tokens } = await oauth.getToken(code);
    if (!tokens.refresh_token) throw new Error("O Google não retornou refresh token. Revogue o acesso anterior e tente novamente.");
    await fs.writeFile("google-token.json", JSON.stringify(tokens, null, 2), { mode: 0o600 });
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end("<h1>Autorização concluída</h1><p>Você pode fechar esta janela e voltar ao projeto.</p>");
    console.log("Autorização concluída. Token salvo com segurança em google-token.json.");
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Não foi possível concluir a autorização.");
    console.error(error instanceof Error ? error.message : "Falha desconhecida.");
  } finally {
    server.close();
  }
});

server.listen(port, "127.0.0.1");
