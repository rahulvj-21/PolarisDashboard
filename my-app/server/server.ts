import compression from 'compression'
import express from 'express'
import history from 'connect-history-api-fallback'
import path from 'node:path'

const PORT = Number(process.env.PORT ?? 4173)
const HOST = process.env.HOST ?? '0.0.0.0'

const distDir = path.resolve(process.cwd(), 'dist')

const app = express()
app.disable('x-powered-by')
app.use(compression())

app.use(
  history({
    disableDotRule: true,
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  }),
)

app.use(express.static(distDir, { index: 'index.html' }))

app.listen(PORT, HOST, () => {
  console.log(`Polaris dashboard running at http://${HOST}:${PORT}/visualize`)
})

