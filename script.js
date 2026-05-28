/**
 * EXPERIMENTO INTERATIVO: A INTERFACE VIVA (16 PUZZLES SEQUENCIAIS COMPLETOS)
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

// --- BASE DE DADOS NARRATIVA (16 DESAFIOS) ---
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
        { id: 16, sub: "Camada 5: Sincronia de Clima Local" }
    ]
};

let estado = { puzzleAtual: 1 };

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
    estado = { puzzleAtual: 1 };
}

function proximoPuzzle() {
    estado.puzzleAtual++;
    renderizarPuzzle();
}

function renderizarPuzzle() {
    zonaInteracao.innerHTML = '';
    containerApp.className = ''; 
    document.body.style.cursor = 'default';
    
    if (estado.puzzleAtual > 16) {
        renderizarGaleriaFinal();
        return;
    }

    const infoConfig = NARRATIVA.puzzles[estado.puzzleAtual - 1];
    subtxtEntidade.textContent = `${infoConfig.sub} | Fragmento ${infoConfig.id}/16`;
    
    const pct = Math.floor(((estado.puzzleAtual - 1) / 16) * 100);
    atualizarStatus(pct, `Decodificando barreira de dados ${estado.puzzleAtual}...`);

    window[`setupPuzzle${estado.puzzleAtual}`]();
}

// Helper para teletransportar o cursor para o topo de forma simulada
function jogarCursorParaOTopo() {
    document.body.style.cursor = 'none';
    setTimeout(() => {
        document.body.style.cursor = 'default';
    }, 50);
}

// ==========================================================================
/* PUZZLES 1 A 14 */
// ==========================================================================
window.setupPuzzle1 = function() {
    digitar(txtEntidade, "A pressa constrói paredes que se movem sozinhos. Somente uma aproximação cirúrgica e desacelerada pode tocar no que foge.");
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
    
    // Jogar cursor para o topo sem travar
    jogarCursorParaOTopo();

    const container = document.createElement('div'); container.style.display = 'flex'; container.style.gap = '20px';
    const btnSim = document.createElement('button'); btnSim.className = 'btn-target'; btnSim.textContent = 'SIM';
    const btnNao = document.createElement('button'); btnNao.className = 'btn-target'; btnNao.textContent = 'NÃO';
    
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
    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'Revele e replique...';
    input.addEventListener('input', () => {
        if (input.value === 'Persistência') {
            AudioEngine.play(520, 0.1, 'sine'); proximoPuzzle();
        }
    });
    zonaInteracao.appendChild(container); zonaInteracao.appendChild(input);
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
    digitar(txtEntidade, "Olhar fixamente para o mesmo lugar fecha seus horizons. Dê atenção ao mundo lá fora por um segundo e retorne para mim.");
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
    document.title = "Senha: JanelaAberta";
    digitar(txtEntidade, "A verdade está escrita no ponto mais alto desta janela, onde os nomes se guardam de forma discreta.");
    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'O que está escrito no topo?';
    input.addEventListener('input', () => {
        if (input.value === 'JanelaAberta') { document.title = "Núcleo Protegido"; proximoPuzzle(); }
    });
    zonaInteracao.appendChild(input);
};

window.setupPuzzle7 = function() {
    digitar(txtEntidade, "Obstáculos físicos servem apenas para cobrir dados valiosos. Remova o peso cinzento do caminho para expor a combinação numérica.");
    
    // Geração de senha aleatória de 4 dígitos
    const senhaAleatoria = Math.floor(1000 + Math.random() * 9000).toString();

    const fundoPista = document.createElement('div'); fundoPista.className = 'pista-escondida'; fundoPista.textContent = senhaAleatoria;
    
    // Caixa sem texto interno, mas mantendo a classe destacada do CSS
    const drag = document.createElement('div'); drag.className = 'draggable-box'; 
    drag.style.left = '40%'; drag.style.top = '30%';
    
    let arrastando = false, offX, offY;
    drag.addEventListener('mousedown', (e) => { arrastando = true; offX = e.clientX - drag.offsetLeft; offY = e.clientY - drag.offsetTop; });
    const moverMembro = (e) => { if (!arrastando) return; drag.style.left = `${e.clientX - offX}px`; drag.style.top = `${e.clientY - offY}px`; };
    const soltarMembro = () => { arrastando = false; };
    document.addEventListener('mousemove', moverMembro); document.addEventListener('mouseup', soltarMembro);
    
    const input = document.createElement('input'); input.className = 'input-custom'; input.placeholder = 'Insira os números descobertos';
    input.style.marginTop = '110px';
    input.addEventListener('input', () => {
        if (input.value === senhaAleatoria) {
            document.removeEventListener('mousemove', moverMembro); document.removeEventListener('mouseup', soltarMembro);
            proximoPuzzle();
        }
    });
    zonaInteracao.appendChild(fundoPista); zonaInteracao.appendChild(drag); zonaInteracao.appendChild(input);
};

