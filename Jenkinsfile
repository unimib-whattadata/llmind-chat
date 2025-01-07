pipeline {
    agent{
        docker {
            image 'fabio975/node-22-pnpm'
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }
    environment {
        LLM_API = '...'
    }
    stages {
        stage('Install') {
            steps{
                sh 'pnpm install'
                sh 'touch file.txt'
            }
        }
        stage('Build') {
            steps{
                sh 'ls'
                sh 'pnpm build'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
  }
}