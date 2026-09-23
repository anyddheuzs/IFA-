/* ==========================================================================
   1. CONTROLE DE FONTE (A+ / A-)
   ========================================================================== */
let tamanhoFonteAtual = 100;
const btnAumentaTexto = document.getElementById("btnAumentaTexto");
const btnDiminuiTexto = document.getElementById("btnDiminuiTexto");

if (btnAumentaTexto && btnDiminuiTexto) {
    btnAumentaTexto.addEventListener("click", () => {
        if (tamanhoFonteAtual < 160) {
            tamanhoFonteAtual += 10;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    btnDiminuiTexto.addEventListener("click", () => {
        if (tamanhoFonteAtual > 80) {
            tamanhoFonteAtual -= 10;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });
}

/* ==========================================================================
   2. CONTROLE DE ALTO CONTRASTE
   ========================================================================== */
const btnContraste = document.getElementById("btnContraste");

if (btnContraste) {
    btnContraste.addEventListener("click", () => {
        document.body.classList.toggle("alto-contraste");
        const estaEmAltoContraste = document.body.classList.contains("alto-contraste");
        btnContraste.setAttribute("aria-pressed", estaEmAltoContraste);
    });
}

/* ==========================================================================
   3. SELETOR DE SIMULAÇÃO DE DALTONISMO
   ========================================================================== */
const seletorDaltonismo = document.getElementById("seletorDaltonismo");

if (seletorDaltonismo) {
    seletorDaltonismo.addEventListener("change", (e) => {
        // Remove classes de daltonismo anteriores
        document.body.classList.remove("simular-deuteranopia", "simular-protanopia", "simular-tritanopia");
        
        const valorSelecionado = e.target.value;
        if (valorSelecionado !== "nenhum") {
            document.body.classList.add(`simular-${valorSelecionado}`);
        }
    });
}

/* ==========================================================================
   4. MODAL POP-UP ACESSÍVEL
   ========================================================================== */
const modal = document.getElementById("modalAjuda");
const btnFecharModal = document.getElementById("btnFecharModal");
let elementoComFocoAntesDoModal = null;

function abrirModal() {
    if (!modal) return;
    elementoComFocoAntesDoModal = document.activeElement;
    modal.setAttribute("hidden", "false");
    modal.style.display = "flex";
    if (btnFecharModal) btnFecharModal.focus();
}

function fecharModal() {
    if (!modal) return;
    modal.setAttribute("hidden", "true");
    modal.style.display = "none";
    if (elementoComFocoAntesDoModal) elementoComFocoAntesDoModal.focus();
}

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modal && modal.style.display === "flex") {
        fecharModal();
    }
});

/* ==========================================================================
   5. LEITOR DE TELA EM VOZ ALTA (Web Speech API)
   ========================================================================== */
const btnVoz = document.getElementById("btnVoz");

if (btnVoz) {
    btnVoz.addEventListener("click", () => {
        if (window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                btnVoz.textContent = "⏸️ Pausar Voz";
                btnVoz.setAttribute("aria-label", "Pausar leitura em voz alta");
            } else {
                window.speechSynthesis.pause();
                btnVoz.textContent = "▶️ Retomar Voz";
                btnVoz.setAttribute("aria-label", "Retomar leitura em voz alta");
            }
            return;
        }

        const conteudoParaLer = document.querySelector("main");
        if (!conteudoParaLer) return;

        const mensagemVoz = new SpeechSynthesisUtterance(conteudoParaLer.innerText);
        mensagemVoz.lang = "pt-BR";
        mensagemVoz.rate = 1.0;

        mensagemVoz.onstart = () => {
            btnVoz.textContent = "⏸️ Pausar Voz";
            btnVoz.setAttribute("aria-label", "Pausar leitura em voz alta");
        };

        mensagemVoz.onend = resetarBotaoVoz;
        mensagemVoz.onerror = resetarBotaoVoz;

        window.speechSynthesis.speak(mensagemVoz);
    });
}

function pararLeitura() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        resetarBotaoVoz();
    }
}

function resetarBotaoVoz() {
    if (btnVoz) {
        btnVoz.textContent = "🔊 Ouvir Revista";
        btnVoz.setAttribute("aria-label", "Ouvir o conteúdo da revista em voz alta");
    }
}