"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback, useRef } from "react"
import { Timer, Trophy, Keyboard, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const commandsList = [
  // Git基本操作
  "git init",
  "git clone git@github.com:user/repo.git",
  "git add .",
  "git commit -m 'feat: add new feature'",
  "git commit -m 'fix: resolve issue'",
  "git commit -m 'docs: update readme'",
  "git push origin main",
  "git pull origin main",
  "git fetch --all",
  "git checkout -b feature/new-feature",
  "git merge develop",
  "git rebase main",
  "git stash",
  "git stash pop",
  "git reset --hard HEAD^",
  "git log --oneline",
  "git blame README.md",
  "git diff HEAD~1",
  "git tag v1.0.0",
  "git remote add origin",

  // Node.js & npm
  "npm init -y",
  "npm install",
  "npm install --save-dev typescript",
  "npm run build",
  "npm run dev",
  "npm test",
  "npm audit fix",
  "npm update",
  "npm publish",
  "npm link",
  "npx create-next-app@latest",
  "npx create-react-app my-app",
  "node index.js",
  "node --inspect app.js",
  "nvm use 18",

  // Yarn
  "yarn install",
  "yarn add package-name",
  "yarn remove package-name",
  "yarn upgrade",
  "yarn build",
  "yarn dev",
  "yarn start",
  "yarn test",
  "yarn create next-app",
  "yarn workspace app add package",

  // pnpm
  "pnpm install",
  "pnpm add -D typescript",
  "pnpm remove package",
  "pnpm update",
  "pnpm run build",
  "pnpm create next-app",

  // Docker
  "docker build -t app .",
  "docker run -d -p 3000:3000 app",
  "docker ps",
  "docker images",
  "docker-compose up -d",
  "docker-compose down",
  "docker exec -it container bash",
  "docker logs container",
  "docker pull image:tag",
  "docker push image:tag",
  "docker volume create data",
  "docker network create net",
  "docker system prune -a",
  "docker-compose restart",
  "docker build --no-cache .",

  // Kubernetes
  "kubectl get pods",
  "kubectl get nodes",
  "kubectl describe pod",
  "kubectl apply -f config.yaml",
  "kubectl delete pod name",
  "kubectl logs pod-name",
  "kubectl port-forward",
  "kubectl exec -it pod bash",
  "kubectl create namespace",
  "kubectl config get-contexts",

  // Linux基本コマンド
  "ls -la",
  "cd /path/to/dir",
  "mkdir -p dir/subdir",
  "rm -rf directory",
  "cp -r src dest",
  "mv file1 file2",
  "chmod +x script.sh",
  "chown -R user:group dir",
  "tar -czf archive.tar.gz dir",
  "unzip archive.zip",
  "grep -r 'pattern' .",
  "find . -name '*.js'",
  "ps aux | grep node",
  "kill -9 1234",
  "ssh user@hostname",

  // データベース
  "mysql -u root -p",
  "psql -U postgres",
  "mongosh",
  "redis-cli",
  "pg_dump dbname > backup.sql",
  "mysqldump -u root -p db > backup.sql",
  "createdb dbname",
  "dropdb dbname",
  "sqlite3 database.db",

  // AWS CLI
  "aws s3 ls",
  "aws ec2 describe-instances",
  "aws lambda list-functions",
  "aws configure",
  "aws cloudformation deploy",
  "aws eks get-token",
  "aws ecr get-login-password",

  // Firebase
  "firebase init",
  "firebase deploy",
  "firebase serve",
  "firebase emulators:start",
  "firebase functions:shell",
  "firebase hosting:channel:deploy",

  // Vercel
  "vercel",
  "vercel deploy",
  "vercel env pull",
  "vercel env add",
  "vercel logs",
  "vercel list",

  // Python
  "python manage.py runserver",
  "pip install -r requirements.txt",
  "python -m venv venv",
  "source venv/bin/activate",
  "pytest tests/",
  "black .",
  "flake8",
  "mypy .",

  // Ruby
  "bundle install",
  "rails new app",
  "rails server",
  "rake db:migrate",
  "rspec",
  "rubocop",
  "gem install rails",

  // Rust
  "cargo new project",
  "cargo build",
  "cargo run",
  "cargo test",
  "cargo add package",
  "rustup update",
  "rustc main.rs",

  // Go
  "go mod init",
  "go build",
  "go run main.go",
  "go test ./...",
  "go get package",
  "go fmt ./...",
  "go vet ./...",

  // Java
  "javac Main.java",
  "java -jar app.jar",
  "mvn clean install",
  "gradle build",
  "gradle run",
  "./gradlew bootRun",

  // フロントエンド開発
  "next build",
  "next dev",
  "next start",
  "vite build",
  "vite preview",
  "astro build",
  "astro dev",
  "nuxt generate",
  "gatsby develop",

  // バックエンド開発
  "nest new project",
  "nest generate resource",
  "prisma generate",
  "prisma migrate dev",
  "sequelize db:migrate",
  "django-admin startproject",

  // モバイル開発
  "expo start",
  "react-native run-ios",
  "react-native run-android",
  "pod install",
  "flutter run",
  "flutter build ios",

  // CI/CD
  "gh workflow run",
  "gh pr create",
  "gh issue list",
  "travis encrypt",
  "circleci config validate",
  "jenkins build",

  // セキュリティ
  "openssl genrsa",
  "ssh-keygen -t ed25519",
  "gpg --gen-key",
  "certbot renew",
  "nmap -sV host",

  // コード品質
  "eslint .",
  "prettier --write .",
  "stylelint '**/*.css'",
  "tsc --noEmit",
  "jest --coverage",

  // その他の開発ツール
  "curl -X POST api/endpoint",
  "wget https://example.com/file",
  "ab -n 1000 -c 100 http://localhost",
  "ngrok http 3000",
  "lighthouse http://localhost",
]

export default function TypingGame() {
  const [currentCommand, setCurrentCommand] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLimit, setTimeLimit] = useState<number | "infinite">(30)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTimeSettings, setShowTimeSettings] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const getNextCommand = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * commandsList.length)
    return commandsList[randomIndex]
  }, [])

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setTimeLeft(timeLimit === "infinite" ? 0 : timeLimit)
    setCurrentCommand(getNextCommand())
    setUserInput("")
    setShowTimeSettings(false)
    setUserInput("")
  }

  const formatTime = (seconds: number | "infinite") => {
    if (seconds === "infinite") return "∞"
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.floor(seconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
  }

  useEffect(() => {
    if (isPlaying && timeLimit !== "infinite" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLimit !== "infinite" && timeLeft === 0) {
      setIsPlaying(false)
      setCurrentCommand("")
      setUserInput("")
    }
  }, [isPlaying, timeLeft, timeLimit])

  const handleCommandComplete = () => {
    setScore((prev) => prev + 1)
    setCurrentCommand(getNextCommand())
    setUserInput("")
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#2E3440] overflow-hidden relative p-8">
      <AnimatePresence>
        {showTimeSettings && !isPlaying && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
              onClick={() => setShowTimeSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto h-fit w-full max-w-md p-6 rounded-lg bg-[#3B4252] border border-[#4C566A] shadow-xl z-30"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#D8DEE9] font-medium text-lg">
                    Time Limit: {timeLimit === "infinite" ? "Infinite" : formatTime(timeLimit)}
                  </span>
                  <button
                    onClick={() => setShowTimeSettings(false)}
                    className="text-[#D8DEE9]/70 hover:text-[#D8DEE9] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Slider
                  value={[timeLimit === "infinite" ? 300 : timeLimit]}
                  onValueChange={(value) => {
                    const newValue = value[0]
                    if (newValue >= 300) {
                      setTimeLimit("infinite")
                    } else {
                      setTimeLimit(newValue)
                    }
                  }}
                  min={10}
                  max={300}
                  step={10}
                  className="[&_[role=slider]]:bg-[#88C0D0] [&_[role=slider]]:border-[#88C0D0] [&_[role=slider]]:shadow-md [&_[role=slider]]:ring-[#88C0D0]/50"
                />
                <div className="flex justify-between text-sm text-[#D8DEE9]/70">
                  <span>10s</span>
                  <span>1m</span>
                  <span>2m</span>
                  <span>3m</span>
                  <span>∞</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#88C0D0] to-[#81A1C1]">
            break and type
          </h1>
          <p className="text-[#D8DEE9]">your go-to game for idle moments</p>
        </div>

        <div className="flex justify-between items-center p-4 rounded-lg bg-[#3B4252] border border-[#4C566A]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => !isPlaying && setShowTimeSettings(!showTimeSettings)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Timer className="w-5 h-5 text-[#88C0D0]" />
              <span className="text-xl font-bold text-[#88C0D0]">
                {timeLimit === "infinite" ? "∞" : `${timeLeft}s`}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#EBCB8B]" />
            <span className="text-xl font-bold text-[#EBCB8B]">{score}</span>
          </div>
        </div>

        <div className="p-8 rounded-lg bg-[#3B4252] border border-[#4C566A]">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[#616E88]">$</span>
            <div className="text-2xl font-mono tracking-wider whitespace-pre">
              {!isPlaying && timeLeft === 0 && timeLimit !== "infinite" ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#BF616A]"
                  style={{
                    textShadow: "0 0 10px rgba(191,97,106,0.3)",
                  }}
                >
                  Time's up!
                </motion.span>
              ) : (
                currentCommand.split("").map((char, index) => (
                  <motion.span
                    key={`${currentCommand}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={
                      index < userInput.length
                        ? userInput[index] === char
                          ? "text-[#A3BE8C] inline-block"
                          : "text-[#BF616A] inline-block"
                        : "text-[#D8DEE9] inline-block"
                    }
                    style={{
                      textShadow:
                        index < userInput.length
                          ? userInput[index] === char
                            ? "0 0 10px rgba(163,190,140,0.3)"
                            : "0 0 10px rgba(191,97,106,0.3)"
                          : "none",
                    }}
                  >
                    {char}
                  </motion.span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#88C0D0]" />
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(event) => {
                const newInput = event.target.value
                if (isPlaying && (timeLimit === "infinite" || timeLeft > 0)) {
                  if (currentCommand.startsWith(newInput)) {
                    setUserInput(newInput)
                    if (newInput === currentCommand) {
                      handleCommandComplete()
                    }
                  }
                } else if (!isPlaying) {
                  setUserInput(newInput)
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !isPlaying) {
                  const command = userInput.toLowerCase().trim()
                  if (command === "start") {
                    startGame()
                  }
                }
              }}
              className="w-full pl-12 pr-4 py-4 text-lg font-mono rounded-lg bg-[#3B4252] border border-[#4C566A] text-[#D8DEE9] placeholder-[#616E88] focus:outline-none focus:ring-2 focus:ring-[#88C0D0]/50"
              placeholder={
                isPlaying
                  ? timeLimit === "infinite" || timeLeft > 0
                    ? "Type the command above..."
                    : ""
                  : "Type 'start' and press Enter"
              }
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  )
}

