const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const spawn = require('child_process').spawn

const sendNotification = require('./sendNotification')

const app = express()

const gitlabFrontEndToken = 'FrontEndSecretToken'
const gitlabApiToken = 'API_SecretToken'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))

function deploy (scriptPath) {
  // don't forget set chown 755 to deployClient.sh and deployApi.sh
  const process = spawn(scriptPath)

  process.stdout.on('data', data => {
    console.log(data.toString('utf8'))
  })

  process.on('exit', () => {
    console.log('success: process exit')
    sendNotification(`deploy.supersite.com: ${scriptPath} executed successfully`)
  })

  process.on('error', error => {
    console.log('error: ' + error.toString('utf8'))
    sendNotification(`deploy.supersite.com: ${scriptPath} execution failed. Error: ${error.toString('utf8')}`)
  })
}

app.post('/', (req, res) => {
  if (req.body.ref === 'refs/heads/master') {
    if (req.headers['x-gitlab-token'] === gitlabFrontEndToken) {
      deploy('./deployClient.sh')
    }
    if (req.headers['x-gitlab-token'] === gitlabApiToken) {
      deploy('./deployApi.sh')
    }
  }
  res.end()
})

// no route found handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: '404, No route found' })
})

// development error handler
if (app.get('env') === 'development') {
  app.use((error, req, res, next) => {
    if (error.stack) {
      console.log('error.stack >>');
      console.log(error.stack);
    }

    res.status(error.status).json({
      success: false,
      description: error.message || error,
      env: 'development/regular'
    });
  });
}

// production error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    description: error.message || error,
    env: 'production/regular'
  });
});

// uncaughtException error handler
process.on('uncaughtException', (error) => {
  console.error((new Date).toUTCString() + ' uncaughtException:', error.message);
  console.log('error.stack >>');
  console.error(error.stack);
  process.exit(1);
});

app.listen(8000, () => {
  console.log('App listening on port: 8000')
})
