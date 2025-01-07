pipeline {
    agent{
        docker {
            image 'fabio975/node-22-pnpm'
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }
    stages {
        stage('Install') {
            steps{
                sh 'echo Install'
                sh 'touch file.txt'
                sh 'ls'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
  }
}