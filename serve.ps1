$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:3000/")
$listener.Start()
Write-Host "Server running at http://localhost:3000/"
Write-Host "Press Ctrl+C to stop"

$root = "D:\vscode\pr6"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/").Replace("/","\"))
    if (Test-Path $file) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext = [IO.Path]::GetExtension($file)
        $types = @{".html"="text/html";".css"="text/css";".js"="application/javascript";".png"="image/png";".jpg"="image/jpeg";".svg"="image/svg+xml";".ico"="image/x-icon"}
        $ct = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
        $context.Response.ContentType = $ct
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $context.Response.StatusCode = 404
        $context.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $context.Response.Close()
}
