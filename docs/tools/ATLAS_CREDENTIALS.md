# 🔧 Como Obter suas Credenciais MongoDB Atlas

## Opção 1: Connection String (Recomendado)

1. **Acesse MongoDB Atlas**: https://cloud.mongodb.com
2. **Clique em "Connect"** no seu cluster
3. **Escolha "Connect your application"**
4. **Copie a connection string** (algo como):
    ```
    mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>
    ```

## Opção 2: Data API (Atual)

1. **Acesse MongoDB Atlas**: https://cloud.mongodb.com
2. **Vá em "Data API"** no menu lateral
3. **Create Data API Key**
4. **Copie o App ID e API Key**

## Para Testar:

**Com Connection String:**

```json
{
    "mcpServers": {
        "MongoDB": {
            "command": "npx",
            "args": [
                "-y",
                "mongodb-mcp-server",
                "--connectionString",
                "SUA_CONNECTION_STRING_AQUI"
            ]
        }
    }
}
```

**Com Data API:**

```json
{
    "mcpServers": {
        "MongoDB": {
            "command": "npx",
            "args": [
                "-y",
                "mongodb-mcp-server",
                "--apiClientId",
                "SEU_APP_ID_CORRETO",
                "--apiClientSecret",
                "SUA_API_KEY_CORRETA"
            ]
        }
    }
}
```

Me informe qual opção você prefere e suas credenciais para configurar corretamente!
