import dataSource from './data-source'

async function runMigrations(): Promise<void> {
  try {
    await dataSource.initialize()
    const applied = await dataSource.runMigrations({ transaction: 'all' })

    if (applied.length === 0) {
      console.log('[migration] schema is current')
      return
    }

    console.log(`[migration] applied: ${applied.map((migration) => migration.name).join(', ')}`)
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy()
    }
  }
}

void runMigrations().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[migration] failed: ${message}`)
  process.exitCode = 1
})
