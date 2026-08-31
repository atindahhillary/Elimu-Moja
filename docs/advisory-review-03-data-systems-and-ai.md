# Advisory review 3: EMIS landscape, federated data architecture, AI data assistant, data governance, AI safety

> AI-assisted desk research prepared to inform the Elimu Moja data warehouse and AI-governance design. Verify every claim against the primary source before use. Links are inline.

The conference call for abstracts names the core problem: partner states "grapple with fragmented data systems, inadequate analytical capacity, weak data governance frameworks." The EAC now has eight partner states at very different maturity levels, spanning Anglophone, Francophone, Somali and Arabic administrations, so any "one regional warehouse" must federate rather than centralise.

---

## 1. EMIS landscape across EAC partner states

- **Kenya.** NEMIS (launched 2017) is being replaced by **KEMIS** from 2025, web-based, aiming at real-time individual learner records from ECDE to university, integrated with the Maisha Namba digital ID and with the Teachers Service Commission and KNEC. A 2026 audit and parliamentary review found roughly **973,000 ghost learners** in NEMIS and questioned billions of shillings of capitation disbursed on unverified data. Kenya's data also lives in multiple agency silos (basic education, TSC, KNEC, KUCCPS, TVETA, HEMIS) and reconciliation across them is the central weakness.
- **Uganda.** An EMIS has existed since 2014 but has not been fully functional since the Annual School Census was discontinued in 2017; enrolment data were refreshed to December 2023 through a rebuilt system that still omits private schools. A UNESCO-supported Teacher Management Information System has registered more than 200,000 teachers since 2019. Uganda is piloting DHIS2 for Education.
- **Tanzania.** Governance is split: PO-RALG administers basic-education data through BEMIS and a School Information System, while the Ministry of Education operates **ESMIS**, designed to consolidate BEMIS and individual pupil records and cover primary to university, public and private. Zanzibar runs a separate system. The PO-RALG and Ministry split, and the mainland and Zanzibar split, are the interoperability fault lines.
- **Rwanda.** The Rwanda Education Board's **School Data Management System (SDMS)** operates alongside a teacher MIS and an assessment MIS, with links to the Irembo e-government one-stop. A 2017 mapping found 12 unconnected education databases; MINEDUC with UNICEF is building an integrated EMIS with a metadata standard and an interoperability framework. Rwanda launched a national Center for Digital Public Infrastructure in February 2025. Documented weaknesses: data quality and timeliness, teacher digital literacy, rural connectivity.
- **Burundi.** EMIS since 2008; annual paper questionnaires entered via a StatEduc interface. Francophone, near-zero real-time capability.
- **South Sudan.** SSEMIS since 2007, donor-funded and UNICEF-managed; the 2021 National Education Census covered more than 90 percent of schools, but education data are spread across **six parallel EMIS platforms with 14 institutional actors** producing divergent figures.
- **Somalia.** The Ministry runs an annual school census using software called PINEAPPLES; Federal Member States plus Somaliland and Puntland have historically run separate censuses, with low coverage in insecurity-affected areas. Somalia has piloted digital high-school certificates through GovStack.
- **DR Congo.** Large, low-capacity, Francophone and conflict-affected; AU-IPED ran an EMIS self-assessment against the AU EMIS Norms and Standards in Kinshasa in May 2026.

**Software patterns.** The region is split between UNESCO's royalty-free **OpenEMIS**, **DHIS2 for Education** (described as the fastest-growing EMIS software in Africa), and bespoke national builds (KEMIS, BEMIS and ESMIS, SDMS, StatEduc, PINEAPPLES). No two EAC states share a stack, which is an argument for federating at the semantic layer rather than mandating one product.

**UIS reporting and continental initiatives.** UIS is the official source for SDG 4 indicators and runs the joint UNESCO, OECD and Eurostat collection using SDMX; EAC states report late and lean on modeled estimates for learning, finance, pre-primary and equity. ADEA hosts the **African Foundational Learning Data Hub (AFLEARN)** at DataFirst (University of Cape Town) and the **Africa Foundational Learning Assessment Initiative (AFLAI)**. AU-IPED maintains continental **EMIS Norms and Standards**; SADC, ECOWAS and the EAC have each adopted a regional EMIS code of practice under CESA 2026 to 2035. SADC is the closest regional precedent (EMIS norms, an EMIS peer-review framework, an SDG 4 progress report, and a World Bank-funded regional statistics project). The conference references a "Learning Systems Data Platform (LSDP)" and "FLAT+"; those exact names could not be independently verified and appear to sit within the AFLEARN, AFLAI and Education and Skills Data Challenge family.

