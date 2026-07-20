# 🥋 MeuDojo - Guia de Utilização do Sistema

Bem-vindo ao **MeuDojo**, o sistema SaaS moderno para gestão completa de academias de artes marciais. Este guia descreve o passo a passo de como utilizar cada uma das funcionalidades implementadas até o momento no sistema.

---

## 🚀 1. Primeiro Acesso e Cadastro de Academia

Como o MeuDojo é uma plataforma **multiempresa (multi-tenant)** com dados totalmente isolados, o primeiro passo é criar a conta da sua academia:

1. Acesse o sistema e navegue até a tela de **Cadastro de Academia** (no frontend, através do link `/cadastro-academia`).
2. Preencha o nome da sua academia (ex: *Dojo Central*).
3. Insira os dados do **Administrador Inicial** (Nome, E-mail e Senha).
4. Clique em **Cadastrar**.
5. O tenant (empresa) será criado de forma atômica, o administrador inicial será vinculado a ele, e você será redirecionado logado para o **Dashboard**.

---

## 👥 2. Gestão de Membros (Usuários)

O controle de quem acessa o sistema é feito através do menu **Gestão de Membros**:

1. Acesse o menu lateral e clique em **Gestão de Membros**.
2. Nesta tela, o administrador pode registrar novos usuários para a academia, definindo o e-mail, senha e o respectivo **Perfil de Acesso (Role)**:
   - **Administrador (ADMIN)**: Acesso total a todas as configurações, cadastros, chamadas e relatórios.
   - **Professor (TEACHER)**: Pode visualizar turmas, alunos e realizar a chamada das suas respectivas aulas.
   - **Recepcionista (RECEPTIONIST)**: Acesso operacional para gerenciar cadastros de alunos, professores, turmas e realizar chamadas.
   - **Aluno (STUDENT)**: Acesso limitado para verificar seu próprio histórico de presenças e pagamentos (futuro).

---

## 🎓 3. Alunos e Professores

Antes de configurar treinos e aulas, é necessário registrar os praticantes e instrutores.

### 📝 Cadastro de Alunos
1. Clique em **Alunos** no menu esquerdo e selecione **Novo Aluno**.
2. Preencha os dados pessoais (Nome, E-mail opcional, Telefone, CPF/RG, Data de Nascimento, etc.).
3. **Preenchimento de Endereço Automático**: Ao digitar o CEP no formulário, o sistema consulta a API ViaCEP e autopreenche os campos de Rua, Bairro, Cidade e Estado para você.
4. **Vínculo com Usuário**: Se você marcar a opção *"Criar conta de usuário de acesso para o aluno"*, o sistema criará credenciais para que o aluno possa fazer login e ver seu próprio histórico.

### 📝 Cadastro de Professores/Sanseis
1. Acesse **Professores** no menu lateral e clique em **Novo Professor**.
2. Insira as informações pessoais, especialidades e a graduação atual do sensei/instrutor.
3. Assim como nos alunos, é possível vincular uma conta de acesso de login com perfil `TEACHER` automaticamente.

---

## 🎯 4. Modalidades & Faixas

Esta seção serve para configurar a estrutura de artes marciais ensinadas no dojo.

1. Clique em **Modalidades & Faixas** no menu lateral.
2. **Nova Modalidade**: Clique em *"Nova Modalidade"* para registrar uma nova arte marcial (ex: *Jiu-Jitsu*, *Judô*, *Muay Thai*).
3. **Gerenciar Faixas (Gaveta Lateral)**: Clique em uma modalidade cadastrada na lista. Um painel lateral será aberto exibindo a progressão de faixas.
4. **Cadastrar Faixas**:
   - Defina o nome (ex: *Faixa Azul*).
   - Defina a **Ordem de Progressão** (número inteiro onde 0 é a primeira faixa, 1 a segunda, etc.).
   - Escolha a **Cor da Faixa** de maneira visual usando o seletor de cores cromático. O sistema salva a cor hexadecimal para manter a interface com visual premium.

---

## 📅 5. Turmas & Matrículas

Com professores, alunos e modalidades cadastrados, você pode criar as turmas de treino.

### 🏫 Criar uma Turma
1. Acesse **Turmas & Matrículas** no menu lateral e clique em **Nova Turma**.
2. Insira o nome da turma (ex: *Jiu-Jitsu Adulto - Noite*), descrição, selecione a modalidade e o professor responsável.
3. **Múltiplos Horários Dinâmicos**: Defina os dias da semana e horários de início/fim clicando em *"+ Adicionar Horário"*. Você pode configurar, por exemplo, que a mesma turma treina *Segunda, Quarta e Sexta, das 19h00 às 20h30*.
4. Clique em **Salvar**.

