# Official External Taxonomy & Market Data Ingestion

SkillSetu integrates authoritative international skill and occupational taxonomies—specifically **O*NET (Occupational Information Network)** from the U.S. Department of Labor and **ESCO (European Skills, Competences, Qualifications and Occupations)** from the European Commission—directly into the canonical data ingestion and provenance pipeline established in Phase 28.

---

## 1. Architectural Overview

```
[ Authoritative Datasets: O*NET 29.1 / ESCO v1.2.0 ]
                           │
       (Download Security / Anti-SSRF / Zip Slip Check)
                           ▼
              [ Download Security Service ]
                           │
             (RFC 4180 Streaming CSV Parser)
                           ▼
         [ onetConnector / escoConnector ]
                           │
      (Entity Resolution & Mapping Preservation)
                           ▼
          [ ExternalTaxonomyMapping ] ───────┐
          [ Role / Skill / Relationships ]   │ Provenance: IMPORTED
                           │                 │ Non-Contamination Guaranteed
                           ▼                 │ (No synthetic demand/salary)
          [ Data Quality & Ingestion Store ] ┘
```

The taxonomy ingestion pipeline seamlessly attaches to SkillSetu's core database without building a parallel or bifurcated architecture. All ingested external concepts are mapped to canonical `Role` and `Skill` entities while maintaining explicit provenance links in `ExternalTaxonomyMapping`.

---

## 2. Supported Official Data Sources

| Source Name | Authoritative Authority | Version | Format | Primary Identifiers Preserved |
| :--- | :--- | :--- | :--- | :--- |
| **O*NET** | U.S. Department of Labor / Employment and Training Administration (USDOL/ETA) | `29.1` | Delimited / CSV (`.txt`, `.csv`, `.zip`) | O*NET-SOC 2019 Codes (`15-1252.00`), Element IDs (`2.A.1.a`) |
| **ESCO** | European Commission Directorate-General for Employment, Social Affairs & Inclusion | `v1.2.0` | CSV / Multilingual (`.csv`, `.zip`) | Stable Concept URIs (`http://data.europa.eu/esco/occupation/...`) |

---

## 3. Data Connectors & Normalization Logic

### A. O*NET Connector (`onetConnector.service.js`)
- **Occupations**: Parses `Occupation Data.txt` to extract canonical title, detailed description, and standard O*NET-SOC code.
- **Skills & Knowledge**: Ingests `Skills.txt`, `Knowledge.txt`, and `Technology Skills.txt` (hot technologies, in-demand tools).
- **Relationships**: Maps occupation-to-skill importance scores (1.0 to 5.0) into relationship weights and categorizes linkages (`REQUIRED` vs. `PREFERRED`).
- **Alternate Titles**: Resolves localized and colloquial job titles (`Alternate Titles.txt`) to canonical roles.

### B. ESCO Connector (`escoConnector.service.js`)
- **Occupations**: Ingests `occupations_en.csv` retaining canonical label, multilingual alternative labels, and persistent concept URIs.
- **Skills**: Parses `skills_en.csv` mapping skill types (`knowledge`, `skill/competence`, `language`) and descriptions.
- **Skill-Role Relations**: Parses `occupationSkillRelations.csv` translating relation types (`essential` $\rightarrow$ `REQUIRED`, `optional` $\rightarrow$ `PREFERRED`).

---

## 4. External Identifier & Concept URI Preservation

All external taxonomy records preserve their native keys in the `ExternalTaxonomyMapping` table:

```prisma
model ExternalTaxonomyMapping {
  id                 String   @id @default(uuid())
  source             String   // "ONET" | "ESCO"
  externalId         String   // SOC Code, Element ID, or Concept URI
  externalUri        String?  // Full persistent URI
  datasetVersion     String   // e.g. "29.1", "v1.2.0"
  internalEntityType String   // "ROLE" | "SKILL"
  internalEntityId   String   // Foreign key to canonical Role or Skill
  confidenceScore    Float    @default(1.0)
  mappingMetadata    Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([source, externalId, internalEntityType])
  @@index([source, datasetVersion])
  @@index([internalEntityId, internalEntityType])
}
```

---

## 5. Provenance & Non-Contamination Boundaries

### Provenance Tagging
- All roles, skills, and mappings derived from official taxonomy files are strictly tagged with `provenance: "IMPORTED"`.
- Dataset metadata records store the official version, source URL, and full SHA-256 source file checksums.

### Non-Contamination Safeguard
- **Zero Synthetic Market Demand**: Ingesting occupational taxonomies creates or enriches canonical ontology definitions only. It **never** inserts synthetic job postings or alters historical market demand time-series.
- **Zero Synthetic Compensation**: Taxonomy files do not contain actual observed vacancy salaries; importing O*NET or ESCO data **never** creates rows in `advertisedCompensation`.

---

## 6. Download Security & Ingestion Safety

SkillSetu implements enterprise download and archive security in `downloadSecurity.service.js`:

1. **Host Allowlisting**: Only official government and commission hosts are permitted for remote download:
   - `www.onetcenter.org`, `onetcenter.org`, `services.onetcenter.org`
   - `esco.ec.europa.eu`, `ec.europa.eu`, `data.europa.eu`
2. **Anti-SSRF Protection**: Remote URLs undergo DNS resolution prior to HTTP requests. Any destination resolving to private, link-local, loopback, or broadcast ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`) is rejected with a security exception.
3. **Zip Slip Prevention**: Archive extraction verifies canonical resolved file paths against destination directory roots to prevent directory traversal vulnerabilities (`../../`).

---

## 7. Administrative REST APIs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/admin/ingestion/onet/import` | Ingest O*NET dataset payload or archive with SOC code mapping |
| `POST` | `/api/v1/admin/ingestion/esco/import` | Ingest ESCO dataset payload or archive with URI mapping |
| `GET` | `/api/v1/admin/ingestion/sources-summary` | Retrieve active dataset versions, counts, and checksums |
| `POST` | `/api/v1/admin/ingestion/sources/:sourceId/check-update` | Check upstream source repositories for newer releases |
| `GET` | `/api/v1/admin/ingestion/taxonomy-mappings` | Query external taxonomy mappings with source & entity filters |

---

## 8. Data Quality Dashboard

The administrative Data Quality Dashboard (`/admin/data-quality`) provides real-time visibility into:
- Status and version of O*NET and ESCO sources.
- Total canonical roles and skills mapped to external authorities.
- One-click upstream release check and automated ingestion triggering.
- Quarantine review queue for records failing schema validation or checksum verification.