**Recurring problems.** Ghost learners and capitation leakage; census discontinuation and multi-year stale data; many parallel databases; divergent headline figures between agencies; annual rather than event-driven collection; paper-based collection at source; private-school and non-formal under-coverage; refugees and IDPs largely invisible; separate federal and sub-national systems; weak district analytical capacity; heavy donor dependence for the data function itself; and no common learner or school identifier.

## 2. Reference architecture for a federated regional education data warehouse

### A data space, not a central database
The appropriate pattern is a **data federation, data mesh or data space**: each partner state runs a national node that retains legal custody and control of person-level micro-data, and publishes governed, standardised data products (aggregates and de-identified extracts) into a shared regional layer. What is centralised is the **semantic layer, the catalog, the reference data, the query federation engine and the AI assistant**, not the raw records. This directly answers the sovereignty concern that has historically blocked regional education databases.

### Standards to adopt (do not invent)
- **Statistical exchange:** SDMX (ISO 17369), already used by UIS.
- **Dataset discovery:** W3C DCAT and DCAT-AP for the regional open-data catalog.
- **Micro-data model:** a CEDS-style common vocabulary and an Ed-Fi-style unifying data model for learner, enrolment, teacher, school, assessment and finance entities, localised to the EAC. The regional layer should primarily move aggregates and de-identified or synthetic micro-data.
- **Classifications:** ISCED 2011 and ISCED-A, Washington Group Short Set for disability, common subnational geography codes, a regional ISCED mapping table.
- **Source-system interoperability:** OneRoster, QTI, xAPI and Caliper for assessment and LMS feeds.
- **Regional and continental frameworks:** AU Continental EMIS Norms and Standards, the EAC EMIS code of practice, CESA 2026 to 2035 indicators, EAC Vision 2050.

### Indicator dictionary
A single, versioned regional indicator dictionary defines every indicator once (SDG 4 global and thematic indicators using UIS definitions, plus CESA and EAC-specific indicators), each with formula, numerator and denominator sources, disaggregations, periodicity, quality flags and an owner. Start with a minimum viable set before expanding.

### Interoperability with identity and civil registration
Derive a **pseudonymous, per-jurisdiction learner key** (a salted hash of the birth-registration or national-ID number) at the national node, and never expose the raw ID in the regional layer.

### Comparators and the DPI framing
- **India:** the National Digital Education Architecture, UDISE+ as the national school data system, and **Vidya Samiksha Kendra** as an analytics-and-AI "education intelligence" layer integrating multiple systems, first built by Gujarat then adopted nationally. The closest model to what the EAC wants.
- **GovStack:** reusable building blocks (registries, information mediator, consent, identity, workflow). An Estonia X-Road-style information mediator is the right country-to-country exchange mechanism.
- **Rwanda** (Center for DPI) and **Togo** are the EAC-adjacent DPI reference points.
- **EU:** Eurydice for policy comparison, Eurostat's aggregate collection plus controlled microdata, PISA for cross-national comparability. A regional layer can be authoritative on aggregates and comparative policy without a central register of pupils.
- **School master facility list:** **Giga** (UNICEF and ITU) has mapped over one million schools with open geolocation and connectivity status, including additions in Kenya and Rwanda. Reconcile national school registries with Giga and GRID3 to produce one geocoded master list with a unique school ID.

### Proposed high-level architecture (six layers)

