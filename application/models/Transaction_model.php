<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Transaction_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this->load->database();
	}

	public function create(array $data) {
		$this->db->insert('wallet_transactions', $data);
		return $this->db->affected_rows() > 0;
	}

	public function get_by_user(string $user_id, int $limit = 50, int $offset = 0) {
		$this->db->where('user_id', $user_id);
		$this->db->order_by('created_at', 'DESC');
		$query = $this->db->get('wallet_transactions', $limit, $offset);
		return $query->result_array();
	}

	public function get_by_user_and_type(string $user_id, string $transaction_type, int $limit = 50, int $offset = 0) {
		$this->db->where('user_id', $user_id);
		$this->db->where('transaction_type', $transaction_type);
		$this->db->order_by('created_at', 'DESC');
		$query = $this->db->get('wallet_transactions', $limit, $offset);
		return $query->result_array();
	}

	public function get_balance_by_transactions(string $user_id) {
		$this->db->select('SUM(amount) as total_balance');
		$this->db->where('user_id', $user_id);
		$this->db->where('status', 'completed');
		$result = $this->db->get('wallet_transactions')->row_array();
		return $result['total_balance'] ?: 0;
	}

	public function get_transaction_count(string $user_id) {
		$this->db->where('user_id', $user_id);
		return $this->db->count_all_results('wallet_transactions');
	}

	public function get_by_id(int $id) {
		return $this->db->get_where('wallet_transactions', array('id' => $id))->row_array();
	}

	public function update_status(int $id, string $status) {
		$this->db->where('id', $id);
		$this->db->update('wallet_transactions', array('status' => $status));
		return $this->db->affected_rows() > 0;
	}
}
