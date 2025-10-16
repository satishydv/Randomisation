<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JWT Library for CodeIgniter 3
 * Simple JWT implementation for authentication
 */
class JWT {
    
    private $secret_key;
    private $algorithm = 'HS256';
    
    public function __construct() {
        // Get secret key from config
        $this->CI =& get_instance();
        $this->CI->load->config('jwt');
        $this->secret_key = $this->CI->config->item('jwt_secret_key');
        
        if (empty($this->secret_key)) {
            $this->secret_key = 'your-secret-key-change-this-in-production';
        }
    }
    
    /**
     * Encode JWT token
     */
    public function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->algorithm]);
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret_key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    /**
     * Decode JWT token
     */
    public function decode($jwt) {
        $tokenParts = explode('.', $jwt);
        
        if (count($tokenParts) != 3) {
            return false;
        }
        
        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signatureProvided = $tokenParts[2];
        
        // Verify signature
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret_key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($base64Signature !== $signatureProvided) {
            return false;
        }
        
        $payload = json_decode($payload, true);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Generate access token
     */
    public function generate_access_token($user_data) {
        $payload = [
            'user_id' => $user_data['user_id'],
            'username' => $user_data['username'],
            'phone_number' => $user_data['phone_number'],
            'email' => $user_data['email'],
            'type' => 'access',
            'iat' => time(),
            'exp' => time() + (15 * 60) // 15 minutes
        ];
        
        return $this->encode($payload);
    }
    
    /**
     * Generate refresh token
     */
    public function generate_refresh_token($user_id) {
        $payload = [
            'user_id' => $user_id,
            'type' => 'refresh',
            'iat' => time(),
            'exp' => time() + (7 * 24 * 60 * 60) // 7 days
        ];
        
        return $this->encode($payload);
    }
    
    /**
     * Validate token
     */
    public function validate_token($token) {
        $payload = $this->decode($token);
        
        if (!$payload) {
            return false;
        }
        
        return $payload;
    }
}
