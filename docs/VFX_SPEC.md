# PokeMMO Arena --- Especificação de VFX, Animação e Comportamento dos Moves

> Documento de design para orientar a geração/implementação dos efeitos
> visuais dos golpes cadastrados. As descrições visuais abaixo são
> propostas de implementação derivadas do nome, tipo, categoria, asset
> associado e descrição do move na fonte; devem ser validadas
> visualmente no jogo. Os dados de move não são substituídos por esta
> especificação.

## 1. Objetivo

Definir, para cada move do catálogo, uma receita visual consistente para
Canvas 2D/Phaser: o que aparece, como anima, como interage com o
alvo/arena e quais responsabilidades pertencem à lógica de combate. A
estética-alvo é pixel art nítida inspirada em GBA / Pokémon Mystery
Dungeon, com alinhamento a pixels inteiros e sem suavização bilinear.

## 2. Regras globais obrigatórias

-   **Separar gameplay de apresentação:** o VFX nunca calcula poder,
    precisão, crítico, status, cura ou knockback. Recebe eventos já
    resolvidos pelo sistema de combate.
-   **Sem blur:** `ctx.imageSmoothingEnabled = false`; posicionamento e
    escala devem respeitar a grade de pixels sempre que possível.
-   **Composição em camadas:** preparação → execução/projétil → impacto
    → residual/feedback, usando apenas as camadas relevantes para cada
    move.
-   **Duração controlada:** efeitos ofensivos devem ter início, pico e
    encerramento definidos; evitar overlays permanentes por acidente.
-   **Pooling:** reutilizar projéteis e partículas em combates intensos;
    limitar partículas simultâneas e limpar tudo ao terminar a batalha.
-   **Legibilidade:** nunca esconder por muito tempo o Pokémon, a barra
    de vida ou a direção do ataque; priorizar silhuetas e contraste.
-   **Hit único por janela:** um efeito visual não pode aplicar dano.
    Múltiplos acertos devem vir da lógica e ser representados por
    eventos de hit separados.
-   **Arena desacoplada:** decalques (`scorch`, `wet`, `zap_burn`,
    `crack`) são cosméticos e removíveis; só alteram gameplay se houver
    regra explícita.
-   **Escalabilidade:** o poder pode influenciar
    intensidade/escala/partículas, mas não deve ser usado como
    substituto de uma regra visual específica do move.

## 3. Pipeline visual padrão

1.  **Antecipação:** pose, brilho, carga ou aviso no chão. Usar apenas
    quando o movimento pede preparação.
2.  **Execução:** sprite de spritesheet, projétil em pixel art, overlay
    procedural ou movimento do usuário.
3.  **Colisão/contato:** evento do sistema de combate; o VFX mostra o
    acerto, erro, bloqueio ou imunidade recebido.
4.  **Impacto:** flash curto, fragmentos, faíscas, respingos, rachaduras
    ou onda de choque.
5.  **Consequência visual:** decalque, cura, buff/debuff, estado
    persistente ou desaparecimento.

## 4. Como escolher os recursos

-   Se o move tem spritesheet e frames mapeados no relatório original,
    usar primeiro o recorte indicado como base; adicionar VFX procedural
    apenas para completar trajetória, impacto ou leitura.
-   Se for projétil balístico, usar `pixelArtVfx.js` com matriz de
    pixels ou spritesheet de projétil, trajetória e sombra dinâmica.
-   Se for corte, mordida, raio, feixe, pedra, onda ou investida,
    reutilizar o renderer procedural da família indicada abaixo.
-   Para moves de status, cura e buff, não usar automaticamente explosão
    ou hit flash ofensivo: a leitura deve comunicar a consequência do
    move.
-   O sprite associado na tabela pode ser genérico ou inadequado ao
    efeito real; tratar o nome/descrição do move como fonte semântica
    principal e o asset existente como fallback visual.

## 5. Biblioteca de famílias de VFX

### Projétil / disparo

-   **VFX:** Criar um sprite de projétil pixelado com contorno escuro,
    volume de 2--4 tons e brilho especular pequeno. O projétil deve ser
    claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento:** Colisão por hitbox simples durante o percurso. Ao
    acertar, consumir o projétil e emitir evento de impacto; ao exceder
    alcance ou tempo de vida, removê-lo sem causar dano.

### Corte / lâmina

-   **VFX:** Arco ou risco angular de 2--4 pixels de espessura, com
    núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar
    dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento:** Ataque de curta distância orientado para o
    alvo/direção. Aplicar um único hit por janela de ataque, salvo
    quando a descrição indicar múltiplos golpes.

### Mordida / presas

-   **VFX:** Duas mandíbulas ou presas pixeladas que se fecham ao redor
    do ponto de contato; usar sombra escura, dentes claros e flash
    breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento:** Exige proximidade. O acerto ocorre no instante do
    fechamento das mandíbulas; efeitos de flinch ou redução de defesa
    são tratados pela lógica de status, não pelo desenho.

### Raio / sopro / onda

-   **VFX:** Feixe ou fluxo direcionado com núcleo claro, borda colorida
    e pequenas partículas. Para ondas sonoras, usar anéis/linhas de
    distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento:** Pode ser instantâneo, contínuo ou em pulso,
    conforme a descrição. Verificar colisão ao longo do feixe/volume
    durante sua janela ativa e encerrar ao fim da duração.

### Investida / colisão

-   **VFX:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento:** Movimentar o usuário em direção definida e testar
    contato durante o percurso. Aplicar knockback ao alvo se indicado.
    Recuo/dano ao usuário somente quando a mecânica do move justificar.

### Terreno / rochas / fissuras

-   **VFX:** Rachaduras, poeira, fragmentos e formas angulares que
    emergem do chão. Usar pixels duros, sombra projetada e variação de
    escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento:** Definir uma ou mais zonas de impacto no terreno.
    Aplicar dano apenas dentro das zonas no frame de ativação;
    persistência/armadilhas ficam separadas do dano inicial.

### Folhas / sementes / vinhas / esporos

-   **VFX:** Folhas com silhueta serrilhada, sementes compactas, vinhas
    segmentadas ou nuvem de esporos em tons de verde e amarelo. A
    rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento:** Usar projétil para objetos lançados e volume/área
    para nuvens e vinhas. Aplicar efeitos secundários após a validação
    do acerto.

### Fogo / calor

-   **VFX:** Chamas em blocos com paleta branco/amarelo/laranja/vermelho
    e contorno escuro; brasas pequenas sobem; o centro do impacto é mais
    claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento:** Distinguir bola de fogo, sopro em cone, coluna
    vertical e aura de investida. Decalque é cosmético; queimadura só
    ocorre quando a regra do move confirmar o efeito secundário.

### Água / bolhas / jato

-   **VFX:** Gotículas quadradas em tons de azul/ciano/branco, bolhas
    com highlight e respingos angulares. Jatos usam faixa principal e
    partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento:** Projetil, cone ou feixe de acordo com a
    descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.

### Gelo / neve

-   **VFX:** Cristais com pontas rígidas, flocos quadrados e paleta
    branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos
    fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento:** Feixe, projétil, tempestade ou cristal que cai
    conforme o move. Congelamento/slow só é aplicado se a lógica do
    golpe determinar sucesso.

### Eletricidade / raio

-   **VFX:** Raio em zigue-zague com segmentos angulares, núcleo
    amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento:** Pode ser raio descendente, projétil elétrico,
    aura de investida ou descarga radial. Paralisia é um efeito de
    gameplay separado do efeito luminoso.

### Psíquico / luz / energia

-   **VFX:** Anéis concêntricos, losangos e orbes com núcleo branco e
    aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas
    orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento:** Definir explicitamente se o efeito persegue,
    viaja em linha, explode em área ou apenas envolve o usuário. Buffs e
    debuffs são resolvidos pela lógica de combate.

### Sombrio / fantasma

-   **VFX:** Orbes escuros, fumaça pixelada, rasgos de sombra e contorno
    violeta/azul profundo. Manter alguns pixels claros para legibilidade
    sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento:** Pode ser projétil, onda, corte ou maldição
    persistente. Efeitos de medo, confusão, sono e redução de atributos
    devem ser aplicados por regras de status.

### Explosão / grande impacto

-   **VFX:** Burst em camadas: núcleo branco/amarelo, anel externo
    colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser
    irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento:** Definir raio e instante único de dano. Golpes de
    autodestruição devem resolver o nocaute do usuário pela regra de
    combate, não pela animação.

### Golpes repetidos / rajada

-   **VFX:** Reutilizar o efeito principal do move em instâncias
    pequenas, alternando posição/ângulo e adicionando flashes discretos
    a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento:** A quantidade de hits vem da regra do move. Evitar
    que uma única colisão gere todos os acertos; cada hit deve ter
    evento e aplicação de dano controlados.

### Status / suporte / controle

-   **VFX:** Aura, ícones e símbolos simples associados ao efeito:
    estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento:** Priorizar a consequência descrita: cura, buff,
    debuff, aprisionamento, clima, proteção ou status. Não criar dano
    visual se o move não causa dano.

### Cura / restauração

-   **VFX:** Partículas ascendentes, pequenos brilhos e anéis suaves em
    verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não
    em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento:** Não usar hitbox ofensiva. Aplicar cura ou limpeza
    de status conforme a regra do move; a animação apenas comunica a
    mudança de estado.

### Aumento de atributos

-   **VFX:** Setas, linhas ascendentes, símbolos e aura curta envolvendo
    o Pokémon. Diferenciar visualmente aumento, redução e proteção,
    mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento:** Atualizar atributos pela lógica de combate e
    exibir o resultado confirmado. Não aumentar estatísticas apenas pela
    duração da animação.

### Impacto físico

-   **VFX:** Flash de contato em forma de estrela angular, linhas
    radiais curtas e fragmentos claros/escuros. A forma deve combinar
    com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento:** Usar hitbox de contato ou alcance curto.
    Knockback e hitstun são parametrizados e não devem depender do
    número de partículas.

## 6. Especificação individual por move

Total de moves extraídos da tabela original: **621**. Cada entrada
mantém o ID e os metadados de origem para facilitar a ligação com
`MoveData`/`internalName`.

### #1 --- Megahorn

-   **Tipo / categoria:** BUG / Physical · **Poder:** 120 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** Using its tough and impressive horn,
    the user rams into the target with no letup.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #2 --- Attack Order

-   **Tipo / categoria:** BUG / Physical · **Poder:** 90 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user calls out its underlings to
    pummel the target. Critical hits land more easily.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #3 --- Bug Buzz

-   **Tipo / categoria:** BUG / Special · **Poder:** 90 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user vibrates its wings to
    generate a damaging sound wave. It may also lower the target's Sp.
    Def stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #4 --- X-Scissor

-   **Tipo / categoria:** BUG / Physical · **Poder:** 80 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user slashes at the foe by
    crossing its scythes or claws as if they were a pair of scissors.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #5 --- Signal Beam

-   **Tipo / categoria:** BUG / Special · **Poder:** 75 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks with a sinister beam
    of light. It may also confuse the target.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #6 --- U-turn

-   **Tipo / categoria:** BUG / Physical · **Poder:** 70 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** After making its attack, the user
    rushes back to switch places with a party Pokémon in waiting.
-   **VFX proposto:** Rastro de movimento que atravessa ou contorna o
    alvo, com partículas na cor do tipo.
-   **Animação:** Investida curta, impacto e saída do campo com
    afterimage; deixar a troca para depois da resolução do hit.
-   **Comportamento em combate:** Executar o efeito de troca após
    confirmar o acerto e respeitar as regras de troca do combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #7 --- Steamroller

-   **Tipo / categoria:** BUG / Physical · **Poder:** 65 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user crushes its foes by rolling
    over them. This attack may make the target flinch.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #8 --- Bug Bite

-   **Tipo / categoria:** BUG / Physical · **Poder:** 60 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user bites the target. If the
    target is holding a Berry, the user eats it and gains its effect.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #9 --- Silver Wind

-   **Tipo / categoria:** BUG / Special · **Poder:** 60 · **Precisão:**
    100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The foe is attacked with powdery
    scales blown by wind. It may also raise all the user's stats.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #10 --- Struggle Bug

-   **Tipo / categoria:** BUG / Special · **Poder:** 30 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** While resisting, the user attacks the
    opposing Pokémon. The targets' Sp. Atk stat is reduced.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Área/múltiplos alvos: calcular os alvos
    elegíveis pela área e regras do combate, sem duplicar dano.

### #11 --- Twineedle

-   **Tipo / categoria:** BUG / Physical · **Poder:** 25 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The foe is stabbed twice by a pair of
    stingers. It may also poison the target.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio,
    respeitando a quantidade definida pela regra.

### #12 --- Fury Cutter

-   **Tipo / categoria:** BUG / Physical · **Poder:** 20 · **Precisão:**
    95% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The target is slashed with scythes or
    claws. Its power increases if it hits in succession.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #13 --- Leech Life

-   **Tipo / categoria:** BUG / Physical · **Poder:** 20 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user drains the target's blood.
    The user's HP is restored by half the damage taken by the target.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #14 --- Pin Missile

-   **Tipo / categoria:** BUG / Physical · **Poder:** 14 · **Precisão:**
    85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** Sharp spikes are shot at the target
    in rapid succession. They hit two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #15 --- Defend Order

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user calls out its underlings to
    shield its body, raising its Defense and Sp. Def stats.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #16 --- Heal Order

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user calls out its underlings to
    heal it. The user regains up to half of its max HP.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #17 --- Quiver Dance

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user performs a beautiful dance.
    It boosts the user's Sp. Atk, Sp. Def, and Speed stats.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #18 --- Rage Powder

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 3
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user scatters irritating powder
    to draw attention to itself. Opponents aim only at the user.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #19 --- Spider Web

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user ensnares the target with
    thin, gooey silk so it can't flee from battle.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #20 --- String Shot

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    95% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The foe is bound with silk blown from
    the user's mouth. This silk reduces the target's Speed.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #21 --- Tail Glow

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user stares at flashing lights to
    focus its mind, drastically raising its Sp. Atk stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #22 --- Foul Play

-   **Tipo / categoria:** DARK / Physical · **Poder:** 95 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user turns the foe's power
    against it. It does more damage the higher the target's Attack stat.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #23 --- Night Daze

-   **Tipo / categoria:** DARK / Special · **Poder:** 85 · **Precisão:**
    95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user lets loose a pitch-black
    shock wave at its target. It may also lower the target's accuracy.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #24 --- Crunch

-   **Tipo / categoria:** DARK / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `teeth.png` · **Frames indicados:**
    `F0-4` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user crunches up the target with
    sharp fangs. It may also lower the target's Defense stat.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #25 --- Dark Pulse

-   **Tipo / categoria:** DARK / Special · **Poder:** 80 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user releases a horrible aura
    imbued with dark thoughts. It may also make the target flinch.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #26 --- Sucker Punch

-   **Tipo / categoria:** DARK / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 1
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** This move enables the user to attack
    first. It fails if the target is not readying an attack, however.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #27 --- Night Slash

-   **Tipo / categoria:** DARK / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user slashes the target the
    instant an opportunity arises. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #28 --- Bite

-   **Tipo / categoria:** DARK / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `teeth.png` · **Frames indicados:**
    `F0-4` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The target is bitten with viciously
    sharp fangs. It may make the target flinch.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #29 --- Feint Attack

-   **Tipo / categoria:** DARK / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user draws up to the foe
    disarmingly, then throws a sucker punch. It hits without fail.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #30 --- Snarl