window.setupPuzzle8 = function() {
    digitar(txtEntidade, "Uma barreira artificial surgiu. Tentar destruí-la à força trará consequências que exigirão uma sincera retratação por escrito.");
    const popup = document.createElement('div'); popup.className = 'custom-popup'; popup.style.left = '30%'; popup.style.top = '20%';
    const p = document.createElement('p'); p.textContent = "SISTEMA: NÃO ME FECHE, POR FAVOR.";
    const btnFechar = document.createElement('button'); btnFechar.className = 'btn-target'; btnFechar.textContent = 'FECHAR'; btnFechar.style.padding = '4px 10px';
    popup.appendChild(p); popup.appendChild(btnFechar); zonaInteracao.appendChild(popup);
    btnFechar.addEventListener('click', () => {
        AudioEngine.play(120, 0.3, 'sawtooth'); p.textContent = "O erro foi cometido. Ofereça uma 'desculpa' em texto para reestabilizar."; btnFechar.remove();
        const input = document.createElement('input'); input.className = 'input-custom'; input.style.width = '90%'; input.placeholder = 'Palavra de reparação...';
        input.addEventListener('input', () => { if (input.value.toLowerCase() === 'desculpa') { popup.remove(); proximoPuzzle(); } });
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
    btnFalso.addEventListener('click', (e) => { e.stopPropagation(); AudioEngine.play(140, 0.1, 'sawtooth'); containerApp.classList.add('shake'); setTimeout(() => containerApp.classList.remove('shake'), 200); });
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
    
    // Jogar cursor para o topo sem travar
    jogarCursorParaOTopo();

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
    btn.addEventListener('click', () => { if (visivel) { clearInterval(intervaloPadrao); proximoPuzzle(); } else { AudioEngine.play(150, 0.1, 'sawtooth'); } });
    zonaInteracao.appendChild(btn);
};

// ==========================================================================
/* PUZZLE 15 — SEM O CONTADOR VERMELHO DENUNCIANDO A ORDEM */
// ==========================================================================
window.setupPuzzle15 = function() {
    digitar(txtEntidade, "A sequência mutante se transforma a cada toque. Siga a ordem matemática das posições: comece caçando a primeira letra, depois encontre a segunda do próximo código, e caminhe de degrau em degrau.");
    
    let acertos = 0;
    let stringAtual = "";

    const captchaBox = document.createElement('div');
    captchaBox.className = 'captcha-container';
    
    const input = document.createElement('input');
    input.className = 'input-custom';
    input.placeholder = 'Acompanhe a escada de caracteres...';

    const gerarNovoCodigo = () => {
        const caracters = "ABCDEFGHJKLMNOPQRSTUVWXYZ23456789";
        let res = "";
        for(let i = 0; i < 5; i++) {
            res += caracters.charAt(Math.floor(Math.random() * caracters.length));
        }
        return res;
    };

    stringAtual = gerarNovoCodigo();
    captchaBox.textContent = stringAtual;

    input.addEventListener('keydown', (e) => {
        if (e.key.length !== 1) return;
        e.preventDefault(); 
        
        const teclaPressionada = e.key.toUpperCase();
        const letraCorretaAlvo = stringAtual.charAt(acertos).toUpperCase();

        if (teclaPressionada === letraCorretaAlvo) {
            acertos++;
            AudioEngine.play(440 + (acertos * 60), 0.1, 'sine', 0.04);
            input.value += teclaPressionada; 
            
            if (acertos >= 5) {
                setTimeout(() => {
                    proximoPuzzle();
                }, 300);
            } else {
                stringAtual = gerarNovoCodigo();
                captchaBox.textContent = stringAtual;
            }
        } else {
            acertos = 0;
            input.value = "";
            AudioEngine.play(130, 0.25, 'sawtooth', 0.05);
            
            containerApp.classList.add('shake');
            setTimeout(() => containerApp.classList.remove('shake'), 250);
            
            stringAtual = gerarNovoCodigo();
            captchaBox.textContent = stringAtual;
        }
    });

    zonaInteracao.appendChild(captchaBox);
    zonaInteracao.appendChild(input);
    input.focus();
};

// ==========================================================================
/* PUZZLE 16 — PERGUNTA DIRETA SOBRE XIQUE-XIQUE */
// ==========================================================================
window.setupPuzzle16 = function() {
    digitar(txtEntidade, "Qual a atual temperatura em Xique-Xique, BA?");
    
    const input = document.createElement('input');
    input.className = 'input-custom';
    input.placeholder = 'Insira o valor em graus (Ex: 28)';
    
    let temperaturaCorreta = null;

    fetch("https://api.open-meteo.com/v1/forecast?latitude=-10.8231&longitude=-42.7261&current_weather=true")
        .then(response => response.json())
        .then(data => {
            if(data && data.current_weather) {
                temperaturaCorreta = Math.round(data.current_weather.temperature);
            }
        })
        .catch(() => {
            temperaturaCorreta = 29; 
        });

    input.addEventListener('input', () => {
        const palpite = parseInt(input.value.trim(), 10);
        
        if (temperaturaCorreta !== null && palpite === temperaturaCorreta) {
            input.blur();
            AudioEngine.play(800, 0.3, 'sine', 0.04);
            proximoPuzzle(); 
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
        btnFinal.className = 'btn-target';
        btnFinal.textContent = 'Abrir Núcleo Central';
        btnFinal.style.marginTop = '20px';
        
        btnFinal.addEventListener('click', () => {
            const flash = document.createElement('div');
            flash.className = 'flash-undertale';
            document.body.appendChild(flash);
            
            AudioEngine.play(440, 1.5, 'sine', 0.08);

            setTimeout(() => {
                window.location.href = 'gatos.html';
            }, 1200);
        });
        zonaInteracao.appendChild(btnFinal);
    });
}

// --- CONTROLE DE INICIALIZAÇÃO ---
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