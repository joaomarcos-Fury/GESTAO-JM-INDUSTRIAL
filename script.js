// Sistema de Gestão JM de Compras - JavaScript Completo

// Estrutura de dados
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];

// Função para salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${mensagem}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Função para trocar abas
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(`content-${tabName}`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Atualizar dados específicos da aba
    switch(tabName) {
        case 'dashboard':
            atualizarDashboard();
            break;
        case 'estoque':
            atualizarEstoque();
            break;
        case 'movimentacao':
            atualizarMovimentacoes();
            break;
        case 'fornecedores':
            atualizarFornecedores();
            break;
        case 'produtos':
            atualizarProdutos();
            break;
    }
}

// Funções para formulários de movimentação
function showMovimentacaoForm(tipo = 'entrada') {
    document.getElementById('movimentacao-form').style.display = 'block';
    document.getElementById('mov-tipo').value = tipo;
    document.getElementById('mov-data').value = new Date().toISOString().split('T')[0];
    atualizarSelectProdutos();
}

function hideMovimentacaoForm() {
    document.getElementById('movimentacao-form').style.display = 'none';
    document.getElementById('form-movimentacao').reset();
}

// Funções para formulários de fornecedores
function showFornecedorForm(index = -1) {
    document.getElementById('fornecedor-form').style.display = 'block';
    const form = document.getElementById('form-fornecedor');
    form.reset();
    
    if (index >= 0 && fornecedores[index]) {
        const fornecedor = fornecedores[index];
        form.querySelector('[name="index"]').value = index;
        form.querySelector('[name="nome"]').value = fornecedor.nome;
        form.querySelector('[name="razaosocial"]').value = fornecedor.razaosocial || '';
        form.querySelector('[name="cnpj"]').value = fornecedor.cnpj || '';
        form.querySelector('[name="contato"]').value = fornecedor.contato;
    } else {
        form.querySelector('[name="index"]').value = -1;
    }
}

function hideFornecedorForm() {
    document.getElementById('fornecedor-form').style.display = 'none';
    document.getElementById('form-fornecedor').reset();
}

// Funções para formulários de produtos
function showProdutoForm(index = -1) {
    document.getElementById('produto-form').style.display = 'block';
    const form = document.getElementById('form-produto');
    form.reset();
    
    if (index >= 0 && produtos[index]) {
        const produto = produtos[index];
        form.querySelector('[name="index"]').value = index;
        form.querySelector('[name="nome"]').value = produto.nome;
        form.querySelector('[name="codigo"]').value = produto.codigo;
        form.querySelector('[name="categoria"]').value = produto.categoria || '';
        form.querySelector('[name="unidade"]').value = produto.unidade || '';
    } else {
        form.querySelector('[name="index"]').value = -1;
    }
}

function hideProdutoForm() {
    document.getElementById('produto-form').style.display = 'none';
    document.getElementById('form-produto').reset();
}