```
Layer 0  SOURCE SYSTEMS (per state)
         National EMIS (KEMIS, BEMIS/ESMIS, SDMS, StatEduc, SSEMIS, PINEAPPLES, DHIS2-Ed),
         teacher registries, exam boards, TVET MIS, HEMIS, finance/IFMIS,
         civil registration + national ID, refugee data, Giga school map

Layer 1  NATIONAL DATA NODE (per state, inside national jurisdiction)
         ETL + data-quality engine, entity resolution, pseudonymisation,
         small-cell suppression, "data product" publisher. Micro-data never leaves.

Layer 2  REGIONAL INTEROPERABILITY FABRIC (EAC Secretariat + IUCEA)
         information mediator / API gateway, SDMX + DCAT registry,
         identity federation + consent/policy engine, versioned indicator dictionary
         + semantic layer, regional reference data (school master list, geography, ISCED)

Layer 3  REGIONAL WAREHOUSE / LAKEHOUSE
         aggregate statistical cubes (SDMX), a controlled de-identified micro-data
         enclave for research, a document store of plans, budgets, commitments, evidence

Layer 4  AI DATA ASSISTANT + ANALYTICS
         semantic-layer-bound natural-language query, retrieval over indicator
         metadata + policy documents, guardrails, mandatory source citation,
         anomaly / equity-gap detection

Layer 5  ACCESS + DECISION LAYER
         public open-data portal (no login), role-based dashboards,
         policy-brief generator, commitment tracker, school report cards,
         accredited-researcher microdata request workflow

Layer 6  GOVERNANCE (cross-cutting)
         Regional Education Data Governance Council, technical working group,
         ethics + child-safeguarding board, DPIA gate, audit + observability
```

## 3. AI data assistant layer

### What "good" looks like
A natural-language interface **bound to the governed semantic layer**, not a chatbot with open database access. The semantic layer defines approved metrics, dimensions, grain, joins and security rules; the model translates a question into a constrained query that is validated against schema, metric, join, grain, filter, security and cost rules before execution. This separation is the property that suppresses hallucinated metrics, invalid joins and wrong grain.

Required behaviours:
- Every answer cites the indicator, source system, reference year and method, and states when a figure is a modeled estimate.
- Small-cell suppression and disaggregation thresholds are enforced in the query layer, so the assistant physically cannot return a count below the threshold.
- The assistant refuses or says "insufficient data" rather than guessing, and surfaces what the data cannot tell you.
- No free-form access to person-level records; research micro-data is a separate, human-gated enclave.
- Human-in-the-loop: an analyst verifies any output before it becomes a published brief.

### Precedents
- **IMF and EPAM StatGPT:** translates plain-English questions into SDMX queries against official statistical databases and returns exact published figures. The reference implementation for a statistics assistant, and it already speaks SDMX.
- **Eurostat:** a retrieval-augmented assistant grounded only in Eurostat's own content and metadata, with live data retrieval so figures are current.
- **World Bank Data360** and its MCP server, giving LLM agents structured access to development indicators without hallucinating values.
- **Our World in Data** and the UIS SDG 4 data tools as models for public-facing, well-documented indicator browsing.

### The data-to-decision workflow
1. **Indicator to insight:** automated detection of anomalies, equity gaps and deviations from SDG 4 benchmarks or CESA targets.
2. **Insight to policy brief:** the assistant drafts a structured brief with citations, uncertainty ranges, disaggregated breakdowns and a limitations section; an analyst edits and signs off.
3. **Brief to options:** link to expenditure data for unit costs and fiscal space.
4. **Options to decision:** a decision log records what was chosen and why.
5. **Decision to commitment tracker:** aligned to the conference theme "From Commitments to Impact" and the UNESCO SDG 4 Dashboard of Country Commitments; South Africa's Data Driven Districts is the operational model at district level.
6. **Feedback to schools and districts:** every reporting school receives a report card and benchmarking, closing the loop.

## 4. Data governance for a cross-border system involving minors

### National data-protection law status (August 2026)

| State | Instrument | Regulator | Notes |
|---|---|---|---|
| Kenya | Data Protection Act 2019 plus 2021 regulations | Office of the Data Protection Commissioner | Child provisions; Industry Guidelines for Child Online Protection and Safety in force October 2025 |
| Uganda | Data Protection and Privacy Act 2019 plus 2021 regulations | Personal Data Protection Office | Localisation-leaning transfer rules |
| Rwanda | Law No. 058/2021 | National Cyber Security Authority | Mandatory registration; guidance on children's data; storage-in-Rwanda default |
| Tanzania | Personal Data Protection Act 2022 plus 2023 regulations | Personal Data Protection Commission | Applies to mainland and Zanzibar |
| Somalia | Data Protection Act 2023 | Somalia Data Protection Authority | Enforcement nascent |
| DR Congo | Digital Code (2023) includes personal-data provisions | nascent | Institutional build-out ongoing |
| Burundi | No comprehensive modern Act in force | none | Gap |
| South Sudan | No data-protection law | none | Gap; fragile state |

Three of eight partner states lack an operational regime, so the regional instrument must set the floor, not assume one.

