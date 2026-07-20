import React, { useState } from 'react';
import {
  BookOpen, Search, ChevronRight, X,
  Building2, Users, GraduationCap, Target, Calendar,
  ClipboardCheck, DollarSign, Smartphone, RefreshCw, HelpCircle
} from 'lucide-react';

interface Screenshot {
  src: string;
  alt: string;
  caption: string;
}

interface HelpSection {
  id: string;
  emoji: string;
  icon: React.ElementType;
  title: string;
  description: string;
  steps: {
    title?: string;
    text: string;
    screenshots?: Screenshot[];
  }[];
}

const sections: HelpSection[] = [
  {
    id: 'cadastro-academia',
    emoji: '🚀',
    icon: Building2,
    title: 'Primeiro Acesso e Cadastro',
    description: 'Como criar sua conta e configurar sua academia no MeuDojo.',
    steps: [
      {
        text: 'O MeuDojo é uma plataforma multiempresa (multi-tenant). O primeiro passo é criar a conta da sua academia. Acesse a tela de Cadastro de Academia através do link /cadastro-academia.',
        screenshots: [
          { src: '/help-screenshots/landing_page_1784589552277.png', alt: 'Landing Page', caption: 'Tela inicial do MeuDojo' },
          { src: '/help-screenshots/cadastro_academia_1784589561135.png', alt: 'Cadastro de Academia', caption: 'Formulário de Cadastro de Academia' },
        ]
      },
      {
        text: 'Preencha o nome da sua academia (ex: Dojo Central) e insira os dados do Administrador Inicial (Nome, E-mail e Senha). Clique em Cadastrar. O tenant sera criado de forma atomica e voce sera redirecionado para o Dashboard.',
        screenshots: [
          { src: '/help-screenshots/cadastro_preenchido_1784589580711.png', alt: 'Cadastro Preenchido', caption: 'Formulario preenchido com dados da academia' },
          { src: '/help-screenshots/cadastro_submetido_1784589589797.png', alt: 'Cadastro Confirmado', caption: 'Academia criada com sucesso' },
          { src: '/help-screenshots/dashboard_1784589597047.png', alt: 'Dashboard', caption: 'Dashboard apos o primeiro login' },
        ]
      },
    ]
  },
  {
    id: 'gestao-membros',
    emoji: '👥',
    icon: Users,
    title: 'Gestao de Membros',
    description: 'Configure os perfis de acesso de quem usa o sistema.',
    steps: [
      {
        text: 'Acesse o menu lateral e clique em Gestao de Membros. Nesta tela, o administrador pode registrar novos usuarios para a academia, definindo o e-mail, senha e o respectivo Perfil de Acesso (Role).',
        screenshots: [
          { src: '/help-screenshots/login_1784589556917.png', alt: 'Tela de Login', caption: 'Tela de login do sistema' },
        ]
      },
      {
        title: 'Perfis de Acesso:',
        text: '• Administrador (ADMIN): Acesso total a todas as configuracoes, cadastros, chamadas e relatorios.\n• Professor (TEACHER): Pode visualizar turmas, alunos e realizar a chamada das suas respectivas aulas.\n• Recepcionista (RECEPTIONIST): Acesso operacional para gerenciar cadastros de alunos, professores, turmas e realizar chamadas.\n• Aluno (STUDENT): Acesso limitado para verificar seu proprio historico de presenças e pagamentos.',
      },
    ]
  },
  {
    id: 'alunos-professores',
    emoji: '🎓',
    icon: GraduationCap,
    title: 'Alunos e Professores',
    description: 'Cadastre os praticantes e instrutores do seu dojo.',
    steps: [
      {
        title: 'Cadastro de Alunos',
        text: 'Clique em Alunos no menu esquerdo e selecione Novo Aluno. Preencha os dados pessoais (Nome, E-mail, Telefone, CPF/RG, Data de Nascimento). Ao digitar o CEP, o sistema consulta a API ViaCEP e autopreenche o endereco automaticamente. Se desejar, marque a opcao para criar uma conta de acesso para o aluno.',
        screenshots: [
          { src: '/help-screenshots/alunos_vazio_1784589609129.png', alt: 'Lista de Alunos Vazia', caption: 'Tela de alunos sem registros' },
          { src: '/help-screenshots/aluno_cadastro_modal_1_1784589614887.png', alt: 'Formulario de Aluno', caption: 'Modal de cadastro de novo aluno' },
          { src: '/help-screenshots/alunos_lista_1784589673772.png', alt: 'Lista de Alunos', caption: 'Lista de alunos cadastrados' },
        ]
      },
      {
        title: 'Cadastro de Professores/Sanseis',
        text: 'Acesse Professores no menu lateral e clique em Novo Professor. Insira as informacoes pessoais, especialidades e a graduacao atual do sensei/instrutor. Assim como nos alunos, e possivel vincular uma conta de acesso de login com perfil TEACHER automaticamente.',
        screenshots: [
          { src: '/help-screenshots/professores_vazio_1784589682895.png', alt: 'Lista de Professores Vazia', caption: 'Tela de professores sem registros' },
          { src: '/help-screenshots/professor_cadastro_modal_1_1784589689799.png', alt: 'Formulario de Professor', caption: 'Modal de cadastro de novo professor' },
          { src: '/help-screenshots/professores_lista_1784589742583.png', alt: 'Lista de Professores', caption: 'Lista de professores cadastrados' },
        ]
      },
    ]
  },
  {
    id: 'modalidades-faixas',
    emoji: '🎯',
    icon: Target,
    title: 'Modalidades e Faixas',
    description: 'Configure as artes marciais e a progressao de faixas.',
    steps: [
      {
        text: 'Clique em Modalidades e Faixas no menu lateral. Em Nova Modalidade, registre uma nova arte marcial (ex: Jiu-Jitsu, Judo, Muay Thai). Apos criar uma modalidade, clique nela para abrir o painel lateral de faixas.',
        screenshots: [
          { src: '/help-screenshots/modalidades_vazio_1784589828058.png', alt: 'Modalidades Vazia', caption: 'Tela de modalidades sem registros' },
          { src: '/help-screenshots/modalidade_preenchido_1784589847024.png', alt: 'Modalidade Preenchida', caption: 'Formulario de nova modalidade' },
          { src: '/help-screenshots/modalidades_lista_1784589859175.png', alt: 'Lista de Modalidades', caption: 'Lista de modalidades cadastradas' },
        ]
      },
      {
        title: 'Gerenciar Faixas:',
        text: 'Defina o nome (ex: Faixa Azul), a Ordem de Progressao (numero inteiro onde 0 e a primeira faixa) e escolha a Cor da Faixa de forma visual usando o seletor de cores cromatico. O sistema salva a cor hexadecimal para manter a interface com visual premium.',
      },
    ]
  },
  {
    id: 'turmas-matriculas',
    emoji: '📅',
    icon: Calendar,
    title: 'Turmas e Matriculas',
    description: 'Crie turmas e gerencie as matriculas dos alunos.',
    steps: [
      {
        title: 'Criar uma Turma',
        text: 'Acesse Turmas e Matriculas no menu lateral e clique em Nova Turma. Insira o nome da turma, selecione a modalidade e o professor responsavel. Em Multiplos Horarios Dinamicos, defina os dias da semana e horarios clicando em + Adicionar Horario.',
        screenshots: [
          { src: '/help-screenshots/turmas_vazio_1784589753247.png', alt: 'Turmas Vazias', caption: 'Tela de turmas sem registros' },
          { src: '/help-screenshots/turma_cadastro_modal_1784589760380.png', alt: 'Cadastro de Turma', caption: 'Modal de cadastro de nova turma' },
          { src: '/help-screenshots/turma_preenchido_1784589799965.png', alt: 'Turma Preenchida', caption: 'Formulario de turma com horarios definidos' },
          { src: '/help-screenshots/turmas_lista_1784589955363.png', alt: 'Lista de Turmas', caption: 'Cards de turmas cadastradas' },
        ]
      },
      {
        title: 'Matricular Alunos:',
        text: 'Em qualquer card de turma, clique em Matriculas. Um painel lateral mostrara a lista de alunos matriculados. Em Nova Matricula, selecione um aluno ativo e clique em Matricular. Altere o status da matricula entre Ativa ou Inativa com um clique.',
        screenshots: [
          { src: '/help-screenshots/matriculas_modal_1784589935410.png', alt: 'Modal de Matriculas', caption: 'Painel lateral de matriculas da turma' },
          { src: '/help-screenshots/matricula_sucesso_1784589946870.png', alt: 'Matricula Realizada', caption: 'Aluno matriculado com sucesso' },
        ]
      },
    ]
  },
  {
    id: 'frequencia',
    emoji: '📝',
    icon: ClipboardCheck,
    title: 'Frequencia e Presenca',
    description: 'Registre a chamada e acompanhe o historico de presenca.',
    steps: [
      {
        title: 'Fazer a Chamada do Dia',
        text: 'Acesse Frequencia no menu lateral. Na aba Fazer Chamada, selecione a Turma e escolha a Data da Aula. O sistema carregara todos os alunos matriculados ativos. Selecione o status de cada aluno: Presente, Falta, Atrasado ou Justificado. Clique em Salvar Chamada para confirmar.',
        screenshots: [
          { src: '/help-screenshots/frequencia_chamada_1784589966079.png', alt: 'Tabela de Chamada', caption: 'Tabela de chamada com status dos alunos' },
        ]
      },
      {
        title: 'Historico por Aluno (Calendario Interativo)',
        text: 'Va para a aba Historico por Aluno. Selecione o aluno desejado. Veja a taxa (%) geral de frequencia e o calendario mensal colorido por status. Passe o mouse sobre qualquer dia marcado para ver detalhes como nome da turma e observacoes registradas.',
        screenshots: [
          { src: '/help-screenshots/frequencia_historico_1784589995974.png', alt: 'Historico de Frequencia', caption: 'Calendario interativo de frequencia do aluno' },
        ]
      },
    ]
  },
  {
    id: 'financeiro',
    emoji: '💰',
    icon: DollarSign,
    title: 'Financeiro',
    description: 'Controle mensalidades, receitas e despesas da academia.',
    steps: [
      {
        title: 'Painel Financeiro (Dashboard)',
        text: 'No Painel Financeiro voce ve: Recebido (Mes), Despesas (Mes), Resultado Caixa, A Receber (Mes), Vencido (Total) e a Lista de Inadimplentes com botao de e-mail de cobranca com um unico clique.',
        screenshots: [
          { src: '/help-screenshots/financeiro_painel_1784590005944.png', alt: 'Painel Financeiro', caption: 'Dashboard financeiro com resumo do mes' },
          { src: '/help-screenshots/financeiro_painel_atualizado_1784590177271.png', alt: 'Painel Atualizado', caption: 'Painel financeiro com dados atualizados' },
        ]
      },
      {
        title: 'Mensalidades',
        text: 'Gere cobracas em Lote para todos os alunos ativos de um periodo (evitando duplicidades). Para cobracas individuais, clique em Nova Cobranca. Para registrar pagamento, clique em Pagar na linha da cobranca, informe a data e confirme. O sistema marca como Paga e gera a entrada no caixa automaticamente.',
        screenshots: [
          { src: '/help-screenshots/lote_form_estado_1784590081602.png', alt: 'Gerar em Lote', caption: 'Formulario de geracao de mensalidades em lote' },
          { src: '/help-screenshots/cobranca_preenchido_1784590040575.png', alt: 'Nova Cobranca', caption: 'Formulario de nova cobranca individual' },
          { src: '/help-screenshots/mensalidades_lista_1784590142284.png', alt: 'Lista de Mensalidades', caption: 'Lista de mensalidades e seus status' },
          { src: '/help-screenshots/recebimento_modal_preenchido_1784590156975.png', alt: 'Registrar Pagamento', caption: 'Modal de registro de pagamento' },
          { src: '/help-screenshots/mensalidades_lista_paga_1784590169372.png', alt: 'Mensalidade Paga', caption: 'Mensalidade marcada como paga' },
        ]
      },
    ]
  },
  {
    id: 'pwa',
    emoji: '📱',
    icon: Smartphone,
    title: 'Aplicativo Instalavel (PWA)',
    description: 'Instale o MeuDojo como app nativo no celular ou computador.',
    steps: [
      {
        text: 'Na barra lateral, voce vera o card violeta Instalar Aplicativo. Clique em Instalar. No desktop (Chrome/Edge), um dialogo elegante sera exibido. No mobile, o app sera adicionado a tela inicial com icone proprio.',
        screenshots: [
          { src: '/help-screenshots/dashboard_atualizado_1784590191424.png', alt: 'Dashboard Completo', caption: 'Dashboard com todos os dados e opcao de instalacao PWA' },
          { src: '/help-screenshots/dashboard_atualizado_scroll_1784590195859.png', alt: 'Dashboard Scroll', caption: 'Visao completa do dashboard com cards de resumo' },
        ]
      },
      {
        title: 'Experiencia Mobile-First:',
        text: '• Menu Deslizante: Em celulares, a barra de navegacao pode ser aberta pelo menu hamburguer.\n• Tabelas Adaptativas: Em telas pequenas, colunas menos importantes sao ocultadas progressivamente.\n• Prevencao de Zoom no iOS: Campos de formularios sao configurados para evitar zooms indevidos no Safari.',
      },
    ]
  },
  {
    id: 'refresh',
    emoji: '🔄',
    icon: RefreshCw,
    title: 'Botao de Atualizar',
    description: 'Atualize os dados em tempo real sem recarregar a pagina.',
    steps: [
      {
        text: 'Em todas as telas principais, ha um botao "Atualizar" no canto superior direito. Ao clicar, o sistema faz o re-fetching de todas as consultas daquela tela diretamente com o servidor, obtendo dados em tempo real sem precisar recarregar o navegador (F5). Durante a atualizacao, o botao exibe "Atualizando..." com icone girando e fica desabilitado temporariamente.',
        screenshots: [
          { src: '/help-screenshots/dashboard_scroll_1784589600176.png', alt: 'Dashboard com Botao Refresh', caption: 'Dashboard com botao de atualizacao no canto superior direito' },
        ]
      },
    ]
  },
];

