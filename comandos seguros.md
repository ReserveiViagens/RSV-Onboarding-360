# comandos seguros

Resumo do estado atual
- Repositório remoto usado: https://github.com/ReserveiViagens/RSV-Onboarding-360.git
- Histórico do `main` foi reescrito e o branch remoto foi sobrescrito (force push).
- Arquivos grandes (*.zip) migrados para Git LFS e objetos LFS enviados.
- Existe a pasta local `arquivos-grandes/` e ela está listada em `.gitignore`.

IMPORTANTE
- Após a reescrita do histórico, todos os colaboradores devem re-clonar ou alinhar o repositório local com cuidado para evitar perda de trabalho.
- Confirme sua cota de Git LFS em GitHub antes de baixar/usar os objetos LFS.

Opção A — Recomendada (re-clonar, mais simples)
Use este fluxo em um terminal PowerShell:

```powershell
git clone https://github.com/ReserveiViagens/RSV-Onboarding-360.git
cd "RSV-Onboarding-360"
# inicializa ganchos LFS localmente
git lfs install
# baixa os objetos LFS associados
git lfs pull
```

Opção B — Preservar trabalho local (sem re-clonar)
Se você tiver trabalho não publicado e quiser preservar:

```powershell
# 1) Cria um branch de backup com seu trabalho atual
git checkout -b backup-wip
git add -A
git commit -m "WIP backup before history rewrite" || Write-Host "Nada novo para commitar"

# 2) Buscar referências remotas atualizadas
git fetch origin

# 3) Alinhar main local ao remoto (ATENÇÃO: sobrescreve main local)
git checkout main
git reset --hard origin/main

# 4) Reaplicar suas mudanças do backup sobre o novo main
git checkout backup-wip
git rebase origin/main
# resolver conflitos, testar
# após resolver e testar, suba o branch de backup
git push -u origin backup-wip
```

Se você tiver modificações não commitadas, antes do reset faça:
```powershell
git stash push -m "before reset"
# depois do rebase:
git stash pop
```

Comandos úteis adicionais
- Ver a URL do remoto atual:
```powershell
git remote -v
```
- Trocar o origin para outro repositório (ex.: se quiser enviar para outro remote):
```powershell
git remote set-url origin https://github.com/ReserveiViagens/ReserveiViagens-RSV-360-Ecosystem.git
```
- Atualizar/hooks LFS (quando necessário):
```powershell
git lfs install
git lfs pull
```

Boas práticas
- Não edite histórico público sem combinar com a equipe.
- Se alguém estiver com commits locais que ainda não foram compartilhados, peça para criar um branch de backup antes de qualquer operação de reset/force-push.
- Use `git lfs ls-files` para listar arquivos rastreados por LFS.

Se quiser, eu adiciono este arquivo diretamente ao repositório como commit. Deseja que eu o commit e faça push (vou usar o branch atual `clean-main`)?