### Regional and continental instruments
- The **EAC Framework for Cyberlaws** (Phase I, 2010): the EAC was the first African region to adopt a harmonised cyberlaw framework, but its data-protection provisions are non-binding guidance and omit data minimisation, purpose limitation and accountability.
- An **EAC Data Governance Policy Framework** validated October 2024; a proposed EAC Data Protection and Privacy Act; a **Cross-Border Data Flows Framework** validated June 2026 under the Eastern Africa Regional Digital Integration Project (EARDIP); and an emerging concept of an EAC **"Single Data Territory"** modelled on the Single Customs Territory.
- **African Union:** the Malabo Convention (in force June 2023) with limited ratifications and weak cross-border provisions; the AU Data Policy Framework (2022) proposes a Cross-Border Data Flows Mechanism sensitive to differing maturity.

### Cross-border transfer, child-data minimisation, thresholds
- **Transfers:** move only aggregates and de-identified extracts, backed by a regional adequacy white-list, standard contractual clauses, and a "trusted node" certification. Raw PII does not cross a border.
- **Child-data minimisation:** the regional layer holds no names, contact details or biometrics. Follow the **UNICEF Manifesto on the Governance of Children's Data** (protect all under 18 regardless of consent age; child rights by design; minimise profiling and surveillance) and the **Responsible Data for Children (RD4C)** principles (purpose-driven, participatory, protective, proportionate, professionally accountable, prevention of harm).
- **Anonymisation and aggregation thresholds:** enforced minimum cell size (suppress counts below 5, below 10 for sensitive cross-tabs), k-anonymity for any released micro-data, differential privacy for public tabulations, and a no-download secure research enclave with output checking.

### Governance body model
A **Regional Education Data Governance Council** under the Sectoral Council, co-secretariated by the EAC Secretariat and IUCEA, comprising for each partner state the education ministry, the national statistics office and the **data protection authority**; plus an independent ethics and child-safeguarding board; a technical working group owning the standards, indicator dictionary and versioning; a mandatory DPIA gate before any new data flow; a public register of data-sharing agreements; and a grievance and redress mechanism. Make it stick with a **binding EAC legal instrument** (a Protocol or Council Directive on Education Data), not a memorandum of understanding.

## 5. AI safety and governance for classrooms in low-infrastructure settings

### Anchor frameworks
- **UNESCO Guidance for Generative AI in Education and Research (2023):** seven steps for governments, a recommended minimum age of 13 for independent use of generative AI tools in class, mandated data-privacy protection, teacher training, and protection of human agency, inclusion, equity, and linguistic and cultural diversity.
- **UNESCO AI Competency Framework for Students (2024):** 12 competencies across human-centred mindset, ethics of AI, AI techniques and applications, and AI system design.
- **UNESCO AI Competency Framework for Teachers (2024):** 15 competencies across five dimensions including AI pedagogy and AI for professional learning.
- **AU Continental Artificial Intelligence Strategy (adopted July 2024):** people-centric, development-oriented and inclusive AI; education a priority sector; data-protection and data-governance law as the primary regulatory lever; Phase 1 (2025 to 2026) for national strategies.
- **Age-appropriate design:** the UK ICO Children's Code as the template; Kenya's Child Online Protection industry guidelines (October 2025) as a ready regional starting point.
- **EdTech procurement:** the World Bank EdTech Procurement Knowledge Pack and the EdTech Hub "sandbox" model for piloting before scale.

### What a regional AI-in-education safeguarding standard should contain
1. Scope and definitions, and a **risk tiering** of use cases: prohibited (emotion recognition on children, behavioural profiling, automated high-stakes decisions about a child without human review and appeal); high-risk (tutoring and assessment systems); limited; minimal.
2. Minimum age and consent aligned to UNESCO and to each national data-protection law.
3. Data-protection and data-minimisation by design; no secondary use of children's data for model training without a lawful basis and DPIA.
4. Transparency and explainability to teachers, learners and parents; disclosure when a learner is interacting with AI.
5. Human oversight and a right of appeal for any AI output affecting a learner's progression, placement or discipline.
6. Bias, safety and localisation testing before deployment, with published results.
7. Safeguarding: child-protection policy, incident reporting, content moderation, CSAM prohibition, a named safety officer per vendor.
8. Equity and accessibility: offline capability, language coverage (Kiswahili, Kinyarwanda, Luganda, Somali, French, Arabic, South Sudanese languages), disability access, and an equity impact assessment.
9. Teacher and learner AI literacy tied to the UNESCO competency frameworks and sustained CPD.
10. Procurement and vendor due diligence: evidence of efficacy, open standards, interoperability, security, data-processing agreements, no lock-in, sunset clauses, pilot-before-scale.
11. Environmental footprint disclosure and a preference for a shared regional inference service.
12. Monitoring, audit and conformity assessment: a regional certification mark for compliant EdTech, periodic audit, a public register; "do no harm" as the overriding test.

