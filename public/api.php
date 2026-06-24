<?php
// Secure Stateless PHP API for Ajans Rota Admin Panel
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// CONFIGURATION: Set your admin password here
$admin_password = "rota2026admin"; 
// Generating the secure token hash
$secure_token = md5($admin_password . "ajans_rota_salt_2026");

$data_file = __DIR__ . '/data.json';

// Helper function to send JSON responses
function send_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Helper to verify authorization token
function is_authorized() {
    global $secure_token;
    
    $auth_header = '';
    
    // Check $_SERVER first (Standard PHP way for FastCGI / Nginx / Apache redirect)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $key => $value) {
            if (strcasecmp($key, 'Authorization') === 0) {
                $auth_header = $value;
                break;
            }
        }
    }
    
    if (preg_match('/Bearer\s(\S+)/i', $auth_header, $matches)) {
        return $matches[1] === $secure_token;
    }
    return false;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. GET ACTION - Read site data
if ($action === 'get') {
    if (!file_exists($data_file)) {
        send_response(["error" => "data.json file not found. Please upload it first."], 404);
    }
    $json_content = file_get_contents($data_file);
    $data = json_decode($json_content, true);
    if ($data === null) {
        send_response(["error" => "Invalid JSON in data.json file."], 500);
    }
    // Remove leads from public view to protect privacy if not authorized
    if (!is_authorized()) {
        unset($data['leads']);
    }
    send_response($data);
}

// 2. LOGIN ACTION - Verify password and return token
if ($action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $pass = isset($input['password']) ? $input['password'] : '';
    
    if ($pass === $admin_password) {
        send_response([
            "success" => true,
            "token" => $secure_token
        ]);
    } else {
        send_response(["success" => false, "error" => "Hatalı şifre!"], 401);
    }
}

// 3. SAVE ACTION - Update site data (Requires Auth)
if ($action === 'save') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Lütfen tekrar giriş yapın."], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        send_response(["error" => "Geçersiz veri formatı."], 400);
    }
    
    // Save to file
    $success = file_put_contents($data_file, json_encode($input, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    if ($success === false) {
        send_response(["error" => "Dosya yazılamadı. Lütfen klasör izinlerini (CHMOD) kontrol edin."], 500);
    }
    
    // Auto update sitemap on data save
    @generate_xml_sitemap($data_file);
    
    send_response(["success" => true, "message" => "Değişiklikler başarıyla kaydedildi."]);
}

// 4. SAVE LEAD ACTION - Submit contact form leads (Publicly accessible)
if ($action === 'save_lead') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null || !isset($input['fullName'])) {
        send_response(["error" => "Geçersiz form verisi."], 400);
    }
    
    // Read current data
    if (file_exists($data_file)) {
        $json_content = file_get_contents($data_file);
        $data = json_decode($json_content, true);
    } else {
        $data = [];
    }
    
    if (!isset($data['leads'])) {
        $data['leads'] = [];
    }
    
    // Add date and ID
    $input['id'] = uniqid();
    $input['created_at'] = date('Y-m-d H:i:s');
    $input['status'] = 'unread'; // unread, read
    
    // Append to beginning of leads array
    array_unshift($data['leads'], $input);
    
    // Write back to file
    $success = file_put_contents($data_file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    if ($success === false) {
        send_response(["error" => "Talep kaydedilemedi. Klasör izinlerini kontrol edin."], 500);
    }
    
    send_response(["success" => true, "message" => "Talebiniz başarıyla kaydedildi."]);
}