-   **Tipo / categoria:** DARK / Special · **Poder:** 55 · **Precisão:**
    95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user yells as if it is ranting
    about something, making the target's Sp. Atk stat decrease.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #31 --- Assurance

-   **Tipo / categoria:** DARK / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** If the target has already taken some
    damage in the same turn, this attack's power is doubled.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #32 --- Payback

-   **Tipo / categoria:** DARK / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** If the user moves after the target,
    this attack's power will be doubled.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #33 --- Pursuit

-   **Tipo / categoria:** DARK / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** An attack move that inflicts double
    damage if used on a target that is switching out of battle.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #34 --- Thief

-   **Tipo / categoria:** DARK / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user attacks and steals the foe's
    held item simultaneously. It can't steal if the user holds an item.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #35 --- Knock Off

-   **Tipo / categoria:** DARK / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user slaps down the target's held
    item, preventing that item from being used in the battle.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #36 --- Beat Up

-   **Tipo / categoria:** DARK / Physical · **Poder:** 1 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user gets all the party Pokémon
    to attack the foe. The more party Pokémon, the more damage.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #37 --- Fling

-   **Tipo / categoria:** DARK / Physical · **Poder:** 1 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user flings its held item at the
    target to attack. Its power and effects depend on the item.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #38 --- Punishment

-   **Tipo / categoria:** DARK / Physical · **Poder:** 1 · **Precisão:**
    100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** This attack's power increases the
    more the target has powered up with stat changes.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #39 --- Dark Void

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    80% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Opposing Pokémon are dragged into a
    world of total darkness that makes them sleep.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #40 --- Embargo

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** It prevents the target from using its
    held item. Its Trainer is also prevented from using items on it.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #41 --- Fake Tears

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user feigns crying to fluster the
    target, harshly lowering its Sp. Def stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #42 --- Flatter

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** Flattery is used to confuse the
    target. However, it also raises the target's Sp. Atk stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #43 --- Hone Claws

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user sharpens its claws to boost
    its Attack stat and accuracy.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #44 --- Memento

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user faints when using this move.
    In return, it harshly lowers the target's Attack and Sp. Atk.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme
    a regra de combate, sem depender do VFX.

### #45 --- Nasty Plot

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user stimulates its brain by
    thinking bad thoughts. It sharply raises the user's Sp. Atk.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #46 --- Quash

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user suppresses the target and
    makes its move go last.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #47 --- Snatch

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 4
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user steals the effects of any
    healing or stat-changing move the foe attempts to use.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado. Atributos:
    atualizar estágios/valores no sistema de combate; a animação deve
    refletir a mudança confirmada.

### #48 --- Switcheroo

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user trades held items with the
    target faster than the eye can follow.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #49 --- Taunt

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The target is taunted into a rage
    that allows it to use only attack moves for three turns.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #50 --- Torment

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user torments and enrages the
    foe, making it incapable of using the same move twice in a row.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #51 --- Roar of Time

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user blasts the target with power
    that distorts even time. The user must rest on the next turn.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #52 --- Draco Meteor

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** Comets are summoned down from the
    sky. The attack's recoil harshly reduces the user's Sp. Atk stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme
    a regra de combate, sem depender do VFX.

### #53 --- Outrage

-   **Tipo / categoria:** DRAGON / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user rampages and attacks for two
    to three turns. It then becomes confused, however.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #54 --- Dragon Rush

-   **Tipo / categoria:** DRAGON / Physical · **Poder:** 100 ·
    **Precisão:** 75% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user tackles the foe while
    exhibiting overwhelming menace. It may also make the target flinch.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #55 --- Spacial Rend

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 100 ·
    **Precisão:** 95% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user tears the target along with
    the space around it. Critical hits land more easily.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #56 --- Dragon Pulse

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is attacked with a shock
    wave generated by the user's gaping mouth.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #57 --- Dragon Claw

-   **Tipo / categoria:** DRAGON / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user slashes the target with
    huge, sharp claws.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #58 --- Dragon Tail

-   **Tipo / categoria:** DRAGON / Physical · **Poder:** 60 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** -6
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user knocks away the target and
    drags out another Pokémon in its party. In the wild, the battle
    ends.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #59 --- Dragon Breath

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user exhales a mighty gust that
    inflicts damage. It may also leave the target with paralysis.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #60 --- Dual Chop

-   **Tipo / categoria:** DRAGON / Physical · **Poder:** 40 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user attacks its target by
    hitting it with brutal strikes. The target is hit twice in a row.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #61 --- Twister

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user whips up a vicious tornado
    to tear at the opposing team. It may also make targets flinch.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #62 --- Dragon Rage

-   **Tipo / categoria:** DRAGON / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** This attack hits the target with a
    shock wave of pure rage. This attack always inflicts 40 HP damage.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #63 --- Dragon Dance

-   **Tipo / categoria:** DRAGON / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user vigorously performs a
    mystic, powerful dance that boosts its Attack and Speed stats.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #64 --- Bolt Strike

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 130 ·
    **Precisão:** 85% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user charges at its foe,
    surrounding itself with lightning. It may also leave the target
    paralyzed.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #65 --- Thunder

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 120 ·
    **Precisão:** 70% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** A wicked thunderbolt is dropped on
    the foe to inflict damage. It may also leave the target paralyzed.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #66 --- Volt Tackle

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user electrifies itself, then
    charges at the foe. It causes considerable damage to the user as
    well.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #67 --- Zap Cannon

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 120 ·
    **Precisão:** 50% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user fires an electric blast like
    a cannon to inflict damage and cause paralysis.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #68 --- Fusion Bolt

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user throws down a giant
    thunderbolt. It does more damage if influenced by an enormous flame.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #69 --- Thunderbolt

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 95 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** A strong electric blast is loosed at
    the target. It may also leave the target with paralysis.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #70 --- Wild Charge

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user shrouds itself in
    electricity and smashes into its foe. It also damages the user a
    little.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #71 --- Discharge

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** A flare of electricity is loosed to
    strike the area around the user. It may also cause paralysis.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #72 --- Thunder Punch

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The target is punched with an
    electrified fist. It may also leave the target with paralysis.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #73 --- Volt Switch

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** After making its attack, the user
    rushes back to switch places with a party Pokémon in waiting.
-   **VFX proposto:** Rastro de movimento que atravessa ou contorna o
    alvo, com partículas na cor do tipo.
-   **Animação:** Investida curta, impacto e saída do campo com
    afterimage; deixar a troca para depois da resolução do hit.
-   **Comportamento em combate:** Executar o efeito de troca após
    confirmar o acerto e respeitar as regras de troca do combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #74 --- Spark

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user throws an electrically
    charged tackle at the target. It may also leave the target with
    paralysis.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #75 --- Thunder Fang

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 65 ·
    **Precisão:** 95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user bites with electrified
    fangs. It may also make the target flinch or leave it with
    paralysis.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #76 --- Shock Wave

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user strikes the target with a
    quick jolt of electricity. This attack cannot be evaded.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #77 --- Electroweb

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 55 ·
    **Precisão:** 95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user captures and attacks foes by
    using an electric net, which lowers their Speed stat.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #78 --- Charge Beam

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 50 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user fires a concentrated bundle
    of electricity. It may also raise the user's Sp. Atk stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #79 --- Thunder Shock

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** A jolt of electricity is hurled at
    the foe to inflict damage. It may also leave the target with
    paralysis.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #80 --- Electro Ball

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user hurls an electric orb at the
    foe. It does more damage the faster the user is.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #81 --- Charge

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user boosts the power of the
    Electric move it uses next. It also raises the user's Sp. Def stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #82 --- Magnet Rise

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user levitates using electrically
    generated magnetism for five turns.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #83 --- Thunder Wave

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** A weak electric charge is launched at
    the target. It causes paralysis if it hits.
-   **VFX proposto:** Raio em zigue-zague ou descarga elétrica com
    núcleo claro; faíscas amarelas se espalham no contato.
-   **Animação:** Aparecimento em segmentos rápidos, breve flash e
    faíscas que desaparecem em poucos frames.
-   **Comportamento em combate:** Determinar se o raio vem do céu,
    percorre uma linha ou irradia do usuário. Paralisia é aplicada
    apenas após o teste de efeito secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #84 --- Focus Punch

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 150 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** -3
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user focuses its mind before
    launching a punch. It will fail if the user is hit before it is
    used.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #85 --- High Jump Kick

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 130 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is attacked with a knee
    kick from a jump. If it misses, the user is hurt instead.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #86 --- Close Combat

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user fights the foe up close
    without guarding itself. It also cuts the user's Defense and Sp.
    Def.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #87 --- Focus Blast

-   **Tipo / categoria:** FIGHTING / Special · **Poder:** 120 ·
    **Precisão:** 70% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user heightens its mental focus
    and unleashes its power. It may also lower the target's Sp. Def.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #88 --- Superpower

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user attacks the target with
    great power. However, it also lowers the user's Attack and Defense.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #89 --- Cross Chop

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 100 ·
    **Precisão:** 80% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user delivers a double chop with
    its forearms crossed. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #90 --- Dynamic Punch

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 100 ·
    **Precisão:** 50% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user punches the target with
    full, concentrated power. It confuses the target if it hits.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #91 --- Hammer Arm

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 100 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user swings and hits with its
    strong and heavy fist. It lowers the user's Speed, however.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #92 --- Jump Kick

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 100 ·
    **Precisão:** 95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user jumps up high, then strikes
    with a kick. If the kick misses, the user hurts itself.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #93 --- Aura Sphere

-   **Tipo / categoria:** FIGHTING / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user looses a blast of aura power
    from deep within its body. This move is certain to hit.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #94 --- Sacred Sword

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user attacks by slicing with its
    long horns. The target's stat changes don't affect the damage.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #95 --- Secret Sword

-   **Tipo / categoria:** FIGHTING / Special · **Poder:** 85 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user cuts with its long horn. The
    odd power contained in it does physical damage to the foe.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #96 --- Sky Uppercut

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 85 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user attacks the target with an
    uppercut thrown skyward with force.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #97 --- Submission

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 80 ·
    **Precisão:** 80% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user grabs the target and
    recklessly dives for the ground. It also hurts the user slightly.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #98 --- Brick Break

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user attacks with a swift chop.
    It can also break any barrier such as Light Screen and Reflect.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #99 --- Drain Punch

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** An energy-draining punch. The user's
    HP is restored by half the damage taken by the target.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #100 --- Vital Throw

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** -1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user attacks last. In return,
    this throw move is guaranteed not to miss.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #101 --- Circle Throw

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 60 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** -6
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user throws the target and drags
    out another Pokémon in its party. In the wild, the battle ends.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #102 --- Force Palm

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is attacked with a shock
    wave. It may also leave the target with paralysis.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #103 --- Low Sweep

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user attacks the target's legs
    swiftly, reducing the target's Speed stat.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #104 --- Revenge

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** -4
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** An attack move that inflicts double
    the damage if the user has been hurt by the foe in the same turn.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #105 --- Rolling Kick

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 60 ·
    **Precisão:** 85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user lashes out with a quick,
    spinning kick. It may also make the target flinch.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #106 --- Wake-Up Slap

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** This attack inflicts big damage on a
    sleeping target. It also wakes the target up, however.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #107 --- Karate Chop

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The target is attacked with a sharp
    chop. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #108 --- Mach Punch

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user throws a punch at blinding
    speed. It is certain to strike first.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #109 --- Rock Smash

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user attacks with a punch that
    can shatter a rock. It may also lower the foe's Defense stat.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #110 --- Storm Throw

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user strikes the target with a
    fierce blow. This attack always results in a critical hit.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #111 --- Vacuum Wave

-   **Tipo / categoria:** FIGHTING / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user whirls its fists to send a
    wave of pure vacuum at the target. This move always goes first.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #112 --- Double Kick

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 30 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The target is quickly kicked twice in
    succession using both feet.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #113 --- Arm Thrust

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 15 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user looses a flurry of
    open-palmed arm thrusts that hit two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #114 --- Triple Kick

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 10 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** A consecutive three-kick attack that
    becomes more powerful with each successive hit.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #115 --- Counter

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** -5
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A retaliation move that counters any
    physical attack, inflicting double the damage taken.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #116 --- Final Gambit

-   **Tipo / categoria:** FIGHTING / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user risks all to attack the foe.
    The user faints but does damage equal to its HP.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #117 --- Low Kick

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A powerful low kick that makes the
    foe fall over. It inflicts greater damage on heavier foes.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #118 --- Reversal

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** An all-out attack that becomes more
    powerful the less HP the user has.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #119 --- Seismic Toss

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is thrown using the power
    of gravity. It inflicts damage equal to the user's level.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #120 --- Bulk Up

-   **Tipo / categoria:** FIGHTING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user tenses its muscles to bulk
    up its body, boosting both its Attack and Defense stats.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #121 --- Detect

-   **Tipo / categoria:** FIGHTING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 4
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** It enables the user to evade all
    attacks. Its chance of failing rises if it is used in succession.
-   **VFX proposto:** Escudo de contorno pixelado, hexágonos ou espinhos
    ao redor do usuário; brilho forte apenas na ativação.
-   **Animação:** Escudo aparece em 2--3 etapas, pisca quando bloqueia e
    desaparece ao fim da janela de proteção.
-   **Comportamento em combate:** Ativar a proteção em estado próprio
    com duração definida. Dano refletido só existe quando a regra do
    move o especificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #122 --- Quick Guard

-   **Tipo / categoria:** FIGHTING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 3
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user protects itself and its
    allies from priority moves. If may fail if used in succession.
-   **VFX proposto:** Escudo de contorno pixelado, hexágonos ou espinhos
    ao redor do usuário; brilho forte apenas na ativação.
-   **Animação:** Escudo aparece em 2--3 etapas, pisca quando bloqueia e
    desaparece ao fim da janela de proteção.
-   **Comportamento em combate:** Ativar a proteção em estado próprio
    com duração definida. Dano refletido só existe quando a regra do
    move o especificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Prioridade: o VFX não altera ordem de execução; respeitar a
    prioridade definida na lógica.

### #123 --- V-create

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 180 ·
    **Precisão:** 95% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** With a fiery forehead, the user hurls
    itself at the foe. It lowers the user's Defense, Sp. Def, and Speed.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #124 --- Blast Burn

-   **Tipo / categoria:** FIRE / Special · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The target is razed by a fiery
    explosion. The user must rest on the next turn, however.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #125 --- Eruption

-   **Tipo / categoria:** FIRE / Special · **Poder:** 150 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user attacks in an explosive
    fury. The lower the user's HP, the less powerful this attack
    becomes.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #126 --- Overheat

-   **Tipo / categoria:** FIRE / Special · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user attacks the target at full
    power. The attack's recoil sharply reduces the user's Sp. Atk stat.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme
    a regra de combate, sem depender do VFX.

### #127 --- Blue Flare

-   **Tipo / categoria:** FIRE / Special · **Poder:** 130 ·
    **Precisão:** 85% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user attacks by engulfing the foe
    in a beautiful, yet intense, blue flame. It may also burn the foe.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #128 --- Fire Blast

-   **Tipo / categoria:** FIRE / Special · **Poder:** 120 ·
    **Precisão:** 85% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The foe is attacked with an intense
    blast of all-consuming fire. It may also leave the target with a
    burn.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #129 --- Flare Blitz

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user cloaks itself in fire and
    charges at the foe. The user also takes damage and may burn the
    target.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Custo/recuo: resolver o dano ao usuário conforme a regra de combate,
    sem depender do VFX.

### #130 --- Magma Storm