### 🔗 Matricular Alunos nas Turmas
1. Em qualquer card de turma na tela principal, clique em **Matrículas**.
2. Um painel lateral mostrará a lista de alunos matriculados na turma.
3. **Nova Matrícula**: Selecione um aluno ativo na busca de seleção (o sistema lista apenas alunos ativos da academia que ainda não estão nesta turma) e clique em **Matricular**.
4. **Controle de Vínculo**: Altere o status de matrícula de um aluno de forma rápida entre **Ativa** ou **Inativa** clicando no respectivo botão de status.

---

## 📝 6. Frequência & Presença

A gestão de chamada é integrada de forma rápida e visual na aba **Frequência**:

### 📅 Fazer a Chamada do Dia
1. Acesse **Frequência** no menu lateral.
2. Na aba **Fazer Chamada**, selecione a **Turma** e escolha a **Data da Aula** (por padrão carrega o dia de hoje).
3. O sistema carregará a tabela com todos os alunos matriculados ativos.
4. Selecione o status de cada aluno:
   - **🟢 Presente**: O aluno compareceu e treinou normalmente.
   - **🔴 Falta**: Ausência sem justificativa.
   - **🟡 Atrasado**: Aluno chegou após o início do treino.
   - **🟣 Justificado**: Aluno não pôde treinar, mas justificou a ausência.
5. Digite observações ou justificativas no campo de texto ao lado do nome do aluno se necessário (ex: *"Apresentou atestado"* ou *"Chegou 15 minutos atrasado"*).
6. Clique em **Salvar Chamada** no fim da página para confirmar os registros.

### ➕ Presença Avulsa ou Aula de Reposição
Se um aluno precisa treinar em uma modalidade/turma na qual não está formalmente matriculado (como aula experimental, reposição ou planos livres de múltiplas artes marciais):
1. Na tela de **Fazer Chamada**, clique no botão **"+ Adicionar Aluno Avulso"** no canto superior direito da tabela de chamada.
2. Um modal será aberto exibindo a lista de todos os alunos ativos cadastrados no sistema que ainda não fazem parte da chamada atual.
3. Busque o aluno e clique em **Adicionar**.
4. O aluno será inserido dinamicamente na lista de chamadas com a tag pulsante **`Avulso / Reposição`** e status padrão definido como **Presente**.
5. Ao clicar em **Salvar Chamada**, esta presença avulsa é persistida permanentemente no banco de dados e ficará visível ao consultar esta chamada no futuro.

### 📅 Histórico por Aluno (Calendário Interativo)
1. Vá para a aba **Histórico por Aluno**.
2. Selecione o aluno desejado (se você estiver logado com perfil de Aluno, o campo virá travado no seu próprio nome).
3. **Indicador de Frequência**: Veja a taxa (%) geral de frequência calculada e o total de faltas, presenças e justificativas.
4. **Calendário Mensal**:
   - Navegue pelos meses usando as setas `<` e `>`.
   - Cada dia em que houve aula aparecerá colorido no calendário de acordo com a legenda de status (Verde, Vermelho, Laranja, Roxo).
   - O calendário exibe os dias dos meses adjacentes (anterior e posterior) de forma suavizada (cinza) para que a grade fique perfeitamente alinhada e completa.
   - Passe o mouse (hover) por cima de qualquer dia marcado para ver detalhes como: Nome da turma correspondente e observações/justificativas registradas.

---

## 📱 7. Aplicativo Instalável (PWA) & Uso Mobile

O **MeuDojo** foi arquitetado sob o conceito *Mobile-First*, garantindo uma usabilidade premium em dispositivos móveis e permitindo a instalação nativa do sistema em qualquer celular ou computador.

### 📥 Como Instalar o Aplicativo (PWA)
1. Faça login na sua conta no navegador do seu smartphone ou computador.
2. Na barra lateral de navegação (Sidebar), você verá o card/banner premium violeta **"Instalar Aplicativo"**.
3. Clique em **Instalar**.
4. **Desktop (Rich Install Dialog)**: Nos navegadores Chrome, Edge e outros baseados em Chromium, um diálogo elegante contendo capturas de tela reais do MeuDojo será aberto. Basta confirmar a instalação.
5. **Mobile**: O app será adicionado à tela inicial do seu celular, com ícone próprio e inicialização limpa (sem barras de navegação do navegador).
6. Após a instalação ser bem-sucedida, o banner de instalação desaparece da interface automaticamente.

### 📱 Experiência Mobile-First
* **Menu Deslizante (Slide-in Drawer)**: Em celulares, a barra de navegação fica oculta e pode ser aberta a partir do menu hamburguer (`☰`) no cabeçalho. Ela fecha de forma inteligente ao clicar fora ou navegar para outra tela.
* **Tabelas Adaptativas**: Em telas pequenas, as colunas menos importantes das tabelas de alunos e professores (como CPF e e-mail) são ocultadas progressivamente para evitar poluição visual. Todas as tabelas possuem scroll horizontal seguro para visualização completa por arraste.
* **Prevenção de Zoom no iOS**: Os campos de formulários em aparelhos Apple são configurados com tamanhos de fonte otimizados para evitar que o Safari force zooms incômodos e quebras de layout.

