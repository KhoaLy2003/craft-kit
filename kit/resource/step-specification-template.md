# {{STEP_NAME}}

> Canonical skeleton for a step file. Dev-only; not installed by the CLI.
> Omit or shorten any section that would be empty or only restate `kit/orchestrator-conventions.md` (banner, PROJECT_ROOT, fail-fast writes, file verification, English-only, gate protocol). Do not add per-step Transition Records, "Before Advancing" blocks that repeat Completion Criteria, or "Optional skip: No" lines.

## Overview

- **Purpose**: {{ONE_SENTENCE_PURPOSE}}
- **Agent/Skill**: `{{AGENT_OR_SKILL}}`
- **Model**: `{{capable | balanced | fast | none}}`
- **Gate**: {{none | soft | hard}} — {{CONDITION_IF_NOT_OBVIOUS}}
- **Inputs**: {{INPUT_PATHS}}
- **Outputs**: {{OUTPUT_PATHS}}
- **Template**: {{TEMPLATE_PATH_OR_NONE}}

## Scope

- **In**: {{IN_SCOPE}}
- **Out**: {{OUT_OF_SCOPE}}
- **Boundary**: {{CRITICAL_STOP_CONDITION}}

## Rules

- {{RULE_UNIQUE_TO_THIS_STEP}}

## Artifacts

- `{{ARTIFACT_PATH}}` — {{REQUIRED_SECTIONS_OR_FORMAT}}
- Approval: {{WHAT_THE_USER_CONFIRMS}}

## Completion Criteria

- [ ] {{OBSERVABLE_CRITERION_1}}
- [ ] {{OBSERVABLE_CRITERION_2}}

## Transitions

- **Next**: Step {{N}} — {{NAME}}{{; skip condition and who decides, only if the step is skippable}}
- **Gate summary** (hard gates): *"{{ONE_SENTENCE_NAMING_THE_DECISION}}"*

## Exceptions (optional)

- {{EXCEPTION}}
