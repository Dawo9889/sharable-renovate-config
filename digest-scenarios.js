// Test: Co robi Renovate gdy ten sam tag ma nowy digest?

console.log("═".repeat(70));
console.log("SCENARIUSZE AKTUALIZACJI DIGESTU W RENOVATE");
console.log("═".repeat(70));

console.log(`
SCENARIUSZ 1: Nowy tag + nowy digest (normalny update)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plik: image:v1.2.3@sha256:abc123
Registry: 
  - v1.2.3@sha256:abc123 (stary)
  - v1.2.4@sha256:def456 (NOWY TAG)

Renovate action:
  ✅ Wykryje nowy tag v1.2.4
  ✅ Pobierze jego digest sha256:def456
  ✅ Zaproponuje PR: v1.2.3@sha256:abc123 → v1.2.4@sha256:def456
  
Rezultat: AKTUALIZUJE tag + digest


SCENARIUSZ 2: Ten sam tag, zmieniony digest (republish/rebuild)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plik: image:v1.2.3@sha256:abc123
Registry:
  - v1.2.3@sha256:def456 (ten sam tag, NOWY DIGEST!)

Renovate action:
  ❌ NIE wykryje jako update (bo tag się nie zmienił)
  ✅ ALE digest w pliku zabezpiecza Cię!
  ✅ Docker/Kubernetes będzie pullował sha256:abc123 (nie def456)
  
Rezultat: BRAK AKTUALIZACJI - digest chroni przed zmianą!


SCENARIUSZ 3: Tylko tag (bez digestu) - dla porównania
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plik: image:v1.2.3 (bez digestu)
Registry:
  - v1.2.3@sha256:def456 (republished)

Renovate action:
  ❌ NIE wykryje jako update (bo tag się nie zmienił)
  ❌ Docker POBIERZE nowy content (sha256:def456)
  ⚠️  NIEBEZPIECZNE - dostałeś inny obraz niż wcześniej!
  
Rezultat: BRAK KONTROLI NAD TYM CO SIĘ POBIERA
`);

console.log("═".repeat(70));
console.log("WNIOSKI:");
console.log("═".repeat(70));
console.log(`
1. Renovate śledzi ZMIANY TAGÓW, nie digestów
2. Jeśli tag:v1.2.3 ma nowy digest → Renovate tego NIE WYKRYJE
3. ALE digest w pliku CHRONI CIĘ - będziesz używał starego obrazu
4. To jest FEATURE, nie bug - immutability działa!

PRAKTYCZNE IMPLIKACJE:
━━━━━━━━━━━━━━━━━━━━━
✅ BEZPIECZEŃSTWO: Digest chroni przed republish attacks
✅ STABILNOŚĆ: Nie dostaniesz niespodziewanej zmiany
⚠️  MONITORING: Musisz mieć alerting na "digest drift"
`);

console.log("═".repeat(70));
console.log("POLECANE NARZĘDZIA DO MONITOROWANIA DIGEST DRIFT:");
console.log("═".repeat(70));
console.log(`
- Renovate z opcją "pinDigests: true" (już masz!)
- Dependabot (GitHub)
- Trivy/Grype dla security scanning
- Custom scripts sprawdzające registry vs deployed digests
`);
