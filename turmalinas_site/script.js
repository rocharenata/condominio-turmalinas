const db = window.supabaseClient;
let torreAtual = 1;

async function carregarTorre(numero) {
    torreAtual = numero;
    document.getElementById("tituloTorre").innerText = "Torre " + numero;
    const listaCorpo = document.getElementById("listaMoradores");
    
    if (!listaCorpo) return;
    listaCorpo.innerHTML = "<tr><td colspan='2'>A carregar...</td></tr>";

    try {
        // Busca simples
        const { data, error } = await db
            .from('moradores')
            .select('*')
            .or(`Torre.eq.Torre ${numero},Torre.eq.${numero}`);

        if (error) {
            // Isso vai mostrar o erro real do Supabase na sua tela
            listaCorpo.innerHTML = `<tr><td colspan='2' style='color:red'>Erro ${error.code}: ${error.message}</td></tr>`;
            return;
        }

        let html = "";
        if (data && data.length > 0) {
            data.forEach(m => {
                const apto = m.Apartamento || m.apto || "---";
                const nome = m.Moradores || m.morador || "---";
                html += `<tr><td>${apto}</td><td>${nome}</td></tr>`;
            });
        } else {
            html = `<tr><td colspan='2'>Nenhum morador encontrado na Torre ${numero}</td></tr>`;
        }
        listaCorpo.innerHTML = html;

    } catch (err) {
        listaCorpo.innerHTML = "<tr><td colspan='2' style='color:red'>Falha na ligação ao servidor.</td></tr>";
    }
}

// Escutador do formulário (que você disse que já funciona)
document.getElementById("formMorador").addEventListener("submit", async function(e) {
    e.preventDefault();
    const apto = document.getElementById("apto").value;
    const nome = document.getElementById("morador").value;

    try {
        const { error } = await db.from('moradores').insert([{ 
            Torre: "Torre " + torreAtual, 
            Apartamento: parseInt(apto), 
            Moradores: nome 
        }]);

        if (error) throw error;
        alert("Cadastrado!");
        this.reset();
        carregarTorre(torreAtual);
    } catch (err) {
        alert("Erro: " + err.message);
    }
});

// Carrega a Torre 1 ao abrir
carregarTorre(1);