-   **Tipo / categoria:** FIRE / Special · **Poder:** 120 ·
    **Precisão:** 75% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The target becomes trapped within a
    maelstrom of fire that rages for four to five turns.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #131 --- Fusion Flare

-   **Tipo / categoria:** FIRE / Special · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user brings down a giant flame.
    It does more damage if influenced by an enormous thunderbolt.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #132 --- Heat Wave

-   **Tipo / categoria:** FIRE / Special · **Poder:** 100 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks by exhaling hot
    breath on the opposing team. It may also leave targets with a burn.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #133 --- Inferno

-   **Tipo / categoria:** FIRE / Special · **Poder:** 100 ·
    **Precisão:** 50% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user attacks by engulfing the
    target in an intense fire. It leaves the target with a burn.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #134 --- Sacred Fire

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 100 ·
    **Precisão:** 95% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The target is razed with a mystical
    fire of great intensity. It may also leave the target with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #135 --- Searing Shot

-   **Tipo / categoria:** FIRE / Special · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** An inferno of scarlet flames torches
    everything around the user. It may leave the foe with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #136 --- Flamethrower

-   **Tipo / categoria:** FIRE / Special · **Poder:** 95 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is scorched with an
    intense blast of fire. It may also leave the target with a burn.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #137 --- Blaze Kick

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 85 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user launches a kick with a high
    critical-hit ratio. It may also leave the target with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #138 --- Fiery Dance

-   **Tipo / categoria:** FIRE / Special · **Poder:** 80 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** Cloaked in flames, the user dances
    and flaps its wings. It may also raise the user's Sp. Atk stat.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #139 --- Lava Plume

-   **Tipo / categoria:** FIRE / Special · **Poder:** 80 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** An inferno of scarlet flames torches
    everything around the user. It may leave targets with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #140 --- Fire Punch

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The target is punched with a fiery
    fist. It may leave the target with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #141 --- Flame Burst

-   **Tipo / categoria:** FIRE / Special · **Poder:** 70 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user attacks the foe with a
    bursting flame. It also damages Pokémon next to the target.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #142 --- Fire Fang

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 65 ·
    **Precisão:** 95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user bites with flame-cloaked
    fangs. It may also make the target flinch or leave it burned.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #143 --- Flame Wheel

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user cloaks itself in fire and
    charges at the target. It may also leave the target with a burn.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #144 --- Fire Pledge

-   **Tipo / categoria:** FIRE / Special · **Poder:** 50 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** A column of fire hits opposing
    Pokémon. When used with its Grass equivalent, it makes a sea of
    fire.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #145 --- Flame Charge

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user cloaks itself with flame and
    attacks. Building up more power, it raises the user's Speed stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #146 --- Ember

-   **Tipo / categoria:** FIRE / Special · **Poder:** 40 · **Precisão:**
    100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The target is attacked with small
    flames. It may also leave the target with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #147 --- Fire Spin

-   **Tipo / categoria:** FIRE / Special · **Poder:** 35 · **Precisão:**
    85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F5-9` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The target becomes trapped within a
    fierce vortex of fire that rages for four to five turns.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #148 --- Incinerate

-   **Tipo / categoria:** FIRE / Special · **Poder:** 30 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user attacks the foe with fire.
    If the target is holding a Berry, it becomes burnt up and unusable.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #149 --- Heat Crash

-   **Tipo / categoria:** FIRE / Physical · **Poder:** 1 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user slams the foe with its
    flaming body. The heavier the user is, the greater the damage.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #150 --- Sunny Day

-   **Tipo / categoria:** FIRE / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user intensifies the sun for five
    turns, powering up Fire-type moves.
-   **VFX proposto:** Overlay de clima em toda a arena: chuva diagonal,
    calor ondulante, areia horizontal ou neve em flocos quadrados.
-   **Animação:** Transição curta do clima atual para o novo; partículas
    contínuas de baixa densidade enquanto durar.
-   **Comportamento em combate:** Clima é um estado global com duração;
    não deve ser recriado individualmente por cada frame ou Pokémon.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #151 --- Will-O-Wisp

-   **Tipo / categoria:** FIRE / Status · **Poder:** --- · **Precisão:**
    75% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user shoots a sinister,
    bluish-white flame at the target to inflict a burn.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #152 --- Sky Attack

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A second-turn attack move where
    critical hits land more easily. It may also make the target flinch.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #153 --- Brave Bird

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user tucks in its wings and
    charges from a low altitude. The user also takes serious damage.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #154 --- Hurricane

-   **Tipo / categoria:** FLYING / Special · **Poder:** 120 ·
    **Precisão:** 70% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user wraps its foe in a fierce
    wind that flies up into the sky. It may also confuse the foe.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #155 --- Aeroblast

-   **Tipo / categoria:** FLYING / Special · **Poder:** 100 ·
    **Precisão:** 95% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** A vortex of air is shot at the target
    to inflict damage. Critical hits land more easily.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #156 --- Fly

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 90 ·
    **Precisão:** 95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user soars, then strikes on the
    second turn. It can also be used for flying to any familiar town.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Execução em etapas: representar preparação e liberação como estados
    separados, com possibilidade de interrupção se a regra permitir.

### #157 --- Bounce

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 85 ·
    **Precisão:** 85% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user bounces up high, then drops
    on the foe on the second turn. It may also paralyze the foe.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Execução em etapas: representar preparação e liberação como estados
    separados, com possibilidade de interrupção se a regra permitir.

### #158 --- Drill Peck

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A corkscrewing attack with the sharp
    beak acting as a drill.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #159 --- Air Slash

-   **Tipo / categoria:** FLYING / Special · **Poder:** 75 ·
    **Precisão:** 95% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user attacks with a blade of air
    that slices even the sky. It may also make the target flinch.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #160 --- Aerial Ace

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user confounds the foe with
    speed, then slashes. The attack lands without fail.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #161 --- Chatter

-   **Tipo / categoria:** FLYING / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks using a sound wave
    based on words it has learned. It may also confuse the target.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #162 --- Pluck

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user pecks the target. If the
    target is holding a Berry, the user eats it and gains its effect.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #163 --- Sky Drop

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user takes the foe into the sky,
    then drops it on the next turn. The foe cannot attack while
    airborne.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #164 --- Wing Attack

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is struck with large,
    imposing wings spread wide to inflict damage.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #165 --- Acrobatics

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 55 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user nimbly strikes the foe. This
    attack does more damage if the user is not holding an item.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #166 --- Air Cutter

-   **Tipo / categoria:** FLYING / Special · **Poder:** 55 ·
    **Precisão:** 95% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user launches razor-like wind to
    slash the opposing team. Critical hits land more easily.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #167 --- Gust

-   **Tipo / categoria:** FLYING / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** A gust of wind is whipped up by wings
    and launched at the target to inflict damage.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #168 --- Peck

-   **Tipo / categoria:** FLYING / Physical · **Poder:** 35 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is jabbed with a sharply
    pointed beak or horn.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #169 --- Defog

-   **Tipo / categoria:** FLYING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** A strong wind blows away the foe's
    obstacles such as Light Screen. It also lowers their evasion.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #170 --- Feather Dance

-   **Tipo / categoria:** FLYING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user covers the target's body
    with a mass of down that harshly lowers its Attack stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #171 --- Mirror Move

-   **Tipo / categoria:** FLYING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user counters the target by
    mimicking the target's last move.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #172 --- Roost

-   **Tipo / categoria:** FLYING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user lands and rests its body. It
    restores the user's HP by up to half of its max HP.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #173 --- Tailwind

-   **Tipo / categoria:** FLYING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user whips up a turbulent
    whirlwind that ups the Speed of all party Pokémon for four turns.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #174 --- Shadow Force

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user disappears, then strikes the
    foe on the second turn. It hits even if the foe protects itself.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #175 --- Shadow Ball

-   **Tipo / categoria:** GHOST / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user hurls a shadowy blob at the
    target. It may also lower the target's Sp. Def stat.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #176 --- Shadow Claw

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user slashes with a sharp claw
    made from shadows. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #177 --- Ominous Wind

-   **Tipo / categoria:** GHOST / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user blasts the target with a
    gust of repulsive wind. It may also raise all the user's stats at
    once.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #178 --- Shadow Punch

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user throws a punch from the
    shadows. The punch lands without fail.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #179 --- Hex

-   **Tipo / categoria:** GHOST / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** This relentless attack does massive
    damage to a target affected by status problems.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #180 --- Shadow Sneak

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user extends its shadow and
    attacks the target from behind. This move always goes first.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #181 --- Astonish

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 30 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user attacks the target while
    shouting in a startling fashion. It may also make the target flinch.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #182 --- Lick

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The target is licked with a long
    tongue, causing damage. It may also leave the target with paralysis.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #183 --- Night Shade

-   **Tipo / categoria:** GHOST / Special · **Poder:** 1 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user makes the foe see a
    frightening mirage. It inflicts damage matching the user's level.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #184 --- Confuse Ray

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The target is exposed to a sinister
    ray that triggers confusion.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #185 --- Curse

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** A move that works differently for the
    Ghost type than for all the other types.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #186 --- Destiny Bond

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** When this move is used, if the user
    faints, the foe that landed the knockout hit also faints.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #187 --- Grudge

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** If the user faints, the user's grudge
    fully depletes the PP of the foe's move that knocked it out.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #188 --- Nightmare

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** A sleeping target sees a nightmare
    that inflicts some damage every turn.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #189 --- Spite

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user unleashes its grudge on the
    move last used by the target by cutting 4 PP from it.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #190 --- Frenzy Plant

-   **Tipo / categoria:** GRASS / Special · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user slams the target with an
    enormous tree. The user can't move on the next turn.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #191 --- Leaf Storm

-   **Tipo / categoria:** GRASS / Special · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** A storm of sharp is whipped up. The
    attack's recoil harshly reduces the user's Sp. Atk stat.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme
    a regra de combate, sem depender do VFX.

### #192 --- Petal Dance

-   **Tipo / categoria:** GRASS / Special · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The user attacks by scattering petals
    for two to three turns. The user then becomes confused.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #193 --- Power Whip

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 120 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user violently whirls its vines
    or tentacles to harshly lash the target.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #194 --- Seed Flare

-   **Tipo / categoria:** GRASS / Special · **Poder:** 120 ·
    **Precisão:** 85% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user generates a shock wave from
    within its body. It may harshly lower the target's Sp. Def.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #195 --- Solar Beam

-   **Tipo / categoria:** GRASS / Special · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** A two-turn attack. The user gathers
    light, then blasts a bundled beam on the second turn.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #196 --- Wood Hammer

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user slams its rugged body into
    the target to attack. The user also sustains serious damage.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #197 --- Leaf Blade

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user handles a sharp leaf like a
    sword and attacks by slashing. It has a high critical-hit ratio.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #198 --- Energy Ball

-   **Tipo / categoria:** GRASS / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user draws power from nature and
    fires it at the target. It may also lower the target's Sp. Def.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #199 --- Seed Bomb

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user slams a barrage of
    hard-shelled seeds down on the target from above.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #200 --- Giga Drain

-   **Tipo / categoria:** GRASS / Special · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A nutrient-draining attack. The
    user's HP is restored by half the damage taken by the target.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #201 --- Horn Leech

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user drains the foe's energy with
    its horns. The user's HP is restored by half the damage inflicted.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #202 --- Leaf Tornado

-   **Tipo / categoria:** GRASS / Special · **Poder:** 65 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F5-9` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user attacks its foe by
    encircling it in sharp leaves. This attack may also lower the foe's
    accuracy.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #203 --- Magical Leaf

-   **Tipo / categoria:** GRASS / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The user scatters curious leaves that
    chase the target. This attack will not miss.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #204 --- Needle Arm

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user attacks by wildly swinging
    its thorny arms. It may also make the target flinch.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #205 --- Razor Leaf

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 55 ·
    **Precisão:** 95% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** Sharp-edged leaves are launched to
    slash at the opposing team. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #206 --- Grass Pledge

-   **Tipo / categoria:** GRASS / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A column of grass hits the foes. When
    used with its water equivalent, it creates a vast swamp.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #207 --- Mega Drain

-   **Tipo / categoria:** GRASS / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A nutrient-draining attack. The
    user's HP is restored by half the damage taken by the target.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #208 --- Vine Whip

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 35 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The target is struck with slender,
    whiplike vines to inflict damage.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #209 --- Bullet Seed

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 25 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user forcefully shoots seeds at
    the target. Two to five seeds are shot in rapid succession.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #210 --- Absorb

-   **Tipo / categoria:** GRASS / Special · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A nutrient-draining attack. The
    user's HP is restored by half the damage taken by the target.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #211 --- Grass Knot

-   **Tipo / categoria:** GRASS / Special · **Poder:** 1 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The user snares the target with grass
    and trips it. The heavier the target, the greater the damage.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #212 --- Aromatherapy

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user releases a soothing scent
    that heals all status problems affecting the user's party.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado. Atributos:
    atualizar estágios/valores no sistema de combate; a animação deve
    refletir a mudança confirmada.

### #213 --- Cotton Guard

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user protects itself by wrapping
    its body in soft cotton, drastically raising its Defense stat.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #214 --- Cotton Spore

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The user releases cotton-like spores
    that cling to the foe, harshly reducing its Speed stat.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #215 --- Grass Whistle

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 55% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user plays a pleasant melody that
    lulls the target into a deep sleep.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #216 --- Ingrain

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user lays roots that restore its
    HP on every turn. Because it is rooted, it can't switch out.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #217 --- Leech Seed

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** A seed is planted on the target. It
    steals some HP from the target every turn.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #218 --- Sleep Powder

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 75% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user scatters a big cloud of
    sleep-inducing dust around the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #219 --- Spore

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user scatters bursts of spores
    that induce sleep.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #220 --- Stun Spore

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 75% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user scatters a cloud of
    paralyzing powder. It may leave the target with paralysis.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #221 --- Synthesis

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user restores its own HP. The
    amount of HP regained varies with the weather.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #222 --- Worry Seed

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** A seed that causes worry is planted
    on the foe. It prevents sleep by making its Ability Insomnia.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #223 --- Earthquake

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user sets off an earthquake that
    strikes every Pokémon around it.
-   **VFX proposto:** Anéis de fissuras e poeira partem do usuário pelo
    chão; fragmentos pequenos saltam em pontos próximos.
-   **Animação:** O chão avisa com rachaduras, seguido de 1--3 pulsos de
    tremor e poeira.
-   **Comportamento em combate:** Dano em área radial centrada no
    usuário. O tremor visual não deve deslocar a hitbox nem causar
    múltiplos hits acidentais.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #224 --- Earth Power

-   **Tipo / categoria:** GROUND / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user makes the ground under the
    foe erupt with power. It may also lower the target's Sp. Def.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #225 --- Dig

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user burrows, then attacks on the
    second turn. It can also be used to exit dungeons.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Execução em etapas: representar preparação e liberação como estados
    separados, com possibilidade de interrupção se a regra permitir.

### #226 --- Drill Run

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 80 ·
    **Precisão:** 95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user crashes into its target
    while rotating its body like a drill. Critical hits land more
    easily.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #227 --- Bone Club

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 65 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user clubs the target with a
    bone. It may also make the target flinch.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #228 --- Mud Bomb

-   **Tipo / categoria:** GROUND / Special · **Poder:** 65 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user launches a hard-packed mud
    ball to attack. It may also lower the target's accuracy.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #229 --- Bulldoze

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user strikes everything around it
    by stomping on the ground. It reduces hit Pokémon's Speed.
-   **VFX proposto:** Anéis de fissuras e poeira partem do usuário pelo
    chão; fragmentos pequenos saltam em pontos próximos.
