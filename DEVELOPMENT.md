# 🔧 Development Guidelines

## 🌿 **MANDATORY: Feature Branch Workflow**

**Effective: July 5, 2025**

All development MUST use feature branches. No direct commits to main.

### **📋 Process:**

```bash
# 1. Create feature branch
git checkout -b feature/descriptive-name

# 2. Develop and test
# ... make changes ...

# 3. Stage and commit
git add .
git commit -m "feat: Descriptive commit message with details"

# 4. Push feature branch
git push -u origin feature/descriptive-name

# 5. Merge to main
git checkout main
git merge feature/descriptive-name
git push origin main
```

### **📝 Branch Naming:**
- `feature/milestone-name` - Major milestones
- `feature/component-name` - Individual components
- `fix/issue-description` - Bug fixes
- `security/security-enhancement` - Security improvements

### **✅ Benefits for Hackathon:**
- **Organized Development**: Clear milestone tracking
- **Professional Workflow**: Impressive to judges
- **Safer Development**: Main branch stays stable
- **Better History**: Easy to showcase specific features

### **🚨 Previous History:**
Early milestones (July 1-4) were committed directly to main but have excellent commit messages. This workflow applies to all development from July 5 forward.

## 🎯 **Other Development Rules:**

1. **API Priority**: Always use `/api/score/enhanced` for user-facing features
2. **Real Data**: Live APIs first, realistic fallbacks only
3. **Security**: Rate limiting, input validation, proper error handling
4. **Testing**: Test before merging to main
5. **Documentation**: Update scratchpad and roadmap with progress

---

*This ensures professional development practices and impressive presentation to hackathon judges.* 