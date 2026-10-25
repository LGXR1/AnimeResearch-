$ErrorActionPreference = 'Stop'
$base = 'data/anime_update_drafts/library-audit-2026-10-13'
$queries = @{
  24129 = 'Mushishi Nami Shirou character'
  26753 = 'Full Metal Panic Zaied character'
  28380 = 'Mouryou no Hako Atsuko Chuuzenji character'
  28922 = 'The Girl Who Leapt Through Time Soujirou Takase character'
  29335 = 'Mouryou no Hako Shunko Kubo character'
  30727 = 'A Chinese Ghost Story 1997 Ning Choi San character'
  30728 = 'A Chinese Ghost Story 1997 Siu Lan character'
  30731 = 'A Chinese Ghost Story 1997 Red Beard character'
  30734 = 'A Chinese Ghost Story 1997 Siu Deep character'
  30738 = 'A Chinese Ghost Story 1997 White Cloud character'
  32827 = 'Broken Blade Regarz Arrow character'
  34322 = 'Yakitate Japan Umasaburou Azuma character'
  34323 = 'Yakitate Japan Umatarou Azuma character'
  34419 = 'Yakitate Japan Haijima character'
  36309 = 'Akagi Narrator voice character'
  36374 = 'Tamayura Maestro photo shop character'
  36375 = 'Tamayura Tamae Sawatari mother character'
  36377 = 'Tamayura Fuu grandmother character'
  37083 = 'Initial D Miki football club Takumi character'
  37120 = 'GA Geijutsuka Art Design Class Mayumi Usami character'
  37349 = 'Martian Successor Nadesico Genichirou Tsukiomi character'
  38052 = 'Princess Jellyfish Saburouta Negishi prime minister character'
  39434 = 'Children Who Chase Lost Voices Asuna Watase character'
  39491 = 'Macross Frontier Miranda Meliyn character'
  40224 = 'Toriko Oban character'
  41968 = 'Gosick Coco Rose character'
  42219 = 'Gosick Sophie character'
  42948 = 'Hanasaku Iroha Mrs Tachibana episode 6 character'
  42949 = 'Hanasaku Iroha Atsuji Tachibana episode 6 character'
  43686 = 'Getter Robo Armageddon Dr Shikishima character'
  43961 = 'Tweeny Witches Takae character'
  43976 = 'Tweeny Witches Takeshi Maki character'
}

function Strip-Html([string]$value) {
  $value = [regex]::Replace($value, '<[^>]*>', ' ')
  $value = [System.Net.WebUtility]::HtmlDecode($value)
  return [regex]::Replace($value, '\s+', ' ').Trim()
}

$result = @()
foreach ($id in $queries.Keys) {
  $q = $queries[$id]
  $url = 'https://search.brave.com/search?q=' + [uri]::EscapeDataString($q)
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
    if ($response.StatusCode -ne 200) { throw "HTTP $($response.StatusCode)" }
    $hits = @()
    $pattern = '(?s)<a href="(https?[^\"]+)"[^>]*class="[^\"]*l1[^\"]*"[^>]*>.*?<div class="title search-snippet-title[^\"]*"[^>]*>(.*?)</div></a>.*?<div class="generic-snippet[^\"]*"[^>]*>(.*?)</div>'
    foreach ($match in [regex]::Matches($response.Content, $pattern) | Select-Object -First 6) {
      $link = [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value)
      $hits += @{ title = (Strip-Html $match.Groups[2].Value); url = $link; snippet = (Strip-Html $match.Groups[3].Value) }
    }
    $result += @{ id = [int]$id; query = $q; hits = $hits }
    Write-Output "$id $($hits.Count)"
  } catch {
    $result += @{ id = [int]$id; query = $q; error = $_.Exception.Message; line = $_.InvocationInfo.ScriptLineNumber; detail = $_.ScriptStackTrace; hits = @() }
    Write-Output "$id ERROR $($_.InvocationInfo.ScriptLineNumber) $($_.Exception.Message)"
  }
  Start-Sleep -Milliseconds 500
}
$result | ConvertTo-Json -Depth 8 | Set-Content "$base/research-pending-round21.json" -Encoding utf8