-   **Animação:** O chão avisa com rachaduras, seguido de 1--3 pulsos de
    tremor e poeira.
-   **Comportamento em combate:** Dano em área radial centrada no
    usuário. O tremor visual não deve deslocar a hitbox nem causar
    múltiplos hits acidentais.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #230 --- Mud Shot

-   **Tipo / categoria:** GROUND / Special · **Poder:** 55 ·
    **Precisão:** 95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user attacks by hurling a blob of
    mud at the target. It also reduces the target's Speed.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #231 --- Bonemerang

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 50 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user throws the bone it holds.
    The bone loops to hit the target twice, coming and going.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #232 --- Sand Tomb

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 35 ·
    **Precisão:** 85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user traps the target inside a
    harshly raging sandstorm for four to five turns.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #233 --- Bone Rush

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 25 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user strikes the target with a
    hard bone two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #234 --- Mud-Slap

-   **Tipo / categoria:** GROUND / Special · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user hurls mud in the target's
    face to inflict damage and lower its accuracy.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #235 --- Fissure

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 1 ·
    **Precisão:** 30% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user opens up a fissure in the
    ground and drops the foe in. The target instantly faints if it hits.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #236 --- Magnitude

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user looses a ground-shaking
    quake affecting everyone around the user. Its power varies.
-   **VFX proposto:** Anéis de fissuras e poeira partem do usuário pelo
    chão; fragmentos pequenos saltam em pontos próximos.
-   **Animação:** O chão avisa com rachaduras, seguido de 1--3 pulsos de
    tremor e poeira.
-   **Comportamento em combate:** Dano em área radial centrada no
    usuário. O tremor visual não deve deslocar a hitbox nem causar
    múltiplos hits acidentais.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #237 --- Mud Sport

-   **Tipo / categoria:** GROUND / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user covers itself with mud. It
    weakens Electric-type moves while the user is in the battle.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #238 --- Sand Attack

-   **Tipo / categoria:** GROUND / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** Sand is hurled in the target's face,
    reducing its accuracy.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #239 --- Spikes

-   **Tipo / categoria:** GROUND / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user lays a trap of spikes at the
    foe's feet. The trap hurts foes that switch into battle.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #240 --- Freeze Shock

-   **Tipo / categoria:** ICE / Physical · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** On the second turn, the user hits the
    foe with electrically charged ice. It may also paralyze the foe.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Execução em etapas: representar preparação e liberação como estados
    separados, com possibilidade de interrupção se a regra permitir.

### #241 --- Ice Burn

-   **Tipo / categoria:** ICE / Special · **Poder:** 140 · **Precisão:**
    90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** On the second turn, an ultracold,
    freezing wind surrounds the foe. This may leave it with a burn.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Execução em etapas: representar preparação e liberação como estados
    separados, com possibilidade de interrupção se a regra permitir.

### #242 --- Blizzard

-   **Tipo / categoria:** ICE / Special · **Poder:** 120 · **Precisão:**
    70% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** A howling blizzard is summoned to
    strike the opposing team. It may also freeze them solid.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #243 --- Ice Beam

-   **Tipo / categoria:** ICE / Special · **Poder:** 95 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is struck with an icy-cold
    beam of energy. It may also freeze the target solid.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #244 --- Icicle Crash

-   **Tipo / categoria:** ICE / Physical · **Poder:** 85 · **Precisão:**
    90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The user attacks by harshly dropping
    an icicle onto the foe. It may also make the target flinch.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #245 --- Ice Punch

-   **Tipo / categoria:** ICE / Physical · **Poder:** 75 · **Precisão:**
    100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The target is punched with an icy
    fist. It may also leave the target frozen.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #246 --- Aurora Beam

-   **Tipo / categoria:** ICE / Special · **Poder:** 65 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is hit with a
    rainbow-colored beam. This may also lower the target's Attack stat.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #247 --- Glaciate

-   **Tipo / categoria:** ICE / Special · **Poder:** 65 · **Precisão:**
    95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The user attacks by blowing freezing
    cold air at the foe. This attack reduces the targets' Speed stat.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Área/múltiplos alvos: calcular os alvos
    elegíveis pela área e regras do combate, sem duplicar dano.

### #248 --- Ice Fang

-   **Tipo / categoria:** ICE / Physical · **Poder:** 65 · **Precisão:**
    95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user bites with cold-infused
    fangs. It may also make the target flinch or leave it frozen.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #249 --- Avalanche

-   **Tipo / categoria:** ICE / Physical · **Poder:** 60 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** -4
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** An attack move that inflicts double
    the damage if the user has been hurt by the foe in the same turn.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #250 --- Icy Wind

-   **Tipo / categoria:** ICE / Special · **Poder:** 55 · **Precisão:**
    95% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks with a gust of
    chilled air. It also lowers the targets' Speed stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Área/múltiplos alvos: calcular os alvos
    elegíveis pela área e regras do combate, sem duplicar dano.

### #251 --- Frost Breath

-   **Tipo / categoria:** ICE / Special · **Poder:** 40 · **Precisão:**
    90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user blows a cold breath on the
    target. This attack always results in a critical hit.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #252 --- Ice Shard

-   **Tipo / categoria:** ICE / Physical · **Poder:** 40 · **Precisão:**
    100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The user flash freezes chunks of ice
    and hurls them at the target. This move always goes first.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #253 --- Powder Snow

-   **Tipo / categoria:** ICE / Special · **Poder:** 40 · **Precisão:**
    100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user attacks with a chilling gust
    of powdery snow. It may also freeze the targets.
-   **VFX proposto:** Overlay de clima em toda a arena: chuva diagonal,
    calor ondulante, areia horizontal ou neve em flocos quadrados.
-   **Animação:** Transição curta do clima atual para o novo; partículas
    contínuas de baixa densidade enquanto durar.
-   **Comportamento em combate:** Clima é um estado global com duração;
    não deve ser recriado individualmente por cada frame ou Pokémon.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #254 --- Ice Ball

-   **Tipo / categoria:** ICE / Physical · **Poder:** 30 · **Precisão:**
    90% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user continually rolls into the
    target over five turns. It becomes stronger each time it hits.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #255 --- Icicle Spear

-   **Tipo / categoria:** ICE / Physical · **Poder:** 25 · **Precisão:**
    100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user launches sharp icicles at
    the target. It strikes two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #256 --- Sheer Cold

-   **Tipo / categoria:** ICE / Special · **Poder:** 1 · **Precisão:**
    30% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The foe is attacked with a blast of
    absolute-zero cold. The target instantly faints if it hits.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #257 --- Hail

-   **Tipo / categoria:** ICE / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user summons a hail storm lasting
    five turns. It damages all Pokémon except the Ice type.
-   **VFX proposto:** Overlay de clima em toda a arena: chuva diagonal,
    calor ondulante, areia horizontal ou neve em flocos quadrados.
-   **Animação:** Transição curta do clima atual para o novo; partículas
    contínuas de baixa densidade enquanto durar.
-   **Comportamento em combate:** Clima é um estado global com duração;
    não deve ser recriado individualmente por cada frame ou Pokémon.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #258 --- Haze

-   **Tipo / categoria:** ICE / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user creates a haze that
    eliminates every stat change among all the Pokémon engaged in
    battle.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #259 --- Mist

-   **Tipo / categoria:** ICE / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user cloaks its body with a white
    mist that prevents any of its stats from being cut for five turns.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #260 --- Explosion

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 250 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user explodes to inflict damage
    on those around it. The user faints upon using this move.
-   **VFX proposto:** Explosão em camadas com núcleo branco, anel
    externo, fragmentos e fumaça pixelada.
-   **Animação:** Expansão rápida em etapas; shake no pico; dissipação
    de fumaça.
-   **Comportamento em combate:** Resolver área e autodestruição como
    efeitos de gameplay separados. O dano é aplicado uma vez por alvo
    elegível.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #261 --- Self-Destruct

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 200 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user blows up to inflict damage
    on all Pokémon in battle. The user faints upon using this move.
-   **VFX proposto:** Explosão em camadas com núcleo branco, anel
    externo, fragmentos e fumaça pixelada.
-   **Animação:** Expansão rápida em etapas; shake no pico; dissipação
    de fumaça.
-   **Comportamento em combate:** Resolver área e autodestruição como
    efeitos de gameplay separados. O dano é aplicado uma vez por alvo
    elegível.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #262 --- Giga Impact

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user charges at the target using
    every bit of its power. The user must rest on the next turn.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #263 --- Hyper Beam

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The foe is attacked with a powerful
    beam. The user must rest on the next turn to regain its energy.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #264 --- Last Resort

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 140 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** This move can be used only after the
    user has used all the other moves it knows in the battle.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #265 --- Double-Edge

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A reckless, life-risking tackle. It
    also damages the user by a fairly large amount, however.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #266 --- Head Charge

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user charges its head into the
    foe, using its powerful guard hair. The user also takes damage.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #267 --- Mega Kick

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 120 ·
    **Precisão:** 75% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is attacked by a kick
    launched with muscle-packed power.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #268 --- Thrash

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user rampages and attacks for two
    to three turns. It then becomes confused, however.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #269 --- Egg Bomb

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 100 ·
    **Precisão:** 75% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** A large egg is hurled at the target
    with maximum force to inflict damage.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #270 --- Judgment

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user releases countless shots of
    light. Its type varies with the kind of Plate the user is holding.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #271 --- Skull Bash

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user tucks in its head to raise
    its Defense in the first turn, then rams the foe on the next turn.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #272 --- Hyper Voice

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The user lets loose a horribly
    echoing shout with the power to inflict damage.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #273 --- Rock Climb

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 90 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user attacks the target by
    smashing into it with incredible force. It may also confuse the
    target.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #274 --- Take Down

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 90 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** A reckless, full-body charge attack
    for slamming into the foe. It also damages the user a little.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #275 --- Uproar

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user attacks in an uproar for
    three turns. Over that time, no one can fall asleep.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #276 --- Body Slam

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 85 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user drops onto the target with
    its full body weight. It may leave the target with paralysis.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #277 --- Techno Blast

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 85 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user fires a beam of light at its
    target. The type changes depending on the Drive the user holds.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #278 --- Extreme Speed

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 2
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user charges the target at
    blinding speed. This attack always goes before any other move.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #279 --- Hyper Fang

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 80 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `teeth.png` · **Frames indicados:**
    `F0-4` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user bites hard on the target
    with its sharp front fangs. It may also make the target flinch.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #280 --- Mega Punch

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 80 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is slugged by a punch
    thrown with muscle-packed power.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #281 --- Razor Wind

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** A two-turn attack. Blades of wind hit
    the foe on the second turn. Critical hits land more easily.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #282 --- Slam

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 80 ·
    **Precisão:** 75% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The target is slammed with a long
    tail, vines, etc., to inflict damage.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #283 --- Strength

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The target is slugged with a punch
    thrown at maximum power. It can also be used to move heavy boulders.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #284 --- Tri Attack

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user strikes with a simultaneous
    three-beam attack. May also paralyze, burn, or freeze the target.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #285 --- Crush Claw

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 75 ·
    **Precisão:** 95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user slashes the target with hard
    and sharp claws. It may also lower the target's Defense.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #286 --- Relic Song

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 75 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** An ancient song appeals to the hearts
    of those listening. It may also induce sleep.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #287 --- Chip Away

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** Seeking an opening, the user strikes
    continually. The foe's stat changes don't affect the damage.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #288 --- Dizzy Punch

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is hit with rhythmically
    launched punches that may also leave it confused.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #289 --- Facade

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** An attack move that doubles its power
    if the user is poisoned, burned, or has paralysis.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #290 --- Headbutt

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user sticks out its head and
    attacks by charging into the foe. It may also make the target
    flinch.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #291 --- Retaliate

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** Gets revenge for a fainted ally. If
    an ally fainted in the last turn, this attack's damage increases.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #292 --- Secret Power

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user attacks with a secret power.
    Its added effects vary depending on the user's environment.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #293 --- Slash

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The target is attacked with a slash
    of claws or blades. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #294 --- Horn Attack

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is jabbed with a sharply
    pointed horn to inflict damage.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #295 --- Stomp

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is stomped with a big
    foot. It may also make the target flinch.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #296 --- Covet

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user endearingly approaches the
    target, then steals the target's held item.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #297 --- Round

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user attacks with a song. Others
    can join in the Round and make the attack do greater damage.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #298 --- Smelling Salts

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** This attack inflicts double damage on
    a paralyzed foe. It also cures the target's paralysis, however.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #299 --- Swift

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** Star-shaped rays are shot at the
    opposing team. This attack never misses.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #300 --- Vice Grip

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 55 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The target is gripped and squeezed
    from both sides to inflict damage.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #301 --- Cut

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 50 ·
    **Precisão:** 95% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The target is cut with a scythe or a
    claw. It can also be used to cut down thin trees.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #302 --- Struggle

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 1 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** An attack that is used in desperation
    only if the user has no PP. It also hurts the user slightly.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #303 --- Tackle

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A physical attack in which the user
    charges and slams into the target with its whole body.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #304 --- Weather Ball

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** An attack move that varies in power
    and type depending on the weather.
-   **VFX proposto:** Overlay de clima em toda a arena: chuva diagonal,
    calor ondulante, areia horizontal ou neve em flocos quadrados.
-   **Animação:** Transição curta do clima atual para o novo; partículas
    contínuas de baixa densidade enquanto durar.
