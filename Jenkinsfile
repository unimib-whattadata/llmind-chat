pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }
    environment {
        DOCKER_USER = credentials('DOCKER_USER')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        DOCKER_IMAGE_NAME = "fabio975/micare-chat"
    }
    stages {
        stage('Install') {
            agent{
                docker {
                    image 'fabio975/node-22-pnpm'
                }
            }
            steps{
                // install packages
                sh 'pnpm install'
            }
        }
        stage('Package') {
            steps {
                // docker login
                sh "docker login -u='${DOCKER_USER}' -p='${DOCKER_PASSWORD}'"
                // docker build
                sh "docker build -f Dockerfile.Jenkins -t ${DOCKER_IMAGE_NAME} ."
                // docker push
                sh "docker push ${DOCKER_IMAGE_NAME}:latest"
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo Deploy'
                // connect via ssh
                // docker compose down
                // docker compose up --build
            }
        }
    }
    post {
        always {
            deleteDir()
        }
  }
}