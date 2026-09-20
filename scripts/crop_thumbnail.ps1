Add-Type -AssemblyName System.Drawing
$imagePath = "d:\Projects\8x_Assignment\pics_of_flow\15.png"
$src = [System.Drawing.Bitmap]::FromFile($imagePath)

# Exact video rectangle inside the left player
$cropX = 455
$cropY = 148
$cropW = 566
$cropH = 318

$rect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save("d:\Projects\8x_Assignment\public\thumbnails\test-call.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Dispose()
$src.Dispose()
Write-Output "Refined thumbnail saved!"
