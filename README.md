# Planej.ai — Educador Financeiro

Aplicação de educação financeira desenvolvida para o desafio da DIO. O usuário informa sua renda, seus gastos, suas dívidas e uma meta. Com esses dados, o projeto apresenta um resumo financeiro e usa a API do Google Gemini para gerar um diagnóstico personalizado.

## O que o projeto faz

- Simulação guiada em etapas para planejar uma meta financeira.
- Diagnóstico com análise de viabilidade, sugestões práticas, ideias de renda extra e sugestões de investimento.
- Histórico de simulações, com acesso aos detalhes e opção de exclusão.
- Conversa com um educador financeiro virtual sobre cada simulação.
- Persistência das simulações, dos diagnósticos e das conversas no `localStorage`.
- Interface responsiva com temas claro e escuro, estados de carregamento e mensagens de erro.

Os dados ficam no navegador utilizado. Limpar os dados do site remove o histórico; ele não é sincronizado entre dispositivos. Os dados da simulação e as perguntas são enviados ao Gemini para gerar as respostas.

## Como executar

### Pré-requisitos

- Node.js compatível com o Vite 8: versão 20.19+ ou 22.12+.
- pnpm instalado.
- Uma chave de API do Gemini, obtida no [Google AI Studio](https://aistudio.google.com/).

### Instalação

1. Clone seu fork ou este repositório e entre na pasta do projeto.
2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Crie o arquivo `.env.local` na raiz:

   ```env
   VITE_GEMINI_API_KEY=sua_chave_do_gemini
   ```

4. Inicie a aplicação:

   ```bash
   pnpm dev
   ```

5. Abra o endereço exibido no terminal. Se alterar a chave, reinicie o servidor.

A geração dos diagnósticos e das respostas depende da conexão e da disponibilidade e cota da API. O aplicativo exibe uma mensagem em caso de falha e permite tentar novamente.

O arquivo `.env.local` não deve ser enviado ao GitHub. Como esta versão chama a API pelo frontend, a chave pode ser acessada pelo navegador; para uma publicação em produção, a chamada deve passar por um backend que proteja a credencial.

### Comandos disponíveis

```bash
pnpm dev       # Inicia o servidor de desenvolvimento
pnpm build     # Verifica o TypeScript e gera a versão de produção
pnpm preview   # Visualiza o build localmente
pnpm lint      # Verifica as regras do ESLint
```

## Tecnologias utilizadas

- React 19 e TypeScript.
- Vite 8.
- Tailwind CSS 4.
- React Router para navegação.
- Google Gemini API para diagnóstico e conversa.
- Lucide React para ícones.
- React Loading Skeleton para o carregamento do diagnóstico.
- `localStorage` para persistência no navegador.
- ESLint, Prettier e pnpm para desenvolvimento e organização do projeto.

## Melhorias implementadas

Implementei a página de histórico e a conversa com o educador financeiro. O histórico mostra a meta, a data de criação, o custo, o prazo e a economia mensal necessária, além de permitir excluir uma simulação e reabrir seus resultados.

Na conversa, o usuário pode fazer várias perguntas sobre a mesma simulação. A IA recebe o contexto financeiro e as mensagens anteriores. As perguntas e respostas ficam salvas, o painel rola automaticamente e há feedback de carregamento, erro e nova tentativa.

Também adicionei o reaproveitamento dos diagnósticos salvos para evitar novas chamadas ao revisitar uma simulação, proteção contra envios simultâneos e ajustes visuais baseados nas telas de referência do desafio.

## Como testar o fluxo principal

1. Execute o projeto com uma chave válida do Gemini e clique em **Nova Simulação**.
2. Preencha as etapas com os dados de exemplo:

   | Campo              | Valor               |
   | ------------------ | ------------------- |
   | Renda mensal       | R$ 5.000,00         |
   | Custos fixos       | R$ 2.000,00         |
   | Dívidas / parcelas | R$ 500,00           |
   | Nome da meta       | Viagem para o Japão |
   | Custo da meta      | R$ 15.000,00        |
   | Prazo              | 12 meses            |

3. Clique em **Gerar simulação** e aguarde o diagnóstico.
4. No campo de conversa, pergunte: “Como posso economizar mais para atingir minha meta?”. Confira o carregamento, a resposta e a rolagem automática.
5. Faça outra pergunta, como “E se eu aumentar o prazo para 18 meses?”, e confira se o histórico permanece na tela.
6. Abra **Histórico** e confira a simulação. A economia mensal necessária deve ser **R$ 1.250,00** neste exemplo.
7. Clique em **Ver detalhes**. O diagnóstico e a conversa já salvos devem reaparecer. Atualize a página para conferir a persistência.
8. Crie uma segunda simulação e confira que sua conversa é independente da primeira.
9. Volte ao histórico e exclua uma simulação pelo ícone de lixeira. Atualize a página e confira que apenas ela foi removida.
10. Teste os temas claro e escuro e reduza a largura da janela para conferir a adaptação ao celular.

Para testar o erro da conversa, desative a conexão antes de enviar uma nova pergunta. Depois, restaure a conexão e clique em **Tentar novamente**. A pergunta deve ser retomada sem duplicação.

## O que aprendi durante o desafio

Durante o desenvolvimento, pratiquei a criação de componentes reutilizáveis, a tipagem dos dados com TypeScript e a organização da lógica em hooks. Aprendi a integrar uma API de IA, enviar o contexto de uma simulação e validar a resposta antes de exibi-la.

Também trabalhei com estados de carregamento e erro, controle de chamadas duplicadas com `useRef`, persistência no `localStorage`, navegação entre páginas e rolagem automática. A implementação das telas reforçou a importância de layouts responsivos e de uma experiência consistente nos temas claro e escuro.
