<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Check if phone number already exists
     */
    public function check_phone_exists($phone_number) {
        $this->db->where('phone_number', $phone_number);
        $query = $this->db->get('register');
        return $query->num_rows() > 0;
    }

    /**
     * Check if email already exists
     */
    public function check_email_exists($email) {
        if (empty($email)) {
            return false; // Email is optional, so empty email is allowed
        }
        $this->db->where('email', $email);
        $query = $this->db->get('register');
        return $query->num_rows() > 0;
    }

    /**
     * Generate unique user ID based on date and phone number
     */
    public function generate_user_id($phone_number) {
        // Get today's date in YYYYMMDD format
        $date = date('Ymd');
        
        // Get last 4 digits of phone number
        $phone_suffix = substr($phone_number, -4);
        
        // Create base user ID
        $base_user_id = $date . $phone_suffix;
        
        // Check if this user ID already exists
        $this->db->where('user_id', $base_user_id);
        $query = $this->db->get('register');
        
        if ($query->num_rows() == 0) {
            return $base_user_id;
        }
        
        // If exists, add random digits until we find a unique one
        $counter = 1;
        do {
            $user_id = $base_user_id . $counter;
            $this->db->where('user_id', $user_id);
            $query = $this->db->get('register');
            $counter++;
        } while ($query->num_rows() > 0 && $counter < 1000);
        
        return $user_id;
    }

    /**
     * Generate username based on MEMBER + last 4 digits of phone
     */
    public function generate_username($phone_number) {
        // Get last 4 digits of phone number
        $phone_suffix = substr($phone_number, -4);
        
        // Create username: MEMBER + last 4 digits
        $username = 'MEMBER' . $phone_suffix;
        
        return $username;
    }

    /**
     * Create new user registration
     */
    public function create_user($data) {
        // Generate user_id and username
        $data['user_id'] = $this->generate_user_id($data['phone_number']);
        $data['username'] = $this->generate_username($data['phone_number']);
        
        // Hash the password
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Insert user data
        $this->db->insert('register', $data);
        
        if ($this->db->affected_rows() > 0) {
            return array(
                'success' => true,
                'user_id' => $data['user_id'],
                'username' => $data['username'],
                'id' => $this->db->insert_id()
            );
        }
        
        return array('success' => false, 'error' => 'Failed to create user');
    }

    /**
     * Get user by phone number
     */
    public function get_user_by_phone($phone_number) {
        $this->db->where('phone_number', $phone_number);
        $query = $this->db->get('register');
        return $query->row_array();
    }

    /**
     * Get user by user_id
     */
    public function get_user_by_id($user_id) {
        $this->db->where('user_id', $user_id);
        $query = $this->db->get('register');
        return $query->row_array();
    }

    /**
     * Update last login time
     */
    public function update_last_login($user_id) {
        $this->db->where('user_id', $user_id);
        $this->db->update('register', array('last_login' => date('Y-m-d H:i:s')));
        return $this->db->affected_rows() > 0;
    }

    /**
     * Store refresh token
     */
    public function store_refresh_token($user_id, $refresh_token) {
        $data = array(
            'user_id' => $user_id,
            'refresh_token' => $refresh_token,
            'created_at' => date('Y-m-d H:i:s'),
            'expires_at' => date('Y-m-d H:i:s', time() + (7 * 24 * 60 * 60)) // 7 days
        );
        
        $this->db->insert('refresh_tokens', $data);
        return $this->db->affected_rows() > 0;
    }

    /**
     * Validate refresh token
     */
    public function validate_refresh_token($refresh_token) {
        $this->db->where('refresh_token', $refresh_token);
        $this->db->where('expires_at >', date('Y-m-d H:i:s'));
        $query = $this->db->get('refresh_tokens');
        
        if ($query->num_rows() > 0) {
            $token_data = $query->row_array();
            return $token_data['user_id'];
        }
        
        return false;
    }

    /**
     * Revoke refresh token
     */
    public function revoke_refresh_token($refresh_token) {
        $this->db->where('refresh_token', $refresh_token);
        $this->db->delete('refresh_tokens');
        return $this->db->affected_rows() > 0;
    }

    /**
     * Revoke all refresh tokens for user
     */
    public function revoke_all_refresh_tokens($user_id) {
        $this->db->where('user_id', $user_id);
        $this->db->delete('refresh_tokens');
        return $this->db->affected_rows() > 0;
    }
}
