#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MongoDB for Healthcare+ System...\n');

try {
  // Step 1: Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Step 2: Push schema to MongoDB
  console.log('\n🗄️  Pushing schema to MongoDB...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Step 3: Seed the database
  console.log('\n🌱 Seeding database with mock data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('\n✅ MongoDB setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your backend server: npm run dev');
  console.log('2. Your MongoDB database is now populated with sample data');
  console.log('3. You can view your data using MongoDB Compass or Atlas UI');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n🔧 Manual setup steps:');
  console.log('1. npx prisma generate');
  console.log('2. npx prisma db push');
  console.log('3. npm run db:seed');
  process.exit(1);
}