-   **Comportamento em combate:** Clima é um estado global com duração;
    não deve ser recriado individualmente por cada frame ou Pokémon.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #305 --- Echoed Voice

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The user attacks the foe with an
    echoing voice. If this move is used every turn, it does greater
    damage.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #306 --- Fake Out

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 3
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** An attack that hits first and makes
    the target flinch. It only works the first turn the user is in
    battle.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #307 --- False Swipe

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A restrained attack that prevents the
    target from fainting. The target is left with at least 1 HP.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #308 --- Pay Day

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** Numerous coins are hurled at the
    target to inflict damage. Money is earned after battle.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #309 --- Pound

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is physically pounded with
    a long tail or a foreleg, etc.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #310 --- Quick Attack

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user lunges at the target at a
    speed that makes it almost invisible. It is sure to strike first.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #311 --- Scratch

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** Hard, pointed, and sharp claws rake
    the target to inflict damage.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #312 --- Snore

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** An attack that can be used only if
    the user is asleep. The harsh noise may also make the target flinch.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #313 --- Double Hit

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 35 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user slams the target with a long
    tail, vines, or tentacle. The target is hit twice in a row.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #314 --- Feint

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 30 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 2
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** An attack that hits a target using
    Protect or Detect. It also lifts the effects of those moves.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #315 --- Tail Slap

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 25 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user attacks by striking the
    target with its hard tail. It hits the Pokémon two to five times in
    a row.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #316 --- Rage

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** As long as this move is in use, the
    user's Attack rises each time the user is hit in battle.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #317 --- Rapid Spin

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F5-9` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** A spin attack that can also eliminate
    such moves as Bind, Wrap, Leech Seed, and Spikes.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Persistência/controle: criar estado com duração e condição de
    remoção; não manter apenas uma animação repetindo.

### #318 --- Spike Cannon

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** Sharp spikes are shot at the target
    in rapid succession. They hit two to five times in a row.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #319 --- Comet Punch

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 18 ·
    **Precisão:** 85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The target is hit with a flurry of
    punches that strike two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #320 --- Fury Swipes

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 18 ·
    **Precisão:** 80% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The target is raked with sharp claws
    or scythes for two to five times in quick succession.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #321 --- Barrage

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 15 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** Round objects are hurled at the
    target to strike two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #322 --- Bind

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 15 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** Things such as long bodies or
    tentacles are used to bind and squeeze the foe for four to five
    turns.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #323 --- Double Slap

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 15 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The target is slapped repeatedly,
    back and forth, two to five times in a row.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #324 --- Fury Attack

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 15 ·
    **Precisão:** 85% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The target is jabbed repeatedly with
    a horn or beak two to five times in a row.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #325 --- Wrap

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 15 ·
    **Precisão:** 90% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** A long body or vines are used to wrap
    and squeeze the target for four to five turns.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #326 --- Constrict

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 10 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The foe is attacked with long,
    creeping tentacles or vines. It may also lower the target's Speed.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #327 --- Bide

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user endures attacks for two
    turns, then strikes back to cause double the damage taken.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #328 --- Crush Grip

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is crushed with great
    force. The attack is more powerful the more HP the target has left.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #329 --- Endeavor

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** An attack move that cuts down the
    target's HP to equal the user's HP.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #330 --- Flail

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user flails about aimlessly to
    attack. It becomes more powerful the less HP the user has.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #331 --- Frustration

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A full-power attack that grows more
    powerful the less the user likes its Trainer.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #332 --- Guillotine

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 30% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** A vicious, tearing attack with big
    pincers. The target will faint instantly if this attack hits.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #333 --- Hidden Power

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** A unique attack that varies in type
    and intensity depending on the Pokémon using it.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #334 --- Horn Drill

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 30% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user stabs the foe with a horn
    that rotates like a drill. If it hits, the target faints instantly.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #335 --- Natural Gift

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user draws power to attack by
    using its held Berry. The Berry determines its type and power.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #336 --- Present

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user attacks by giving the target
    a gift with a hidden trap. It restores HP sometimes, however.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #337 --- Return

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** A full-power attack that grows more
    powerful the more the user likes its Trainer.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #338 --- Sonic Boom

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 1 ·
    **Precisão:** 90% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is hit with a destructive
    shock wave that always inflicts 20 HP damage.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #339 --- Spit Up

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The power stored using the move
    Stockpile is released all at once in an attack.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #340 --- Super Fang

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 1 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `teeth.png` · **Frames indicados:**
    `F0-4` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user chomps hard on the target
    with its sharp front fangs. It cuts the target's HP to half.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #341 --- Trump Card

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The fewer PP this move has, the
    greater its attack power.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #342 --- Wring Out

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user powerfully wrings the foe.
    The more HP the foe has, the greater this attack's power.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #343 --- Acupressure

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user applies pressure to stress
    points, sharply boosting one of its stats.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #344 --- After You

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user helps the target and makes
    it use its move right after the user.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #345 --- Assist

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user hurriedly and randomly uses
    a move among those known by other Pokémon in the party.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #346 --- Attract

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** If it is the opposite gender of the
    user, the target becomes infatuated and less likely to attack.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #347 --- Baton Pass

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user switches places with a party
    Pokémon in waiting, passing along any stat changes.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #348 --- Belly Drum

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user maximizes its Attack stat in
    exchange for HP equal to half its max HP.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #349 --- Bestow

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user passes its held item to the
    target when the target isn't holding an item.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #350 --- Block

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user blocks the target's way with
    arms spread wide to prevent escape.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #351 --- Camouflage

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user's type is changed depending
    on its environment, such as at water's edge, in grass, or in a cave.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #352 --- Captivate

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** If it is the opposite gender of the
    user, the target is charmed into harshly lowering its Sp. Atk stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #353 --- Charm

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user charmingly gazes at the foe,
    making it less wary. The target's Attack is harshly lowered.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #354 --- Conversion

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user changes its type to become
    the same type as one of its moves.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #355 --- Conversion 2

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user changes its type to make
    itself resistant to the type of the attack the opponent used last.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #356 --- Copycat

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user mimics the move used
    immediately before it. The move fails if no other move has been used
    yet.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #357 --- Defense Curl

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user curls up to conceal weak
    spots and raise its Defense stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #358 --- Disable

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** For four turns, this move prevents
    the target from using the move it last used.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #359 --- Double Team

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** By moving rapidly, the user makes
    illusory copies of itself to raise its evasiveness.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #360 --- Encore

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user compels the target to keep
    using only the move it last used for three turns.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #361 --- Endure

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 3
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user endures any attack with at
    least 1 HP. Its chance of failing rises if it is used in succession.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #362 --- Entrainment

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user dances to compel the target
    to mimic it, making the target's Ability the same as the user's.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #363 --- Flash

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user flashes a light that cuts
    the target's accuracy. It can also be used to illuminate caves.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #364 --- Focus Energy

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user takes a deep breath and
    focuses so that critical hits land more easily.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #365 --- Follow Me

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 3
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user draws attention to itself,
    making all targets take aim only at the user.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #366 --- Foresight

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** Enables the user to hit a Ghost type
    with any kind of move. It also enables the user to hit an evasive
    foe.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #367 --- Glare

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 90% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user intimidates the target with
    the pattern on its belly to cause paralysis.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #368 --- Growl

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user growls in an endearing way,
    making the foe less wary. The foe's Attack stat is lowered.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #369 --- Growth

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user's body grows all at once,
    raising the Atk and Sp. Atk stats.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #370 --- Harden

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user stiffens all the muscles in
    its body to raise its Defense stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #371 --- Heal Bell

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user makes a soothing bell chime
    to heal the status problems of all the party Pokémon.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado. Atributos:
    atualizar estágios/valores no sistema de combate; a animação deve
    refletir a mudança confirmada.

### #372 --- Helping Hand

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 5
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user assists an ally by boosting
    the power of its attack.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #373 --- Howl

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user howls loudly to raise its
    spirit, boosting its Attack stat.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #374 --- Leer

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user gains an intimidating leer
    with sharp eyes. The target's Defense stat is reduced.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #375 --- Lock-On

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user takes sure aim at the
    target. It ensures the next attack does not fail to hit the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #376 --- Lovely Kiss

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 75% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** With a scary face, the user tries to
    force a kiss on the target. If it suceeds, the target falls asleep.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #377 --- Lucky Chant

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user chants an incantation toward
    the sky, preventing the foe from landing critical hits.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #378 --- Me First

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user tries to cut ahead of the
    foe to steal and use the foe's intended move with greater power.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #379 --- Mean Look

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user pins the target with a dark,
    arresting look. The target becomes unable to flee.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #380 --- Metronome

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user waggles a finger and
    stimulates its brain into randomly using nearly any move.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #381 --- Milk Drink

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user restores its own HP by up to
    half of its maximum HP. May also be used in the field to heal HP.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso. Cura:
    atualizar HP pela regra do move e comunicar o valor efetivamente
    restaurado.

### #382 --- Mimic

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user copies the move last used by
    the foe. The move can be used until the user is switched out.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #383 --- Mind Reader

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user senses the foe's movements
    with its mind to ensure its next attack does not miss the foe.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #384 --- Minimize

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user compresses its body to make
    itself look smaller, which sharply raises its evasiveness.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #385 --- Moonlight

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user restores its own HP. The
    amount of HP regained varies with the weather.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #386 --- Morning Sun

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user restores its own HP. The
    amount of HP regained varies with the weather.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #387 --- Nature Power

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** An attack that makes use of nature's
    power. Its effects vary depending on the user's environment.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #388 --- Odor Sleuth

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** Enables the user to hit a Ghost type
    with any type of move. It also enables the user to hit an evasive
    foe.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #389 --- Pain Split

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user adds its HP to the target's
    HP, then equally shares the combined HP with the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #390 --- Perish Song

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Any Pokémon that hears this song
    faints in three turns, unless it switches out of battle.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #391 --- Protect

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 4
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** It enables the user to evade all
    attacks. Its chance of failing rises if it is used in succession.
-   **VFX proposto:** Escudo de contorno pixelado, hexágonos ou espinhos
    ao redor do usuário; brilho forte apenas na ativação.
-   **Animação:** Escudo aparece em 2--3 etapas, pisca quando bloqueia e
    desaparece ao fim da janela de proteção.
-   **Comportamento em combate:** Ativar a proteção em estado próprio
    com duração definida. Dano refletido só existe quando a regra do
    move o especificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #392 --- Psych Up

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user hypnotizes itself into
    copying any stat change made by the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #393 --- Recover

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** Restoring its own cells, the user
    restores its own HP by half of its max HP.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #394 --- Recycle

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user recycles a held item that
    has been used in battle so it can be used again.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #395 --- Reflect Type

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user reflects the target's type,
    making it the same type as the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #396 --- Refresh

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user rests to cure itself of a
    poisoning, burn, or paralysis.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #397 --- Roar

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** -6
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The target is scared off and replaced
    by another Pokémon in its party. In the wild, the battle ends.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #398 --- Safeguard

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user creates a protective field
    that prevents status problems for five turns.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #399 --- Scary Face

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user frightens the target with a
    scary face to harshly reduce its Speed stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #400 --- Screech

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 85% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** An earsplitting screech harshly
    reduces the target's Defense stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #401 --- Sharpen

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user reduces its polygon count to
    make itself more jagged, raising the Attack stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #402 --- Shell Smash

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user breaks its shell, lowering
    its defenses but sharply raising attacking and Speed stats.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #403 --- Simple Beam

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user's mysterious psychic wave
    changes the target's Ability to Simple.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #404 --- Sing

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 55% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** A soothing lullaby is sung in a
    calming voice that puts the target into a deep slumber.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #405 --- Sketch

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 1 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** It enables the user to permanently
    learn the move last used by the foe. Once used, Sketch disappears.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #406 --- Slack Off

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user slacks off, restoring its
    own HP by up to half of its maximum HP.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #407 --- Sleep Talk

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** While it is asleep, the user randomly
    uses one of the moves it knows.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #408 --- Smokescreen

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user releases an obscuring cloud
    of smoke or ink. It reduces the target's accuracy.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #409 --- Soft-Boiled

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user restores its own HP by up to
    half of its maximum HP. May also be used in the field to heal HP.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso. Cura:
    atualizar HP pela regra do move e comunicar o valor efetivamente
    restaurado.

### #410 --- Splash

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user just flops and splashes
    around to no effect at all...
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #411 --- Stockpile

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user charges up power and raises
    both its Defense and Sp. Def. The move can be used three times.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #412 --- Substitute

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user makes a copy of itself using
    some of its HP. The copy serves as the user's decoy.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #413 --- Supersonic

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 55% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user generates odd sound waves
    from its body. It may confuse the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #414 --- Swagger

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user enrages and confuses the
    target. However, it also sharply raises the target's Attack stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #415 --- Swallow

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The power stored using the move
    Stockpile is absorbed by the user to heal its HP.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #416 --- Sweet Kiss

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 75% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user kisses the target with a
    sweet, angelic cuteness that causes confusion.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #417 --- Sweet Scent

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** A sweet scent that lowers the foe's
    evasiveness. It also lures wild Pokémon if used in grass, etc.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #418 --- Swords Dance

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** A frenetic dance to uplift the
    fighting spirit. It sharply raises the user's Attack stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #419 --- Tail Whip

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user wags its tail cutely, making
    opposing Pokémon less wary and lowering their Defense stat.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #420 --- Teeter Dance

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user performs a wobbly dance that
    confuses the Pokémon around it.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #421 --- Tickle

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user tickles the target into
    laughing, reducing its Attack and Defense stats.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #422 --- Transform

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user transforms into a copy of
    the target right down to having the same move set.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #423 --- Whirlwind

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** -6
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F5-9` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The foe is blown away, to be replaced
    by another Pokémon in its party. In the wild, the battle ends.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #424 --- Wish

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** One turn after this move is used, the
    target's HP is restored by half the user's maximum HP.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #425 --- Work Up

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user is roused, and its Attack
    and Sp. Atk stats increase.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #426 --- Yawn

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user lets loose a huge yawn that
    lulls the target into falling asleep on the next turn.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #427 --- Gunk Shot

-   **Tipo / categoria:** POISON / Physical · **Poder:** 120 ·
    **Precisão:** 70% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user shoots filthy garbage at the
    target to attack. It may also poison the target.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #428 --- Sludge Wave

-   **Tipo / categoria:** POISON / Special · **Poder:** 95 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** It swamps the area around the user
    with a giant sludge wave. It may also poison those hit.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #429 --- Sludge Bomb

-   **Tipo / categoria:** POISON / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** Unsanitary sludge is hurled at the
    target. It may also poison the target.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #430 --- Poison Jab

-   **Tipo / categoria:** POISON / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is stabbed with a tentacle
    or arm seeped with poison. It may also poison the target.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #431 --- Cross Poison

-   **Tipo / categoria:** POISON / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** A slashing attack with a poisonous
    blade that may also poison the foe. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #432 --- Sludge

-   **Tipo / categoria:** POISON / Special · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** Unsanitary sludge is hurled at the
    target. It may also poison the target.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #433 --- Venoshock

-   **Tipo / categoria:** POISON / Special · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user drenches the foe in a
    special poisonous liquid. Its power doubles if the target is
    poisoned.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #434 --- Clear Smog

-   **Tipo / categoria:** POISON / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user attacks by throwing a clump
    of special mud. All status changes are returned to normal.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #435 --- Poison Fang

-   **Tipo / categoria:** POISON / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `teeth.png` · **Frames indicados:**
    `F0-4` · **Família visual:** Mordida / presas
-   **Descrição do move (fonte):** The user bites the target with toxic
    fangs. It may also leave the target badly poisoned.
-   **VFX proposto:** Duas mandíbulas ou presas pixeladas que se fecham
    ao redor do ponto de contato; usar sombra escura, dentes claros e
    flash breve.
-   **Animação:** Abrir mandíbula durante a antecipação; fechar
    rapidamente no contato; recuar e remover o overlay sem cobrir o
    Pokémon por muito tempo.
-   **Comportamento em combate:** Exige proximidade. O acerto ocorre no
    instante do fechamento das mandíbulas; efeitos de flinch ou redução
    de defesa são tratados pela lógica de status, não pelo desenho.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #436 --- Poison Tail

-   **Tipo / categoria:** POISON / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user hits the target with its
    tail. It may also poison the target. Critical hits land more easily.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #437 --- Acid

-   **Tipo / categoria:** POISON / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The foe is attacked with a spray of
    harsh acid. It may also lower the target's Sp. Def stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #438 --- Acid Spray

-   **Tipo / categoria:** POISON / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user spits fluid that works to
    melt the target. This harshly reduces the target's Sp. Def stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #439 --- Smog

-   **Tipo / categoria:** POISON / Special · **Poder:** 20 ·
    **Precisão:** 70% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The target is attacked with a
    discharge of filthy gases. It may also poison the target.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #440 --- Poison Sting

-   **Tipo / categoria:** POISON / Physical · **Poder:** 15 ·
    **Precisão:** 100% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user stabs the target with a
    poisonous stinger. This may also poison the target.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #441 --- Acid Armor

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user alters its cellular
    structure to liquefy itself, sharply raising its Defense stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #442 --- Coil

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user coils up and concentrates.
    This raises its Attack and Defense stats as well as its accuracy.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #443 --- Gastro Acid

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user hurls up its stomach acids
    on the foe. The fluid negates the effect of the target's Ability.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #444 --- Poison Gas

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 80% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** A cloud of poison gas is sprayed in
    the face of opposing Pokémon. It may poison those hit.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #445 --- Poison Powder

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 75% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user scatters a cloud of
    poisonous dust on the target. It may poison the target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #446 --- Toxic

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** A move that leaves the target badly
    poisoned. Its poison damage worsens every turn.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #447 --- Toxic Spikes

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `poison.png` · **Frames indicados:**
    `F0-10` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user lays a trap of poison spikes
    at the foe's feet. They poison foes that switch into battle.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #448 --- Psycho Boost

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user attacks the target at full
    power. The attack's recoil harshly reduces the user's Sp. Atk stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme
    a regra de combate, sem depender do VFX.

