#!/bin/bash

# 🔍 Final Validation Script for SQLite Migration
# This script validates the complete migration before committing to develop

echo "🔍 SQLite Migration Final Validation"
echo "=================================="
echo ""

# 1. Check database file exists
echo "1️⃣ Checking SQLite database..."
if [ -f "prisma/dev.db" ]; then
    echo "✅ SQLite database found: prisma/dev.db"
    SIZE=$(du -h prisma/dev.db | cut -f1)
    echo "   Database size: $SIZE"
else
    echo "❌ SQLite database not found!"
    exit 1
fi

# 2. Check Prisma client is working
echo ""
echo "2️⃣ Testing Prisma client..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
    try {
        const count = await prisma.category.count();
        console.log('✅ Prisma client working - Categories:', count);

        const theories = await prisma.theory.count();
        console.log('✅ Theories count:', theories);

        const summaries = await prisma.summary.count();
        console.log('✅ Summaries count:', summaries);

        const flashcards = await prisma.flashcard.count();
        console.log('✅ Flashcards count:', flashcards);

        const questions = await prisma.question.count();
        console.log('✅ Questions count:', questions);

        await prisma.\$disconnect();
    } catch (error) {
        console.error('❌ Prisma error:', error.message);
        process.exit(1);
    }
}
test();
"

if [ $? -ne 0 ]; then
    echo "❌ Prisma client test failed!"
    exit 1
fi

# 3. Test API endpoints
echo ""
echo "3️⃣ Testing API endpoints..."

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Server not running. Starting development server..."
    npm run dev &
    SERVER_PID=$!
    echo "   Waiting for server to start..."
    sleep 5

    # Check again
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo "❌ Failed to start development server!"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi

    STARTED_SERVER=true
fi

# Test categories API
echo "   Testing /api/categories..."
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/categories)
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    COUNT=$(echo "$BODY" | jq '.data.categories | length' 2>/dev/null || echo "unknown")
    echo "✅ Categories API working - Response: $HTTP_CODE, Count: $COUNT"
else
    echo "❌ Categories API failed - Response: $HTTP_CODE"
    echo "   Body: $BODY"
    if [ "$STARTED_SERVER" = true ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    exit 1
fi

# Test homepage
echo "   Testing homepage..."
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/)
HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Homepage working - Response: $HTTP_CODE"
else
    echo "❌ Homepage failed - Response: $HTTP_CODE"
    if [ "$STARTED_SERVER" = true ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    exit 1
fi

# Clean up server if we started it
if [ "$STARTED_SERVER" = true ]; then
    kill $SERVER_PID 2>/dev/null
    echo "   Development server stopped"
fi

# 4. Check file structure
echo ""
echo "4️⃣ Checking file structure..."

REQUIRED_FILES=(
    "prisma/schema.prisma"
    "src/lib/prisma.ts"
    "src/app/api/categories/route.ts"
    "scripts/migrate-to-sqlite.js"
    "SQLITE_MIGRATION_SUCCESS.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# 5. Check dependencies
echo ""
echo "5️⃣ Checking dependencies..."
if npm list @prisma/client > /dev/null 2>&1; then
    echo "✅ @prisma/client installed"
else
    echo "❌ @prisma/client not found"
    exit 1
fi

if npm list prisma > /dev/null 2>&1; then
    echo "✅ prisma installed"
else
    echo "❌ prisma not found"
    exit 1
fi

# 6. Backup validation
echo ""
echo "6️⃣ Checking backups..."
if [ -f "src/app/api/categories/route-mongodb.ts" ]; then
    echo "✅ MongoDB backup preserved"
else
    echo "⚠️  MongoDB backup not found (might be okay)"
fi

if [ -f "mongodb_export.json" ]; then
    echo "✅ Data backup preserved"
else
    echo "⚠️  Data backup not found (might be okay)"
fi

# 7. Final summary
echo ""
echo "🎉 MIGRATION VALIDATION COMPLETE!"
echo "================================"
echo "✅ All checks passed successfully"
echo "✅ SQLite database is working"
echo "✅ APIs are responding correctly"
echo "✅ All required files present"
echo "✅ Dependencies correctly installed"
echo ""
echo "🚀 Ready to commit to develop branch!"
echo ""
echo "Commands to merge:"
echo "  git add ."
echo "  git commit -m 'feat: migrate from MongoDB to SQLite with Prisma'"
echo "  git checkout develop"
echo "  git merge feature/migrate-to-sqlite"
echo "  git push origin develop"
