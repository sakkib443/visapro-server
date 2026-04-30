/**
 * Migration: Auto-assign categorySlug to existing Country.visaTypes[]
 *
 * Strategy: keyword-match each visaType.name against known visa category slugs.
 * Skips visa types that already have a categorySlug.
 *
 * Run:  npx ts-node --transpile-only src/scripts/migrateVisaTypeCategories.ts
 */

import mongoose from 'mongoose';
import config from '../app/config';
import { Country } from '../app/modules/country/country.model';
import { VisaCategory } from '../app/modules/visaCategory/visaCategory.model';

// Map of keywords → category slug (in priority order — first match wins)
const KEYWORD_RULES: Array<{ slug: string; patterns: RegExp[] }> = [
    {
        slug: 'transit-visa',
        patterns: [/\btransit\b/i],
    },
    {
        slug: 'medical-visa',
        patterns: [/\bmedical\b/i, /\btreatment\b/i, /\bhealth\b/i],
    },
    {
        slug: 'student-visa',
        patterns: [/\bstudent\b/i, /\bstudy\b/i, /\beducation\b/i],
    },
    {
        slug: 'business-visa',
        patterns: [/\bbusiness\b/i, /\bcommercial\b/i, /\bcorporate\b/i, /\binvestor\b/i],
    },
    {
        slug: 'working-visa',
        patterns: [
            /\bwork(ing)?\b/i,
            /\bemploy(ment)?\b/i,
            /\bskilled\b/i,
            /\blabor(er)?\b/i,
            /\bdomestic\s+helper\b/i,
            /\bj-\d/i, // J-1 visa
            /\bh-\d/i, // H-1B visa
        ],
    },
    {
        slug: 'tourist-visa',
        patterns: [
            /\btourist\b/i,
            /\bvisitor\b/i,
            /\btour\b/i,
            /\bholiday\b/i,
            /\bleisure\b/i,
            /\bb-\d/i, // B-1/B-2 visa
            /\bevisa\b/i, // generic e-visa often tourist
            /\be-?visa\b/i,
        ],
    },
];

function guessCategory(name: string, validSlugs: Set<string>): string | null {
    if (!name) return null;
    for (const rule of KEYWORD_RULES) {
        if (!validSlugs.has(rule.slug)) continue;
        if (rule.patterns.some((re) => re.test(name))) return rule.slug;
    }
    return null;
}

async function migrate() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(config.database_url);
        console.log('✅ Connected\n');

        // Fetch valid category slugs so we never assign a slug that doesn't exist
        const categories = await VisaCategory.find({ isActive: true }).select('slug name');
        const validSlugs = new Set<string>(categories.map((c) => c.slug));
        console.log(`📋 Found ${categories.length} active visa categories: ${[...validSlugs].join(', ')}\n`);

        const countries = await Country.find();
        console.log(`🌍 Scanning ${countries.length} countries...\n`);

        let totalVisaTypes = 0;
        let assigned = 0;
        let alreadySet = 0;
        let unmatched: Array<{ country: string; name: string }> = [];

        for (const country of countries) {
            if (!country.visaTypes || country.visaTypes.length === 0) continue;
            let dirty = false;
            for (const vt of country.visaTypes) {
                totalVisaTypes++;
                if (vt.categorySlug && validSlugs.has(vt.categorySlug)) {
                    alreadySet++;
                    continue;
                }
                const guess = guessCategory(vt.name, validSlugs);
                if (guess) {
                    vt.categorySlug = guess;
                    assigned++;
                    dirty = true;
                    console.log(`  ✅ ${country.name.padEnd(20)} | ${vt.name.padEnd(30)} → ${guess}`);
                } else {
                    unmatched.push({ country: country.name, name: vt.name });
                }
            }
            if (dirty) await country.save();
        }

        console.log('\n──────────── Summary ────────────');
        console.log(`Total visa types scanned : ${totalVisaTypes}`);
        console.log(`Already had categorySlug : ${alreadySet}`);
        console.log(`Newly assigned           : ${assigned}`);
        console.log(`Could not match          : ${unmatched.length}`);

        if (unmatched.length > 0) {
            console.log('\n⚠️  Unmatched visa types (admin should set manually):');
            for (const u of unmatched) {
                console.log(`  • ${u.country} → "${u.name}"`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Migration error:', err);
        process.exit(1);
    }
}

migrate();
