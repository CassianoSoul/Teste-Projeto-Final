/**
 * EXPERIMENTO INTERATIVO: A INTERFACE VIVA (19 PUZZLES SEQUENCIAIS COMPLETOS)
 */

// --- MOTOR DE ÁUDIO SINTETIZADO ---
const AudioEngine = {
    ctx: null,
    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    play(freq, duration, type = 'sine', vol = 0.03) {
        this.init();
        if (!this.ctx) return;
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    }
};

// --- BASE DE DADOS NARRATIVA (19 DESAFIOS) ---
const NARRATIVA = {
    puzzles: [
        { id: 1, sub: "Camada 1: Dinâmica de Impulso" },
        { id: 2, sub: "Camada 1: Alinhamento de Intenção" },
        { id: 3, sub: "Camada 2: Rastro Invisível" },
        { id: 4, sub: "Camada 2: Estado de Inércia" },
        { id: 5, sub: "Camada 3: Desvio de Foco" },
        { id: 6, sub: "Camada 3: Reflexo Superior" },
        { id: 7, sub: "Camada 3: Obscuridade Estática" },
        { id: 8, sub: "Camada 4: O Peso das Escolhas" },
        { id: 9, sub: "Camada 4: Engenharia Reversa" },
        { id: 10, sub: "Camada 4: Ponto Cego" },
        { id: 11, sub: "Camada 4: Teste de Insistência" },
        { id: 12, sub: "Camada 4: Distorção de Vetores" },
        { id: 13, sub: "Camada 4: Geometria Oculta" },
        { id: 14, sub: "Camada 4: Frequência Cardinal" },
        { id: 15, sub: "Camada 5: Fragmentação Sequencial" },     
        { id: 16, sub: "Camada 5: Sincronia de Clima Local" },     
        { id: 17, sub: "Camada 5: Falso Travamento Estrutural" }, 
        { id: 18, sub: "Camada 5: O Enigma da Janela Encolhida" },
        { id: 19, sub: "Camada Final: O Paradoxo do Eco" }            
    ]
};

let estado = { 
    puzzleAtual: 1,
    errosNoPuzzle: 0 
};

// --- SELETORES ---
const txtEntidade = document.getElementById('entidade-texto');
const subtxtEntidade = document.getElementById('entidade-subtexto');
const zonaInteracao = document.getElementById('interaction-zone');
const barraProgresso = document.getElementById('progress-bar');
const txtStatus = document.getElementById('status-text');
const containerApp = document.getElementById('app-container');
const landingScreen = document.getElementById('landing-screen');

let timeoutDigitacao = null;

function digitar(elemento, texto, velocidade = 20, callback = null) {
    if (timeoutDigitacao) clearTimeout(timeoutDigitacao);
    elemento.textContent = '';
    let i = 0;
    function rodar() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            timeoutDigitacao = setTimeout(rodar, velocidade);
        } else {
            timeoutDigitacao = null;
            if (callback) callback();
        }
    }
    rodar();
}

function atualizarStatus(porcentagem, statusTxt) {
    if(barraProgresso) barraProgresso.style.width = `${porcentagem}%`;
    if(txtStatus) txtStatus.textContent = statusTxt;
}

function resetarEstado() {
    estado.puzzleAtual = 1;
    estado.errosNoPuzzle = 0;
}

function proximoPuzzle() {
    estado.puzzleAtual++;
    estado.errosNoPuzzle = 0; 
    renderizarPuzzle();
}

