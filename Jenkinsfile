pipeline {
    agent any
    options {
        // This is required if you want to clean before build
        skipDefaultCheckout(true)
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
}