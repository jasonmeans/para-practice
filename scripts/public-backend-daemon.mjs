import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoDir = path.resolve(__dirname, '..')
const stateDir = path.join(os.homedir(), '.para-practice-local')
const stateFile = path.join(stateDir, 'public-backend.json')
const backendPort = process.env.BACKEND_PORT ?? '3000'
const repository = process.env.GITHUB_REPOSITORY ?? 'jasonmeans/para-practice'
const workflow = process.env.GITHUB_PAGES_WORKFLOW ?? 'deploy-pages.yml'
const sshBinary = process.env.SSH_BIN ?? '/usr/bin/ssh'
const ghBinary = process.env.GH_BIN ?? 'gh'
const disableGitHubSync = process.env.DISABLE_GITHUB_SYNC === '1'

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

async function runGh(args) {
  if (disableGitHubSync) {
    return
  }

  await new Promise((resolve, reject) => {
    const child = spawn(ghBinary, args, {
      cwd: repoDir,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stderr = ''

    child.stdout.on('data', (chunk) => process.stdout.write(chunk))
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
      process.stderr.write(chunk)
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(stderr.trim() || `gh exited with code ${code}`))
    })
  })
}

async function syncPublicUrl(publicUrl) {
  const state = readState()

  if (state.deployedUrl === publicUrl) {
    writeState({
      ...state,
      currentUrl: publicUrl,
      updatedAt: new Date().toISOString(),
    })
    return
  }

  writeState({
    ...state,
    currentUrl: publicUrl,
    updatedAt: new Date().toISOString(),
  })

  if (disableGitHubSync) {
    log(`GitHub sync disabled; current public backend is ${publicUrl}`)
    return
  }

  log(`Syncing ${publicUrl} to ${repository}`)
  await runGh(['secret', 'set', 'VITE_LOCAL_API_BASE_URL', '-R', repository, '-b', publicUrl])
  await runGh(['workflow', 'run', workflow, '-R', repository])

  writeState({
    ...readState(),
    currentUrl: publicUrl,
    deployedUrl: publicUrl,
    deployedAt: new Date().toISOString(),
  })
  log(`Triggered GitHub Pages workflow with backend ${publicUrl}`)
}

function pipeLines(stream, onLine) {
  let buffer = ''

  stream.on('data', (chunk) => {
    buffer += chunk.toString()

    while (true) {
      const newlineIndex = buffer.indexOf('\n')

      if (newlineIndex === -1) {
        break
      }

      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)

      if (line) {
        onLine(line)
      }
    }
  })
}

function extractPublicUrl(line) {
  if (!line.includes('tunneled with tls termination')) {
    return null
  }

  const match = line.match(/https:\/\/\S+/)

  if (!match) {
    return null
  }

  return match[0]
}

async function runTunnelOnce() {
  log(`Starting public tunnel on localhost:${backendPort}`)

  return new Promise((resolve) => {
    const child = spawn(
      sshBinary,
      [
        '-o',
        'StrictHostKeyChecking=no',
        '-o',
        'ServerAliveInterval=30',
        '-o',
        'ExitOnForwardFailure=yes',
        '-R',
        `80:localhost:${backendPort}`,
        'nokey@localhost.run',
      ],
      {
        cwd: repoDir,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    )

    let syncingUrl = null

    const handleLine = (line) => {
      console.log(line)
      const publicUrl = extractPublicUrl(line)

      if (!publicUrl || publicUrl === syncingUrl) {
        return
      }

      syncingUrl = publicUrl
      syncPublicUrl(syncingUrl).catch((error) => {
        console.error(`[public-backend] ${error.message}`)
      })
    }

    pipeLines(child.stdout, handleLine)
    pipeLines(child.stderr, handleLine)

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
