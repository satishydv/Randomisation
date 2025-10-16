<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('User_model');
        $this->load->library('form_validation');
        $this->load->library('jwt');
    }

    /**
     * User Registration API Endpoint
     * POST /auth/register
     */
    public function register() {
        // Set JSON header
        header('Content-Type: application/json');
        
        // Check if request method is POST
        if ($this->input->method() !== 'post') {
            $this->output
                ->set_status_header(405)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Method not allowed. Use POST.'
                )));
            return;
        }

        // Get JSON input data
        $input = json_decode($this->input->raw_input_stream, true);
        
        // Check if JSON is valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid JSON format'
                )));
            return;
        }

        // Extract data from JSON
        $phone_number = isset($input['phone_number']) ? $input['phone_number'] : '';
        $email = isset($input['email']) ? $input['email'] : '';
        $password = isset($input['password']) ? $input['password'] : '';

        // Validate required fields
        if (empty($phone_number) || empty($password)) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Phone number and password are required'
                )));
            return;
        }

        // Validate phone number format (basic validation)
        if (!preg_match('/^[0-9]{10,15}$/', $phone_number)) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid phone number format'
                )));
            return;
        }

        // Validate email format if provided
        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid email format'
                )));
            return;
        }

        // Validate password strength
        if (strlen($password) < 6) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Password must be at least 6 characters long'
                )));
            return;
        }

        // Check if phone number already exists
        if ($this->User_model->check_phone_exists($phone_number)) {
            $this->output
                ->set_status_header(409)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Phone number already registered'
                )));
            return;
        }

        // Check if email already exists (if provided)
        if (!empty($email) && $this->User_model->check_email_exists($email)) {
            $this->output
                ->set_status_header(409)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Email already registered'
                )));
            return;
        }

        // Prepare user data
        $user_data = array(
            'phone_number' => $phone_number,
            'email' => $email,
            'password' => $password
        );

        // Create user
        $result = $this->User_model->create_user($user_data);

        if ($result['success']) {
            $this->output
                ->set_status_header(201)
                ->set_output(json_encode(array(
                    'status' => 'success',
                    'message' => 'User registered successfully',
                    'data' => array(
                        'user_id' => $result['user_id'],
                        'username' => $result['username'],
                        'phone_number' => $phone_number,
                        'email' => $email
                    )
                )));
        } else {
            $this->output
                ->set_status_header(500)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Registration failed. Please try again.'
                )));
        }
    }

    /**
     * User Login API Endpoint
     * POST /auth/login
     */
    public function login() {
        // Set JSON header
        header('Content-Type: application/json');
        
        // Check if request method is POST
        if ($this->input->method() !== 'post') {
            $this->output
                ->set_status_header(405)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Method not allowed. Use POST.'
                )));
            return;
        }

        // Get JSON input data
        $input = json_decode($this->input->raw_input_stream, true);
        
        // Check if JSON is valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid JSON format'
                )));
            return;
        }

        // Extract data from JSON
        $phone_number = isset($input['phone_number']) ? $input['phone_number'] : '';
        $password = isset($input['password']) ? $input['password'] : '';

        // Validate required fields
        if (empty($phone_number) || empty($password)) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Phone number and password are required'
                )));
            return;
        }

        // Get user by phone number
        $user = $this->User_model->get_user_by_phone($phone_number);

        if (!$user) {
            $this->output
                ->set_status_header(401)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid phone number or password'
                )));
            return;
        }

        // Verify password
        if (!password_verify($password, $user['password'])) {
            $this->output
                ->set_status_header(401)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid phone number or password'
                )));
            return;
        }

        // Update last login
        $this->User_model->update_last_login($user['user_id']);

        // Generate JWT tokens
        $access_token = $this->jwt->generate_access_token($user);
        $refresh_token = $this->jwt->generate_refresh_token($user['user_id']);
        
        // Store refresh token in database
        $this->User_model->store_refresh_token($user['user_id'], $refresh_token);

        // Return success response with tokens
        $this->output
            ->set_status_header(200)
            ->set_output(json_encode(array(
                'status' => 'success',
                'message' => 'Login successful',
                'data' => array(
                    'user_id' => $user['user_id'],
                    'username' => $user['username'],
                    'phone_number' => $user['phone_number'],
                    'email' => $user['email'],
                    'last_login' => $user['last_login']
                ),
                'tokens' => array(
                    'access_token' => $access_token,
                    'refresh_token' => $refresh_token,
                    'token_type' => 'Bearer',
                    'expires_in' => 900 // 15 minutes in seconds
                )
            )));
    }

    /**
     * Refresh Token API Endpoint
     * POST /auth/refresh
     */
    public function refresh() {
        // Set JSON header
        header('Content-Type: application/json');
        
        // Check if request method is POST
        if ($this->input->method() !== 'post') {
            $this->output
                ->set_status_header(405)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Method not allowed. Use POST.'
                )));
            return;
        }

        // Get JSON input data
        $input = json_decode($this->input->raw_input_stream, true);
        
        // Check if JSON is valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid JSON format'
                )));
            return;
        }

        // Extract refresh token
        $refresh_token = isset($input['refresh_token']) ? $input['refresh_token'] : '';

        // Validate refresh token
        if (empty($refresh_token)) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Refresh token is required'
                )));
            return;
        }

        // Validate refresh token in database
        $user_id = $this->User_model->validate_refresh_token($refresh_token);
        
        if (!$user_id) {
            $this->output
                ->set_status_header(401)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid or expired refresh token'
                )));
            return;
        }

        // Get user data
        $user = $this->User_model->get_user_by_id($user_id);
        
        if (!$user) {
            $this->output
                ->set_status_header(404)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'User not found'
                )));
            return;
        }

        // Generate new access token
        $access_token = $this->jwt->generate_access_token($user);

        // Return new access token
        $this->output
            ->set_status_header(200)
            ->set_output(json_encode(array(
                'status' => 'success',
                'message' => 'Token refreshed successfully',
                'tokens' => array(
                    'access_token' => $access_token,
                    'token_type' => 'Bearer',
                    'expires_in' => 900 // 15 minutes in seconds
                )
            )));
    }

    /**
     * Logout API Endpoint
     * POST /auth/logout
     */
    public function logout() {
        // Set JSON header
        header('Content-Type: application/json');
        
        // Check if request method is POST
        if ($this->input->method() !== 'post') {
            $this->output
                ->set_status_header(405)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Method not allowed. Use POST.'
                )));
            return;
        }

        // Get JSON input data
        $input = json_decode($this->input->raw_input_stream, true);
        
        // Check if JSON is valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid JSON format'
                )));
            return;
        }

        // Extract refresh token
        $refresh_token = isset($input['refresh_token']) ? $input['refresh_token'] : '';

        // Validate refresh token
        if (empty($refresh_token)) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Refresh token is required'
                )));
            return;
        }

        // Revoke refresh token
        $this->User_model->revoke_refresh_token($refresh_token);

        // Return success response
        $this->output
            ->set_status_header(200)
            ->set_output(json_encode(array(
                'status' => 'success',
                'message' => 'Logged out successfully'
            )));
    }

    /**
     * Verify Token API Endpoint
     * POST /auth/verify
     */
    public function verify() {
        // Set JSON header
        header('Content-Type: application/json');
        
        // Get Authorization header
        $headers = getallheaders();
        $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            $this->output
                ->set_status_header(401)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Authorization header missing or invalid'
                )));
            return;
        }

        $access_token = $matches[1];

        // Validate access token
        $payload = $this->jwt->validate_token($access_token);
        
        if (!$payload) {
            $this->output
                ->set_status_header(401)
                ->set_output(json_encode(array(
                    'status' => 'error',
                    'message' => 'Invalid or expired access token'
                )));
            return;
        }

        // Return user data from token
        $this->output
            ->set_status_header(200)
            ->set_output(json_encode(array(
                'status' => 'success',
                'message' => 'Token is valid',
                'data' => array(
                    'user_id' => $payload['user_id'],
                    'username' => $payload['username'],
                    'phone_number' => $payload['phone_number'],
                    'email' => $payload['email']
                )
            )));
    }
}
