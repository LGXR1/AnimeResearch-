$ErrorActionPreference = 'Stop'
$base = 'data/anime_update_drafts/library-audit-2026-10-13'
$ids = @(24129,26753,28380,28922,29335,30727,30728,30731,30734,30738,32827,34322,34323,34419,36309,36374,36375,36377,37083,37120,37349,38052,39434,39491,40224,41968,42219,42948,42949,43686,43961,43976,39721,23649,27042,32640,37442,37446,42779,43777,43778)
$results = @()
foreach ($id in $ids) {
  $url = "https://myanimelist.net/character/$id"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
    $html = [regex]::Replace($response.Content, '(?is)<(script|style)[^>]*>.*?</\1>', ' ')
    $text = [regex]::Replace($html, '<[^>]+>', ' ')
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    $text = [regex]::Replace($text, '\s+', ' ').Trim()
    $start = $text.IndexOf('Top > Characters >')
    $end = $text.IndexOf('More Top Anime', [Math]::Max($start, 0))
    if ($start -ge 0 -and $end -gt $start) { $text = $text.Substring($start, $end - $start) }
    $results += @{ id = $id; url = $url; status = $response.StatusCode; text = $text.Substring(0,[Math]::Min(2500,$text.Length)) }
    Write-Output "$id OK"
  } catch {
    $results += @{ id = $id; url = $url; error = $_.Exception.Message }
    Write-Output "$id ERROR"
  }
  Start-Sleep -Milliseconds 700
}
$results | ConvertTo-Json -Depth 6 | Set-Content "$base/research-mal-round21.json" -Encoding utf8
