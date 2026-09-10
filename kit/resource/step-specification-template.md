# Phase {{PHASE}} · Step {{STEP}} — {{STEP_NAME}}

## Overview

- **Purpose**: {{ONE_SENTENCE_PURPOSE}}
- **Agent/Skill**: `{{AGENT_OR_SKILL}}`
- **Model**: `{{MODEL_NAME}}`
- **Trigger**: {{WHEN_THIS_STEP_STARTS}}
- **Inputs**:
  - `{{INPUT_1}}`
  - `{{INPUT_2}}`
- **Outputs**:
  - `{{OUTPUT_1}}`
  - `{{OUTPUT_2}}`
- **Template**: `{{TEMPLATE_PATH_OR_NONE}}`
- **Gate**: {{GATE_CONDITION_OR_NONE}}

## Scope

### In Scope

- {{IN_SCOPE_1}}
- {{IN_SCOPE_2}}

### Out of Scope

- {{OUT_OF_SCOPE_1}}
- {{OUT_OF_SCOPE_2}}

### Scope Boundary

> {{CRITICAL_BOUNDARY_OR_STOP_CONDITION}}

## Execution Rules

- {{RULE_1}}
- {{RULE_2}}
- {{RULE_3}}

## Artifact Rules

- **Artifact**: `{{ARTIFACT_PATH_OR_NONE}}`
- {{ARTIFACT_RULE_1}}
- {{ARTIFACT_RULE_2}}
- **Status / approval condition**: {{STATUS_RULE_OR_NONE}}

## Completion Criteria

The step is considered complete when:

- [ ] {{COMPLETION_CRITERION_1}}
- [ ] {{COMPLETION_CRITERION_2}}
- [ ] {{COMPLETION_CRITERION_3}}

## Transition Rules

### Before Advancing

- {{TRANSITION_CHECK_1}}
- {{TRANSITION_CHECK_2}}

### Next Step

- **Default**: Step {{NEXT_STEP}} — {{NEXT_STEP_NAME}}
- **Optional skip**: {{YES_NO_AND_CONDITION}}
- **User decision required**: {{YES_NO}}

### Transition Record

- **Record**: `{{SESSION_LOG_OR_OTHER_RECORD}}`
- **Values**: `{{COMPLETE / SKIPPED / BLOCKED / OTHER}}`

## Exceptions / Special Cases

- {{EXCEPTION_1}}
- {{EXCEPTION_2}}

## References

- `{{REFERENCE_1}}`
- `{{REFERENCE_2}}`