---

## 💰 8. Financeiro

O módulo **Financeiro** centraliza o controle de caixa da academia, cobrindo mensalidades dos alunos, receitas diversas e despesas operacionais. Acesse pelo menu lateral clicando em **Financeiro**.

> **Permissões**: ADMINs e Recepcionistas têm acesso completo. Alunos veem apenas as suas próprias cobranças.

### 📊 Aba "Painel Financeiro" (Dashboard)
Disponível para ADMIN e Recepcionista. Exibe um resumo instantâneo do mês vigente:
- **Recebido (Mês)**: Total de receitas confirmadas no mês corrente.
- **Despesas (Mês)**: Total de saídas operacionais lançadas no mês.
- **Resultado Caixa**: Saldo líquido (Receitas − Despesas). Fica verde se positivo e vermelho se negativo.
- **A Receber (Mês)**: Valor de mensalidades ainda pendentes com vencimento no mês atual.
- **Vencido (Total)**: Montante acumulado de cobranças em atraso de todos os meses.
- **Lista de Inadimplentes**: Tabela com todos os alunos que possuem mensalidades vencidas, mostrando o total de parcelas em atraso e o valor total. Um botão de e-mail rápido permite enviar uma cobrança com um único clique.

### 🧾 Aba "Mensalidades"
Controla as cobranças individuais de cada aluno:
1. **Gerar em Lote**: Clique em *"Gerar em Lote"* para abrir o modal. Selecione o mês/ano de referência, o valor padrão e a data de vencimento. O sistema gerará uma cobrança para **cada aluno com status Ativo** que ainda não tenha mensalidade para aquele período (evitando duplicidades automáticas).
2. **Nova Cobrança** (Individual): Para cobranças avulsas (ex: kimono, taxa de graduação), clique em *"Nova Cobrança"*, selecione o aluno, informe o valor, data de vencimento e uma observação opcional.
3. **Registrar Pagamento**: Na linha de uma cobrança Pendente ou Atrasada, clique em *"Pagar"*. Informe a data real de recebimento e confirme. O sistema irá:
   - Marcar a mensalidade como **Paga**.
   - Gerar automaticamente uma entrada de caixa do tipo `Receita → MEMBERSHIP` no Fluxo de Caixa.
4. **Excluir Cobrança**: Clique no ícone 🗑️ para excluir. Se a cobrança já estava paga, a respectiva receita será automaticamente estornada do caixa (operação atômica via transação Prisma).
5. **Filtros**: Filtre as cobranças por status (`Todos`, `Pendente`, `Pago`, `Atrasado`) e pesquise por nome do aluno.

### 💸 Aba "Fluxo de Caixa"
Extrato cronológico com todas as entradas e saídas do período selecionado:
1. **Navegação por Mês/Ano**: Use os seletores de mês e ano para navegar entre os períodos.
2. **Lançar no Caixa**: Clique em *"Lançar Caixa"* para registrar qualquer movimentação operacional manual:
   - **Receita (Entrada)**: Ex. Venda de equipamentos, seminário externo.
   - **Despesa (Saída)**: Ex. Aluguel do dojo, energia elétrica, salário de professores.
   - Informe a descrição, valor, data e categoria.
3. **Cards de Balanço**: Ao topo da listagem, o sistema exibe o total de **Entradas**, **Saídas** e o **Balanço do Período** filtrado.
4. **Estornar Movimentação**: Clique no ícone 🗑️ ao lado de qualquer lançamento. Se o lançamento estiver vinculado ao pagamento de uma mensalidade, o status da mensalidade retornará para *Pendente* automaticamente.

---

## 🔄 9. Botão de Atualizar (Refresh)

Em todas as telas principais de gestão, foi implementado um botão **"Atualizar"** posicionado no canto superior direito do cabeçalho da página:

1. **Atualização em Segundo Plano**: Ao clicar em **"Atualizar"**, o sistema faz o re-fetching de todas as consultas HTTP daquela tela diretamente com o servidor PostgreSQL, obtendo os dados mais recentes em tempo real sem precisar recarregar o navegador (`F5`).
2. **Indicador de Carregamento Dinâmico**: Durante a atualização, o botão exibe o status *"Atualizando..."* e o ícone de rotação gira continuamente. O botão é desabilitado temporariamente durante esse processo para evitar requisições redundantes.

---

*Este guia será atualizado à medida que novas funcionalidades forem adicionadas ao ecossistema do MeuDojo.*

