# Contributing to JanVigil.in

Thank you for helping keep **JanVigil.in** accurate, up-to-date, and actionable for citizens across India!

## How You Can Help

1. **Verify State / UT Helplines**: Test official telephone helplines (`1064`, `14400`, `1076`, etc.) and confirm operating hours.
2. **Update Portal URLs**: Submit corrections if a State government launches a new dedicated anti-corruption portal or updates its complaint submission form.
3. **Refine Anonymity & Trap Rules**: Provide references to official FAQs or agency guidelines regarding whistleblower identity protection and trap participation rules.

## Data Structure Guidelines

All agency data is maintained in `data/anti_corruption_directory.json`. When modifying an entry, ensure the following fields are preserved:

```json
{
  "id": "STATE_OR_UT_CODE",
  "name": "State or UT Name",
  "type": "State" | "Union Territory",
  "authority": "Primary Anti-Corruption Body",
  "url": "https://official-government-domain.gov.in/",
  "complaintTypes": ["Tag1", "Tag2"],
  "anonymousSupport": "Description of anonymity policy",
  "anonymousDetails": "Detailed explanation of anonymity rules",
  "phone": "Official phone / helpline number(s)",
  "escalation": "Escalation pathway",
  "isFormVerified": true | false,
  "notes": "Relevant administrative notes"
}
```

### Verification Criteria

- Please do **not** submit generic third-party directory URLs or blog links.
- Only official domain links (`.gov.in`, `.nic.in`, `.in`) are accepted as primary sources.
- Append an asterisk (`*`) to any phone number or form URL that cannot be independently confirmed as active.

## Submission Workflow

1. Fork the repository (`JanVigil.in`).
2. Create a feature branch (`git checkout -b update/kerala-helpline`).
3. Commit your changes with clear messages (`git commit -m "Update Kerala VACB WhatsApp helpline"`).
4. Push to your branch and open a Pull Request.
