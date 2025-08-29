# 🎯 Guia Prático: Como Usar os Agentes BMAD

## 📋 **Status da Instalação**
✅ BMAD-Method v4.33.1 instalado  
✅ 11 agentes configurados  
✅ Templates e workflows disponíveis  

## 🚀 **Como Usar os Agentes**

### **Método 1: Cursor AI (Recomendado)**
1. Abra o Cursor AI manualmente
2. Abra este projeto (File → Open Folder)
3. Pressione `Ctrl + L` para abrir o chat
4. Use os comandos:

```bash
@bmad-master *help           # Ver todos os comandos
@pm *help                    # Product Manager
@pm *create-prd              # Criar PRD
@architect *help             # Architect
@dev *help                   # Developer
@qa *help                    # QA Tester
@sm *help                    # Scrum Master
@po *help                    # Product Owner
@analyst *help               # Business Analyst
@ux-expert *help             # UX Designer
```

### **Método 2: Templates Manuais**
Use os templates diretamente das pastas:

#### **📁 Templates Disponíveis:**
- `.bmad-core/templates/prd-tmpl.yaml` - Product Requirements Document
- `.bmad-core/templates/architecture-tmpl.yaml` - Arquitetura do Sistema
- `.bmad-core/templates/story-tmpl.yaml` - User Stories
- `.bmad-core/templates/project-brief-tmpl.yaml` - Brief do Projeto

#### **📁 Tarefas (Tasks):**
- `.bmad-core/tasks/create-doc.md` - Criar documentos
- `.bmad-core/tasks/shard-doc.md` - Fragmentar documentos
- `.bmad-core/tasks/review-story.md` - Revisar stories

#### **📁 Checklists:**
- `.bmad-core/checklists/pm-checklist.md` - Checklist PM
- `.bmad-core/checklists/change-checklist.md` - Checklist de mudanças

## 🎯 **Workflow Recomendado para Onion RSV**

### **Fase 1: Planejamento**
1. **Criar PRD** (Product Requirements Document)
2. **Definir Arquitetura** do sistema
3. **Fragmentar documentos** em partes menores

### **Fase 2: Desenvolvimento**
1. **Criar Stories** a partir dos epics
2. **Implementar funcionalidades**
3. **Fazer testes e QA**

### **Fase 3: Magic UI Integration**
1. **Implementar componentes** Magic UI + shadcn/ui
2. **Converter para iOS/Android** se necessário
3. **Otimizar para VPS ICP MAX**

## 🔧 **Comandos Úteis no PowerShell**

```powershell
# Verificar status BMAD
npx bmad-method status

# Listar templates
ls .bmad-core\templates\

# Listar tarefas
ls .bmad-core\tasks\

# Abrir Cursor AI
Start-Process cursor -ArgumentList "."

# Verificar agentes configurados
ls .cursor\rules\*.mdc
```

## 📝 **Próximos Passos**

1. **Tente abrir o Cursor AI manualmente**
2. **Se o Cursor funcionar:** Use os comandos `@agente *comando`
3. **Se não funcionar:** Use os templates manualmente
4. **Comece criando um PRD** para o projeto Onion RSV

## 🆘 **Se Precisar de Ajuda**

- **Discord BMAD:** https://discord.gg/gk8jAdXWmj
- **GitHub Issues:** https://github.com/bmadcode/bmad-method/issues
- **Templates manuais:** Pasta `.bmad-core/templates/`

---

**Última atualização:** $(Get-Date -Format "dd/MM/yyyy HH:mm")