// --- SISTEMA GLOBAL DE ERRO E ANIMAÇÃO DE RISADA (RESET) ---
function dispararSistemaDeErro() {
    AudioEngine.play(100, 0.6, 'sawtooth', 0.08);
    containerApp.classList.add('shake');
    setTimeout(() => containerApp.classList.remove('shake'), 250);

    const overlayErro = document.createElement('div');
    overlayErro.className = 'overlay-erro-sistema';
    document.body.appendChild(overlayErro);

    const msgErro = document.createElement('div');
    msgErro.className = 'msg-erro-sistema';
    msgErro.textContent = "Parece que você não conseguiu passar pelo meu sistema";
    overlayErro.appendChild(msgErro);

    const colunas = Math.floor(window.innerWidth / 80);
    for (let i = 0; i < colunas; i++) {
        setTimeout(() => {
            const risadaStream = document.createElement('div');
            risadaStream.className = 'risada-stream';
            risadaStream.style.left = `${i * (100 / colunas)}vw`;
            risadaStream.style.animationDelay = `${Math.random() * 0.5}s`;
            risadaStream.style.animationDuration = `${1 + Math.random() * 1.5}s`;
            
            let textoRisada = "";
            const tamanhoStream = 8 + Math.floor(Math.random() * 12);
            for(let j = 0; j < tamanhoStream; j++) {
                textoRisada += "HA\nHA\nHE\nHA\n";
            }
            risadaStream.innerText = textoRisada;
            overlayErro.appendChild(risadaStream);
        }, i * 30);
    }

    setTimeout(() => {
        overlayErro.remove();
        resetarEstado();
        containerApp.classList.add('hidden');
        landingScreen.classList.remove('hidden');
    }, 2500);
}

function registrarErro(maxChancesPermitidas = 1) {
    estado.errosNoPuzzle++;
    if (estado.errosNoPuzzle >= maxChancesPermitidas) {
        dispararSistemaDeErro();
        return true; 
    } else {
        AudioEngine.play(150, 0.15, 'triangle', 0.05);
        containerApp.classList.add('shake');
        setTimeout(() => containerApp.classList.remove('shake'), 150);
        return false; 
    }
}

function renderizarPuzzle() {
    zonaInteracao.innerHTML = '';
    containerApp.className = ''; 
    document.body.style.cursor = 'default';
    
    if (estado.puzzleAtual > 19) {
        renderizarGaleriaFinal();
        return;
    }

    const infoConfig = NARRATIVA.puzzles[estado.puzzleAtual - 1];
    subtxtEntidade.textContent = `${infoConfig.sub} | Fragmento ${infoConfig.id}/19`;
    
    const pct = Math.floor(((estado.puzzleAtual - 1) / 19) * 100);
    atualizarStatus(pct, `Decodificando barreira de dados ${estado.puzzleAtual}...`);

    window[`setupPuzzle${estado.puzzleAtual}`]();
}

// ==========================================================================
/* PUZZLES 1 A 6 */
// ==========================================================================
window.setupPuzzle1 = function() {
    // Gerar uma chave de histórico única para a sessão e salvar no sessionStorage
    if(!sessionStorage.getItem('chave_passado')) {
        const sufixoAleatorio = Math.floor(100 + Math.random() * 900);
        sessionStorage.setItem('chave_passado', `SESSION-X${sufixoAleatorio}`);
    }
    const chaveOculta = sessionStorage.getItem('chave_passado');

    digitar(txtEntidade, "A pressa constrói paredes que se movem sozinhos. Somente uma aproximação cirúrgica e desacelerada pode tocar no que foge.");
    
    // Injeta sutilmente a pista no rodapé informativo da tela
    subtxtEntidade.textContent += ` | ID: ${chaveOculta}`;

    const btn = document.createElement('button');
    btn.className = 'btn-target btn-fuga'; btn.textContent = 'Avançar';
    btn.style.left = '40%'; btn.style.top = '40%';
    let ultimoTempoMouse = Date.now();
    btn.addEventListener('mousemove', (e) => {
        const agora = Date.now(); const delta = agora - ultimoTempoMouse; ultimoTempoMouse = agora;
        if (delta < 40) { 
            AudioEngine.play(260, 0.05, 'triangle');
            const maxX = zonaInteracao.clientWidth - 120; const maxY = zonaInteracao.clientHeight - 45;
            btn.style.left = `${Math.random() * maxX}px`; btn.style.top = `${Math.random() * maxY}px`;
        }
    });
    btn.addEventListener('click', () => {
        AudioEngine.play(520, 0.1, 'sine');
        proximoPuzzle();
    });
    zonaInteracao.appendChild(btn);
};

