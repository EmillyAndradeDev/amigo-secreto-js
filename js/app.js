let participantes = [];

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const segredo = params.get('k');

    if (segredo) {
        document.getElementById('admin-screen').classList.add('d-none');
        document.getElementById('reveal-screen').classList.remove('d-none');
        document.getElementById('reveal-screen').setAttribute('data-segredo', segredo);
    }

    const inputNome = document.getElementById('nome-input');
    
    if (inputNome) {
        inputNome.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                adicionarNome();
            }
        });
    }
};


function adicionarNome() {
    const input = document.getElementById('nome-input');
    const nome = input.value.trim();

    if (nome) {
        participantes.push(nome);
        atualizarLista();
        input.value = '';
        input.focus();
    }
}

function atualizarLista() {
    const lista = document.getElementById('lista-participantes');
    lista.innerHTML = ''; 

    participantes.forEach((p, index) => {
        lista.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${p} <button class="btn btn-sm btn-outline-danger" onclick="removerNome(${index})">&times;</button>
        </li>`;
    });

    document.getElementById('btn-sortear').disabled = participantes.length < 3;
}

function removerNome(index) {
    participantes.splice(index, 1);
    atualizarLista();
}

function realizarSorteio() {
    let sorteio = [...participantes];
    let valido = false;

    while (!valido) {
        for (let i = sorteio.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sorteio[i], sorteio[j]] = [sorteio[j], sorteio[i]];
        }
        valido = !participantes.some((p, i) => p === sorteio[i]);
    }

    const listaLinks = document.getElementById('lista-links');
    listaLinks.innerHTML = '';
    
    const baseUrl = window.location.origin + window.location.pathname;

    for (let i = 0; i < participantes.length; i++) {
        const quemTira = participantes[i];
        const quemFoiTirado = sorteio[i];

        const segredoCodificado = btoa(encodeURIComponent(quemFoiTirado));
        const linkFinal = `${baseUrl}?k=${segredoCodificado}`;

        const msgWhatsapp = `Olá, ${quemTira}! Clique aqui para ver seu amigo secreto: ${linkFinal}`;
        const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(msgWhatsapp)}`;

        listaLinks.innerHTML += `
    <li class="list-group-item">
        <strong>Para ${quemTira}:</strong>
        
        <div class="d-flex gap-2 mt-2">
            <a href="${linkWhatsapp}" target="_blank" class="btn btn-success btn-sm flex-grow-1">
               Enviar no WhatsApp
            </a>

            <button onclick="copiarLink('${linkFinal}', this)" class="btn btn-copiar btn-sm">
                Copiar Link
            </button>
        </div>

        <div class="text-muted small mt-2 text-truncate" style="opacity: 0.7;">
            ${linkFinal}
        </div>
    </li>
`;
    }

    document.getElementById('resultado-links').classList.remove('d-none');
    document.getElementById('btn-sortear').classList.add('d-none'); 
}


function revelarSegredo() {
    const container = document.getElementById('reveal-screen');
    const hash = container.getAttribute('data-segredo');
    
    try {
        const nomeRevelado = decodeURIComponent(atob(hash));
        
        document.getElementById('nome-amigo').innerText = nomeRevelado;
    } catch (e) {
        alert("Link inválido ou corrompido!");
    }
}

function copiarLink(texto, btnElement) {
    navigator.clipboard.writeText(texto).then(() => {
        const textoOriginal = btnElement.innerHTML;
        
        btnElement.innerHTML = '✔ Copiado!';
        btnElement.classList.add('sucesso');
        
        setTimeout(() => {
            btnElement.innerHTML = textoOriginal;
            btnElement.classList.remove('sucesso');
        }, 2000);
        
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Não foi possível copiar automaticamente.');
    });
}