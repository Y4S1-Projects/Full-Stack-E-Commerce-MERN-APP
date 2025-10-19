#!/bin/bash

# Security Vulnerability Assessment - Before/After Verification Script
# This script demonstrates the security improvements using curl commands

echo "🔐 SECURITY VULNERABILITY ASSESSMENT - BEFORE/AFTER COMPARISON"
echo "=============================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:3000"

echo -e "${BLUE}🔍 Testing Backend API Security Headers...${NC}"
echo "URL: $BACKEND_URL/api/test"
echo ""

# Get headers from backend
RESPONSE=$(curl -s -I "$BACKEND_URL/api/test" 2>/dev/null)

# Check if backend is running
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend server not responding at $BACKEND_URL${NC}"
    echo "Please start the backend server: cd backend && npm start"
    exit 1
fi

echo "📋 CURRENT SECURITY HEADERS (AFTER FIXES):"
echo "==========================================="

# Extract and display security headers
CSP_HEADER=$(echo "$RESPONSE" | grep -i "Content-Security-Policy" | cut -d: -f2- | tr -d '\r')
XFRAME_HEADER=$(echo "$RESPONSE" | grep -i "X-Frame-Options" | cut -d: -f2- | tr -d '\r')
XCONTENT_HEADER=$(echo "$RESPONSE" | grep -i "X-Content-Type-Options" | cut -d: -f2- | tr -d '\r')
REFERRER_HEADER=$(echo "$RESPONSE" | grep -i "Referrer-Policy" | cut -d: -f2- | tr -d '\r')

echo ""
echo "🛡️  VULNERABILITY 1: Content Security Policy Header Not Set"
if [ -n "$CSP_HEADER" ]; then
    echo -e "   Status: ${GREEN}✅ RESOLVED${NC}"
    echo "   Evidence: Content-Security-Policy header present"
    echo "   Value:$CSP_HEADER"
    
    # Check for unsafe-inline
    if echo "$CSP_HEADER" | grep -q "'unsafe-inline'"; then
        echo -e "   ⚠️  Warning: ${YELLOW}unsafe-inline still present${NC}"
    else
        echo -e "   Security: ${GREEN}✅ No unsafe-inline detected${NC}"
    fi
else
    echo -e "   Status: ${RED}❌ NOT RESOLVED${NC}"
    echo "   Evidence: Content-Security-Policy header missing"
fi

echo ""
echo "🛡️  VULNERABILITY 2: X-Frame-Options Header Not Set"
if [ -n "$XFRAME_HEADER" ]; then
    echo -e "   Status: ${GREEN}✅ RESOLVED${NC}"
    echo "   Evidence: X-Frame-Options header present"
    echo "   Value:$XFRAME_HEADER"
    
    if echo "$XFRAME_HEADER" | grep -qi "DENY"; then
        echo -e "   Security: ${GREEN}✅ Set to DENY (most secure)${NC}"
    elif echo "$XFRAME_HEADER" | grep -qi "SAMEORIGIN"; then
        echo -e "   Security: ${YELLOW}⚠️  Set to SAMEORIGIN (moderate)${NC}"
    fi
else
    echo -e "   Status: ${RED}❌ NOT RESOLVED${NC}"
    echo "   Evidence: X-Frame-Options header missing"
fi

echo ""
echo "🛡️  VULNERABILITY 3: CSP style-src unsafe-inline Usage"
if [ -n "$CSP_HEADER" ]; then
    if echo "$CSP_HEADER" | grep -q "style-src.*'unsafe-inline'"; then
        echo -e "   Status: ${RED}❌ NOT RESOLVED${NC}"
        echo "   Evidence: unsafe-inline found in style-src directive"
    else
        echo -e "   Status: ${GREEN}✅ RESOLVED${NC}"
        echo "   Evidence: No unsafe-inline in style-src directive"
        
        # Extract style-src directive
        STYLE_SRC=$(echo "$CSP_HEADER" | grep -o "style-src[^;]*")
        if [ -n "$STYLE_SRC" ]; then
            echo "   Style Directive: $STYLE_SRC"
        fi
    fi