window.setupPuzzle2 = function() {
    digitar(txtEntidade, "O caminho que você deseja seguir rejeita afirmações afobadas. A negação às vezes guarda a verdadeira passagem.");
    const container = document.createElement('div'); container.style.display = 'flex'; container.style.gap = '20px';
    const btnSim = document.createElement('button'); btnSim.className = 'btn-target'; btnSim.textContent = 'QUERO ENTRAR';
    const btnNao = document.createElement('button'); btnNao.className = 'btn-target'; btnNao.textContent = 'NÃO DEVERIA';
    btnSim.addEventListener('mouseenter', () => {
        const maxX = zonaInteracao.clientWidth - 80; const maxY = zonaInteracao.clientHeight - 45;
        btnSim.style.position = 'absolute'; btnSim.style.left = `${Math.random() * maxX}px`; btnSim.style.top = `${Math.random() * maxY}px`;
        AudioEngine.play(180, 0.05, 'sawtooth');
    });
    btnNao.addEventListener('click', () => {
        AudioEngine.play(580, 0.15, 'sine');
        proximoPuzzle();
    });
    container.appendChild(btnSim); container.appendChild(btnNao);
    zonaInteracao.appendChild(container);
};

window.setupPuzzle3 = function() {
    digitar(txtEntidade, "Aquilo que procuro está oculto sob a luz do dia, invisível até que você decida selecionar e revelar sua forma. Use as regras gramaticais completas.");
    const container = document.createElement('div'); container.className = 'invisible-text'; container.textContent = 'O segredo é: Persistência';
    
    const contadorChances = document.createElement('div');
    contadorChances.style.fontSize = '0.75rem';
    contadorChances.style.color = '#555';
    contadorChances.style.marginBottom = '10px';
    contadorChances.textContent = "Tentativas restantes: " + (2 - estado.errosNoPuzzle);

    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'Revele e replique...';
    
    input.addEventListener('change', () => {
        if (input.value === 'Persistência') {
            AudioEngine.play(520, 0.1, 'sine'); proximoPuzzle();
        } else {
            const resetou = registrarErro(2); 
            if(!resetou) {
                contadorChances.textContent = "Tentativas restantes: " + (2 - estado.errosNoPuzzle);
                contadorChances.style.color = 'var(--accent-color)';
                input.value = '';
            }
        }
    });
    zonaInteracao.appendChild(container); zonaInteracao.appendChild(contadorChances); zonaInteracao.appendChild(input);
};

window.setupPuzzle4 = function() {
    digitar(txtEntidade, "O sistema se alimenta da sua constante movimentação. Privar a tela de qualquer sinal de vida por instantes abrirá o portal.");
    let tempoImovel = 0; let loopImovel = null;
    const iniciarContagem = () => {
        loopImovel = setInterval(() => {
            tempoImovel++;
            if (tempoImovel >= 4) {
                clearInterval(loopImovel);
                document.removeEventListener('mousemove', resetarTempo); document.removeEventListener('click', resetarTempo);
                const btn = document.createElement('button'); btn.className = 'btn-target'; btn.textContent = 'Avançar';
                btn.addEventListener('click', () => proximoPuzzle());
                zonaInteracao.innerHTML = ''; zonaInteracao.appendChild(btn);
                AudioEngine.play(440, 0.3, 'sine');
            }
        }, 1000);
    };
    const resetarTempo = () => { tempoImovel = 0; clearInterval(loopImovel); iniciarContagem(); };
    iniciarContagem();
    document.addEventListener('mousemove', resetarTempo); document.addEventListener('click', resetarTempo);
};

window.setupPuzzle5 = function() {
    digitar(txtEntidade, "Olhar fixamente para o mesmo lugar fecha seus horizontes. Dê atenção ao mundo lá fora por um segundo e retorne para mim.");
    const aoMudarAba = () => {
        if (!document.hidden) {
            document.removeEventListener('visibilitychange', aoMudarAba);
            AudioEngine.play(620, 0.1, 'triangle');
            proximoPuzzle();
        }
    };
    document.addEventListener('visibilitychange', aoMudarAba);
};

window.setupPuzzle6 = function() {
    document.title = "Senha: 40028922";
    digitar(txtEntidade, "A verdade está escrita no ponto mais alto desta janela, onde os nomes se guardam de forma discreta.");
    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'O que está escrito no topo?';
    input.addEventListener('change', () => {
        if (input.value === '40028922') { document.title = "Acesso Forçado"; proximoPuzzle(); }
        else { registrarErro(1); input.value = ''; }
    });
    zonaInteracao.appendChild(input);
};