## 6. Design implications
1. Federate the micro-data, centralise the meaning.
2. Aggregates and de-identified extracts cross borders; raw PII never does, enforced in the national node.
3. Bind the AI assistant to the semantic layer; every figure carries a citation; a human statistician signs off any published brief.
4. Adopt, do not invent, standards: SDMX, DCAT, Ed-Fi and CEDS, ISCED, Washington Group, AU and EAC EMIS norms.
5. Legal-first: pursue a binding EAC Protocol or Directive on Education Data plus a regional adequacy mechanism.
6. Lifelong and inclusive scope: ECD, basic, TVET, higher education and adult literacy, and explicitly refugees, IDPs, non-formal and community schools.
7. Fund it regionally and open-source it; local hosting or a regional data centre.
8. Design for offline and low bandwidth at every layer, including the assistant.
9. Close the loop to schools and the middle tier with report cards, benchmarking and simple tools.
10. Start minimal and prove it: a minimum viable indicator set and two or three pilot states, then scale, with a versioned, backward-compatible release process.
11. Put the data protection authorities on the governance council from the start.
12. Human-in-the-loop for decisions; the assistant states what the data cannot answer.

## 7. Recommended additional gaps
1. **Unique learner identifier versus privacy.** A pseudonymous, per-jurisdiction learner key, tightly governed, with a child-rights lawful basis and cross-border portability for mobile and refugee learners. Note backlash precedents (Australia My School, UK Unique Learner Number).
2. **Teacher registry interoperability and cross-border mutual recognition**, including a shared teacher-misconduct list; link to payroll and pension to detect ghost teachers.
3. **Single geocoded school master facility list**: one unique school ID per institution, reconciled across national registries, Giga and GRID3, to detect ghost and non-operational schools.
4. **Real-time versus annual data:** event-driven attendance and enrolment feeds alongside the annual census, weighed against reporting burden and connectivity.
5. **Financing and expenditure tracking:** a BOOST-style education expenditure database per state, with unit costs, capitation-flow tracing, equity-of-spending analysis, and donor-funding-on-budget visibility.
6. **Middle-tier data-use capacity:** fund district analysts, simple dashboards and delivery routines.
7. **Open-data versus sensitive-data tiering:** a four-tier classification with default-open for non-personal school and finance data.
8. **Sustainability, hosting and funding:** a regional budget line, shared infrastructure, open-source stack, explicit exit plans.
9. **Feedback loop to schools:** school report cards and benchmarking returned to every reporting school.
10. **Research microdata access for universities:** an accredited safe-researcher scheme through IUCEA, a secure enclave with output checking.
11. **Interoperability governance and versioning:** a standards body, semantic versioning of the indicator dictionary and APIs, conformance testing, a public changelog and a deprecation policy.
12. **Out-of-school children, refugees and IDPs:** link to refugee-agency data; the region hosts millions of displaced learners outside EMIS.
13. **Learning-outcomes and assessment comparability:** a common regional proficiency scale, with guardrails against league-table misuse.
14. **Independent data-quality assurance:** routine triangulation against household surveys and satellite data, published data-quality scorecards, periodic independent audit.
15. **Mandatory disaggregation:** sex, disability, language of instruction, wealth quintile and geography on every indicator, with small-cell protection.
16. **Crisis and climate resilience of the data system itself:** offline-first collection, backups, continuity plans, disruption tracking.
17. **Master data management and entity resolution:** golden records and deduplication for schools, teachers and learners across agencies and borders.
18. **Political economy and change management:** a Summit-level mandate, named champions, and civil-service incentives to share data.
19. **AI assistant evaluation and monitoring:** a benchmark set of policy questions, ongoing accuracy and hallucination tracking, red-teaming, and an enforced norm that the assistant does not replace the statistician.
