# Data verification, 2026-10-25

## Bottom line

- 11 records updated, 23 fields (AS, GA, UP, AN, SK, RJ, PY, MH, MN, MZ, NL).
- 33 fields confirmed unchanged against an official page.
- 92 fields (29 records) not verifiable from this environment (site unreachable, or secondary/non-government source only). They keep their values and any `*` markers.
- 6 fields were not addressed by any fetched page and are unchanged.
- Side effect: AN `isFormVerified` true to false, so the "Online Form Verified" count is 17 to 16.

## Method

- Research agents fetched official government domains only (gov.in, nic.in and state equivalents). News, directories and search snippets were treated as leads, never applied.
- A second, independent verifier re-fetched the cited page before any change was accepted. A change was applied only if the page plainly supported the exact value; the verifier's `final` value was applied verbatim.
- Sites that could not be fetched (connection refused, DNS failure, certificate errors, timeouts) were left unchanged.
- Office landlines replaced unverified helplines for GA, SK, PY and MN (marked "office line" below). They are not toll-free complaint helplines.

## Applied changes

| Record | Field | Old | New | Source | Quote |
|---|---|---|---|---|---|
| AS | url | `https://vigilance.assam.gov.in/` | `https://dgvigilance.assam.gov.in/` | https://dgvigilance.assam.gov.in/ | Vigilance & Anti Corruption \| Government Of Assam, India |
| AS | phone | `1800-345-3570*` | `1800-345-3767` | https://dgvigilance.assam.gov.in/taxonomy/term/5843 | Phone No.: 1800-345-3767 (Toll-Free). |
| GA | phone (office line) | `0832-2424192*` | `7875756063` | https://www.goa.gov.in/wp-content/uploads/2026/08/Citizen-Charter-.pdf | Anti Corruption Branch, Directorate of Vigilance, Near Joggers Park, Altinho, Panaji-Goa 403001. Tel: 7875756063. |
| GA | anonymousDetails | `CVO guidelines apply; non-verified anonymous complaints usually filed.` | `Anonymous and pseudonymous complaints are not entertained; a complaint must give the complainant's full name, postal address and contact number.` | https://www.goa.gov.in/wp-content/uploads/2026/08/Citizen-Charter-.pdf | Anonymous complaints (i.e. complaints without disclosing the name & detailed address of the complainant) and pseudonymous complaints ... shall not be entertained. |
| GA | anonymousSupport | `Limited` | `No` | https://www.goa.gov.in/wp-content/uploads/2026/08/Citizen-Charter-.pdf | Anonymous complaints ... and pseudonymous complaints ... shall not be entertained. |
| UP | url | `https://vigilance.up.gov.in/` | `https://uppolice.gov.in/article/en/anti-corruption-org` | https://uppolice.gov.in/article/en/anti-corruption-org | Anti-Corruption Organisation (ACO) page on UP Police site; HQ Ph 0522-2390247/2390266/2390289 |
| UP | phone | `1076*` | `0522-2390247; Control Room: 9454402484` | https://uppolice.gov.in/article/en/anti-corruption-org | Ph : 0522-2390247/2390266/ 2390289 ... Control Room No -9454402484 |
| AN | isFormVerified | `true` | `false` | https://vigilance.and.nic.in/ | Proforma for Complaints (ACVUAPPLICATION.pdf) |
| SK | url | `https://sikkim.gov.in/` | `https://www.sikkim.gov.in/departments/sikkim-vigilance-police-department` | https://www.sikkim.gov.in/departments/sikkim-vigilance-police-department | Sikkim Vigilance Police |
| SK | authority | `State Vigilance Police` | `Sikkim Vigilance Police` | https://www.sikkim.gov.in/departments/sikkim-vigilance-police-department | Sikkim Vigilance Police |
| SK | phone (office line) | `1064*` | `03592-202480` | https://www.sikkim.gov.in/departments/sikkim-vigilance-police-department | Department Contact Information: Phone: 03592 202480 (Fax: 03592 208250) |
| RJ | phone | `1064` | `1064; WhatsApp: 9413502834` | https://home.rajasthan.gov.in/content/homeportal/en/acbdepartment.html | Helpline Number: 1064 ... Whatsapp Helpline Number: 9413502834 |
| PY | url | `https://www.py.gov.in/` | `https://cvo.py.gov.in/procedure.htm` | https://cvo.py.gov.in/procedure.htm | Please ensure that the complaint is addressed directly to the Chief Vigilance Office. |
| PY | phone (office line) | `1031 / 0413-2231444*` | `0413-2238016` | https://cvo.py.gov.in/contact.htm | Vigilance & Anticorruption - Police Unit, No.271, M.G Road, Muthialpet ... Phone : (0413) 2238016. |
| PY | authority | `Directorate of Vigilance & Anti-Corruption` | `Chief Vigilance Office / Vigilance & Anti-Corruption Police Unit, Puducherry` | https://cvo.py.gov.in/contact.htm | VIGILANCE & ANTI-CORRUPTION, POLICE UNIT. ... The parent office is 'Chief Vigilance Office' |
| PY | anonymousDetails | `Anti-corruption helpline active.` | `Complaints are addressed directly to the Chief Vigilance Office.` | https://cvo.py.gov.in/procedure.htm | Please ensure that the complaint is addressed directly to the Chief Vigilance Office. |
| PY | notes | `Puducherry DVAC office.` | `Vigilance & Anti-Corruption Police Unit, M.G. Road, Muthialpet, Puducherry.` | https://cvo.py.gov.in/contact.htm | No.271, M.G Road, Muthialpet, Puducherry-605003. |
| MH | url | `https://acb.maharashtra.gov.in/` | `https://acb.maharashtra.gov.in/bribe-complaint` | https://acb.maharashtra.gov.in/bribe-complaint | Details Of the Complainant ... Details Of the Public Servant ... © 2026 ANTI CORRUPTION BUREAU, MAHARASHTRA |
| MN | url | `https://manipur.gov.in/` | `https://dvac.mn.gov.in/contact-us/` | https://dvac.mn.gov.in/contact-us/ | OFFICE OF THE SUPERINTENDENT OF POLICE, VIGILANCE & ANTI-CORRUPTION, MANIPUR. |
| MN | phone (office line) | `1064*` | `0385-2415717` | https://dvac.mn.gov.in/contact-us/ | 0385-2415717 |
| MZ | url | `https://mizoram.gov.in/` | `https://acb.mizoram.gov.in/` | https://acb.mizoram.gov.in/ | Anti Corruption Bureau, Government of Mizoram, India |
| MZ | phone | `1064*` | `0389-2333975` | https://acb.mizoram.gov.in/page/contact-us | ACB Hotline/Confidential Branch: 0389-2333975 (O) |
| NL | url | `https://nagaland.gov.in/` | `https://dpar.nagaland.gov.in/state-vigilance-commission/` | https://dpar.nagaland.gov.in/state-vigilance-commission/ | The Nagaland State Vigilance Commission was established in 1976. |