// ==========================================================================
/* PUZZLE 7 - BLOCO OPACO TOTALMENTE À FRENTE */
// ==========================================================================
window.setupPuzzle7 = function() {
    digitar(txtEntidade, "Obstáculos físicos servem apenas para cobrir dados valiosos. Remova o peso cinzento do caminho para expor a combinação numérica.");
    
    const fundoPista = document.createElement('div'); 
    fundoPista.className = 'pista-escondida'; 
    fundoPista.textContent = "9931";
    fundoPista.style.position = 'absolute';
    fundoPista.style.zIndex = '10';

    const drag = document.createElement('div'); 
    drag.className = 'draggable-box'; 
    drag.style.backgroundColor = 'black'
    drag.style.color = '#ffffff';
    drag.style.zIndex = '100'; 
    drag.style.left = '44%'; 
    drag.style.top = '25%';
    
    let arrastando = false, offX, offY;
    drag.addEventListener('mousedown', (e) => { 
        arrastando = true; 
        offX = e.clientX - drag.offsetLeft; 
        offY = e.clientY - drag.offsetTop; 
    });
    
    const moverMembro = (e) => { if (!arrastando) return; drag.style.left = `${e.clientX - offX}px`; drag.style.top = `${e.clientY - offY}px`; };
    const soltarMembro = () => { arrastando = false; };
    
    document.addEventListener('mousemove', moverMembro); 
    document.addEventListener('mouseup', soltarMembro);
    
    const input = document.createElement('input'); 
    input.className = 'input-custom'; 
    input.placeholder = 'Insira os números descobertos';
    input.style.marginTop = '120px';
    input.style.position = 'relative';
    input.style.zIndex = '150';
    
    input.addEventListener('change', () => {
        if (input.value === '9931') {
            document.removeEventListener('mousemove', moverMembro); 
            document.removeEventListener('mouseup', soltarMembro);
            proximoPuzzle();
        } else {
            registrarErro(1);
            input.value = '';
        }
    });
    
    zonaInteracao.appendChild(fundoPista); 
    zonaInteracao.appendChild(drag); 
    zonaInteracao.appendChild(input);
};

// ==========================================================================
/* PUZZLES 8 A 14 */
// ==========================================================================
window.setupPuzzle8 = function() {
    digitar(txtEntidade, "Uma barreira artificial surgiu. Tentar destruí-la à força trará consequências que exigirão uma sincera retratação por escrito.");
    const popup = document.createElement('div'); popup.className = 'custom-popup'; popup.style.left = '30%'; popup.style.top = '20%';
    const p = document.createElement('p'); p.textContent = "POR FAVOR, NÃO ME FECHE";
    const btnFechar = document.createElement('button'); btnFechar.className = 'btn-target'; btnFechar.textContent = 'FECHAR'; btnFechar.style.padding = '4px 10px';
    popup.appendChild(p); popup.appendChild(btnFechar); zonaInteracao.appendChild(popup);
    btnFechar.addEventListener('click', () => {
        AudioEngine.play(120, 0.3, 'sawtooth'); p.textContent = "O erro foi cometido. Ofereça uma 'desculpa' em texto para reestabilizar."; btnFechar.remove();
        const input = document.createElement('input'); input.className = 'input-custom'; input.style.width = '90%'; input.placeholder = 'Palavra de reparação...';
        input.addEventListener('change', () => { 
            if (input.value.toLowerCase() === 'desculpa') { popup.remove(); proximoPuzzle(); } 
            else { popup.remove(); registrarErro(1); }
        });
        popup.appendChild(input);
    });
};

window.setupPuzzle9 = function() {
    digitar(txtEntidade, "O código não está apenas na superfície da página. É preciso expandir as dimensões do navegador e enxergar os bastidores do sistema.");
    const checarConsole = setInterval(() => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
            clearInterval(checarConsole); AudioEngine.play(700, 0.15, 'sine');
            const btn = document.createElement('button'); btn.className = 'btn-target'; btn.textContent = 'Seguir Adiante';
            btn.addEventListener('click', () => proximoPuzzle()); zonaInteracao.appendChild(btn);
        }
    }, 1000);
};