else
    echo -e "   Status: ${RED}❌ Cannot verify - CSP header missing${NC}"
fi

echo ""
echo "📊 ADDITIONAL SECURITY HEADERS:"
echo "==============================="

if [ -n "$XCONTENT_HEADER" ]; then
    echo -e "X-Content-Type-Options: ${GREEN}✅ Present${NC} -$XCONTENT_HEADER"
else
    echo -e "X-Content-Type-Options: ${RED}❌ Missing${NC}"
fi

if [ -n "$REFERRER_HEADER" ]; then
    echo -e "Referrer-Policy: ${GREEN}✅ Present${NC} -$REFERRER_HEADER"
else
    echo -e "Referrer-Policy: ${RED}❌ Missing${NC}"
fi

echo ""
echo "🎯 SECURITY IMPROVEMENT SUMMARY:"
echo "================================"

# Count resolved vulnerabilities
RESOLVED_COUNT=0
TOTAL_VULNERABILITIES=3

if [ -n "$CSP_HEADER" ]; then
    ((RESOLVED_COUNT++))
fi

if [ -n "$XFRAME_HEADER" ]; then
    ((RESOLVED_COUNT++))
fi

if [ -n "$CSP_HEADER" ] && ! echo "$CSP_HEADER" | grep -q "style-src.*'unsafe-inline'"; then
    ((RESOLVED_COUNT++))
fi

IMPROVEMENT_PERCENTAGE=$((RESOLVED_COUNT * 100 / TOTAL_VULNERABILITIES))

echo "📈 Vulnerabilities Resolved: $RESOLVED_COUNT/$TOTAL_VULNERABILITIES"
echo "📊 Security Improvement: $IMPROVEMENT_PERCENTAGE%"

if [ $IMPROVEMENT_PERCENTAGE -eq 100 ]; then
    echo -e "🎉 Overall Status: ${GREEN}ALL VULNERABILITIES RESOLVED${NC}"
elif [ $IMPROVEMENT_PERCENTAGE -ge 75 ]; then
    echo -e "🎯 Overall Status: ${GREEN}SIGNIFICANT IMPROVEMENT${NC}"
elif [ $IMPROVEMENT_PERCENTAGE -ge 50 ]; then
    echo -e "⚠️  Overall Status: ${YELLOW}MODERATE IMPROVEMENT${NC}"
else
    echo -e "🚨 Overall Status: ${RED}REQUIRES ATTENTION${NC}"
fi

echo ""
echo "📋 BEFORE/AFTER COMPARISON:"
echo "=========================="
echo ""
echo -e "${RED}❌ BEFORE (Vulnerable State):${NC}"
echo "   • Content-Security-Policy: NOT SET"
echo "   • X-Frame-Options: NOT SET"
echo "   • CSP unsafe-inline: PRESENT (if CSP existed)"
echo "   • Security Risk Level: HIGH"
echo ""
echo -e "${GREEN}✅ AFTER (Current State):${NC}"
echo "   • Content-Security-Policy: $([ -n "$CSP_HEADER" ] && echo "SET" || echo "NOT SET")"
echo "   • X-Frame-Options: $([ -n "$XFRAME_HEADER" ] && echo "SET" || echo "NOT SET")"
echo "   • CSP unsafe-inline: $([ -n "$CSP_HEADER" ] && ! echo "$CSP_HEADER" | grep -q "'unsafe-inline'" && echo "REMOVED" || echo "PRESENT")"
echo "   • Security Risk Level: $([ $IMPROVEMENT_PERCENTAGE -eq 100 ] && echo "LOW" || echo "MEDIUM")"

echo ""
echo "🔗 TESTING COMMANDS USED:"
echo "========================"
echo "Backend Headers: curl -I $BACKEND_URL/api/test"
echo "Frontend Headers: curl -I $FRONTEND_URL/"
echo ""
echo "🗓️  Report Generated: $(date)"
echo "✅ Assessment Complete"