### #449 --- Dream Eater

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user eats the dreams of a
    sleeping foe. It absorbs half the damage caused to heal the user's
    HP.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #450 --- Future Sight

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** Two turns after this move is used, a
    hunk of psychic energy attacks the target.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #451 --- Psystrike

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user materializes an odd psychic
    wave to attack the target. This attack does physical damage.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #452 --- Psychic

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The target is hit by a strong
    telekinetic force. It may also reduce the target's Sp. Def stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #453 --- Extrasensory

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user attacks with an odd,
    unseeable power. It may also make the target flinch.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #454 --- Psyshock

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user materializes an odd psychic
    wave to attack the target. This attack does physical damage.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #455 --- Zen Headbutt

-   **Tipo / categoria:** PSYCHIC / Physical · **Poder:** 80 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user focuses its willpower to its
    head and attacks the foe. It may also make the target flinch.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #456 --- Luster Purge

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user lets loose a damaging burst
    of light. It may also reduce the target's Sp. Def stat.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #457 --- Mist Ball

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** A mistlike flurry of down envelops
    and damages the target. It may also lower the target's Sp. Atk.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #458 --- Psycho Cut

-   **Tipo / categoria:** PSYCHIC / Physical · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user tears at the target with
    blades formed by psychic power. Critical hits land more easily.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #459 --- Synchronoise

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 70 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** Using an odd shock wave, the user
    damages any Pokémon of the same type as the user.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #460 --- Psybeam

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is attacked with a
    peculiar ray. It may also cause confusion.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #461 --- Heart Stamp

-   **Tipo / categoria:** PSYCHIC / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user unleashes a vicious blow
    after its cute act makes the foe less wary. It may also cause
    flinching.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #462 --- Confusion

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The target is hit by a weak
    telekinetic force. It may also leave the target confused.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #463 --- Mirror Coat

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** -5
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** A retaliation move that counters any
    special attack, inflicting double the damage taken.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #464 --- Psywave

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 1 ·
    **Precisão:** 80% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The target is attacked with an odd
    psychic wave. The attack varies in intensity.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #465 --- Stored Power

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user attacks with stored power.
    The more the user's stats are raised, the greater the damage.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #466 --- Agility

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user relaxes and lightens its
    body to move faster. It sharply boosts the Speed stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #467 --- Ally Switch

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user teleports using a strange
    power and switches its place with one of its allies.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #468 --- Amnesia

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user temporarily empties its mind
    to forget its concerns. It sharply raises the user's Sp. Def stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #469 --- Barrier

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user throws up a sturdy wall that
    sharply raises its Defense stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #470 --- Calm Mind

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user quietly focuses its mind and
    calms its spirit to raise its Sp. Atk and Sp. Def stats.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #471 --- Cosmic Power

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user absorbs a mystical power
    from space to raise its Defense and Sp. Def stats.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #472 --- Gravity

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Gravity is intensified for five
    turns, making moves involving flying unusable and negating
    Levitation.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #473 --- Guard Split

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user employs its psychic power to
    average its Defense and Sp. Def stats with those of its target's.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #474 --- Guard Swap

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user employs its psychic power to
    switch changes to its Defense and Sp. Def with the target.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #475 --- Heal Block

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** For five turns, the foe is prevented
    from using any moves, Abilities, or held items that recover HP.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #476 --- Heal Pulse

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user emits a healing pulse which
    restores the target's HP by up to half of its max HP.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #477 --- Healing Wish

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user faints. In return, the
    Pokémon taking its place will have its HP restored and status cured.
-   **VFX proposto:** Brilhos em partículas que sobem e pequenos
    símbolos luminosos em torno do Pokémon.
-   **Animação:** Aura se expande, pulsa e desaparece; a barra de HP
    muda no frame de resolução da cura.
-   **Comportamento em combate:** Aplicar a quantidade de cura e os
    limites de HP pela lógica; o efeito visual não determina o valor
    restaurado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado. Atributos:
    atualizar estágios/valores no sistema de combate; a animação deve
    refletir a mudança confirmada. Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #478 --- Heart Swap

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user employs its psychic power to
    switch stat changes with the target.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #479 --- Hypnosis

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 60% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user employs hypnotic suggestion
    to make the target fall into a deep sleep.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #480 --- Imprison

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** If the foe knows any move also known
    by the user, the foe is prevented from using it.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #481 --- Kinesis

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 80% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user distracts the target by
    bending a spoon. It lowers the target's accuracy.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #482 --- Light Screen

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** A wondrous wall of light is put up to
    suppress damage from special attacks for five turns.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #483 --- Lunar Dance

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user faints. In return, the
    Pokémon taking its place will have its status and HP fully restored.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado. Atributos:
    atualizar estágios/valores no sistema de combate; a animação deve
    refletir a mudança confirmada. Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #484 --- Magic Coat

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 4
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** A barrier reflects back to the target
    moves like Leech Seed and moves that damage status.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #485 --- Magic Room

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** -7
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user creates a bizarre area in
    which Pokémon's held items lose their effects for five turns.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #486 --- Meditate

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user meditates to awaken the
    power deep within its body and raise its Attack stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #487 --- Miracle Eye

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** Enables the user to hit a Dark type
    with any type of move. It also enables the user to hit an evasive
    foe.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #488 --- Power Split

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user employs its psychic power to
    average its Attack and Sp. Atk stats with those of the target's.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #489 --- Power Swap

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user employs its psychic power to
    switch changes to its Attack and Sp. Atk with the target.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #490 --- Power Trick

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user employs its psychic power to
    switch its Attack with its Defense stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #491 --- Psycho Shift

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** Using its psychic power of
    suggestion, the user transfers its status problems to the target.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #492 --- Reflect

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** A wondrous wall of light is put up to
    suppress damage from physical attacks for five turns.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #493 --- Rest

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user goes to sleep for two turns.
    It fully restores the user's HP and heals any status problem.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado. Atributos:
    atualizar estágios/valores no sistema de combate; a animação deve
    refletir a mudança confirmada. Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #494 --- Role Play

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user mimics the target
    completely, copying the target's natural Ability.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #495 --- Skill Swap

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user employs its psychic power to
    exchange Abilities with the target.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #496 --- Telekinesis

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-7` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user makes the target float with
    its psychic power. The target is easier to hit for three turns.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #497 --- Teleport

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Use it to flee from any wild Pokémon.
    It can also warp to the last Pokémon Center visited.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #498 --- Trick

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user catches the target off guard
    and swaps its held item with its own.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #499 --- Trick Room

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** -7
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user creates a bizarre area in
    which slower Pokémon get to move first for five turns.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Prioridade: o VFX não altera ordem de execução;
    respeitar a prioridade definida na lógica.

### #500 --- Wonder Room

-   **Tipo / categoria:** PSYCHIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** -7
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user creates a bizarre area in
    which Pokémon's Defense and Sp. Def stats are swapped for 5 turns.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #501 --- Head Smash

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 150 ·
    **Precisão:** 80% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user attacks the foe with a
    hazardous, full-power headbutt. The user also takes terrible damage.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Custo/recuo: resolver o dano ao
    usuário conforme a regra de combate, sem depender do VFX.

### #502 --- Rock Wrecker

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user launches a huge boulder at
    the target to attack. It must rest on the next turn, however.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #503 --- Stone Edge

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 100 ·
    **Precisão:** 80% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user stabs the foe with sharpened
    stones from below. It has a high critical-hit ratio.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #504 --- Rock Slide

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 75 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** Large boulders are hurled at the foes
    to inflict damage. It may also make the targets flinch.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #505 --- Power Gem

-   **Tipo / categoria:** ROCK / Special · **Poder:** 70 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks with a ray of light
    that sparkles as if it were made of gemstones.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #506 --- Ancient Power

-   **Tipo / categoria:** ROCK / Special · **Poder:** 60 · **Precisão:**
    100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user attacks with a prehistoric
    power. It may also raise all the user's stats at once.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #507 --- Rock Throw

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 50 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user picks up and throws a small
    rock at the target to attack.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #508 --- Rock Tomb

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 50 ·
    **Precisão:** 80% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** Boulders are hurled at the target. It
    also lowers the target's Speed by preventing its movement.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Persistência/controle: criar estado com duração
    e condição de remoção; não manter apenas uma animação repetindo.

### #509 --- Smack Down

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user throws a stone or projectile
    to attack. A flying Pokémon will fall to the ground when hit.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #510 --- Rollout

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 30 ·
    **Precisão:** 90% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user continually rolls into the
    target over five turns. It becomes stronger each time it hits.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #511 --- Rock Blast

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 25 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user hurls hard rocks at the
    target. Two to five rocks are launched in quick succession.
-   **VFX proposto:** Sequência de impactos/projéteis pequenos com
    flashes individuais e variação mínima de posição.
-   **Animação:** Repetir o efeito de contato ou disparo com intervalo
    curto, exibindo cada acerto separadamente.
-   **Comportamento em combate:** Quantidade de acertos é definida pelo
    sistema de moves; cada instância de impacto aplica exatamente um
    hit.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra.

### #512 --- Rock Polish

-   **Tipo / categoria:** ROCK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user polishes its body to reduce
    drag. It can sharply raise the Speed stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #513 --- Sandstorm

-   **Tipo / categoria:** ROCK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** Summons a five-turn sandstorm to hurt
    all combatants except the Rock, Ground, and Steel types.
-   **VFX proposto:** Overlay de clima em toda a arena: chuva diagonal,
    calor ondulante, areia horizontal ou neve em flocos quadrados.
-   **Animação:** Transição curta do clima atual para o novo; partículas
    contínuas de baixa densidade enquanto durar.
-   **Comportamento em combate:** Clima é um estado global com duração;
    não deve ser recriado individualmente por cada frame ou Pokémon.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #514 --- Stealth Rock

-   **Tipo / categoria:** ROCK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user lays a trap of levitating
    stones around the foe. The trap hurts foes that switch into battle.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #515 --- Wide Guard

-   **Tipo / categoria:** ROCK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 3
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user and its allies are protected
    from wide-ranging attacks for a turn. May fail if used in
    succession.
-   **VFX proposto:** Escudo de contorno pixelado, hexágonos ou espinhos
    ao redor do usuário; brilho forte apenas na ativação.
-   **Animação:** Escudo aparece em 2--3 etapas, pisca quando bloqueia e
    desaparece ao fim da janela de proteção.
-   **Comportamento em combate:** Ativar a proteção em estado próprio
    com duração definida. Dano refletido só existe quando a regra do
    move o especificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #516 --- Doom Desire

-   **Tipo / categoria:** STEEL / Special · **Poder:** 140 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** Two turns after this move is used,
    the user blasts the target with a concentrated bundle of light.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #517 --- Iron Tail

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 100 ·
    **Precisão:** 75% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is slammed with a
    steel-hard tail. It may also lower the target's Defense stat.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #518 --- Meteor Mash

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 100 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The target is hit with a hard punch
    fired like a meteor. It may also raise the user's Attack.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #519 --- Flash Cannon

-   **Tipo / categoria:** STEEL / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user gathers all its light energy
    and releases it at once. It may also lower the target's Sp. Def
    stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #520 --- Iron Head

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The foe slams the target with its
    steel-hard head. It may also make the target flinch.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #521 --- Steel Wing

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 70 ·
    **Precisão:** 90% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The target is hit with wings of
    steel. It may also raise the user's Defense stat.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #522 --- Mirror Shot

-   **Tipo / categoria:** STEEL / Special · **Poder:** 65 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user looses a flash of energy
    from its polished body. It may also lower the target's accuracy.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #523 --- Magnet Bomb

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user launches steel bombs that
    stick to the target. This attack will not miss.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #524 --- Gear Grind

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 50 ·
    **Precisão:** 85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user attacks by throwing two
    steel gears at its target.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #525 --- Metal Claw

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 50 ·
    **Precisão:** 95% · **PP:** 35 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The target is raked with steel claws.
    It may also raise the user's Attack stat.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #526 --- Bullet Punch

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user strikes the target with
    tough punches as fast as bullets. This move always goes first.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #527 --- Gyro Ball

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user tackles the target with a
    high-speed spin. The slower the user, the greater the damage.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #528 --- Heavy Slam

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user slams into the foe with its
    heavy body. The heavier the user, the greater the damage.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #529 --- Metal Burst

-   **Tipo / categoria:** STEEL / Physical · **Poder:** 1 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user retaliates with much greater
    power against the target that last inflicted damage on it.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #530 --- Autotomize

-   **Tipo / categoria:** STEEL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user sheds part of its body to
    make itself lighter and sharply raise its Speed stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #531 --- Iron Defense

-   **Tipo / categoria:** STEEL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user hardens its body's surface
    like iron, sharply raising its Defense stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #532 --- Metal Sound

-   **Tipo / categoria:** STEEL / Status · **Poder:** --- ·
    **Precisão:** 85% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** A horrible sound like scraping metal
    harshly reduces the target's Sp. Def stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #533 --- Shift Gear

-   **Tipo / categoria:** STEEL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user rotates its gears, raising
    its Attack and sharply raising its Speed.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #534 --- Hydro Cannon

-   **Tipo / categoria:** WATER / Special · **Poder:** 150 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The target is hit with a watery
    blast. The user must rest on the next turn, however.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Execução em etapas: representar
    preparação e liberação como estados separados, com possibilidade de
    interrupção se a regra permitir.

### #535 --- Water Spout

-   **Tipo / categoria:** WATER / Special · **Poder:** 150 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user spouts water to damage the
    foe. The lower the user's HP, the less powerful it becomes.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #536 --- Hydro Pump

-   **Tipo / categoria:** WATER / Special · **Poder:** 120 ·
    **Precisão:** 80% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The target is blasted by a huge
    volume of water launched under great pressure.
-   **VFX proposto:** Feixe direcionado com núcleo branco e borda
    colorida do elemento, com partículas orbitais ou laterais.
-   **Animação:** Carga opcional, emissão contínua ou disparo
    concentrado, seguida de explosão curta no ponto final.
-   **Comportamento em combate:** Definir largura, duração e regra de
    colisão ao longo do feixe; não aplicar dano por frame sem intervalo
    explícito.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #537 --- Muddy Water

-   **Tipo / categoria:** WATER / Special · **Poder:** 95 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user attacks by shooting muddy
    water at the opposing team. It may also lower the target's accuracy.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada. Área/múltiplos alvos:
    calcular os alvos elegíveis pela área e regras do combate, sem
    duplicar dano.

### #538 --- Surf

-   **Tipo / categoria:** WATER / Special · **Poder:** 95 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** It swamps the area around the user
    with a giant wave. It can also be used for crossing water.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras
    do combate, sem duplicar dano.

### #539 --- Aqua Tail

-   **Tipo / categoria:** WATER / Physical · **Poder:** 90 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user attacks by swinging its tail
    as if it were a vicious wave in a raging storm.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #540 --- Crabhammer

-   **Tipo / categoria:** WATER / Physical · **Poder:** 90 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The target is hammered with a large
    pincer. Critical hits land more easily.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #541 --- Dive

-   **Tipo / categoria:** WATER / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** Diving on the first turn, the user
    rises and hits on the next turn. It can be used to dive in the
    ocean.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #542 --- Scald

-   **Tipo / categoria:** WATER / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user shoots boiling hot water at
    its target. It may also leave the target with a burn.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #543 --- Waterfall

-   **Tipo / categoria:** WATER / Physical · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** The user charges at the target and
    may make it flinch. It can also be used to climb a waterfall.
-   **VFX proposto:** Aura curta na cor do golpe, linhas de velocidade e
    afterimages pixelados. No impacto, adicionar burst e pequeno
    decalque coerente com o elemento.
-   **Animação:** Antecipação de 60--120 ms; deslocamento rápido e
    legível; pose de impacto; recuperação curta. Não teletransportar: o
    deslocamento precisa respeitar colisões.
-   **Comportamento em combate:** Movimentar o usuário em direção
    definida e testar contato durante o percurso. Aplicar knockback ao
    alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do
    move justificar.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #544 --- Razor Shell

-   **Tipo / categoria:** WATER / Physical · **Poder:** 75 ·
    **Precisão:** 95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user cuts the foe with sharp
    shells. It may also lower the target's Defense stat.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #545 --- Brine

-   **Tipo / categoria:** WATER / Special · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** If the target's HP is down to about
    half, this attack will hit with double the power.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #546 --- Bubble Beam

-   **Tipo / categoria:** WATER / Special · **Poder:** 65 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** A spray of bubbles is forcefully
    ejected at the target. It may also lower its Speed stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #547 --- Octazooka

-   **Tipo / categoria:** WATER / Special · **Poder:** 65 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks by spraying ink in
    the foe's face or eyes. It may also lower the target's accuracy.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #548 --- Water Pulse

-   **Tipo / categoria:** WATER / Special · **Poder:** 60 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user attacks the target with a
    pulsing blast of water. It may also confuse the target.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #549 --- Water Pledge

-   **Tipo / categoria:** WATER / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** A column of water strikes the target.
    When combined with its fire equivalent, it makes a rainbow.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #550 --- Aqua Jet

-   **Tipo / categoria:** WATER / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 1
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F6-10` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user lunges at the target at a
    speed that makes it almost invisible. It is sure to strike first.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Prioridade: o VFX não altera
    ordem de execução; respeitar a prioridade definida na lógica.

