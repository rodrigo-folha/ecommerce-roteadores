package br.unitins.tp1.roteadores.service.pedido;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import br.unitins.tp1.roteadores.dto.pagamento.BoletoResponseDTO;
import br.unitins.tp1.roteadores.dto.pagamento.PixResponseDTO;
import br.unitins.tp1.roteadores.dto.pedido.ItemPedidoRequestDTO;
import br.unitins.tp1.roteadores.dto.pedido.PedidoRequestDTO;
import br.unitins.tp1.roteadores.dto.pedido.StatusPedidoRequestDTO;
import br.unitins.tp1.roteadores.model.endereco.Endereco;
import br.unitins.tp1.roteadores.model.pagamento.Boleto;
import br.unitins.tp1.roteadores.model.pagamento.Cartao;
import br.unitins.tp1.roteadores.model.pagamento.CartaoPagamento;
import br.unitins.tp1.roteadores.model.pagamento.Pix;
import br.unitins.tp1.roteadores.model.pedido.CupomDesconto;
import br.unitins.tp1.roteadores.model.pedido.EnderecoEntrega;
import br.unitins.tp1.roteadores.model.pedido.ItemPedido;
import br.unitins.tp1.roteadores.model.pedido.Lote;
import br.unitins.tp1.roteadores.model.pedido.Pedido;
import br.unitins.tp1.roteadores.model.pedido.SituacaoPedido;
import br.unitins.tp1.roteadores.model.pedido.StatusPedido;
import br.unitins.tp1.roteadores.model.usuario.Cliente;
import br.unitins.tp1.roteadores.repository.CartaoPagamentoRepository;
import br.unitins.tp1.roteadores.repository.PagamentoRepository;
import br.unitins.tp1.roteadores.repository.PedidoRepository;
import br.unitins.tp1.roteadores.service.CartaoService;
import br.unitins.tp1.roteadores.service.endereco.CidadeService;
import br.unitins.tp1.roteadores.service.usuario.ClienteService;
import br.unitins.tp1.roteadores.validation.ValidationException;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PedidoServiceImpl implements PedidoService {

    @Inject
    public PedidoRepository pedidoRepository;

    @Inject
    public ClienteService clienteService;

    @Inject
    public LoteService loteService;

    @Inject
    public CidadeService cidadeService;

    @Inject
    public CartaoService cartaoService;

    @Inject
    public CartaoPagamentoRepository cartaoPagamentoRepository;

    @Inject
    public PagamentoRepository pagamentoRepository;

    @Inject
    public CupomDescontoService cupomDescontoService;

    @Override
    public Pedido findById(String email, Long id) {
        Cliente cliente = clienteService.findByUsuario(email);
        if (cliente == null)
            throw new ValidationException("email", "cliente nao encontrado");
        
        if (pedidoRepository.findById(id) == null)
            throw new ValidationException("id", "pedido nao encontrado");

        return pedidoRepository.findById(id);
    }

    @Override
    public Pedido findById(Long id) {
        if (pedidoRepository.findById(id) == null)
            throw new ValidationException("id", "id nao encontrado");
            
        return pedidoRepository.findById(id);
    }

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll().list();
    }

    @Override
    public List<Pedido> findByEmail(String email) {
        return pedidoRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public Pedido create(PedidoRequestDTO dto, String email) {
        if (dto == null)
            throw new ValidationException("dto", "Informe os campos necessarios");

        Pedido pedido = new Pedido();
        pedido.setData(LocalDateTime.now());
        pedido.setCliente(clienteService.findByUsuario(email));
        pedido.setListaItemPedido(new ArrayList<ItemPedido>());

        Double desconto = 0.0;

        for (ItemPedidoRequestDTO itemDTO : dto.listaItemPedido()) {
            Lote lote = loteService.findByIdRoteador(itemDTO.idProduto());
            if (lote == null)
            throw new ValidationException("idProduto", "Por favor informe o id de algum produto valido");
            
            int qtdeTotalEstoque = calcularQuantidadeEstoque(itemDTO.idProduto());
            if (qtdeTotalEstoque < itemDTO.quantidade())
            throw new ValidationException("quantidade", "quantidade em estoque insuficiente");
            
            int qtdeRestante = itemDTO.quantidade();
            
            while (qtdeRestante > 0) {
                ItemPedido item = new ItemPedido();
                item.setPreco(0.0);
                lote = loteService.findByIdRoteador(itemDTO.idProduto());

                int qtdeConsumida = Math.min(lote.getEstoque(), qtdeRestante);
                lote.setEstoque(lote.getEstoque() - qtdeConsumida);
                item.setPreco(item.getPreco() + (qtdeConsumida * lote.getRoteador().getPreco()));

                qtdeRestante -= qtdeConsumida;
                item.setQuantidade(itemDTO.quantidade());
                item.setLote(lote);
                item.setPreco(lote.getRoteador().getPreco());
                item.setQuantidade(qtdeConsumida);
    
                pedido.getListaItemPedido().add(item);
            }
        }

        String cupom = dto.cupomDesconto();
        if (cupom != null) {
            verificarExistenciaCupom(cupom);
            verificarValidadeCupom(cupom);
            desconto = valorDesconto(cupom);
        }

        pedido.setEnderecoEntrega(getEnderecoEntrega(pedido.getCliente(), dto.idEndereco()));

        if (pedido.getEnderecoEntrega() == null)
            throw new ValidationException("idEndereco", "endereco nao encontrado");

        // eh importante validar se o total enviado via dto eh o mesmo gerado pelos
        // produtos

        double valorTotal = Math.round(calcularTotal(pedido) * (1 - desconto) * 100.0) / 100.0;

        if (valorTotal != dto.valorTotal())
            throw new ValidationException("valorTotal", "O valor total nao confere");

        pedido.setValorTotal(valorTotal);
    
        switch(dto.tipoPagamento()) {
            case "pix":
                gerarCodigoPix(pedido);
                gerarStatusPedido(pedido);
                break;
            case "boleto":
                gerarBoleto(pedido);
                gerarStatusPedido(pedido);
                break;
            case "cartao":
                gerarStatusPedido(pedido);
                registrarPagamentoCartao(pedido, dto.idCartao());
                break;
            default:
                throw new ValidationException("tipoPagamento", "Escolha um tipo de pagamento valido");
        }

        pedidoRepository.persist(pedido);
        return pedido;
    }

    private void gerarStatusPedido(Pedido pedido) {
        pedido.setStatusPedido(new ArrayList<>());
        StatusPedido statusPedido = new StatusPedido();
        statusPedido.setDataAtualizacao(LocalDateTime.now());
        statusPedido.setSituacaoPedido(SituacaoPedido.AGUARDANDO_PAGAMENTO);
        pedido.getStatusPedido().add(statusPedido);
    }

    private Double calcularTotal(Pedido pedido) {
        return pedido.getListaItemPedido()
                .stream()
                .mapToDouble(a -> a.getPreco() * a.getQuantidade())
                .sum();
    }

    private EnderecoEntrega getEnderecoEntrega(Cliente cliente, Long idEndereco) {
        Endereco endereco = cliente.getUsuario().getEnderecos()
            .stream()
            .filter(e -> e.getId().equals(idEndereco))
            .findFirst()
            .orElseThrow(() -> new ValidationException("idEndereco", "Endereco nao encontrado"));

        EnderecoEntrega enderecoEntrega = new EnderecoEntrega();
        enderecoEntrega.setLogradouro(endereco.getLogradouro());
        enderecoEntrega.setBairro(endereco.getBairro());
        enderecoEntrega.setNumero(endereco.getNumero());
        enderecoEntrega.setComplemento(endereco.getComplemento());
        enderecoEntrega.setCep(endereco.getCep());
        enderecoEntrega.setCidade(endereco.getCidade());

        return enderecoEntrega;
    }

    private boolean verificarValidadeCupom(String cupom) {
        CupomDesconto cupomDesconto = cupomDescontoService.findByCodigo(cupom);
        boolean isValido = LocalDate.now().isBefore(cupomDesconto.getValidade());

        if (!isValido)
            throw new ValidationException("cupom", "Cupom expirado!");

        return isValido;
    }

    private boolean verificarExistenciaCupom(String cupom) {
        if (cupomDescontoService.findByCodigo(cupom) == null)
            throw new ValidationException("cupom", "Cupom invalido!");

        return true;
    }

    private int calcularQuantidadeEstoque(Long idProduto) {
        return loteService.findByIdRoteadorQtdeTotal(idProduto)
                .stream()
                .reduce(0, (subtotal, b) -> subtotal + b.getEstoque(), Integer::sum);
    }

    private Double valorDesconto(String cupom) {
        return cupomDescontoService.findByCodigo(cupom).getPercentualDesconto();
    }

    @Override
    @Transactional
    public BoletoResponseDTO gerarBoleto(Pedido pedido) {

        Boleto boleto = new Boleto();
        boleto.setValor(pedido.getValorTotal());
        boleto.setCodigoBarras(UUID.randomUUID().toString());
        boleto.setValidade(LocalDateTime.now().plus(Duration.ofHours(24)));
        pedido.setPagamento(boleto);

        pagamentoRepository.persist(boleto);

        return BoletoResponseDTO.valueOf(boleto);
    }

    @Override
    @Transactional
    public PixResponseDTO gerarCodigoPix(Pedido pedido) {

        Pix pix = new Pix();
        pix.setValor(pedido.getValorTotal());
        pix.setValidade(LocalDateTime.now().plus(Duration.ofHours(24)));
        pix.setChave(UUID.randomUUID().toString());
        pedido.setPagamento(pix);

        pagamentoRepository.persist(pix);

        return PixResponseDTO.valueOf(pix);
    }

    @Override
    @Transactional
    public void registrarPagamentoBoleto(Long idPedido, Long idBoleto) {
        if (pedidoRepository.findById(idPedido) == null)
            throw new ValidationException("idPedido", "Informe um pedido valido!");
        
        Pedido pedido = pedidoRepository.findById(idPedido);

        if (!(pedidoRepository.findById(idPedido).getPagamento().getId().equals(idBoleto)))
            throw new ValidationException("idPedido", "o boleto nao corresponde ao pedido");
        
        if (pedido.getStatusPedido().stream().map(StatusPedido::getSituacaoPedido).anyMatch(situacao -> situacao == SituacaoPedido.PAGAMENTO_AUTORIZADO))
            throw new ValidationException("pagamento", "Este pedido ja foi pago.");

        if (pagamentoRepository.findByBoleto(idBoleto) == null)
            throw new ValidationException("idBoleto", "Boleto nao cadastrado");
        
        if (pagamentoRepository.findByBoleto(idBoleto).getValidade().isBefore(LocalDateTime.now())) {
            devolverEstoque(idPedido);
            throw new ValidationException("validade", "Data de validade expirada.");
        }
        
        StatusPedido statusPedido = new StatusPedido();
        statusPedido.setDataAtualizacao(LocalDateTime.now());
        statusPedido.setSituacaoPedido(SituacaoPedido.PAGAMENTO_AUTORIZADO);

        pedido.getStatusPedido().add(statusPedido);
    }

    @Override
    @Transactional
    public void registrarPagamentoPix(Long idPedido, Long idPix) {
        if (pedidoRepository.findById(idPedido) == null)
            throw new ValidationException("idPedido", "Informe um pedido valido!");
        
        Pedido pedido = pedidoRepository.findById(idPedido);

        if (!(pedidoRepository.findById(idPedido).getPagamento().getId().equals(idPix)))
            throw new ValidationException("idPedido", "o pix nao corresponde ao pedido");

        if (pedido.getStatusPedido().stream().map(StatusPedido::getSituacaoPedido).anyMatch(situacao -> situacao == SituacaoPedido.PAGAMENTO_AUTORIZADO))
            throw new ValidationException("pagamento", "Este pedido ja foi pago.");

        if (pagamentoRepository.findByPix(idPix) == null)
            throw new ValidationException("idPix", "Pix nao cadastrado");

        if (pagamentoRepository.findByPix(idPix).getValidade().isBefore(LocalDateTime.now())) {
            devolverEstoque(idPedido);
            throw new ValidationException("validade", "Data de validade expirada.");
        }

        StatusPedido statusPedido = new StatusPedido();
        statusPedido.setDataAtualizacao(LocalDateTime.now());
        statusPedido.setSituacaoPedido(SituacaoPedido.PAGAMENTO_AUTORIZADO);

        pedido.getStatusPedido().add(statusPedido);
    }

    @Override
    @Transactional
    public void registrarPagamentoCartao(Pedido pedido, Long idCartao) {
        Cliente cliente = pedido.getCliente();
        String email = cliente.getUsuario().getEmail();

        Cartao cartao = cartaoService.findById(email, idCartao);
        if (cartao == null)
            throw new ValidationException("idCartao", "Cartao nao encontrado");

        CartaoPagamento cartaoPagamento = new CartaoPagamento();

        cartaoPagamento.setTitular(cartao.getTitular());
        cartaoPagamento.setNumero(cartao.getNumero());
        cartaoPagamento.setCvc(cartao.getCvc());
        cartaoPagamento.setDataValidade(cartao.getDataValidade());
        cartaoPagamento.setCpfCartao(cartao.getCpfCartao());
        cartaoPagamento.setModalidadeCartao(cartao.getModalidadeCartao());
        cartaoPagamento.setValor(pedido.getValorTotal());

        pagamentoRepository.persist(cartaoPagamento);

        pedido.setPagamento(cartaoPagamento);

        StatusPedido statusPedido = new StatusPedido();
        statusPedido.setDataAtualizacao(LocalDateTime.now());
        statusPedido.setSituacaoPedido(SituacaoPedido.PAGAMENTO_AUTORIZADO);

        pedido.getStatusPedido().add(statusPedido);
    }

    @Override
    @Transactional
    public void updateStatusPedido(Long idPedido, StatusPedidoRequestDTO statusPedido) {
        if (statusPedido == null)
            throw new ValidationException("statusPedido", "Informe os campos necessarios");
            
        Pedido pedido = pedidoRepository.findById(idPedido);

        pedido.getStatusPedido().add(converterStatusPedido(statusPedido));
    }

    private StatusPedido converterStatusPedido(StatusPedidoRequestDTO statusPedido) {
        StatusPedido status = new StatusPedido();
        status.setDataAtualizacao(LocalDateTime.now());
        status.setSituacaoPedido(statusPedido.situacaoPedido());

        return status;
    }

    @Override
    @Transactional
    public void cancelarPedido(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido);
        if (pedido == null)
            throw new ValidationException("idPedido", "Pedido nao encontrado.");

        if (pedido.getStatusPedido().stream().anyMatch(e -> e.getSituacaoPedido().equals(SituacaoPedido.ENVIADO)))
            throw new ValidationException("Status Pedido", "Nao é possivel cancelar, pois o pedido ja foi enviado");

        if (pedido.getStatusPedido().stream().anyMatch(e -> e.getSituacaoPedido().equals(SituacaoPedido.CANCELADO)))
            throw new ValidationException("Status Pedido", "Nao é possivel cancelar, pois o pedido ja foi cancelado");

        StatusPedido statusPedido = new StatusPedido();
        statusPedido.setDataAtualizacao(LocalDateTime.now());
        statusPedido.setSituacaoPedido(SituacaoPedido.CANCELADO);
        
        pedido.getStatusPedido().add(statusPedido);
        devolverEstoque(idPedido);
        
    }

    @Override
    @Transactional
    public void devolverPedido(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido);
        if (pedido == null)
            throw new ValidationException("idPedido", "Pedido nao encontrado.");

        if (!(pedido.getStatusPedido().stream().anyMatch(e -> e.getSituacaoPedido().equals(SituacaoPedido.ENTREGUE))))
            throw new ValidationException("Status Pedido", "Nao é possivel devolver, pois o pedido ainda não foi entregue");

            if (!(pedido.getStatusPedido().stream().anyMatch(e -> e.getSituacaoPedido().equals(SituacaoPedido.DEVOLVIDO))))
            throw new ValidationException("Status Pedido", "Nao é possivel devolver, pois o pedido ja foi devolvido");

        StatusPedido statusPedido = new StatusPedido();
        statusPedido.setDataAtualizacao(LocalDateTime.now());
        statusPedido.setSituacaoPedido(SituacaoPedido.DEVOLVIDO);
        
        pedido.getStatusPedido().add(statusPedido);
        devolverEstoque(idPedido);
    }

    private void devolverEstoque(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido);
        for (ItemPedido item: pedido.getListaItemPedido()) {
            Lote lote = item.getLote();
            Integer estoque = lote.getEstoque();

            lote.setEstoque(estoque + item.getQuantidade());
        }
    }

    @Transactional
    @Scheduled(every = "2m")
    public void verificarPagamento(){
        List<Pedido> listaPedido = pedidoRepository.findPedidoSemPagamentoNaoCancelado();

        listaPedido.stream()
            .filter(pedido -> pedido.getStatusPedido()
                .stream()
                .anyMatch(status -> 
                    status.getSituacaoPedido() == SituacaoPedido.AGUARDANDO_PAGAMENTO && 
                    status.getDataAtualizacao().plusHours(24).isBefore(LocalDateTime.now())))
                .forEach(pedido -> {
                    StatusPedido novoStatus = new StatusPedido();
                    novoStatus.setDataAtualizacao(LocalDateTime.now());
                    novoStatus.setSituacaoPedido(SituacaoPedido.PAGAMENTO_EXPIRADO);

                    pedido.getStatusPedido().add(novoStatus);
                    devolverEstoque(pedido.getId());
                });
    }

}