const Lightbox: React.FC<{ src: string; alt: string; caption: string; onClose: () => void }> = ({ src, alt, caption, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
      <button
        onClick={onClose}
        className="absolute -top-10 right-0 text-white hover:text-zinc-300 transition-colors"
        aria-label="Fechar"
      >
        <X className="h-8 w-8" />
      </button>
      <img src={src} alt={alt} className="w-full rounded-xl border border-zinc-700 shadow-2xl" />
      <p className="mt-3 text-center text-sm text-zinc-400">{caption}</p>
    </div>
  </div>
);

export const HelpCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption: string } | null>(null);

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];
  const currentIdx = sections.findIndex(s => s.id === activeSection);

  return (
    <div className="flex flex-col gap-6">
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} caption={lightbox.caption} onClose={() => setLightbox(null)} />
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-zinc-900 to-zinc-900 border border-violet-500/20 p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-500/30">
            <HelpCircle className="h-7 w-7 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Central de Ajuda</h1>
            <p className="text-zinc-400 mt-1">Guia completo de utilizacao do MeuDojo</p>
          </div>
        </div>
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Pesquisar topicos de ajuda..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
        </div>
        {searchQuery && (
          <div className="relative mt-3 flex flex-wrap gap-2">
            {filteredSections.length === 0 ? (
              <span className="text-sm text-zinc-500">Nenhum topico encontrado.</span>
            ) : filteredSections.map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setSearchQuery(''); }}
                className="rounded-full border border-violet-500/30 bg-violet-600/10 px-3 py-1 text-xs font-medium text-violet-300 hover:bg-violet-600/20 transition-colors"
              >
                {s.emoji} {s.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar de Navegacao */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 gap-1">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Topicos</p>
          {sections.map(section => {
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-400 border border-violet-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <span className="text-base leading-none">{section.emoji}</span>
                <span className="flex-1 leading-snug text-xs">{section.title}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-violet-400" />}
              </button>
            );
          })}
        </aside>

        {/* Mobile tabs */}
        <div className="flex flex-col flex-1 min-w-0 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  section.id === activeSection ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {section.emoji} {section.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Conteudo da Secao */}
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-4 border-b border-zinc-800 bg-zinc-900/60 px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl shrink-0">
                {currentSection.emoji}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{currentSection.title}</h2>
                <p className="text-sm text-zinc-400">{currentSection.description}</p>
              </div>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {currentSection.steps.map((step, stepIdx) => (
                <div key={stepIdx} className="px-6 py-6">
                  {step.title && (
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-300">
                      <BookOpen className="h-4 w-4" />
                      {step.title}
                    </h3>
                  )}
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">{step.text}</p>

                  {step.screenshots && step.screenshots.length > 0 && (
                    <div className={`mt-5 grid gap-3 ${
                      step.screenshots.length === 1 ? 'grid-cols-1 max-w-xl'
                      : step.screenshots.length === 2 ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {step.screenshots.map((ss, ssIdx) => (
                        <button
                          key={ssIdx}
                          id={`help-screenshot-${currentSection.id}-${stepIdx}-${ssIdx}`}
                          onClick={() => setLightbox(ss)}
                          className="group relative overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-800/40 transition-all duration-200 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 hover:scale-[1.02] text-left"
                        >
                          <div className="overflow-hidden" style={{ maxHeight: '180px' }}>
                            <img
                              src={ss.src}
                              alt={ss.alt}
                              className="w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-x-0 top-0 bottom-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white font-medium border border-white/20">
                              Ampliar imagem
                            </div>
                          </div>
                          <div className="px-3 py-2 bg-zinc-800/80 border-t border-zinc-700/40">
                            <p className="text-xs text-zinc-400 truncate">{ss.caption}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer navegacao */}
            <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/40 px-6 py-4">
              {currentIdx > 0 ? (
                <button
                  onClick={() => setActiveSection(sections[currentIdx - 1].id)}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>{sections[currentIdx - 1].emoji} {sections[currentIdx - 1].title}</span>
                </button>
              ) : <div />}
              {currentIdx < sections.length - 1 && (
                <button
                  onClick={() => setActiveSection(sections[currentIdx + 1].id)}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors ml-auto"
                >
                  <span>{sections[currentIdx + 1].emoji} {sections[currentIdx + 1].title}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
