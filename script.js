// Sistema de Gestão JM de Compras - JavaScript Completo

// Estrutura de dados
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
let cotacoes = JSON.parse(localStorage.getItem('cotacoes')) || [];
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

// Funções para toggle dos campos "Outros"
function toggleOutrosRamoFornecedor() {
    const ramo = document.getElementById('fornecedor-ramo').value;
    const container = document.getElementById('outros-ramo-fornecedor-container');
    container.style.display = ramo === 'outros' ? 'block' : 'none';
}

function toggleOutrosRamoProduto() {
    const ramo = document.getElementById('produto-ramo').value;
    const container = document.getElementById('outros-ramo-produto-container');
    container.style.display = ramo === 'outros' ? 'block' : 'none';
}

function toggleOutrosUnidadeEntrada() {
    const unidade = document.getElementById('produto-unidade-entrada').value;
    const container = document.getElementById('outros-unidade-entrada-container');
    container.style.display = unidade === 'outros' ? 'block' : 'none';
}

function toggleOutrosUnidadeEstoque() {
    const unidade = document.getElementById('produto-unidade-estoque').value;
    const container = document.getElementById('outros-unidade-estoque-container');
    container.style.display = unidade === 'outros' ? 'block' : 'none';
}

// Função para salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
    localStorage.setItem('estoque', JSON.stringify(estoque));
    localStorage.setItem('cotacoes', JSON.stringify(cotacoes));
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
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
    
    // Esconder containers "outros" inicialmente
    document.getElementById('outros-ramo-fornecedor-container').style.display = 'none';
    
    if (index >= 0 && fornecedores[index]) {
        const fornecedor = fornecedores[index];
        form.querySelector('[name="index"]').value = index;
        form.querySelector('[name="nome"]').value = fornecedor.nome;
        form.querySelector('[name="razaosocial"]').value = fornecedor.razaosocial || '';
        form.querySelector('[name="cnpj"]').value = fornecedor.cnpj || '';
        form.querySelector('[name="contato"]').value = fornecedor.contato;
        form.querySelector('[name="email"]').value = fornecedor.email || '';
        form.querySelector('[name="ramo"]').value = fornecedor.ramo || '';
        form.querySelector('[name="setor"]').value = fornecedor.setor || '';
        
        // Mostrar campo "outros" se necessário
        if (fornecedor.ramo === 'outros') {
            document.getElementById('outros-ramo-fornecedor-container').style.display = 'block';
            form.querySelector('[name="outrosRamo"]').value = fornecedor.outrosRamo || '';
        }
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
    
    // Esconder containers "outros" inicialmente
    document.getElementById('outros-ramo-produto-container').style.display = 'none';
    document.getElementById('outros-unidade-entrada-container').style.display = 'none';
    document.getElementById('outros-unidade-estoque-container').style.display = 'none';
    
    if (index >= 0 && produtos[index]) {
        const produto = produtos[index];
        form.querySelector('[name="index"]').value = index;
        form.querySelector('[name="nome"]').value = produto.nome;
        form.querySelector('[name="codigoFornecedor"]').value = produto.codigoFornecedor || '';
        form.querySelector('[name="codigoInterno"]').value = produto.codigoInterno;
        form.querySelector('[name="fornecedor"]').value = produto.fornecedor || '';
        form.querySelector('[name="ramo"]').value = produto.ramo || '';
        form.querySelector('[name="unidadeEntrada"]').value = produto.unidadeEntrada || '';
        form.querySelector('[name="unidadeEstoque"]').value = produto.unidadeEstoque || '';
        
        // Mostrar campos "outros" se necessário
        if (produto.ramo === 'outros') {
            document.getElementById('outros-ramo-produto-container').style.display = 'block';
            form.querySelector('[name="outrosRamo"]').value = produto.outrosRamo || '';
        }
        if (produto.unidadeEntrada === 'outros') {
            document.getElementById('outros-unidade-entrada-container').style.display = 'block';
            form.querySelector('[name="outrosUnidadeEntrada"]').value = produto.outrosUnidadeEntrada || '';
        }
        if (produto.unidadeEstoque === 'outros') {
            document.getElementById('outros-unidade-estoque-container').style.display = 'block';
            form.querySelector('[name="outrosUnidadeEstoque"]').value = produto.outrosUnidadeEstoque || '';
        }
    } else {
        form.querySelector('[name="index"]').value = -1;
    }
    
    atualizarSelectFornecedores('produto-fornecedor');
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
        option.textContent = `${produto.nome} (${produto.codigoInterno || produto.codigoFornecedor || 'N/A'})`;
        select.appendChild(option);
    });
}