## Confirmed unchanged

Field matched an official page (differences of hyphen, ampersand or capitalisation only).

| Record | Field | Source |
|---|---|---|
| AS | authority | https://dgvigilance.assam.gov.in/contact-us |
| AS | isFormVerified | https://dgvigilance.assam.gov.in/taxonomy/term/5843 |
| BR | authority | https://betastate.bihar.gov.in/vigilance |
| BR | isFormVerified | https://betastate.bihar.gov.in/vigilance |
| GA | authority | https://www.goa.gov.in/wp-content/uploads/2026/08/Citizen-Charter-.pdf |
| GA | isFormVerified | https://www.goa.gov.in/wp-content/uploads/2026/08/Citizen-Charter-.pdf |
| HR | url | https://acb.haryana.gov.in/ |
| HR | phone | https://acb.haryana.gov.in/Helpline%20Number/ |
| HR | authority | https://acb.haryana.gov.in/ |
| KL | url | https://vigilance.kerala.gov.in/page/file-a-complaint |
| KL | phone | https://vigilance.kerala.gov.in/page/file-a-complaint |
| KL | authority | https://vigilance.kerala.gov.in/page/file-a-complaint |
| KL | isFormVerified | https://vigilance.kerala.gov.in/file-complaint |
| MH | phone | https://acb.maharashtra.gov.in/ |
| MH | authority | https://acb.maharashtra.gov.in/ |
| MH | isFormVerified | https://acb.maharashtra.gov.in/bribe-complaint |
| MN | isFormVerified | https://dvac.mn.gov.in/enquiry/ |
| ML | url | https://lokayukta.meghalaya.gov.in/ |
| ML | authority | https://lokayukta.meghalaya.gov.in/ |
| MZ | isFormVerified | https://acb.mizoram.gov.in/page/online-fir-submission |
| NL | authority | https://dpar.nagaland.gov.in/state-vigilance-commission/ |
| NL | isFormVerified | https://dpar.nagaland.gov.in/state-vigilance-commission/ |
| RJ | url | https://home.rajasthan.gov.in/content/homeportal/en/acbdepartment.html |
| RJ | authority | https://home.rajasthan.gov.in/content/homeportal/en/acbdepartment.html |
| SK | isFormVerified | https://www.sikkim.gov.in/departments/sikkim-vigilance-police-department |
| UP | authority | https://uppolice.gov.in/article/en/anti-corruption-org |
| UP | isFormVerified | https://uppolice.gov.in/article/en/anti-corruption-org |
| AN | url | https://vigilance.and.nic.in/ |
| AN | phone | https://vigilance.and.nic.in/helpline.html |
| AN | authority | https://vigilance.and.nic.in/ |
| DN | url | https://ddd.gov.in/ |
| LA | url | https://ladakh.gov.in/ |
| PY | isFormVerified | https://cvo.py.gov.in/procedure.htm |