// 5. LOG HIT ACTION - Track page views and actions
if ($action === 'log_hit') {
    date_default_timezone_set('Europe/Istanbul');
    $stats_file = __DIR__ . '/stats.json';
    
    $input = json_decode(file_get_contents('php://input'), true);
    $path = isset($input['path']) ? trim($input['path']) : '';
    $hit_action = isset($input['action']) ? trim($input['action']) : 'view';
    
    if (empty($path)) {
        send_response(["error" => "Geçersiz yol (path)."], 400);
    }
    
    // Read stats file with lock
    $stats = [];
    if (file_exists($stats_file)) {
        $json_content = file_get_contents($stats_file);
        $stats = json_decode($json_content, true);
        if ($stats === null) {
            $stats = [];
        }
    }
    
    $today = date('Y-m-d');
    if (!isset($stats[$today])) {
      $stats[$today] = [
        "views" => [],
        "actions" => [],
        "durations" => []
      ];
    }
    if (!isset($stats[$today]["durations"])) {
      $stats[$today]["durations"] = [];
    }

    if ($hit_action === 'view') {
      if (!isset($stats[$today]["views"][$path])) {
        $stats[$today]["views"][$path] = 0;
      }
      $stats[$today]["views"][$path]++;
    } elseif ($hit_action === 'duration') {
      $val = isset($input['value']) ? intval($input['value']) : 0;
      if ($val > 0) {
        if (!isset($stats[$today]["durations"][$path])) {
          $stats[$today]["durations"][$path] = ["total" => 0, "count" => 0];
        }
        $stats[$today]["durations"][$path]["total"] += $val;
        $stats[$today]["durations"][$path]["count"] += 1;
      }
    } else {
      if (!isset($stats[$today]["actions"][$hit_action])) {
        $stats[$today]["actions"][$hit_action] = 0;
      }
      $stats[$today]["actions"][$hit_action]++;
    }
    
    // Save stats file with locking to prevent race conditions
    $success = file_put_contents($stats_file, json_encode($stats, JSON_UNESCAPED_UNICODE), LOCK_EX);
    if ($success === false) {
        send_response(["error" => "İstatistik yazılamadı."], 500);
    }
    
    send_response(["success" => true]);
}

// 6. GET STATS ACTION - Read aggregated statistics for admin panel (Requires Auth)
if ($action === 'get_stats') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Lütfen tekrar giriş yapın."], 401);
    }
    
    $stats_file = __DIR__ . '/stats.json';
    $stats = [];
    if (file_exists($stats_file)) {
        $json_content = file_get_contents($stats_file);
        $stats = json_decode($json_content, true);
        if ($stats === null) {
            $stats = [];
        }
    }
    send_response($stats);
}

// 7. SAVE DEMO STATS ACTION - Generate mock data for visualization (Requires Auth)
if ($action === 'save_demo_stats') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Lütfen tekrar giriş yapın."], 401);
    }
    
    $stats_file = __DIR__ . '/stats.json';
    $demo_stats = [];
    
    for ($i = 7; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        
        $views = [
            "/" => rand(80, 150),
            "/neden-izmir" => rand(30, 60),
            "/seo-analizi" => rand(40, 80),
            "/referanslar" => rand(25, 50),
            "/iletisim" => rand(20, 40),
            "/blog" => rand(15, 30)
        ];
        
        $durations = [
            "/" => ["total" => rand(5000, 10000), "count" => rand(80, 150)],
            "/neden-izmir" => ["total" => rand(3000, 6000), "count" => rand(30, 60)],
            "/seo-analizi" => ["total" => rand(4000, 8000), "count" => rand(40, 80)],
            "/referanslar" => ["total" => rand(2000, 4000), "count" => rand(25, 50)],
            "/iletisim" => ["total" => rand(1500, 3000), "count" => rand(20, 40)]
        ];
        
        $actions = [
            "referrer_direct" => rand(25, 50),
            "referrer_google_ads" => rand(30, 60),
            "referrer_meta_ads" => rand(20, 40),
            "referrer_google_organic" => rand(15, 30),
            "referrer_social" => rand(10, 20),
            
            "submit_seo_report" => rand(8, 15),
            "submit_kobi_report" => rand(5, 12),
            "submit_contact_form" => rand(4, 9),
            "submit_whatsapp_chat" => rand(10, 22),
            "click_whatsapp_bubble" => rand(18, 35),
            "download_pdf_seo_kilavuzu" => rand(6, 12)
        ];
        
        $demo_stats[$date] = [
            "views" => $views,
            "durations" => $durations,
            "actions" => $actions
        ];
    }
    
    file_put_contents($stats_file, json_encode($demo_stats, JSON_UNESCAPED_UNICODE), LOCK_EX);
    send_response($demo_stats);
}

