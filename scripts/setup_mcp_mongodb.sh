#!/bin/bash

# 🤖 MongoDB MCP Server - Script de Configuração Automática
# Para uso com GitHub Copilot no VS Code

echo "🚀 Configurando MongoDB MCP Server..."

# Detectar sistema operacional
OS="$(uname -s)"
case "${OS}" in
    Linux*)     VSCODE_CONFIG_DIR="$HOME/.config/Code/User";;
    Darwin*)    VSCODE_CONFIG_DIR="$HOME/Library/Application Support/Code/User";;
    MINGW*)     VSCODE_CONFIG_DIR="$APPDATA/Code/User";;
    *)          echo "❌ Sistema operacional não suportado: ${OS}"; exit 1;;
esac

echo "📁 Diretório de configuração: $VSCODE_CONFIG_DIR"

# Criar diretório se não existir
mkdir -p "$VSCODE_CONFIG_DIR"

# Verificar se já existe configuração MCP
MCP_CONFIG="$VSCODE_CONFIG_DIR/mcp.json"

if [ -f "$MCP_CONFIG" ]; then
    echo "⚠️  Arquivo MCP já existe: $MCP_CONFIG"
    echo "📝 Fazendo backup..."
    cp "$MCP_CONFIG" "$MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Detectar tipo de MongoDB (local ou Atlas)
echo ""
echo "🗄️  Qual tipo de MongoDB você quer configurar?"
echo "1) MongoDB Local (Docker)"
echo "2) MongoDB Atlas (Cloud)"
echo "3) Ambos"
read -p "Escolha (1-3): " MONGO_TYPE

case $MONGO_TYPE in
    1)
        echo "🐳 Configurando para MongoDB Local..."
        cat > "$MCP_CONFIG" << 'EOF'
{
  "mcpServers": {
    "MongoDB": {
      "command": "npx",
      "args": [
        "-y",
        "mongodb-mcp-server@latest",
        "--readOnly"
      ],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017/math-learn"
      }
    }
  }
}
EOF
        ;;
    2)
        echo "☁️  Configurando para MongoDB Atlas..."
        read -p "🔑 Digite sua connection string do Atlas: " ATLAS_STRING
        cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "MongoDB": {
      "command": "npx",
      "args": [
        "-y",
        "mongodb-mcp-server@latest",
        "--connectionString",
        "$ATLAS_STRING",
        "--readOnly"
      ]
    }
  }
}
EOF
        ;;
    3)
        echo "🔄 Configurando ambos..."
        read -p "🔑 Digite sua connection string do Atlas: " ATLAS_STRING
        cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "MongoDB-Local": {
      "command": "npx",
      "args": [
        "-y",
        "mongodb-mcp-server@latest",
        "--readOnly"
      ],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017/math-learn"
      }
    },
    "MongoDB-Atlas": {
      "command": "npx",
      "args": [
        "-y",
        "mongodb-mcp-server@latest",
        "--connectionString",
        "$ATLAS_STRING",
        "--readOnly"
      ]
    }
  }
}
EOF
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "✅ Configuração MCP criada em: $MCP_CONFIG"
echo ""
echo "🎯 Próximos passos:"
echo "1. Reinicie o VS Code"
echo "2. Abra Command Palette (Ctrl+Shift+P)"
echo "3. Digite 'MCP: List Servers'"
echo "4. Verifique se 'MongoDB' aparece na lista"
echo "5. Teste com: 'Liste todas as coleções do banco'"
echo ""
echo "🤖 Agora você pode conversar com seu MongoDB via GitHub Copilot!"
echo ""
echo "📚 Exemplos de comandos:"
echo "- 'Quantas questões temos por categoria?'"
echo "- 'Mostre o esquema da coleção questions'"
echo "- 'Liste as 10 teorias mais recentes'"
echo "- 'Analise as estatísticas do banco de dados'"