// Função para atualizar select de fornecedores
function atualizarSelectFornecedores(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione um fornecedor</option>';
    
    fornecedores.forEach((fornecedor, index) => {
        const option = document.createElement('option');
        option.value = fornecedor.nome;
        option.textContent = fornecedor.nome;
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
            <td>${produto.ramo || '-'}</td>
            <td>${item.quantidade} ${produto.unidadeEstoque || produto.unidadeEntrada || 'un'}</td>
            <td>${item.estoqueMinimo} ${produto.unidadeEstoque || produto.unidadeEntrada || 'un'}</td>
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
            <td><span class="status-badge ${mov.tipo === 'entrada' ? 'status-ok' : mov.tipo === 'espera' ? 'status-low' : 'status-critical'}">${mov.tipo.toUpperCase()}</span></td>
            <td>${mov.quantidade} ${produto.unidadeEstoque || produto.unidadeEntrada || 'un'}</td>
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
            <td>${fornecedor.ramo || '-'}</td>
            <td>${fornecedor.setor || '-'}</td>
            <td>${fornecedor.contato}</td>
            <td>${fornecedor.email || '-'}</td>
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
            <td>${produto.codigoFornecedor || '-'}</td>
            <td>${produto.codigoInterno || '-'}</td>
            <td>${produto.fornecedor || '-'}</td>
            <td>${produto.ramo || '-'}</td>
            <td>${produto.unidadeEntrada || '-'}</td>
            <td>${produto.unidadeEstoque || '-'}</td>
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

// Função para atualizar lista de cotações
function atualizarCotacoes() {
    const container = document.getElementById('cotacoes-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    cotacoes.forEach((cotacao, index) => {
        const card = document.createElement('div');
        card.className = 'cotacao-card';
        card.innerHTML = `
            <h3>${cotacao.nome}</h3>
            <p><strong>Data:</strong> ${new Date(cotacao.data).toLocaleDateString('pt-BR')}</p>
            ${cotacao.validade ? `<p><strong>Validade:</strong> ${new Date(cotacao.validade).toLocaleDateString('pt-BR')}</p>` : ''}
            ${cotacao.fornecedor ? `<p><strong>Fornecedor:</strong> ${cotacao.fornecedor}</p>` : ''}
            <div class="flex justify-between items-center mt-4">
                <button class="btn btn-edit" onclick="editarCotacao(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-delete" onclick="excluirCotacao(${index})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funções para cotações
function showCotacaoForm(index = -1) {
    document.getElementById('cotacao-form').style.display = 'block';
    const form = document.getElementById('form-cotacao');
    form.reset();
    
    if (index >= 0 && cotacoes[index]) {
        const cotacao = cotacoes[index];
        form.querySelector('[name="index"]').value = index;
        form.querySelector('[name="nome"]').value = cotacao.nome;
        form.querySelector('[name="fornecedor"]').value = cotacao.fornecedor || '';
        form.querySelector('[name="data"]').value = cotacao.data;
        form.querySelector('[name="validade"]').value = cotacao.validade || '';
    } else {
        form.querySelector('[name="index"]').value = -1;
        form.querySelector('[name="data"]').value = new Date().toISOString().split('T')[0];
    }
    
    atualizarSelectFornecedores('cotacao-fornecedor');
}

function hideCotacaoForm() {
    document.getElementById('cotacao-form').style.display = 'none';
    document.getElementById('form-cotacao').reset();
}

function editarCotacao(index) {
    showCotacaoForm(index);
}

function excluirCotacao(index) {
    if (confirm('Tem certeza que deseja excluir esta cotação?')) {
        cotacoes.splice(index, 1);
        salvarDados();
        atualizarCotacoes();
        mostrarNotificacao('Cotação excluída com sucesso!');
    }
}

// Funções para relatórios
function showRelatorioGeral() {
    document.getElementById('relatorio-modal').style.display = 'flex';
    atualizarRelatorio();
}

function hideRelatorioGeral() {
    document.getElementById('relatorio-modal').style.display = 'none';
}

function mostrarTabRelatorio(tabName) {
    // Remover classe active de todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-conteudo').forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active na tab selecionada
    document.querySelector(`[onclick="mostrarTabRelatorio('${tabName}')"]`).classList.add('active');
    document.getElementById(`conteudo-${tabName}`).classList.add('active');
}

function atualizarRelatorio() {
    const periodo = document.getElementById('filtro-periodo').value;
    const dataInicio = document.getElementById('data-inicio');
    const dataFim = document.getElementById('data-fim');
    const datasPersonalizadas = document.getElementById('datas-personalizadas');
    const dataFimContainer = document.getElementById('data-fim-container');
    
    // Mostrar/ocultar campos de data personalizada
    if (periodo === 'personalizado') {
        datasPersonalizadas.style.display = 'block';
        dataFimContainer.style.display = 'block';
    } else {
        datasPersonalizadas.style.display = 'none';
        dataFimContainer.style.display = 'none';
    }
    
    // Filtrar movimentações
    const movimentacoesFiltradas = filtrarMovimentacoesPorPeriodo(periodo, dataInicio.value, dataFim.value);
    
    // Atualizar tabela de movimentações
    const tbody = document.getElementById('relatorio-movimentacoes');
    tbody.innerHTML = '';
    
    movimentacoesFiltradas.forEach(mov => {
        const produto = produtos[mov.produtoIndex];
        if (!produto) return;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(mov.data).toLocaleDateString('pt-BR')}</td>
            <td>${produto.nome}</td>
            <td>${mov.tipo.toUpperCase()}</td>
            <td>${mov.quantidade} ${produto.unidadeEstoque || produto.unidadeEntrada || 'un'}</td>
            <td>${mov.observacao || '-'}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Atualizar custos por produto
    atualizarCustosPorProduto();
    
    // Atualizar custos por categoria
    atualizarCustosPorCategoria();
}

function filtrarMovimentacoesPorPeriodo(periodo, dataInicio, dataFim) {
    const hoje = new Date();
    let dataLimite;
    
    switch(periodo) {
        case 'semana':
            dataLimite = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'mes':
            dataLimite = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case 'personalizado':
            if (dataInicio && dataFim) {
                return movimentacoes.filter(mov => {
                    const dataMov = new Date(mov.data);
                    const inicio = new Date(dataInicio);
                    const fim = new Date(dataFim);
                    return dataMov >= inicio && dataMov <= fim;
                });
            }
            return movimentacoes;
        default:
            return movimentacoes;
    }
    
    return movimentacoes.filter(mov => new Date(mov.data) >= dataLimite);
}

function atualizarCustosPorProduto() {
    const tbody = document.getElementById('relatorio-custos');
    tbody.innerHTML = '';
    
    // Agrupar movimentações por produto
    const custosPorProduto = {};
    
    movimentacoes.forEach(mov => {
        const produto = produtos[mov.produtoIndex];
        if (!produto) return;
        
        if (!custosPorProduto[produto.nome]) {
            custosPorProduto[produto.nome] = {
                produto: produto,
                totalMovimentado: 0,
                custoEstimado: 0
            };
        }
        
        custosPorProduto[produto.nome].totalMovimentado += mov.quantidade;
        // Custo estimado baseado em um valor fictício (em produção, você teria preços reais)
        custosPorProduto[produto.nome].custoEstimado += mov.quantidade * 10; // R$ 10 por unidade
    });
    
    Object.values(custosPorProduto).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.produto.nome}</td>
            <td>${item.produto.ramo || '-'}</td>
            <td>${item.totalMovimentado} ${item.produto.unidadeEstoque || item.produto.unidadeEntrada || 'un'}</td>
            <td>R$ ${item.custoEstimado.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

function atualizarCustosPorCategoria() {
    const tbody = document.getElementById('relatorio-categorias');
    tbody.innerHTML = '';
    
    // Agrupar por categoria/ramo
    const custosPorCategoria = {};
    
    produtos.forEach(produto => {
        const ramo = produto.ramo || 'Sem Categoria';
        
        if (!custosPorCategoria[ramo]) {
            custosPorCategoria[ramo] = {
                ramo: ramo,
                totalProdutos: 0,
                totalMovimentado: 0,
                custoTotal: 0
            };
        }
        
        custosPorCategoria[ramo].totalProdutos++;
        
        // Calcular movimentações para este produto
        const movimentacoesProduto = movimentacoes.filter(mov => mov.produtoIndex === produtos.indexOf(produto));
        movimentacoesProduto.forEach(mov => {
            custosPorCategoria[ramo].totalMovimentado += mov.quantidade;
            custosPorCategoria[ramo].custoTotal += mov.quantidade * 10; // R$ 10 por unidade
        });
    });
    
    Object.values(custosPorCategoria).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.ramo}</td>
            <td>${item.totalProdutos}</td>
            <td>${item.totalMovimentado}</td>
            <td>R$ ${item.custoTotal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Funções para pedidos e cotações
function adicionarAoPedido() {
    const form = document.getElementById('form-produto');
    const formData = new FormData(form);
    
    // Verificar se o formulário está preenchido
    if (!formData.get('nome') || !formData.get('codigoInterno')) {
        mostrarNotificacao('Preencha os campos obrigatórios primeiro!', 'error');
        return;
    }
    
    // Criar pedido com número baseado na data
    const hoje = new Date();
    const numeroPedido = `PED-${hoje.getFullYear()}${String(hoje.getMonth() + 1).padStart(2, '0')}${String(hoje.getDate()).padStart(2, '0')}-${String(pedidos.length + 1).padStart(3, '0')}`;
    
    const pedido = {
        numero: numeroPedido,
        data: hoje.toISOString(),
        produtos: [{
            produtoIndex: produtos.length, // Será o próximo produto a ser adicionado
            quantidade: 1,
            valorUnitario: 0
        }],
        status: 'pendente'
    };
    
    pedidos.push(pedido);
    salvarDados();
    
    mostrarNotificacao(`Produto adicionado ao pedido ${numeroPedido}!`, 'success');
}

function adicionarACotacao() {
    const form = document.getElementById('form-produto');
    const formData = new FormData(form);
    
    // Verificar se o formulário está preenchido
    if (!formData.get('nome') || !formData.get('codigoInterno')) {
        mostrarNotificacao('Preencha os campos obrigatórios primeiro!', 'error');
        return;
    }
    
    // Criar cotação
    const cotacao = {
        nome: `Cotação - ${formData.get('nome')}`,
        data: new Date().toISOString(),
        produtos: [{
            produtoIndex: produtos.length, // Será o próximo produto a ser adicionado
            quantidade: 1,
            valorUnitario: 0
        }],
        fornecedor: formData.get('fornecedor') || ''
    };
    
    cotacoes.push(cotacao);
    salvarDados();
    atualizarCotacoes();
    
    mostrarNotificacao('Produto adicionado à cotação!', 'success');
}

function adicionarProdutoCotacaoAPedido(cotacaoIndex, produtoIndex) {
    const cotacao = cotacoes[cotacaoIndex];
    if (!cotacao || !cotacao.produtos[produtoIndex]) {
        mostrarNotificacao('Produto não encontrado na cotação!', 'error');
        return;
    }
    
    const produtoCotacao = cotacao.produtos[produtoIndex];
    const produto = produtos[produtoCotacao.produtoIndex];
    
    // Criar pedido com número baseado na data
    const hoje = new Date();
    const numeroPedido = `PED-${hoje.getFullYear()}${String(hoje.getMonth() + 1).padStart(2, '0')}${String(hoje.getDate()).padStart(2, '0')}-${String(pedidos.length + 1).padStart(3, '0')}`;
    
    const pedido = {
        numero: numeroPedido,
        data: hoje.toISOString(),
        produtos: [{
            produtoIndex: produtoCotacao.produtoIndex,
            quantidade: produtoCotacao.quantidade,
            valorUnitario: produtoCotacao.valorUnitario
        }],
        status: 'pendente'
    };
    
    pedidos.push(pedido);
    salvarDados();
    
    mostrarNotificacao(`Produto "${produto.nome}" adicionado ao pedido ${numeroPedido}!`, 'success');
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

// Funções para envio de cotações por e-mail
function mostrarModalEnvioCotacao() {
    document.getElementById('envio-cotacao-modal').style.display = 'flex';
    carregarCotacoesParaEnvio();
    carregarFornecedoresParaEnvio();
}

function hideModalEnvioCotacao() {
    document.getElementById('envio-cotacao-modal').style.display = 'none';
}

function carregarCotacoesParaEnvio() {
    const select = document.getElementById('cotacao-selecionada');
    select.innerHTML = '<option value="">Selecione uma cotação</option>';
    
    cotacoes.forEach((cotacao, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${cotacao.nome} - ${new Date(cotacao.data).toLocaleDateString('pt-BR')}`;
        select.appendChild(option);
    });
}

function carregarFornecedoresParaEnvio() {
    const container = document.getElementById('lista-fornecedores-email');
    container.innerHTML = '';
    
    fornecedores.forEach((fornecedor, index) => {
        if (fornecedor.email) {
            const div = document.createElement('div');
            div.className = 'fornecedor-checkbox';
            div.innerHTML = `
                <input type="checkbox" id="fornecedor-${index}" value="${fornecedor.email}" />
                <label for="fornecedor-${index}">
                    <div><strong>${fornecedor.nome}</strong></div>
                    <div class="fornecedor-info">${fornecedor.email} - ${fornecedor.ramo || 'N/A'}</div>
                </label>
            `;
            container.appendChild(div);
        }
    });
}

function selecionarTodosFornecedores() {
    const checkboxes = document.querySelectorAll('#lista-fornecedores-email input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function atualizarDetalhesCotacao() {
    const cotacaoIndex = document.getElementById('cotacao-selecionada').value;
    if (cotacaoIndex !== '') {
        const cotacao = cotacoes[cotacaoIndex];
        // Aqui você pode adicionar mais detalhes da cotação se necessário
    }
}

function enviarCotacaoPorEmail() {
    const cotacaoIndex = document.getElementById('cotacao-selecionada').value;
    const assunto = document.getElementById('assunto-email').value;
    const mensagem = document.getElementById('mensagem-email').value;
    
    if (cotacaoIndex === '') {
        mostrarNotificacao('Selecione uma cotação!', 'error');
        return;
    }
    
    const emailsSelecionados = [];
    const checkboxes = document.querySelectorAll('#lista-fornecedores-email input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        emailsSelecionados.push(checkbox.value);
    });
    
    if (emailsSelecionados.length === 0) {
        mostrarNotificacao('Selecione pelo menos um fornecedor!', 'error');
        return;
    }
    
    const cotacao = cotacoes[cotacaoIndex];
    
    // Criar o corpo do e-mail com os detalhes da cotação
    let corpoEmail = mensagem + '\n\n';
    corpoEmail += 'DETALHES DA COTAÇÃO:\n';
    corpoEmail += `Nome: ${cotacao.nome}\n`;
    corpoEmail += `Data: ${new Date(cotacao.data).toLocaleDateString('pt-BR')}\n`;
    if (cotacao.validade) {
        corpoEmail += `Validade: ${new Date(cotacao.validade).toLocaleDateString('pt-BR')}\n`;
    }
    corpoEmail += '\nPRODUTOS:\n';
    
    if (cotacao.produtos && cotacao.produtos.length > 0) {
        cotacao.produtos.forEach((produto, index) => {
            const produtoInfo = produtos[produto.produtoIndex];
            if (produtoInfo) {
                corpoEmail += `${index + 1}. ${produtoInfo.nome}\n`;
                corpoEmail += `   Quantidade: ${produto.quantidade || 0}\n`;
                corpoEmail += `   Valor Unitário: R$ ${(produto.valorUnitario || 0).toFixed(2)}\n`;
                corpoEmail += `   Total: R$ ${((produto.quantidade || 0) * (produto.valorUnitario || 0)).toFixed(2)}\n\n`;
            }
        });
    }
    
    // Simular envio de e-mails (em produção, você usaria um serviço de e-mail)
    emailsSelecionados.forEach(email => {
        console.log(`Enviando e-mail para: ${email}`);
        console.log(`Assunto: ${assunto}`);
        console.log(`Corpo: ${corpoEmail}`);
        
        // Aqui você pode integrar com um serviço de e-mail como:
        // - EmailJS
        // - SendGrid
        // - AWS SES
        // - Ou usar mailto: para abrir o cliente de e-mail padrão
    });
    
    // Abrir cliente de e-mail padrão com os dados preenchidos
    const mailtoLink = `mailto:${emailsSelecionados.join(',')}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;
    window.open(mailtoLink);
    
    mostrarNotificacao(`E-mails preparados para ${emailsSelecionados.length} fornecedor(es)!`, 'success');
    hideModalEnvioCotacao();
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
        
        // Processar campo "outros" do ramo
        let ramo = formData.get('ramo');
        if (ramo === 'outros') {
            ramo = formData.get('outrosRamo');
        }
        
        const fornecedor = {
            nome: formData.get('nome'),
            razaosocial: formData.get('razaosocial'),
            cnpj: formData.get('cnpj'),
            contato: formData.get('contato'),
            email: formData.get('email'),
            ramo: ramo,
            setor: formData.get('setor')
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
        
        // Processar campos "outros"
        let ramo = formData.get('ramo');
        if (ramo === 'outros') {
            ramo = formData.get('outrosRamo');
        }
        
        let unidadeEntrada = formData.get('unidadeEntrada');
        if (unidadeEntrada === 'outros') {
            unidadeEntrada = formData.get('outrosUnidadeEntrada');
        }
        
        let unidadeEstoque = formData.get('unidadeEstoque');
        if (unidadeEstoque === 'outros') {
            unidadeEstoque = formData.get('outrosUnidadeEstoque');
        }
        
        const produto = {
            nome: formData.get('nome'),
            codigoFornecedor: formData.get('codigoFornecedor'),
            codigoInterno: formData.get('codigoInterno'),
            fornecedor: formData.get('fornecedor'),
            ramo: ramo,
            unidadeEntrada: unidadeEntrada,
            unidadeEstoque: unidadeEstoque
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

    document.getElementById('form-cotacao').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const index = parseInt(formData.get('index'));
        
        const cotacao = {
            nome: formData.get('nome'),
            fornecedor: formData.get('fornecedor'),
            data: formData.get('data'),
            validade: formData.get('validade') || null,
            produtos: []
        };
        
        if (index >= 0) {
            cotacoes[index] = cotacao;
            mostrarNotificacao('Cotação atualizada com sucesso!');
        } else {
            cotacoes.push(cotacao);
            mostrarNotificacao('Cotação criada com sucesso!');
        }
        
        salvarDados();
        atualizarCotacoes();
        hideCotacaoForm();
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
            { nome: 'Tinta Branca', codigoInterno: 'T001', ramo: 'Tintas', unidadeEntrada: 'Galão', unidadeEstoque: 'Galão' },
            { nome: 'Verniz Brilhante', codigoInterno: 'V001', ramo: 'Tintas', unidadeEntrada: 'Litros', unidadeEstoque: 'Litros' }
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
     
     // Fechar modais ao clicar fora
     document.getElementById('relatorio-modal').addEventListener('click', (e) => {
         if (e.target.id === 'relatorio-modal') {
             hideRelatorioGeral();
         }
     });
     
     document.getElementById('envio-cotacao-modal').addEventListener('click', (e) => {
         if (e.target.id === 'envio-cotacao-modal') {
             hideModalEnvioCotacao();
         }
     });
 });

