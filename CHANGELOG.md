# Subnet Scout - Change Log

## [Latest Updates] - 2025-07-11

### 🌐 Website Links Integration (Commit: 8606ce2)
**Complete Social Media Integration with Verified Website URLs**

#### Added
- **Backend API Enhancement**: Added `website_url` field to all subnet metadata
- **Verified Website URLs**: Research and integration of official websites:
  - **Taoshi**: https://taoshi.io
  - **Masa**: https://masa.ai  
  - **OpenKaito**: https://kaito.ai
  - **Corcel**: https://corcel.io
  - **WOMBO Dream**: https://wombo.ai
  - **Text Prompting**: https://bittensor.com (OpenTensor Foundation)

#### Frontend Updates
- **SubnetReportCard.jsx**: Website links display in TWO locations
  - Top section: Under subnet title with Globe icon
  - Bottom section: Export/links area for easy access
- **Globe Icon**: Added Lucide Globe icon for website links
- **Green Styling**: Distinctive green color scheme for website buttons

#### Telegram Bot Updates
- **Enhanced Report Cards**: Website links in `/analyze` command
- **Metadata Extraction**: Updated `getSubnetMetadata` to include website URLs
- **Social Links Display**: Format `🌐 [Website](https://example.com)`

#### Data Consistency
- **Backend**: `simple-backend.js` with verified URLs
- **Frontend**: `shared/data/subnets.js` synchronized
- **API Responses**: All endpoints return `website_url` field

---

### 🔒 Security Hardening (Commit: 3a13702)
**GitHub Security Audit Compliance & Enterprise Security**

#### Security Headers Implementation
- **Content-Security-Policy**: Strict CSP preventing XSS attacks
- **Strict-Transport-Security**: HTTPS enforcement with includeSubDomains
- **X-Frame-Options**: DENY to prevent clickjacking
- **X-Content-Type-Options**: nosniff for MIME type protection
- **Referrer-Policy**: strict-origin-when-cross-origin for privacy
- **Permissions-Policy**: Restricted camera, microphone, geolocation access

#### Input Validation & Sanitization
- **Enhanced Subnet ID Validation**: Strict regex and range checking
- **Pagination Security**: Input limits and validation for page/limit parameters
- **Injection Prevention**: Multiple validation layers for API parameters

#### Dependency Security
- **Package Updates**: Updated security-related packages
  - `dotenv`: 17.0.1 → 17.2.0
  - `redis`: 5.5.6 → 5.6.0
  - `vite`: 7.0.2 → 7.0.4
  - `@types/node`: 22.16.0 → 22.16.3
- **Zero Vulnerabilities**: `npm audit` shows clean report

#### Secret Detection Protection
- **Enhanced .secretsignore**: Comprehensive patterns for false positives
- **API Key Patterns**: Regex patterns to ignore environment variable references
- **Documentation Text**: Excluded authentication-related documentation text

---

## Previous Major Updates

### 🐦 Twitter Links Verification (Commit: df2f4a8)
**Research-Verified Social Media Integration**

#### Twitter Link Corrections
- **Text Prompting**: @opentensor (OpenTensor Foundation official)
- **OpenKaito**: @_kaitoai (Kaito AI official account)
- **Masa**: @getmasa (Masa Finance official account)  
- **Taoshi**: @taoshiio (Taoshi official account)

#### Verification Process
- Web research for authentic accounts
- Cross-reference with official project websites
- Removal of questionable/unverified links

---

### 🤖 Telegram Bot Integration (Commit: ece3106)
**Complete Bot Social Media Integration**

#### Fixed Issues
- **Missing Twitter Field**: Added twitter_url extraction from backend API
- **Report Card Display**: Twitter links now appear in Telegram bot reports
- **Data Consistency**: Unified social media data across all platforms

---

## Deployment Status

### Current Production State
- **Frontend (Netlify)**: ✅ Auto-deployed with website links
- **Backend (Railway)**: ✅ Auto-deployed with security headers
- **Telegram Bot**: ✅ Active with enhanced social media integration
- **GitHub Security**: ✅ All audit checks passing

### Monitoring
- **GitHub Actions**: Security audit workflows passing
- **Performance**: No functionality degradation
- **User Experience**: Enhanced with comprehensive social media access

---

## Technical Architecture

### Security Implementation
```javascript
// Security Headers Example
'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
'X-Frame-Options': 'DENY'
```

### API Response Structure
```json
{
  "subnet_id": 8,
  "name": "Taoshi",
  "github_url": "https://github.com/taoshidev/proprietary-trading-network",
  "twitter_url": "https://twitter.com/taoshiio",
  "website_url": "https://taoshi.io"
}
```

### Frontend Integration
- **React Components**: Enhanced with social media links
- **Responsive Design**: Links adapt to mobile/desktop layouts  
- **User Experience**: Multiple access points for social media

---

*Generated: 2025-07-11*
*Maintained by: Subnet Scout Development Team*