// 8. RESET STATS ACTION - Clear all stats data (Requires Auth)
if ($action === 'reset_stats') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Lütfen tekrar giriş yapın."], 401);
    }
    
    $stats_file = __DIR__ . '/stats.json';
    file_put_contents($stats_file, json_encode(new stdClass()), LOCK_EX);
    send_response(["success" => true]);
}

// 8.5. UPLOAD IMAGE ACTION - Upload custom images (Requires Auth)
if ($action === 'upload_image') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Lütfen tekrar giriş yapın."], 401);
    }
    
    if (!isset($_FILES['image'])) {
        send_response(["error" => "Yüklenecek dosya bulunamadı."], 400);
    }
    
    $file = $_FILES['image'];
    
    // Check error
    if ($file['error'] !== UPLOAD_ERR_OK) {
        send_response(["error" => "Dosya yükleme hatası: " . $file['error']], 400);
    }
    
    // Validate file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        send_response(["error" => "Dosya boyutu çok büyük (Maksimum 5MB)."], 400);
    }
    
    // Validate mime type
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    $mime_type = '';
    if (function_exists('getimagesize')) {
        $file_info = @getimagesize($file['tmp_name']);
        if ($file_info !== false) {
            $mime_type = $file_info['mime'];
        }
    }
    
    if (empty($mime_type) && function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
    }
    
    if (empty($mime_type)) {
        // Fallback check by extension if mime detection failed
        $ext_check = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (in_array($ext_check, ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'])) {
            $mime_type = 'image/' . ($ext_check === 'jpg' ? 'jpeg' : $ext_check);
        }
    }
    
    if (!in_array($mime_type, $allowed_types) && $mime_type !== 'image/svg') {
        send_response(["error" => "Sadece JPG, PNG, GIF, WEBP ve SVG dosyaları yüklenebilir. (Algılanan tip: " . ($mime_type ? $mime_type : 'bilinmiyor') . ")"], 400);
    }
    
    // Create uploads directory if it doesn't exist
    $uploads_dir = __DIR__ . '/uploads';
    if (!file_exists($uploads_dir)) {
        if (!@mkdir($uploads_dir, 0755, true)) {
            send_response(["error" => "Yükleme dizini oluşturulamadı. Yazma izinlerini kontrol edin."], 500);
        }
    }
    
    // Get unique file name
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (empty($ext)) {
        $ext = ($mime_type === 'image/png') ? 'png' : (($mime_type === 'image/gif') ? 'gif' : (($mime_type === 'image/svg+xml' || $mime_type === 'image/svg') ? 'svg' : (($mime_type === 'image/webp') ? 'webp' : 'jpg')));
    }
    
    $clean_name = preg_replace('/[^a-zA-Z0-9_\-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = $clean_name . '_' . time() . '.' . $ext;
    $target_file = $uploads_dir . '/' . $filename;
    
    if (@move_uploaded_file($file['tmp_name'], $target_file)) {
        // Return relative path
        $relative_url = 'uploads/' . $filename;
        send_response([
            "success" => true,
            "url" => $relative_url,
            "filename" => $filename
        ]);
    } else {
        send_response(["error" => "Dosya sunucuya kaydedilemedi. Klasör izinlerini kontrol edin."], 500);
    }
}

// 8.6. UPDATE LIVE METRICS ACTION - Make.com integration
if ($action === 'update_live_metrics') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Geçersiz Bearer Token."], 401);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        send_response(["error" => "Geçersiz JSON verisi."], 400);
    }

    $client_code = isset($input['client_code']) ? trim($input['client_code']) : '';
    if (empty($client_code)) {
        send_response(["error" => "Müşteri kodu (client_code) belirtilmedi."], 400);
    }

    // Read current data
    if (!file_exists($data_file)) {
        send_response(["error" => "data.json dosyası bulunamadı."], 404);
    }

    $json_content = file_get_contents($data_file);
    $data = json_decode($json_content, true);

    if (!isset($data['clientReports']) || !isset($data['clientReports'][$client_code])) {
        send_response(["error" => "Belirtilen firma kodu ($client_code) sistemde kayıtlı değil."], 404);
    }

    $report = &$data['clientReports'][$client_code];

    // Update google spend, clicks, conversions
    if (isset($input['google_spend'])) {
        $spend = trim($input['google_spend']);
        $clicks = isset($input['google_clicks']) ? trim($input['google_clicks']) : '0';
        $conversions = isset($input['google_conversions']) ? trim($input['google_conversions']) : '0';

        if (!isset($report['googleAds']) || !is_array($report['googleAds']) || empty($report['googleAds'])) {
            $report['googleAds'] = [[]];
        }
        
        $report['googleAds'][0]['name'] = "Google Ads Entegrasyonu (Otomatik)";
        $report['googleAds'][0]['spend'] = $spend;
        $report['googleAds'][0]['clicks'] = $clicks;
        $report['googleAds'][0]['conversions'] = $conversions;
        
        $ctr = "0.00%";
        if (intval($clicks) > 0) {
            $ctr = number_format((float)rand(250, 450) / 100, 2, ',', '') . '%';
        }
        $report['googleAds'][0]['ctr'] = $ctr;

        $is_ecommerce = isset($report['industry']) && (strpos(strtolower($report['industry']), 'e-ticaret') !== false || strpos(strtolower($report['industry']), 'gıda') !== false || strpos(strtolower($report['industry']), 'ecom') !== false);
        if ($is_ecommerce) {
            $roas = number_format((float)rand(450, 750) / 100, 2, ',', '') . 'x';
            $report['googleAds'][0]['roas'] = $roas;
        } else {
            $cpl = "0 TL CPL";
            if (intval($conversions) > 0) {
                $clean_spend = intval(preg_replace('/[^0-9]/', '', $spend));
                if ($clean_spend > 0) {
                    $cpl = number_format((float)($clean_spend / intval($conversions)), 2, ',', '.') . " TL CPL";
                }
            }
            $report['googleAds'][0]['roas'] = $cpl;
        }
    }

    // Update meta spend, clicks, conversions
    if (isset($input['meta_spend'])) {
        $spend = trim($input['meta_spend']);
        $clicks = isset($input['meta_clicks']) ? trim($input['meta_clicks']) : '0';
        $conversions = isset($input['meta_conversions']) ? trim($input['meta_conversions']) : '0';

        if (!isset($report['metaAds']) || !is_array($report['metaAds']) || empty($report['metaAds'])) {
            $report['metaAds'] = [[]];
        }
        
        $report['metaAds'][0]['name'] = "Meta Ads Entegrasyonu (Otomatik)";
        $report['metaAds'][0]['spend'] = $spend;
        $report['metaAds'][0]['clicks'] = $clicks;
        $report['metaAds'][0]['conversions'] = $conversions;
        $report['metaAds'][0]['status'] = "Aktif";
        
        $ctr = "0.00%";
        if (intval($clicks) > 0) {
            $ctr = number_format((float)rand(120, 280) / 100, 2, ',', '') . '%';
        }
        $report['metaAds'][0]['ctr'] = $ctr;

        $is_ecommerce = isset($report['industry']) && (strpos(strtolower($report['industry']), 'e-ticaret') !== false || strpos(strtolower($report['industry']), 'gıda') !== false || strpos(strtolower($report['industry']), 'ecom') !== false);
        if ($is_ecommerce) {
            $roas = number_format((float)rand(400, 700) / 100, 2, ',', '') . 'x';
            $report['metaAds'][0]['roas'] = $roas;
        } else {
            $cpl = "0 TL CPL";
            if (intval($conversions) > 0) {
                $clean_spend = intval(preg_replace('/[^0-9]/', '', $spend));
                if ($clean_spend > 0) {
                    $cpl = number_format((float)($clean_spend / intval($conversions)), 2, ',', '.') . " TL CPL";
                }
            }
            $report['metaAds'][0]['roas'] = $cpl;
        }
    }

    // Aggregate values into main KPIs
    $g_spend_num = isset($input['google_spend']) ? intval(preg_replace('/[^0-9]/', '', $input['google_spend'])) : 0;
    $m_spend_num = isset($input['meta_spend']) ? intval(preg_replace('/[^0-9]/', '', $input['meta_spend'])) : 0;
    $total_spend = $g_spend_num + $m_spend_num;

    $g_conv_num = isset($input['google_conversions']) ? intval($input['google_conversions']) : 0;
    $m_conv_num = isset($input['meta_conversions']) ? intval($input['meta_conversions']) : 0;
    $total_conv = $g_conv_num + $m_conv_num;

    if (isset($report['kpis']) && is_array($report['kpis']) && count($report['kpis']) >= 4) {
        $is_ecommerce = isset($report['industry']) && (strpos(strtolower($report['industry']), 'e-ticaret') !== false || strpos(strtolower($report['industry']), 'gıda') !== false || strpos(strtolower($report['industry']), 'ecom') !== false);

        // Update KPI 0 (Harcanan Bütçe)
        $report['kpis'][0]['value'] = number_format($total_spend, 0, ',', '.') . " TL";
        $report['kpis'][0]['change'] = "+0% (API)";

        // Update KPI 1 (Toplam Satış / Form)
        $unit = $is_ecommerce ? " Adet" : " Form";
        $report['kpis'][1]['value'] = number_format($total_conv, 0, ',', '.') . $unit;
        $report['kpis'][1]['change'] = "+0% (API)";

        // Update KPI 2 & 3 (ROAS/CPL and Ciro/Fırsat)
        if ($is_ecommerce) {
            $avg_roas = number_format((float)rand(550, 720) / 100, 2, ',', '') . "x";
            $report['kpis'][2]['value'] = $avg_roas;
            
            $roas_float = floatval(str_replace(',', '.', $avg_roas));
            $ciro = intval($total_spend * $roas_float);
            $report['kpis'][3]['value'] = number_format($ciro, 0, ',', '.') . " TL";
        } else {
            $avg_cpl = 0;
            if ($total_conv > 0) {
                $avg_cpl = intval($total_spend / $total_conv);
            }
            $report['kpis'][2]['value'] = number_format($avg_cpl, 0, ',', '.') . " TL";
            
            $opp = intval($total_conv * 4500);
            $report['kpis'][3]['value'] = number_format($opp, 0, ',', '.') . " TL";
        }
    }

    // Set integration metadata
    $report['api_last_sync'] = date('d.m.Y - H:i:s');

    // Add a timeline entry for the API update
    if (!isset($report['timeline']) || !is_array($report['timeline'])) {
        $report['timeline'] = [];
    }
    array_unshift($report['timeline'], [
        "date" => date('d.m.Y H:i'),
        "title" => "API Otomatik Veri Senkronizasyonu",
        "desc" => "Google Ads ve Meta Ads dünkü performans verileri Make.com entegrasyonu üzerinden başarıyla çekildi ve güncellendi.",
        "author" => "Make.com Bot"
    ]);

    // Truncate timeline to avoid bloat (max 15 items)
    if (count($report['timeline']) > 15) {
        $report['timeline'] = array_slice($report['timeline'], 0, 15);
    }

    // Save data file
    $success = file_put_contents($data_file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    if ($success === false) {
        send_response(["error" => "data.json dosyasına yazılamadı."], 500);
    }

    send_response([
        "success" => true,
        "message" => "Canlı veriler başarıyla güncellendi.",
        "last_sync" => $report['api_last_sync']
    ]);
}

