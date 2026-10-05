# Interactive Prototype — Background

> Optional reading. The authoritative rules are in `kit/steps/phase-1/p1-03-prototype-design.md`; this guide explains the reasoning behind them.

## Purpose

Let end users and stakeholders experience the proposed product before real development effort is spent. The prototype exposes wrong, missing, or ambiguous requirements while changes are cheap, and gives Product, UX, Development, and QA one shared reference.

> **Fail fast, get user feedback early, avoid building the wrong product.**

## What it is and is not

An interactive prototype is a simplified, clickable simulation (HTML, CSS, JavaScript, mock data) of the key flows. It validates requirements, user flows, business workflows, usability, information architecture, and basic interaction behavior.

It does **not** validate production architecture, backend, database, performance, security, or scalability, and it is not an MVP, a production application, or the start of one. Its code is disposable.

| Artifact | Main question |
|---|---|
| Wireframe | Where should things be? |
| Mockup | What should it look like? |
| Prototype | How should the user experience it? |

A prototype may sit on top of wireframes or mockups; the three are not interchangeable.

## Quality criteria

Judge a prototype on:

- **Requirement coverage**: every important requirement traces to a screen or interaction.
- **Flow completeness**: start, next action, result, and what happens on cancel or failure.
- **Business rules**: roles, permissions, required fields, validation, status transitions, conditional behavior.
- **State coverage**: loading, empty, normal, success, validation error, system error, disabled, unauthorized, not found. Not all are needed, but any that affect the experience must appear.
- **Usability**: the user knows where they are, what they can do, what happened, and how to recover from an error.
- **Technical feasibility**: development has glanced at the flows so the prototype does not demonstrate behavior the real system cannot support.

## Feedback

Review product behavior, not visual perfection. Classify every piece of feedback (Requirement, Business Rule, User Flow, UI/UX, Missing Scenario, Technical Constraint, Out of Scope) in the prototype brief's feedback log, so it is not all treated as a UI tweak.

## Principles

- **Flow > Function > Usability > Data > Visual polish.** Right flow with plain styling beats a beautiful prototype that misses the workflow.
- **Realistic scenarios.** Mock data must resemble real situations well enough to draw meaningful feedback.
- **Learn, don't commit.** The prototype is a validation tool; keep it lightweight and cheap to discard.
- **Simple, not confusing.** Enough structure that a new user understands each screen without help.

The goal is to answer: *"Are we building the right product, and does the proposed workflow actually work for the people who will use it?"*
