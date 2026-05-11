# HackRef 🔐

Referencia interactiva de comandos de seguridad y pentesting — todo en un solo archivo HTML autocontenido.

🔗 **[Abrir HackRef](https://fabianstb.github.io/hackref/)**

---

## ¿Qué es?

HackRef es una aplicación web de una sola página que funciona como cheatsheet para pruebas de penetración. Incluye más de 60 herramientas y 600+ comandos organizados por categoría, con búsqueda instantánea y botón de copiar al portapapeles.

## Características

- 🔍 **Búsqueda instantánea** — filtra herramientas por nombre, descripción o comando
- 🗂️ **Filtros por categoría** — Reconocimiento, Fuzzing, Enumeración, Explotación, Post-Explotación, Red, Contraseñas
- 📋 **Copiar al portapapeles** — un clic para copiar cualquier comando
- 🌑 **Tema oscuro** — interfaz en estilo terminal con verde matrix
- 📦 **Sin dependencias externas** — un solo archivo HTML autocontenido

## Herramientas incluidas

| Categoría | Herramientas |
|-----------|-------------|
| Fuzzing | ffuf, gobuster, wfuzz, feroxbuster, dirsearch |
| Reconocimiento | nmap, masscan, theHarvester, amass, subfinder, assetfinder |
| Enumeración | enum4linux, smbclient, crackmapexec, nikto, whatweb, kerbrute, bloodhound, wafw00f, dnsrecon |
| Explotación | sqlmap, hydra, msfconsole, netcat, dalfox, searchsploit, LFI, SSTI, SSRF |
| Post-Explotación | mimikatz, winPEAS, linPEAS, impacket, responder, PrintSpoofer, PowerUp, pspy, socat, chisel, ligolo-ng, Docker Escape |
| Red | tcpdump, tshark, arp-scan, aircrack-ng, SSH Tunneling |
| Contraseñas | john, hashcat, hashid, medusa |
| Cloud | PACU, cloud_enum/s3scanner |
| Otros | MSSQL, Redis, httpx, nuclei, gitleaks, swaks, smtp-user-enum |

## Uso

1. Abrir [https://fabianstb.github.io/hackref/](https://fabianstb.github.io/hackref/) en el navegador
2. Escribir el nombre de la herramienta o técnica en el buscador
3. O usar los filtros de categoría para explorar por tipo
4. Hacer clic en una tarjeta para expandir y ver los comandos
5. Usar el botón **copiar** para copiar al portapapeles

## Uso local

```bash
# Clonar el repositorio
git clone https://github.com/fabianstb/hackref.git

# Abrir directamente en el navegador
open index.html
```

## Aviso legal

> **SOLO PARA USO EN PRUEBAS AUTORIZADAS**
>
> Esta herramienta es únicamente para fines educativos y pruebas de seguridad en sistemas con autorización explícita. El uso no autorizado contra sistemas ajenos puede ser ilegal. El autor no se responsabiliza del mal uso de esta información.

---

