# SkillSetu — Jury Demonstration Click Map & Operator Playbook

This document serves as the exact step-by-step navigation map for the presenter during live jury evaluation.

---

## 🗺️ Master Operator Navigation Flow

```
[ 1. Start: /dashboard ] ──► [ 2. Profile: /profile ] ──► [ 3. Capability: /dashboard/capability-intelligence ]
                                                                      │
                                                                      ▼
[ 6. Roadmap: /dashboard/adaptive-roadmap ] ◄── [ 5. Future: /dashboard/future-capabilities ] ◄── [ 4. Skill Gaps: /dashboard/skill-gaps ]
              │
              ├──► [ 7. Submit Evidence & Re-evaluate (v1 ──► v2) ]
              │
              ▼
[ 8. Organization: /organization/dashboard ──► /organization/planning ] ──► [ 9. Conclusion ]
```

---

## 📋 Step-by-Step Operator Table

### Step 1: Opening & Dashboard Overview
- **Page / View**: Individual Dashboard Overview
- **Route**: `http://localhost:5173/dashboard`
- **Action / Click**: Open Dashboard landing page; hover over Target Role badge (**Backend / Cloud Engineer**).
- **What Should Appear**: Candidate overview, Capability Readiness ring (68%), Target Role badge, Priority Gaps summary.
- **What to Say**: *"Welcome to SkillSetu. We're looking at our candidate targeting a Backend Engineer role. Notice that our platform doesn't simply count keywords — it monitors verified capability readiness."*
- **Expected Duration**: 30 Seconds
- **Backup / Failover**: If loading is slow, refresh (`Ctrl+R`) or proceed directly to `/profile`.

---

### Step 2: Claimed vs. Demonstrated Capability
- **Page / View**: User Profile & Skill Inventory
- **Route**: `http://localhost:5173/profile`
- **Action / Click**: Click **Skill & Capability Inventory** tab.
- **What Should Appear**: Two distinct columns/sections: **Claimed Skills** (self-reported) vs. **Demonstrated Capabilities** (evidence-backed). Java shows verified badge; Docker shows `SELF_REPORTED / EVIDENCE_NEEDED`.
- **What to Say**: *"Notice this critical distinction. Claimed Skills are what the user tells us. Demonstrated Capabilities are what verifiable evidence supports. Docker has zero linked project proof, so it starts in an evidence-needed state."*
- **Expected Duration**: 35 Seconds
- **Backup / Failover**: If profile fails, use the Capability Snapshot card on `/dashboard`.

---

### Step 3: Capability Intelligence & Evidence Inspection
- **Page / View**: Capability Intelligence Engine
- **Route**: `http://localhost:5173/dashboard/capability-intelligence`
- **Action / Click**: Click on the **Docker** capability card to open the detail drawer.
- **What Should Appear**: Detail drawer showing Claimed Level (`ADVANCED`), Role Requirement (`INTERMEDIATE`), Evidence Count (`0`), State (`EVIDENCE_NEEDED`), and Evidence Traceability breakdown.
- **What to Say**: *"In the Capability Intelligence drawer, we see that semantic AI understands what Docker is relative to international standards. But our deterministic rule engine marks an Evidence Gap because zero code artifacts are attached."*
- **Expected Duration**: 45 Seconds
- **Backup / Failover**: Detail cards on `/dashboard/skill-gaps` display the identical state breakdown.

---

### Step 4: Target Role & Skill Gap vs. Evidence Gap
- **Page / View**: Skill Gap Diagnosis
- **Route**: `http://localhost:5173/dashboard/skill-gaps`
- **Action / Click**: Filter by **Priority Gaps** $\rightarrow$ select **Docker**.
- **What Should Appear**: Gap breakdown highlighting: Knowledge Gap = `0%` (candidate knows Docker), Evidence Gap = `HIGH` (needs proof).
- **What to Say**: *"Here is our core insight: Skill Gap and Evidence Gap are separate. Docker has zero proficiency gap, but a high evidence gap. Traditional platforms would mark this requirement satisfied; SkillSetu knows the candidate must build proof."*
- **Expected Duration**: 45 Seconds
- **Backup / Failover**: Navigate to `/dashboard/career-intelligence` for the alternative role compatibility view.

---

