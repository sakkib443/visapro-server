/**
 * Seed extra visa categories (Pilgrimage, Family) and assign matching visa types.
 * Also re-matches a few stragglers that the first migration missed.
 *
 * Run:  npx ts-node --transpile-only src/scripts/seedExtraCategories.ts
 */

import mongoose from 'mongoose';
import config from '../app/config';
import { Country } from '../app/modules/country/country.model';
import { VisaCategory } from '../app/modules/visaCategory/visaCategory.model';

const NEW_CATEGORIES = [
    {
        name: 'Pilgrimage Visa',
        nameBn: 'তীর্থযাত্রা ভিসা',
        slug: 'pilgrimage-visa',
        description: 'Visa for Hajj, Umrah, and other religious pilgrimages',
        descriptionBn: 'হজ্জ, উমরাহ এবং অন্যান্য ধর্মীয় তীর্থযাত্রার জন্য ভিসা',
        icon: '🕌',
        order: 7,
    },
    {
        name: 'Family Visa',
        nameBn: 'ফ্যামিলি ভিসা',
        slug: 'family-visa',
        description: 'Visa for visiting or joining family members abroad',
        descriptionBn: 'বিদেশে পরিবারের সদস্যদের সাথে দেখা বা যোগদানের জন্য ভিসা',
        icon: '👨‍👩‍👧',
        order: 8,
    },
];

// Extended keyword rules — covers the new categories + stragglers
const KEYWORD_RULES: Array<{ slug: string; patterns: RegExp[] }> = [
    {
        slug: 'pilgrimage-visa',
        patterns: [/\bumrah\b/i, /\bhajj\b/i, /\bpilgrim/i],
    },
    {
        slug: 'family-visa',
        patterns: [/\bfamily\b/i, /\bspouse\b/i, /\bdependent\b/i],
    },
    {
        slug: 'tourist-visa',
        patterns: [
            /\btourist\b/i,
            /\bvisitor\b/i,
            /\btour\b/i,
            /\bsticker\s+visa\b/i,
            /\bvisa\s+on\s+arrival\b/i,
            /\bvoa\b/i,
        ],
    },
];

function guess(name: string, validSlugs: Set<string>): string | null {
    if (!name) return null;
    for (const rule of KEYWORD_RULES) {
        if (!validSlugs.has(rule.slug)) continue;
        if (rule.patterns.some((re) => re.test(name))) return rule.slug;
    }
    return null;
}

async function run() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(config.database_url);
        console.log('✅ Connected\n');

        // ───── Create new categories (skip if already exist) ─────
        console.log('📂 Seeding new visa categories...');
        for (const cat of NEW_CATEGORIES) {
            const existing = await VisaCategory.findOne({ slug: cat.slug });
            if (existing) {
                console.log(`  ⏭️  ${cat.name} already exists`);
                continue;
            }
            await VisaCategory.create({ ...cat, isActive: true });
            console.log(`  ✅ Created: ${cat.icon} ${cat.name}`);
        }
        console.log();

        // ───── Re-match unmatched visa types ─────
        const validSlugs = new Set<string>(
            (await VisaCategory.find({ isActive: true }).select('slug')).map((c) => c.slug)
        );
        console.log(`📋 Active categories: ${[...validSlugs].join(', ')}\n`);

        const countries = await Country.find();
        let assigned = 0;
        let stillUnmatched: Array<{ country: string; name: string }> = [];

        console.log('🔄 Re-matching previously unmatched visa types...\n');

        for (const country of countries) {
            if (!country.visaTypes || country.visaTypes.length === 0) continue;
            let dirty = false;
            for (const vt of country.visaTypes) {
                if (vt.categorySlug && validSlugs.has(vt.categorySlug)) continue;
                const slug = guess(vt.name, validSlugs);
                if (slug) {
                    vt.categorySlug = slug;
                    assigned++;
                    dirty = true;
                    console.log(`  ✅ ${country.name.padEnd(20)} | ${vt.name.padEnd(30)} → ${slug}`);
                } else {
                    stillUnmatched.push({ country: country.name, name: vt.name });
                }
            }
            if (dirty) await country.save();
        }

        console.log('\n──────────── Summary ────────────');
        console.log(`Newly assigned : ${assigned}`);
        console.log(`Still unmatched: ${stillUnmatched.length}`);

        if (stillUnmatched.length > 0) {
            console.log('\n⚠️  These still need manual category assignment:');
            for (const u of stillUnmatched) {
                console.log(`  • ${u.country} → "${u.name}"`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

run();
