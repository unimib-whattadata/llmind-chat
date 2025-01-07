pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }
    environment {
        POSTGRESQL_PASS="micare_chat2024!"
        POSTGRES_HOST="localhost"
        POSTGRES_PORT="5432"
        POSTGRES_DB="micare_chat"
        POSTGRES_USER="postgres"
        MICARE_CHAT_OUTSIDEPORT="3001"
        LLM_API = 'http://149.132.176.54:5000/askLLM'
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