// Scenariusz: Co robi Renovate gdy masz TYLKO digest (bez taga)?

console.log("═".repeat(70));
console.log("RENOVATE + FORMAT TYLKO DIGEST (BEZ TAGA)");
console.log("═".repeat(70));

console.log(`
FORMAT W PLIKU:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - europe-docker.pkg.dev/kyma-project/prod/app@sha256:69e6edc2d4db9343278e3859ce09fd04d9106444c5b70360c1a75ccd57c07806

Zauważ: BRAK ":vXXX" taga!


═══════════════════════════════════════════════════════════════════════
PROBLEM #1: OBECNY REGEX NIE OBSŁUGUJE
═══════════════════════════════════════════════════════════════════════

Twój regex w renovate.json:
  (?<depName>[...]):(?<currentValue>v?[0-9][a-z0-9._-]*)(?:@(?<currentDigest>sha256:[a-f0-9]+))?
                    ^
                    └── WYMAGA dwukropka ":" i taga!

Test:
  ❌ europe-docker.pkg.dev/app@sha256:xxx
     └── brak ":" po app = NO MATCH

  ✅ europe-docker.pkg.dev/app:v1.2.3@sha256:xxx
     └── ma ":" i tag = MATCH!


═══════════════════════════════════════════════════════════════════════
PROBLEM #2: JAK RENOVATE MA ZNALEŹĆ NOWĄ WERSJĘ?
═══════════════════════════════════════════════════════════════════════

Renovate proces:
  1. Znajduje currentValue (tag) → porównuje z registry
  2. Jeśli brak taga → ❌ nie wie jakiej wersji szukać!

Przykład:
  - Plik:     app@sha256:abc123 (digest z 2024-01-01)
  - Registry: app:v1.0.0@sha256:abc123 (stary)
              app:v2.0.0@sha256:def456 (nowy)
              app:v3.0.0@sha256:xyz789 (najnowszy)
  
  Renovate: 🤷 "Nie wiem na co aktualizować - nie ma taga w pliku!"


═══════════════════════════════════════════════════════════════════════
CO ROBI RENOVATE Z TYLKO-DIGEST?
═══════════════════════════════════════════════════════════════════════

Scenariusz A: Twój regex nie matchuje
  ❌ Renovate nie wykryje dependency w ogóle
  ❌ Plik nie jest monitorowany
  ❌ Brak PR, brak updateów

Scenariusz B: Gdyby regex matchował (zmieniony)
  ⚠️  Renovate wykryje obraz
  ⚠️  ALE nie będzie wiedział jakiej wersji używasz
  ⚠️  Może spróbować "pin" operation
  ❌ Ale nadal nie wie czy updateować i na co


═══════════════════════════════════════════════════════════════════════
DOCKER/KUBERNETES ZACHOWANIE:
═══════════════════════════════════════════════════════════════════════

Format: image@sha256:xxx (tylko digest)

Docker pull:
  ✅ DZIAŁA - Docker pobiera konkretny digest
  ✅ Immutable - zawsze ten sam obraz
  ✅ Nie sprawdza tagów w ogóle

Kubernetes:
  spec:
    containers:
    - image: app@sha256:xxx
  
  ✅ DZIAŁA - K8s używa digestu
  ✅ imagePullPolicy: ignorowany (zawsze pull by digest)


═══════════════════════════════════════════════════════════════════════
CZY TO DOBRY PATTERN?
═══════════════════════════════════════════════════════════════════════

PLUSY:
  ✅ Maksymalna immutability
  ✅ Niemożliwe do podmienienia
  ✅ 100% reproducible builds

MINUSY:
  ❌ ZERO czytelności - nie wiesz jaka wersja
  ❌ Renovate nie może automatycznie updateować
  ❌ Musisz ręcznie szukać nowych wersji
  ❌ Code review niemożliwy - "sha256:abc → sha256:def" nic nie mówi
  ❌ Monitoring/logging - nie widać wersji w dashboardach
  ❌ Debugging nightmare - która wersja jest deployed?


═══════════════════════════════════════════════════════════════════════
REKOMENDACJA:
═══════════════════════════════════════════════════════════════════════

❌ NIE UŻYWAJ tylko digestu!

Używaj: image:tag@digest (tag + digest)
  ✅ Renovate może automatycznie updateować
  ✅ Czytelne w code review
  ✅ Immutable (digest chroni)
  ✅ Możliwe do monitorowania
  ✅ Best of both worlds!


═══════════════════════════════════════════════════════════════════════
KIEDY TYLKO-DIGEST MA SENS?
═══════════════════════════════════════════════════════════════════════

Rzadkie przypadki:
  1. Tymczasowy hotfix (znasz dokładny digest z testów)
  2. Vendor nie używa tagów (bardzo rzadkie)
  3. Internal build system który nie taguje (napraw to!)
  
Ale nawet wtedy lepiej:
  1. Znaleźć tag który odpowiada digestowi
  2. Użyć tag@digest format


═══════════════════════════════════════════════════════════════════════
JAK ZNALEŹĆ TAG DLA DIGESTU?
═══════════════════════════════════════════════════════════════════════

Jeśli masz tylko digest i chcesz tag:

  # Sposób 1: Użyj docker
  docker pull image@sha256:xxx
  docker inspect image@sha256:xxx | grep RepoTags

  # Sposób 2: Registry API
  curl https://registry.io/v2/repo/tags/list
  # Potem sprawdź manifesty każdego taga

  # Sposób 3: crane (Google)
  crane digest image:some-tag
  # Porównaj z Twoim digestem


═══════════════════════════════════════════════════════════════════════
PRZYKŁAD PRAKTYCZNY:
═══════════════════════════════════════════════════════════════════════

❌ ZŁE:
  - app@sha256:69e6edc2d4db9343278e3859ce09fd04d9106444c5b70360c1a75ccd57c07806
  Problem: Nikt nie wie co to za wersja!

✅ DOBRE:
  - app:v1.2.3@sha256:69e6edc2d4db9343278e3859ce09fd04d9106444c5b70360c1a75ccd57c07806
  Bonus: Wiesz że to v1.2.3 + masz immutability digestu


═══════════════════════════════════════════════════════════════════════
PODSUMOWANIE:
═══════════════════════════════════════════════════════════════════════

Tylko digest (bez taga):
  ❌ Renovate nie może automatycznie updateować
  ❌ Brak czytelności
  ❌ Trudny maintenance
  ❌ NIE ZALECANE!

Rozwiązanie:
  ✅ Zawsze używaj: tag@digest
  ✅ Renovate będzie działał
  ✅ Będziesz mieć immutability + czytelność
  ✅ To jest industry standard!

`);

console.log("═".repeat(70));
console.log("WNIOSEK: Używaj tag@digest, nie samego digestu!");
console.log("═".repeat(70));
