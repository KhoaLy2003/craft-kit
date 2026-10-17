Phase 3 now works as a repeatable change cycle for new customer requirements (experimental).

- **Requirements first:** Discover starts from what customers or stakeholders asked for, and records who asked.
- **One design for the whole release:** a new hard-gated Design step produces data model, flow, architecture and screen changes for every feature together, with a Shared Surface table giving each shared data point one owner, so features that touch the same data cannot conflict.
- **Parallel work:** Handoff splits the release into work packages and groups; features in the same group can be built at the same time, each on its own branch from the merged design PR.
- **Scope changes:** a dropped feature is marked `cancelled` with a reason, and its logged design changes are reverted (shared ones stay with a surviving feature).
- **Closeout:** a final step records the outcome and resolves leftover features.
- Backlog board gains a Cancelled column; overview and Phase 2 diagrams updated.