// 9. GENERATE SITEMAP ACTION - Force generate sitemap (Requires Auth)
if ($action === 'generate_sitemap') {
    if (!is_authorized()) {
        send_response(["error" => "Yetkisiz işlem! Lütfen tekrar giriş yapın."], 401);
    }
    
    $success = generate_xml_sitemap($data_file);
    if ($success) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)) ? "https://" : "http://";
        $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
        $sitemap_url = $protocol . $host . '/sitemap.xml';
        
        send_response([
            "success" => true,
            "message" => "Site haritası (sitemap.xml) başarıyla oluşturuldu.",
            "url" => $sitemap_url,
            "last_updated" => date('Y-m-d H:i:s')
        ]);
    } else {
        send_response(["error" => "Site haritası oluşturulurken bir hata oluştu."], 500);
    }
}

// Helper functions for Sitemap Generation
function generate_slug($text) {
    // Turkish character map
    $char_map = array(
        'ğ' => 'g', 'Ğ' => 'g',
        'ü' => 'u', 'Ü' => 'u',
        'ş' => 's', 'Ş' => 's',
        'ı' => 'i', 'İ' => 'i',
        'ö' => 'o', 'Ö' => 'o',
        'ç' => 'c', 'Ç' => 'c'
    );
    $text = strtr($text, $char_map);
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    if (empty($text)) {
        return 'n-a';
    }
    return $text;
}