### #551 --- Water Gun

-   **Tipo / categoria:** WATER / Special · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The target is blasted with a forceful
    shot of water.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #552 --- Clamp

-   **Tipo / categoria:** WATER / Physical · **Poder:** 35 ·
    **Precisão:** 85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The target is clamped and squeezed by
    the user's very thick and sturdy shell for four to five turns.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #553 --- Whirlpool

-   **Tipo / categoria:** WATER / Special · **Poder:** 35 ·
    **Precisão:** 85% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F5-9` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** Traps foes in a violent swirling
    whirlpool for four to five turns.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #554 --- Bubble

-   **Tipo / categoria:** WATER / Special · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** A spray of countless bubbles is
    jetted at the opposing team. It may also lower the targets' Speed
    stats.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada. Área/múltiplos alvos:
    calcular os alvos elegíveis pela área e regras do combate, sem
    duplicar dano.

### #555 --- Aqua Ring

-   **Tipo / categoria:** WATER / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user envelops itself in a veil
    made of water. It regains some HP on every turn.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #556 --- Rain Dance

-   **Tipo / categoria:** WATER / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user summons a heavy rain that
    falls for five turns, powering up Water-type moves.
-   **VFX proposto:** Overlay de clima em toda a arena: chuva diagonal,
    calor ondulante, areia horizontal ou neve em flocos quadrados.
-   **Animação:** Transição curta do clima atual para o novo; partículas
    contínuas de baixa densidade enquanto durar.
-   **Comportamento em combate:** Clima é um estado global com duração;
    não deve ser recriado individualmente por cada frame ou Pokémon.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #557 --- Soak

-   **Tipo / categoria:** WATER / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user shoots a torrent of water at
    the target and changes the target's type to Water.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #558 --- Water Sport

-   **Tipo / categoria:** WATER / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Fogo / calor
-   **Descrição do move (fonte):** The user soaks itself with water. The
    move weakens Fire-type moves while the user is in the battle.
-   **VFX proposto:** Chamas em blocos com paleta
    branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas
    sobem; o centro do impacto é mais claro que a borda.
-   **Animação:** Chama irregular em 3--6 poses; projétil ou cone de
    fogo conforme o move; no impacto, burst de brasas e possível
    decalque scorch com duração limitada.
-   **Comportamento em combate:** Distinguir bola de fogo, sopro em
    cone, coluna vertical e aura de investida. Decalque é cosmético;
    queimadura só ocorre quando a regra do move confirmar o efeito
    secundário.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #559 --- Withdraw

-   **Tipo / categoria:** WATER / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user withdraws its body into its
    hard shell, raising its Defense stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #560 --- Flying Press

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 80 ·
    **Precisão:** 95% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user dives down onto the target
    from the sky. This move is Fighting and Flying type simultaneously.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #561 --- Mat Block

-   **Tipo / categoria:** FIGHTING / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Using a pulled-up mat as a shield,
    the user protects itself and its allies from damaging moves. This
    does not stop status moves.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #562 --- Belch

-   **Tipo / categoria:** POISON / Special · **Poder:** 120 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user lets out a damaging belch on
    the target. The user must eat a Berry to use this move.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #563 --- Rototiller

-   **Tipo / categoria:** GROUND / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** Tilling the soil, the user makes it
    easier for plants to grow. This raises the Attack and Sp. Atk stats
    of Grass-type Pokémon.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #564 --- Sticky Web

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user weaves a sticky net around
    the opposing team, which lowers their Speed stat upon switching into
    battle.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Área/múltiplos alvos: calcular os alvos
    elegíveis pela área e regras do combate, sem duplicar dano.

### #565 --- Fell Stinger

-   **Tipo / categoria:** BUG / Physical · **Poder:** 30 · **Precisão:**
    100% · **PP:** 25 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** When the user knocks out a target
    with this move, the user's Attack stat rises sharply.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #566 --- Phantom Force

-   **Tipo / categoria:** GHOST / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user vanishes somewhere, then
    strikes the target on the next turn. This move hits even if the
    target protects itself.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #567 --- Trick-or-Treat

-   **Tipo / categoria:** GHOST / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user takes the target
    trick-or-treating. This adds Ghost type to the target's type.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #568 --- Noble Roar

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Letting out a noble roar, the user
    intimidates the target and lowers its Attack and Sp. Atk stats.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #569 --- Ion Deluge

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 25 · **Prioridade:** 1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user disperses electrically
    charged particles, which changes Normal-type moves to Electric-type
    moves.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #570 --- Parabolic Charge

-   **Tipo / categoria:** ELECTRIC / Special · **Poder:** 50 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** The user attacks everything around
    it. The user's HP is restored by half the damage taken by those hit.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #571 --- Forest's Curse

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `030-Explosion01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Sombrio / fantasma
-   **Descrição do move (fonte):** The user puts a forest curse on the
    target. Afflicted targets are now Grass type as well.
-   **VFX proposto:** Orbes escuros, fumaça pixelada, rasgos de sombra e
    contorno violeta/azul profundo. Manter alguns pixels claros para
    legibilidade sobre fundos escuros.
-   **Animação:** Sombra se condensa; projétil ou onda avança; no
    impacto, a silhueta escurece por poucos frames e partículas se
    dissipam.
-   **Comportamento em combate:** Pode ser projétil, onda, corte ou
    maldição persistente. Efeitos de medo, confusão, sono e redução de
    atributos devem ser aplicados por regras de status.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #572 --- Petal Blizzard

-   **Tipo / categoria:** GRASS / Physical · **Poder:** 90 ·
    **Precisão:** 90% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The user stirs up a violent petal
    blizzard and attacks everything around it.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #573 --- Freeze-Dry

-   **Tipo / categoria:** ICE / Special · **Poder:** 70 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** The user rapidly cools the target.
    This may also leave the target frozen. This move is super effective
    on Water types.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #574 --- Disarming Voice

-   **Tipo / categoria:** FAIRY / Special · **Poder:** 15 ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Gelo / neve
-   **Descrição do move (fonte):** Letting out a charming cry, the user
    does emotional damage to opposing Pokémon. This attack never misses.
-   **VFX proposto:** Cristais com pontas rígidas, flocos quadrados e
    paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e
    pequenos fragmentos.
-   **Animação:** Congelamento visual rápido na origem ou no alvo;
    cristais surgem em 2--4 etapas; rajada de neve ou projétil;
    fragmentos se quebram no impacto.
-   **Comportamento em combate:** Feixe, projétil, tempestade ou cristal
    que cai conforme o move. Congelamento/slow só é aplicado se a lógica
    do golpe determinar sucesso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #575 --- Parting Shot

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Investida / colisão
-   **Descrição do move (fonte):** With a parting threat, the user
    lowers the target's Attack and Sp. Atk stats. Then it switches with
    a party Pokémon.
-   **VFX proposto:** Rastro de movimento que atravessa ou contorna o
    alvo, com partículas na cor do tipo.
-   **Animação:** Investida curta, impacto e saída do campo com
    afterimage; deixar a troca para depois da resolução do hit.
-   **Comportamento em combate:** Executar o efeito de troca após
    confirmar o acerto e respeitar as regras de troca do combate.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #576 --- Topsy-Turvy

-   **Tipo / categoria:** DARK / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** All stat changes affecting the target
    turn topsy-turvy and become the opposite of what they were.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #577 --- Draining Kiss

-   **Tipo / categoria:** FAIRY / Special · **Poder:** 10 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Água / bolhas / jato
-   **Descrição do move (fonte):** The user steals the target's energy
    with a kiss. The user's HP is restored by over half of the damage
    taken by the target.
-   **VFX proposto:** Gotículas quadradas em tons de azul/ciano/branco,
    bolhas com highlight e respingos angulares. Jatos usam faixa
    principal e partículas laterais.
-   **Animação:** Disparo ou jato contínuo; gotículas se espalham no
    impacto e caem com gravidade simples; bolhas podem subir antes de
    estourar.
-   **Comportamento em combate:** Projetil, cone ou feixe de acordo com
    a descrição. Poça wet é opcional e cosmética; não deve alterar
    velocidade ou colisão sem regra explícita.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #578 --- Crafty Shield

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user protects itself and its
    allies from status moves with a mysterious power. This does not stop
    moves that do damage.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #579 --- Flower Shield

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user raises the Defense stat of
    all Grass-type Pokémon in battle with a mysterious power.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #580 --- Grassy Terrain

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Cura / restauração
-   **Descrição do move (fonte):** The user turns the ground under
    everyone's feet to grass for five turns. This restores the HP of
    Pokémon on the ground a little every turn.
-   **VFX proposto:** Partículas ascendentes, pequenos brilhos e anéis
    suaves em verde, rosa ou dourado; pixels claros devem aparecer em
    pulsos e não em bloom contínuo.
-   **Animação:** Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes
    e some. A barra de HP atualiza no momento definido pela lógica.
-   **Comportamento em combate:** Não usar hitbox ofensiva. Aplicar cura
    ou limpeza de status conforme a regra do move; a animação apenas
    comunica a mudança de estado.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #581 --- Misty Terrain

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user covers the ground under
    everyone's feet with mist for five turns. This protects Pokémon on
    the ground from status conditions.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Área/múltiplos alvos: calcular os alvos
    elegíveis pela área e regras do combate, sem duplicar dano.

### #582 --- Electrify

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Eletricidade / raio
-   **Descrição do move (fonte):** If the target is electrified before
    it uses a move during that turn, the target's move becomes Electric
    type.
-   **VFX proposto:** Raio em zigue-zague com segmentos angulares,
    núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no
    contato.
-   **Animação:** Um ou vários segmentos aparecem em sequência rápida; o
    raio pisca em poucos frames; explosão de faíscas e flash breve no
    alvo.
-   **Comportamento em combate:** Pode ser raio descendente, projétil
    elétrico, aura de investida ou descarga radial. Paralisia é um
    efeito de gameplay separado do efeito luminoso.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #583 --- Play Rough

-   **Tipo / categoria:** FAIRY / Physical · **Poder:** 90 ·
    **Precisão:** 90% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user plays rough with the target
    and attacks it. This may also lower the target's Attack stat.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #584 --- Fairy Wind

-   **Tipo / categoria:** FAIRY / Special · **Poder:** 30 ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user stirs up a fairy wind and
    strikes the target with it.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #585 --- Moonblast

-   **Tipo / categoria:** FAIRY / Special · **Poder:** 95 ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** Borrowing the power of the moon, the
    user attacks the target. This may also lower the target's Sp. Atk
    stat.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #586 --- Boomburst

-   **Tipo / categoria:** NORMAL / Special · **Poder:** 140 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user attacks everything around it
    with the destructive power of a terrible, explosive sound.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #587 --- Fairy Lock

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** By locking down the battlefield, the
    user keeps all Pokémon from fleeing during the next turn.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #588 --- King's Shield

-   **Tipo / categoria:** STEEL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user takes a defensive stance
    while it protects itself from damage. It also harshly lowers the
    Attack stat of any attacker who makes direct contact.
-   **VFX proposto:** Escudo de contorno pixelado, hexágonos ou espinhos
    ao redor do usuário; brilho forte apenas na ativação.
-   **Animação:** Escudo aparece em 2--3 etapas, pisca quando bloqueia e
    desaparece ao fim da janela de proteção.
-   **Comportamento em combate:** Ativar a proteção em estado próprio
    com duração definida. Dano refletido só existe quando a regra do
    move o especificar.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #589 --- Play Nice

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Status / suporte / controle
-   **Descrição do move (fonte):** The user and the target become
    friends, and the target loses its will to fight. This lowers the
    target's Attack stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #590 --- Confide

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user tells the target a secret,
    and the target loses its ability to concentrate. This lowers the
    target's Sp. Atk. stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #591 --- Diamond Storm

-   **Tipo / categoria:** ROCK / Physical · **Poder:** 100 ·
    **Precisão:** 95% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user whips up a storm of diamonds
    to damage opposing Pokémon. This may also raise the user's Defense
    stat.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.
    Atributos: atualizar estágios/valores no sistema de combate; a
    animação deve refletir a mudança confirmada.

### #592 --- Steam Eruption

-   **Tipo / categoria:** WATER / Special · **Poder:** 110 ·
    **Precisão:** 95% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Explosão / grande impacto
-   **Descrição do move (fonte):** The user immerses the target in
    superheated steam. This may also leave the target with a burn.
-   **VFX proposto:** Burst em camadas: núcleo branco/amarelo, anel
    externo colorido, fragmentos quadrados e fumaça em blocos. A forma
    deve ser irregular, não um gradiente circular liso.
-   **Animação:** Antecipação legível; expansão em 2--4 passos; frame de
    brilho máximo curto; dissipação em fumaça/brasas. Screen shake
    apenas no pico.
-   **Comportamento em combate:** Definir raio e instante único de dano.
    Golpes de autodestruição devem resolver o nocaute do usuário pela
    regra de combate, não pela animação.
-   **Regras específicas a preservar:** Efeito secundário: executar
    somente quando o cálculo de chance do move confirmar sucesso.

### #593 --- Hyperspace Hole

-   **Tipo / categoria:** PSYCHIC / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** Using a hyperspace hole, the user
    appears right next to the target and strikes. This also hits a
    target using Protect or Detect.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #594 --- Water Shuriken

