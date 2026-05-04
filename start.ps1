# Start Dashboard — server + client in parallel

$serverJob = Start-Job -ScriptBlock {
  Set-Location "C:\MyDashboardProject\server"
  node server.js
}

$clientJob = Start-Job -ScriptBlock {
  Set-Location "C:\MyDashboardProject\client"
  npx vite
}

Write-Host ""
Write-Host "  Dashboard starting up..."
Write-Host "  -> Client  http://localhost:5173"
Write-Host "  -> Server  http://localhost:3001"
Write-Host ""
Write-Host "  Press Ctrl+C to stop."
Write-Host ""

try {
  while ($true) {
    $serverJob, $clientJob | Receive-Job
    Start-Sleep 1
  }
} finally {
  Stop-Job $serverJob, $clientJob
  Remove-Job $serverJob, $clientJob
}
