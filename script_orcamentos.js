// A variável 'supabase' vem do window.supabase definida no HTML
async function carregarOrcamentos() {
    const listaCorpo = document.getElementById("listaOrcamentos");
    if (!listaCorpo) return;

    listaCorpo.innerHTML = "<tr><td colspan='5'>Sincronizando dados...</td></tr>";

    try {
        // Tenta buscar os dados. 
        // Se o 'id' não existir, ele vai cair no catch e tentaremos buscar sem ordem.
        let { data, error } = await window.supabase
            .from('orcamentos')
            .select('*')
            .order('id', { ascending: false });

        // Se der erro de coluna não existente, tenta buscar sem ordenar
        if (error && error.message.includes("id")) {
            console.warn("Coluna id não encontrada, tentando busca simples...");
            const res = await window.supabase.from('orcamentos').select('*');
            data = res.data;
            error = res.error;
        }

        if (error) throw error;

        let html = "";
        if (data && data.length > 0) {
            data.forEach(o => {
                const numLimpo = o.contato ? String(o.contato).replace(/\D/g,'') : "";
                const zap = numLimpo ? 
                    `<a href="https://wa.me/55${numLimpo}" target="_blank" style="color:#25d366;text-decoration:none;font-weight:bold;">📱 WhatsApp</a>` : "---";
                
                let rede = "---";
                if (o.rede_social) {
                    const redeTxt = String(o.rede_social);
                    const url = redeTxt.includes('http') ? redeTxt : `https://instagram.com/${redeTxt.replace('@','')}`;
                    rede = `<a href="${url}" target="_blank" style="color:#e1306c;text-decoration:none;font-weight:bold;">📸 Link/Insta</a>`;
                }

                html += `
                <tr>
                    <td>${o.morador || '---'}</td>
                    <td>${o.apto || '---'}</td>
                    <td>${o.servico || '---'}</td>
                    <td>${zap}</td>
                    <td>${rede}</td>
                </tr>`;
            });
        } else {
            html = "<tr><td colspan='5'>Nenhuma indicação encontrada.</td></tr>";
        }
        listaCorpo.innerHTML = html;

    } catch (err) {
        console.error("Erro detalhado:", err);
        listaCorpo.innerHTML = `<tr><td colspan='5' style='color:red'>Erro ao carregar: ${err.message}</td></tr>`;
    }
}

// Inicia a carga
carregarOrcamentos();