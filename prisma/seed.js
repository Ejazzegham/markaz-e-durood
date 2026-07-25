/**
 * Seeds the admin account used to log in to /admin.
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from your .env file.
 *
 * Run with: npm run db:seed
 */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error(
      '\nADMIN_EMAIL and/or ADMIN_PASSWORD are missing from your .env file.\n' +
      'Add both, then run "npm run db:seed" again.\n'
    )
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  console.log(`\nAdmin account ready: ${admin.email}`)
  console.log('You can now log in at /admin/login with the credentials from your .env file.\n')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
