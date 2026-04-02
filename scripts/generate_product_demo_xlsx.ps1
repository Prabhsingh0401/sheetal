$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $workspace "demo"
$outputPath = Join-Path $outputDir "client-product-demo.xlsx"

if (-not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

function Escape-XmlText {
  param([string]$Value)
  if ($null -eq $Value) { return "" }
  return [System.Security.SecurityElement]::Escape($Value)
}

function Get-ExcelColumnName {
  param([int]$Index)
  $name = ""
  while ($Index -gt 0) {
    $mod = ($Index - 1) % 26
    $name = [char](65 + $mod) + $name
    $Index = [math]::Floor(($Index - 1) / 26)
  }
  return $name
}

function New-InlineCell {
  param(
    [int]$RowIndex,
    [int]$ColumnIndex,
    [string]$Value
  )
  $ref = "$(Get-ExcelColumnName $ColumnIndex)$RowIndex"
  $escaped = Escape-XmlText $Value
  return "<c r=`"$ref`" t=`"inlineStr`"><is><t xml:space=`"preserve`">$escaped</t></is></c>"
}

function New-RowXml {
  param(
    [int]$RowIndex,
    [string[]]$Values
  )
  $cells = for ($i = 0; $i -lt $Values.Count; $i++) {
    New-InlineCell -RowIndex $RowIndex -ColumnIndex ($i + 1) -Value $Values[$i]
  }
  return "<row r=`"$RowIndex`">$(($cells -join ''))</row>"
}

function Write-Utf8File {
  param(
    [string]$Path,
    [string]$Content
  )
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

$products = @(
  [ordered]@{
    product_name = "Ivory Zari Anarkali Set"
    slug = "ivory-zari-anarkali-set-demo"
    sku = "SBS-DEMO-001"
    category_name = "Ethnic Wear"
    status = "Active"
    gst_percent = "12"
    brand_info = "Studio By Sheetal"
    warranty = "No warranty"
    return_policy = "7-day return for unused items with tags intact"
    short_description = "Ivory anarkali set with zari detailing for festive occasions."
    description = "Elegant ivory anarkali with tonal zari work, matching dupatta, and a fluid silhouette designed for wedding festivities and elevated day events."
    material_care = "Dry clean only"
    wear_type = "Festive, Occasion"
    occasion = "Wedding, Sangeet, Festive"
    tags = "anarkali, zari, festive, ivory"
    style = "Classic, Regal"
    work = "Zari, Embroidery"
    fabric = "Silk Blend"
    product_type = "Anarkali Set"
    display_collections = "Festive Edit, New Arrivals"
    event_tags = "Client Demo, Spring Occasion"
    main_image = "/assets/128646077.jpg"
    hover_image = "/assets/206022057.jpg"
    gallery_images = "/assets/128646077.jpg, /assets/206022057.jpg, /assets/216772787.jpg"
    variants_json = '[{"color":{"name":"Ivory","code":"#F5F1E8"},"v_sku":"SBS-DEMO-001-IV","v_image":"/assets/128646077.jpg","sizes":[{"name":"S","stock":5,"price":12999,"discountPrice":11499},{"name":"M","stock":3,"price":12999,"discountPrice":11499},{"name":"L","stock":4,"price":12999,"discountPrice":11499}]}]'
    specifications_json = '[{"key":"Kurta Length","value":"56 inches"},{"key":"Dupatta","value":"Organza with zari border"},{"key":"Set Includes","value":"Anarkali, bottom, dupatta"}]'
    key_benefits = "Statement festive look, lightweight movement, camera-friendly detailing"
    meta_title = "Ivory Zari Anarkali Set | Studio By Sheetal"
    meta_description = "Shop the ivory zari anarkali set with soft shimmer, occasion-ready tailoring, and elegant festive appeal."
    meta_keywords = "ivory anarkali, zari suit, festive ethnic wear, studio by sheetal"
    canonical_url = "https://demo.studiobysheetal.com/product/ivory-zari-anarkali-set-demo"
  },
  [ordered]@{
    product_name = "Rose Gold Tissue Saree"
    slug = "rose-gold-tissue-saree-demo"
    sku = "SBS-DEMO-002"
    category_name = "Sarees"
    status = "Active"
    gst_percent = "5"
    brand_info = "Studio By Sheetal"
    warranty = "No warranty"
    return_policy = "7-day return for unused items with tags intact"
    short_description = "Rose gold tissue saree with subtle sheen and contemporary drape."
    description = "A soft rose gold tissue saree created for cocktail evenings and reception styling, featuring metallic texture and a refined fall."
    material_care = "Dry clean only"
    wear_type = "Occasion, Evening"
    occasion = "Reception, Cocktail, Festive"
    tags = "saree, tissue, rose gold, metallic"
    style = "Modern, Luxe"
    work = "Woven, Metallic Finish"
    fabric = "Tissue"
    product_type = "Saree"
    display_collections = "Evening Edit, Wedding Guest"
    event_tags = "Client Demo, Premium Sarees"
    main_image = "/assets/216772787.jpg"
    hover_image = "/assets/243069708.jpg"
    gallery_images = "/assets/216772787.jpg, /assets/243069708.jpg, /assets/254852228.jpg"
    variants_json = '[{"color":{"name":"Rose Gold","code":"#B76E79"},"v_sku":"SBS-DEMO-002-RG","v_image":"/assets/216772787.jpg","sizes":[{"name":"Free Size","stock":6,"price":18999,"discountPrice":16999}]}]'
    specifications_json = '[{"key":"Saree Length","value":"5.5 meters"},{"key":"Blouse Piece","value":"Included"},{"key":"Finish","value":"Soft metallic tissue"}]'
    key_benefits = "Elegant drape, premium sheen, easy occasion styling"
    meta_title = "Rose Gold Tissue Saree | Studio By Sheetal"
    meta_description = "Discover the rose gold tissue saree with premium metallic finish for receptions, cocktails, and celebration dressing."
    meta_keywords = "rose gold saree, tissue saree, cocktail saree, wedding guest saree"
    canonical_url = "https://demo.studiobysheetal.com/product/rose-gold-tissue-saree-demo"
  },
  [ordered]@{
    product_name = "Emerald Festive Sharara Set"
    slug = "emerald-festive-sharara-set-demo"
    sku = "SBS-DEMO-003"
    category_name = "Co-ord Sets"
    status = "Active"
    gst_percent = "12"
    brand_info = "Studio By Sheetal"
    warranty = "No warranty"
    return_policy = "7-day return for unused items with tags intact"
    short_description = "Emerald sharara set with mirror accents and a festive silhouette."
    description = "A jewel-toned sharara set with mirror embroidery, flared bottoms, and a playful festive profile intended for mehendi and family celebrations."
    material_care = "Dry clean only"
    wear_type = "Festive, Party"
    occasion = "Mehendi, Festive Dinner, Celebration"
    tags = "sharara, emerald, mirror work, festive"
    style = "Playful, Contemporary"
    work = "Mirror Work, Thread Embroidery"
    fabric = "Georgette"
    product_type = "Sharara Set"
    display_collections = "Festive Edit, Occasion Wear"
    event_tags = "Client Demo, Bestsellers"
    main_image = "/assets/243069708.jpg"
    hover_image = "/assets/278065131.jpg"
    gallery_images = "/assets/243069708.jpg, /assets/278065131.jpg, /assets/287057093.jpg"
    variants_json = '[{"color":{"name":"Emerald","code":"#0F8B6D"},"v_sku":"SBS-DEMO-003-EM","v_image":"/assets/243069708.jpg","sizes":[{"name":"S","stock":4,"price":14999,"discountPrice":13299},{"name":"M","stock":5,"price":14999,"discountPrice":13299},{"name":"L","stock":2,"price":14999,"discountPrice":13299}]},{"color":{"name":"Deep Teal","code":"#0E5F63"},"v_sku":"SBS-DEMO-003-DT","v_image":"/assets/278065131.jpg","sizes":[{"name":"S","stock":3,"price":14999,"discountPrice":13299},{"name":"M","stock":3,"price":14999,"discountPrice":13299},{"name":"L","stock":2,"price":14999,"discountPrice":13299}]}]'
    specifications_json = '[{"key":"Kurta Length","value":"34 inches"},{"key":"Bottom Type","value":"Flared sharara"},{"key":"Dupatta","value":"Net with mirror edging"}]'
    key_benefits = "Bright occasion color, flattering flare, standout mirror detailing"
    meta_title = "Emerald Festive Sharara Set | Studio By Sheetal"
    meta_description = "Shop the emerald festive sharara set with mirror work, rich color, and movement for celebration dressing."
    meta_keywords = "emerald sharara set, festive sharara, mirror work set, party ethnic wear"
    canonical_url = "https://demo.studiobysheetal.com/product/emerald-festive-sharara-set-demo"
  }
)

$headers = @(
  "product_name",
  "slug",
  "sku",
  "category_name",
  "status",
  "gst_percent",
  "brand_info",
  "warranty",
  "return_policy",
  "short_description",
  "description",
  "material_care",
  "wear_type",
  "occasion",
  "tags",
  "style",
  "work",
  "fabric",
  "product_type",
  "display_collections",
  "event_tags",
  "main_image",
  "hover_image",
  "gallery_images",
  "variants_json",
  "specifications_json",
  "key_benefits",
  "meta_title",
  "meta_description",
  "meta_keywords",
  "canonical_url"
)

$productRows = @()
$productRows += New-RowXml -RowIndex 1 -Values $headers

$rowIndex = 2
foreach ($product in $products) {
  $values = foreach ($header in $headers) { [string]$product[$header] }
  $productRows += New-RowXml -RowIndex $rowIndex -Values $values
  $rowIndex++
}

$notesRows = @()
$notesRows += New-RowXml -RowIndex 1 -Values @("note_title", "note_detail")
$notesRows += New-RowXml -RowIndex 2 -Values @(
  "Workbook basis",
  "No original downloadable spreadsheet template was present in this repository, so this demo workbook mirrors the storefront product schema used by the app."
)
$notesRows += New-RowXml -RowIndex 3 -Values @(
  "Images",
  "Image fields use local demo asset paths from /public/assets so the client can review realistic product entries without needing external URLs."
)
$notesRows += New-RowXml -RowIndex 4 -Values @(
  "Variants format",
  "Variant, size, and specification data are stored as JSON strings in dedicated columns for easy handoff and import mapping."
)

$sheet1Xml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>
    $($productRows -join "`n    ")
  </sheetData>
</worksheet>
"@

$sheet2Xml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>
    $($notesRows -join "`n    ")
  </sheetData>
</worksheet>
"@

$contentTypesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"@

$rootRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"@

$workbookXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Products" sheetId="1" r:id="rId1"/>
    <sheet name="Notes" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>
"@

$workbookRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"@

$stylesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1">
    <font>
      <sz val="11"/>
      <name val="Calibri"/>
      <family val="2"/>
    </font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>
"@

$timestamp = (Get-Date).ToUniversalTime().ToString("s") + "Z"
$coreXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>OpenAI Codex</dc:creator>
  <cp:lastModifiedBy>OpenAI Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">$timestamp</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">$timestamp</dcterms:modified>
  <dc:title>Client Product Demo Workbook</dc:title>
</cp:coreProperties>
"@

$appXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>2</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="2" baseType="lpstr">
      <vt:lpstr>Products</vt:lpstr>
      <vt:lpstr>Notes</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
  <Company>OpenAI</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0300</AppVersion>
</Properties>
"@

$tempRoot = Join-Path $env:TEMP ("client-product-demo-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempRoot | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "_rels") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "docProps") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "xl") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "xl\_rels") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempRoot "xl\worksheets") | Out-Null

Write-Utf8File -Path (Join-Path $tempRoot "[Content_Types].xml") -Content $contentTypesXml
Write-Utf8File -Path (Join-Path $tempRoot "_rels\.rels") -Content $rootRelsXml
Write-Utf8File -Path (Join-Path $tempRoot "docProps\core.xml") -Content $coreXml
Write-Utf8File -Path (Join-Path $tempRoot "docProps\app.xml") -Content $appXml
Write-Utf8File -Path (Join-Path $tempRoot "xl\workbook.xml") -Content $workbookXml
Write-Utf8File -Path (Join-Path $tempRoot "xl\_rels\workbook.xml.rels") -Content $workbookRelsXml
Write-Utf8File -Path (Join-Path $tempRoot "xl\styles.xml") -Content $stylesXml
Write-Utf8File -Path (Join-Path $tempRoot "xl\worksheets\sheet1.xml") -Content $sheet1Xml
Write-Utf8File -Path (Join-Path $tempRoot "xl\worksheets\sheet2.xml") -Content $sheet2Xml

$zipPath = Join-Path $outputDir "client-product-demo.zip"
if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}
if (Test-Path $outputPath) {
  Remove-Item -LiteralPath $outputPath -Force
}

Compress-Archive -Path (Join-Path $tempRoot "*") -DestinationPath $zipPath -Force
Rename-Item -LiteralPath $zipPath -NewName (Split-Path $outputPath -Leaf)
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Output "Generated: $outputPath"