// Função para atualizar select de produtos
function atualizarSelectProdutos() {
    const select = document.getElementById('mov-produto');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    
    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${produto.nome} (${produto.codigo})`;
        select.appendChild(option);
    });
}

// Função para calcular status do estoque
function calcularStatusEstoque(quantidade, minimo) {
    if (quantidade <= 0) return 'critical';
    if (quantidade <= minimo) return 'low';
    return 'ok';
}

// Função para obter texto do status
function getStatusText(status) {
    switch(status) {
        case 'ok': return 'OK';
        case 'low': return 'BAIXO';
        case 'critical': return 'CRÍTICO';
        default: return 'DESCONHECIDO';
    }
}

// Função para obter classe CSS do status
function getStatusClass(status) {
    switch(status) {
        case 'ok': return 'status-ok';
        case 'low': return 'status-low';
        case 'critical': return 'status-critical';
        default: return 'status-critical';
    }
}

// Função para atualizar dashboard
function atualizarDashboard() {
    const totalProdutos = produtos.length;
    let produtosOk = 0, produtosBaixo = 0, produtosCritico = 0;
    
    estoque.forEach(item => {
        const status = calcularStatusEstoque(item.quantidade, item.estoqueMinimo);
        switch(status) {
            case 'ok': produtosOk++; break;
            case 'low': produtosBaixo++; break;
            case 'critical': produtosCritico++; break;
        }
    });
    
    document.getElementById('total-produtos').textContent = totalProdutos;
    document.getElementById('produtos-ok').textContent = produtosOk;
    document.getElementById('produtos-baixo').textContent = produtosBaixo;
    document.getElementById('produtos-critico').textContent = produtosCritico;
    
    // Atualizar contador de alertas
    const alertCount = produtosBaixo + produtosCritico;
    document.getElementById('alert-count').textContent = alertCount;
}

// Função para atualizar lista de estoque
function atualizarEstoque() {
    const tbody = document.getElementById('estoque-list');
    tbody.innerHTML = '';
    
    estoque.forEach((item, index) => {
        const produto = produtos[item.produtoIndex];
        if (!produto) return;
        
        const status = calcularStatusEstoque(item.quantidade, item.estoqueMinimo);
        const row = document.createElement('tr');
        row.className = 'hover-gray';
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.categoria || '-'}</td>
            <td>${item.quantidade} ${produto.unidade || 'kg'}</td>
            <td>${item.estoqueMinimo} ${produto.unidade || 'kg'}</td>
            <td><span class="status-badge ${getStatusClass(status)}">${getStatusText(status)}</span></td>
            <td>${new Date(item.ultimaAtualizacao).toLocaleDateString('pt-BR')}</td>
            <td style="text-align:center;">
                <button class="btn btn-edit" onclick="editarEstoque(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" onclick="excluirEstoque(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para atualizar lista de movimentações
function atualizarMovimentacoes() {
    const tbody = document.getElementById('movimentacoes-list');
    tbody.innerHTML = '';
    
    movimentacoes.forEach((mov, index) => {
        const produto = produtos[mov.produtoIndex];
        if (!produto) return;
        
        const row = document.createElement('tr');
        row.className = 'hover-gray';
        row.innerHTML = `
            <td>${new Date(mov.data).toLocaleDateString('pt-BR')}</td>
            <td>${produto.nome}</td>
            <td><span class="status-badge ${mov.tipo === 'entrada' ? 'status-ok' : 'status-critical'}">${mov.tipo.toUpperCase()}</span></td>
            <td>${mov.quantidade} ${produto.unidade || 'kg'}</td>
            <td>${mov.observacao || '-'}</td>
            <td>
                <button class="btn btn-delete" onclick="excluirMovimentacao(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para atualizar lista de fornecedores
function atualizarFornecedores() {
    const tbody = document.getElementById('fornecedores-list');
    tbody.innerHTML = '';
    
    fornecedores.forEach((fornecedor, index) => {
        const row = document.createElement('tr');
        row.className = 'hover-gray';
        row.innerHTML = `
            <td>${fornecedor.nome}</td>
            <td>${fornecedor.contato}</td>
            <td style="text-align:center;">
                <button class="btn btn-edit" onclick="showFornecedorForm(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" onclick="excluirFornecedor(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para atualizar lista de produtos
function atualizarProdutos() {
    const tbody = document.getElementById('produtos-list');
    tbody.innerHTML = '';
    
    produtos.forEach((produto, index) => {
        const row = document.createElement('tr');
        row.className = 'hover-gray';
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.codigo}</td>
            <td>${produto.categoria || '-'}</td>
            <td style="text-align:center;">
                <button class="btn btn-edit" onclick="showProdutoForm(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" onclick="excluirProduto(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para excluir fornecedor
function excluirFornecedor(index) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        fornecedores.splice(index, 1);
        salvarDados();
        atualizarFornecedores();
        mostrarNotificacao('Fornecedor excluído com sucesso!');
    }
}

// Função para excluir produto
function excluirProduto(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos.splice(index, 1);
        // Remover do estoque também
        estoque = estoque.filter(item => item.produtoIndex !== index);
        // Ajustar índices
        estoque.forEach(item => {
            if (item.produtoIndex > index) {
                item.produtoIndex--;
            }
        });
        salvarDados();
        atualizarProdutos();
        atualizarEstoque();
        atualizarDashboard();
        mostrarNotificacao('Produto excluído com sucesso!');
    }
}

// Função para excluir movimentação
function excluirMovimentacao(index) {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
        movimentacoes.splice(index, 1);
        salvarDados();
        atualizarMovimentacoes();
        mostrarNotificacao('Movimentação excluída com sucesso!');
    }
}

// Função para excluir estoque
function excluirEstoque(index) {
    if (confirm('Tem certeza que deseja excluir este item do estoque?')) {
        estoque.splice(index, 1);
        salvarDados();
        atualizarEstoque();
        atualizarDashboard();
        mostrarNotificacao('Item do estoque excluído com sucesso!');
    }
}

// Função para editar estoque
function editarEstoque(index) {
    const item = estoque[index];
    const novaQuantidade = prompt('Nova quantidade:', item.quantidade);
    const novoMinimo = prompt('Novo estoque mínimo:', item.estoqueMinimo);
    
    if (novaQuantidade !== null && novoMinimo !== null) {
        item.quantidade = parseFloat(novaQuantidade);
        item.estoqueMinimo = parseFloat(novoMinimo);
        item.ultimaAtualizacao = new Date().toISOString();
        salvarDados();
        atualizarEstoque();
        atualizarDashboard();
        mostrarNotificacao('Estoque atualizado com sucesso!');
    }
}

// Função para toggle do painel de alertas
function toggleAlertsPanel() {
    const alertCount = parseInt(document.getElementById('alert-count').textContent);
    if (alertCount > 0) {
        let alertas = [];
        estoque.forEach(item => {
            const status = calcularStatusEstoque(item.quantidade, item.estoqueMinimo);
            if (status !== 'ok') {
                const produto = produtos[item.produtoIndex];
                if (produto) {
                    alertas.push(`${produto.nome}: ${item.quantidade} ${produto.unidade || 'kg'} (mínimo: ${item.estoqueMinimo})`);
                }
            }
        });
        
        if (alertas.length > 0) {
            alert('ALERTAS DE ESTOQUE:\n\n' + alertas.join('\n'));
        }
    } else {
        alert('Nenhum alerta de estoque no momento!');
    }
}

// Função para exportar dados
function exportarDados() {
    const dados = {
        produtos: produtos,
        fornecedores: fornecedores,
        movimentacoes: movimentacoes,
        estoque: estoque,
        cotacoes: cotacoes,
        pedidos: pedidos,
        dataExportacao: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-gestao-jm-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    mostrarNotificacao('Backup exportado com sucesso!');
}

// Função para importar dados
function importarDados() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const dados = JSON.parse(e.target.result);
                    if (confirm('Isso irá substituir todos os dados atuais. Continuar?')) {
                        produtos = dados.produtos || [];
                        fornecedores = dados.fornecedores || [];
                        movimentacoes = dados.movimentacoes || [];
                        estoque = dados.estoque || [];
                        cotacoes = dados.cotacoes || [];
                        pedidos = dados.pedidos || [];
                        
                        salvarDados();
                        atualizarDashboard();
                        atualizarEstoque();
                        atualizarMovimentacoes();
                        atualizarFornecedores();
                        atualizarProdutos();
                        atualizarCotacoes();
                        
                        mostrarNotificacao('Dados importados com sucesso!');
                    }
                } catch (error) {
                    mostrarNotificacao('Erro ao importar dados!', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Definir data atual no formulário de movimentação
    document.getElementById('mov-data').value = new Date().toISOString().split('T')[0];
    
    // Adicionar eventos aos formulários
    document.getElementById('form-movimentacao').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const produtoIndex = parseInt(formData.get('produto'));
        const tipo = formData.get('tipo');
        const quantidade = parseFloat(formData.get('quantidade'));
        const data = formData.get('data');
        const observacao = formData.get('observacao');
        
        if (produtoIndex < 0) {
            mostrarNotificacao('Selecione um produto!', 'error');
            return;
        }
        
        // Registrar movimentação
        const movimentacao = {
            produtoIndex,
            tipo,
            quantidade,
            data,
            observacao,
            timestamp: new Date().toISOString()
        };
        
        movimentacoes.push(movimentacao);
        
        // Atualizar estoque
        let itemEstoque = estoque.find(item => item.produtoIndex === produtoIndex);
        if (!itemEstoque) {
            itemEstoque = {
                produtoIndex,
                quantidade: 0,
                estoqueMinimo: 10, // Valor padrão
                ultimaAtualizacao: new Date().toISOString()
            };
            estoque.push(itemEstoque);
        }
        
        if (tipo === 'entrada') {
            itemEstoque.quantidade += quantidade;
        } else {
            itemEstoque.quantidade -= quantidade;
            if (itemEstoque.quantidade < 0) {
                itemEstoque.quantidade = 0;
            }
        }
        
        itemEstoque.ultimaAtualizacao = new Date().toISOString();
        
        salvarDados();
        atualizarMovimentacoes();
        atualizarEstoque();
        atualizarDashboard();
        hideMovimentacaoForm();
        mostrarNotificacao('Movimentação registrada com sucesso!');
    });

    document.getElementById('form-fornecedor').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const index = parseInt(formData.get('index'));
        const fornecedor = {
            nome: formData.get('nome'),
            razaosocial: formData.get('razaosocial'),
            cnpj: formData.get('cnpj'),
            contato: formData.get('contato')
        };
        
        if (index >= 0) {
            fornecedores[index] = fornecedor;
            mostrarNotificacao('Fornecedor atualizado com sucesso!');
        } else {
            fornecedores.push(fornecedor);
            mostrarNotificacao('Fornecedor adicionado com sucesso!');
        }
        
        salvarDados();
        atualizarFornecedores();
        hideFornecedorForm();
    });

    document.getElementById('form-produto').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const index = parseInt(formData.get('index'));
        const produto = {
            nome: formData.get('nome'),
            codigo: formData.get('codigo'),
            categoria: formData.get('categoria'),
            unidade: formData.get('unidade')
        };
        
        if (index >= 0) {
            produtos[index] = produto;
            mostrarNotificacao('Produto atualizado com sucesso!');
        } else {
            produtos.push(produto);
            mostrarNotificacao('Produto adicionado com sucesso!');
        }
        
        salvarDados();
        atualizarProdutos();
        atualizarSelectProdutos();
        atualizarDashboard();
        hideProdutoForm();
    });
    
    // Inicializar dados
    atualizarDashboard();
    atualizarEstoque();
    atualizarMovimentacoes();
    atualizarFornecedores();
    atualizarProdutos();
    atualizarSelectProdutos();
    
    // Adicionar alguns dados de exemplo se não houver dados
    if (produtos.length === 0) {
        produtos = [
            { nome: 'Tinta Branca', codigo: 'T001', categoria: 'Tintas', unidade: 'Galão' },
            { nome: 'Verniz Brilhante', codigo: 'V001', categoria: 'Vernizes', unidade: 'Litros' }
        ];
        estoque = [
            { produtoIndex: 0, quantidade: 50, estoqueMinimo: 20, ultimaAtualizacao: new Date().toISOString() },
            { produtoIndex: 1, quantidade: 5, estoqueMinimo: 10, ultimaAtualizacao: new Date().toISOString() }
        ];
        salvarDados();
        atualizarDashboard();
        atualizarEstoque();
        atualizarProdutos();
        atualizarSelectProdutos();
    }
});

