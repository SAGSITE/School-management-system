param(
  [int]$Port = 4173,
  [string]$Root = (Get-Location).Path
)

$contentTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
}

$rootFull = [System.IO.Path]::GetFullPath($Root).TrimEnd("\", "/") + [System.IO.Path]::DirectorySeparatorChar
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), $Port)
$listener.Start()

function Write-Response {
  param(
    [System.IO.Stream]$Stream,
    [string]$Status,
    [string]$ContentType,
    [byte[]]$Bytes
  )

  $header = "HTTP/1.1 $Status`r`nContent-Type: $ContentType`r`nContent-Length: $($Bytes.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  $Stream.Write($Bytes, 0, $Bytes.Length)
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $requestLine = $reader.ReadLine()

    while ($true) {
      $line = $reader.ReadLine()
      if ($null -eq $line -or $line -eq "") { break }
    }

    if ([string]::IsNullOrWhiteSpace($requestLine)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Bad request")
      Write-Response -Stream $stream -Status "400 Bad Request" -ContentType "text/plain; charset=utf-8" -Bytes $bytes
      continue
    }

    $parts = $requestLine.Split(" ")
    $requestPath = if ($parts.Length -ge 2) { $parts[1].Split("?")[0] } else { "/" }
    $requestPath = [System.Uri]::UnescapeDataString($requestPath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $safePath = $requestPath -replace "/", [System.IO.Path]::DirectorySeparatorChar
    $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootFull, $safePath))

    if (!$fullPath.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase) -or !(Test-Path -LiteralPath $fullPath -PathType Leaf)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      Write-Response -Stream $stream -Status "404 Not Found" -ContentType "text/plain; charset=utf-8" -Bytes $bytes
      continue
    }

    $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
    $contentType = if ($contentTypes.ContainsKey($extension)) { $contentTypes[$extension] } else { "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    Write-Response -Stream $stream -Status "200 OK" -ContentType $contentType -Bytes $bytes
  } catch {
    try {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Server error")
      Write-Response -Stream $stream -Status "500 Internal Server Error" -ContentType "text/plain; charset=utf-8" -Bytes $bytes
    } catch {
    }
  } finally {
    $client.Close()
  }
}
