# ImovLocal — Aplicar a correção de fotos e preparar o Pull Request

O arquivo de correção de fotos (`ImovLocal-fix-foto-anuncio-sessao(1).patch`) é aplicado exatamente como foi enviado, em uma branch separada do repositório `fase2imov`. Em seguida, os testes rodam e um Pull Request para a `main` é preparado.
A `main` não é alterada, nada é juntado, o site não é publicado e nenhum serviço novo é ativado.

**Status: aprovado pelo usuário.**

## O que a correção entrega

- A foto escolhida é reduzida (JPEG, no máximo cerca de 1200 px no lado maior) e guardada na própria aba do navegador.
- A mesma foto aparece no formulário, no feed, em "Meus anúncios" e na página do anúncio, inclusive depois do F5. Ela some ao fechar a aba.
- **Edição:** as fotos atuais aparecem como miniaturas. Escolher novas fotos substitui as antigas. O limite é de 5 fotos, com aviso.
- **Espaço da aba cheio:** o anúncio é salvo com menos fotos e aparece um aviso. Nunca entra uma foto de exemplo no lugar.
- Imagens que não carregam mostram "Sem foto (demonstração)".
- **Avisos corrigidos:**
  - o anúncio vale só nesta aba;
  - fechar a aba apaga o anúncio;
  - ele não aparece em outros aparelhos;
  - a foto não aparece na prévia do WhatsApp.
- A prévia do WhatsApp continua sem mostrar a foto enviada, porque a foto existe só no navegador de quem criou.

## Para quem é

- **Você:** revisa o Pull Request e decide sobre a junção com a `main`.
- **Quem testa como anunciante:** precisa ver a mesma foto escolhida em todas as telas.

## O que será feito

1. Criar a branch `fix/foto-anuncio-sessao` a partir da `main` atual.
2. Aplicar o arquivo exatamente como enviado. Se alguma parte não encaixar no código atual, a execução para e o conflito é explicado. Nada é adaptado.
3. Rodar somente:
   - os testes automáticos que vêm no arquivo: salvamento na aba e redução das fotos;
   - o build de produção.
4. Se a instalação falhar, corrigir apenas cache ou dependências, sem mudar o código da aplicação.
5. Fazer o commit na branch.
6. Preparar o Pull Request da `fix/foto-anuncio-sessao` para a `main` e enviar o link com um resumo objetivo dos testes.

## O que fica de fora

- Login, banco de dados, armazenamento externo, painel administrativo ou qualquer outra melhoria.
- Mudanças no visual atual e nos 16 anúncios de demonstração.
- Commit na `main`, junção (merge) e publicação do site.

## Visual

Nada muda no visual aprovado. Só aparecem os textos de aviso já incluídos no arquivo.

## Etapas

1. **Agora:** branch, arquivo de correção, testes do arquivo, build de produção, commit e Pull Request com link.
2. **Depois, com sua autorização:** login dos anunciantes e anúncios salvos de verdade.
3. **Depois, com sua autorização:** armazenamento público das fotos, para que apareçam em outros aparelhos e na prévia do WhatsApp.

## Premissas

- O arquivo `ImovLocal-fix-foto-anuncio-sessao(1).patch` é o mesmo arquivo de correção já enviado nesta conversa. Se o conteúdo for diferente, vale o arquivo novo.
- **Acesso ao GitHub:**
  - Enviar a branch e abrir o Pull Request exige uma chave de acesso do GitHub com permissão de escrita só neste repositório. Ela será pedida por cartão seguro, nunca pelo chat.
  - Sem a chave, a branch é enviada pelo botão "Save to GitHub" da plataforma. Nesse caso, o link enviado é o da página do GitHub que abre o Pull Request com um clique.
- Se o arquivo não encaixar ou algum teste falhar, não há ajuste por conta própria. A execução para e o problema é relatado.
