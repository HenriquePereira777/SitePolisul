# Publicar o site na Oracle Cloud (Always Free)

## 1. Criar a VM
Console Oracle → Compute → Instances → Create instance
- Imagem: **Ubuntu 22.04**
- Shape: **VM.Standard.A1.Flex (Ampere/ARM)**, 2 OCPU e 12 GB (cabe no plano gratuito).
  Evite a E2.1.Micro (1 GB): Java + MySQL não rodam bem nela.
- Chave SSH: gere/baixe a chave privada e guarde (ex.: `~/.ssh/oracle-polisul.key`, `chmod 600`).
- Anote o **IP público**. Em "Reserved public IP", reserve-o para não mudar.

## 2. Liberar as portas (dois lugares!)
1. Console: Networking → VCN → Security List → Ingress: adicione TCP **80** e **443** (origem `0.0.0.0/0`). A 22 (SSH) já existe.
2. Na própria VM (as imagens da Oracle bloqueiam via iptables):
```
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80  -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```
**Não** abra as portas 3306/3307/8080: banco e backend ficam só na rede interna do Docker.

## 2b. Se a VM tiver só 1 GB (shape E2.1.Micro)
Crie 4 GB de swap antes de subir qualquer coisa (o build do Java/Node precisa):
```
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
O `docker-compose.prod.yml` já limita a memória do Java e do MySQL. O primeiro build leva vários minutos.

## 3. Instalar o Docker
```
ssh -i ~/.ssh/oracle-polisul.key ubuntu@IP_DA_VM
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu && exit     # saia e entre de novo
```

## 4. Trazer o código
Repositório privado: crie uma deploy key na VM e cadastre em GitHub → Settings → Deploy keys.
```
ssh-keygen -t ed25519 -C polisul-vm -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub        # cole no GitHub
git clone git@github.com:SEU-USUARIO/polisual.git polisual && cd polisual
```

## 5. Criar o `.env` de produção (na VM)
```
nano .env
```
Variáveis (valores novos e fortes, **diferentes** dos de desenvolvimento):
```
MYSQL_ROOT_PASSWORD=...
MYSQL_USER=polisual
MYSQL_PASSWORD=...
JWT_SECRET=...                 # gere com: openssl rand -hex 48
DOMAIN=seudominio.com.br       # sem domínio, deixe :80
CORS_ALLOWED_ORIGINS=https://seudominio.com.br
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_SSL=true
MAIL_STARTTLS=false
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM=...
MAIL_TO=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...             # mín. 8 caracteres
```

## 6. Domínio e HTTPS
No painel do domínio (Registro.br/Hostinger), crie o registro **A** apontando `seudominio.com.br` (e `www`) para o IP da VM.
O Caddy emite o certificado HTTPS sozinho assim que o DNS propagar.

## 7. Subir
```
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs backend | grep -iE "administrador|uploads|Catálogo"
```
Teste: `https://seudominio.com.br` e `https://seudominio.com.br/admin`.

## 8. Atualizar depois
```
cd ~/polisual && git pull && docker compose -f docker-compose.prod.yml up -d --build
```

## 9. Backup diário
```
crontab -e
0 3 * * * /home/ubuntu/polisual/scripts/backup.sh >> /home/ubuntu/backup.log 2>&1
```
Copie de vez em quando a pasta `~/backups` para fora da VM.

## Segurança — checklist
- [ ] Senhas do `.env` de produção novas e fortes
- [ ] Só portas 22, 80 e 443 abertas
- [ ] `JWT_SECRET` aleatório (≥ 64 caracteres)
- [ ] Usuário `admin@polisual.com.br` antigo (se existir no banco) removido pela aba Usuários
- [ ] Backup configurado e testado