-   **Tipo / categoria:** WATER / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 1
-   **Asset associado na origem:** `018-Water01.png` · **Frames
    indicados:** `F0-3` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** The user hits the target with
    throwing stars two to five times in a row. This move always goes
    first.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Múltiplos acertos: cada hit deve
    ter evento de colisão/dano próprio, respeitando a quantidade
    definida pela regra. Prioridade: o VFX não altera ordem de execução;
    respeitar a prioridade definida na lógica.

### #595 --- Mystical Fire

-   **Tipo / categoria:** FIRE / Special · **Poder:** 65 · **Precisão:**
    100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks by breathing a
    special, hot fire. This also lowers the target's Sp. Atk stat.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #596 --- Spiky Shield

-   **Tipo / categoria:** GRASS / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** In addition to protecting the user
    from attacks, this move also damages any attacker who makes direct
    contact.
-   **VFX proposto:** Escudo de contorno pixelado, hexágonos ou espinhos
    ao redor do usuário; brilho forte apenas na ativação.
-   **Animação:** Escudo aparece em 2--3 etapas, pisca quando bloqueia e
    desaparece ao fim da janela de proteção.
-   **Comportamento em combate:** Ativar a proteção em estado próprio
    com duração definida. Dano refletido só existe quando a regra do
    move o especificar.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #597 --- Aromatic Mist

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user raises the Sp. Def stat of
    an ally Pokémon with a mysterious aroma.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #598 --- Eerie Impulse

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 15 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user's body generates an eerie
    impulse. Exposing the target to it harshly lowers the target's Sp.
    Atk stat.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #599 --- Venom Drench

-   **Tipo / categoria:** POISON / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Opposing Pokémon are drenched in an
    odd poisonous liquid. This lowers the Attack, Sp. Atk, and Speed
    stats of a poisoned target.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #600 --- Powder

-   **Tipo / categoria:** BUG / Status · **Poder:** --- · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user covers the target in a
    powder that explodes and damages the target if it uses a Fire-type
    move.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #601 --- Geomancy

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user absorbs energy and sharply
    raises its Sp. Atk, Sp. Def, and Speed stats on the next turn.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #602 --- Magnetic Flux

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** The user manipulates magnetic fields
    which raises the Defense and Sp. Def stats of ally Pokémon with the
    Plus or Minus Ability.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #603 --- Happy Hour

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** Using Happy Hour doubles the amount
    of prize money received after battle.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #604 --- Electric Terrain

-   **Tipo / categoria:** ELECTRIC / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `017-Thunder01.png` · **Frames
    indicados:** `F0-5` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user electrifies the ground under
    everyone's feet for five turns. Pokémon on the ground no longer fall
    asleep.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Área/múltiplos alvos: calcular
    os alvos elegíveis pela área e regras do combate, sem duplicar dano.

### #605 --- Dazzling Gleam

-   **Tipo / categoria:** FAIRY / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Psíquico / luz / energia
-   **Descrição do move (fonte):** The user damages opposing Pokémon by
    emitting a powerful flash.
-   **VFX proposto:** Anéis concêntricos, losangos e orbes com núcleo
    branco e aura magenta, violeta, rosa ou dourada, conforme o golpe.
    Partículas orbitais pequenas.
-   **Animação:** Carga com pulsação de escala; liberação em onda, orbe
    ou explosão; distorção curta no alvo e desaparecimento por etapas.
-   **Comportamento em combate:** Definir explicitamente se o efeito
    persegue, viaja em linha, explode em área ou apenas envolve o
    usuário. Buffs e debuffs são resolvidos pela lógica de combate.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #606 --- Celebrate

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The Pokémon congratulates you on your
    special day!
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #607 --- Hold Hands

-   **Tipo / categoria:** NORMAL / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user and an ally hold hands. This
    makes them very happy.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #608 --- Baby-Doll Eyes

-   **Tipo / categoria:** FAIRY / Status · **Poder:** --- ·
    **Precisão:** 100% · **PP:** 30 · **Prioridade:** 1
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Status / suporte /
    controle
-   **Descrição do move (fonte):** The user stares at the target with
    its baby-doll eyes, which lowers its Attack stat. This move always
    goes first.
-   **VFX proposto:** Aura, ícones e símbolos simples associados ao
    efeito: estrelas para confusão, Zs para sono, anéis elétricos para
    paralisia, névoa para redução de atributos, brilho suave para cura.
-   **Animação:** Aplicar uma pose curta no usuário; viajar até o alvo
    apenas se a descrição sugerir um projétil; mostrar feedback visual
    de aplicação e depois manter um overlay discreto quando o status for
    persistente.
-   **Comportamento em combate:** Priorizar a consequência descrita:
    cura, buff, debuff, aprisionamento, clima, proteção ou status. Não
    criar dano visual se o move não causa dano.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Prioridade: o VFX não altera ordem de execução;
    respeitar a prioridade definida na lógica.

### #609 --- Nuzzle

-   **Tipo / categoria:** ELECTRIC / Physical · **Poder:** 20 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Folhas / sementes / vinhas
    / esporos
-   **Descrição do move (fonte):** The user attacks by nuzzling its
    electrified cheeks against the target. This also leaves the target
    with paralysis.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #610 --- Hold Back

-   **Tipo / categoria:** NORMAL / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 40 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Impacto físico
-   **Descrição do move (fonte):** The user holds back when it attacks
    and the target is left with at least 1 HP.
-   **VFX proposto:** Flash de contato em forma de estrela angular,
    linhas radiais curtas e fragmentos claros/escuros. A forma deve
    combinar com a direção do golpe.
-   **Animação:** Antecipação curta, deslocamento ou golpe de contato,
    frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão
    pode acompanhar o hit.
-   **Comportamento em combate:** Usar hitbox de contato ou alcance
    curto. Knockback e hitstun são parametrizados e não devem depender
    do número de partículas.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #611 --- Infestation

-   **Tipo / categoria:** BUG / Special · **Poder:** 20 · **Precisão:**
    100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `grass.png` · **Frames indicados:**
    `F5-7` · **Família visual:** Folhas / sementes / vinhas / esporos
-   **Descrição do move (fonte):** The target is infested and attacked
    for four to five turns. The target can't flee during this time.
-   **VFX proposto:** Folhas com silhueta serrilhada, sementes
    compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e
    amarelo. A rotação deve ser discreta e quantizada.
-   **Animação:** Folhas e sementes podem ser disparadas em leque ou
    sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente
    e somem em fade por degraus de opacidade.
-   **Comportamento em combate:** Usar projétil para objetos lançados e
    volume/área para nuvens e vinhas. Aplicar efeitos secundários após a
    validação do acerto.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #612 --- Power-Up Punch

-   **Tipo / categoria:** FIGHTING / Physical · **Poder:** 40 ·
    **Precisão:** 100% · **PP:** 20 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** Striking opponents over and over
    makes the user's fists harder. Hitting a target raises the Attack
    stat.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #613 --- Oblivion Wing

-   **Tipo / categoria:** FLYING / Special · **Poder:** 80 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Wind1.png` · **Frames indicados:**
    `F8-12` · **Família visual:** Projétil / disparo
-   **Descrição do move (fonte):** The user absorbs its target's HP. The
    user's HP is restored by over half of the damage taken by the
    target.
-   **VFX proposto:** Criar um sprite de projétil pixelado com contorno
    escuro, volume de 2--4 tons e brilho especular pequeno. O projétil
    deve ser claramente separado do sprite do usuário.
-   **Animação:** Antecipação curta (80--160 ms); spawn próximo à origem
    do atacante; deslocamento até o alvo com rotação alinhada à
    trajetória; impacto de 100--220 ms com burst de pixels.
-   **Comportamento em combate:** Colisão por hitbox simples durante o
    percurso. Ao acertar, consumir o projétil e emitir evento de
    impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar
    dano.
-   **Regras específicas a preservar:** Cura: atualizar HP pela regra do
    move e comunicar o valor efetivamente restaurado.

### #614 --- Thousand Arrows

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** This move also hits opposing Pokémon
    that are in the air. Those Pokémon are knocked down to the ground.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #615 --- Thousand Waves

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Earth1.png` · **Frames indicados:**
    `F0-6` · **Família visual:** Terreno / rochas / fissuras
-   **Descrição do move (fonte):** The user attacks with a wave that
    crawls along the ground. Those hit can't flee from battle.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Persistência/controle: criar
    estado com duração e condição de remoção; não manter apenas uma
    animação repetindo.

### #616 --- Land's Wrath

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 90 ·
    **Precisão:** 100% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Terreno / rochas /
    fissuras
-   **Descrição do move (fonte):** The user gathers the energy of the
    land and focuses that power on opposing Pokémon to damage them.
-   **VFX proposto:** Rachaduras, poeira, fragmentos e formas angulares
    que emergem do chão. Usar pixels duros, sombra projetada e variação
    de escala; evitar partículas circulares lisas.
-   **Animação:** Aviso no chão por 120--250 ms; erupção em sequência ou
    simultânea; pico de impacto com tremor proporcional; fragmentos caem
    e desaparecem.
-   **Comportamento em combate:** Definir uma ou mais zonas de impacto
    no terreno. Aplicar dano apenas dentro das zonas no frame de
    ativação; persistência/armadilhas ficam separadas do dano inicial.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #617 --- Light of Ruin

-   **Tipo / categoria:** FAIRY / Special · **Poder:** 140 ·
    **Precisão:** 90% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `003-Attack01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** Drawing power from the Eternal
    Flower, the user fires a powerful beam of light. This also damages
    the user quite a lot.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme
    a regra de combate, sem depender do VFX.

### #618 --- Origin Pulse

-   **Tipo / categoria:** WATER / Special · **Poder:** 110 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `023-Burst01.png` · **Frames
    indicados:** `F4-7` · **Família visual:** Raio / sopro / onda
-   **Descrição do move (fonte):** The user attacks opposing Pokémon
    with countless beams of light that glow a deep and brilliant blue.
-   **VFX proposto:** Feixe ou fluxo direcionado com núcleo claro, borda
    colorida e pequenas partículas. Para ondas sonoras, usar
    anéis/linhas de distorção; para sopros, partículas em leque.
-   **Animação:** Carregamento breve quando apropriado; emitir feixe por
    duração configurável ou disparar onda curta; animar brilho e largura
    em pulsos sem suavização bilinear.
-   **Comportamento em combate:** Pode ser instantâneo, contínuo ou em
    pulso, conforme a descrição. Verificar colisão ao longo do
    feixe/volume durante sua janela ativa e encerrar ao fim da duração.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #619 --- Precipice Blades

-   **Tipo / categoria:** GROUND / Physical · **Poder:** 120 ·
    **Precisão:** 85% · **PP:** 10 · **Prioridade:** 0
-   **Asset associado na origem:** `Ice1.png` · **Frames indicados:**
    `F0-8` · **Família visual:** Corte / lâmina
-   **Descrição do move (fonte):** The user attacks opposing Pokémon by
    manifesting the power of the land in fearsome blades of stone.
-   **VFX proposto:** Arco ou risco angular de 2--4 pixels de espessura,
    com núcleo claro e borda na cor do tipo. Para cortes cruzados,
    desenhar dois arcos diagonais em sequência.
-   **Animação:** Antecipação com recuo do corpo; golpe rápido em
    80--140 ms; manter o risco por poucos frames e finalizar com pequeno
    flash no alvo.
-   **Comportamento em combate:** Ataque de curta distância orientado
    para o alvo/direção. Aplicar um único hit por janela de ataque,
    salvo quando a descrição indicar múltiplos golpes.
-   **Regras específicas a preservar:** Resolver acerto, dano e
    eventuais efeitos secundários na lógica de combate; VFX apenas
    apresenta o resultado.

### #620 --- Dragon Ascent

-   **Tipo / categoria:** DRAGON / Physical · **Poder:** 120 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `015-Fire01.png` · **Frames
    indicados:** `F0-4` · **Família visual:** Aumento de atributos
-   **Descrição do move (fonte):** After soaring upward, the user
    attacks its target by dropping out of the sky at high speeds,
    although it lowers its own Defense and Sp. Def in the process.
-   **VFX proposto:** Setas, linhas ascendentes, símbolos e aura curta
    envolvendo o Pokémon. Diferenciar visualmente aumento, redução e
    proteção, mantendo consistência entre golpes.
-   **Animação:** Efeito surge abaixo ou ao redor do Pokémon, sobe em
    2--3 pulsos e termina com um flash pequeno; não deve esconder o
    sprite.
-   **Comportamento em combate:** Atualizar atributos pela lógica de
    combate e exibir o resultado confirmado. Não aumentar estatísticas
    apenas pela duração da animação.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

### #621 --- Hyperspace Fury

-   **Tipo / categoria:** DARK / Physical · **Poder:** 100 ·
    **Precisão:** 100% · **PP:** 5 · **Prioridade:** 0
-   **Asset associado na origem:** `004-Attack02.png` · **Frames
    indicados:** `F0-6` · **Família visual:** Golpes repetidos / rajada
-   **Descrição do move (fonte):** Using its many arms, the user
    unleashes a barrage of attacks that ignore the effects of moves like
    Protect and Detect. This attack lowers the user's Defense.
-   **VFX proposto:** Reutilizar o efeito principal do move em
    instâncias pequenas, alternando posição/ângulo e adicionando flashes
    discretos a cada acerto.
-   **Animação:** Executar 2--5 impactos ou disparos com intervalo curto
    e consistente; cada hit tem seu próprio frame de contato e feedback.
-   **Comportamento em combate:** A quantidade de hits vem da regra do
    move. Evitar que uma única colisão gere todos os acertos; cada hit
    deve ter evento e aplicação de dano controlados.
-   **Regras específicas a preservar:** Atributos: atualizar
    estágios/valores no sistema de combate; a animação deve refletir a
    mudança confirmada.

## 7. Contrato sugerido para cada definição de VFX

Cada move deve apontar para uma definição declarativa, evitando
`if/else` gigante pelo nome:

``` ts
type VfxKind =
  | 'projectile' | 'slash' | 'bite' | 'beam' | 'dash' | 'terrain'
  | 'nature' | 'fire' | 'water' | 'ice' | 'electric' | 'psychic'
  | 'dark' | 'explosion' | 'multi' | 'status' | 'heal' | 'buff' | 'impact';

interface MoveVfxDefinition {
  moveId: number;
  kind: VfxKind;
  asset?: string;
  startFrame?: number;
  endFrame?: number;
  fps?: number;
  durationMs: number;
  projectile?: { speed: number; maxDistance: number; hitRadius: number };
  area?: { radius: number; telegraphMs: number };
  impact?: { particles: number; shake: number; decal?: 'scorch' | 'wet' | 'zap_burn' | 'crack' };
  layers: Array<'anticipation' | 'execution' | 'impact' | 'residual' | 'status'>;
}
```

## 8. Critérios de aceite

-   Cada move cadastrado tem família visual e sequência de animação
    definidas.
-   Nenhum VFX aplica dano, cura ou status diretamente.
-   Os moves multi-hit mostram cada hit separadamente.
-   Moves de área exibem área/telegraph legível antes do dano quando
    necessário.
-   Moves de status/cura/buff não recebem explosão ofensiva genérica por
    padrão.
-   Os efeitos respeitam pixel art, `imageSmoothingEnabled = false`,
    limites de partículas e limpeza de cena.
-   Em 60 FPS, vários efeitos simultâneos não criam crescimento
    ilimitado de objetos ou partículas.

## 9. Nota sobre precisão

Este documento propõe direção visual e comportamento técnico para os
moves, não afirma que todas as animações estão já implementadas nem que
os spritesheets existentes representam fielmente cada golpe. Para
fidelidade maior, validar cada entrada contra o asset real e ajustar os
frames após inspeção visual.
