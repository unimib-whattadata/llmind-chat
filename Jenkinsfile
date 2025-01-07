def remote = [:]
remote.user = 'janus-inside'
remote.allowAnyHosts = true

pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }
    environment {
        DOCKER_USER = credentials('DOCKER_USER')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        DOCKER_IMAGE_NAME = "fabio975/micare-chat"
        MINIZEUS_IP = credentials('MINIZEUS_IP')
        MINIZEUS_PASSWORD = credentials('MINIZEUS_PASSWORD')
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
            when{
                branch "main"
            }
            steps {
                sh "docker login -u='${DOCKER_USER}' -p='${DOCKER_PASSWORD}'"
                sh "docker build -f Dockerfile.Jenkins -t ${DOCKER_IMAGE_NAME} ."
                sh "docker push ${DOCKER_IMAGE_NAME}:latest"
            }
        }
        stage('Deploy') {
            when{
                branch "main"
            }
            steps {
                script {
                    remote.name = env.MINIZEUS_IP
                    remote.host = env.MINIZEUS_IP
                    remote.password = env.MINIZEUS_PASSWORD
                }
                sshCommand(remote: remote, command: "cd ../../data/LLMind-jenkins && docker compose down && docker image rm ${DOCKER_IMAGE_NAME}:latest && docker compose up --build -d")
            }
        }
    }
    post {
        always {
            deleteDir()
        }
  }
}