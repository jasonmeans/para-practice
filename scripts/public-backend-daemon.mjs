import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const stateDir = path.join(os.homedir(), '.para-practice-local')
const stateFile = path.join(stateDir, 'public-backend.json')
const backendPort = process.env.BACKEND_PORT ?? '3000'
const cloudflaredBinary =
  process.env.CLOUDFLARED_BIN ?? '/opt/homebrew/opt/cloudflared/bin/cloudflared'

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

function rememberPublicUrl(publicUrl) {
  writeState({
    ...readState(),
    currentUrl: publicUrl,
    deployedUrl: publicUrl,
    updatedAt: new Date().toISOString(),
    deployedAt: new Date().toISOString(),
  })
}

async function runTunnelOnce() {
  log(`Starting cloudflared quick tunnel for localhost:${backendPort}`)

  return new Promise((resolve) => {
    const child = spawn(
      cloudflaredBinary,
      [
        'tunnel',
        '--url',
        `http://127.0.0.1:${backendPort}`,
        '--no-autoupdate',
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

      const match = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)

      if (match) {
        rememberPublicUrl(match[0])
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