### Step 5: Future Capability Intelligence
- **Page / View**: Future Capability Intelligence
- **Route**: `http://localhost:5173/dashboard/future-capabilities`
- **Action / Click**: Toggle between **Current Core**, **Near-Term Development**, and **Emerging Direction** tabs.
- **What Should Appear**: Future capability radar, market growth velocity signals, statistical forecast disclaimers, and anti-trend-chasing filter status.
- **What to Say**: *"We don't just chase global trends. Future signals are filtered by role relevance. While Kubernetes is marked high-growth for backend engineering, unrelated trending skills like Healthcare or Mobile UI are excluded from priorities."*
- **Expected Duration**: 40 Seconds
- **Backup / Failover**: The Future Relevance badges on `/dashboard/adaptive-roadmap` also show the market classifications.

---

### Step 6: Adaptive Gap-to-Growth Roadmap
- **Page / View**: Adaptive Development Roadmap
- **Route**: `http://localhost:5173/dashboard/adaptive-roadmap`
- **Action / Click**: Scroll to **Docker: Capability Development Plan**; highlight the skipped `LEARN` stage.
- **What Should Appear**: 5-stage progression (`LEARN` skipped $\rightarrow$ `BUILD` active $\rightarrow$ `VALIDATE` $\rightarrow$ `RE_EVALUATE`). **Next Best Action** card highlighting Docker multi-stage build.
- **What to Say**: *"Look at how the roadmap adapts. Because Docker is an Evidence Gap, the system skips beginner learning and jumps straight to BUILD: create a containerized microservice project."*
- **Expected Duration**: 55 Seconds
- **Backup / Failover**: If milestone actions are collapsed, click the chevron to expand the stage list.

---

### Step 7: Closed-Loop Evidence Submission & Dynamic Re-Evaluation
- **Page / View**: Adaptive Development Roadmap (Interactive Submission)
- **Route**: `http://localhost:5173/dashboard/adaptive-roadmap`
- **Action / Click**:
  1. Click **Submit Project Evidence** on the Docker milestone.
  2. Select demo project: *Microservices Deployment & Docker Engine Optimization*.
  3. Click **Re-Evaluate Roadmap**.
- **What Should Appear**:
  - Notification: *"Roadmap Re-evaluated: 1 capability promoted"*.
  - Version increments from **v1** to **v2** with reason: `EVIDENCE_SUBMITTED`.
  - Docker capability state turns **DEMONSTRATED** (green badge).
  - **Next Best Action** advances to the next priority: *Kubernetes Orchestration*.
- **What to Say**: *"Watch the closed loop. The candidate submits their GitHub repository and triggers re-evaluation. Docker upgrades to Demonstrated, Roadmap Version 2 is generated, and the Next Best Action automatically advances to Kubernetes. The plan adapts to actual progress."*
- **Expected Duration**: 55 Seconds
- **Backup / Failover**: If backend re-evaluate endpoint encounters latency, click the roadmap version dropdown to display the pre-seeded Version 2 history snapshot.

---

### Step 8: Organization Workforce Intelligence & Scenario Planning
- **Page / View**: Organization Workforce Planning
- **Route**: `http://localhost:5173/organization/planning` (or `/organization/dashboard`)
- **Action / Click**: Open Scenario Planning $\rightarrow$ select **12-Month Cloud Native Transformation**.
- **What Should Appear**: Departmental capability heatmap, 3-Way Intervention Mix (**Hire: 4**, **Upskill: 12**, **Redistribute: 3**), privacy disclaimer.
- **What to Say**: *"For organizations, the same capability model drives strategic planning. Leaders model future skill demands through a 3-way mix: Hire external talent, Upskill existing teams, or Redistribute internal resources — with zero opaque employee ranking."*
- **Expected Duration**: 40 Seconds
- **Backup / Failover**: Use `/organization/dashboard` aggregate skill radar if scenario modeling page is unseeded.

---

### Step 9: Architecture Summary & Conclusion
- **Page / View**: Dashboard Home or Presentation Slide
- **Route**: `http://localhost:5173/dashboard`
- **Action / Click**: Return to top navigation.
- **What to Say**: *"SkillSetu bridges what talent claims, what evidence demonstrates, and what the future demands — turning static job search into a continuous, explainable capability development loop. Thank you."*
- **Expected Duration**: 35 Seconds