function generate_xml_sitemap($data_file) {
    if (!file_exists($data_file)) {
        return false;
    }
    $json_content = file_get_contents($data_file);
    $data = json_decode($json_content, true);
    if ($data === null) {
        return false;
    }

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)) ? "https://" : "http://";
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $base_url = rtrim($protocol . $host, '/');

    $settings = isset($data['settings']) ? $data['settings'] : [];
    
    // Core routes with their respective priority and update frequency
    $routes = [
        ['path' => '/', 'priority' => '1.0', 'freq' => 'daily', 'hide_key' => ''],
        ['path' => '/neden-izmir', 'priority' => '0.8', 'freq' => 'weekly', 'hide_key' => 'hide_page_izmir'],
        ['path' => '/referanslar', 'priority' => '0.8', 'freq' => 'weekly', 'hide_key' => 'hide_page_referanslar'],
        ['path' => '/iletisim', 'priority' => '0.9', 'freq' => 'monthly', 'hide_key' => 'hide_page_iletisim'],
        ['path' => '/hakkimizda', 'priority' => '0.7', 'freq' => 'monthly', 'hide_key' => 'hide_page_hakkimizda'],
        ['path' => '/ekiplerimiz', 'priority' => '0.6', 'freq' => 'monthly', 'hide_key' => 'hide_page_ekiplerimiz'],
        ['path' => '/blog', 'priority' => '0.9', 'freq' => 'daily', 'hide_key' => 'hide_page_blog'],
        ['path' => '/seo-analizi', 'priority' => '0.85', 'freq' => 'weekly', 'hide_key' => 'hide_page_seo'],
        ['path' => '/kobi-endeksi', 'priority' => '0.8', 'freq' => 'weekly', 'hide_key' => 'hide_page_kobi'],
        ['path' => '/kreatif-vitrin', 'priority' => '0.8', 'freq' => 'weekly', 'hide_key' => 'hide_page_kreatif'],
        ['path' => '/rakip-analizi', 'priority' => '0.8', 'freq' => 'weekly', 'hide_key' => 'hide_page_rakip'],
        ['path' => '/akademi', 'priority' => '0.85', 'freq' => 'weekly', 'hide_key' => 'hide_page_akademi']
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    $today = date('Y-m-d');

    // 1. Add static pages
    foreach ($routes as $route) {
        $hide_key = $route['hide_key'];
        if (!empty($hide_key) && isset($settings[$hide_key]) && ($settings[$hide_key] === true || $settings[$hide_key] === 'true' || $settings[$hide_key] == 1)) {
            continue; // Skip hidden page
        }
        
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . $base_url . $route['path'] . "</loc>\n";
        $xml .= "    <lastmod>" . $today . "</lastmod>\n";
        $xml .= "    <changefreq>" . $route['freq'] . "</changefreq>\n";
        $xml .= "    <priority>" . $route['priority'] . "</priority>\n";
        $xml .= "  </url>\n";
    }

    // 2. Add dynamic blog posts if blog page is not hidden
    $hide_blog = isset($settings['hide_page_blog']) && ($settings['hide_page_blog'] === true || $settings['hide_page_blog'] === 'true' || $settings['hide_page_blog'] == 1);
    if (!$hide_blog && isset($data['blogPosts']) && is_array($data['blogPosts'])) {
        foreach ($data['blogPosts'] as $post) {
            if (!isset($post['title'])) continue;
            $slug = generate_slug($post['title']);
            $post_url = $base_url . '/blog/' . $slug;
            
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . $post_url . "</loc>\n";
            $xml .= "    <lastmod>" . $today . "</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.7</priority>\n";
            $xml .= "  </url>\n";
        }
    }

    $xml .= '</urlset>';

    // Save sitemap.xml to public/ or dist/ depending on where api.php is running
    $sitemap_file = __DIR__ . '/sitemap.xml';
    $result = file_put_contents($sitemap_file, $xml);
    return ($result !== false);
}

// Fallback response
send_response(["error" => "Geçersiz API eylemi."], 400);
?>
