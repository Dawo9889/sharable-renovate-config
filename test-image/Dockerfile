# Test image dla Renovate
FROM alpine:3.23.3

# Metadane
LABEL maintainer="test@example.com"
LABEL description="Testowy obraz dla Renovate digest testing"

# Dodaj prosty plik z wersją
ARG VERSION=unknown
RUN echo "Version: ${VERSION}" > /version.txt && \
    echo "Built at: $(date)" >> /version.txt

# Prosty skrypt do wyświetlenia wersji
RUN echo '#!/bin/sh' > /usr/local/bin/show-version && \
    echo 'cat /version.txt' >> /usr/local/bin/show-version && \
    chmod +x /usr/local/bin/show-version

CMD ["show-version"]
