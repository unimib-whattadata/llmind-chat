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
            }
        }
        stage('Build') {
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