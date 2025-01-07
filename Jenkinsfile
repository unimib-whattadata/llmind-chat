pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
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
        stage('Package') {
            steps {
                sh 'docker build -f Dockerfile.Jenkins -t fabio975/micare-chat .'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
  }
}