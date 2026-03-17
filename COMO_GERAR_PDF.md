# Como Gerar PDF dos Manuais

Este documento explica como converter os arquivos HTML em PDF de alta qualidade.

## Arquivos Disponíveis

- `MANUAL_TECNICO.html` - Manual técnico completo (~25 páginas)
- `GUIA_USUARIO.html` - Guia do usuário final (~20 páginas)

## Método 1: Navegador (Recomendado - Mais Fácil)

### Google Chrome / Microsoft Edge

1. **Abrir o arquivo HTML**
   - Clique duas vezes no arquivo `.html` OU
   - Arraste o arquivo para o navegador

2. **Imprimir como PDF**
   - Pressione `Ctrl + P` (Windows) ou `Cmd + P` (Mac)
   - Em "Destino", selecione **"Salvar como PDF"**
   - Configure:
     - Layout: **Retrato**
     - Margens: **Padrão**
     - Escala: **100%**
     - ✅ Gráficos de fundo
     - ✅ Cabeçalhos e rodapés (desmarcar se preferir)

3. **Salvar**
   - Clique em "Salvar"
   - Escolha o nome: `Manual_Tecnico_Marmitaria.pdf` ou `Guia_Usuario_Marmitaria.pdf`
   - Pronto!

### Firefox

1. Abrir o arquivo HTML no Firefox
2. `Ctrl + P` → "Imprimir para PDF"
3. Configurar margens e salvar

## Método 2: Microsoft Word (Para Editar)

1. **Abrir no Word**
   - Botão direito no arquivo HTML → "Abrir com" → "Microsoft Word"

2. **Revisar formatação**
   - O Word importa o HTML preservando estilos
   - Você pode editar textos, adicionar notas, etc.

3. **Salvar como PDF**
   - Arquivo → Salvar Como → PDF
   - Escolha qualidade "Alta"

## Método 3: PowerShell (Automático - Windows)

```powershell
# Instalar módulo (primeira vez apenas)
Install-Module -Name PSWriteHTML

# Converter HTML para PDF usando Chrome headless
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

# Manual Técnico
& $chromePath --headless --disable-gpu --print-to-pdf="MANUAL_TECNICO.pdf" --print-to-pdf-no-header "MANUAL_TECNICO.html"

# Guia do Usuário
& $chromePath --headless --disable-gpu --print-to-pdf="GUIA_USUARIO.pdf" --print-to-pdf-no-header "GUIA_USUARIO.html"
```

## Método 4: Ferramentas Online

### wkhtmltopdf (Melhor qualidade)

**Instalar:**
```bash
# Windows (Chocolatey)
choco install wkhtmltopdf

# Linux
sudo apt-get install wkhtmltopdf

# macOS
brew install wkhtmltopdf
```

**Usar:**
```bash
# Manual Técnico
wkhtmltopdf --enable-local-file-access --print-media-type MANUAL_TECNICO.html MANUAL_TECNICO.pdf

# Guia do Usuário
wkhtmltopdf --enable-local-file-access --print-media-type GUIA_USUARIO.html GUIA_USUARIO.pdf
```

### Serviços Online (sem instalação)

1. **PDF24** - https://tools.pdf24.org/pt/html-para-pdf
   - Upload do arquivo HTML
   - Download do PDF

2. **CloudConvert** - https://cloudconvert.com/html-to-pdf
   - Suporta arquivos maiores
   - Mantém qualidade

3. **Zamzar** - https://www.zamzar.com/convert/html-to-pdf/
   - Simples e rápido

## Configurações Recomendadas

Para melhor qualidade de impressão:

| Configuração | Valor |
|--------------|-------|
| Tamanho do papel | A4 |
| Orientação | Retrato |
| Margens | 2cm (todas) |
| Escala | 100% |
| Gráficos de fundo | ✅ Sim |
| Cabeçalhos/Rodapés | Opcional |
| Qualidade | Alta/Máxima |

## Dicas

1. **Pré-visualização:** Sempre revise o PDF antes de imprimir
2. **Tamanho:** Manual Técnico ~4MB, Guia Usuário ~3MB
3. **Páginas:** Manual ~25 págs, Guia ~20 págs
4. **Impressão:** Use papel A4 branco 75g ou 90g
5. **Cores:** Os PDFs mantêm as cores originais (verde/branco)

## Solução de Problemas

### Problema: Imagens não aparecem
**Solução:** Marque "Gráficos de fundo" nas opções de impressão

### Problema: Texto cortado
**Solução:** Ajuste margens para 1.5cm ou reduza escala para 95%

### Problema: Muitas páginas em branco
**Solução:** Desmarque "Cabeçalhos e rodapés"

### Problema: Cores diferentes
**Solução:** Certifique-se de que "Gráficos de fundo" está marcado

## Resultado Final

Após gerar os PDFs, você terá:

```
marmitaria-vendas/
├── MANUAL_TECNICO.html       (arquivo fonte)
├── MANUAL_TECNICO.pdf        (PDF gerado) ✨
├── GUIA_USUARIO.html         (arquivo fonte)
└── GUIA_USUARIO.pdf          (PDF gerado) ✨
```

**Pronto para uso em produção!** 🎉
