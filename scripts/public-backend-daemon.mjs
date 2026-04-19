import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const stateDir = path.join(os.homedir(), '.para-practice-local')
const stateFile = path.join(stateDir, 'public-backend.json')
const backendPort = process.env.BACKEND_PORT ?? '3000'
const publicBackendUrl =
  process.env.PUBLIC_BACKEND_URL ?? 'https://para-practice-jasonmeans.loca.lt'
const publicBackendSubdomain =
  process.env.PUBLIC_BACKEND_SUBDOMAIN ?? 'para-practice-jasonmeans'
const npxBinary = process.env.NPX_BIN ?? 'npx'

function log(message) {
  console.log(`[public-backend] ${message}`)
}

function readState() {
  try {
    return JSON.parse(readFileSync(stateFile, 'utf8'))
  } catch {
    return {}
  }
}

function writeState(nextState) {
  mkdirSync(stateDir, { recursive: true })
  writeFileSync(stateFile, JSON.stringify(nextState, null, 2))
}

function rememberPublicUrl() {
  writeState({
    ...readState(),
    currentUrl: publicBackendUrl,
    deployedUrl: publicBackendUrl,
    updatedAt: new Date().toISOString(),
    deployedAt: new Date().toISOString(),
  })
}

async function runTunnelOnce() {
  log(
    `Starting localtunnel on localhost:${backendPort} as ${publicBackendSubdomain}`
  )
  rememberPublicUrl()

  return new Promise((resolve) => {
    const child = spawn(
      npxBinary,
      [
        '--yes',
        'localtunnel@2.0.2',
        '--port',
        backendPort,
        '--subdomain',
        publicBackendSubdomain,
      ],
      {
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    )

    const handleOutput = (chunk) => {
      const line = chunk.toString().trim()

      if (!line) {
        return
      }

      console.log(line)

      if (line.includes('your url is:')) {
        rememberPublicUrl()
      }
    }

    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.on('error', (error) => {
      console.error(`[public-backend] ${error.message}`)
    })
    child.on('exit', (code, signal) => {
      log(`Tunnel exited with code ${code ?? 'null'} signal ${signal ?? 'null'}`)
      resolve()
    })
  })
}

while (true) {
  await runTunnelOnce()
  await delay(5_000)
}