## Not verifiable from this environment

Values unchanged. "secondary-only" means a non-government page or search snippet agreed or conflicted, but no official page was fetched.

| Record | Field | Status | What was tried |
|---|---|---|---|
| AP | url | unverified | WebFetch failed (no output) for acb.ap.gov.in, www.acb.ap.gov.in/about.php; acbap.gov.in does not resolve. Search snippet only (secondary). |
| AP | phone | secondary-only | 14400 appears in search result text for the ACB site and in news, but I could not fetch an official page. No change. |
| AP | authority | unverified | Site not fetchable. |
| AP | isFormVerified | unverified | Could not fetch the site to confirm a complaint form. |
| AR | url | unverified | WebFetch ECONNRESET twice. Domain name suggests State Information Commission, not an ACB; cannot confirm. No official ACB page found via search. |
| AR | phone | unverified | No official source fetched. Arunachal Times (news) cites 0360-2212600 / 9436040055 for ACB: lead only, not applied. |
| AR | authority | unverified | No official page loaded. |
| AR | isFormVerified | unverified | Could not load site. Flag: value true with an unreachable URL that appears to be a different body; needs manual check. |
| BR | url | unverified | vigilance.bihar.gov.in fails TLS ('unable to verify the first certificate'), also over http. The betastate.bihar.gov.in/vigilance page (fetched) links to it, so it appears to be a real portal, but it is a beta host; no change. |
| BR | phone | unverified | Page has a highlight with this title but the number is only in a linked PDF that I could not read as text. Lists DG VIB office 0612-2217238 (office line, not a public helpline); not applied. Search leads (news): mobile 7765953261, WhatsApp 9473494167: secondary only. |
| CG | url | unverified | WebFetch ECONNREFUSED (164.100.113.173:443). News (Daily Pioneer 2020) names the same site: secondary. |
| CG | phone | secondary-only | News (Hitavada 2020, Daily Pioneer) says CM released helpline 1064 and WhatsApp 8827461064; no official page fetched. No change. |
| CG | authority | unverified | Site not loadable. |
| CG | isFormVerified | unverified | News says site allows filing complaints, but not verified on the official page; left false. |
| GA | url | unverified | Charter (gov PDF) lists this website for the Directorate of Vigilance, but vigilance.goa.gov.in itself failed to load (socket closed). No change. |
| GJ | url | unverified | WebFetch ETIMEDOUT twice; secondary search lists same portal domain. No change. |
| GJ | phone | secondary-only | Only news/forum sources mention 1064 for Gujarat ACB; official site unreachable. |
| GJ | authority | unverified | Site unreachable. |
| GJ | isFormVerified | unverified | Site unreachable; search found no confirmation of an online complaint form. |
| HR | isFormVerified | unverified | Home page and ranges page list no online complaint form (only a deputation Google Form). Current 'true' is likely wrong but only two pages checked; suggest manual check, possibly set false. |
| HP | url | unverified | WebFetch getaddrinfo EAI_AGAIN on /contact and /introduction. Search lists hpsvacb.hp.gov.in/introduction, so domain appears right. |
| HP | phone | secondary-only | Aggregators list 1064, 0177-2629893, WhatsApp 89887 00100; no official fetch. Keep asterisk. |
| HP | authority | unverified | Site unreachable. |
| HP | isFormVerified | unverified | Site unreachable. |
| JH | url | unverified | WebFetch ENOTFOUND (DNS fails); domain may be dead. Search found no official Jharkhand ACB site. No replacement found; needs manual check. |
| JH | phone | unverified | No source ties 1064 to Jharkhand ACB. |
| JH | authority | unverified | No official page reached. |
| JH | isFormVerified | unverified | No official page reached. |
| KA | url | unverified | WebFetch ECONNREFUSED; lokayukta.kar.nic.in ENOTFOUND. |
| KA | phone | secondary-only | A third-party site lists 1800-425-5320 as Lokayukta toll-free, conflicting with current value; not official, no change. Needs manual verification. |
| KA | authority | unverified | Site unreachable. |
| KA | isFormVerified | unverified | Site unreachable. |
| MP | url | unverified | WebFetch ECONNREFUSED on mplokayukt.nic.in (complaints-filing, root, /home). Search results list the page as the official Lokayukt site, but not fetched. |
| MP | phone | unverified | Site unreachable; only third-party directory numbers (0755-2540935 etc.) seen, which are leads only. |
| MP | authority | unverified | Site unreachable. |
| MP | isFormVerified | unverified | A third-party NIC directory lists a Lokayukt Complaint Management System (online); not confirmed on official site. |
| MN | authority | unverified | Site styles itself 'Vigilance & Anti Corruption' / department (a wing of State Vigilance Commission); 'Bureau' not seen. Left unchanged, maintainer may consider 'Vigilance & Anti-Corruption (Manipur)'. |
| ML | phone | unverified | Contact page lists address and email lokayukta-meg(at)gov(dot)in but no phone number. |
| ML | isFormVerified | unverified | No online complaint form seen on home or contact page; 'Cases' section not checked. Flag for maintainer; no change. |
| MZ | authority | unverified | ACB site is ACB only; Lokayukta is a separate body per Mizoram Lokayukta Act (search news). Left unchanged. |
| NL | phone | unverified | No official vigilance number found. Lokayukta (separate body) lists 'Telephone: 2271461 (O & Fax)' at lokayukta.nagaland.gov.in (not applicable). Keep unchanged. |
| OR | url | unverified | WebFetch ECONNREFUSED on vigilance.odisha.gov.in (home, /helpline/, /faqs/). Search result only (secondary): site exists. |
| OR | phone | unverified | Official helpline page titled 'Helpline Number : 1064' appeared in search results but could not be fetched (ECONNREFUSED); search snippet only, so no change. Candidate lead: 1064 (primary helpline), 0671-2305201 is main line per snippet. |
| OR | authority | unverified | Site unreachable; search titles show 'Vigilance Directorate, Odisha'. |
| OR | isFormVerified | unverified | Site unreachable; not determined. |
| PB | url | unverified | WebFetch failed with no output on home and /complaint.php. Search results (secondary) show site and complaint.php exist. |
| PB | phone | unverified | Snippet-only evidence (toll-free 1800 1800 1000; WhatsApp 9501200200 on dgrpg.punjab.gov.in) but fetches failed; no change, asterisk kept. Leads: 1800-1800-1000; WhatsApp: 9501200200. |
| PB | authority | unverified | Pages not fetchable. |
| PB | isFormVerified | unverified | Not determined; complaint.php and complaint_status.php exist per search results but could not be fetched. |
| RJ | isFormVerified | unverified | Fetched page lists only an email and phone for complaints, no online complaint form found; could not confirm a form exists. Left unchanged, flag for review (possibly false). |
| TN | url | unverified | WebFetch ECONNREFUSED on home, contactus.html, formation.html. Search results (secondary) show site live. |
| TN | phone | unverified | Search snippet (secondary) says DVAC lists Anti-Corruption Helpline 1064 and Vigilance Helpline 1965; not fetched. No change. |
| TN | authority | unverified | Search title: 'Directorate of Vigilance and Anti-Corruption' (and vs &, style only). Not fetched. |
| TN | isFormVerified | unverified | Site unreachable. |
| TG | url | unverified | WebFetch failed (no output / ECONNREFUSED) on home, /Home/ReportCorruption, /ACB/Default.aspx. Search results (secondary) show those pages and /ACB/NewComplaint.aspx exist. |
| TG | phone | unverified | Snippet-only (1064; WhatsApp 9440446106). No change. |
| TG | authority | unverified | Not fetched. |
| TG | isFormVerified | unverified | NewComplaint.aspx appears in search results but could not be fetched. |
| TR | url | unverified | Fetch of tripura.gov.in root got ECONNREFUSED; search only surfaced PDFs on tripura.gov.in (Lokayukta Act, memorandum), also not fetchable. |
| TR | phone | unverified | Fetch ECONNREFUSED; no official source for 1064 in Tripura; no change. |
| TR | authority | unverified | Site unreachable. |
| TR | isFormVerified | unverified | Site unreachable; search found no online complaint portal (non-official), unchanged. |
| UK | url | unverified | ECONNREFUSED on root and /my_complaint_status. A search result titled 'Toll Free No. Call: 1064' with that URL suggests it is the live official site (search snippet only). |
| UK | phone | secondary-only | Search snippet from the official domain says 'Toll Free No. Call: 1064' but I could not fetch it; no change. |
| UK | authority | unverified | Site unreachable. |
| UK | isFormVerified | unverified | Could not fetch; snippet mentions WhatsApp complaint and complaint-status lookup only. Unchanged. |
| WB | url | unverified | ECONNREFUSED on https and http; search returned no wb.gov.in page. |
| WB | phone | secondary-only | Only a third-party directory (indiacustomercare) lists 033-2262 5040. Separate news reports 2026 state helplines 155334 etc. (extortion) - not ACB, not official-fetched. |
| WB | authority | unverified | Site unreachable. |
| WB | isFormVerified | unverified | Could not fetch; unchanged. |
| CH | url | unverified | Cert verification error on both www and non-www; search found no confirming page. |
| CH | phone | unverified | Page unreachable. |
| CH | authority | unverified | Page unreachable. |
| CH | isFormVerified | unverified | Page unreachable. |
| DN | phone | unverified | Official helpline page does not list 1064; no official source found for any corruption number. No change. |
| DN | authority | unverified | No vigilance body named on the site; unchanged. |
| DN | isFormVerified | unverified | Only a generic grievance form, not a corruption-specific one; unchanged. |
| DL | url | unverified | WebFetch: getaddrinfo ENOTFOUND (DNS fails). Search leads (not fetched successfully, ECONNREFUSED on all delhi.gov.in hosts, also curl fails): https://vigilance.delhi.gov.in/vigilance/anti-corruption-branch and https://delhi.gov.in/page/anti-corruption-branch. Search snippet also lists helpline 1031 and an alternate +91-11-27357169. No change. |
| DL | phone | secondary-only | Search snippet says delhi.gov.in page lists Anti Corruption Helpline 1031, but fetch failed (ECONNREFUSED). No change. |
| DL | authority | unverified | Official pages unreachable. |
| DL | isFormVerified | unverified | Could not fetch any official ACB page; unchanged. |
| JK | url | secondary-only | Current URL fails DNS (ENOTFOUND) and name suggests a different body. The ACB's own site appears to be jkacb.in (fetched) but it is not a gov domain, and jkacb.nic.in also fails DNS. Candidate lead: https://www.jkacb.in/how-to-register-complaint.php (non-gov domain, so no change per brief); owner should decide. |
| JK | phone | secondary-only | Number matches on ACB's own site jkacb.in, but domain is not gov.in/nic.in. No change; no change needed. WhatsApp 9419678060 appears there too. |
| JK | authority | secondary-only | Name consistent; no change. |
| JK | isFormVerified | unverified | Form link seen only on non-gov domain; unchanged. |
| LA | phone | unverified | No corruption helpline listed; unchanged. |
| LA | authority | unverified | No vigilance body named on fetched pages. |
| LA | isFormVerified | unverified | Feedback and Help Hub (helphub.ladakh.gov.in) exist but purpose not determined/fetched; unchanged. |
| LD | url | unverified | WebFetch connect ECONNREFUSED twice. |
| LD | phone | unverified | Site unreachable. |
| LD | authority | unverified | Site unreachable. |
| LD | isFormVerified | unverified | Site unreachable. |

