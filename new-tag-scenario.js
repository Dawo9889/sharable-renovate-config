// Dokładny scenariusz: Nowy tag w registry

console.log("═".repeat(70));
console.log("CO ROBI RENOVATE GDY POJAWI SIĘ NOWY TAG?");
console.log("═".repeat(70));

console.log(`
PUNKT STARTOWY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Twój plik (sec-scanners-config.yaml):
  - europe-docker.pkg.dev/kyma-project/prod/test-infra/rotate:v20260210-3236b3ca@sha256:69e6edc2...

Registry ma:
  - v20260210-3236b3ca@sha256:69e6edc2... (OBECNY)


═══════════════════════════════════════════════════════════════════════
MAINTAINER WYPUSZCZA NOWĄ WERSJĘ:
═══════════════════════════════════════════════════════════════════════
docker build -t rotate:v20260212-abc999 .
docker push rotate:v20260212-abc999

Registry teraz ma:
  - v20260210-3236b3ca@sha256:69e6edc2... (stary)
  - v20260212-abc999@sha256:abcdef12...   (NOWY! ✨)


═══════════════════════════════════════════════════════════════════════
RENOVATE WYKRYWA ZMIANĘ (następny run):
═══════════════════════════════════════════════════════════════════════

Krok 1: Skanowanie
  ✅ Renovate scanuje europe-docker.pkg.dev/kyma-project/prod/test-infra/rotate
  ✅ Pobiera listę tagów z registry
  ✅ Znajduje: v20260210-3236b3ca (obecny), v20260212-abc999 (nowy)

Krok 2: Analiza wersji
  ✅ Parsuje: v20260210 vs v20260212
  ✅ Wykrywa: 20260212 > 20260210 → NOWA WERSJA!
  ✅ Typ update: "major" (według Twojego versioning)

Krok 3: Pobieranie digestu dla nowej wersji
  ✅ Robi HTTP request do registry:
      GET /v2/kyma-project/prod/test-infra/rotate/manifests/v20260212-abc999
  ✅ Parsuje manifest i wyciąga digest: sha256:abcdef12...

Krok 4: Tworzenie PR
  ✅ Branch: renovate/test-infra-rotate-v20260212-abc999
  ✅ Commit message: "Update test-infra/rotate to v20260212-abc999"
  ✅ Zmiana w pliku:
  
      PRZED:
      - europe-docker.pkg.dev/.../rotate:v20260210-3236b3ca@sha256:69e6edc2...
      
      PO:
      - europe-docker.pkg.dev/.../rotate:v20260212-abc999@sha256:abcdef12...
      
  ✅ PR description:
      - Old tag: v20260210-3236b3ca
      - New tag: v20260212-abc999
      - Old digest: sha256:69e6edc2...
      - New digest: sha256:abcdef12...
      - Update type: major


═══════════════════════════════════════════════════════════════════════
CO DOKŁADNIE SIĘ ZMIENIA W PLIKU:
═══════════════════════════════════════════════════════════════════════

Stara linia:
  - europe-docker.pkg.dev/kyma-project/prod/test-infra/rotate:v20260210-3236b3ca@sha256:69e6edc2d4db9343278e3859ce09fd04d9106444c5b70360c1a75ccd57c07806

Nowa linia:
  - europe-docker.pkg.dev/kyma-project/prod/test-infra/rotate:v20260212-abc999@sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

Zmienione:
  ✅ Tag:    v20260210-3236b3ca → v20260212-abc999
  ✅ Digest: sha256:69e6edc2... → sha256:abcdef12...


═══════════════════════════════════════════════════════════════════════
GROUPING (zgodnie z Twoją konfiguracją):
═══════════════════════════════════════════════════════════════════════

Twoja reguła w renovate.json:
  {
    "matchDatasources": ["docker"],
    "groupName": "docker images"
  }

Rezultat:
  ✅ Wszystkie obrazy Docker w JEDNYM PR!
  ✅ Jeśli masz 6 obrazów do update → 1 PR z 6 zmianami
  ✅ PR Title: "Update docker images"


═══════════════════════════════════════════════════════════════════════
TIMELINE PRAKTYCZNY PRZYKŁAD:
═══════════════════════════════════════════════════════════════════════

09:00 - Maintainer pushuje v20260212-abc999 do registry
10:00 - Renovate scheduled run (jeśli masz cron)
10:01 - Renovate wykrywa nową wersję
10:02 - Renovate robi lookup digestu
10:03 - Renovate tworzy branch: renovate/docker-images
10:04 - Renovate commituje zmiany
10:05 - Renovate otwiera PR w GitHub
10:06 - ✅ MASZ PR DO REVIEW!


═══════════════════════════════════════════════════════════════════════
AUTOMERGE (jeśli skonfigurujesz):
═══════════════════════════════════════════════════════════════════════

Jeśli masz w renovate.json:
  {
    "automerge": true,
    "platformAutomerge": true
  }

To:
  ✅ Renovate utworzy PR
  ✅ Zaczeka na CI/tests
  ✅ Jeśli testy przejdą → AUTO-MERGE!
  ✅ Obraz zaktualizowany bez ręcznej interwencji


═══════════════════════════════════════════════════════════════════════
PODSUMOWANIE:
═══════════════════════════════════════════════════════════════════════

Nowy tag → Renovate:
  ✅ Wykryje nową wersję
  ✅ Pobierze nowy digest automatycznie
  ✅ Zaktualizuje OBA (tag + digest)
  ✅ Utworzy PR
  ✅ Możesz zautomatyzować merge
  
To jest GŁÓWNY use case Renovate - automatyzacja updateów! 🚀
`);
