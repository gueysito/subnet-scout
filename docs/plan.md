
# 🧭 Subnet Scout Agent — Hackathon Execution Plan (June 20–July 14)

This is your day-by-day guide for shipping the **Subnet Scout Agent** during the [IO Hackathon Q2 2025](https://io.net/hackathon). You’re a **solo builder**, aiming to stay sane and submit a polished MVP that people actually want to use.

---

## 📌 Overview

- **Start:** June 20 (prep)
- **Build:** July 1–13
- **Submit:** July 14
- **Work Schedule:** Monday–Saturday (half-day Saturdays), Sundays OFF
- **Goal:** Ship a working agent with:
  - GitHub activity scoring
  - On-chain data collection (optional)
  - UI (Streamlit or CLI)
  - Clean README + demo video

---

## 🛠️ Phase 1: Prep Work (June 20–30)

### 🎯 Goal:
Set up everything **except the final code**. Prep so well that build phase = “fill in the blanks.”

### ✅ Checklist:

**June 20–22:**
- [ ] Finalize PRD, tech stack, and tools
- [ ] Create folder structure in your repo
- [ ] Draft `README.md` with project vision

**June 23–24:**
- [ ] Test GitHub API (pull commit activity for a known repo)
- [ ] Mock up JSON structure for GitHub scoring
- [ ] Test IO API auth + dummy call

**June 25–26:**
- [ ] Define subnet scoring logic (start as pseudocode or dummy logic)
- [ ] Create fake data file to simulate subnet inputs
- [ ] Decide how you'll rank them (top 3 logic, scoring breakdown)

**June 27–28:**
- [ ] Build Streamlit or CLI skeleton
  - Title, input, and result display placeholders
- [ ] Wire in dummy data to UI

**June 29–30:**
- [ ] Review flow: fake data → score → display
- [ ] Final pre-build checklist
  - Repo ✅
  - Auth ✅
  - UI stub ✅
  - Scoring draft ✅

---

## 🔧 Phase 2: Build Phase (July 1–13)

### 🗓️ Week 1: Core Systems (July 1–6)

**Mon (Jul 1):**  
- [ ] Implement GitHub commit tracker  
- [ ] Save JSON locally or into DB

**Tue (Jul 2):**  
- [ ] Connect IO API to fetch subnet metadata  
- [ ] Parse basic subnet activity

**Wed (Jul 3):**  
- [ ] Implement scoring logic (yield + activity + GitHub)  
- [ ] Test with dummy data

**Thu (Jul 4):**  
- [ ] Feed real data into scoring system  
- [ ] Generate "Top 3 subnets" list

**Fri (Jul 5):**  
- [ ] Connect UI to backend  
- [ ] Display scores visually

**Sat (Jul 6):**  
- [ ] UI polish (headers, tooltips, maybe chart)  
- [ ] Light testing

**Sun (Jul 7):** ❌ REST DAY

---

### 🛠️ Week 2: Polish, Test & Prep (July 8–13)

**Mon (Jul 8):**  
- [ ] Bug fixes, scoring calibration  
- [ ] Add loading states, handle errors

**Tue (Jul 9):**  
- [ ] Write final README (how it works + install guide)  
- [ ] Screenshot UI

**Wed (Jul 10):**  
- [ ] Record demo video or screen capture walk-through  
- [ ] Add to GitHub repo

**Thu (Jul 11):**  
- [ ] Run end-to-end test  
- [ ] Ask a friend to try it or test on fresh machine

**Fri (Jul 12):**  
- [ ] Make it “presentable”  
  - Remove debug logs
  - Ensure it looks clean

**Sat (Jul 13):**  
- [ ] Final repo check  
- [ ] Backup everything  
- [ ] REST after 2PM

---

## 🚀 Phase 3: Submission (July 14)

**Mon (Jul 14):**
- [ ] Confirm GitHub is public + has README + demo link
- [ ] Submit on IO Hackathon site
- [ ] Share on X with a clean post

---

## 💡 Tips for Solo Builders

- **Cognitive Preload:** Decide *before* July 1 what files, folders, and APIs you’ll use.
- **3-4 Focused Hours/Day:** You don’t need to work 12 hours if you prep smart.
- **"Top 3, Not Top 30":** Don’t overbuild. Focus on making 3 things shine.
- **Rest = Speed:** No one builds their best work tired. Sleep, eat, stretch.

---

🧠 **Remember:** This is just the beginning. Build it, ship it, and see who vibes with it. You can always expand post-hackathon.