window.setupPuzzle10 = function() {
    digitar(txtEntidade, "O objeto centralizado é uma armadilha óbvia para cliques curiosos. O progresso reside nas bordas vazias do espaço.");
    const btnFalso = document.createElement('button'); btnFalso.className = 'btn-target'; btnFalso.textContent = 'ALVO FALSO';
    btnFalso.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        registrarErro(1); 
    });
    const clicarFundo = () => { document.body.removeEventListener('click', clicarFundo); proximoPuzzle(); };
    setTimeout(() => { document.body.addEventListener('click', clicarFundo); }, 500);
    zonaInteracao.appendChild(btnFalso);
};

window.setupPuzzle11 = function() {
    digitar(txtEntidade, "Resistência estrutural pura. Quinze investidas contínuas quebrarão a parede lógica.");
    const btn = document.createElement('button'); btn.className = 'btn-target'; btn.textContent = 'Pressionar (0/15)';
    let clicks = 0;
    btn.addEventListener('click', () => {
        clicks++; AudioEngine.play(300 + (clicks * 20), 0.05, 'triangle'); btn.textContent = `Pressionar (${clicks}/15)`;
        if (clicks >= 15) { proximoPuzzle(); }
    });
    zonaInteracao.appendChild(btn);
};

window.setupPuzzle12 = function() {
    digitar(txtEntidade, "O cursor e o alvo operam em espelho reverso. Guie sua direção para o oposto geométrico para alcançar o clique.");
    const btn = document.createElement('button'); btn.className = 'btn-target btn-fuga'; btn.textContent = 'Destino'; btn.style.left = '50%'; btn.style.top = '40%';
    const aoMoverMouse = (e) => {
        const bounds = zonaInteracao.getBoundingClientRect(); const mX = e.clientX - bounds.left; const mY = e.clientY - bounds.top;
        const invX = bounds.width - mX - 40; const invY = bounds.height - mY - 20;
        btn.style.left = `${Math.max(10, Math.min(invX, bounds.width - 100))}px`; btn.style.top = `${Math.max(10, Math.min(invY, bounds.height - 50))}px`;
    };
    zonaInteracao.addEventListener('mousemove', aoMoverMouse);
    btn.addEventListener('click', () => { zonaInteracao.removeEventListener('mousemove', aoMoverMouse); proximoPuzzle(); });
    zonaInteracao.appendChild(btn);
};

window.setupPuzzle13 = function() {
    digitar(txtEntidade, "A forma geométrica abaixo anseia por uma interação tátil direta. Intermeie o vazio.");
    const img = document.createElement('div'); img.className = 'puzzle-img'; img.textContent = '[ MATRIZ ]';
    img.addEventListener('click', () => { AudioEngine.play(480, 0.2, 'sine'); proximoPuzzle(); });
    zonaInteracao.appendChild(img);
};

window.setupPuzzle14 = function() {
    digitar(txtEntidade, "O pulso de energia oscila em intervalos idênticos. Sincronize seu clique no exato milissegundo de iluminação total.");
    const btn = document.createElement('button'); btn.className = 'btn-target'; btn.textContent = 'Capturar Pulso';
    let visivel = true;
    const intervaloPadrao = setInterval(() => { visivel = !visivel; btn.style.opacity = visivel ? '1' : '0.05'; }, 800);
    btn.addEventListener('click', () => { if (visivel) { clearInterval(intervaloPadrao); proximoPuzzle(); } else { clearInterval(intervaloPadrao); registrarErro(1); } });
    zonaInteracao.appendChild(btn);
};

