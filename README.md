# GeekZone

Loja virtual demonstrativa de hardware, periféricos e colecionáveis, feita com HTML, CSS e JavaScript puro.

## O que tem

- Catálogo com busca e filtro por categoria.
- Carrinho com quantidades e total.
- Alternância entre tema claro e escuro.
- Assistente que aceita comandos por voz ou texto.
- Carrinho e tema salvos no navegador.

## Como abrir

Não precisa instalar dependências. Abra a pasta no VS Code e inicie um servidor local, por exemplo com a extensão **Live Server**. Depois acesse o endereço local mostrado pela extensão.

Para usar o microfone, abra o site em `localhost` ou por HTTPS, permita o acesso ao microfone e use um navegador com reconhecimento de voz compatível, como Chrome ou Edge. O reconhecimento pode depender da conexão com a internet. Se a voz não estiver disponível, use o campo de texto do assistente.

## Arquivos principais

- `index.html` — estrutura da página.
- `style.css` — estilos e layout responsivo.
- `script.js` — produtos, busca, filtros, tema e carrinho.
- `robo.js` — assistente por voz e comandos digitados.

## Publicar no GitHub

Crie um repositório vazio no GitHub e, no terminal aberto nesta pasta, execute:

```bash
git init
git add .
git commit -m "Adiciona loja GeekZone"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Troque `SEU-USUARIO` e `SEU-REPOSITORIO` pelos dados do repositório. Para publicar como site estático, abra **Settings > Pages** no GitHub e selecione a branch `main` e a pasta `/ (root)`.

## Observações

Este projeto é uma demonstração de interface: a finalização da compra não processa pagamentos nem envia pedidos para um servidor. As imagens e fontes são carregadas de serviços externos.
