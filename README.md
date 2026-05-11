# O.C.R.A. (Offensive Command Reference Archive)

Referencia interactiva de comandos de seguridad ofensiva y pentesting en un solo archivo HTML autocontenido.

[Abrir O.C.R.A.](https://fabianstb.github.io/hackref/)

---

## Que es

O.C.R.A. (Offensive Command Reference Archive) es una aplicacion web de una sola pagina que funciona como cheatsheet para pruebas de penetracion. Incluye herramientas y comandos organizados por categoria, busqueda instantanea y boton de copiar al portapapeles.

## Caracteristicas

- Busqueda instantanea: filtra herramientas por nombre, descripcion o comando
- Filtros por categoria: Reconocimiento, Fuzzing, Enumeracion, Explotacion, Post-Explotacion, Red, Contrasenas
- Copiar al portapapeles: un clic para copiar cualquier comando
- Tema oscuro: interfaz estilo terminal
- Sin dependencias externas en produccion: un solo archivo HTML autocontenido

## Herramientas incluidas

| Categoria | Herramientas |
|-----------|-------------|
| Fuzzing | ffuf, gobuster, wfuzz, feroxbuster, dirsearch |
| Reconocimiento | nmap, masscan, theHarvester, amass, subfinder, assetfinder |
| Enumeracion | enum4linux, smbclient, crackmapexec, nikto, whatweb, kerbrute, bloodhound, wafw00f, dnsrecon |
| Explotacion | sqlmap, hydra, msfconsole, netcat, dalfox, searchsploit, LFI, SSTI, SSRF, XXE, JWT |
| Post-Explotacion | mimikatz, winPEAS, linPEAS, impacket, responder, PrintSpoofer, PowerUp, pspy, socat, chisel, ligolo-ng, Docker Escape |
| Red | tcpdump, tshark, arp-scan, aircrack-ng, SSH Tunneling |
| Contrasenas | john, hashcat, hashid, medusa |
| Cloud | PACU, cloud_enum/s3scanner |
| Otros | MSSQL, Redis, httpx, nuclei, gitleaks, swaks, smtp-user-enum |

## Uso

1. Abrir [https://fabianstb.github.io/hackref/](https://fabianstb.github.io/hackref/) en el navegador
2. Escribir el nombre de la herramienta o tecnica en el buscador
3. O usar los filtros de categoria para explorar por tipo
4. Hacer clic en una tarjeta para expandir y ver los comandos
5. Usar el boton copiar para copiar al portapapeles

## Uso local

```bash
git clone https://github.com/fabianstb/hackref.git
cd hackref
npm install
npm run dev
```

Tambien puedes abrir directamente `index.html` en el navegador.

## Aviso legal

**SOLO PARA USO EN PRUEBAS AUTORIZADAS**

Esta herramienta es un archivo de referencia para fines educativos y pruebas de seguridad en sistemas con autorizacion explicita. El uso no autorizado contra sistemas ajenos puede ser ilegal. El autor no se responsabiliza del mal uso de esta informacion.