## Not addressed by fetched pages

| Record | Field | Note |
|---|---|---|
| AS | anonymousDetails | Page does not address anonymity; left unchanged. |
| AS | notes | Does not repeat the number; no edit needed. |
| MN | notes | If url/phone change, this note is stale (now agency's own site). |
| MZ | anonymousDetails | Page implies signed complaints are required for electronic submission; not an explicit anonymity statement, no change. |
| UP | anonymousDetails | If phone changes, this text repeats 1076; reviewer to decide. |
| JK | anonymousDetails | jkacb.in says identity of complainant will be kept confidential; not contradictory. |

## Needs manual check

- HR `isFormVerified` (true): home and ranges pages list no online complaint form; only a deputation Google Form.
- JK `url`: current host does not resolve. The ACB's own site appears to be jkacb.in (toll-free 1800-180-7152, matches the dataset phone) but it is not a gov.in/nic.in domain. Confirm the correct domain.
- AR `url`: the sicp.arunachal.gov.in host did not load and its name suggests the State Information Commission, not an ACB. `isFormVerified` (true) and phone are also unverified.
- KA `phone`: a third-party site lists 1800-425-5320, conflicting with the current value. No official source reached.
- RJ `isFormVerified` (true): the ACB page lists only email and phone for complaints; no online form seen. RJ `anonymousDetails` ("Helpline 1064 handles real-time bribe demand traps") is not on the page. The WhatsApp number was appended to `phone` as accepted.
- UP `anonymousDetails` ("Helpline 1076 CM helpline integration.") still cites 1076, which is not on the ACO page, and no fetched text addresses anonymity.
- PY `escalation` ("Director, Vigilance"): implies a Directorate not seen on official pages (the Chief Vigilance Office is headed by the Chief Secretary).
- MN `authority`: the site titles itself "Vigilance & Anti Corruption" (header) and "State Vigilance Commission, Manipur" (footer); "Bureau" is not used. Left unchanged. MN `notes` ("Submissions processed via State Government portal.") and `anonymousDetails` are now stale or unverified against the agency's own site.
- MZ `authority`: the ACB site names only "Anti Corruption Bureau, Government of Mizoram"; no Lokayukta seen. Left unchanged.
- NL `phone` (`1064*`): no official vigilance number found. The fetched page heading read "Lokayukta" though the body concerns the State Vigilance Commission.
- GA `anonymousSupport`: `No` was proposed by the verifier; confirm it fits the dataset vocabulary (other values in use: `Limited`, `Limited / Source Information`, `Anonymous generally NOT actionable`, and three starting with `Yes`).
- AN `isFormVerified` set to false from a fetch summary: home and helpline pages show only a downloadable PDF proforma; reviewer should re-check the page.
- Phone lines for GA, SK, PY, MN, UP are office numbers, not helplines; consider whether the UI should say so.
