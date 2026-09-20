Add-Type -AssemblyName System.Drawing
$imagePath = "d:\Projects\8x_Assignment\pics_of_flow\14.png"
$src = [System.Drawing.Bitmap]::FromFile($imagePath)

# In 14.png (1920x1080), let's crop the main video:
# Video starts below the top bar (~260) and ends above bottom zoom controls (~880)
# Left is ~250, width is ~1380
$cropX = 250
$cropY = 260
$cropW = 1380
$cropH = 620

$rect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save("d:\Projects\8x_Assignment\public\thumbnails\test-call-clean.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Dispose()
$src.Dispose()
Write-Output "Clean thumbnail saved!"