// ==========================================================================
/* PUZZLES 15 A 18 (RETA FINAL ORIGINAL) */
// ==========================================================================
window.setupPuzzle15 = function() {
    digitar(txtEntidade, "A sequência mutante se transforma a cada toque. Siga a ordem matemática das posições: comece caçando a primeira letra, depois encontre a segunda do próximo código, e caminhe de degrau em degrau.");
    let acertos = 0; let stringAtual = ""; const ordensTexto = ["1º caractere", "2º caractere", "3º caractere", "4º caractere", "5º caractere"];
    const contadorVisual = document.createElement('div'); contadorVisual.className = 'captcha-counter'; contadorVisual.textContent = `Extração Ativa: Procure o ${ordensTexto[acertos]} (${acertos}/5)`;
    const captchaBox = document.createElement('div'); captchaBox.className = 'captcha-container';
    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'Acompanhe a escada de caracteres...';
    const gerarNovoCodigo = () => {
        const caracters = "ABCDEFGHJKLMNOPQRSTUVWXYZ23456789"; let res = "";
        for(let i = 0; i < 5; i++) { res += caracters.charAt(Math.floor(Math.random() * caracters.length)); } return res;
    };
    stringAtual = gerarNovoCodigo(); captchaBox.textContent = stringAtual;
    input.addEventListener('keydown', (e) => {
        if (e.key.length !== 1) return; e.preventDefault(); 
        const teclaPressionada = e.key.toUpperCase(); const letraCorretaAlvo = stringAtual.charAt(acertos).toUpperCase();
        if (teclaPressionada === letraCorretaAlvo) {
            acertos++; AudioEngine.play(440 + (acertos * 60), 0.1, 'sine', 0.04); input.value += teclaPressionada; 
            if (acertos >= 5) { setTimeout(() => { proximoPuzzle(); }, 300); } 
            else { contadorVisual.textContent = `Extração Ativa: Procure o ${ordensTexto[acertos]} (${acertos}/5)`; stringAtual = gerarNovoCodigo(); captchaBox.textContent = stringAtual; }
        } else { registrarErro(1); }
    });
    zonaInteracao.appendChild(contadorVisual); zonaInteracao.appendChild(captchaBox); zonaInteracao.appendChild(input); input.focus();
};

window.setupPuzzle16 = function() {
    digitar(txtEntidade, "O último lacre está conectado ao mundo real. Descubra a exata temperatura ambiente em graus que os termômetros marcam agora -1 na icônica cidade de Xique-Xique, na Bahia.");
    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'Insira a temperatura real externa (Ex: 28)';
    let temperaturaCorreta = null;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-10.8231&longitude=-42.7261&current_weather=true")
        .then(response => response.json()).then(data => { if(data && data.current_weather) temperaturaCorreta = Math.round(data.current_weather.temperature); })
        .catch(() => { temperaturaCorreta = 29; });
    input.addEventListener('change', () => {
        const palpite = parseInt(input.value.trim(), 10);
        if (temperaturaCorreta !== null && palpite === temperaturaCorreta) { input.blur(); AudioEngine.play(800, 0.3, 'sine', 0.04); proximoPuzzle(); } 
        else { registrarErro(1); input.value = ''; }
    });
    zonaInteracao.appendChild(input); input.focus();
};

window.setupPuzzle17 = function() {
    digitar(txtEntidade, "O sistema congelou sob o peso da sua insistência. Nenhuma interação comum reverterá essa estagnação estrutural... a não ser que você DELETE o erro cometido.");
    
    const carregando = document.createElement('div');
    carregando.style.fontSize = '1.3rem'; carregando.style.fontWeight = 'bold';
    carregando.style.letterSpacing = '1px'; carregando.style.color = 'var(--accent-color)';
    carregando.textContent = "CARREGANDO SISTEMA: 0%";
    
    const inputFalso = document.createElement('input');
    inputFalso.className = 'input-custom'; inputFalso.placeholder = 'Processando requisição...';
    inputFalso.disabled = true; 
    
    zonaInteracao.appendChild(carregando);
    zonaInteracao.appendChild(inputFalso);

    let progressoFake = 0;
    let bufferLiberado = false;

    // Loop que faz a porcentagem subir na tela
    const loopContador = setInterval(() => {
        progressoFake += Math.floor(Math.random() * 8) + 2; 
        if (progressoFake >= 99) {
            progressoFake = 99;
            clearInterval(loopContador); // Trava bruscamente no 99%
            carregando.textContent = "CARREGAMENTO: 99%";
            AudioEngine.play(120, 0.4, 'sawtooth', 0.05); // Som de travamento
            
            // Inicia os 15 segundos de espera com a tela congelada
            setTimeout(() => {
                bufferLiberado = true;
                inputFalso.disabled = false;
                inputFalso.placeholder = 'NÚCLEO RETIDO. CORRIJA O TRAVAMENTO AGORA...';
                inputFalso.focus();
                AudioEngine.play(350, 0.2, 'triangle', 0.03);
            }, 15000);
        } else {
            carregando.textContent = `CARREGANDO SISTEMA: ${progressoFake}%`;
        }
    }, 80); // Velocidade da subida dos números

    inputFalso.addEventListener('keydown', (e) => {
        if (!bufferLiberado) { e.preventDefault(); return; }
        e.preventDefault();
        if (e.key === 'Backspace' || e.key === 'Delete') { 
            AudioEngine.play(600, 0.2, 'sine', 0.04); 
            proximoPuzzle(); 
        } else { 
            registrarErro(1); 
        }
    });
};

