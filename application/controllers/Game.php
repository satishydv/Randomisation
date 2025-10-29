<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Game extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->output->set_content_type('application/json');
		$this->load->helper('url');
		$this->load->database();
	}

	private function readJsonBody() {
		$raw = $this->input->raw_input_stream;
		$decoded = json_decode($raw, true);
		return is_array($decoded) ? $decoded : [];
	}

	private function respond($statusCode, $payload) {
		$this->output->set_status_header($statusCode);
		$this->output->set_output(json_encode($payload));
	}

	private function updateWallet($userId, $amount, $transactionType, $description) {
		// Start database transaction
		$this->db->trans_start();
		
		try {
			// Get current wallet balance
			$wallet = $this->db->where('user_id', $userId)->get('wallet')->row();
			if (!$wallet) {
				$this->db->trans_rollback();
				return [
					'success' => false,
					'error' => 'Wallet not found for user: ' . $userId
				];
			}
			
			$balanceBefore = (float) $wallet->amount;
			$balanceAfter = $balanceBefore;
			
			// Calculate new balance based on transaction type
			if ($transactionType === 'CREDIT') {
				$balanceAfter = $balanceBefore + $amount;
			} elseif ($transactionType === 'DEBIT') {
				$balanceAfter = $balanceBefore - $amount;
				// Check for insufficient funds
				if ($balanceAfter < 0) {
					$this->db->trans_rollback();
					return [
						'success' => false,
						'error' => 'Insufficient funds. Current balance: ' . $balanceBefore . ', Required: ' . $amount
					];
				}
			}
			
			// Update wallet balance
			$this->db->where('user_id', $userId)
					->update('wallet', ['amount' => $balanceAfter]);
			
			// Insert transaction record
			$transactionData = [
				'user_id' => $userId,
				'transaction_type' => $transactionType,
				'amount' => $amount,
				'balance_before' => $balanceBefore,
				'balance_after' => $balanceAfter,
				'description' => $description,
				'reference_id' => 'GAME_' . time() . '_' . rand(1000, 9999),
				'mode_of_payment' => 'Game Transaction',
				'status' => 'completed'
			];
			
			$this->db->insert('wallet_transactions', $transactionData);
			$transactionId = $this->db->insert_id();
			
			// Complete transaction
			$this->db->trans_complete();
			
			if ($this->db->trans_status() === FALSE) {
				return [
					'success' => false,
					'error' => 'Database transaction failed'
				];
			}
			
			return [
				'success' => true,
				'transaction_id' => $transactionId,
				'balance_before' => $balanceBefore,
				'balance_after' => $balanceAfter,
				'amount' => $amount
			];
			
		} catch (Exception $e) {
			$this->db->trans_rollback();
			return [
				'success' => false,
				'error' => 'Exception: ' . $e->getMessage()
			];
		}
	}

	private function saveGameHistory($gameType, $outcome, $color, $bigSmall, $number, $players) {
		$data = [
			'period' => date('Y-m-d H:i:s'),
			'game_type' => $gameType,
			'outcome' => $outcome,
			'color' => $color,
			'big_small' => $bigSmall,
			'number' => $number,
			'total_players' => count($players),
			'total_amount' => array_sum(array_column($players, 'amount'))
		];
		
		$this->db->insert('game_history', $data);
		return $this->db->insert_id();
	}

	private function validateGame1Players($players) {
		if (count($players) < 1) {
			return false;
		}
		
		// Check if single user has multiple bet types
		if (count($players) == 1) {
			$userBets = $players[0]['bets'];
			$betTypes = array_keys($userBets);
			return count($betTypes) >= 2;
		}
		
		// Multiple users - each player can have any number of bet types (1 or more)
		// No restriction on bet types across players
		return true;
	}

	private function analyzeGame1Bets($players) {
		// Initialize all possible sides with 0% to ensure bias works correctly
		$totalBets = [
			'numbers' => [],
			'colors' => [],
			'bigSmall' => []
		];
		
		// Initialize all numbers 0-9 with 0
		for ($i = 0; $i <= 9; $i++) {
			$totalBets['numbers'][$i] = 0;
		}
		
		// Initialize all colors with 0
		$totalBets['colors']['green'] = 0;
		$totalBets['colors']['red'] = 0;
		$totalBets['colors']['violet'] = 0;
		
		// Initialize both big/small with 0
		$totalBets['bigSmall']['big'] = 0;
		$totalBets['bigSmall']['small'] = 0;
		
		// Collect all bets
		foreach ($players as $player) {
			$bets = $player['bets'];
			
			// Number bets
			if (isset($bets['number'])) {
				$number = (int)$bets['number']['value'];
				$amount = (float)$bets['number']['amount'];
				$totalBets['numbers'][$number] += $amount;
			}
			
			// Color bets - normalize to lowercase
			if (isset($bets['color'])) {
				$color = strtolower(trim($bets['color']['value']));
				$amount = (float)$bets['color']['amount'];
				if (isset($totalBets['colors'][$color])) {
					$totalBets['colors'][$color] += $amount;
				}
			}
			
			// Big/Small bets - normalize to lowercase
			if (isset($bets['bigSmall'])) {
				$side = strtolower(trim($bets['bigSmall']['value']));
				$amount = (float)$bets['bigSmall']['amount'];
				if (isset($totalBets['bigSmall'][$side])) {
					$totalBets['bigSmall'][$side] += $amount;
				}
			}
		}
		
		// Calculate percentages
		$percentages = [
			'numbers' => [],
			'colors' => [],
			'bigSmall' => []
		];
		
		// Number percentages
		$totalNumberBets = array_sum($totalBets['numbers']);
		if ($totalNumberBets > 0) {
			foreach ($totalBets['numbers'] as $number => $amount) {
				$percentages['numbers'][$number] = $amount / $totalNumberBets;
			}
		}
		
		// Color percentages
		$totalColorBets = array_sum($totalBets['colors']);
		if ($totalColorBets > 0) {
			foreach ($totalBets['colors'] as $color => $amount) {
				$percentages['colors'][$color] = $amount / $totalColorBets;
			}
		}
		
		// Big/Small percentages
		$totalBigSmallBets = array_sum($totalBets['bigSmall']);
		if ($totalBigSmallBets > 0) {
			foreach ($totalBets['bigSmall'] as $side => $amount) {
				$percentages['bigSmall'][$side] = $amount / $totalBigSmallBets;
			}
		}
		
		return $percentages;
	}

	private function generateFavorableNumber($bettingAnalysis) {
		$favoredSides = [];
		
		// Find under-bet sides (< 30%)
		foreach ($bettingAnalysis['numbers'] as $number => $percentage) {
			if ($percentage < 0.30) {
				$favoredSides['numbers'][] = $number;
			}
		}
		
		foreach ($bettingAnalysis['colors'] as $color => $percentage) {
			if ($percentage < 0.30) {
				$favoredSides['colors'][] = $color;
			}
		}
		
		foreach ($bettingAnalysis['bigSmall'] as $side => $percentage) {
			if ($percentage < 0.30) {
				$favoredSides['bigSmall'][] = $side;
			}
		}
		
		// Generate number that favors under-bet sides
		$favorableNumbers = [];
		
		if (!empty($favoredSides['numbers'])) {
			$favorableNumbers = $favoredSides['numbers'];
		}
		
		if (!empty($favoredSides['colors'])) {
			$colorNumbers = $this->getNumbersForColors($favoredSides['colors']);
			if (empty($favorableNumbers)) {
				$favorableNumbers = $colorNumbers;
			} else {
				$favorableNumbers = array_intersect($favorableNumbers, $colorNumbers);
			}
		}
		
		if (!empty($favoredSides['bigSmall'])) {
			$bigSmallNumbers = $this->getNumbersForBigSmall($favoredSides['bigSmall']);
			if (empty($favorableNumbers)) {
				$favorableNumbers = $bigSmallNumbers;
			} else {
				$favorableNumbers = array_intersect($favorableNumbers, $bigSmallNumbers);
			}
		}
		
		// If no favorable numbers, generate random
		if (empty($favorableNumbers)) {
			$favorableNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		}
		
		return $favorableNumbers[array_rand($favorableNumbers)];
	}

	private function getNumbersForColors($colors) {
		$numberMap = [
			'green' => [1, 3, 5, 9],
			'red' => [0, 2, 4, 6, 7, 8],
			'violet' => [0, 5]
		];
		
		$result = [];
		foreach ($colors as $color) {
			$color = strtolower(trim($color)); // Normalize input
			if (isset($numberMap[$color])) {
				$result = array_merge($result, $numberMap[$color]);
			}
		}
		
		return array_unique($result);
	}

	private function getNumbersForBigSmall($sides) {
		$numberMap = [
			'big' => [5, 6, 7, 8, 9],
			'small' => [0, 1, 2, 3, 4]
		];
		
		$result = [];
		foreach ($sides as $side) {
			$side = strtolower(trim($side)); // Normalize input
			if (isset($numberMap[$side])) {
				$result = array_merge($result, $numberMap[$side]);
			}
		}
		
		return array_unique($result);
	}

	private function determineGame1Outcomes($generatedNumber) {
		// Determine Big/Small
		$bigSmall = ($generatedNumber >= 5) ? 'BIG' : 'SMALL';
		
		// Determine colors based on your rules
		$colors = [];
		$isGreen = false;
		$isRed = false;
		$isViolet = false;
		
		switch($generatedNumber) {
			case 0:
				$colors = ['RED', 'VIOLET'];
				$isRed = true;
				$isViolet = true;
				break;
			case 1:
			case 3:
			case 9:
				$colors = ['GREEN'];
				$isGreen = true;
				break;
			case 2:
			case 4:
			case 6:
			case 7:
			case 8:
				$colors = ['RED'];
				$isRed = true;
				break;
			case 5:
				$colors = ['GREEN', 'VIOLET'];
				$isGreen = true;
				$isViolet = true;
				break;
		}
		
		return [
			'number' => $generatedNumber,
			'bigSmall' => $bigSmall,
			'colors' => $colors,
			'isGreen' => $isGreen,
			'isRed' => $isRed,
			'isViolet' => $isViolet
		];
	}

	private function calculateGame1PlayerResult($player, $outcomes) {
		$totalWinnings = 0;
		$winningBets = [];
		
		$bets = $player['bets'];
		
		// Check number bet
		if (isset($bets['number']) && $bets['number']['value'] == $outcomes['number']) {
			$amount = $bets['number']['amount'];
			$winnings = $amount * 9; // 9X for number
			$totalWinnings += $winnings;
			$winningBets[] = "Number {$outcomes['number']}: +{$winnings}";
		}
		
		// Check Big bet
		if (isset($bets['bigSmall']) && strtolower(trim($bets['bigSmall']['value'])) == 'big' && $outcomes['bigSmall'] == 'BIG') {
			$amount = $bets['bigSmall']['amount'];
			$winnings = $amount * 2; // 2X for big
			$totalWinnings += $winnings;
			$winningBets[] = "BIG: +{$winnings}";
		}
		
		// Check Small bet
		if (isset($bets['bigSmall']) && strtolower(trim($bets['bigSmall']['value'])) == 'small' && $outcomes['bigSmall'] == 'SMALL') {
			$amount = $bets['bigSmall']['amount'];
			$winnings = $amount * 2; // 2X for small
			$totalWinnings += $winnings;
			$winningBets[] = "SMALL: +{$winnings}";
		}
		
		// Check Green bet
		if (isset($bets['color']) && strtolower(trim($bets['color']['value'])) == 'green' && $outcomes['isGreen']) {
			$amount = $bets['color']['amount'];
			$winnings = $amount * 2; // 2X for green
			$totalWinnings += $winnings;
			$winningBets[] = "GREEN: +{$winnings}";
		}
		
		// Check Red bet
		if (isset($bets['color']) && strtolower(trim($bets['color']['value'])) == 'red' && $outcomes['isRed']) {
			$amount = $bets['color']['amount'];
			$winnings = $amount * 2; // 2X for red
			$totalWinnings += $winnings;
			$winningBets[] = "RED: +{$winnings}";
		}
		
		// Check Violet bet
		if (isset($bets['color']) && strtolower(trim($bets['color']['value'])) == 'violet' && $outcomes['isViolet']) {
			$amount = $bets['color']['amount'];
			$winnings = $amount * 4.5; // 4.5X for violet
			$totalWinnings += $winnings;
			$winningBets[] = "VIOLET: +{$winnings}";
		}
		
		return [
			'totalWinnings' => $totalWinnings,
			'winningBets' => $winningBets
		];
	}

	private function calculateTotalBetAmount($bets) {
		$total = 0;
		foreach ($bets as $bet) {
			$total += $bet['amount'];
		}
		return $total;
	}

	// POST /game1/play
	// Body: { "players": [ {"userId": "u1", "bets": {"number": {"value": 5, "amount": 100}, "color": {"value": "green", "amount": 50}, "bigSmall": {"value": "big", "amount": 75}} }, ... ] }
	public function play_game1() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		
		// Validate players and bet types
		if (!$this->validateGame1Players($players)) {
			return $this->respond(400, ['error' => 'Invalid game setup. Need minimum 2 players or 1 player with multiple bet types']);
		}
		
		// Analyze all bets using 30%/70% rule
		$bettingAnalysis = $this->analyzeGame1Bets($players);
		
		// Generate favorable number based on analysis
		$generatedNumber = $this->generateFavorableNumber($bettingAnalysis);
		
		// Determine all outcomes for the number
		$outcomes = $this->determineGame1Outcomes($generatedNumber);
		
		// Process winners and losers
		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			$playerResult = $this->calculateGame1PlayerResult($p, $outcomes);
			$totalBetAmount = $this->calculateTotalBetAmount($p['bets']);
			
			// Calculate net result (winnings - total bets)
			$netResult = $playerResult['totalWinnings'] - $totalBetAmount;
			
			if ($netResult > 0) {
				// Player made profit - credit the net amount
				$winningsAfterDeduction = $playerResult['totalWinnings'] * 0.98; // 2% deduction
				$walletResult = $this->updateWallet($p['userId'], $winningsAfterDeduction, 'CREDIT', 'Game1 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['netProfit'] = $winningsAfterDeduction - $totalBetAmount;
				$p['totalWinnings'] = $winningsAfterDeduction;
				$p['originalWinnings'] = $playerResult['totalWinnings'];
				$p['deductionAmount'] = $playerResult['totalWinnings'] - $winningsAfterDeduction;
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = $walletResult;
				
				$winners[] = $p;
			} else if ($netResult < 0) {
				// Player lost - deduct the bet amount
				$walletResult = $this->updateWallet($p['userId'], $totalBetAmount, 'DEBIT', 'Game1 Loss');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['netLoss'] = abs($netResult);
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = $walletResult;
				
				$losers[] = $p;
			} else {
				// Break even - no wallet update needed
				$p['walletUpdated'] = true;
				$p['transactionId'] = null;
				$p['netResult'] = 0;
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = ['success' => true, 'message' => 'Break even - no wallet update'];
				
				$winners[] = $p;
			}
		}
		
		// Save game history
		$historyId = $this->saveGameHistory('1', (string)$generatedNumber, implode(',', $outcomes['colors']), $outcomes['bigSmall'], $generatedNumber, $players);
		
		return $this->respond(200, [
			'generatedNumber' => $generatedNumber,
			'outcomes' => $outcomes,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		]);
	}

	// POST /game2/play
	// Body: { "players": [ {"userId": "u1", "side": "BIG|SMALL", "amount": number }, ... ] }
	public function play_game2() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		if (count($players) < 2) {
			return $this->respond(400, [ 'error' => 'At least 2 players required', 'minPlayers' => 2 ]);
		}

		$totalBig = 0.0;
		$totalSmall = 0.0;
		foreach ($players as $p) {
			if (!isset($p['side']) || !isset($p['amount'])) { continue; }
			$side = strtoupper(trim($p['side']));
			$amt = (float) $p['amount'];
			if ($amt < 0) { continue; }
			if ($side === 'BIG') { $totalBig += $amt; }
			elseif ($side === 'SMALL') { $totalSmall += $amt; }
		}

		// Decide range based on which side has lower total amount.
		if ($totalBig === $totalSmall) {
			$generated = rand(0, 9);
		} elseif ($totalSmall < $totalBig) {
			$generated = rand(0, 4); // Favor SMALL when it has less total
		} else {
			$generated = rand(5, 9); // Favor BIG when it has less total
		}

		$winningSide = ($generated >= 5) ? 'BIG' : 'SMALL';

		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			if (isset($p['side']) && strtoupper(trim($p['side'])) === $winningSide) {
				$betAmount = (float) $p['amount'];
				$winningAmount = ($betAmount * 2) * 0.98; // 2X with 2% deduction
				$p['winningAmount'] = round($winningAmount, 2);
				
				// Update wallet for winner
				$walletResult = $this->updateWallet($p['userId'], $winningAmount, 'CREDIT', 'Game2 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$winners[] = $p;
			} else {
				// Losers - deduct their bet amount
				$betAmount = (float) $p['amount'];
				$walletResult = $this->updateWallet($p['userId'], $betAmount, 'DEBIT', 'Game2 Loss');
				$p['betAmount'] = $betAmount;
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$losers[] = $p;
			}
		}

		// Save game history
		$historyId = $this->saveGameHistory('2', $winningSide, null, $winningSide, null, $players);

		return $this->respond(200, [
			'generatedNumber' => $generated,
			'winningSide' => $winningSide,
			'totalBig' => $totalBig,
			'totalSmall' => $totalSmall,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		]);
	}

	// POST /game3/play
	// Body: { "players": [ {"userId": "u1", "color": "GREEN|VIOLET|RED", "amount": number }, ... ] }
	public function play_game3() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		if (count($players) < 2) {
			return $this->respond(400, [ 'error' => 'At least 2 players required', 'minPlayers' => 2 ]);
		}

		$totalGreen = 0.0;
		$totalViolet = 0.0;
		$totalRed = 0.0;
		
		foreach ($players as $p) {
			if (!isset($p['color']) || !isset($p['amount'])) { continue; }
			$color = strtoupper(trim($p['color']));
			$amt = (float) $p['amount'];
			if ($amt < 0) { continue; }
			if ($color === 'GREEN') { $totalGreen += $amt; }
			elseif ($color === 'VIOLET') { $totalViolet += $amt; }
			elseif ($color === 'RED') { $totalRed += $amt; }
		}

		// Get only colors that were actually chosen by players
		$chosenColors = [];
		foreach ($players as $p) {
			if (isset($p['color'])) {
				$color = strtoupper(trim($p['color']));
				if (!in_array($color, $chosenColors)) {
					$chosenColors[] = $color;
				}
			}
		}
		
		// Calculate totals only for chosen colors
		$totals = [];
		foreach ($chosenColors as $color) {
			if ($color === 'GREEN') $totals['GREEN'] = $totalGreen;
			elseif ($color === 'VIOLET') $totals['VIOLET'] = $totalViolet;
			elseif ($color === 'RED') $totals['RED'] = $totalRed;
		}
		
		// Find minimum total among chosen colors only
		$minTotal = min($totals);
		$favoredColors = [];
		
		foreach ($totals as $color => $total) {
			if ($total === $minTotal) {
				$favoredColors[] = $color;
			}
		}
		
		// Pick randomly from favored colors (guaranteed to be chosen colors)
		$generated = $favoredColors[array_rand($favoredColors)];

		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			if (isset($p['color']) && strtoupper(trim($p['color'])) === $generated) {
				$betAmount = (float) $p['amount'];
				$winningAmount = ($betAmount * 2) * 0.98; // 2X with 2% deduction
				$p['winningAmount'] = round($winningAmount, 2);
				
				// Update wallet for winner
				$walletResult = $this->updateWallet($p['userId'], $winningAmount, 'CREDIT', 'Game3 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$winners[] = $p;
			} else {
				// Losers - deduct their bet amount
				$betAmount = (float) $p['amount'];
				$walletResult = $this->updateWallet($p['userId'], $betAmount, 'DEBIT', 'Game3 Loss');
				$p['betAmount'] = $betAmount;
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult; // Debug info
				
				$losers[] = $p;
			}
		}

		// Save game history
		$historyId = $this->saveGameHistory('3', $generated, $generated, null, null, $players);

		return $this->respond(200, [
			'generatedColor' => $generated,
			'totalGreen' => $totalGreen,
			'totalViolet' => $totalViolet,
			'totalRed' => $totalRed,
			'favoredColors' => $favoredColors,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		]);
	}

	// GET /game/history
	// Query params: game_type (optional), limit (default 50), offset (default 0)
	public function history() {
		$gameType = $this->input->get('game_type');
		$limit = (int)$this->input->get('limit') ?: 50;
		$offset = (int)$this->input->get('offset') ?: 0;
		
		// Build query
		$this->db->select('*')
				 ->from('game_history')
				 ->order_by('created_at', 'DESC');
		
		if ($gameType) {
			$this->db->where('game_type', $gameType);
		}
		
		// Get total count for pagination
		$totalQuery = clone $this->db;
		$totalCount = $totalQuery->count_all_results('', FALSE);
		
		// Apply limit and offset
		$this->db->limit($limit, $offset);
		$results = $this->db->get()->result_array();
		
		// Transform data for frontend
		$transformedResults = [];
		foreach ($results as $row) {
			$transformedRow = [
				'id' => $row['id'],
				'period' => $row['period'],
				'game_type' => $row['game_type'],
				'outcome' => $row['outcome'],
				'color' => $row['color'],
				'big_small' => $row['big_small'],
				'number' => $row['number'],
				'total_players' => $row['total_players'],
				'total_amount' => $row['total_amount'],
				'created_at' => $row['created_at']
			];
			
			// Format for frontend display
			$transformedRow['formatted'] = $this->formatGameHistoryForDisplay($transformedRow);
			$transformedResults[] = $transformedRow;
		}
		
		return $this->respond(200, [
			'data' => $transformedResults,
			'pagination' => [
				'limit' => $limit,
				'offset' => $offset,
				'total' => $totalCount,
				'has_more' => ($offset + $limit) < $totalCount
			]
		]);
	}
	
	private function formatGameHistoryForDisplay($row) {
		$formatted = [
			'period' => $row['period'],
			'number' => null,
			'bs' => null,
			'colors' => []
		];
		
		// Handle different game types
		switch ($row['game_type']) {
			case '1': // Number Game
				$formatted['number'] = "/Gameimg/balls/ball_" . $row['number'] . ".webp";
				$formatted['bs'] = $row['big_small'];
				
				// Parse colors from color field
				if ($row['color']) {
					$colors = explode(',', $row['color']);
					$formatted['colors'] = array_map('strtolower', $colors);
				}
				break;
				
			case '2': // Big/Small Game
				$formatted['number'] = "/Gameimg/balls/ball_" . $row['number'] . ".webp";
				$formatted['bs'] = $row['big_small'];
				
				// Determine colors based on number
				$number = (int)$row['number'];
				if ($number === 0) {
					$formatted['colors'] = ['red', 'violet'];
				} elseif (in_array($number, [1, 3, 9])) {
					$formatted['colors'] = ['green'];
				} elseif (in_array($number, [2, 4, 6, 7, 8])) {
					$formatted['colors'] = ['red'];
				} elseif ($number === 5) {
					$formatted['colors'] = ['green', 'violet'];
				}
				break;
				
			case '3': // Color Game
				$formatted['number'] = "/Gameimg/balls/ball_" . $row['number'] . ".webp";
				$formatted['bs'] = $row['big_small'];
				
				// Parse colors from color field
				if ($row['color']) {
					$colors = explode(',', $row['color']);
					$formatted['colors'] = array_map('strtolower', $colors);
				}
				break;
		}
		
		return $formatted;
	}

	// GET /game/user-history
	// Query params: limit (default 50), offset (default 0)
	public function user_history() {
		// Get authenticated user
		$user = $this->get_auth_user();
		if (!$user) {
			return $this->respond(401, ['error' => 'Unauthorized']);
		}

		$limit = (int)$this->input->get('limit') ?: 50;
		$offset = (int)$this->input->get('offset') ?: 0;
		
		// Get user's game transactions from wallet_transactions
		$this->db->select('*')
				 ->from('wallet_transactions')
				 ->where('user_id', $user['user_id'])
				 ->where_in('description', ['Game1 Win', 'Game1 Loss', 'Game2 Win', 'Game2 Loss', 'Game3 Win', 'Game3 Loss'])
				 ->order_by('created_at', 'DESC');
		
		// Get total count for pagination
		$totalQuery = clone $this->db;
		$totalCount = $totalQuery->count_all_results('', FALSE);
		
		// Apply limit and offset
		$this->db->limit($limit, $offset);
		$results = $this->db->get()->result_array();
		
		// Transform data for frontend
		$transformedResults = [];
		foreach ($results as $row) {
			$transformedRow = [
				'id' => $row['id'],
				'period' => $row['created_at'],
				'type' => $this->extractGameTypeFromDescription($row['description']),
				'amount' => $row['amount'],
				'result' => $this->extractResultFromDescription($row['description']),
				'profit' => $row['transaction_type'] === 'CREDIT' ? $row['amount'] : -$row['amount'],
				'color' => $row['transaction_type'] === 'CREDIT' ? 'success' : 'failed'
			];
			
			$transformedResults[] = $transformedRow;
		}
		
		return $this->respond(200, [
			'data' => $transformedResults,
			'pagination' => [
				'limit' => $limit,
				'offset' => $offset,
				'total' => $totalCount,
				'has_more' => ($offset + $limit) < $totalCount
			]
		]);
	}

	private function get_auth_user() {
		$headers = getallheaders();
		$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
		
		if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
			return null;
		}
		
		$token = $matches[1];
		
		// Load JWT library
		$this->load->library('JWT');
		
		try {
			$decoded = $this->jwt->decode($token, $this->config->item('jwt_key'));
			return (array) $decoded;
		} catch (Exception $e) {
			return null;
		}
	}

	private function extractGameTypeFromDescription($description) {
		if (strpos($description, 'Game1') !== false) {
			return 'Number Game';
		} elseif (strpos($description, 'Game2') !== false) {
			return 'Big/Small Game';
		} elseif (strpos($description, 'Game3') !== false) {
			return 'Color Game';
		}
		return 'Unknown';
	}

	private function extractResultFromDescription($description) {
		if (strpos($description, 'Win') !== false) {
			return 'Succeed';
		} elseif (strpos($description, 'Loss') !== false) {
			return 'Failed';
		}
		return 'Unknown';
	}

	// Queue Management Methods

	// GET /game/active-session
	// Returns the current active session ID for a game type
	public function active_session() {
		$gameType = $this->input->get('game_type');
		
		if (!$gameType) {
			return $this->respond(400, ['error' => 'game_type is required']);
		}

		// Get or create active session for this game type
		$sessionId = $this->getOrCreateActiveSession($gameType);
		
		return $this->respond(200, [
			'session_id' => $sessionId,
			'game_type' => $gameType,
			'status' => 'active'
		]);
	}

	// POST /game/join-queue
	// Body: { "game_type": "1", "bet_data": {...} }
	public function join_queue() {
		$body = $this->readJsonBody();
		
		// Validate required fields
		if (!isset($body['game_type']) || !isset($body['bet_data'])) {
			return $this->respond(400, ['error' => 'game_type and bet_data are required']);
		}

		// Get authenticated user
		$user = $this->get_auth_user();
		if (!$user) {
			return $this->respond(401, ['error' => 'Unauthorized']);
		}

		$gameType = $body['game_type'];
		$betData = $body['bet_data'];
		
		// Get the active session for this game type (don't create new one)
		$sessionId = $this->getActiveSession($gameType);

		// Insert into queue with waiting status
		$queueData = [
			'user_id' => $user['user_id'],
			'game_type' => $gameType,
			'bet_data' => json_encode($betData),
			'queue_status' => 'waiting',
			'session_id' => $sessionId,
			'created_at' => date('Y-m-d H:i:s')
		];

		$this->db->insert('game_queue', $queueData);
		$queueId = $this->db->insert_id();
		
		// Debug: Log the insertion
		error_log("Queue entry inserted: ID=$queueId, User=$user[user_id], GameType=$gameType, Session=$sessionId");

		// Always check if we can process after adding this bet
		$shouldProcess = $this->checkQueueConditions($sessionId, $gameType);
		
		// Additional check: if this is the 2nd+ user, process immediately
		$waitingCount = $this->db->where('game_type', $gameType)
								->where('queue_status', 'waiting')
								->count_all_results('game_queue');
		
		error_log("Current waiting count for game type $gameType: $waitingCount");
		
		if ($waitingCount >= 2) {
			$shouldProcess = true;
			error_log("Triggering processing due to 2+ waiting bets");
		}
		
		if ($shouldProcess) {
			// Process ALL waiting bets for this game type
			$result = $this->processQueue($sessionId, $gameType);
			return $this->respond(200, [
				'message' => 'Bet queued and game processed',
				'queue_id' => $queueId,
				'session_id' => $sessionId,
				'processed' => true,
				'result' => $result
			]);
		} else {
			return $this->respond(200, [
				'message' => 'Bet queued, waiting for more players',
				'queue_id' => $queueId,
				'session_id' => $sessionId,
				'processed' => false
			]);
		}
	}

	// GET /game/queue-status
	// Query params: session_id
	public function queue_status() {
		$sessionId = $this->input->get('session_id');
		
		if (!$sessionId) {
			return $this->respond(400, ['error' => 'session_id is required']);
		}

		// Get queue status
		$queueEntries = $this->db->where('session_id', $sessionId)
								->where('queue_status', 'waiting')
								->get('game_queue')
								->result_array();

		$userCount = count(array_unique(array_column($queueEntries, 'user_id')));
		$totalBets = count($queueEntries);

		return $this->respond(200, [
			'session_id' => $sessionId,
			'status' => 'waiting',
			'user_count' => $userCount,
			'total_bets' => $totalBets,
			'entries' => $queueEntries
		]);
	}

	// GET /game/queue-results
	// Query params: session_id
	public function queue_results() {
		$sessionId = $this->input->get('session_id');
		
		if (!$sessionId) {
			return $this->respond(400, ['error' => 'session_id is required']);
		}

		// Get completed queue entries
		$queueEntries = $this->db->where('session_id', $sessionId)
								->where('queue_status', 'completed')
								->get('game_queue')
								->result_array();

		if (empty($queueEntries)) {
			return $this->respond(200, [
				'message' => 'No results available yet',
				'status' => 'waiting'
			]);
		}

		// Get game result from game_history
		$gameResultId = $queueEntries[0]['game_result_id'];
		$gameResult = $this->db->where('id', $gameResultId)
							  ->get('game_history')
							  ->row_array();

		return $this->respond(200, [
			'session_id' => $sessionId,
			'status' => 'completed',
			'game_result' => $gameResult,
			'participants' => $queueEntries
		]);
	}

	// GET /game/user-result
	// Query params: session_id
	public function user_result() {
		$sessionId = $this->input->get('session_id');
		
		if (!$sessionId) {
			return $this->respond(400, ['error' => 'session_id is required']);
		}

		// Get authenticated user
		$user = $this->get_auth_user();
		if (!$user) {
			return $this->respond(401, ['error' => 'Unauthorized']);
		}

		// Get user's queue entry
		$userQueueEntry = $this->db->where('session_id', $sessionId)
								  ->where('user_id', $user['user_id'])
								  ->where('queue_status', 'completed')
								  ->get('game_queue')
								  ->row_array();

		if (empty($userQueueEntry)) {
			return $this->respond(200, [
				'message' => 'No results available for this user',
				'status' => 'waiting'
			]);
		}

		// Get game result from game_history
		$gameResultId = $userQueueEntry['game_result_id'];
		$gameResult = $this->db->where('id', $gameResultId)
							  ->get('game_history')
							  ->row_array();

		// Get the full game result with winners/losers
		$fullGameResult = $this->getFullGameResult($gameResultId);
		
		// Find user's result in winners or losers
		$userResult = $this->findUserInResults($fullGameResult, $user['user_id']);

		return $this->respond(200, [
			'session_id' => $sessionId,
			'status' => 'completed',
			'game_result' => $gameResult,
			'user_result' => $userResult,
			'full_result' => $fullGameResult
		]);
	}

	// POST /game/process-queue
	// Body: { "session_id": "required", "game_type": "required" }
	public function process_queue() {
		$body = $this->readJsonBody();

		if (!isset($body['session_id']) || !isset($body['game_type'])) {
			return $this->respond(400, ['error' => 'session_id and game_type are required']);
		}

		$sessionId = $body['session_id'];
		$gameType = $body['game_type'];

		$result = $this->processQueue($sessionId, $gameType);

		if ($result['success']) {
			return $this->respond(200, $result);
		} else {
			return $this->respond(400, $result);
		}
	}

	// GET /game/force-process
	// Query params: game_type
	public function force_process() {
		$gameType = $this->input->get('game_type');
		
		if (!$gameType) {
			return $this->respond(400, ['error' => 'game_type is required']);
		}

		// Process all waiting bets for this game type
		$result = $this->processQueue('FORCE', $gameType);

		if ($result['success']) {
			return $this->respond(200, $result);
		} else {
			return $this->respond(400, $result);
		}
	}

	// GET /game/waiting-status
	// Query params: game_type
	public function waiting_status() {
		$gameType = $this->input->get('game_type');
		
		if (!$gameType) {
			return $this->respond(400, ['error' => 'game_type is required']);
		}

		// Get all waiting bets for this game type
		$waitingBets = $this->db->where('game_type', $gameType)
							   ->where('queue_status', 'waiting')
							   ->get('game_queue')
							   ->result_array();

		$userIds = array_unique(array_column($waitingBets, 'user_id'));
		$userCount = count($userIds);

		return $this->respond(200, [
			'game_type' => $gameType,
			'waiting_count' => count($waitingBets),
			'user_count' => $userCount,
			'can_process' => $userCount >= 2,
			'waiting_users' => $userIds,
			'bets' => $waitingBets
		]);
	}

	// POST /game/auto-process
	// Body: { "game_type": "required" }
	public function auto_process() {
		$body = $this->readJsonBody();
		
		if (!isset($body['game_type'])) {
			return $this->respond(400, ['error' => 'game_type is required']);
		}

		$gameType = $body['game_type'];

		// Check if we have enough waiting bets to process
		$waitingBets = $this->db->where('game_type', $gameType)
							   ->where('queue_status', 'waiting')
							   ->get('game_queue')
							   ->result_array();

		$userIds = array_unique(array_column($waitingBets, 'user_id'));
		$userCount = count($userIds);

		if ($userCount < 2) {
			return $this->respond(200, [
				'message' => 'Not enough players to process',
				'waiting_count' => count($waitingBets),
				'user_count' => $userCount,
				'processed' => false
			]);
		}

		// Process the queue
		$result = $this->processQueue('AUTO', $gameType);

		if ($result['success']) {
			return $this->respond(200, [
				'message' => 'Auto processing completed',
				'processed' => true,
				'result' => $result
			]);
		} else {
			return $this->respond(400, [
				'message' => 'Auto processing failed',
				'processed' => false,
				'error' => $result['error']
			]);
		}
	}

	// GET /game/check-and-process
	// Query params: game_type
	public function check_and_process() {
		$gameType = $this->input->get('game_type');
		
		if (!$gameType) {
			return $this->respond(400, ['error' => 'game_type is required']);
		}

		// Get all waiting bets for this game type
		$waitingBets = $this->db->where('game_type', $gameType)
							   ->where('queue_status', 'waiting')
							   ->get('game_queue')
							   ->result_array();

		$userIds = array_unique(array_column($waitingBets, 'user_id'));
		$userCount = count($userIds);

		error_log("Check and process: GameType=$gameType, Waiting=$userCount users");

		if ($userCount >= 2) {
			// Process the queue
			$result = $this->processQueue('CHECK', $gameType);
			
			if ($result['success']) {
				return $this->respond(200, [
					'message' => 'Queue processed successfully',
					'processed' => true,
					'participants' => $result['participants'],
					'game_result_id' => $result['game_result_id']
				]);
			} else {
				return $this->respond(400, [
					'message' => 'Processing failed',
					'processed' => false,
					'error' => $result['error']
				]);
			}
		} else {
			return $this->respond(200, [
				'message' => 'Not enough players to process',
				'waiting_count' => count($waitingBets),
				'user_count' => $userCount,
				'processed' => false
			]);
		}
	}

	// GET /game/timer-result
	// Query params: game_type
	public function timer_result() {
		$gameType = $this->input->get('game_type');
		
		if (!$gameType) {
			return $this->respond(400, ['error' => 'game_type is required']);
		}

		// Get authenticated user
		$user = $this->get_auth_user();
		if (!$user) {
			return $this->respond(401, ['error' => 'Unauthorized']);
		}

		// Get user's completed queue entries for this game type
		$userResults = $this->db->where('game_type', $gameType)
							   ->where('user_id', $user['user_id'])
							   ->where('queue_status', 'completed')
							   ->where('result_displayed', 0)
							   ->order_by('processed_at', 'DESC')
							   ->get('game_queue')
							   ->result_array();

		if (empty($userResults)) {
			return $this->respond(200, [
				'message' => 'No results available',
				'has_result' => false
			]);
		}

		// Get the most recent result
		$latestResult = $userResults[0];
		
		// Parse the JSON data
		$gameResultData = json_decode($latestResult['game_result_data'], true);
		$userResultData = json_decode($latestResult['user_result_data'], true);

		// Mark as displayed
		$this->db->where('id', $latestResult['id'])
				->update('game_queue', ['result_displayed' => 1]);

		return $this->respond(200, [
			'message' => 'Result retrieved successfully',
			'has_result' => true,
			'game_result' => $gameResultData,
			'user_result' => $userResultData,
			'processed_at' => $latestResult['processed_at']
		]);
	}

	// Private helper methods for queue management

	private function generateSessionId() {
		return 'SESSION_' . time() . '_' . rand(1000, 9999);
	}

	private function getOrCreateActiveSession($gameType) {
		// First, try to find an existing active session for this game type
		$existingSession = $this->getActiveSession($gameType);
		if ($existingSession) {
			return $existingSession;
		}

		// If no active session exists, create a new one
		$sessionId = $this->generateSessionId();
		
		// Store the active session (you could use a database table or cache)
		// For now, we'll use a simple approach with a database table
		$this->createActiveSession($gameType, $sessionId);
		
		return $sessionId;
	}

	private function getActiveSession($gameType) {
		// Check if there's an active session for this game type
		// Look for sessions that have waiting bets (not completed)
		$activeSession = $this->db->select('session_id')
								 ->from('game_queue')
								 ->where('game_type', $gameType)
								 ->where_in('queue_status', ['waiting', 'processing'])
								 ->order_by('created_at', 'DESC')
								 ->limit(1)
								 ->get()
								 ->row();

		if ($activeSession) {
			return $activeSession->session_id;
		}

		// If no active session found, create a new one
		return $this->generateSessionId();
	}

	private function createActiveSession($gameType, $sessionId) {
		// This is a simple implementation - in production you might want a dedicated table
		// For now, we'll just return the session ID
		return $sessionId;
	}

	private function getFullGameResult($gameResultId) {
		// Get the stored game result data from the queue entry
		$queueEntry = $this->db->where('game_result_id', $gameResultId)
							  ->where('queue_status', 'completed')
							  ->get('game_queue')
							  ->row_array();
		
		if (!$queueEntry || !$queueEntry['game_result_data']) {
			error_log("No queue entry found for game result ID: $gameResultId");
			return null;
		}
		
		// Return the stored game result data directly
		$fullGameResult = json_decode($queueEntry['game_result_data'], true);
		
		if (!$fullGameResult) {
			error_log("Failed to decode game result data for ID: $gameResultId");
			return null;
		}
		
		
		return $fullGameResult;
	}

	private function findUserInResults($fullGameResult, $userId) {
		// Check if user is in winners
		foreach ($fullGameResult['winners'] as $winner) {
			if (isset($winner['userId']) && $winner['userId'] === $userId) {
				return [
					'status' => 'win',
					'result' => $winner,
					'isWinner' => true
				];
			}
		}

		// Check if user is in losers
		foreach ($fullGameResult['losers'] as $loser) {
			if (isset($loser['userId']) && $loser['userId'] === $userId) {
				return [
					'status' => 'loss',
					'result' => $loser,
					'isWinner' => false
				];
			}
		}

		// User not found in results
		return [
			'status' => 'not_found',
			'result' => null,
			'isWinner' => false
		];
	}

	private function updateUserResultData($gameType, $fullGameResult) {
		// Get all completed queue entries for this game type
		$completedEntries = $this->db->where('game_type', $gameType)
								   ->where('queue_status', 'completed')
								   ->get('game_queue')
								   ->result_array();

		foreach ($completedEntries as $entry) {
			$userId = $entry['user_id'];
			$userResult = $this->findUserInResults($fullGameResult, $userId);
			
			// Update this user's specific result data
			$this->db->where('id', $entry['id'])
					->update('game_queue', [
						'user_result_data' => json_encode($userResult),
						'result_displayed' => 0
					]);
		}
	}

	private function checkQueueConditions($sessionId, $gameType) {
		// Get all waiting bets for this game type (not just this session)
		$queueEntries = $this->db->where('game_type', $gameType)
								->where('queue_status', 'waiting')
								->get('game_queue')
								->result_array();

		if (empty($queueEntries)) {
			return false;
		}

		$userIds = array_unique(array_column($queueEntries, 'user_id'));
		$userCount = count($userIds);

		// Debug logging
		error_log("Queue conditions check: GameType=$gameType, Users=$userCount, Entries=" . count($queueEntries));

		// Simple condition: Need at least 2 different users with waiting status
		if ($userCount >= 2) {
			error_log("Queue processing: Multiple users condition met - processing all waiting bets");
			return true;
		}

		error_log("Queue processing: Only $userCount user(s) waiting, need at least 2");
		return false;
	}

	private function processQueue($sessionId, $gameType) {
		// Get ALL waiting bets for this game type (not just this session)
		$queueEntries = $this->db->where('game_type', $gameType)
								->where('queue_status', 'waiting')
								->get('game_queue')
								->result_array();

		if (empty($queueEntries)) {
			return ['success' => false, 'error' => 'No waiting bets found'];
		}

		// Mark ALL waiting bets as processing
		$this->db->where('game_type', $gameType)
				->where('queue_status', 'waiting')
				->update('game_queue', ['queue_status' => 'processing']);

		// Combine bets for API call
		$combinedBets = $this->combineBetsForAPI($queueEntries);

		// Call appropriate game API
		$apiResult = $this->callGameAPI($gameType, $combinedBets);

		if ($apiResult['success']) {
			// Get the full game result data
			$fullGameResult = $apiResult['result'];
			
			// Update ALL processing entries with results
			$this->db->where('game_type', $gameType)
					->where('queue_status', 'processing')
					->update('game_queue', [
						'queue_status' => 'completed',
						'processed_at' => date('Y-m-d H:i:s'),
						'game_result_id' => $apiResult['game_result_id'],
						'game_result_data' => json_encode($fullGameResult)
					]);
			
			// Now update each user's specific result data
			$this->updateUserResultData($gameType, $fullGameResult);

			return [
				'success' => true,
				'message' => 'Queue processed successfully',
				'game_result_id' => $apiResult['game_result_id'],
				'participants' => count($queueEntries)
			];
		} else {
			// Mark as failed
			$this->db->where('game_type', $gameType)
					->where('queue_status', 'processing')
					->update('game_queue', ['queue_status' => 'cancelled']);

			return [
				'success' => false,
				'error' => 'Failed to process queue: ' . $apiResult['error']
			];
		}
	}

	private function combineBetsForAPI($queueEntries) {
		$players = [];
		
		foreach ($queueEntries as $entry) {
			$betData = json_decode($entry['bet_data'], true);
			$players[] = [
				'userId' => $entry['user_id'],
				'bets' => $betData
			];
		}

		return ['players' => $players];
	}

	private function callGameAPI($gameType, $combinedBets) {
		// Call your existing game API based on game type
		try {
			$result = null;
			
			switch ($gameType) {
				case '1':
					$result = $this->playGame1Internal($combinedBets);
					break;
				case '2':
					$result = $this->playGame2Internal($combinedBets);
					break;
				case '3':
					$result = $this->playGame3Internal($combinedBets);
					break;
				default:
					throw new Exception('Invalid game type');
			}
			
			return [
				'success' => true,
				'game_result_id' => $result['historyId'],
				'result' => $result
			];
		} catch (Exception $e) {
			return [
				'success' => false,
				'error' => $e->getMessage()
			];
		}
	}

	private function playGame1Internal($combinedBets) {
		// Call your existing game1 logic
		$players = $combinedBets['players'];
		
		// Validate players and bet types
		if (!$this->validateGame1Players($players)) {
			throw new Exception('Invalid game setup. Need minimum 2 players or 1 player with multiple bet types');
		}
		
		// Analyze all bets using 30%/70% rule
		$bettingAnalysis = $this->analyzeGame1Bets($players);
		
		// Generate favorable number based on analysis
		$generatedNumber = $this->generateFavorableNumber($bettingAnalysis);
		
		// Determine all outcomes for the number
		$outcomes = $this->determineGame1Outcomes($generatedNumber);
		
		// Process winners and losers
		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			$playerResult = $this->calculateGame1PlayerResult($p, $outcomes);
			$totalBetAmount = $this->calculateTotalBetAmount($p['bets']);
			
			
			// Calculate net result (winnings - total bets)
			$netResult = $playerResult['totalWinnings'] - $totalBetAmount;
			
			if ($netResult > 0) {
				// Player made profit - credit the net amount
				$winningsAfterDeduction = $playerResult['totalWinnings'] * 0.98; // 2% deduction
				$walletResult = $this->updateWallet($p['userId'], $winningsAfterDeduction, 'CREDIT', 'Game1 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['netProfit'] = $winningsAfterDeduction - $totalBetAmount;
				$p['totalWinnings'] = $winningsAfterDeduction;
				$p['originalWinnings'] = $playerResult['totalWinnings'];
				$p['deductionAmount'] = $playerResult['totalWinnings'] - $winningsAfterDeduction;
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = $walletResult;
				
				$winners[] = $p;
			} else if ($netResult < 0) {
				// Player lost - deduct the bet amount
				$walletResult = $this->updateWallet($p['userId'], $totalBetAmount, 'DEBIT', 'Game1 Loss');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['netLoss'] = abs($netResult);
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = $walletResult;
				
				$losers[] = $p;
			} else {
				// Break even - no wallet update needed
				$p['walletUpdated'] = true;
				$p['transactionId'] = null;
				$p['netResult'] = 0;
				$p['totalWinnings'] = $playerResult['totalWinnings'];
				$p['totalBets'] = $totalBetAmount;
				$p['winningBets'] = $playerResult['winningBets'];
				$p['walletDebug'] = ['success' => true, 'message' => 'Break even - no wallet update'];
				
				$winners[] = $p;
			}
		}
		
		// Save game history
		$historyId = $this->saveGameHistory('1', (string)$generatedNumber, implode(',', $outcomes['colors']), $outcomes['bigSmall'], $generatedNumber, $players);
		
		return [
			'generatedNumber' => $generatedNumber,
			'outcomes' => $outcomes,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		];
	}

	private function playGame2Internal($combinedBets) {
		// Call your existing game2 logic
		$players = $combinedBets['players'];
		if (count($players) < 2) {
			throw new Exception('At least 2 players required');
		}

		$totalBig = 0.0;
		$totalSmall = 0.0;
		foreach ($players as $p) {
			if (!isset($p['bets']['bigSmall'])) continue;
			$side = strtoupper(trim($p['bets']['bigSmall']['value']));
			$amt = (float) $p['bets']['bigSmall']['amount'];
			if ($amt < 0) continue;
			if ($side === 'BIG') { $totalBig += $amt; }
			elseif ($side === 'SMALL') { $totalSmall += $amt; }
		}

		// Decide range based on which side has lower total amount
		if ($totalBig === $totalSmall) {
			$generated = rand(0, 9);
		} elseif ($totalSmall < $totalBig) {
			$generated = rand(0, 4); // Favor SMALL when it has less total
		} else {
			$generated = rand(5, 9); // Favor BIG when it has less total
		}

		$winningSide = ($generated >= 5) ? 'BIG' : 'SMALL';

		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			if (isset($p['bets']['bigSmall']) && strtoupper(trim($p['bets']['bigSmall']['value'])) === $winningSide) {
				$betAmount = (float) $p['bets']['bigSmall']['amount'];
				$winningAmount = ($betAmount * 2) * 0.98; // 2X with 2% deduction
				$p['winningAmount'] = round($winningAmount, 2);
				
				// Update wallet for winner
				$walletResult = $this->updateWallet($p['userId'], $winningAmount, 'CREDIT', 'Game2 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult;
				
				$winners[] = $p;
			} else {
				// Losers - deduct their bet amount
				$betAmount = (float) $p['bets']['bigSmall']['amount'];
				$walletResult = $this->updateWallet($p['userId'], $betAmount, 'DEBIT', 'Game2 Loss');
				$p['betAmount'] = $betAmount;
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult;
				
				$losers[] = $p;
			}
		}

		// Save game history
		$historyId = $this->saveGameHistory('2', $winningSide, null, $winningSide, null, $players);

		return [
			'generatedNumber' => $generated,
			'winningSide' => $winningSide,
			'totalBig' => $totalBig,
			'totalSmall' => $totalSmall,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		];
	}

	private function playGame3Internal($combinedBets) {
		// Call your existing game3 logic
		$players = $combinedBets['players'];
		if (count($players) < 2) {
			throw new Exception('At least 2 players required');
		}

		$totalGreen = 0.0;
		$totalViolet = 0.0;
		$totalRed = 0.0;
		
		foreach ($players as $p) {
			if (!isset($p['bets']['color'])) continue;
			$color = strtoupper(trim($p['bets']['color']['value']));
			$amt = (float) $p['bets']['color']['amount'];
			if ($amt < 0) continue;
			if ($color === 'GREEN') { $totalGreen += $amt; }
			elseif ($color === 'VIOLET') { $totalViolet += $amt; }
			elseif ($color === 'RED') { $totalRed += $amt; }
		}

		// Get only colors that were actually chosen by players
		$chosenColors = [];
		foreach ($players as $p) {
			if (isset($p['bets']['color'])) {
				$color = strtoupper(trim($p['bets']['color']['value']));
				if (!in_array($color, $chosenColors)) {
					$chosenColors[] = $color;
				}
			}
		}
		
		// Calculate totals only for chosen colors
		$totals = [];
		foreach ($chosenColors as $color) {
			if ($color === 'GREEN') $totals['GREEN'] = $totalGreen;
			elseif ($color === 'VIOLET') $totals['VIOLET'] = $totalViolet;
			elseif ($color === 'RED') $totals['RED'] = $totalRed;
		}
		
		// Find minimum total among chosen colors only
		$minTotal = min($totals);
		$favoredColors = [];
		
		foreach ($totals as $color => $total) {
			if ($total === $minTotal) {
				$favoredColors[] = $color;
			}
		}
		
		// Pick randomly from favored colors (guaranteed to be chosen colors)
		$generated = $favoredColors[array_rand($favoredColors)];

		$winners = [];
		$losers = [];
		
		foreach ($players as $p) {
			if (isset($p['bets']['color']) && strtoupper(trim($p['bets']['color']['value'])) === $generated) {
				$betAmount = (float) $p['bets']['color']['amount'];
				$winningAmount = ($betAmount * 2) * 0.98; // 2X with 2% deduction
				$p['winningAmount'] = round($winningAmount, 2);
				
				// Update wallet for winner
				$walletResult = $this->updateWallet($p['userId'], $winningAmount, 'CREDIT', 'Game3 Win');
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult;
				
				$winners[] = $p;
			} else {
				// Losers - deduct their bet amount
				$betAmount = (float) $p['bets']['color']['amount'];
				$walletResult = $this->updateWallet($p['userId'], $betAmount, 'DEBIT', 'Game3 Loss');
				$p['betAmount'] = $betAmount;
				$p['walletUpdated'] = isset($walletResult['success']) ? $walletResult['success'] : false;
				$p['transactionId'] = isset($walletResult['transaction_id']) ? $walletResult['transaction_id'] : null;
				$p['walletDebug'] = $walletResult;
				
				$losers[] = $p;
			}
		}

		// Save game history
		$historyId = $this->saveGameHistory('3', $generated, $generated, null, null, $players);

		return [
			'generatedColor' => $generated,
			'totalGreen' => $totalGreen,
			'totalViolet' => $totalViolet,
			'totalRed' => $totalRed,
			'favoredColors' => $favoredColors,
			'winners' => $winners,
			'losers' => $losers,
			'historyId' => $historyId
		];
	}
}


