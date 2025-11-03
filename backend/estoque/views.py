from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login
from django.contrib.auth.models import User, Group
from django.http import HttpResponseForbidden
from .models import Produto
from .forms import FormularioProduto


def _autorizado(usuario):
    """Retorna True se o usuário for staff ou pertencer aos grupos 'gerente' ou 'funcionario'."""
    if not usuario or not usuario.is_authenticated:
        return False
    if usuario.is_staff:
        return True
    return usuario.groups.filter(name__in=['gerente', 'funcionario']).exists()


def painel(request):
    """View do painel de controle de estoque. Redireciona para a tela intermediária
    se o usuário não tiver autorização.
    """
    if not _autorizado(request.user):
        return redirect('/estoque/intermediaria/')

    produtos = Produto.objects.all().order_by('-atualizado_em')
    total = produtos.count()
    baixo_estoque = produtos.filter(quantidade__lt=5).count()
    contexto = {
        'produtos': produtos,
        'total_produtos': total,
        'baixo_estoque': baixo_estoque,
    }
    return render(request, 'estoque/painel.html', contexto)


def produto_criar(request):
    if not _autorizado(request.user):
        return redirect('/estoque/intermediaria/')

    if request.method == 'POST':
        formulario = FormularioProduto(request.POST)
        if formulario.is_valid():
            formulario.save()
            return redirect('estoque:painel')
    else:
        formulario = FormularioProduto()
    return render(request, 'estoque/produto_form.html', {'formulario': formulario})


def produto_editar(request, pk):
    if not _autorizado(request.user):
        return redirect('/estoque/intermediaria/')

    produto = get_object_or_404(Produto, pk=pk)
    if request.method == 'POST':
        formulario = FormularioProduto(request.POST, instance=produto)
        if formulario.is_valid():
            formulario.save()
            return redirect('estoque:painel')
    else:
        formulario = FormularioProduto(instance=produto)
    return render(request, 'estoque/produto_form.html', {'formulario': formulario, 'produto': produto})


def produto_excluir(request, pk):
    if not _autorizado(request.user):
        return redirect('/estoque/intermediaria/')

    produto = get_object_or_404(Produto, pk=pk)
    if request.method == 'POST':
        produto.delete()
        return redirect('estoque:painel')
    return render(request, 'estoque/produto_confirm_delete.html', {'produto': produto})


def firebase_login(request):
    """Endpoint de login temporário para integração com Firebase (mesma lógica do stub anterior).

    Aceita POST com idToken e role. Para desenvolvimento aceita tokens que comecem com TEST-.
    """
    if request.method != 'POST':
        return HttpResponseForbidden('Use POST para autenticar')

    id_token = request.POST.get('idToken') or request.POST.get('id_token')
    role = (request.POST.get('role') or '').lower()

    if not id_token or not role:
        return HttpResponseForbidden('idToken e role são obrigatórios (para testes)')

    uid = None
    if id_token.startswith('TEST-') or id_token.startswith('FIREBASE-'):
        uid = id_token.split('-', 1)[1]
    else:
        try:
            import firebase_admin
            from firebase_admin import auth as firebase_auth
            decoded = firebase_auth.verify_id_token(id_token)
            uid = decoded.get('uid') or decoded.get('sub')
            if not role:
                role = decoded.get('role', '')
        except Exception:
            return HttpResponseForbidden('Token inválido. Em desenvolvimento use TEST-<uid> ou configure firebase_admin.')

    if not uid:
        return HttpResponseForbidden('Não foi possível determinar UID')

    usuario, criado = User.objects.get_or_create(username=uid)
    if role in ['manager', 'gerente']:
        grupo, _ = Group.objects.get_or_create(name='gerente')
        usuario.groups.add(grupo)
        usuario.is_staff = True
        usuario.save()
    elif role in ['employee', 'funcionario']:
        grupo, _ = Group.objects.get_or_create(name='funcionario')
        usuario.groups.add(grupo)
        usuario.save()
    else:
        return HttpResponseForbidden('Role desconhecido')

    usuario.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, usuario)
    return redirect('/estoque/')


def intermediaria(request):
    """Tela intermediária (placeholder) para orientar a integração Firebase"""
    return render(request, 'estoque/intermediaria.html')