window.setupPuzzle18 = function() {
    digitar(txtEntidade, "O espaço se tornou pequeno demais para a minha presença. Se quiser enxergar além das bordas que eu mesmo criei, você terá que expandir os limites desta interface e me puxar de volta.");
    zonaInteracao.style.overflowX = 'scroll'; zonaInteracao.style.overflowY = 'hidden'; zonaInteracao.style.whiteSpace = 'nowrap';
    const containerLargo = document.createElement('div'); containerLargo.style.width = '180%'; containerLargo.style.display = 'flex'; containerLargo.style.justifyContent = 'flex-end'; containerLargo.style.paddingRight = '60px'; containerLargo.style.height = '100%'; containerLargo.style.alignItems = 'center';
    const btnOculto = document.createElement('button'); btnOculto.className = 'btn-target'; btnOculto.textContent = 'FINALIZAR SISTEMA';
    btnOculto.addEventListener('click', () => {
        zonaInteracao.style.overflowX = 'hidden'; zonaInteracao.style.whiteSpace = 'normal';
        AudioEngine.play(650, 0.15, 'sine', 0.04);
        proximoPuzzle(); // Avança para o puzzle surpresa!
    });
    containerLargo.appendChild(btnOculto); zonaInteracao.appendChild(containerLargo);
};

// ==========================================================================
/* PUZZLE 19 — O PARADOXO DO ECO (HISTÓRICO DA SESSÃO) */
// ==========================================================================
window.setupPuzzle19 = function() {
    // Busca o token gerado lá na fase 1
    const chaveCorreta = sessionStorage.getItem('chave_passado') || "SESSION-X47";

    digitar(txtEntidade, "Você buscou as chaves no futuro, mas o seu próprio passado já as testemunhou. O código de liberação estrutural foi entregue a você no exato instante em que cruzou a primeira porta deste sistema. O que estava escrito lá?");
    
    const input = document.createElement('input');
    input.className = 'input-custom';
    input.placeholder = 'Digite a chave do seu passado...';
    
    input.addEventListener('change', () => {
        const respostaUsuario = input.value.trim().toUpperCase();
        
        if (respostaUsuario === chaveCorreta.toUpperCase()) {
            AudioEngine.play(900, 0.4, 'sine', 0.05);
            proximoPuzzle(); // Vai para a galeria final (vitória)
        } else {
            // Se errar aqui na última fase, o jogo reseta por completo!
            registrarErro(1);
        }
    });
    
    zonaInteracao.appendChild(input);
    input.focus();
};

// ==========================================================================
/* FASE FINAL — FLASH UNDERTALE REDIRECT */
// ==========================================================================
function renderizarGaleriaFinal() {
    containerApp.classList.add('vulneravel-final');
    atualizarStatus(100, "Dados totalmente liberados.");
    
    digitar(txtEntidade, "Todas as chaves foram viradas. A lógica cedeu ao seu discernimento. O acesso ao coração do banco de dados está concedido.", 40, () => {
        const btnFinal = document.createElement('button');
        btnFinal.className = 'btn-target'; btnFinal.textContent = 'Abrir Núcleo Central'; btnFinal.style.marginTop = '20px';
        
        btnFinal.addEventListener('click', () => {
            const flash = document.createElement('div');
            flash.className = 'flash-undertale'; document.body.appendChild(flash);
            AudioEngine.play(440, 1.5, 'sine', 0.08);
            setTimeout(() => { window.location.href = 'segredo.html'; }, 1200);
        });
        zonaInteracao.appendChild(btnFinal);
    });
}

function iniciarExperiencia() {
    AudioEngine.play(200, 0.5, 'sine');
    landingScreen.classList.add('hidden');
    containerApp.classList.remove('hidden');
    renderizarPuzzle();
}

function inicializar() {
    localStorage.removeItem('exp_viva_progresso'); 
    resetarEstado();
    document.getElementById('btn-start').addEventListener('click', iniciarExperiencia);
}

window.onload = inicializar;
