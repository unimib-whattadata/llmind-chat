pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }
    environment {
        POSTGRESQL_PASS="..."
        POSTGRES_HOST="..."
        POSTGRES_PORT="..."
        POSTGRES_DB="..."
        POSTGRES_USER="..."
        MICARE_CHAT_OUTSIDEPORT="..."
        LLM_API = '...'
    }
    stages {
        stage('Install') {
            agent{
                docker {
                    image 'fabio975/node-22-pnpm'
                }
            }
            steps{
                sh 'pnpm install'
            }
        }
        stage('Build') {
            agent{
                docker {
                    image 'fabio975/node-22-pnpm'
                }
            }
            steps{
                sh 'pnpm build'
            }
        }
        stage('Package') {
            environment {
                LLM_API = '...'
            }
            steps {
                sh 'docker build -t fabio975/micare-chat .'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
  }
}