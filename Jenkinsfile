pipeline {
    agent{
        docker {
            image 'fabio975/node-22-pnpm'
        }
    }
    options {
        // This is required if you want to clean before build
        skipDefaultCheckout(true)
    }
    stages {
        stage('Install') {
            steps{
                sh 'pnpm install'
            }
        }
        stage('Build') {
            steps {
                sh 'pnpm build'
            }
        }
        stage('Package') {
            steps {
                echo 'Package....'
            }
        }
    }
}
